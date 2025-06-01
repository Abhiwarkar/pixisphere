import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { photographerApi, filterUtils } from '../utils/api';

// Async thunks for API calls
export const fetchPhotographers = createAsyncThunk(
  'photographer/fetchPhotographers',
  async (_, { rejectWithValue }) => {
    try {
      const photographers = await photographerApi.getAll();
      return photographers;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPhotographerById = createAsyncThunk(
  'photographer/fetchPhotographerById',
  async (id, { rejectWithValue }) => {
    try {
      const photographer = await photographerApi.getById(id);
      return photographer;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const searchPhotographers = createAsyncThunk(
  'photographer/searchPhotographers',
  async (searchTerm, { getState, rejectWithValue }) => {
    try {
      const { photographer } = getState();
      const { allPhotographers } = photographer;
      
      // If we have photographers in state, filter them locally for better performance
      if (allPhotographers.length > 0) {
        const filtered = filterUtils.searchPhotographers(allPhotographers, searchTerm);
        return filtered;
      }
      
      // Otherwise, fetch from API
      const photographers = await photographerApi.search(searchTerm);
      return photographers;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  // Data
  allPhotographers: [],
  filteredPhotographers: [],
  currentPhotographer: null,
  
  // Filters
  filters: {
    search: '',
    minPrice: 0,
    maxPrice: 20000,
    minRating: 0,
    styles: [],
    location: '',
    sortBy: 'rating-high-low',
  },
  
  // Pagination
  pagination: {
    currentPage: 1,
    itemsPerPage: 12,
    totalItems: 0,
    totalPages: 0,
  },
  
  // Loading states
  loading: {
    photographers: false,
    currentPhotographer: false,
    search: false,
  },
  
  // Error states
  error: {
    photographers: null,
    currentPhotographer: null,
    search: null,
  },
  
  // UI state
  ui: {
    viewMode: 'grid', // 'grid' or 'list'
    selectedPhotographerId: null,
  },
};

// Photographer slice
const photographerSlice = createSlice({
  name: 'photographer',
  initialState,
  reducers: {
    // Filter actions
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload;
      state.pagination.currentPage = 1;
    },
    
    setPriceRange: (state, action) => {
      const { minPrice, maxPrice } = action.payload;
      state.filters.minPrice = minPrice;
      state.filters.maxPrice = maxPrice;
      state.pagination.currentPage = 1;
    },
    
    setRatingFilter: (state, action) => {
      state.filters.minRating = action.payload;
      state.pagination.currentPage = 1;
    },
    
    setStylesFilter: (state, action) => {
      state.filters.styles = action.payload;
      state.pagination.currentPage = 1;
    },
    
    setLocationFilter: (state, action) => {
      state.filters.location = action.payload;
      state.pagination.currentPage = 1;
    },
    
    setSortBy: (state, action) => {
      state.filters.sortBy = action.payload;
      state.pagination.currentPage = 1;
    },
    
    clearAllFilters: (state) => {
      state.filters = {
        search: '',
        minPrice: 0,
        maxPrice: 20000,
        minRating: 0,
        styles: [],
        location: '',
        sortBy: 'rating-high-low',
      };
      state.pagination.currentPage = 1;
    },
    
    // Apply filters to photographers
    applyFilters: (state) => {
      const filtered = filterUtils.applyAllFilters(state.allPhotographers, state.filters);
      state.filteredPhotographers = filtered;
      state.pagination.totalItems = filtered.length;
      state.pagination.totalPages = Math.ceil(filtered.length / state.pagination.itemsPerPage);
      
      // Reset to first page if current page is beyond total pages
      if (state.pagination.currentPage > state.pagination.totalPages) {
        state.pagination.currentPage = 1;
      }
    },
    
    // Pagination actions
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    
    setItemsPerPage: (state, action) => {
      state.pagination.itemsPerPage = action.payload;
      state.pagination.totalPages = Math.ceil(state.pagination.totalItems / action.payload);
      state.pagination.currentPage = 1;
    },
    
    // UI actions
    setViewMode: (state, action) => {
      state.ui.viewMode = action.payload;
    },
    
    setSelectedPhotographer: (state, action) => {
      state.ui.selectedPhotographerId = action.payload;
    },
    
    // Clear errors
    clearError: (state, action) => {
      const errorType = action.payload;
      if (errorType && state.error[errorType]) {
        state.error[errorType] = null;
      } else {
        // Clear all errors
        Object.keys(state.error).forEach(key => {
          state.error[key] = null;
        });
      }
    },
    
    // Reset current photographer
    resetCurrentPhotographer: (state) => {
      state.currentPhotographer = null;
      state.error.currentPhotographer = null;
      state.loading.currentPhotographer = false;
    },
  },
  
  extraReducers: (builder) => {
    // Fetch photographers
    builder
      .addCase(fetchPhotographers.pending, (state) => {
        state.loading.photographers = true;
        state.error.photographers = null;
      })
      .addCase(fetchPhotographers.fulfilled, (state, action) => {
        state.loading.photographers = false;
        state.allPhotographers = action.payload;
        
        // Apply current filters to new data
        const filtered = filterUtils.applyAllFilters(action.payload, state.filters);
        state.filteredPhotographers = filtered;
        state.pagination.totalItems = filtered.length;
        state.pagination.totalPages = Math.ceil(filtered.length / state.pagination.itemsPerPage);
      })
      .addCase(fetchPhotographers.rejected, (state, action) => {
        state.loading.photographers = false;
        state.error.photographers = action.payload;
        state.allPhotographers = [];
        state.filteredPhotographers = [];
      });
    
    // Fetch photographer by ID
    builder
      .addCase(fetchPhotographerById.pending, (state) => {
        state.loading.currentPhotographer = true;
        state.error.currentPhotographer = null;
      })
      .addCase(fetchPhotographerById.fulfilled, (state, action) => {
        state.loading.currentPhotographer = false;
        state.currentPhotographer = action.payload;
      })
      .addCase(fetchPhotographerById.rejected, (state, action) => {
        state.loading.currentPhotographer = false;
        state.error.currentPhotographer = action.payload;
        state.currentPhotographer = null;
      });
    
    // Search photographers
    builder
      .addCase(searchPhotographers.pending, (state) => {
        state.loading.search = true;
        state.error.search = null;
      })
      .addCase(searchPhotographers.fulfilled, (state, action) => {
        state.loading.search = false;
        state.filteredPhotographers = action.payload;
        state.pagination.totalItems = action.payload.length;
        state.pagination.totalPages = Math.ceil(action.payload.length / state.pagination.itemsPerPage);
        state.pagination.currentPage = 1;
      })
      .addCase(searchPhotographers.rejected, (state, action) => {
        state.loading.search = false;
        state.error.search = action.payload;
      });
  },
});

// Action creators
export const {
  setSearchFilter,
  setPriceRange,
  setRatingFilter,
  setStylesFilter,
  setLocationFilter,
  setSortBy,
  clearAllFilters,
  applyFilters,
  setCurrentPage,
  setItemsPerPage,
  setViewMode,
  setSelectedPhotographer,
  clearError,
  resetCurrentPhotographer,
} = photographerSlice.actions;

// Selectors
export const selectAllPhotographers = (state) => state.photographer.allPhotographers;
export const selectFilteredPhotographers = (state) => state.photographer.filteredPhotographers;
export const selectCurrentPhotographer = (state) => state.photographer.currentPhotographer;
export const selectFilters = (state) => state.photographer.filters;
export const selectPagination = (state) => state.photographer.pagination;
export const selectLoading = (state) => state.photographer.loading;
export const selectError = (state) => state.photographer.error;
export const selectUI = (state) => state.photographer.ui;

// Complex selectors
export const selectPaginatedPhotographers = (state) => {
  const { filteredPhotographers, pagination } = state.photographer;
  const { currentPage, itemsPerPage } = pagination;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return filteredPhotographers.slice(startIndex, endIndex);
};

export const selectUniqueLocations = (state) => {
  const photographers = state.photographer.allPhotographers;
  return [...new Set(photographers.map(p => p.location))].sort();
};

export const selectUniqueStyles = (state) => {
  const photographers = state.photographer.allPhotographers;
  const allStyles = photographers.flatMap(p => p.styles);
  return [...new Set(allStyles)].sort();
};

export const selectPriceRange = (state) => {
  const photographers = state.photographer.allPhotographers;
  if (photographers.length === 0) return { min: 0, max: 20000 };
  
  const prices = photographers.map(p => p.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
};

export default photographerSlice.reducer;