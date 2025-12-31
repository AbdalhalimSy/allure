import Image from "next/image";
import { FeatureImageProps } from "./types";

export function FeatureImage({ featurePhoto, alt, fallbackLabel }: FeatureImageProps) {
  return (
    <div className="shrink-0 w-full md:w-72 lg:w-80 sticky top-6 self-start">
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-2xl bg-linear-to-br from-gray-100 to-gray-200 shadow-lg">
        {featurePhoto ? (
          <Image src={featurePhoto.url} alt={alt} fill className="object-cover" priority />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-gray-400">{fallbackLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
