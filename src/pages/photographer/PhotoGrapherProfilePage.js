import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { ArrowLeft, MapPin, Star, Share2, Heart } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import Button, { IconButton } from '../../components/common/Button';
import Tag from '../../components/common/Tag';
import { RatingDisplay } from '../../components/common/Rating';
import { ImageModal } from '../../components/common/Modal';
import InquiryForm from '../../components/photographer/InquiryForm';
import { SkeletonCard, SkeletonText, SkeletonAvatar } from '../../components/common/Skeleton';
import {
  fetchPhotographerById,
  resetCurrentPhotographer,
  selectCurrentPhotographer,
  selectLoading,
  selectError,
} from '../../redux/photoGrapherSlice';
import {
  openInquiryModal,
  openImageViewer,
  closeImageViewer,
  setImageViewerIndex,
  selectImageViewer,
  addNotification,
} from '../../redux/uiSlice';
import { utils } from '../../utils/api';

const PhotographerProfilePage = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query;
  const photographer = useSelector(selectCurrentPhotographer);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const imageViewer = useSelector(selectImageViewer);

  // Fetch photographer data
  useEffect(() => {
    if (id) {
      console.log('Fetching photographer with ID:', id); // Debug log
      dispatch(fetchPhotographerById(parseInt(id)));
    }
    
    return () => {
      dispatch(resetCurrentPhotographer());
    };
  }, [dispatch, id]);

  const handleBack = () => {
    router.back();
  };

  const handleInquiry = () => {
    dispatch(openInquiryModal({
      photographerId: photographer.id,
      data: { name: photographer.name }
    }));
  };

  const handleImageClick = (images, index) => {
    dispatch(openImageViewer({ images, currentIndex: index }));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: photographer.name,
        text: photographer.bio,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      dispatch(addNotification({
        type: 'success',
        message: 'Profile link copied to clipboard!',
      }));
    }
  };

  if (loading.currentPhotographer) {
    return (
      <MainLayout>
        <div className="space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-start gap-6">
            <SkeletonAvatar size="2xl" />
            <div className="flex-1 space-y-4">
              <SkeletonText lines={2} />
              <div className="flex gap-2">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="skeleton h-6 w-16 rounded-full" />
                ))}
              </div>
            </div>
          </div>
          
          {/* Content Skeleton */}
          <SkeletonCard showImage={false} textLines={5} />
        </div>
      </MainLayout>
    );
  }

  if (error.currentPhotographer || !photographer) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <div className="text-red-400 mb-4">
            <Star className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-neutral-600 mb-2">
            Photographer not found
          </h3>
          <p className="text-neutral-500 mb-4">
            {error.currentPhotographer || 'The photographer you are looking for does not exist.'}
          </p>
          <Button onClick={handleBack}>
            Go Back
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          leftIcon={<ArrowLeft size={16} />}
          onClick={handleBack}
        >
          Back to Photographers
        </Button>

        {/* Header */}
        <div className="card p-6">
          <div className="flex flex-col md:flex-row md:items-start gap-6">
            {/* Profile Image */}
            <div className="relative">
              <img
                src={photographer.profilePic}
                alt={photographer.name}
                className="w-32 h-32 rounded-full object-cover"
                onError={(e) => {
                  e.target.src = '/images/default-profile.jpg';
                }}
              />
            </div>

            {/* Info */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-neutral-800 mb-2">
                  {photographer.name}
                </h1>
                
                <div className="flex items-center text-neutral-600 mb-3">
                  <MapPin size={16} className="mr-1" />
                  {photographer.location}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {photographer.styles.map((style) => (
                    <Tag key={style} variant="primary">
                      {style}
                    </Tag>
                  ))}
                </div>

                <RatingDisplay
                  value={photographer.rating}
                  showValue={true}
                  showCount={true}
                  count={photographer.reviews?.length || 0}
                  size="lg"
                />
              </div>

              <p className="text-neutral-700 leading-relaxed">
                {photographer.bio}
              </p>

              {/* Price */}
              <div className="bg-neutral-50 rounded-lg p-4">
                <span className="text-sm text-neutral-600">Starting from</span>
                <div className="text-2xl font-bold text-primary-600">
                  {utils.formatPrice(photographer.price)}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex md:flex-col gap-2">
              <IconButton
                icon={<Share2 />}
                variant="outline"
                onClick={handleShare}
                tooltip="Share profile"
              />
              
              <IconButton
                icon={<Heart />}
                variant="outline"
                tooltip="Save to favorites"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6 pt-6 border-t border-neutral-200">
            <Button
              variant="primary"
              size="lg"
              onClick={handleInquiry}
              className="flex-1"
            >
              Send Inquiry
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.open(`tel:+911234567890`)}
            >
              Call Now
            </Button>
          </div>
        </div>

        {/* Portfolio */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
          
          {photographer.portfolio && photographer.portfolio.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photographer.portfolio.map((image, index) => (
                <div
                  key={index}
                  className="aspect-square cursor-pointer overflow-hidden rounded-lg hover:opacity-90 transition-opacity"
                  onClick={() => handleImageClick(photographer.portfolio, index)}
                >
                  <img
                    src={image}
                    alt={`Portfolio ${index + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = '/images/default-portfolio.jpg';
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500 text-center py-8">
              No portfolio images available
            </p>
          )}
        </div>

        {/* Reviews */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">
            Reviews ({photographer.reviews?.length || 0})
          </h2>
          
          {photographer.reviews && photographer.reviews.length > 0 ? (
            <div className="space-y-4">
              {photographer.reviews.map((review, index) => (
                <div key={index} className="border-b border-neutral-200 pb-4 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-neutral-800">
                        {review.name}
                      </h4>
                      <RatingDisplay value={review.rating} size="sm" />
                    </div>
                    <span className="text-sm text-neutral-500">
                      {utils.formatDate(review.date)}
                    </span>
                  </div>
                  <p className="text-neutral-700">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-neutral-500 text-center py-8">
              No reviews yet
            </p>
          )}
        </div>
      </div>

      {/* Image Viewer Modal */}
      <ImageModal
        isOpen={imageViewer.isOpen}
        onClose={() => dispatch(closeImageViewer())}
        images={imageViewer.images}
        currentIndex={imageViewer.currentIndex}
        onIndexChange={(index) => dispatch(setImageViewerIndex(index))}
        showNavigation={true}
      />

      {/* Inquiry Form Modal */}
      <InquiryForm />
    </MainLayout>
  );
};

export default PhotographerProfilePage;