import React from 'react';

const Skeleton = ({
  width = 'w-full',
  height = 'h-4',
  rounded = 'rounded',
  className = '',
  animate = true,
  ...props
}) => {
  const baseStyles = 'bg-neutral-200';
  const animationStyles = animate ? 'animate-pulse' : '';
  
  const skeletonStyles = [
    baseStyles,
    animationStyles,
    width,
    height,
    rounded,
    className,
  ].filter(Boolean).join(' ');
  
  return <div className={skeletonStyles} {...props} />;
};

// Text skeleton component
export const SkeletonText = ({
  lines = 1,
  lastLineWidth = 'w-3/4',
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          width={index === lines - 1 && lines > 1 ? lastLineWidth : 'w-full'}
          height="h-4"
          {...props}
        />
      ))}
    </div>
  );
};

// Avatar skeleton component
export const SkeletonAvatar = ({
  size = 'md',
  className = '',
  ...props
}) => {
  const sizeStyles = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
  };
  
  return (
    <Skeleton
      width={sizeStyles[size]}
      height={sizeStyles[size]}
      rounded="rounded-full"
      className={className}
      {...props}
    />
  );
};

// Image skeleton component
export const SkeletonImage = ({
  aspectRatio = 'aspect-video', // aspect-square, aspect-video, aspect-[4/3], etc.
  className = '',
  ...props
}) => {
  return (
    <Skeleton
      width="w-full"
      height="h-full"
      rounded="rounded-lg"
      className={`${aspectRatio} ${className}`}
      {...props}
    />
  );
};

// Button skeleton component
export const SkeletonButton = ({
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const sizeStyles = {
    xs: 'h-6 w-16',
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-28',
    xl: 'h-14 w-32',
  };
  
  return (
    <Skeleton
      width={fullWidth ? 'w-full' : sizeStyles[size].split(' ')[1]}
      height={sizeStyles[size].split(' ')[0]}
      rounded="rounded-lg"
      className={className}
      {...props}
    />
  );
};

// Card skeleton component
export const SkeletonCard = ({
  showImage = true,
  showAvatar = false,
  imageAspectRatio = 'aspect-video',
  textLines = 3,
  showButton = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`card space-y-4 p-4 ${className}`} {...props}>
      {/* Image */}
      {showImage && (
        <SkeletonImage aspectRatio={imageAspectRatio} />
      )}
      
      {/* Header with avatar */}
      {showAvatar && (
        <div className="flex items-center space-x-3">
          <SkeletonAvatar size="md" />
          <div className="flex-1 space-y-2">
            <Skeleton width="w-1/3" height="h-4" />
            <Skeleton width="w-1/4" height="h-3" />
          </div>
        </div>
      )}
      
      {/* Text content */}
      <div className="space-y-3">
        <SkeletonText lines={textLines} />
      </div>
      
      {/* Footer with button */}
      {showButton && (
        <div className="flex justify-end">
          <SkeletonButton size="md" />
        </div>
      )}
    </div>
  );
};

// List skeleton component
export const SkeletonList = ({
  items = 5,
  showAvatar = true,
  showImage = false,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {Array.from({ length: items }, (_, index) => (
        <div key={index} className="flex items-center space-x-4 p-4 card">
          {showAvatar && <SkeletonAvatar size="lg" />}
          {showImage && (
            <SkeletonImage aspectRatio="aspect-square" className="w-16 h-16" />
          )}
          <div className="flex-1 space-y-2">
            <Skeleton width="w-1/3" height="h-5" />
            <Skeleton width="w-full" height="h-4" />
            <Skeleton width="w-2/3" height="h-4" />
          </div>
        </div>
      ))}
    </div>
  );
};

// Table skeleton component
export const SkeletonTable = ({
  rows = 5,
  columns = 4,
  showHeader = true,
  className = '',
  ...props
}) => {
  return (
    <div className={`space-y-4 ${className}`} {...props}>
      {/* Header */}
      {showHeader && (
        <div className="grid grid-cols-4 gap-4 p-4 bg-neutral-50 rounded-lg">
          {Array.from({ length: columns }, (_, index) => (
            <Skeleton key={index} width="w-3/4" height="h-4" />
          ))}
        </div>
      )}
      
      {/* Rows */}
      {Array.from({ length: rows }, (_, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-4 gap-4 p-4 border-b border-neutral-200">
          {Array.from({ length: columns }, (_, colIndex) => (
            <Skeleton key={colIndex} width="w-full" height="h-4" />
          ))}
        </div>
      ))}
    </div>
  );
};

// Photographer card skeleton (specific to our app)
export const SkeletonPhotographerCard = ({
  className = '',
  ...props
}) => {
  return (
    <div className={`card card-hover p-0 overflow-hidden ${className}`} {...props}>
      {/* Image */}
      <SkeletonImage aspectRatio="aspect-[4/3]" className="rounded-none" />
      
      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <Skeleton width="w-3/4" height="h-5" />
            <Skeleton width="w-1/2" height="h-4" />
          </div>
          <div className="ml-4">
            <Skeleton width="w-16" height="h-6" rounded="rounded-full" />
          </div>
        </div>
        
        {/* Tags */}
        <div className="flex gap-2">
          <Skeleton width="w-16" height="h-6" rounded="rounded-full" />
          <Skeleton width="w-20" height="h-6" rounded="rounded-full" />
        </div>
        
        {/* Rating and price */}
        <div className="flex items-center justify-between">
          <Skeleton width="w-24" height="h-4" />
          <Skeleton width="w-20" height="h-6" />
        </div>
        
        {/* Button */}
        <SkeletonButton size="md" fullWidth />
      </div>
    </div>
  );
};

// Loading container component
export const SkeletonContainer = ({
  children,
  loading = false,
  skeleton,
  className = '',
  ...props
}) => {
  if (loading) {
    return skeleton || <Skeleton className={className} {...props} />;
  }
  
  return children;
};

export default Skeleton;