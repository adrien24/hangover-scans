import type { MangaBookmark, BookmarkChapter } from "@/types/userdata.types";
import * as userdataService from "@/services/userdata.service";

export type { MangaBookmark, BookmarkChapter };

export function useBookmarkStorage() {
  const getAllBookmarks = async (): Promise<MangaBookmark[]> => {
    try {
      return await userdataService.getAllBookmarks();
    } catch {
      return [];
    }
  };

  const getBookmark = async (
    mangaTitle?: string
  ): Promise<MangaBookmark | null> => {
    if (!mangaTitle) return null;
    try {
      return await userdataService.getBookmark(mangaTitle);
    } catch {
      return null;
    }
  };

  const getChapter = async (
    mangaTitle?: string,
    chapterId?: string | number
  ): Promise<BookmarkChapter | null> => {
    if (!mangaTitle || chapterId === undefined) return null;
    try {
      const numChapterId =
        typeof chapterId === "string" ? parseInt(chapterId) : chapterId;
      return await userdataService.getBookmarkChapter(mangaTitle, numChapterId);
    } catch {
      return null;
    }
  };

  const saveBookmark = async (
    mangaTitle: string,
    chapterId: number,
    currentPage: number,
    isFinished: boolean = false
  ): Promise<void> => {
    try {
      await userdataService.saveBookmark(
        mangaTitle,
        chapterId,
        currentPage,
        isFinished
      );
    } catch {
      // silently fail
    }
  };

  const markChapterAsFinished = async (
    mangaTitle: string,
    chapterId: number
  ): Promise<void> => {
    try {
      await userdataService.markChapterAsFinished(mangaTitle, chapterId);
    } catch {
      // silently fail
    }
  };

  const isChapterFinished = async (
    mangaTitle?: string,
    chapterId?: string | number
  ): Promise<boolean> => {
    const chapter = await getChapter(mangaTitle, chapterId);
    return chapter?.isFinished || false;
  };

  const getCurrentPage = async (
    mangaTitle?: string,
    chapterId?: string | number
  ): Promise<number> => {
    const chapter = await getChapter(mangaTitle, chapterId);
    return chapter?.currentPage || 0;
  };

  return {
    getAllBookmarks,
    getBookmark,
    getChapter,
    saveBookmark,
    markChapterAsFinished,
    isChapterFinished,
    getCurrentPage,
  };
}
