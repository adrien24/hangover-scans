import { Manga, getManga, getMangaByTitle } from "./getMangas.service";

const url = import.meta.env.VITE_BACKEND_URL;

export const getMangasBulk = async (titles: string[]): Promise<Manga[]> => {
  if (!titles || titles.length === 0) {
    return [];
  }

  console.log("getMangasBulk called with titles:", titles);

  try {
    const response = await fetch(url + "/api/mangas/bulk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ titles }),
    });

    console.log("API bulk response status:", response.status);

    if (!response.ok) {
      // If bulk endpoint doesn't exist, fallback to individual requests
      if (response.status === 404 || response.status === 405) {
        console.log("Bulk endpoint not found, using fallback method");
        return await getMangasBulkFallback(titles);
      }

      const errorText = await response.text();
      console.error("API bulk error:", errorText);
      throw new Error(`Failed to fetch bulk mangas: ${response.statusText}`);
    }

    const result = await response.json();
    console.log("API bulk result:", result);

    // Handle different response formats
    if (Array.isArray(result)) {
      return result;
    } else if (result.data && Array.isArray(result.data)) {
      return result.data;
    } else {
      console.error("Unexpected API response format:", result);
      return [];
    }
  } catch (error) {
    console.error("getMangasBulk error, trying fallback:", error);
    // Try fallback method
    return await getMangasBulkFallback(titles);
  }
};

// Fallback: fetch all mangas and filter, or fetch individually
async function getMangasBulkFallback(titles: string[]): Promise<Manga[]> {
  try {
    console.log("Using fallback: fetching all mangas and filtering");
    // Get all mangas and filter by titles
    const allMangas = await getManga();
    const filteredMangas = allMangas.filter((manga) =>
      titles.includes(manga.title),
    );
    console.log("Fallback result:", filteredMangas);
    return filteredMangas;
  } catch (error) {
    console.error("Fallback method failed:", error);
    // Last resort: individual requests (slower but works)
    console.log("Last resort: individual requests");
    const results: Manga[] = [];
    for (const title of titles) {
      try {
        const manga = await getMangaByTitle(title);
        if (manga) results.push(manga);
      } catch (err) {
        console.error(`Failed to fetch manga ${title}:`, err);
      }
    }
    return results;
  }
}
