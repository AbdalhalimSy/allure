import React from 'react';

// Simple Jest mock for next/image to silence missing src warnings and preserve alt/className.
// Provides a tiny transparent data URI as fallback if no src passed.
const FALLBACK_SRC = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';

// Match a subset of Next/Image props we actually use in tests.
interface MockImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  alt: string;
  src?: string;
  width?: number;
  height?: number;
  // Allow any other props Next might pass
  [key: string]: any;
}

const NextImageMock: React.FC<MockImageProps> = ({ src, alt, width, height, ...rest }) => {
  return (
    <img
      src={src || FALLBACK_SRC}
      alt={alt}
      width={width}
      height={height}
      {...rest}
      // Ensure predictable style for snapshots if added later
      style={{ ...(rest.style || {}), objectFit: 'cover' }}
      data-test="next-image-mock"
    />
  );
};

export default NextImageMock;
