import useScansController from '@/hooks/useScansController'
import { useReaderModeStorage } from '@/hooks/useReaderModeStorage'
import { useBookmarkStorage } from '@/hooks/useBookmarkStorage'
import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ReaderHeader from '@/components/ReaderHeader'
import CarouselReader from '@/components/CarouselReader'
import VerticalReader from '@/components/VerticalReader'

const ChapterReader = () => {
  const { title, id } = useParams()
  const navigate = useNavigate()
  const [showHeader, setShowHeader] = useState(false)
  const { getMangaMode, saveMangaMode, initialMode } = useReaderModeStorage(title)
  const { getCurrentPage, markChapterAsFinished } = useBookmarkStorage()
  const [isCarouselMode, setIsCarouselMode] = useState(initialMode === 'carousel')
  const currentPage = getCurrentPage(title, id)

  const controller = useScansController(id, title)

  // Masquer le header après 3 secondes d'inactivité
  useEffect(() => {
    if (!showHeader) return

    const timer = setTimeout(() => {
      setShowHeader(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [showHeader])

  const handlePageClick = () => {
    setShowHeader(!showHeader)
  }

  const handleToggleMode = () => {
    setIsCarouselMode((prevMode) => {
      const newMode = !prevMode
      // Sauvegarder le nouveau mode dans localStorage
      saveMangaMode(title!, newMode ? 'carousel' : 'vertical')
      return newMode
    })
  }

  const handleImageLoad = (index: number) => {
    controller.imagesScans[index].loaded = true
  }

  const handleNextChapter = () => {
    const nextChapterId = parseInt(String(id)) + 1
    // Marquer le chapitre actuel comme finished
    if (title && id) {
      markChapterAsFinished(title, parseInt(String(id)))
    }
    navigate(`/manga/${title}/chapter/${nextChapterId}`)
  }

  return (
    <div className="w-full h-screen flex flex-col bg-black">
      <ReaderHeader
        title={title}
        isVisible={showHeader}
        isCarouselMode={isCarouselMode}
        onToggleMode={handleToggleMode}
        onNextChapter={handleNextChapter}
        isNextChapterAvailable={controller.isNextChapterAvailable}
      />

      {isCarouselMode ? (
        <CarouselReader
          images={controller.imagesScans}
          onImageLoad={handleImageLoad}
          onClick={handlePageClick}
          mangaTitle={title}
          chapterId={id}
          currentPage={currentPage}
        />
      ) : (
        <VerticalReader
          images={controller.imagesScans}
          onImageLoad={handleImageLoad}
          onClick={handlePageClick}
        />
      )}
    </div>
  )
}

export default ChapterReader
