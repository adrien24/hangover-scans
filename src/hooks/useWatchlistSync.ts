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
 * - Updates status to "Terminé" when all chapters are read
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
  const { getMangaLocalStorage } = useBookmarkStorage();

  useEffect(() => {
    if (!mangaTitle || !chapterNumber) return;

    const syncWatchlist = () => {
      const inWatchlist = isInWatchlist(mangaTitle);
      const mangaBookmarks = getMangaLocalStorage(mangaTitle);
      const currentChapter = String(chapterNumber);

      // If not in watchlist, add it with "En cours" status
      if (!inWatchlist) {
        addToWatchlist(mangaTitle, "En cours", currentChapter);
        return;
      }

      // Update existing watchlist item
      const watchlistItem = getWatchlistItem(mangaTitle);
      if (!watchlistItem) return;

      // Check if all chapters are finished
      let newStatus = watchlistItem.status;
      if (mangaBookmarks && totalChapters) {
        const finishedChapters = mangaBookmarks.chapters.filter(
          (ch) => ch.isFinished,
        );

        // If all chapters are read, mark as completed
        if (finishedChapters.length >= totalChapters) {
          newStatus = "Terminé";
        } else if (watchlistItem.status === "À lire") {
          // If status is "À lire" but user is reading, change to "En cours"
          newStatus = "En cours";
        }
      } else if (watchlistItem.status === "À lire") {
        // If we don't know total chapters but user is reading, change status
        newStatus = "En cours";
      }

      // Update the watchlist item
      updateWatchlistItem(mangaTitle, {
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
