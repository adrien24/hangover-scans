import { useEffect } from "react";
import { useWatchlistStorage } from "./useWatchlistStorage";
import { useBookmarkStorage } from "./useBookmarkStorage";

interface UseWatchlistSyncOptions {
  mangaTitle: string;
  chapterNumber: string | number;
  totalChapters?: number;
}

/**
 * Hook to automatically sync watchlist with reading progress
 * - Adds manga to watchlist when user starts reading (if not already in watchlist)
 * - Updates lastChapterRead and lastRead timestamp when reading
 * - Updates status to "Termine" when all chapters are read
 */
export function useWatchlistSync({
  mangaTitle,
  chapterNumber,
  totalChapters,
}: UseWatchlistSyncOptions) {
  const {
    isInWatchlist,
    addToWatchlist,
    updateWatchlistItem,
    getWatchlistItem,
  } = useWatchlistStorage();
  const { getBookmark } = useBookmarkStorage();

  useEffect(() => {
    if (!mangaTitle || !chapterNumber) return;

    const syncWatchlist = async () => {
      const inWatchlist = await isInWatchlist(mangaTitle);
      const mangaBookmarks = await getBookmark(mangaTitle);
      const currentChapter = String(chapterNumber);

      if (!inWatchlist) {
        await addToWatchlist(mangaTitle, "En cours", currentChapter);
        return;
      }

      const watchlistItem = await getWatchlistItem(mangaTitle);
      if (!watchlistItem) return;

      let newStatus = watchlistItem.status;
      if (mangaBookmarks && totalChapters) {
        const finishedChapters = mangaBookmarks.chapters.filter(
          (ch) => ch.isFinished
        );

        if (finishedChapters.length >= totalChapters) {
          newStatus = "Terminé";
        } else if (watchlistItem.status === "À lire") {
          newStatus = "En cours";
        }
      } else if (watchlistItem.status === "À lire") {
        newStatus = "En cours";
      }

      await updateWatchlistItem(mangaTitle, {
        status: newStatus,
        lastChapterRead: currentChapter,
        lastRead: Date.now(),
      });
    };

    syncWatchlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mangaTitle, chapterNumber, totalChapters]);

  return null;
}
