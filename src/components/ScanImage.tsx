import { useState } from "react";
import { ImageOff, RotateCw } from "lucide-react";

/** URL d'affichage d'une page de scan (AnimeSama, ou lelmanga via le proxy de compression). */
function scanImageSrc(url: string, attempt = 0): string {
  const src = url.includes("lelmanga")
    ? `https://hangoverscans.fr/compressImage.php?imgurl=${url}`
    : `https://anime-sama.to${url}`;
  if (attempt === 0) return src;
  // Paramètre factice pour contourner le cache du navigateur lors d'un nouvel essai
  return `${src}${src.includes("?") ? "&" : "?"}essai=${attempt}`;
}

interface ScanImageProps {
  url: string;
  index: number;
  className?: string;
  onLoad: (index: number) => void;
  onError: (index: number) => void;
}

/**
 * Page de scan avec gestion d'erreur : si l'image ne se charge pas, on affiche un encart
 * « Page indisponible » avec un bouton pour réessayer, au lieu de bloquer le lecteur.
 */
const ScanImage = ({ url, index, className, onLoad, onError }: ScanImageProps) => {
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const fail = () => {
    setFailed(true);
    onError(index);
  };

  if (failed) {
    return (
      <div className='flex flex-col items-center justify-center gap-3 w-full max-w-md py-16 text-white/70'>
        <ImageOff className='h-10 w-10' />
        <p className='text-sm'>Page {index + 1} indisponible</p>
        <button
          type='button'
          onClick={(e) => {
            e.stopPropagation();
            setFailed(false);
            setAttempt((a) => a + 1);
          }}
          className='inline-flex items-center gap-2 rounded-md border border-white/30 px-3 py-1.5 text-sm text-white hover:bg-white/10'
        >
          <RotateCw className='h-4 w-4' />
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <img
      key={attempt}
      src={scanImageSrc(url, attempt)}
      ref={(el) => {
        // Image déjà terminée avant que React n'écoute ses événements (cache)
        if (!el?.complete) return;
        if (el.naturalWidth > 0) onLoad(index);
        else fail();
      }}
      alt={`Page ${index + 1}`}
      className={className}
      onLoad={() => onLoad(index)}
      onError={fail}
    />
  );
};

export default ScanImage;
