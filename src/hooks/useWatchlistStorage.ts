import type { WatchlistItem, WatchlistStatus } from "@/types/userdata.types";
import * as userdataService from "@/services/userdata.service";
import {
  removeWatchlistItem,
  upsertWatchlistItem,
  useUserdataCacheAccessor,
} from "@/hooks/useUserdataState";

export type { WatchlistItem, WatchlistStatus };

export function useWatchlistStorage() {
  const { ensureState, patch } = useUserdataCacheAccessor();

  const getAllWatchlist = async (): Promise<WatchlistItem[]> => {
    const state = await ensureState();
    return state?.watchlist ?? [];
  };

  const getWatchlistItem = async (
    mangaTitle: string
  ): Promise<WatchlistItem | null> => {
    const state = await ensureState();
    return state?.watchlist.find((w) => w.title === mangaTitle) ?? null;
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
      patch((state) => {
        const existing = state.watchlist.find((w) => w.title === mangaTitle);
        return upsertWatchlistItem(state, {
          title: mangaTitle,
          status,
          addedAt: existing?.addedAt ?? Date.now(),
          lastRead: existing?.lastRead,
          lastChapterRead: lastChapterRead ?? existing?.lastChapterRead,
        });
      });
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
      patch((state) => {
        const existing = state.watchlist.find((w) => w.title === mangaTitle);
        if (!existing) return state;
        return upsertWatchlistItem(state, { ...existing, ...updates });
      });
    } catch {
      // silently fail
    }
  };

  const removeFromWatchlist = async (mangaTitle: string): Promise<void> => {
    try {
      await userdataService.removeFromWatchlist(mangaTitle);
      patch((state) => removeWatchlistItem(state, mangaTitle));
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
