import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { SensitiveUserData } from '../utils/types';

/**
 * Hook for managing sensitive user data
 * Provides methods to fetch, save, update, and delete sensitive data
 */
export function useSensitiveData() {
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SensitiveUserData | null>(null);

  /**
   * Fetches the user's sensitive data
   */
  const fetchData = useCallback(async () => {
    if (!isAuthenticated) {
      setError('You must be logged in to access sensitive data');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/sensitive-data');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch sensitive data');
      }
      
      const result = await response.json();
      setData(result.data);
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Saves new sensitive data
   */
  const saveData = useCallback(async (newData: SensitiveUserData) => {
    if (!isAuthenticated) {
      setError('You must be logged in to save sensitive data');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/sensitive-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save sensitive data');
      }
      
      setData(newData);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Updates existing sensitive data
   */
  const updateData = useCallback(async (updates: Partial<SensitiveUserData>) => {
    if (!isAuthenticated) {
      setError('You must be logged in to update sensitive data');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/sensitive-data', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update sensitive data');
      }
      
      // Update local data
      setData(prevData => ({
        ...prevData,
        ...updates,
      } as SensitiveUserData));
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  /**
   * Deletes sensitive data
   */
  const deleteData = useCallback(async () => {
    if (!isAuthenticated) {
      setError('You must be logged in to delete sensitive data');
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user/sensitive-data', {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete sensitive data');
      }
      
      setData(null);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  return {
    data,
    isLoading,
    error,
    fetchData,
    saveData,
    updateData,
    deleteData,
  };
}
