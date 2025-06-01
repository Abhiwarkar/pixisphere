import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { Camera, Grid, List } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import SearchBar from '../../components/common/filters/SearchBar';
import PhotographerGrid from '../../components/photographer/PhotoGrapherGrid';
import InquiryForm from '../../components/photographer/InquiryForm';
import Button, { IconButton } from '../../components/common/Button';
import {
  fetchPhotographers,
  setSearchFilter,
  setCurrentPage,
  setViewMode,
  applyFilters,
  selectFilteredPhotographers,
  selectPagination,
  selectFilters,
  selectUI,
  selectLoading,
  selectError,
} from '../../redux/photoGrapherSlice';

const HomePage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const filteredPhotographers = useSelector(selectFilteredPhotographers);
  const pagination = useSelector(selectPagination);
  const filters = useSelector(selectFilters);
  const ui = useSelector(selectUI);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);

  // Fetch photographers on mount
  useEffect(() => {
    dispatch(fetchPhotographers());
  }, [dispatch]);

  // Apply filters when data changes
  useEffect(() => {
    if (filteredPhotographers.length === 0 && !loading.photographers) {
      dispatch(applyFilters());
    }
  }, [dispatch, filteredPhotographers.length, loading.photographers]);

  const handleSearch = (searchTerm) => {
    dispatch(setSearchFilter(searchTerm));
    dispatch(applyFilters());
  };

  const handleViewProfile = (photographerId) => {
    router.push(`/photographer/${photographerId}`);
  };

  const handleLoadMore = () => {
    dispatch(setCurrentPage(pagination.currentPage + 1));
  };

  const canLoadMore = pagination.currentPage < pagination.totalPages;
  const showingCount = Math.min(
    pagination.currentPage * pagination.itemsPerPage,
    pagination.totalItems
  );

  if (error.photographers) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <div className="text-red-400 mb-4">
            <Camera className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-neutral-600 mb-2">
            Unable to load photographers
          </h3>
          <p className="text-neutral-500 mb-4">
            {error.photographers}
          </p>
          <Button onClick={() => dispatch(fetchPhotographers())}>
            Try Again
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showFilters={true}>
      {/* Header Section */}
      <div className="mb-6">
        <div className="mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-2">
            Find the Perfect Photographer
          </h1>
          <p className="text-neutral-600">
            Discover talented photographers for your special moments
          </p>
        </div>

        {/* Search and View Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1 max-w-md">
            <SearchBar
              value={filters.search}
              onChange={handleSearch}
              placeholder="Search by name, location, or style..."
            />
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex rounded-lg border border-neutral-300 overflow-hidden">
              <IconButton
                icon={<Grid size={16} />}
                variant={ui.viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => dispatch(setViewMode('grid'))}
                className="rounded-none"
              />
              <IconButton
                icon={<List size={16} />}
                variant={ui.viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => dispatch(setViewMode('list'))}
                className="rounded-none"
              />
            </div>
          </div>
        </div>

        {/* Results Summary */}
        {!loading.photographers && (
          <div className="flex items-center justify-between text-sm text-neutral-600 mt-4">
            <span>
              Showing {showingCount} of {pagination.totalItems} photographers
            </span>
            
            {filters.search && (
              <span>
                Results for "{filters.search}"
              </span>
            )}
          </div>
        )}
      </div>

      {/* Photographers Grid */}
      <PhotographerGrid onViewProfile={handleViewProfile} />

      {/* Load More Button */}
      {canLoadMore && !loading.photographers && (
        <div className="flex justify-center mt-8">
          <Button
            variant="outline"
            size="lg"
            onClick={handleLoadMore}
            loading={loading.photographers}
          >
            Load More Photographers
          </Button>
        </div>
      )}

      {/* Inquiry Form Modal */}
      <InquiryForm />
    </MainLayout>
  );
};

export default HomePage;