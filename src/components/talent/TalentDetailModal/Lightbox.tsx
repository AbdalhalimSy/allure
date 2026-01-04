import Image from "next/image";
import { X, Music2 } from "lucide-react";
import { LightboxProps } from "./types";

export function Lightbox({ item, onClose }: LightboxProps) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-70 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-2 end-2 sm:top-3 sm:end-3 z-10 rounded-full bg-white/90 p-1.5 sm:p-2 shadow hover:bg-white"
          onClick={onClose}
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-900" />
        </button>

        {item.type === "photo" && (
          <div className="relative w-full h-[60vh] sm:h-[70vh] min-h-[280px] sm:min-h-80">
            <Image src={item.url} alt="Media" fill className="object-contain" />
          </div>
        )}

        {item.type === "video" && (
          <div className="relative w-full bg-black">
            <video src={item.url} controls className="w-full h-full max-h-[60vh] sm:max-h-[70vh]" />
          </div>
        )}

        {item.type === "audio" && (
          <div className="p-4 sm:p-6 flex items-center gap-3 sm:gap-4">
            <div className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Music2 className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <audio src={item.url} controls className="w-full min-w-0" />
          </div>
        )}
      </div>
    </div>
  );
}
