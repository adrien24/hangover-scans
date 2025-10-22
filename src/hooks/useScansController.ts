import { useEffect, useState, useCallback } from 'react'
import { getAllScans } from '@/services/getAllScans.service'

type Chapter = {
  id: number
  title: string
  description: string
  images: string[]
}

export type allChaptersResponse = {
  chapter: number
  title: string
}

export function useScansController(id?: string | number, title?: string) {
  const [scans, setScans] = useState<Chapter | null>(null)
  const [isReading, setIsReading] = useState(false)
  const [imagesScans, setImagesScans] = useState<{ url: string; loaded: boolean }[]>([])
  const [titleScan, setTitleScan] = useState('')
  const [showHeader, setShowHeader] = useState(false)
  const [isNextChapterAvailable, setIsNextChapterAvailable] = useState(true)
  const [isSlider, setIsSlider] = useState(true)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      if (!id && !title) return
      try {
        const data = await getAllScans(String(id), String(title))
        if (!mounted) return
        setScans(data)
        setImagesScans(data.images.map((img) => ({ url: img, loaded: false })))
        setTitleScan(data.title)
      } catch (err) {
        console.error('Failed to load scans in hook', err)
      }
    }

    load()

    return () => {
      mounted = false
    }
  }, [id, title])

  const toggleHeader = useCallback(() => {
    setShowHeader((s) => !s)
  }, [])

  const updateHistoryPages = useCallback(
    (
      nameScan: string,
      chapter: number,
      pages: number,
      finished: 'reading' | 'read' = 'reading'
    ) => {
      const history = localStorage.getItem(`scans-${nameScan}`)
      let historyParsed: { chapter: number; pages: number; finished: 'reading' | 'read' }[] = []
      if (history) historyParsed = JSON.parse(history)

      const index = historyParsed.findIndex((item) => item.chapter === chapter)

      if (index !== -1) {
        historyParsed[index].pages = pages
        historyParsed[index].finished = finished
      } else {
        historyParsed.push({ chapter, pages, finished })
      }
      localStorage.setItem(`scans-${nameScan}`, JSON.stringify(historyParsed))
    },
    []
  )

  const setPagesScans = useCallback((nameScan: string, chapter: number) => {
    const history = localStorage.getItem(`scans-${nameScan}`)
    let historyParsed: { chapter: number; pages: number; finished: 'reading' | 'read' }[] = []
    if (history) historyParsed = JSON.parse(history)

    const index = historyParsed.findIndex((item) => item.chapter === chapter)

    return historyParsed[index] ? historyParsed[index].pages : 0
  }, [])

  const nextChapterAvailable = useCallback(
    (currentId: string, allChapters: allChaptersResponse[]) => {
      const nextChapter = parseInt(currentId) + 1
      const available =
        nextChapter <= allChapters.length &&
        allChapters.some((chapter) => chapter.chapter === nextChapter)
      setIsNextChapterAvailable(available)
      return available
    },
    []
  )

  const scansOrientation = useCallback(
    (scanName: string) => {
      localStorage.setItem(`scans-orientation-${scanName}`, isSlider ? 'notSlider' : 'slider')
      const orientation = localStorage.getItem(`scans-orientation-${scanName}`)
      return orientation
    },
    [isSlider]
  )

  const menuItemsClicked = useCallback(
    (event: string, scansName: string) => {
      if (event === 'Lecture verticale/horizontale') {
        setIsSlider((s) => !s)
        scansOrientation(scansName)
      }
    },
    [scansOrientation]
  )

  return {
    scans,
    isReading,
    imagesScans,
    titleScan,
    showHeader,
    isNextChapterAvailable,
    isSlider,
    toggleHeader,
    updateHistoryPages,
    setPagesScans,
    nextChapterAvailable,
    scansOrientation,
    menuItemsClicked,
    setIsReading,
  }
}

export default useScansController
