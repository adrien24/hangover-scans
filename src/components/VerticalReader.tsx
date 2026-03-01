import { memo, useState, useEffect, useRef } from "react";
import ImageLoader from "@/components/ImageLoader";

interface VerticalReaderProps {
  images: { url: string; loaded: boolean }[];
  onImageLoad: (index: number) => void;
  onClick: () => void;
}

const VerticalReader = memo(
  ({ images, onImageLoad, onClick }: VerticalReaderProps) => {
    const [loadedCount, setLoadedCount] = useState(0);
    const loadedIndices = useRef(new Set<number>());
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Réinitialiser le compteur et remonter en haut quand les images changent
    useEffect(() => {
      setLoadedCount(0);
      loadedIndices.current.clear();
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }, [images]);

    const handleImageLoad = (index: number) => {
      if (loadedIndices.current.has(index)) return;
      loadedIndices.current.add(index);
      onImageLoad(index);
      setLoadedCount((prev) => prev + 1);
    };

    const allImagesLoaded = images.length > 0 && loadedCount === images.length;

    return (
      <>
        {!allImagesLoaded && <ImageLoader />}
        <div
          ref={scrollContainerRef}
          className='w-full h-screen overflow-y-auto flex flex-col items-center pt-20 pb-20'
          onClick={onClick}
        >
          {images.map((imageScan, index) => (
            <div key={index} className='w-full flex justify-center mb-4'>
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
                className='max-w-full h-auto'
                onLoad={() => handleImageLoad(index)}
              />
            </div>
          ))}
        </div>
      </>
    );
  },
);

VerticalReader.displayName = "VerticalReader";

export default VerticalReader;
