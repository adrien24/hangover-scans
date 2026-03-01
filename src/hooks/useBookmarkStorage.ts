interface Chapter {
  id: number;
  currentPage: number;
  isFinished: boolean;
  lastUpdated: number;
}

interface MangaBookmark {
  title: string;
  chapters: Chapter[];
}

const BOOKMARKS_STORAGE_KEY = "manga-bookmarks";

export function useBookmarkStorage() {
  const getMangas = (): MangaBookmark[] => {
    try {
      const stored = localStorage.getItem(BOOKMARKS_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const getManga = (mangaTitle?: string): MangaBookmark | null => {
    if (!mangaTitle) return null;
    const mangas = getMangas();
    return mangas.find((m) => m.title === mangaTitle) || null;
  };

  const getChapter = (
    mangaTitle?: string,
    chapterId?: string | number,
  ): Chapter | null => {
    if (!mangaTitle || chapterId === undefined) return null;
    const manga = getManga(mangaTitle);
    if (!manga) return null;
    const numChapterId =
      typeof chapterId === "string" ? parseInt(chapterId) : chapterId;
    return manga.chapters.find((c) => c.id === numChapterId) || null;
  };

  const saveBookmark = (
    mangaTitle: string,
    chapterId: number,
    currentPage: number,
    isFinished: boolean = false,
  ) => {
    const mangas = getMangas();
    let manga = mangas.find((m) => m.title === mangaTitle);

    if (!manga) {
      manga = { title: mangaTitle, chapters: [] };
      mangas.push(manga);
    }

    let chapter = manga.chapters.find((c) => c.id === chapterId);
    if (!chapter) {
      chapter = {
        id: chapterId,
        currentPage,
        isFinished,
        lastUpdated: Date.now(),
      };
      manga.chapters.push(chapter);
    } else {
      chapter.currentPage = currentPage;
      chapter.isFinished = isFinished;
      chapter.lastUpdated = Date.now();
    }

    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(mangas));
  };

  const markChapterAsFinished = (mangaTitle: string, chapterId: number) => {
    const mangas = getMangas();
    let manga = mangas.find((m) => m.title === mangaTitle);

    if (!manga) {
      manga = { title: mangaTitle, chapters: [] };
      mangas.push(manga);
    }

    let chapter = manga.chapters.find((c) => c.id === chapterId);
    if (!chapter) {
      chapter = {
        id: chapterId,
        currentPage: 0,
        isFinished: true,
        lastUpdated: Date.now(),
      };
      manga.chapters.push(chapter);
    } else {
      chapter.isFinished = true;
      chapter.lastUpdated = Date.now();
    }

    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(mangas));
  };

  const isChapterFinished = (
    mangaTitle?: string,
    chapterId?: string | number,
  ): boolean => {
    const chapter = getChapter(mangaTitle, chapterId);
    return chapter?.isFinished || false;
  };

  const getCurrentPage = (
    mangaTitle?: string,
    chapterId?: string | number,
  ): number => {
    const chapter = getChapter(mangaTitle, chapterId);
    return chapter?.currentPage || 0;
  };

  return {
    getMangas,
    getManga,
    getChapter,
    saveBookmark,
    markChapterAsFinished,
    isChapterFinished,
    getCurrentPage,
  };
}
