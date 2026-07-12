"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface IntroContextValue {
  // True once the preloader has finished (or the failsafe fired)
  ready: boolean;
  completeIntro: () => void;
  // Preloader calls this on mount so a soft gate→home refresh re-arms the wait
  resetIntro: () => void;
}

const IntroContext = createContext<IntroContextValue | null>(null);

// Absolute ceiling so the hero never sits forever as the tiny center pill
const INTRO_FAILSAFE_MS = 7000;

export function IntroProvider({ children }: { children: ReactNode }): ReactNode {
  const [ready, setReady] = useState(false);

  const completeIntro = useCallback((): void => {
    setReady(true);
  }, []);

  const resetIntro = useCallback((): void => {
    setReady(false);
  }, []);

  useEffect(() => {
    if (ready) return;
    const timer = window.setTimeout(() => setReady(true), INTRO_FAILSAFE_MS);
    return () => window.clearTimeout(timer);
  }, [ready]);

  const value = useMemo(
    () => ({ ready, completeIntro, resetIntro }),
    [ready, completeIntro, resetIntro],
  );

  return (
    <IntroContext.Provider value={value}>{children}</IntroContext.Provider>
  );
}

export function useIntro(): IntroContextValue {
  const ctx = useContext(IntroContext);
  if (!ctx) {
    return {
      ready: true,
      completeIntro: () => {},
      resetIntro: () => {},
    };
  }
  return ctx;
}
