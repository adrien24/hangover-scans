import * as userdataService from "@/services/userdata.service";
import {
  upsertReaderMode,
  useUserdataCacheAccessor,
} from "@/hooks/useUserdataState";

export function useReaderModeStorage() {
  const { ensureState, patch } = useUserdataCacheAccessor();

  const getMangaMode = async (
    title?: string
  ): Promise<"carousel" | "vertical"> => {
    if (!title) return "carousel";
    const state = await ensureState();
    return (
      state?.readerModes.find((r) => r.title === title)?.mode ?? "carousel"
    );
  };

  const saveMangaMode = async (
    title: string,
    mode: "carousel" | "vertical"
  ): Promise<void> => {
    try {
      await userdataService.saveReaderMode(title, mode);
      patch((state) => upsertReaderMode(state, title, mode));
    } catch {
      // silently fail
    }
  };

  return {
    getMangaMode,
    saveMangaMode,
  };
}
