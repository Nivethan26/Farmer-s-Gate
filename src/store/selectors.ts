import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './index';

export const selectFilteredProducts = createSelector(
  [(state: RootState) => state.catalog.products, (state: RootState) => state.catalog.filters],
  (products, filters) => {
    let filtered = [...products];

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter((p) => filters.categories.includes(p.category));
    }

    // Filter by districts
    if (filters.districts.length > 0) {
      filtered = filtered.filter((p) => filters.districts.includes(p.locationDistrict));
    }

    // Filter by supply types
    if (filters.supplyTypes.length > 0) {
      filtered = filtered.filter((p) => filters.supplyTypes.includes(p.supplyType));
    }

    // Filter by price range
    filtered = filtered.filter(
      (p) => p.pricePerKg >= filters.minPrice && p.pricePerKg <= filters.maxPrice
    );

    // Filter by search
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.sellerName.toLowerCase().includes(searchLower) ||
          p.locationDistrict.toLowerCase().includes(searchLower)
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.pricePerKg - b.pricePerKg);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.pricePerKg - a.pricePerKg);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return filtered;
  }
);

export const selectUserNegotiations = createSelector(
  [(state: RootState) => state.catalog.negotiations, (state: RootState) => state.auth.user],
  (negotiations, user) => {
    if (!user) return [];
    
    if (user.role === 'buyer') {
      return negotiations.filter((n) => n.buyerId === user.id);
    } else if (user.role === 'seller') {
      return negotiations.filter((n) => n.sellerId === user.id);
    }
    
    return negotiations;
  }
);

export const selectUserOrders = createSelector(
  [(state: RootState) => state.orders.orders, (state: RootState) => state.auth.user],
  (orders, user) => {
    if (!user || user.role !== 'buyer') return [];
    return orders.filter((o) => o.buyerId === user.id);
  }
);

export const selectSellerProducts = createSelector(
  [(state: RootState) => state.catalog.products, (state: RootState) => state.auth.user],
  (products, user) => {
    if (!user || user.role !== 'seller') return [];
    return products.filter((p) => p.sellerId === user.id);
  }
);

export const selectPendingSellers = createSelector(
  [(state: RootState) => state.users.sellers],
  (sellers) => sellers.filter((s) => s.status === 'pending')
);

export const selectPendingOrders = createSelector(
  [(state: RootState) => state.orders.orders],
  (orders) => orders.filter((o) => o.status === 'pending' && o.receiptUrl)
);
