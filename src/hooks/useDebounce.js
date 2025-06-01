import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing values
 * @param {any} value - The value to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {any} - The debounced value
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set debouncedValue to value (passed in) after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to cancel the timeout if value changes before delay
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Custom hook for debouncing functions
 * @param {Function} func - The function to debounce
 * @param {number} delay - The delay in milliseconds
 * @returns {Function} - The debounced function
 */
export const useDebouncedCallback = (func, delay) => {
  const [debounceTimer, setDebounceTimer] = useState(null);

  const debouncedFunction = (...args) => {
    // Clear the previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set a new timer
    const newTimer = setTimeout(() => {
      func(...args);
    }, delay);

    setDebounceTimer(newTimer);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  return debouncedFunction;
};

/**
 * Custom hook for debouncing API calls
 * @param {Function} apiCall - The API function to call
 * @param {any} dependency - The dependency that triggers the API call
 * @param {number} delay - The delay in milliseconds
 * @returns {Object} - Object containing data, loading, and error states
 */
export const useDebouncedApi = (apiCall, dependency, delay = 300) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const debouncedDependency = useDebounce(dependency, delay);

  useEffect(() => {
    if (!debouncedDependency) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiCall(debouncedDependency);
        setData(result);
      } catch (err) {
        setError(err.message || 'An error occurred');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedDependency, apiCall]);

  return { data, loading, error };
};

export default useDebounce;