import { ImageOff } from "lucide-react";

/** Affiché à la place du chargement infini quand un chapitre n'a aucune page. */
const ChapterUnavailable = ({ onClick }: { onClick: () => void }) => (
  <div
    className='w-full h-screen flex flex-col items-center justify-center gap-4 text-white/70'
    onClick={onClick}
  >
    <ImageOff className='h-12 w-12' />
    <p className='text-sm'>Aucune page disponible pour ce chapitre.</p>
  </div>
);

export default ChapterUnavailable;
