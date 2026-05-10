import type {
  MangaBookmark,
  BookmarkChapter,
  WatchlistItem,
  WatchlistStatus,
  MangaReaderMode,
  SyncLocalStoragePayload,
  WatchlistEnrichedItem,
  ExistsEnvelope,
  UserdataState,
  UpdateProgressPayload,
  UpdateProgressResponse,
  BatchBookmarkUpdate,
  BatchBookmarkResponse,
} from "@/types/userdata.types";

const url = import.meta.env.VITE_BACKEND_URL;

function getToken(): string {
  const token = localStorage.getItem("auth_token");
  if (!token) throw new Error("Non authentifie");
  return token;
}

function authHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message || "Erreur serveur");
  }
  return response.json();
}

async function unwrapExists<T>(response: Response): Promise<T | null> {
  const payload = await handleResponse<ExistsEnvelope<T>>(response);
  return payload.exists ? payload.data : null;
}

// ─── Aggregated state ───

export async function getUserdataState(): Promise<UserdataState> {
  const response = await fetch(url + "/api/userdata/state", {
    headers: authHeaders(),
  });
  // Tolerate a backend that hasn't deployed /state yet — fall back to an
  // empty cache rather than retry-storming on 404.
  if (response.status === 404) {
    return { bookmarks: [], watchlist: [], readerModes: [] };
  }
  return handleResponse(response);
}

// ─── Bookmarks ───

export async function getAllBookmarks(): Promise<MangaBookmark[]> {
  const response = await fetch(url + "/api/userdata/bookmarks", {
    headers: authHeaders(),
  });
  return handleResponse(response);
}

export async function getBookmark(
  mangaTitle: string
): Promise<MangaBookmark | null> {
  const response = await fetch(
    url + `/api/userdata/bookmarks/${encodeURIComponent(mangaTitle)}`,
    { headers: authHeaders() }
  );
  return unwrapExists<MangaBookmark>(response);
}

export async function getBookmarkChapter(
  mangaTitle: string,
  chapterId: number
): Promise<BookmarkChapter | null> {
  const response = await fetch(
    url +
      `/api/userdata/bookmarks/${encodeURIComponent(mangaTitle)}/chapters/${chapterId}`,
    { headers: authHeaders() }
  );
  return unwrapExists<BookmarkChapter>(response);
}

export async function saveBookmark(
  mangaTitle: string,
  chapterId: number,
  currentPage: number,
  isFinished: boolean
): Promise<void> {
  const response = await fetch(
    url +
      `/api/userdata/bookmarks/${encodeURIComponent(mangaTitle)}/chapters/${chapterId}`,
    {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ currentPage, isFinished }),
    }
  );
  await handleResponse(response);
}

export async function markChapterAsFinished(
  mangaTitle: string,
  chapterId: number
): Promise<void> {
  const response = await fetch(
    url +
      `/api/userdata/bookmarks/${encodeURIComponent(mangaTitle)}/chapters/${chapterId}/finish`,
    {
      method: "PUT",
      headers: authHeaders(),
    }
  );
  await handleResponse(response);
}

export async function batchUpdateBookmarks(
  updates: BatchBookmarkUpdate[]
): Promise<BatchBookmarkResponse> {
  const response = await fetch(url + "/api/userdata/bookmarks/batch", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ updates }),
  });
  return handleResponse(response);
}

// ─── Watchlist ───

export async function getEnrichedWatchlist(): Promise<WatchlistEnrichedItem[]> {
  const response = await fetch(url + "/api/mangas/watchlist", {
    headers: authHeaders(),
  });
  const data = await handleResponse<{
    count: number;
    data: WatchlistEnrichedItem[];
  }>(response);
  return data.data;
}

export async function getAllWatchlist(): Promise<WatchlistItem[]> {
  const response = await fetch(url + "/api/userdata/watchlist", {
    headers: authHeaders(),
  });
  return handleResponse(response);
}

export async function getWatchlistItem(
  mangaTitle: string
): Promise<WatchlistItem | null> {
  const response = await fetch(
    url + `/api/userdata/watchlist/${encodeURIComponent(mangaTitle)}`,
    { headers: authHeaders() }
  );
  return unwrapExists<WatchlistItem>(response);
}

export async function addToWatchlist(
  mangaTitle: string,
  status: WatchlistStatus = "À lire",
  lastChapterRead?: string
): Promise<void> {
  const response = await fetch(url + "/api/userdata/watchlist", {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ title: mangaTitle, status, lastChapterRead }),
  });
  await handleResponse(response);
}

export async function updateWatchlistItem(
  mangaTitle: string,
  updates: Partial<Omit<WatchlistItem, "title" | "addedAt">>
): Promise<void> {
  const response = await fetch(
    url + `/api/userdata/watchlist/${encodeURIComponent(mangaTitle)}`,
    {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(updates),
    }
  );
  await handleResponse(response);
}

export async function removeFromWatchlist(mangaTitle: string): Promise<void> {
  const response = await fetch(
    url + `/api/userdata/watchlist/${encodeURIComponent(mangaTitle)}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    }
  );
  await handleResponse(response);
}

// ─── Reader Modes ───

export async function getReaderMode(
  mangaTitle: string
): Promise<"carousel" | "vertical"> {
  const response = await fetch(
    url + `/api/userdata/reader-modes/${encodeURIComponent(mangaTitle)}`,
    { headers: authHeaders() }
  );
  const data = await unwrapExists<MangaReaderMode>(response);
  return data?.mode ?? "carousel";
}

export async function saveReaderMode(
  mangaTitle: string,
  mode: "carousel" | "vertical"
): Promise<void> {
  const response = await fetch(
    url + `/api/userdata/reader-modes/${encodeURIComponent(mangaTitle)}`,
    {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ mode }),
    }
  );
  await handleResponse(response);
}

// ─── Progress (transactionnel bookmark + watchlist) ───

export async function updateProgress(
  payload: UpdateProgressPayload
): Promise<UpdateProgressResponse> {
  const response = await fetch(url + "/api/userdata/progress", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

// ─── Sync localStorage → DB ───

export async function syncLocalStorageToDb(
  payload: SyncLocalStoragePayload
): Promise<{
  imported: { bookmarks: number; watchlist: number; readerModes: number };
}> {
  const response = await fetch(url + "/api/userdata/sync", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}
