import { useCallback, useEffect, useRef, useState } from "react";

/** Délai après lequel l'écran de chargement disparaît même si des pages traînent encore. */
const LOADER_TIMEOUT_MS = 20000;

/**
 * Suit les pages d'un chapitre « terminées » (chargées ou en échec) pour piloter l'écran de chargement.
 * Une page en échec compte comme terminée : avant, une seule image cassée bloquait le lecteur
 * sur « Chargement des images... » à l'infini.
 */
export function useImagesSettled(images: unknown[]) {
  const [settledCount, setSettledCount] = useState(0);
  const [timedOut, setTimedOut] = useState(false);
  const settled = useRef(new Set<number>());

  useEffect(() => {
    settled.current.clear();
    setSettledCount(0);
    setTimedOut(false);
    const timer = setTimeout(() => setTimedOut(true), LOADER_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [images]);

  const markSettled = useCallback((index: number) => {
    if (settled.current.has(index)) return;
    settled.current.add(index);
    setSettledCount((n) => n + 1);
  }, []);

  const isEmpty = images.length === 0;
  const allSettled = !isEmpty && settledCount >= images.length;

  return {
    markSettled,
    /** Toutes les pages ont fini (ou le délai est dépassé) : on peut afficher le chapitre */
    ready: allSettled || (!isEmpty && timedOut),
    isEmpty,
  };
}
