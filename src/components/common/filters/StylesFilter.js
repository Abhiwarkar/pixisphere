import React from 'react';

const StylesFilter = ({
  value = [],
  onChange,
  options = ['Outdoor', 'Studio', 'Candid', 'Traditional', 'Indoor'],
  className = '',
}) => {
  const handleToggle = (style) => {
    const newValue = value.includes(style)
      ? value.filter(s => s !== style)
      : [...value, style];
    onChange?.(newValue);
  };

  return (
    <div className={`filter-section ${className}`}>
      <h3 className="filter-title">Photography Styles</h3>
      
      <div className="space-y-2">
        {options.map((style) => (
          <label key={style} className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value.includes(style)}
              onChange={() => handleToggle(style)}
              className="sr-only"
            />
            
            <div className={`w-4 h-4 rounded border-2 mr-3 flex items-center justify-center ${
              value.includes(style)
                ? 'border-primary-600 bg-primary-600'
                : 'border-neutral-300'
            }`}>
              {value.includes(style) && (
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            
            <span className="text-sm text-neutral-700">{style}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default StylesFilter;