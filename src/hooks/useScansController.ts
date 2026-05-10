import { useEffect, useState, useCallback } from "react";
import { getAllScans } from "@/services/getAllScans.service";
import type { UserContext } from "@/types/userdata.types";

type Chapter = {
  id: number;
  title: string;
  description: string;
  images: string[];
};

export type allChaptersResponse = {
  chapter: number;
  title: string;
};

export function useScansController(id?: string | number, title?: string) {
  const [scans, setScans] = useState<Chapter | null>(null);
  const [totalChapters, setTotalChapters] = useState<number>(0);
  const [userContext, setUserContext] = useState<UserContext | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [imagesScans, setImagesScans] = useState<
    { url: string; loaded: boolean }[]
  >([]);
  const [titleScan, setTitleScan] = useState("");
  const [showHeader, setShowHeader] = useState(false);
  const [isNextChapterAvailable, setIsNextChapterAvailable] = useState(true);
  const [isSlider, setIsSlider] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      if (!id && !title) return;
      setIsLoading(true);
      try {
        const { scan, totalChapters, userContext } = await getAllScans(
          String(id),
          String(title)
        );

        if (!mounted) return;
        setScans(scan);
        setImagesScans(scan.images.map((img) => ({ url: img, loaded: false })));
        setTitleScan(scan.title);
        setTotalChapters(totalChapters);
        setUserContext(userContext);
      } catch (err) {
        console.error("Failed to load scans in hook", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [id, title]);

  const toggleHeader = useCallback(() => {
    setShowHeader((s) => !s);
  }, []);

  const nextChapterAvailable = useCallback(
    (currentId: string, allChapters: allChaptersResponse[]) => {
      const nextChapter = parseInt(currentId) + 1;
      const available =
        nextChapter <= allChapters.length &&
        allChapters.some((chapter) => chapter.chapter === nextChapter);
      setIsNextChapterAvailable(available);
      return available;
    },
    []
  );

  const scansOrientation = useCallback(
    (scanName: string) => {
      localStorage.setItem(
        `scans-orientation-${scanName}`,
        isSlider ? "notSlider" : "slider"
      );
      const orientation = localStorage.getItem(`scans-orientation-${scanName}`);
      return orientation;
    },
    [isSlider]
  );

  const menuItemsClicked = useCallback(
    (event: string, scansName: string) => {
      if (event === "Lecture verticale/horizontale") {
        setIsSlider((s) => !s);
        scansOrientation(scansName);
      }
    },
    [scansOrientation]
  );

  return {
    scans,
    totalChapters,
    userContext,
    isLoading,
    isReading,
    imagesScans,
    titleScan,
    showHeader,
    isNextChapterAvailable,
    isSlider,
    toggleHeader,
    nextChapterAvailable,
    scansOrientation,
    menuItemsClicked,
    setIsReading,
  };
}

export default useScansController;
