export type WatchlistStatus = "À lire" | "En cours" | "Terminé" | "En pause";

export interface WatchlistItem {
  title: string;
  status: WatchlistStatus;
  addedAt: number;
  lastRead?: number;
  lastChapterRead?: string;
}

const WATCHLIST_STORAGE_KEY = "manga-watchlist";

export function useWatchlistStorage() {
  const getAllWatchlist = (): WatchlistItem[] => {
    try {
      const stored = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const getWatchlistItem = (mangaTitle: string): WatchlistItem | null => {
    const watchlist = getAllWatchlist();
    return watchlist.find((item) => item.title === mangaTitle) || null;
  };

  const isInWatchlist = (mangaTitle: string): boolean => {
    return getWatchlistItem(mangaTitle) !== null;
  };

  const addToWatchlist = (
    mangaTitle: string,
    status: WatchlistStatus = "À lire",
    lastChapterRead?: string,
  ): void => {
    const watchlist = getAllWatchlist();

    // Check if already exists
    const existingIndex = watchlist.findIndex(
      (item) => item.title === mangaTitle,
    );
    if (existingIndex !== -1) {
      // Update existing item
      watchlist[existingIndex] = {
        ...watchlist[existingIndex],
        status,
        lastRead: Date.now(),
        ...(lastChapterRead && { lastChapterRead }),
      };
    } else {
      // Add new item
      const newItem: WatchlistItem = {
        title: mangaTitle,
        status,
        addedAt: Date.now(),
        lastRead: Date.now(),
        ...(lastChapterRead && { lastChapterRead }),
      };
      watchlist.push(newItem);
    }

    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
  };

  const updateWatchlistItem = (
    mangaTitle: string,
    updates: Partial<Omit<WatchlistItem, "title" | "addedAt">>,
  ): void => {
    const watchlist = getAllWatchlist();
    const index = watchlist.findIndex((item) => item.title === mangaTitle);

    if (index !== -1) {
      watchlist[index] = {
        ...watchlist[index],
        ...updates,
        lastRead: Date.now(),
      };
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
    }
  };

  const removeFromWatchlist = (mangaTitle: string): void => {
    const watchlist = getAllWatchlist();
    const filtered = watchlist.filter((item) => item.title !== mangaTitle);
    localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(filtered));
  };

  const updateStatus = (mangaTitle: string, status: WatchlistStatus): void => {
    updateWatchlistItem(mangaTitle, { status });
  };

  const updateLastChapterRead = (
    mangaTitle: string,
    chapterNumber: string,
  ): void => {
    updateWatchlistItem(mangaTitle, {
      lastChapterRead: chapterNumber,
      lastRead: Date.now(),
    });
  };

  return {
    getAllWatchlist,
    getWatchlistItem,
    isInWatchlist,
    addToWatchlist,
    updateWatchlistItem,
    removeFromWatchlist,
    updateStatus,
    updateLastChapterRead,
  };
}
