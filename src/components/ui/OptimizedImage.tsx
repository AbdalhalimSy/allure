"use client";

import Image, { ImageProps } from "next/image";

type Props = Omit<ImageProps, "width" | "height"> & {
  width?: number;
  height?: number;
  quality?: number;
  fill?: boolean;
};

export default function OptimizedImage({
  alt,
  src,
  width = 1200,
  height = 800,
  quality = 75,
  fill = false,
  className,
  ...rest
}: Props) {
  const sizes = rest.sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 1200px";

  return (
    <Image
      alt={alt}
      src={src}
      quality={quality}
      sizes={sizes}
      className={className}
      {...(fill ? { fill: true } : { width, height })}
      {...rest}
    />
  );
}