import { useEffect, useState } from "react";

/**
 * Watches a list of section ids inside `rootRef` and returns whichever
 * one is currently most visible. Used to keep the sidebar / tab bar /
 * status bar in sync with scroll position, like an editor's outline.
 */
export function useScrollSpy(ids: string[], rootRef: React.RefObject<HTMLElement | null>) {
  const [activeId, setActiveId] = useState(ids[0]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        let bestId = activeId;
        let bestRatio = 0;
        for (const id of ids) {
          const ratio = ratios.get(id) ?? 0;
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        if (bestRatio > 0) setActiveId(bestId);
      },
      { root, threshold: [0.1, 0.25, 0.5, 0.75, 1] },
    );

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids, rootRef]);

  return activeId;
}
