import { memo, useEffect, useRef } from "react";
import ImageLoader from "@/components/ImageLoader";
import ScanImage from "@/components/ScanImage";
import ChapterUnavailable from "@/components/ChapterUnavailable";
import { useImagesSettled } from "@/hooks/useImagesSettled";

interface VerticalReaderProps {
  images: { url: string; loaded: boolean }[];
  onImageLoad: (index: number) => void;
  onClick: () => void;
}

const VerticalReader = memo(
  ({ images, onImageLoad, onClick }: VerticalReaderProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { markSettled, ready, isEmpty } = useImagesSettled(images);

    // Remonter en haut quand les images changent
    useEffect(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop = 0;
      }
    }, [images]);

    const handleImageLoad = (index: number) => {
      onImageLoad(index);
      markSettled(index);
    };

    if (isEmpty) return <ChapterUnavailable onClick={onClick} />;

    return (
      <>
        {!ready && <ImageLoader />}
        <div
          ref={scrollContainerRef}
          className='w-full h-screen overflow-y-auto flex flex-col items-center pt-20 pb-20'
          onClick={onClick}
        >
          {images.map((imageScan, index) => (
            <div key={index} className='w-full flex justify-center mb-4'>
              <ScanImage
                key={imageScan.url}
                url={imageScan.url}
                index={index}
                className='max-w-full h-auto'
                onLoad={handleImageLoad}
                onError={markSettled}
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
