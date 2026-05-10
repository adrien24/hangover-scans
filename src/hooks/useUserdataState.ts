import { useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import * as userdataService from "@/services/userdata.service";
import type {
  UserdataState,
  MangaBookmark,
  BookmarkChapter,
  WatchlistItem,
  WatchlistStatus,
} from "@/types/userdata.types";

export const USERDATA_STATE_KEY = ["userdata", "state"] as const;

/**
 * Bootstraps and subscribes to the aggregated userdata state.
 * Call it from any component that needs bookmarks/watchlist/reader-modes —
 * React Query deduplicates fetches across components.
 */
export function useUserdataState() {
  const { isAuthenticated } = useAuth();
  return useQuery<UserdataState>({
    queryKey: USERDATA_STATE_KEY,
    queryFn: userdataService.getUserdataState,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
}

// ─── Cache mutation helpers ───
// All mutations on bookmark/watchlist/reader-mode go through these helpers
// to keep the local cache in sync with the backend.

export function patchUserdataCache(
  queryClient: QueryClient,
  updater: (state: UserdataState) => UserdataState
) {
  queryClient.setQueryData<UserdataState>(USERDATA_STATE_KEY, (old) => {
    if (!old) return old;
    return updater(old);
  });
}

export function upsertBookmarkChapter(
  state: UserdataState,
  mangaTitle: string,
  chapter: BookmarkChapter
): UserdataState {
  const existingIndex = state.bookmarks.findIndex((b) => b.title === mangaTitle);
  if (existingIndex === -1) {
    return {
      ...state,
      bookmarks: [...state.bookmarks, { title: mangaTitle, chapters: [chapter] }],
    };
  }
  const existing = state.bookmarks[existingIndex];
  const chapterIndex = existing.chapters.findIndex((c) => c.id === chapter.id);
  const newChapters =
    chapterIndex === -1
      ? [...existing.chapters, chapter]
      : existing.chapters.map((c, i) => (i === chapterIndex ? chapter : c));
  const newBookmarks = state.bookmarks.map((b, i) =>
    i === existingIndex ? { ...b, chapters: newChapters } : b
  );
  return { ...state, bookmarks: newBookmarks };
}

export function upsertWatchlistItem(
  state: UserdataState,
  item: WatchlistItem
): UserdataState {
  const idx = state.watchlist.findIndex((w) => w.title === item.title);
  if (idx === -1) return { ...state, watchlist: [...state.watchlist, item] };
  return {
    ...state,
    watchlist: state.watchlist.map((w, i) => (i === idx ? { ...w, ...item } : w)),
  };
}

export function removeWatchlistItem(
  state: UserdataState,
  title: string
): UserdataState {
  return {
    ...state,
    watchlist: state.watchlist.filter((w) => w.title !== title),
  };
}

export function upsertReaderMode(
  state: UserdataState,
  title: string,
  mode: "carousel" | "vertical"
): UserdataState {
  const idx = state.readerModes.findIndex((r) => r.title === title);
  if (idx === -1) {
    return { ...state, readerModes: [...state.readerModes, { title, mode }] };
  }
  return {
    ...state,
    readerModes: state.readerModes.map((r, i) =>
      i === idx ? { ...r, mode } : r
    ),
  };
}

// ─── Synchronous selectors (read from current cache) ───

export function useBookmarkFromCache(title?: string): MangaBookmark | null {
  const { data } = useUserdataState();
  if (!title || !data) return null;
  return data.bookmarks.find((b) => b.title === title) ?? null;
}

export function useWatchlistItemFromCache(
  title?: string
): WatchlistItem | null {
  const { data } = useUserdataState();
  if (!title || !data) return null;
  return data.watchlist.find((w) => w.title === title) ?? null;
}

export function useReaderModeFromCache(
  title?: string
): "carousel" | "vertical" {
  const { data } = useUserdataState();
  if (!title || !data) return "carousel";
  return data.readerModes.find((r) => r.title === title)?.mode ?? "carousel";
}

/**
 * Imperative helper for hooks/services that need to read or refresh the
 * cached state outside React render (e.g. legacy async APIs).
 */
export function useUserdataCacheAccessor() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const ensureState = async (): Promise<UserdataState | null> => {
    if (!isAuthenticated) return null;
    return queryClient.ensureQueryData<UserdataState>({
      queryKey: USERDATA_STATE_KEY,
      queryFn: userdataService.getUserdataState,
      staleTime: 5 * 60 * 1000,
    });
  };

  return {
    queryClient,
    ensureState,
    patch: (updater: (state: UserdataState) => UserdataState) =>
      patchUserdataCache(queryClient, updater),
  };
}

// Re-exports for backward compatibility with callers
export type { WatchlistStatus };
