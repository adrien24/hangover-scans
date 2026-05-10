import type { UserState } from "@/types/userdata.types";

const url = import.meta.env.VITE_BACKEND_URL;

export interface Manga {
  id: string;
  title: string;
  description: string;
  thumbnails: string;
  color: string | null;
  createdAt: string;
  updatedAt: string;
  site: string;
  linkManga: string;
  mean: number;
  mediaType: string;
  status: string;
  genres: string[];
  authors: string[];
  userState?: UserState;
}

function authOrPublicHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const token = localStorage.getItem("auth_token");
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

export const getManga = async (): Promise<Manga[]> => {
  const response = await fetch(url + "/api/mangas", {
    method: "GET",
    headers: authOrPublicHeaders(),
  });

  const result = await response.json();
  return result.data;
};

export const getMangaByTitle = async (title: string): Promise<Manga> => {
  const response = await fetch(url + `/api/mangas/${title}`, {
    method: "GET",
    headers: authOrPublicHeaders(),
  });

  return response.json();
};
