import { memo, useState, useEffect } from 'react'
import ImageLoader from '@/components/ImageLoader'

interface VerticalReaderProps {
  images: { url: string; loaded: boolean }[]
  onImageLoad: (index: number) => void
  onClick: () => void
}

const VerticalReader = memo(({ images, onImageLoad, onClick }: VerticalReaderProps) => {
  const [loadedCount, setLoadedCount] = useState(0)

  // Réinitialiser le compteur quand les images changent
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
      <div
        className="w-full h-screen overflow-y-auto flex flex-col items-center pt-20 pb-20"
        onClick={onClick}
      >
        {images.map((imageScan, index) => (
          <div key={index} className="w-full flex justify-center mb-4">
            <img
              src={`https://hangoverscans.fr/compressImage.php?imgurl=${imageScan.url}`}
              alt={`Page ${index + 1}`}
              className="max-w-full h-auto"
              onLoad={() => {
                handleImageLoad(index)
              }}
            />
          </div>
        ))}
      </div>
    </>
  )
})

VerticalReader.displayName = 'VerticalReader'

export default VerticalReader
