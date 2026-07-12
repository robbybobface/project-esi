

export type RGB = readonly [number, number, number];

export interface ShaderVariant {

  id: string;

  label: string;

  description: string;

  swatch: string;

  hero: {
    base: RGB;

    warm: RGB;

    mid: RGB;

    cool: RGB;

    cursor: RGB;

    rgScale: RGB;

    brightness: number;
  };

  // Optional lower-luminance hero palette for dark mode (same hue family)
  heroDark?: {
    base: RGB;
    warm: RGB;
    mid: RGB;
    cool: RGB;
    cursor: RGB;
    rgScale: RGB;
    brightness: number;
  };

  wave: readonly [RGB, RGB, RGB, RGB, RGB];
}

const rgb = (r: number, g: number, b: number): RGB => [r, g, b];

export const SHADER_VARIANTS: readonly ShaderVariant[] = [
  {

    id: "warm",
    label: "Warm",
    description: "Coral, peach, golden",
    swatch: "#ff945e",
    hero: {

      base: rgb(0.10, 0.00, 0.00),
      warm: rgb(0.90, 0.10, 0.10),
      mid: rgb(0.60, 0.50, 0.10),
      cool: rgb(0.10, 0.35, 0.45),
      cursor: rgb(0.18, 0.06, 0.02),

      rgScale: rgb(0.825, 0.825, 1.0),
      brightness: 2.5,
    },
    wave: [
      rgb(1.00, 0.32, 0.42), 
      rgb(1.00, 0.58, 0.38), 
      rgb(1.00, 0.82, 0.38), 
      rgb(0.70, 0.62, 1.00), 
      rgb(0.45, 0.72, 1.00), 
    ],
  },
  {

    id: "mono",
    label: "Mono",
    description: "Charcoal to silver, no hue",
    swatch: "#8a8a8a",
    hero: {
      base: rgb(0.02, 0.02, 0.03),

      warm: rgb(0.38, 0.38, 0.42),
      mid: rgb(0.18, 0.18, 0.22),
      cool: rgb(0.55, 0.55, 0.60),
      cursor: rgb(0.06, 0.06, 0.08),
      rgScale: rgb(1.0, 1.0, 1.0),

      brightness: 1.5,
    },
    wave: [

      rgb(0.06, 0.06, 0.08), 
      rgb(0.20, 0.20, 0.24), 
      rgb(0.38, 0.38, 0.42), 
      rgb(0.58, 0.58, 0.62), 
      rgb(0.76, 0.76, 0.80), 
    ],
  },
  {

    id: "twilight",
    label: "Twilight",
    description: "Cyan, magenta, and violet",
    swatch: "#7d4dff",
    hero: {
      base: rgb(0.02, 0.02, 0.10),

      warm: rgb(0.10, 0.85, 0.80),

      mid: rgb(0.85, 0.20, 0.65),

      cool: rgb(0.35, 0.20, 0.75),

      cursor: rgb(0.16, 0.04, 0.14),
      rgScale: rgb(1.0, 1.0, 1.0),
      brightness: 1.9,
    },
    wave: [

      rgb(0.20, 0.85, 0.85), 
      rgb(0.45, 0.95, 0.70), 
      rgb(0.95, 0.40, 0.80), 
      rgb(0.65, 0.30, 0.95), 
      rgb(0.30, 0.45, 0.95), 
    ],
  },
  {

    id: "coffee",
    label: "Coffee",
    description: "Espresso, caramel, milk",
    swatch: "#7a4a22",
    hero: {

      base: rgb(0.025, 0.015, 0.005),

      warm: rgb(0.15, 0.085, 0.04),

      mid: rgb(0.22, 0.13, 0.06),

      cool: rgb(0.27, 0.18, 0.10),
      cursor: rgb(0.08, 0.04, 0.015),
      rgScale: rgb(1.0, 1.0, 1.0),

      brightness: 2.5,
    },
    wave: [

      rgb(0.165, 0.078, 0.031), 
      rgb(0.290, 0.157, 0.094), 
      rgb(0.431, 0.247, 0.118), 
      rgb(0.541, 0.333, 0.188), 
      rgb(0.659, 0.416, 0.243), 
    ],
  },
  {

    id: "royal",
    label: "Royal",
    description: "Royal blue, petrol, and teal",
    swatch: "#2960e0",
    hero: {

      base: rgb(0.005, 0.012, 0.030),

      warm: rgb(0.064, 0.152, 0.352),

      mid: rgb(0.040, 0.220, 0.248),

      cool: rgb(0.024, 0.140, 0.116),
      cursor: rgb(0.008, 0.028, 0.045),
      rgScale: rgb(1.0, 1.0, 1.0),
      brightness: 2.5,
    },
    wave: [

      rgb(0.040, 0.080, 0.220), 
      rgb(0.140, 0.300, 0.620), 
      rgb(0.080, 0.480, 0.620), 
      rgb(0.060, 0.500, 0.420), 
      rgb(0.080, 0.420, 0.300), 
    ],
  },
  {
    id: "ocean",
    label: "Ocean",
    description: "Ink, teal, and sea mist",
    swatch: "#598392",
    hero: {
      base: rgb(0.004, 0.086, 0.118),
      warm: rgb(0.055, 0.220, 0.300),
      mid: rgb(0.080, 0.320, 0.380),
      cool: rgb(0.030, 0.140, 0.160),
      cursor: rgb(0.004, 0.055, 0.080),
      rgScale: rgb(1.0, 1.0, 1.0),
      brightness: 2.5,
    },
    wave: [
      rgb(0.020, 0.100, 0.140),
      rgb(0.070, 0.270, 0.350),
      rgb(0.150, 0.420, 0.520),
      rgb(0.200, 0.520, 0.550),
      rgb(0.280, 0.580, 0.520),
    ],
  },
  {
    id: "earth",
    label: "Earth",
    description: "Sage, slate, and stone",
    swatch: "#84a98c",
    hero: {
      base: rgb(0.120, 0.160, 0.180),
      warm: rgb(0.200, 0.350, 0.320),
      mid: rgb(0.250, 0.420, 0.360),
      cool: rgb(0.100, 0.200, 0.220),
      cursor: rgb(0.060, 0.100, 0.120),
      rgScale: rgb(1.0, 1.0, 1.0),
      brightness: 2.5,
    },
    wave: [
      rgb(0.120, 0.160, 0.180),
      rgb(0.180, 0.300, 0.280),
      rgb(0.280, 0.450, 0.400),
      rgb(0.420, 0.580, 0.490),
      rgb(0.520, 0.680, 0.580),
    ],
  },
  {
    id: "sunshine",
    label: "Sunshine",
    description: "Gold, sky blue, and Baltic",
    swatch: "#ffd200",
    hero: {
      base: rgb(0.000, 0.100, 0.180),
      warm: rgb(0.520, 0.400, 0.000),
      mid: rgb(0.100, 0.380, 0.480),
      cool: rgb(0.000, 0.220, 0.380),
      cursor: rgb(0.040, 0.060, 0.100),
      rgScale: rgb(1.0, 1.0, 1.0),
      brightness: 2.5,
    },
    // Dark: gate navy field + the same yellow/cyan the vision WaveShader
    // ribbons use (wave[3]/wave[1]). Peak mixes keep them as distinct notes.
    // Wisps are a touch dimmer than the vision ribbons so they sit in the field.
    heroDark: {
      base: rgb(0.022, 0.090, 0.165),
      warm: rgb(1.000, 0.940, 0.280),
      mid: rgb(0.110, 0.400, 0.580),
      cool: rgb(0.012, 0.055, 0.110),
      cursor: rgb(0.100, 0.280, 0.400),
      rgScale: rgb(0.95, 0.98, 1.12),
      brightness: 1.32,
    },
    wave: [
      rgb(0.000, 0.280, 0.450),
      rgb(0.150, 0.500, 0.700),
      rgb(0.400, 0.720, 0.920),
      rgb(0.950, 0.780, 0.080),
      rgb(1.000, 0.880, 0.280),
    ],
  },
  {
    id: "lemonade",
    label: "Lemonade",
    description: "Citrus gold, wheat, and sage",
    swatch: "#fbcf3b",
    hero: {
      base: rgb(0.140, 0.200, 0.160),
      warm: rgb(0.380, 0.300, 0.060),
      mid: rgb(0.420, 0.360, 0.200),
      cool: rgb(0.180, 0.280, 0.220),
      cursor: rgb(0.080, 0.120, 0.100),
      rgScale: rgb(1.0, 1.0, 1.0),
      brightness: 2.5,
    },
    wave: [
      rgb(0.220, 0.320, 0.260),
      rgb(0.420, 0.550, 0.420),
      rgb(0.720, 0.580, 0.150),
      rgb(0.920, 0.780, 0.280),
      rgb(0.880, 0.720, 0.420),
    ],
  },
] as const;

const VARIANT_MAP: Map<string, ShaderVariant> = new Map(
  SHADER_VARIANTS.map((v) => [v.id, v]),
);

export function getVariantById(id: string | undefined): ShaderVariant {
  if (id && VARIANT_MAP.has(id)) return VARIANT_MAP.get(id)!;
  return SHADER_VARIANTS[0]!;
}

// Shader palette color → CSS rgb() string
export function rgbToCss([r, g, b]: RGB): string {
  return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
}

// The variant's five wave colors as CSS strings
export function waveStopsCss(variant: ShaderVariant): string[] {
  return variant.wave.map(rgbToCss);
}

// Text-accent gradient built from the wave palette, mirrored so a sweeping
// background-position animation loops seamlessly
export function waveAccentGradient(variant: ShaderVariant): string {
  const stops = waveStopsCss(variant);
  return `linear-gradient(100deg, ${[...stops, ...[...stops].reverse()].join(", ")})`;
}

// Active hero palette for the current color scheme (dark uses heroDark when set)
export function resolveHeroPalette(
  variant: ShaderVariant,
  isDark: boolean,
): ShaderVariant["hero"] {
  if (isDark && variant.heroDark) return variant.heroDark;
  return variant.hero;
}

// CSS color for the placeholder shown behind the hero/CTA shader before
// WebGL paints its first frame. The rendered gradient is a bright blend of
// the palette's warm/mid/cool colors over the base, so approximate that
// blend rather than using the (much darker) base color alone.
export function heroPlaceholderColor(
  variant: ShaderVariant,
  isDark = false,
): string {
  const { base, warm, mid, cool } = resolveHeroPalette(variant, isDark);
  // Dark mode: less lift so the pre-WebGL frame stays atmospheric
  const lift = isDark ? 1.08 : 1.3;
  const channel = (i: number): number => {
    const blended = base[i]! + 0.5 * (warm[i]! + mid[i]! + cool[i]!);
    return Math.round(Math.min(blended * lift, 1) * 255);
  };
  return `rgb(${channel(0)}, ${channel(1)}, ${channel(2)})`;
}

export type ShaderVariantId = (typeof SHADER_VARIANTS)[number]["id"];
