import Image from "next/image";
import { X, Music2, ChevronLeft, ChevronRight } from "lucide-react";
import { LightboxProps } from "./types";

export function Lightbox({
  item,
  onClose,
  onPrevious,
  onNext,
  hasNext,
  hasPrevious,
}: LightboxProps) {
  if (!item) return null;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" && hasPrevious && onPrevious) {
      onPrevious();
    } else if (e.key === "ArrowRight" && hasNext && onNext) {
      onNext();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-70 bg-black/95 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <button
        className="absolute top-4 end-4 z-10 rounded-full bg-white/10 hover:bg-white/20 p-2 sm:p-3 backdrop-blur-sm transition-all shadow-lg"
        onClick={onClose}
        aria-label="Close"
      >
        <X className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
      </button>

      {hasPrevious && onPrevious && (
        <button
          className="absolute start-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 hover:bg-white/20 p-3 sm:p-4 backdrop-blur-sm transition-all shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            onPrevious();
          }}
          aria-label="Previous"
        >
          <ChevronLeft className="h-6 w-6 sm:h-8 sm:w-8 text-white rtl:scale-x-[-1]" />
        </button>
      )}

      {hasNext && onNext && (
        <button
          className="absolute end-4 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 hover:bg-white/20 p-3 sm:p-4 backdrop-blur-sm transition-all shadow-lg"
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          aria-label="Next"
        >
          <ChevronRight className="h-6 w-6 sm:h-8 sm:w-8 text-white rtl:scale-x-[-1]" />
        </button>
      )}

      <div
        className="relative w-full max-w-6xl max-h-[95vh] flex items-center justify-center px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {item.type === "photo" && (
          <div className="relative w-full h-[70vh] sm:h-[80vh] min-h-[300px]">
            <Image
              src={item.url}
              alt="Media"
              fill
              className="object-contain"
              quality={100}
            />
          </div>
        )}

        {item.type === "video" && (
          <div className="relative w-full">
            <video
              src={item.url}
              controls
              className="w-full max-h-[70vh] sm:max-h-[80vh] rounded-lg"
              autoPlay
            />
          </div>
        )}

        {item.type === "audio" && (
          <div className="p-6 sm:p-8 flex items-center gap-4 sm:gap-6 rounded-2xl bg-white/10 backdrop-blur-md max-w-2xl w-full">
            <div className="h-12 w-12 sm:h-16 sm:w-16 shrink-0 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Music2 className="h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <audio
              src={item.url}
              controls
              className="w-full min-w-0"
              autoPlay
            />
          </div>
        )}
      </div>
    </div>
  );
}
