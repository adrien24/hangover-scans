import { Loader2 } from 'lucide-react'

const ImageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 w-full h-screen flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 text-white animate-spin" />
        <p className="text-white text-sm">Chargement des images...</p>
      </div>
    </div>
  )
}

export default ImageLoader
