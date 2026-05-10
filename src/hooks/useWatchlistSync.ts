import { useEffect } from "react";
import { useWatchlistStorage } from "./useWatchlistStorage";
import type { UserContext, WatchlistStatus } from "@/types/userdata.types";

interface UseWatchlistSyncOptions {
  mangaTitle: string;
  chapterNumber: string | number;
  totalChapters?: number;
  userContext: UserContext | null;
}

/**
 * Reacts to chapter opening:
 * - adds the manga to the watchlist (status "En cours") if it isn't yet
 * - refreshes lastChapterRead / lastRead
 * - bumps status to "Terminé" when all chapters are read
 *
 * Operates from the already-loaded userContext (no extra GETs).
 */
export function useWatchlistSync({
  mangaTitle,
  chapterNumber,
  totalChapters,
  userContext,
}: UseWatchlistSyncOptions) {
  const { addToWatchlist, updateWatchlistItem } = useWatchlistStorage();

  useEffect(() => {
    if (!mangaTitle || !chapterNumber || !userContext) return;

    const currentChapter = String(chapterNumber);
    const { watchlist, bookmark } = userContext;

    if (!watchlist.inWatchlist) {
      addToWatchlist(mangaTitle, "En cours", currentChapter);
      return;
    }

    let newStatus: WatchlistStatus = watchlist.status ?? "En cours";
    if (bookmark && totalChapters) {
      const finishedCount = bookmark.chapters.filter((c) => c.isFinished).length;
      if (finishedCount >= totalChapters) {
        newStatus = "Terminé";
      } else if (newStatus === "À lire") {
        newStatus = "En cours";
      }
    } else if (newStatus === "À lire") {
      newStatus = "En cours";
    }

    updateWatchlistItem(mangaTitle, {
      status: newStatus,
      lastChapterRead: currentChapter,
      lastRead: Date.now(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mangaTitle, chapterNumber, totalChapters, userContext]);

  return null;
}
