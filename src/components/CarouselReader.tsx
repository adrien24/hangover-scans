import { memo, useState, useEffect } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from '@/components/ui/carousel'
import ImageLoader from '@/components/ImageLoader'
import { useBookmarkStorage } from '@/hooks/useBookmarkStorage'

interface CarouselReaderProps {
  images: { url: string; loaded: boolean }[]
  onImageLoad: (index: number) => void
  onClick: () => void
  mangaTitle?: string
  chapterId?: string | number
  currentPage?: number
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
    const [loadedCount, setLoadedCount] = useState(0)
    const [api, setApi] = useState<CarouselApi>()
    const [zoom, setZoom] = useState(1)
    const [isZoomed, setIsZoomed] = useState(false)
    const [panX, setPanX] = useState(0)
    const [panY, setPanY] = useState(0)
    const [isPanning, setIsPanning] = useState(false)
    const [panStartX, setPanStartX] = useState(0)
    const [panStartY, setPanStartY] = useState(0)
    const { saveBookmark } = useBookmarkStorage()

    useEffect(() => {
      setLoadedCount(0)
    }, [images])

    const handleImageLoad = (index: number) => {
      onImageLoad(index)
      setLoadedCount((prev) => prev + 1)
    }

    const allImagesLoaded = images.length > 0 && loadedCount === images.length

    // Sauvegarder la page actuelle du carousel
    useEffect(() => {
      if (!api || !mangaTitle || chapterId === undefined) return

      const handleSelect = () => {
        const currentIndex = api.selectedScrollSnap()
        saveBookmark(mangaTitle, Number(chapterId), currentIndex, false)
      }

      api.on('select', handleSelect)

      return () => {
        api.off('select', handleSelect)
      }
    }, [api, mangaTitle, chapterId, saveBookmark])

    // Aller à la page sauvegardée au chargement (après que toutes les images soient chargées)
    useEffect(() => {
      if (!api || !allImagesLoaded) return
      api.scrollTo(currentPage)
    }, [api, allImagesLoaded, currentPage])

    const handleWheel = (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? 0.9 : 1.1
        const newZoom = Math.max(1, Math.min(zoom * delta, 5))
        setZoom(newZoom)
        setIsZoomed(newZoom > 1)
      }
    }

    const handleMouseDown = (e: React.MouseEvent) => {
      if (!isZoomed) return
      setIsPanning(true)
      setPanStartX(e.clientX - panX)
      setPanStartY(e.clientY - panY)
    }

    const handleMouseMove = (e: React.MouseEvent) => {
      if (!isPanning || !isZoomed) return
      setPanX(e.clientX - panStartX)
      setPanY(e.clientY - panStartY)
    }

    const handleMouseUp = () => {
      setIsPanning(false)
    }

    const handleDoubleClick = () => {
      if (isZoomed) {
        setZoom(1)
        setIsZoomed(false)
        setPanX(0)
        setPanY(0)
      } else {
        setZoom(2)
        setIsZoomed(true)
      }
    }

    return (
      <>
        {!allImagesLoaded && <ImageLoader />}
        <div
          className="w-full h-screen flex items-center justify-center"
          onClick={onClick}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{ cursor: isZoomed ? (isPanning ? 'grabbing' : 'grab') : 'default' }}
        >
          <Carousel
            className="w-full max-w-4xl"
            setApi={setApi}
            opts={{
              skipSnaps: isZoomed,
            }}
          >
            <CarouselContent>
              {images.map((imageScan, index) => (
                <CarouselItem key={index} className="flex items-center justify-center">
                  <div className="w-full h-screen flex items-center justify-center overflow-hidden">
                    <img
                      src={`${
                        imageScan.url.includes('lelmanga')
                          ? `https://hangoverscans.fr/compressImage.php?imgurl=${imageScan.url}`
                          : imageScan.url
                      }`}
                      alt={`Page ${index + 1}`}
                      className="max-h-screen max-w-full object-contain transition-transform duration-200 select-none"
                      style={{
                        transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`,
                        cursor: 'default',
                      }}
                      onLoad={() => {
                        handleImageLoad(index)
                      }}
                      onDoubleClick={handleDoubleClick}
                      draggable={false}
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
  }
)

CarouselReader.displayName = 'CarouselReader'

export default CarouselReader
