import type { WatchlistItem, WatchlistStatus } from "@/types/userdata.types";
import * as userdataService from "@/services/userdata.service";

export type { WatchlistItem, WatchlistStatus };

export function useWatchlistStorage() {
  const getAllWatchlist = async (): Promise<WatchlistItem[]> => {
    try {
      return await userdataService.getAllWatchlist();
    } catch {
      return [];
    }
  };

  const getWatchlistItem = async (
    mangaTitle: string
  ): Promise<WatchlistItem | null> => {
    try {
      return await userdataService.getWatchlistItem(mangaTitle);
    } catch {
      return null;
    }
  };

  const isInWatchlist = async (mangaTitle: string): Promise<boolean> => {
    const item = await getWatchlistItem(mangaTitle);
    return item !== null;
  };

  const addToWatchlist = async (
    mangaTitle: string,
    status: WatchlistStatus = "À lire",
    lastChapterRead?: string
  ): Promise<void> => {
    try {
      await userdataService.addToWatchlist(mangaTitle, status, lastChapterRead);
    } catch {
      // silently fail
    }
  };

  const updateWatchlistItem = async (
    mangaTitle: string,
    updates: Partial<Omit<WatchlistItem, "title" | "addedAt">>
  ): Promise<void> => {
    try {
      await userdataService.updateWatchlistItem(mangaTitle, updates);
    } catch {
      // silently fail
    }
  };

  const removeFromWatchlist = async (mangaTitle: string): Promise<void> => {
    try {
      await userdataService.removeFromWatchlist(mangaTitle);
    } catch {
      // silently fail
    }
  };

  const updateStatus = async (
    mangaTitle: string,
    status: WatchlistStatus
  ): Promise<void> => {
    await updateWatchlistItem(mangaTitle, { status });
  };

  const updateLastChapterRead = async (
    mangaTitle: string,
    chapterNumber: string
  ): Promise<void> => {
    await updateWatchlistItem(mangaTitle, {
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
