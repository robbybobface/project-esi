// Gate → home handoff flag. sessionStorage survives the hard navigation;
// the in-memory latch survives React Strict Mode's double mount on the
// destination page (which would otherwise clear storage on the first pass
// and miss the flag on the second).

export const FROM_GATE_KEY = "esi:from-gate";

let seenThisPage = false;

export function markFromGate(): void {
  seenThisPage = true;
  try {
    sessionStorage.setItem(FROM_GATE_KEY, "1");
  } catch {
    // private mode — in-memory flag is enough until navigation
  }
}

export function consumeFromGate(): boolean {
  // Already observed on this page (Strict Mode remount)
  if (seenThisPage) return true;

  try {
    if (sessionStorage.getItem(FROM_GATE_KEY) === "1") {
      sessionStorage.removeItem(FROM_GATE_KEY);
      seenThisPage = true;
      return true;
    }
  } catch {
    // ignore
  }

  return false;
}
