import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  leftIcon = null,
  rightIcon = null,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  // Base button styles
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Variant styles
  const variantStyles = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500 shadow-sm hover:shadow-md',
    secondary: 'bg-white hover:bg-neutral-50 text-primary-600 border border-primary-200 focus:ring-primary-500 shadow-sm hover:shadow-md',
    outline: 'bg-transparent hover:bg-neutral-50 text-neutral-700 border border-neutral-300 focus:ring-neutral-500',
    ghost: 'bg-transparent hover:bg-neutral-100 text-neutral-700 focus:ring-neutral-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-sm hover:shadow-md',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-sm hover:shadow-md',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500 shadow-sm hover:shadow-md',
  };
  
  // Size styles
  const sizeStyles = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  };
  
  // Icon sizes based on button size
  const iconSizes = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
  };
  
  // Combine all styles
  const buttonStyles = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    fullWidth ? 'w-full' : '',
    (loading || disabled) ? 'cursor-not-allowed' : '',
    className,
  ].filter(Boolean).join(' ');
  
  // Handle click
  const handleClick = (e) => {
    if (loading || disabled) {
      e.preventDefault();
      return;
    }
    
    if (onClick) {
      onClick(e);
    }
  };
  
  // Render loading spinner
  const LoadingSpinner = () => (
    <Loader2 
      size={iconSizes[size]} 
      className="animate-spin" 
    />
  );
  
  // Render icon with proper sizing
  const renderIcon = (icon, position) => {
    if (!icon) return null;
    
    const iconElement = React.isValidElement(icon) 
      ? React.cloneElement(icon, { size: iconSizes[size] })
      : icon;
    
    const marginClass = position === 'left' 
      ? (children ? 'mr-2' : '') 
      : (children ? 'ml-2' : '');
    
    return (
      <span className={marginClass}>
        {iconElement}
      </span>
    );
  };
  
  return (
    <button
      type={type}
      className={buttonStyles}
      onClick={handleClick}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner />
          {children && <span className="ml-2">{children}</span>}
        </>
      ) : (
        <>
          {renderIcon(leftIcon, 'left')}
          {children}
          {renderIcon(rightIcon, 'right')}
        </>
      )}
    </button>
  );
};

// Button group component for grouping related buttons
export const ButtonGroup = ({ 
  children, 
  className = '',
  orientation = 'horizontal', // 'horizontal' or 'vertical'
  spacing = 'md',
  ...props 
}) => {
  const spacingStyles = {
    sm: orientation === 'horizontal' ? 'space-x-2' : 'space-y-2',
    md: orientation === 'horizontal' ? 'space-x-3' : 'space-y-3',
    lg: orientation === 'horizontal' ? 'space-x-4' : 'space-y-4',
  };
  
  const orientationStyles = {
    horizontal: 'flex flex-row',
    vertical: 'flex flex-col',
  };
  
  const groupStyles = [
    orientationStyles[orientation],
    spacingStyles[spacing],
    className,
  ].filter(Boolean).join(' ');
  
  return (
    <div className={groupStyles} {...props}>
      {children}
    </div>
  );
};

// Icon button component for buttons with only icons
export const IconButton = ({
  icon,
  variant = 'ghost',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  tooltip = '',
  ...props
}) => {
  const sizeStyles = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-14 h-14',
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      loading={loading}
      disabled={disabled}
      className={`${sizeStyles[size]} p-0 ${className}`}
      title={tooltip}
      {...props}
    >
      {!loading && icon}
    </Button>
  );
};

// Link button component for buttons that look like links
export const LinkButton = ({
  children,
  className = '',
  underline = false,
  ...props
}) => {
  const linkStyles = [
    'text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200',
    underline ? 'underline hover:no-underline' : 'hover:underline',
    className,
  ].filter(Boolean).join(' ');
  
  return (
    <button
      className={linkStyles}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;