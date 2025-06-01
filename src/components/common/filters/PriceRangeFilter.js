import React, { useState } from 'react';
import { utils } from '../../../utils/api';

const PriceRangeFilter = ({
  min = 0,
  max = 20000,
  value = [0, 20000],
  onChange,
  step = 1000,
  className = '',
}) => {
  const [maxPrice, setMaxPrice] = useState(value[1]);

  const handleChange = (e) => {
    const newMax = parseInt(e.target.value);
    setMaxPrice(newMax);
    onChange?.([min, newMax]);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <label className="filter-title">Price Range</label>
        
        <div className="space-y-3">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={maxPrice}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        
        <div className="flex items-center justify-between text-sm font-medium">
          <span>{utils.formatPrice(min)}</span>
          <span>{utils.formatPrice(maxPrice)}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeFilter;