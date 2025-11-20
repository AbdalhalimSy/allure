"use client";

import React from "react";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-md bg-gray-200/80 dark:bg-gray-800/60 ${className}`}
      aria-hidden
    />
  );
}

type LineProps = {
  width?: string;
  className?: string;
};

export function SkeletonLine({ width = "w-full", className = "" }: LineProps) {
  return <Skeleton className={`${width} h-3 ${className}`} />;
}

type CircleProps = {
  size?: string;
  className?: string;
};

export function SkeletonCircle({ size = "h-10 w-10", className = "" }: CircleProps) {
  return <div className={`animate-pulse rounded-full bg-gray-200/80 dark:bg-gray-800/60 ${size} ${className}`} />;
}

export default Skeleton;
