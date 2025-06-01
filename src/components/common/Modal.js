import React, { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import Button, { IconButton } from './Button';

const Modal = ({
  isOpen = false,
  onClose,
  title = '',
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  footer = null,
  loading = false,
  ...props
}) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);
  
  // Size styles
  const sizeStyles = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    full: 'max-w-full mx-4',
  };
  
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && closeOnEscape && isOpen) {
        onClose?.();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, closeOnEscape, onClose]);
  
  // Handle focus management
  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousFocusRef.current = document.activeElement;
      
      // Focus the modal
      if (modalRef.current) {
        modalRef.current.focus();
      }
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset';
      
      // Restore focus to previously focused element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
    
    // Cleanup
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose?.();
    }
  };
  
  // Don't render if not open
  if (!isOpen) return null;
  
  return (
    <div
      className="modal-backdrop fade-in"
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      {...props}
    >
      <div
        ref={modalRef}
        className={`modal-content slide-up ${sizeStyles[size]} ${className}`}
        tabIndex={-1}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className={`flex items-center justify-between p-4 border-b border-neutral-200 ${headerClassName}`}>
            {title && (
              <h2 id="modal-title" className="text-lg font-semibold text-neutral-800">
                {title}
              </h2>
            )}
            
            {showCloseButton && (
              <IconButton
                icon={<X />}
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-neutral-400 hover:text-neutral-600"
                aria-label="Close modal"
              />
            )}
          </div>
        )}
        
        {/* Body */}
        <div className={`p-4 ${bodyClassName}`}>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
          ) : (
            children
          )}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className={`flex items-center justify-end gap-3 p-4 border-t border-neutral-200 ${footerClassName}`}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// Confirmation Modal Component
export const ConfirmModal = ({
  isOpen = false,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to perform this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger', // 'danger', 'warning', 'info'
  loading = false,
  ...props
}) => {
  const handleConfirm = () => {
    onConfirm?.();
  };
  
  const footer = (
    <>
      <Button
        variant="outline"
        onClick={onClose}
        disabled={loading}
      >
        {cancelText}
      </Button>
      <Button
        variant={variant}
        onClick={handleConfirm}
        loading={loading}
      >
        {confirmText}
      </Button>
    </>
  );
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      footer={footer}
      size="sm"
      {...props}
    >
      <p className="text-neutral-600">{message}</p>
    </Modal>
  );
};

// Image Modal Component
export const ImageModal = ({
  isOpen = false,
  onClose,
  images = [],
  currentIndex = 0,
  onIndexChange,
  showNavigation = true,
  showThumbnails = false,
  ...props
}) => {
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex < images.length - 1;
  
  const handlePrevious = () => {
    if (canGoPrevious) {
      const newIndex = currentIndex - 1;
      onIndexChange?.(newIndex);
    }
  };
  
  const handleNext = () => {
    if (canGoNext) {
      const newIndex = currentIndex + 1;
      onIndexChange?.(newIndex);
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') handlePrevious();
    if (e.key === 'ArrowRight') handleNext();
  };
  
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, currentIndex, images.length]);
  
  if (!images.length) return null;
  
  const currentImage = images[currentIndex];
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="4xl"
      className="bg-black"
      bodyClassName="p-0 relative"
      showCloseButton={false}
      {...props}
    >
      {/* Close button */}
      <IconButton
        icon={<X />}
        variant="ghost"
        size="lg"
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
      />
      
      {/* Image */}
      <div className="relative flex items-center justify-center">
        <img
          src={currentImage}
          alt={`Image ${currentIndex + 1}`}
          className="max-w-full max-h-[80vh] object-contain"
        />
        
        {/* Navigation */}
        {showNavigation && images.length > 1 && (
          <>
            <IconButton
              icon={<ChevronLeft />}
              variant="ghost"
              size="lg"
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 disabled:opacity-30"
            />
            
            <IconButton
              icon={<ChevronRight />}
              variant="ghost"
              size="lg"
              onClick={handleNext}
              disabled={!canGoNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 disabled:opacity-30"
            />
          </>
        )}
      </div>
      
      {/* Image counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}
      
      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 p-2 rounded-lg">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => onIndexChange?.(index)}
              className={`w-12 h-12 rounded overflow-hidden border-2 transition-all ${
                index === currentIndex ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default Modal;