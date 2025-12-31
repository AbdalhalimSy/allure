import Image from "next/image";
import { X, Music2 } from "lucide-react";
import { LightboxProps } from "./types";

export function Lightbox({ item, onClose }: LightboxProps) {
  if (!item) return null;

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-3 right-3 z-10 rounded-full bg-white/90 p-2 shadow hover:bg-white"
          onClick={onClose}
        >
          <X className="h-5 w-5 text-gray-900" />
        </button>

        {item.type === "photo" && (
          <div className="relative w-full h-[70vh] min-h-[320px]">
            <Image src={item.url} alt="Media" fill className="object-contain" />
          </div>
        )}

        {item.type === "video" && (
          <div className="relative w-full bg-black">
            <video src={item.url} controls className="w-full h-full max-h-[70vh]" />
          </div>
        )}

        {item.type === "audio" && (
          <div className="p-6 flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Music2 className="h-6 w-6" />
            </div>
            <audio src={item.url} controls className="w-full" />
          </div>
        )}
      </div>
    </div>
  );
}
