import { useEffect, useState } from "react";

/**
 * Reveals `text` progressively, character by character, to mimic
 * someone typing in an editor. Immediately shows full text if the
 * user prefers reduced motion.
 */
export function useTypewriter(text: string, { charsPerTick = 2, tickMs = 16, startDelay = 300 } = {}) {
  const prefersReducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const [output, setOutput] = useState(prefersReducedMotion ? text : "");
  const [done, setDone] = useState(prefersReducedMotion);

  useEffect(() => {
    if (prefersReducedMotion) {
      setOutput(text);
      setDone(true);
      return;
    }

    let cancelled = false;
    let i = 0;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const timeoutId = setTimeout(() => {
      if (cancelled) return;
      intervalId = setInterval(() => {
        i += charsPerTick;
        if (i >= text.length) {
          setOutput(text);
          setDone(true);
          if (intervalId) clearInterval(intervalId);
        } else {
          setOutput(text.slice(0, i));
        }
      }, tickMs);
    }, startDelay);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return { output, done };
}
