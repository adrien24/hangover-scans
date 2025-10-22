import { memo, useState, useEffect } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel'
import ImageLoader from '@/components/ImageLoader'

interface CarouselReaderProps {
  images: { url: string; loaded: boolean }[]
  onImageLoad: (index: number) => void
  onClick: () => void
}

const CarouselReader = memo(({ images, onImageLoad, onClick }: CarouselReaderProps) => {
  const [loadedCount, setLoadedCount] = useState(0)

  useEffect(() => {
    setLoadedCount(0)
  }, [images])

  const handleImageLoad = (index: number) => {
    onImageLoad(index)
    setLoadedCount((prev) => prev + 1)
  }

  const allImagesLoaded = images.length > 0 && loadedCount === images.length

  return (
    <>
      {!allImagesLoaded && <ImageLoader />}
      <div className="w-full h-screen flex items-center justify-center" onClick={onClick}>
        <Carousel className="w-full max-w-4xl">
          <CarouselContent>
            {images.map((imageScan, index) => (
              <CarouselItem key={index} className="flex items-center justify-center">
                <div className="w-full h-screen flex items-center justify-center">
                  <img
                    src={`${
                      imageScan.url.includes('lelmanga') || imageScan.url.includes('anime-sama.fr')
                        ? `https://hangoverscans.fr/compressImage.php?imgurl=${imageScan.url}`
                        : imageScan.url
                    }`}
                    alt={`Page ${index + 1}`}
                    className="max-h-screen max-w-full object-contain"
                    onLoad={() => {
                      handleImageLoad(index)
                    }}
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4 hidden" />
          <CarouselNext className="right-4 hidden" />
        </Carousel>
      </div>
    </>
  )
})

CarouselReader.displayName = 'CarouselReader'

export default CarouselReader
