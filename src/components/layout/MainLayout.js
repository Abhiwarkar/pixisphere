import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Menu, X } from 'lucide-react';
import Button from '../common/Button';
import Modal from '../common/Modal';
import FilterSidebar from '../../components/common/filters/FiltersSidebar';
import { 
  openMobileFilters, 
  closeMobileFilters, 
  selectMobileFilters,
  selectIsMobile,
  setDeviceInfo 
} from '../../redux/uiSlice';

const MainLayout = ({ children, showFilters = false }) => {
  const dispatch = useDispatch();
  const mobileFilters = useSelector(selectMobileFilters);
  const isMobile = useSelector(selectIsMobile);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      dispatch(setDeviceInfo({
        width: window.innerWidth,
        height: window.innerHeight,
      }));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary-600">
                Pixisphere
              </h1>
            </div>

            {/* Mobile filter toggle */}
            {showFilters && isMobile && (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Menu size={16} />}
                onClick={() => dispatch(openMobileFilters())}
              >
                Filters
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`flex gap-6 ${showFilters ? 'lg:grid lg:grid-cols-4' : ''}`}>
          {/* Desktop Filters Sidebar */}
          {showFilters && !isMobile && (
            <aside className="lg:col-span-1">
              <div className="sticky top-24">
                <FilterSidebar />
              </div>
            </aside>
          )}

          {/* Content */}
          <div className={showFilters && !isMobile ? 'lg:col-span-3' : 'w-full'}>
            {children}
          </div>
        </div>
      </main>

      {/* Mobile Filters Modal */}
      {isMobile && (
        <Modal
          isOpen={mobileFilters.isOpen}
          onClose={() => dispatch(closeMobileFilters())}
          title="Filters"
          size="full"
          className="m-0 rounded-none h-full"
        >
          <FilterSidebar />
        </Modal>
      )}
    </div>
  );
};

export default MainLayout;