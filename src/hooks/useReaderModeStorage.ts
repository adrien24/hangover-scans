interface MangaReaderMode {
  title: string
  mode: 'carousel' | 'vertical'
}

const STORAGE_KEY = 'manga-reader-modes'

export function useReaderModeStorage(mangaTitle?: string) {
  const getMangaModes = (): MangaReaderMode[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  const getMangaMode = (title?: string): 'carousel' | 'vertical' => {
    if (!title) return 'carousel'
    const modes = getMangaModes()
    const manga = modes.find((m) => m.title === title)
    return manga ? manga.mode : 'carousel'
  }

  const saveMangaMode = (title: string, mode: 'carousel' | 'vertical') => {
    const modes = getMangaModes()
    const index = modes.findIndex((m) => m.title === title)

    if (index !== -1) {
      // Mettre à jour le mode existant
      modes[index].mode = mode
    } else {
      // Ajouter un nouveau manga
      modes.push({ title, mode })
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(modes))
  }

  const initialMode = getMangaMode(mangaTitle)

  return {
    getMangaModes,
    getMangaMode,
    saveMangaMode,
    initialMode,
  }
}
