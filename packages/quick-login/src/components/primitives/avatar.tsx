import { useState } from 'react';

interface AvatarProps {
  src?: string;
  alt: string;
  fallback: string;
  size?: 'sm' | 'md' | 'lg';
  colorClass?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
};

export function Avatar({
  src,
  alt,
  fallback,
  size = 'md',
  colorClass = 'bg-gray-500',
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return (
      <div
        className={`${sizeClasses[size]} ${colorClass} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}
        role="img"
        aria-label={alt}
      >
        {fallback}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setImageError(true)}
      className={`${sizeClasses[size]} rounded-full object-cover flex-shrink-0`}
    />
  );
}
