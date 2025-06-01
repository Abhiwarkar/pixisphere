import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  // Modal states
  modals: {
    inquiryForm: {
      isOpen: false,
      photographerId: null,
      data: null,
    },
    imageViewer: {
      isOpen: false,
      images: [],
      currentIndex: 0,
    },
    filterMobile: {
      isOpen: false,
    },
  },
  
  // Loading states for UI components
  componentLoading: {
    inquirySubmit: false,
    imageUpload: false,
  },
  
  // Toast/notification state
  notifications: [],
  
  // Search suggestions
  searchSuggestions: {
    isVisible: false,
    suggestions: [],
    loading: false,
  },
  
  // Layout preferences
  layout: {
    sidebarCollapsed: false,
    headerHeight: 80,
    footerHeight: 60,
  },
  
  // Theme preferences (for future use)
  theme: {
    mode: 'light', // 'light' or 'dark'
    primaryColor: 'blue',
  },
  
  // Device information
  device: {
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    screenWidth: 0,
    screenHeight: 0,
  },
  
  // Page-specific UI state
  pageState: {
    listing: {
      scrollPosition: 0,
      lastVisited: null,
    },
    profile: {
      activeTab: 'portfolio', // 'portfolio', 'reviews', 'details'
      selectedImageIndex: 0,
    },
  },
};

// UI slice
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Modal actions
    openInquiryModal: (state, action) => {
      state.modals.inquiryForm.isOpen = true;
      state.modals.inquiryForm.photographerId = action.payload.photographerId;
      state.modals.inquiryForm.data = action.payload.data || null;
    },
    
    closeInquiryModal: (state) => {
      state.modals.inquiryForm.isOpen = false;
      state.modals.inquiryForm.photographerId = null;
      state.modals.inquiryForm.data = null;
    },
    
    openImageViewer: (state, action) => {
      state.modals.imageViewer.isOpen = true;
      state.modals.imageViewer.images = action.payload.images;
      state.modals.imageViewer.currentIndex = action.payload.currentIndex || 0;
    },
    
    closeImageViewer: (state) => {
      state.modals.imageViewer.isOpen = false;
      state.modals.imageViewer.images = [];
      state.modals.imageViewer.currentIndex = 0;
    },
    
    setImageViewerIndex: (state, action) => {
      state.modals.imageViewer.currentIndex = action.payload;
    },
    
    openMobileFilters: (state) => {
      state.modals.filterMobile.isOpen = true;
    },
    
    closeMobileFilters: (state) => {
      state.modals.filterMobile.isOpen = false;
    },
    
    // Component loading actions
    setComponentLoading: (state, action) => {
      const { component, loading } = action.payload;
      if (state.componentLoading.hasOwnProperty(component)) {
        state.componentLoading[component] = loading;
      }
    },
    
    // Notification actions
    addNotification: (state, action) => {
      const notification = {
        id: Date.now() + Math.random(),
        type: 'info', // 'success', 'error', 'warning', 'info'
        title: '',
        message: '',
        duration: 5000,
        ...action.payload,
      };
      state.notifications.push(notification);
    },
    
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    
    // Search suggestions actions
    showSearchSuggestions: (state, action) => {
      state.searchSuggestions.isVisible = true;
      state.searchSuggestions.suggestions = action.payload || [];
    },
    
    hideSearchSuggestions: (state) => {
      state.searchSuggestions.isVisible = false;
      state.searchSuggestions.suggestions = [];
    },
    
    setSearchSuggestionsLoading: (state, action) => {
      state.searchSuggestions.loading = action.payload;
    },
    
    // Layout actions
    toggleSidebar: (state) => {
      state.layout.sidebarCollapsed = !state.layout.sidebarCollapsed;
    },
    
    setSidebarCollapsed: (state, action) => {
      state.layout.sidebarCollapsed = action.payload;
    },
    
    setHeaderHeight: (state, action) => {
      state.layout.headerHeight = action.payload;
    },
    
    setFooterHeight: (state, action) => {
      state.layout.footerHeight = action.payload;
    },
    
    // Theme actions
    setThemeMode: (state, action) => {
      state.theme.mode = action.payload;
    },
    
    setPrimaryColor: (state, action) => {
      state.theme.primaryColor = action.payload;
    },
    
    // Device actions
    setDeviceInfo: (state, action) => {
      const { width, height } = action.payload;
      state.device.screenWidth = width;
      state.device.screenHeight = height;
      state.device.isMobile = width < 768;
      state.device.isTablet = width >= 768 && width < 1024;
      state.device.isDesktop = width >= 1024;
    },
    
    // Page state actions
    setListingScrollPosition: (state, action) => {
      state.pageState.listing.scrollPosition = action.payload;
    },
    
    setListingLastVisited: (state, action) => {
      state.pageState.listing.lastVisited = action.payload;
    },
    
    setProfileActiveTab: (state, action) => {
      state.pageState.profile.activeTab = action.payload;
    },
    
    setProfileSelectedImage: (state, action) => {
      state.pageState.profile.selectedImageIndex = action.payload;
    },
    
    // Batch actions
    resetPageState: (state, action) => {
      const page = action.payload;
      if (page && state.pageState[page]) {
        state.pageState[page] = initialState.pageState[page];
      } else {
        state.pageState = initialState.pageState;
      }
    },
    
    resetUIState: (state) => {
      // Reset everything except device info and theme preferences
      state.modals = initialState.modals;
      state.componentLoading = initialState.componentLoading;
      state.notifications = initialState.notifications;
      state.searchSuggestions = initialState.searchSuggestions;
      state.pageState = initialState.pageState;
    },
  },
});

// Action creators
export const {
  // Modal actions
  openInquiryModal,
  closeInquiryModal,
  openImageViewer,
  closeImageViewer,
  setImageViewerIndex,
  openMobileFilters,
  closeMobileFilters,
  
  // Component loading actions
  setComponentLoading,
  
  // Notification actions
  addNotification,
  removeNotification,
  clearAllNotifications,
  
  // Search suggestions actions
  showSearchSuggestions,
  hideSearchSuggestions,
  setSearchSuggestionsLoading,
  
  // Layout actions
  toggleSidebar,
  setSidebarCollapsed,
  setHeaderHeight,
  setFooterHeight,
  
  // Theme actions
  setThemeMode,
  setPrimaryColor,
  
  // Device actions
  setDeviceInfo,
  
  // Page state actions
  setListingScrollPosition,
  setListingLastVisited,
  setProfileActiveTab,
  setProfileSelectedImage,
  
  // Batch actions
  resetPageState,
  resetUIState,
} = uiSlice.actions;

// Selectors
export const selectModals = (state) => state.ui.modals;
export const selectInquiryModal = (state) => state.ui.modals.inquiryForm;
export const selectImageViewer = (state) => state.ui.modals.imageViewer;
export const selectMobileFilters = (state) => state.ui.modals.filterMobile;

export const selectComponentLoading = (state) => state.ui.componentLoading;
export const selectNotifications = (state) => state.ui.notifications;
export const selectSearchSuggestions = (state) => state.ui.searchSuggestions;

export const selectLayout = (state) => state.ui.layout;
export const selectTheme = (state) => state.ui.theme;
export const selectDevice = (state) => state.ui.device;
export const selectPageState = (state) => state.ui.pageState;

// Utility selectors
export const selectIsMobile = (state) => state.ui.device.isMobile;
export const selectIsTablet = (state) => state.ui.device.isTablet;
export const selectIsDesktop = (state) => state.ui.device.isDesktop;

export default uiSlice.reducer;