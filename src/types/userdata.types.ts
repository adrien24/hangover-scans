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
  status: string;
  lastChapterRead: string;
  lastChapter: string;
}
