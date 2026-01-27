import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCart, mergeCartFromBackend } from '@/store/cartSlice';
import apiClient from '@/lib/api';

export const useCartSync = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { synced, items } = useAppSelector((state) => state.cart);

  useEffect(() => {
    // When user logs in and cart is not synced, fetch cart from backend
    if (isAuthenticated && user && !synced) {
      // Refresh the API client token before making requests
      apiClient.refreshToken();
      
      dispatch(fetchCart()).unwrap().then((backendCart) => {
        // If backend cart has items, use it
        // If backend cart is empty but local cart has items, we could merge or replace
        // For now, we'll use the backend cart as the source of truth
        dispatch(mergeCartFromBackend(backendCart));
      }).catch((error) => {
        console.warn('Failed to sync cart from backend:', error);
        // If fetch fails, continue using local cart but mark as unsynced
      });
    }
  }, [isAuthenticated, user, synced, dispatch]);

  return { synced };
};