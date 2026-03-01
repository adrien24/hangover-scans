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
import { useBookmarkStorage } from "@/hooks/useBookmarkStorage";

interface CarouselReaderProps {
  images: { url: string; loaded: boolean }[];
  onImageLoad: (index: number) => void;
  onClick: () => void;
  mangaTitle?: string;
  chapterId?: string | number;
  currentPage?: number;
}

const CarouselReader = memo(
  ({
    images,
    onImageLoad,
    onClick,
    mangaTitle,
    chapterId,
    currentPage = 0,
  }: CarouselReaderProps) => {
    const [loadedCount, setLoadedCount] = useState(0);
    const [api, setApi] = useState<CarouselApi>();
    const { saveBookmark } = useBookmarkStorage();
    const loadedIndices = useRef(new Set<number>());

    useEffect(() => {
      setLoadedCount(0);
      loadedIndices.current.clear();
    }, [images]);

    const handleImageLoad = (index: number) => {
      if (loadedIndices.current.has(index)) return;
      loadedIndices.current.add(index);
      onImageLoad(index);
      setLoadedCount((prev) => prev + 1);
    };

    const allImagesLoaded = images.length > 0 && loadedCount === images.length;

    // Sauvegarder la page actuelle du carousel
    useEffect(() => {
      if (!api || !mangaTitle || chapterId === undefined) return;

      const handleSelect = () => {
        const currentIndex = api.selectedScrollSnap();
        saveBookmark(mangaTitle, Number(chapterId), currentIndex, false);
      };

      api.on("select", handleSelect);

      return () => {
        api.off("select", handleSelect);
      };
    }, [api, mangaTitle, chapterId, saveBookmark]);

    // Aller à la page sauvegardée au chargement (après que toutes les images soient chargées)
    useEffect(() => {
      if (!api || !allImagesLoaded) return;
      api.scrollTo(currentPage);
    }, [api, allImagesLoaded, currentPage]);

    // Désactiver le swipe d'Embla quand le navigateur est zoomé (scale > 1)
    // et le réactiver uniquement quand on revient au zoom normal.
    useEffect(() => {
      if (!api) return;
      const emblaViewport = api.containerNode().parentElement;
      if (!emblaViewport) return;

      // Zoom normal : Embla gère le swipe horizontal, on autorise pinch-zoom
      emblaViewport.style.touchAction = "pan-y pinch-zoom";

      const vv = window.visualViewport;
      if (!vv) return;

      const onViewportChange = () => {
        if (vv.scale > 1.01) {
          // Zoomé : autoriser le déplacement dans toutes les directions + désactiver Embla
          emblaViewport.style.touchAction = "pan-x pan-y pinch-zoom";
          api.reInit({ watchDrag: false });
        } else {
          // Zoom normal : réactiver Embla, swipe horizontal uniquement
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

    return (
      <>
        {!allImagesLoaded && <ImageLoader />}
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
                    <img
                      src={`${
                        imageScan.url.includes("lelmanga")
                          ? `https://hangoverscans.fr/compressImage.php?imgurl=${imageScan.url}`
                          : imageScan.url
                      }`}
                      ref={(el) => {
                        if (el?.complete) handleImageLoad(index);
                      }}
                      alt={`Page ${index + 1}`}
                      className='max-h-screen max-w-full object-contain'
                      onLoad={() => handleImageLoad(index)}
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
  },
);

CarouselReader.displayName = "CarouselReader";

export default CarouselReader;
