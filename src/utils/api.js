const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorMessage = `HTTP error! status: ${response.status}`;
    throw new ApiError(errorMessage, response.status);
  }
  
  try {
    return await response.json();
  } catch (error) {
    throw new ApiError('Invalid JSON response', response.status);
  }
};

const makeRequest = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    return await handleResponse(response);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    throw new ApiError(`Network error: ${error.message}`, 0);
  }
};

// Photographer API endpoints
export const photographerApi = {
  // Get all photographers
  getAll: async () => {
    return await makeRequest('/photographers');
  },

  // Get photographer by ID
  getById: async (id) => {
    console.log('API: Fetching photographer with ID:', id); // Debug log
    try {
      const response = await makeRequest(`/photographers/${id}`);
      console.log('API: Response received:', response); // Debug log
      return response;
    } catch (error) {
      console.error('API: Error fetching photographer:', error); // Debug log
      throw error;
    }
  },

  // Get photographers with filters
  getFiltered: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    
    // Add query parameters based on filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value) && value.length > 0) {
          queryParams.append(key, value.join(','));
        } else if (!Array.isArray(value)) {
          queryParams.append(key, value);
        }
      }
    });

    const queryString = queryParams.toString();
    const url = queryString ? `/photographers?${queryString}` : '/photographers';
    
    return await makeRequest(url);
  },

  // Search photographers
  search: async (searchTerm) => {
    return await makeRequest(`/photographers?q=${encodeURIComponent(searchTerm)}`);
  },
};

// Filter and sort utilities
export const filterUtils = {
  // Filter photographers by price range
  filterByPriceRange: (photographers, minPrice, maxPrice) => {
    return photographers.filter(p => p.price >= minPrice && p.price <= maxPrice);
  },

  // Filter photographers by rating
  filterByRating: (photographers, minRating) => {
    return photographers.filter(p => p.rating >= minRating);
  },

  // Filter photographers by styles
  filterByStyles: (photographers, selectedStyles) => {
    if (!selectedStyles || selectedStyles.length === 0) return photographers;
    
    return photographers.filter(p => 
      selectedStyles.some(style => p.styles.includes(style))
    );
  },

  // Filter photographers by location
  filterByLocation: (photographers, location) => {
    if (!location) return photographers;
    
    return photographers.filter(p => 
      p.location.toLowerCase().includes(location.toLowerCase())
    );
  },

  // Search photographers by name, location, or tags
  searchPhotographers: (photographers, searchTerm) => {
    if (!searchTerm) return photographers;
    
    const term = searchTerm.toLowerCase();
    
    return photographers.filter(p => 
      p.name.toLowerCase().includes(term) ||
      p.location.toLowerCase().includes(term) ||
      p.tags.some(tag => tag.toLowerCase().includes(term)) ||
      p.bio.toLowerCase().includes(term)
    );
  },

  // Sort photographers
  sortPhotographers: (photographers, sortBy) => {
    const sortedPhotographers = [...photographers];
    
    switch (sortBy) {
      case 'price-low-high':
        return sortedPhotographers.sort((a, b) => a.price - b.price);
      
      case 'price-high-low':
        return sortedPhotographers.sort((a, b) => b.price - a.price);
      
      case 'rating-high-low':
        return sortedPhotographers.sort((a, b) => b.rating - a.rating);
      
      case 'rating-low-high':
        return sortedPhotographers.sort((a, b) => a.rating - b.rating);
      
      case 'name-a-z':
        return sortedPhotographers.sort((a, b) => a.name.localeCompare(b.name));
      
      case 'name-z-a':
        return sortedPhotographers.sort((a, b) => b.name.localeCompare(a.name));
      
      case 'recently-added':
        return sortedPhotographers.sort((a, b) => b.id - a.id);
      
      default:
        return sortedPhotographers;
    }
  },

  // Apply all filters
  applyAllFilters: (photographers, filters) => {
    let filtered = [...photographers];

    // Apply search
    if (filters.search) {
      filtered = filterUtils.searchPhotographers(filtered, filters.search);
    }

    // Apply price range filter
    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      filtered = filterUtils.filterByPriceRange(filtered, filters.minPrice, filters.maxPrice);
    }

    // Apply rating filter
    if (filters.minRating !== undefined) {
      filtered = filterUtils.filterByRating(filtered, filters.minRating);
    }

    // Apply styles filter
    if (filters.styles && filters.styles.length > 0) {
      filtered = filterUtils.filterByStyles(filtered, filters.styles);
    }

    // Apply location filter
    if (filters.location) {
      filtered = filterUtils.filterByLocation(filtered, filters.location);
    }

    // Apply sorting
    if (filters.sortBy) {
      filtered = filterUtils.sortPhotographers(filtered, filters.sortBy);
    }

    return filtered;
  },
};

// Utility functions
export const utils = {
  // Format price to Indian currency
  formatPrice: (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  },

  // Format date
  formatDate: (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  // Get unique values from array of objects
  getUniqueValues: (array, key) => {
    const values = array.flatMap(item => 
      Array.isArray(item[key]) ? item[key] : [item[key]]
    );
    return [...new Set(values)].filter(Boolean);
  },

  // Debounce function
  debounce: (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  },

  // Generate slug from text
  generateSlug: (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },

  // Check if image exists
  checkImageExists: async (imageUrl) => {
    try {
      const response = await fetch(imageUrl, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  },

  // Get fallback image
  getFallbackImage: (type = 'profile') => {
    const fallbacks = {
      profile: '/images/default-profile.jpg',
      portfolio: '/images/default-portfolio.jpg',
    };
    return fallbacks[type] || fallbacks.profile;
  },
};

// Export API error class
export { ApiError };

// Default export
export default {
  photographerApi,
  filterUtils,
  utils,
};