import { memo, useState, useEffect, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import ImageLoader from "@/components/ImageLoader";
import ScanImage from "@/components/ScanImage";
import ChapterUnavailable from "@/components/ChapterUnavailable";
import { useBookmarkStorage } from "@/hooks/useBookmarkStorage";
import { useImagesSettled } from "@/hooks/useImagesSettled";

interface CarouselReaderProps {
  images: { url: string; loaded: boolean }[];
  onImageLoad: (index: number) => void;
  onClick: () => void;
  mangaTitle?: string;
  chapterId?: string | number;
  currentPage?: number;
}

const DEBOUNCE_MS = 1500;

const CarouselReader = memo(
  ({
    images,
    onImageLoad,
    onClick,
    mangaTitle,
    chapterId,
    currentPage = 0,
  }: CarouselReaderProps) => {
    const [api, setApi] = useState<CarouselApi>();
    const { saveBookmark } = useBookmarkStorage();
    const { markSettled, ready, isEmpty } = useImagesSettled(images);

    const saveBookmarkRef = useRef(saveBookmark);
    saveBookmarkRef.current = saveBookmark;

    // Debounced page-save: keep only the latest page, flush after inactivity.
    const pendingPageRef = useRef<number | null>(null);
    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleImageLoad = (index: number) => {
      onImageLoad(index);
      markSettled(index);
    };

    // Sauvegarder la page actuelle du carousel (debounced + flush au démontage)
    useEffect(() => {
      if (!api || !mangaTitle || chapterId === undefined) return;

      const flush = () => {
        const page = pendingPageRef.current;
        if (page === null) return;
        pendingPageRef.current = null;
        saveBookmarkRef.current(mangaTitle, Number(chapterId), page, false);
      };

      const handleSelect = () => {
        pendingPageRef.current = api.selectedScrollSnap();
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(flush, DEBOUNCE_MS);
      };

      const handleVisibilityChange = () => {
        if (document.visibilityState === "hidden") {
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
            debounceTimerRef.current = null;
          }
          flush();
        }
      };

      api.on("select", handleSelect);
      document.addEventListener("visibilitychange", handleVisibilityChange);

      return () => {
        api.off("select", handleSelect);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
          debounceTimerRef.current = null;
        }
        flush();
      };
    }, [api, mangaTitle, chapterId]);

    // Aller a la page sauvegardee au chargement (apres que toutes les images soient chargees)
    useEffect(() => {
      if (!api || !ready) return;
      api.scrollTo(currentPage);
    }, [api, ready, currentPage]);

    // Desactiver le swipe d'Embla quand le navigateur est zoome (scale > 1)
    // et le reactiver uniquement quand on revient au zoom normal.
    useEffect(() => {
      if (!api) return;
      const emblaViewport = api.containerNode().parentElement;
      if (!emblaViewport) return;

      // Zoom normal : Embla gere le swipe horizontal, on autorise pinch-zoom
      emblaViewport.style.touchAction = "pan-y pinch-zoom";

      const vv = window.visualViewport;
      if (!vv) return;

      const onViewportChange = () => {
        if (vv.scale > 1.01) {
          // Zoome : autoriser le deplacement dans toutes les directions + desactiver Embla
          emblaViewport.style.touchAction = "pan-x pan-y pinch-zoom";
          api.reInit({ watchDrag: false });
        } else {
          // Zoom normal : reactiver Embla, swipe horizontal uniquement
          emblaViewport.style.touchAction = "pan-y pinch-zoom";
          api.reInit({ watchDrag: true });
        }
      };

      vv.addEventListener("resize", onViewportChange);
      vv.addEventListener("scroll", onViewportChange);

      return () => {
        vv.removeEventListener("resize", onViewportChange);
        vv.removeEventListener("scroll", onViewportChange);
      };
    }, [api]);

    if (isEmpty) return <ChapterUnavailable onClick={onClick} />;

    return (
      <>
        {!ready && <ImageLoader />}
        <div
          className='w-full h-screen flex items-center justify-center'
          onClick={onClick}
        >
          <Carousel className='w-full max-w-4xl' setApi={setApi}>
            <CarouselContent>
              {images.map((imageScan, index) => (
                <CarouselItem
                  key={index}
                  className='flex items-center justify-center'
                >
                  <div className='w-full h-screen flex items-center justify-center overflow-hidden'>
                    <ScanImage
                      key={imageScan.url}
                      url={imageScan.url}
                      index={index}
                      className='max-h-screen max-w-full object-contain'
                      onLoad={handleImageLoad}
                      onError={markSettled}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className='left-4 hidden' />
            <CarouselNext className='right-4 hidden' />
          </Carousel>
        </div>
      </>
    );
  }
);

CarouselReader.displayName = "CarouselReader";

export default CarouselReader;
