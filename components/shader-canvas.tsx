"use client";

import { useShaderVariant } from "@/components/shader-variant-context";
import { useIsDark } from "@/lib/color-scheme";
import { resolveHeroPalette } from "@/lib/shader-variants";
import { Renderer, Program, Mesh, Triangle } from "ogl";
import { useEffect, useRef, type ReactNode } from "react";

const VERT = `
attribute vec2 position;
varying vec2 v;
void main(){
  v = position;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;
varying vec2 v;
uniform float t;
uniform vec2 r;
uniform vec2 c;
uniform float ci;

uniform vec3 u_pal_base;
uniform vec3 u_pal_warm;
uniform vec3 u_pal_mid;
uniform vec3 u_pal_cool;
uniform vec3 u_pal_cursor;
uniform vec3 u_pal_rgScale;
uniform float u_brightness;
uniform float u_accent;
uniform float u_peak;
uniform float u_cursorGain;
// 1 on phone/coarse-pointer only — desktop + desktop portrait stay on the matte path
uniform float u_mobile;

float hash(vec2 p){
  // Avoid fract(x*y) — that hash draws diagonal seams on mobile GPUs
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

float n(vec2 u){
  vec2 i = floor(u);
  vec2 f = fract(u);
  f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float m(vec2 u){
  // Soft matte fbm — same cloudy look that reads well on desktop
  return (n(u) * 0.5 + n(u * 2.0) * 0.25 + n(u * 4.0) * 0.125) * 0.914;
}

// Phone-only: blur the noise field so value-noise cell edges don't posterize
float mMobile(vec2 u){
  float e = 0.045;
  float s = m(u);
  s += m(u + vec2( e,  0.0));
  s += m(u + vec2(-e,  0.0));
  s += m(u + vec2( 0.0,  e));
  s += m(u + vec2( 0.0, -e));
  s += m(u + vec2( e,  e)) * 0.5;
  s += m(u + vec2(-e,  e)) * 0.5;
  s += m(u + vec2( e, -e)) * 0.5;
  s += m(u + vec2(-e, -e)) * 0.5;
  return s / 7.0;
}

void main(){
  float scale = min(r.x, r.y);
  vec2 uv = (v * 0.5 + 0.5) * r / scale;

  vec2 cn = c / scale;
  vec2 toC = uv - cn;
  float dC = length(toC);
  float fall = exp(-dC * 9.0) * ci;

  vec2 sh = vec2(
    n(uv * 5.5 + vec2(t * 0.9, 0.0)),
    n(uv * 5.5 + vec2(0.0, t * 1.1))
  ) - 0.5;
  vec2 disp = sh * fall * 0.55;

  // Matte path: no rot45 (that made the diamond grid). Mobile uses a slightly
  // higher frequency so residual cells are finer before the blur hides them.
  float freq = mix(4.2, 5.6, u_mobile);
  uv = uv * freq + disp * freq;

  vec2 d1 = vec2( 0.18,  0.07) * t;
  vec2 d2 = vec2(-0.13,  0.21) * t;
  vec2 d3 = vec2( 0.09, -0.16) * t;

  float a = mix(m(uv + d1), mMobile(uv + d1), u_mobile);
  float b = mix(m(uv + a * 2.0 + d2), mMobile(uv + a * 2.0 + d2), u_mobile);
  float dd = mix(m(uv + b * 2.8 + d3), mMobile(uv + b * 2.8 + d3), u_mobile);

  vec3 col;
  if (u_peak > 1.05) {
    // Dark-only: peak gates + screen-blend (must not run in light mode)
    // Warm peak softer than before — steep gate had wiped yellow entirely
    float peakW = mix(u_peak * 1.2, u_peak * 1.1, u_mobile);
    float peakM = mix(u_peak * 0.95, max(u_peak * 0.85, 1.0), u_mobile);
    float warmRaw = pow(clamp(a, 0.0, 1.0), max(peakW, 1.0));
    float warmAmt = smoothstep(0.12, 0.55, warmRaw) * 1.15 * u_accent;
    warmAmt = clamp(warmAmt, 0.0, 1.0);

    float midAmt = pow(clamp(b, 0.0, 1.0), max(peakM, 1.0)) * 1.25 * u_accent;
    // Cyan yields where gold is strong (avoids olive mud), but not to zero
    midAmt *= 1.0 - 0.75 * smoothstep(0.15, 0.7, warmAmt);
    midAmt = clamp(midAmt, 0.0, 1.0);

    float coolAmt = pow(clamp(dd, 0.0, 1.0), max(u_peak * 0.75, 1.0)) * u_accent;
    coolAmt = clamp(coolAmt, 0.0, 1.0);

    // Gate navy field + screen-blend cyan wisps, then gold
    col = u_pal_base;
    col = mix(col, u_pal_cool, coolAmt * 0.7);
    vec3 wisp = u_pal_mid * midAmt;
    col = 1.0 - (1.0 - col) * (1.0 - wisp);
    vec3 gold = u_pal_warm * warmAmt;
    col = 1.0 - (1.0 - col) * (1.0 - gold);
  } else {
    // Light: original soft matte mixes (unchanged look)
    float warmAmt = clamp(a * 1.85 * u_accent, 0.0, 1.0);
    float midAmt = clamp(b * 1.35 * u_accent, 0.0, 1.0);
    float coolAmt = clamp(dd * u_accent, 0.0, 1.0);
    col = mix(u_pal_base, u_pal_warm, warmAmt);
    col = mix(col, u_pal_mid, midAmt);
    col = mix(col, u_pal_cool, coolAmt);
  }

  col += u_pal_cursor * fall * u_accent * u_cursorGain;

  col *= u_pal_rgScale;
  gl_FragColor = vec4(col * u_brightness, 1.0);
}
`;

interface Props {
  className?: string;
}

const DPR_CAP = 1.5;

export function ShaderCanvas({ className }: Props): ReactNode {
  const hostRef = useRef<HTMLDivElement>(null);
  const { variant } = useShaderVariant();
  const isDark = useIsDark();

  const variantRef = useRef(variant);
  useEffect(() => {
    variantRef.current = variant;
  }, [variant]);

  const isDarkRef = useRef(isDark);
  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  const uniformsRef = useRef<Record<string, { value: unknown }> | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new Renderer({
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: false,
      powerPreference: "high-performance",
      dpr: 1,
    });
    const gl = renderer.gl;

    const canvas = gl.canvas;
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    host.appendChild(canvas);

    const geometry = new Triangle(gl);

    const v0 = variantRef.current;
    const h0 = resolveHeroPalette(v0, isDarkRef.current);
    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      depthTest: false,
      depthWrite: false,
      cullFace: false,
      uniforms: {
        t: { value: 0 },
        r: { value: [1, 1] },
        c: { value: [0, 0] },
        ci: { value: 0 },
        u_pal_base: { value: [...h0.base] },
        u_pal_warm: { value: [...h0.warm] },
        u_pal_mid: { value: [...h0.mid] },
        u_pal_cool: { value: [...h0.cool] },
        u_pal_cursor: { value: [...h0.cursor] },
        u_pal_rgScale: { value: [...h0.rgScale] },
        u_brightness: { value: h0.brightness },
        u_accent: { value: 1.0 },
        u_peak: { value: isDarkRef.current ? 2.45 : 1.0 },
        u_cursorGain: { value: isDarkRef.current ? 0.4 : 1.0 },
        // Phones only (coarse pointer) — not desktop portrait width
        u_mobile: {
          value:
            typeof window !== "undefined" &&
            window.matchMedia("(hover: none) and (pointer: coarse)").matches
              ? 1.0
              : 0.0,
        },
      },
    });
    uniformsRef.current = program.uniforms as Record<
      string,
      { value: unknown }
    >;
    const mesh = new Mesh(gl, { geometry, program });

    const dpr = Math.min(
      typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
      DPR_CAP,
    );
    renderer.dpr = dpr;

    let resizePending = 0;
    let lastW = 0;
    let lastH = 0;
    let currentDpr = 0;
    // During continuous resizes (hero entrance) drop DPR slightly — but never
    // far on narrow viewports: mobile chrome resizes + half-res = vertical banding
    const narrow =
      typeof window !== "undefined" && window.matchMedia("(max-width: 850px)").matches;
    const MOTION_DPR = narrow ? dpr : Math.min(dpr, 0.65);
    const SETTLE_MS = narrow ? 280 : 150;
    let lastResizeEvent = 0;
    let settleTimer: ReturnType<typeof setTimeout> | undefined;

    const applySize = (targetDpr: number) => {
      const rect = host.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      if (w === lastW && h === lastH && targetDpr === currentDpr) return;
      lastW = w;
      lastH = h;
      currentDpr = targetDpr;
      renderer.dpr = targetDpr;
      renderer.setSize(w, h);
      program.uniforms.r.value[0] = gl.canvas.width;
      program.uniforms.r.value[1] = gl.canvas.height;
      renderer.render({ scene: mesh });
    };

    const resize = () => {
      const now = performance.now();
      const rect = host.getBoundingClientRect();
      const w = Math.max(1, Math.round(rect.width));
      const h = Math.max(1, Math.round(rect.height));
      // Tiny chrome UI shifts (URL bar) shouldn't trigger the low-res path
      const bigJump =
        lastW > 0 &&
        (Math.abs(w - lastW) / lastW > 0.04 || Math.abs(h - lastH) / lastH > 0.04);
      const rapid = bigJump && now - lastResizeEvent < SETTLE_MS;
      lastResizeEvent = now;
      clearTimeout(settleTimer);
      settleTimer = setTimeout(() => applySize(dpr), SETTLE_MS);
      applySize(rapid ? MOTION_DPR : dpr);
    };
    const queueResize = () => {
      if (resizePending) return;
      resizePending = requestAnimationFrame(() => {
        resizePending = 0;
        resize();
      });
    };
    applySize(dpr);

    const ro = new ResizeObserver(queueResize);
    ro.observe(host);

    const target: [number, number] = [0, 0];
    const current: [number, number] = [0, 0];
    let targetCi = 0;
    let currentCi = 0;
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        targetCi = 0;
        return;
      }
      const x = (e.clientX - rect.left) * (gl.canvas.width / rect.width);
      const yTop = (e.clientY - rect.top) * (gl.canvas.height / rect.height);
      target[0] = x;
      target[1] = gl.canvas.height - yTop;
      targetCi = 1;
    };
    const onLeave = () => {
      targetCi = 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("blur", onLeave);

    let visible = true;
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible && !raf && !reduceMotion) {
          last = performance.now();
          loop();
        }
      },
      { threshold: 0 },
    );
    io.observe(host);

    let raf = 0;
    const start = performance.now();
    let last = start;
    const FRAME_MS = 1000 / 60;

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible) {
        cancelAnimationFrame(raf);
        raf = 0;
        return;
      }
      const now = performance.now();
      const dt = now - last;
      if (dt < FRAME_MS - 1) return;
      last = now - (dt % FRAME_MS);

      const k = 1 - Math.pow(1 - 0.12, dt / FRAME_MS);
      current[0] += (target[0] - current[0]) * k;
      current[1] += (target[1] - current[1]) * k;

      const ki = 1 - Math.pow(1 - 0.06, dt / FRAME_MS);
      currentCi += (targetCi - currentCi) * ki;

      program.uniforms.t.value = (now - start) * 0.001;
      program.uniforms.c.value[0] = current[0];
      program.uniforms.c.value[1] = current[1];
      program.uniforms.ci.value = currentCi;
      renderer.render({ scene: mesh });
    };

    if (reduceMotion) {
      program.uniforms.t.value = 0;
      renderer.render({ scene: mesh });
    } else {
      loop();
    }

    const onVis = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
      } else if (visible && !raf && !reduceMotion) {
        last = performance.now();
        loop();
      }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(resizePending);
      clearTimeout(settleTimer);
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      document.removeEventListener("visibilitychange", onVis);
      io.disconnect();
      canvas.remove();
      const ext = gl.getExtension("WEBGL_lose_context");
      ext?.loseContext();
    };
  }, []);

  useEffect(() => {
    const u = uniformsRef.current;
    if (!u) return;
    const h = resolveHeroPalette(variant, isDark);

    (u.u_pal_base!.value as number[]).splice(0, 3, ...h.base);
    (u.u_pal_warm!.value as number[]).splice(0, 3, ...h.warm);
    (u.u_pal_mid!.value as number[]).splice(0, 3, ...h.mid);
    (u.u_pal_cool!.value as number[]).splice(0, 3, ...h.cool);
    (u.u_pal_cursor!.value as number[]).splice(0, 3, ...h.cursor);
    (u.u_pal_rgScale!.value as number[]).splice(0, 3, ...h.rgScale);
    u.u_brightness!.value = h.brightness;
    u.u_accent!.value = 1.0;
    // Optional: HMR can leave an older Program without newly-added uniforms
    if (u.u_peak) u.u_peak.value = isDark ? 2.45 : 1.0;
    if (u.u_cursorGain) u.u_cursorGain.value = isDark ? 0.4 : 1.0;
  }, [variant, isDark]);

  return (
    <div
      ref={hostRef}
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    />
  );
}
