import type { ShaderVariantId } from "@/lib/shader-variants";

export const features = {
  smoothScroll: true,
} as const;

export const SHADER_VARIANT_DEFAULT: ShaderVariantId = "sunshine";

/** Password gate on unless PASSWORD_PROTECTED is explicitly "false" (or "0"). */
export function isPasswordProtected(): boolean {
  const raw = process.env.PASSWORD_PROTECTED?.trim().toLowerCase();
  if (raw === "false" || raw === "0") return false;
  return true;
}
