import React from 'react';
import { Star } from 'lucide-react';

const RatingFilter = ({
  value = 0,
  onChange,
  className = '',
}) => {
  const ratingOptions = [
    { value: 4, label: '4+ Stars' },
    { value: 3, label: '3+ Stars' },
    { value: 2, label: '2+ Stars' },
    { value: 1, label: '1+ Stars' },
    { value: 0, label: 'All Ratings' },
  ];

  return (
    <div className={`filter-section ${className}`}>
      <h3 className="filter-title">Rating</h3>
      
      <div className="space-y-2">
        {ratingOptions.map((option) => (
          <label key={option.value} className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="rating"
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange?.(parseInt(e.target.value))}
              className="sr-only"
            />
            
            <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
              value === option.value 
                ? 'border-primary-600 bg-primary-600' 
                : 'border-neutral-300'
            }`}>
              {value === option.value && (
                <div className="w-2 h-2 bg-white rounded-full" />
              )}
            </div>
            
            <div className="flex items-center">
              {option.value > 0 && (
                <div className="flex items-center mr-2">
                  {Array.from({ length: option.value }, (_, i) => (
                    <Star key={i} size={14} className="text-yellow-400 fill-current" />
                  ))}
                </div>
              )}
              <span className="text-sm text-neutral-700">{option.label}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RatingFilter;