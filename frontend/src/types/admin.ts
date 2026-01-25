import type { User } from '@/store/authSlice';

export interface Product {
  _id: string;
  name: string;
  description: string;
  pricePerKg: number;
  category: string;
  image: string;
  sellerId: string;
  sellerName: string;
  stockQty: number;
  supplyType: 'small_scale' | 'wholesale';
  locationDistrict: string;
  negotiationEnabled: boolean;
  expiresOn?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  _id: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  address: string;
  items: Array<{
    productId: string;
    productName: string;
    sellerId: string;
    sellerName: string;
    qty: number;
    pricePerKg: number;
  }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
  redeemedPoints: number;
  pointsEarned: number;
  status: 'pending' | 'paid' | 'processing' | 'delivered' | 'cancelled';
  receiptUrl?: string;
  paidAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Seller extends User {
  farmName?: string;
  bank?: {
    accountName: string;
    accountNo: string;
    bankName: string;
    branch: string;
  };
}

export interface Agent extends User {
  regions?: string[];
  officeContact?: string;
}

export interface Buyer extends User {
  firstName?: string;
  lastName?: string;
  nic?: string;
  district?: string;
  address?: string;
  preferredCategories?: string[];
  rewardPoints?: number;
}