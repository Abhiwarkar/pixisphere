import React from 'react';
import { ArrowUpDown } from 'lucide-react';

const SortOptions = ({
  value = 'rating-high-low',
  onChange,
  className = '',
}) => {
  const sortOptions = [
    { value: 'rating-high-low', label: 'Rating: High to Low' },
    { value: 'rating-low-high', label: 'Rating: Low to High' },
    { value: 'price-low-high', label: 'Price: Low to High' },
    { value: 'price-high-low', label: 'Price: High to Low' },
    { value: 'name-a-z', label: 'Name: A to Z' },
    { value: 'recently-added', label: 'Recently Added' },
  ];

  return (
    <div className={`filter-section ${className}`}>
      <h3 className="filter-title">Sort By</h3>
      
      <div className="relative">
        <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
        
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="input-field pl-10 appearance-none"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg className="h-4 w-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SortOptions;