import React from 'react';
import { MapPin } from 'lucide-react';

const LocationFilter = ({
  value = '',
  onChange,
  options = ['Bengaluru', 'Delhi', 'Mumbai', 'Chennai', 'Hyderabad', 'Pune', 'Jaipur'],
  className = '',
}) => {
  return (
    <div className={`filter-section ${className}`}>
      <h3 className="filter-title">Location</h3>
      
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
        
        <select
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="input-field pl-10 appearance-none"
        >
          <option value="">All Cities</option>
          {options.map((location) => (
            <option key={location} value={location}>
              {location}
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

export default LocationFilter;