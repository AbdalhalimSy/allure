'use client';

interface LoaderProps {
  /**
   * Size of the loader
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Variant of the loader animation
   * @default 'spinner'
   */
  variant?: 'spinner' | 'dots' | 'pulse' | 'ring';
  
  /**
   * Color of the loader
   * @default 'primary' (#c49a47)
   */
  color?: 'primary' | 'white' | 'gray' | 'black';
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Optional text to display below loader
   */
  text?: string;
  
  /**
   * Center the loader in its container
   * @default false
   */
  center?: boolean;
}

const sizeClasses = {
  spinner: {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-3',
    xl: 'h-12 w-12 border-4',
  },
  dots: {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-3 w-3',
    xl: 'h-4 w-4',
  },
  pulse: {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12',
  },
  ring: {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-3',
    xl: 'h-12 w-12 border-4',
  },
};

const colorClasses = {
  primary: {
    spinner: 'border-gray-300 border-t-[#c49a47]',
    dots: 'bg-[#c49a47]',
    pulse: 'bg-[#c49a47]',
    ring: 'border-[#c49a47]/20 border-t-[#c49a47]',
  },
  white: {
    spinner: 'border-white/30 border-t-white',
    dots: 'bg-white',
    pulse: 'bg-white',
    ring: 'border-white/20 border-t-white',
  },
  gray: {
    spinner: 'border-gray-200 border-t-gray-500',
    dots: 'bg-gray-500',
    pulse: 'bg-gray-500',
    ring: 'border-gray-200 border-t-gray-500',
  },
  black: {
    spinner: 'border-black/30 border-t-black',
    dots: 'bg-black',
    pulse: 'bg-black',
    ring: 'border-black/20 border-t-black',
  },
};

export default function Loader({
  size = 'md',
  variant = 'spinner',
  color = 'primary',
  className = '',
  text,
  center = false,
}: LoaderProps) {
  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div
            className={`animate-spin rounded-full ${sizeClasses.spinner[size]} ${colorClasses[color].spinner} ${className}`}
            role="status"
            aria-label="Loading"
          />
        );

      case 'dots':
        return (
          <div className={`flex items-center gap-1.5 ${className}`} role="status" aria-label="Loading">
            <div
              className={`${sizeClasses.dots[size]} ${colorClasses[color].dots} rounded-full animate-bounce`}
              style={{ animationDelay: '0ms' }}
            />
            <div
              className={`${sizeClasses.dots[size]} ${colorClasses[color].dots} rounded-full animate-bounce`}
              style={{ animationDelay: '150ms' }}
            />
            <div
              className={`${sizeClasses.dots[size]} ${colorClasses[color].dots} rounded-full animate-bounce`}
              style={{ animationDelay: '300ms' }}
            />
          </div>
        );

      case 'pulse':
        return (
          <div
            className={`${sizeClasses.pulse[size]} ${colorClasses[color].pulse} rounded-full animate-pulse ${className}`}
            role="status"
            aria-label="Loading"
          />
        );

      case 'ring':
        return (
          <div className={`relative ${className}`} role="status" aria-label="Loading">
            <div
              className={`${sizeClasses.ring[size]} ${colorClasses[color].ring} rounded-full animate-spin`}
            />
            <div
              className={`absolute inset-0 ${sizeClasses.ring[size]} ${colorClasses[color].ring} rounded-full animate-spin`}
              style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
            />
          </div>
        );

      default:
        return null;
    }
  };

  const content = (
    <div className={`inline-flex flex-col items-center gap-2 ${center ? 'justify-center' : ''}`}>
      {renderLoader()}
      {text && (
 <span className="text-sm text-gray-600 ">
          {text}
        </span>
      )}
    </div>
  );

  if (center) {
    return (
      <div className="flex items-center justify-center w-full h-full min-h-[100px]">
        {content}
      </div>
    );
  }

  return content;
}
