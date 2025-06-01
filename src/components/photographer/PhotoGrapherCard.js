import React from 'react';
import { MapPin, Star } from 'lucide-react';
import { useDispatch } from 'react-redux';
import Button from '../common/Button';
import Tag from '../common/Tag';
import { RatingDisplay } from '../common/Rating';
import { utils } from '../../utils/api';
import { openInquiryModal } from '../../redux/uiSlice';

const PhotographerCard = ({ photographer, onViewProfile, className = '' }) => {
  const dispatch = useDispatch();

  const handleInquiry = (e) => {
    e.stopPropagation();
    dispatch(openInquiryModal({ 
      photographerId: photographer.id,
      data: { name: photographer.name }
    }));
  };

  const handleViewProfile = () => {
    onViewProfile?.(photographer.id);
  };

  return (
    <div className={`card card-hover cursor-pointer ${className}`} onClick={handleViewProfile}>
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={photographer.profilePic}
          alt={photographer.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.target.src = '/images/default-profile.jpg';
          }}
        />
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Star size={12} className="text-yellow-400 fill-current" />
          <span className="text-xs font-medium">{photographer.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Header */}
        <div>
          <h3 className="font-semibold text-neutral-800 text-lg leading-tight">
            {photographer.name}
          </h3>
          
          <div className="flex items-center text-neutral-600 text-sm mt-1">
            <MapPin size={14} className="mr-1" />
            {photographer.location}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {photographer.tags.slice(0, 2).map((tag) => (
            <Tag key={tag} variant="primary" size="xs">
              {tag}
            </Tag>
          ))}
          {photographer.tags.length > 2 && (
            <Tag variant="neutral" size="xs">
              +{photographer.tags.length - 2}
            </Tag>
          )}
        </div>

        {/* Rating and Reviews */}
        <RatingDisplay
          value={photographer.rating}
          size="sm"
          showValue={true}
          showCount={true}
          count={photographer.reviews?.length || 0}
        />

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs text-neutral-500">Starting from</span>
            <div className="price-text">{utils.formatPrice(photographer.price)}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="primary"
            size="sm"
            fullWidth
            onClick={handleViewProfile}
          >
            View Profile
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleInquiry}
          >
            Inquiry
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PhotographerCard;