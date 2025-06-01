import React, { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';

const Rating = ({
  value = 0,
  maxRating = 5,
  size = 'md',
  readonly = true,
  showValue = false,
  showCount = false,
  count = 0,
  precision = 0.1, // 0.1 for half stars, 1 for whole stars
  onChange,
  className = '',
  starClassName = '',
  emptyColor = 'text-neutral-300',
  fillColor = 'text-yellow-400',
  hoverColor = 'text-yellow-500',
  ...props
}) => {
  const [hoverValue, setHoverValue] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  
  // Size configurations
  const sizeConfig = {
    xs: { size: 12, gap: 'gap-0.5', text: 'text-xs' },
    sm: { size: 14, gap: 'gap-0.5', text: 'text-sm' },
    md: { size: 16, gap: 'gap-1', text: 'text-sm' },
    lg: { size: 20, gap: 'gap-1', text: 'text-base' },
    xl: { size: 24, gap: 'gap-1.5', text: 'text-lg' },
  };
  
  const config = sizeConfig[size];
  
  // Calculate display value (use hover value during interaction)
  const displayValue = isHovering && !readonly ? hoverValue : value;
  
  // Handle star click
  const handleStarClick = (rating) => {
    if (readonly || !onChange) return;
    onChange(rating);
  };
  
  // Handle star hover
  const handleStarHover = (rating) => {
    if (readonly) return;
    setHoverValue(rating);
    setIsHovering(true);
  };
  
  // Handle mouse leave
  const handleMouseLeave = () => {
    if (readonly) return;
    setIsHovering(false);
    setHoverValue(0);
  };
  
  // Generate stars array
  const stars = Array.from({ length: maxRating }, (_, index) => {
    const starValue = index + 1;
    const isActive = displayValue >= starValue;
    const isHalfActive = displayValue >= starValue - 0.5 && displayValue < starValue;
    const isHovered = !readonly && isHovering && hoverValue >= starValue;
    
    return {
      index,
      value: starValue,
      isActive,
      isHalfActive,
      isHovered,
    };
  });
  
  // Star component
  const StarIcon = ({ star, onClick, onHover }) => {
    const getStarColor = () => {
      if (star.isHovered) return hoverColor;
      if (star.isActive) return fillColor;
      return emptyColor;
    };
    
    const getStarIcon = () => {
      if (star.isActive) return <Star size={config.size} className="fill-current" />;
      if (star.isHalfActive) return <StarHalf size={config.size} className="fill-current" />;
      return <Star size={config.size} />;
    };
    
    return (
      <button
        type="button"
        className={`${getStarColor()} transition-colors duration-150 ${
          readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
        } ${starClassName}`}
        onClick={() => onClick?.(star.value)}
        onMouseEnter={() => onHover?.(star.value)}
        disabled={readonly}
        aria-label={`Rate ${star.value} out of ${maxRating} stars`}
      >
        {getStarIcon()}
      </button>
    );
  };
  
  return (
    <div 
      className={`flex items-center ${config.gap} ${className}`}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {/* Stars */}
      <div className={`flex items-center ${config.gap}`}>
        {stars.map((star) => (
          <StarIcon
            key={star.index}
            star={star}
            onClick={handleStarClick}
            onHover={handleStarHover}
          />
        ))}
      </div>
      
      {/* Rating value */}
      {showValue && (
        <span className={`font-medium text-neutral-700 ml-2 ${config.text}`}>
          {displayValue.toFixed(1)}
        </span>
      )}
      
      {/* Rating count */}
      {showCount && count > 0 && (
        <span className={`text-neutral-500 ml-1 ${config.text}`}>
          ({count.toLocaleString()})
        </span>
      )}
    </div>
  );
};

// Read-only rating display component
export const RatingDisplay = ({
  value = 0,
  maxRating = 5,
  size = 'md',
  showValue = true,
  showCount = false,
  count = 0,
  className = '',
  ...props
}) => {
  return (
    <Rating
      value={value}
      maxRating={maxRating}
      size={size}
      readonly={true}
      showValue={showValue}
      showCount={showCount}
      count={count}
      className={className}
      {...props}
    />
  );
};

// Interactive rating input component
export const RatingInput = ({
  value = 0,
  maxRating = 5,
  size = 'lg',
  precision = 1,
  onChange,
  className = '',
  label = '',
  error = '',
  ...props
}) => {
  return (
    <div className={`${className}`}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          {label}
        </label>
      )}
      
      <Rating
        value={value}
        maxRating={maxRating}
        size={size}
        readonly={false}
        precision={precision}
        onChange={onChange}
        showValue={true}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// Rating summary component for displaying rating breakdown
export const RatingSummary = ({
  averageRating = 0,
  totalReviews = 0,
  ratingBreakdown = {}, // { 5: 120, 4: 80, 3: 20, 2: 10, 1: 5 }
  maxRating = 5,
  size = 'md',
  showPercentages = true,
  className = '',
}) => {
  const total = Object.values(ratingBreakdown).reduce((sum, count) => sum + count, 0);
  
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Overall rating */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-3xl font-bold text-neutral-800">
            {averageRating.toFixed(1)}
          </div>
          <RatingDisplay
            value={averageRating}
            maxRating={maxRating}
            size={size}
            showValue={false}
          />
          <div className="text-sm text-neutral-500 mt-1">
            {totalReviews.toLocaleString()} reviews
          </div>
        </div>
      </div>
      
      {/* Rating breakdown */}
      {Object.keys(ratingBreakdown).length > 0 && (
        <div className="space-y-2">
          {Array.from({ length: maxRating }, (_, i) => {
            const rating = maxRating - i;
            const count = ratingBreakdown[rating] || 0;
            const percentage = total > 0 ? (count / total) * 100 : 0;
            
            return (
              <div key={rating} className="flex items-center gap-2 text-sm">
                <span className="w-3 text-neutral-600">{rating}</span>
                <Star size={12} className="text-neutral-400" />
                
                <div className="flex-1 bg-neutral-200 rounded-full h-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                {showPercentages ? (
                  <span className="w-12 text-right text-neutral-500">
                    {percentage.toFixed(0)}%
                  </span>
                ) : (
                  <span className="w-12 text-right text-neutral-500">
                    {count}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Rating;