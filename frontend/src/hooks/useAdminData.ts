import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import type { RootState } from '@/store';
import { fetchUsers } from '@/store/usersSlice';
import { fetchOrders } from '@/store/ordersSlice';
import { fetchProducts, fetchCategories } from '@/store/catalogSlice';

function deepCloneOrder(order: any) {
  return {
    ...order,
    status: order.status === 'shipped' ? 'processing' : order.status,
    createdAt: order.createdAt ?? '',
    updatedAt: order.updatedAt ?? '',
    buyerEmail: order.buyerEmail ?? '',
    redeemedPoints: order.redeemedPoints ?? 0,
    pointsEarned: order.pointsEarned ?? 0,
    items: order.items ? order.items.map((item: any) => ({ ...item })) : [],
    bankDetails: order.bankDetails ? order.bankDetails.map((b: any) => ({ ...b })) : [],
  };
}

function deepCloneProduct(product: any) {
  return {
    ...product,
    createdAt: product.createdAt ?? '',
    updatedAt: product.updatedAt ?? '',
  };
}

function deepCloneCategory(category: any) {
  return {
    ...category,
    createdAt: category.createdAt ?? '',
    updatedAt: category.updatedAt ?? '',
  };
}

export const useAdminData = () => {
  const dispatch = useAppDispatch();
  
  // Redux state
  const users = useAppSelector((state: RootState) => state.users.users);
  const sellers = useAppSelector((state: RootState) => state.users.sellers);
  const agents = useAppSelector((state: RootState) => state.users.agents);
  const products = useAppSelector((state: RootState) => state.catalog.products);
  const orders = useAppSelector((state: RootState) => state.orders.orders);
  const categories = useAppSelector((state: RootState) => state.catalog.categories);
  const loading = useAppSelector((state: RootState) => 
    state.users.loading || state.orders.loading || state.catalog.loading
  );
  
  // Local state for UI
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchUsers({})), // Fetch all users (sellers, agents, buyers)
          dispatch(fetchOrders({})),
          dispatch(fetchProducts({})),
          dispatch(fetchCategories())
        ]);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [dispatch]);

  // Simulate loading for initial mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return {
    users: users ? users.map(u => ({ ...u })) : [],
    sellers: sellers ? sellers.map(s => ({ ...s })) : [],
    agents: agents ? agents.map(a => ({ ...a })) : [],
    products: products ? products.map(deepCloneProduct) : [],
    orders: orders ? orders.map(deepCloneOrder) : [],
    categories: categories ? categories.map(deepCloneCategory) : [],
    isLoading: isLoading || loading,
  };
};