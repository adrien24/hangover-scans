import type { MangaBookmark, BookmarkChapter } from "@/types/userdata.types";
import * as userdataService from "@/services/userdata.service";
import {
  upsertBookmarkChapter,
  useUserdataCacheAccessor,
} from "@/hooks/useUserdataState";

export type { MangaBookmark, BookmarkChapter };

export function useBookmarkStorage() {
  const { ensureState, patch } = useUserdataCacheAccessor();

  const getAllBookmarks = async (): Promise<MangaBookmark[]> => {
    const state = await ensureState();
    return state?.bookmarks ?? [];
  };

  const getBookmark = async (
    mangaTitle?: string
  ): Promise<MangaBookmark | null> => {
    if (!mangaTitle) return null;
    const state = await ensureState();
    return state?.bookmarks.find((b) => b.title === mangaTitle) ?? null;
  };

  const getChapter = async (
    mangaTitle?: string,
    chapterId?: string | number
  ): Promise<BookmarkChapter | null> => {
    if (!mangaTitle || chapterId === undefined) return null;
    const numChapterId =
      typeof chapterId === "string" ? parseInt(chapterId) : chapterId;
    const bookmark = await getBookmark(mangaTitle);
    return bookmark?.chapters.find((c) => c.id === numChapterId) ?? null;
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
      patch((state) =>
        upsertBookmarkChapter(state, mangaTitle, {
          id: chapterId,
          currentPage,
          isFinished,
          lastUpdated: Date.now(),
        })
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
      patch((state) => {
        const existing = state.bookmarks
          .find((b) => b.title === mangaTitle)
          ?.chapters.find((c) => c.id === chapterId);
        return upsertBookmarkChapter(state, mangaTitle, {
          id: chapterId,
          currentPage: existing?.currentPage ?? 0,
          isFinished: true,
          lastUpdated: Date.now(),
        });
      });
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
