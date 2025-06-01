import React from 'react';
import { useSelector } from 'react-redux';
import PhotographerCard from './PhotoGrapherCard';
import { SkeletonPhotographerCard } from '../common/Skeleton';
import { selectPaginatedPhotographers, selectLoading } from '../../redux/photoGrapherSlice';

const PhotographerGrid = ({ onViewProfile, className = '' }) => {
  const photographers = useSelector(selectPaginatedPhotographers);
  const loading = useSelector(selectLoading);

  if (loading.photographers) {
    return (
      <div className={`photographer-grid ${className}`}>
        {Array.from({ length: 8 }, (_, index) => (
          <SkeletonPhotographerCard key={index} />
        ))}
      </div>
    );
  }

  if (photographers.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-neutral-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-neutral-600 mb-2">
          No photographers found
        </h3>
        <p className="text-neutral-500">
          Try adjusting your filters or search criteria
        </p>
      </div>
    );
  }

  return (
    <div className={`photographer-grid ${className}`}>
      {photographers.map((photographer) => (
        <PhotographerCard
          key={photographer.id}
          photographer={photographer}
          onViewProfile={onViewProfile}
        />
      ))}
    </div>
  );
};

export default PhotographerGrid;