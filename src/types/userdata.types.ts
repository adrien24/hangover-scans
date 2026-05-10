export interface BookmarkChapter {
  id: number;
  currentPage: number;
  isFinished: boolean;
  lastUpdated: number;
}

export interface MangaBookmark {
  title: string;
  chapters: BookmarkChapter[];
}

export type WatchlistStatus = "À lire" | "En cours" | "Terminé" | "En pause";

export interface WatchlistItem {
  title: string;
  status: WatchlistStatus;
  addedAt: number;
  lastRead?: number;
  lastChapterRead?: string;
}

export interface MangaReaderMode {
  title: string;
  mode: "carousel" | "vertical";
}

export interface SyncLocalStoragePayload {
  bookmarks: MangaBookmark[];
  watchlist: WatchlistItem[];
  readerModes: MangaReaderMode[];
}

export interface WatchlistEnrichedItem {
  id: string;
  title: string;
  thumbnails: string;
  mean: number;
  mediaType: string;
  genres: { id: number; name: string }[];
  status: WatchlistStatus;
  lastChapterRead: string;
  lastChapter: string;
  addedAt: number;
  lastRead?: number;
}

// ─── Backend response envelope for the userdata "get one" endpoints ───

export interface ExistsEnvelope<T> {
  exists: boolean;
  data: T | null;
}

// ─── Aggregated state (GET /api/userdata/state) ───

export interface UserdataState {
  bookmarks: MangaBookmark[];
  watchlist: WatchlistItem[];
  readerModes: MangaReaderMode[];
}

// ─── Per-manga decoration (GET /api/mangas[/:title|/bulk]) ───

export interface UserState {
  inWatchlist: boolean;
  watchlistStatus?: WatchlistStatus;
  lastChapterRead?: string;
  lastReadChapter?: {
    id: number;
    isFinished: boolean;
    currentPage: number;
  };
}

// ─── Per-chapter decoration (GET /api/mangas/:title/scans/:id) ───

export interface UserContext {
  readerMode: "carousel" | "vertical" | null;
  currentPage: number;
  isFinished: boolean;
  watchlist: {
    inWatchlist: boolean;
    status?: WatchlistStatus;
    lastChapterRead?: string;
  };
  bookmark: MangaBookmark | null;
}

// ─── Progress endpoint ───

export interface UpdateProgressPayload {
  mangaTitle: string;
  chapterId: number;
  currentPage: number;
  isFinished: boolean;
  totalChapters?: number;
}

export interface UpdateProgressResponse {
  ok: true;
  bookmark: BookmarkChapter;
  watchlist: WatchlistItem;
}

// ─── Batch endpoint ───

export interface BatchBookmarkUpdate {
  mangaTitle: string;
  chapterId: number;
  currentPage: number;
  isFinished: boolean;
  lastUpdated?: number;
}

export interface BatchBookmarkResponse {
  ok: true;
  updated: number;
  skipped: number;
}
