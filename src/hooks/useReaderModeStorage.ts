import * as userdataService from "@/services/userdata.service";

export function useReaderModeStorage() {
  const getMangaMode = async (
    title?: string
  ): Promise<"carousel" | "vertical"> => {
    if (!title) return "carousel";
    try {
      return await userdataService.getReaderMode(title);
    } catch {
      return "carousel";
    }
  };

  const saveMangaMode = async (
    title: string,
    mode: "carousel" | "vertical"
  ): Promise<void> => {
    try {
      await userdataService.saveReaderMode(title, mode);
    } catch {
      // silently fail
    }
  };

  return {
    getMangaMode,
    saveMangaMode,
  };
}
