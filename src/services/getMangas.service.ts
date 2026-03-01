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
}

export const getManga = async (): Promise<Manga[]> => {
  console.log("start");

  const response = await fetch(url + "/api/mangas", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  return result.data;
};

export const getMangaByTitle = async (title): Promise<Manga> => {
  const response = await fetch(url + `/api/mangas/${title}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  return result;
};
