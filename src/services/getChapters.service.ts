import { MangaChapter } from "@/pages/MangaChapters";

const url = import.meta.env.VITE_BACKEND_URL;

export const getAllChapters = async (id?: string): Promise<MangaChapter> => {
  const response = await fetch(`${url}/api/mangas/${id}/chapters`, {
    method: "GET",
  });

  const result = await response.json();

  return result;
};
