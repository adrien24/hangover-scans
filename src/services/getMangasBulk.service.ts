import { Manga } from "./getMangas.service";

const url = import.meta.env.VITE_BACKEND_URL;

function authOrPublicHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = localStorage.getItem("auth_token");
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/**
 * Calls POST /api/mangas/bulk. The backend guarantees that `data` is aligned
 * on the input `titles` array (same order, same length) with `null` for
 * unknown titles. We strip the nulls before returning.
 */
export const getMangasBulk = async (titles: string[]): Promise<Manga[]> => {
  if (!titles || titles.length === 0) return [];

  const response = await fetch(url + "/api/mangas/bulk", {
    method: "POST",
    headers: authOrPublicHeaders(),
    body: JSON.stringify({ titles }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch bulk mangas: ${response.statusText}`);
  }

  const result: { count: number; data: (Manga | null)[] } = await response.json();
  return result.data.filter((m): m is Manga => m !== null);
};
