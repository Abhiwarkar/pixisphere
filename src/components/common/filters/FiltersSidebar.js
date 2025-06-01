import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { X, RotateCcw } from 'lucide-react';
import Button from '../../common/Button';
import PriceRangeFilter from './PriceRangeFilter';
import RatingFilter from './RatingFilter';
import StylesFilter from './StylesFilter';
import LocationFilter from './LocationFilter';
import SortOptions from './SortOptions';
import {
  setPriceRange,
  setRatingFilter,
  setStylesFilter,
  setLocationFilter,
  setSortBy,
  clearAllFilters,
  applyFilters,
  selectFilters,
  selectUniqueLocations,
  selectUniqueStyles,
  selectPriceRange,
} from '../../../redux/photoGrapherSlice';
import { closeMobileFilters, selectIsMobile } from '../../../redux/uiSlice';

const FilterSidebar = ({ className = '' }) => {
  const dispatch = useDispatch();
  const filters = useSelector(selectFilters);
  const uniqueLocations = useSelector(selectUniqueLocations);
  const uniqueStyles = useSelector(selectUniqueStyles);
  const priceRange = useSelector(selectPriceRange);
  const isMobile = useSelector(selectIsMobile);

  const handlePriceChange = (value) => {
    dispatch(setPriceRange({ minPrice: value[0], maxPrice: value[1] }));
    dispatch(applyFilters());
  };

  const handleRatingChange = (value) => {
    dispatch(setRatingFilter(value));
    dispatch(applyFilters());
  };

  const handleStylesChange = (value) => {
    dispatch(setStylesFilter(value));
    dispatch(applyFilters());
  };

  const handleLocationChange = (value) => {
    dispatch(setLocationFilter(value));
    dispatch(applyFilters());
  };

  const handleSortChange = (value) => {
    dispatch(setSortBy(value));
    dispatch(applyFilters());
  };

  const handleClearFilters = () => {
    dispatch(clearAllFilters());
    dispatch(applyFilters());
  };

  const hasActiveFilters = 
    filters.minPrice > priceRange.min ||
    filters.maxPrice < priceRange.max ||
    filters.minRating > 0 ||
    filters.styles.length > 0 ||
    filters.location ||
    filters.search;

  return (
    <div className={`bg-white rounded-lg border border-neutral-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        <h2 className="font-semibold text-neutral-800">Filters</h2>
        
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<RotateCcw size={14} />}
              onClick={handleClearFilters}
            >
              Clear
            </Button>
          )}
          
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<X size={16} />}
              onClick={() => dispatch(closeMobileFilters())}
            />
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 space-y-6 custom-scrollbar max-h-96 overflow-y-auto">
        <SortOptions
          value={filters.sortBy}
          onChange={handleSortChange}
        />

        <PriceRangeFilter
          min={priceRange.min}
          max={priceRange.max}
          value={[filters.minPrice, filters.maxPrice]}
          onChange={handlePriceChange}
        />

        <RatingFilter
          value={filters.minRating}
          onChange={handleRatingChange}
        />

        <StylesFilter
          value={filters.styles}
          onChange={handleStylesChange}
          options={uniqueStyles}
        />

        <LocationFilter
          value={filters.location}
          onChange={handleLocationChange}
          options={uniqueLocations}
        />
      </div>
    </div>
  );
};

export default FilterSidebar;