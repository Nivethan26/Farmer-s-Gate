// Mock data for admin dashboard
export const now = new Date();
export const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
export const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

export interface Seller {
  id: string;
  name: string;
  email: string;
  phone: string;
  farmName: string;
  district: string;
  status: 'active' | 'pending' | 'suspended';
  rating: number;
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  regions: string[];
  district: string;
  status: 'active' | 'inactive';
}

export interface Product {
  id: string;
  name: string;
  category: string;
  sellerId: string;
  price: number;
  stock: number;
  visible: boolean;
  soldCount: number;
}

export interface Order {
  id: string;
  buyerName: string;
  buyerEmail: string;
  sellerId: string;
  productId: string;
  amount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  productCount: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'seller' | 'system';
  relatedId?: string;
  read: boolean;
  createdAt: string;
}

export const mockSellers: Seller[] = [
  { id: 'FG001', name: 'Arun Kumar', email: 'arun@farm.lk', phone: '+94771234567', farmName: 'Green Valley Farm', district: 'Jaffna', status: 'active', rating: 4.8, createdAt: '2024-01-15' },
  { id: 'FG002', name: 'Priya Devi', email: 'priya@farm.lk', phone: '+94772345678', farmName: 'Sunshine Organics', district: 'Colombo', status: 'active', rating: 4.5, createdAt: '2024-02-20' },
  { id: 'FG003', name: 'Raj Mohan', email: 'raj@farm.lk', phone: '+94773456789', farmName: 'Hill Top Gardens', district: 'Kandy', status: 'pending', rating: 0, createdAt: '2024-11-01' },
  { id: 'FG004', name: 'Lakshmi Nair', email: 'lakshmi@farm.lk', phone: '+94774567890', farmName: 'Paddy Fields Co', district: 'Jaffna', status: 'active', rating: 4.2, createdAt: '2024-03-10' },
  { id: 'FG005', name: 'Suresh Perera', email: 'suresh@farm.lk', phone: '+94775678901', farmName: 'Tropical Fruits Ltd', district: 'Galle', status: 'suspended', rating: 3.1, createdAt: '2024-04-05' },
  { id: 'FG006', name: 'Anitha Rajan', email: 'anitha@farm.lk', phone: '+94776789012', farmName: 'Spice Garden', district: 'Kandy', status: 'active', rating: 4.9, createdAt: '2024-05-12' },
];

export const mockAgents: Agent[] = [
  { id: 'AG001', name: 'Kumara Silva', email: 'kumara@agents.lk', phone: '+94781234567', regions: ['North', 'East'], district: 'Jaffna', status: 'active' },
  { id: 'AG002', name: 'Nimal Fernando', email: 'nimal@agents.lk', phone: '+94782345678', regions: ['West', 'South'], district: 'Colombo', status: 'active' },
  { id: 'AG003', name: 'Saman Jayawardena', email: 'saman@agents.lk', phone: '+94783456789', regions: ['Central'], district: 'Kandy', status: 'inactive' },
  { id: 'AG004', name: 'Dilshan Ratne', email: 'dilshan@agents.lk', phone: '+94784567890', regions: ['South'], district: 'Galle', status: 'active' },
];

export const mockProducts: Product[] = [
  { id: 'P001', name: 'Organic Rice', category: 'Grains', sellerId: 'FG001', price: 250, stock: 100, visible: true, soldCount: 450 },
  { id: 'P002', name: 'Fresh Mangoes', category: 'Fruits', sellerId: 'FG002', price: 150, stock: 50, visible: true, soldCount: 320 },
  { id: 'P003', name: 'Ceylon Cinnamon', category: 'Spices', sellerId: 'FG006', price: 500, stock: 200, visible: true, soldCount: 180 },
  { id: 'P004', name: 'Red Onions', category: 'Vegetables', sellerId: 'FG004', price: 80, stock: 300, visible: true, soldCount: 520 },
  { id: 'P005', name: 'Coconut Oil', category: 'Oils', sellerId: 'FG001', price: 350, stock: 75, visible: false, soldCount: 290 },
  { id: 'P006', name: 'Black Pepper', category: 'Spices', sellerId: 'FG006', price: 800, stock: 150, visible: true, soldCount: 140 },
  { id: 'P007', name: 'Bananas', category: 'Fruits', sellerId: 'FG005', price: 60, stock: 200, visible: true, soldCount: 680 },
  { id: 'P008', name: 'Turmeric Powder', category: 'Spices', sellerId: 'FG006', price: 400, stock: 100, visible: true, soldCount: 95 },
];

export const mockOrders: Order[] = [
  { id: 'ORD001', buyerName: 'John Doe', buyerEmail: 'john@email.com', sellerId: 'FG001', productId: 'P001', amount: 2500, status: 'delivered', createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString() },
  { id: 'ORD002', buyerName: 'Jane Smith', buyerEmail: 'jane@email.com', sellerId: 'FG002', productId: 'P002', amount: 1500, status: 'shipped', createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString() },
  { id: 'ORD003', buyerName: 'Mike Brown', buyerEmail: 'mike@email.com', sellerId: 'FG006', productId: 'P003', amount: 5000, status: 'paid', createdAt: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString() },
  { id: 'ORD004', buyerName: 'Sara Wilson', buyerEmail: 'sara@email.com', sellerId: 'FG004', productId: 'P004', amount: 800, status: 'pending', createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString() },
  { id: 'ORD005', buyerName: 'Tom Lee', buyerEmail: 'tom@email.com', sellerId: 'FG001', productId: 'P005', amount: 3500, status: 'delivered', createdAt: new Date(now.getTime() - 20 * 60 * 60 * 1000).toISOString() },
  { id: 'ORD006', buyerName: 'Amy Chen', buyerEmail: 'amy@email.com', sellerId: 'FG006', productId: 'P006', amount: 8000, status: 'pending', createdAt: new Date(now.getTime() - 23 * 60 * 60 * 1000).toISOString() },
  { id: 'ORD007', buyerName: 'Bob Martin', buyerEmail: 'bob@email.com', sellerId: 'FG002', productId: 'P002', amount: 3000, status: 'paid', createdAt: new Date(now.getTime() - 30 * 60 * 60 * 1000).toISOString() },
  { id: 'ORD008', buyerName: 'Lisa Park', buyerEmail: 'lisa@email.com', sellerId: 'FG005', productId: 'P007', amount: 600, status: 'shipped', createdAt: new Date(now.getTime() - 36 * 60 * 60 * 1000).toISOString() },
];

export const mockCategories: Category[] = [
  { id: 'CAT001', name: 'Grains', productCount: 1 },
  { id: 'CAT002', name: 'Fruits', productCount: 2 },
  { id: 'CAT003', name: 'Spices', productCount: 3 },
  { id: 'CAT004', name: 'Vegetables', productCount: 1 },
  { id: 'CAT005', name: 'Oils', productCount: 1 },
];

export const mockNotifications: Notification[] = [
  { id: 'N001', title: 'New Seller Registration', message: 'Raj Mohan has registered and is awaiting approval', type: 'seller', relatedId: 'FG003', read: false, createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString() },
  { id: 'N002', title: 'Order Pending Payment', message: 'Order ORD004 is pending payment for 12 hours', type: 'order', relatedId: 'ORD004', read: false, createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString() },
  { id: 'N003', title: 'Low Stock Alert', message: 'Fresh Mangoes stock is running low (50 units)', type: 'system', read: true, createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString() },
  { id: 'N004', title: 'New Order Received', message: 'New order ORD006 worth LKR 8,000', type: 'order', relatedId: 'ORD006', read: false, createdAt: new Date(now.getTime() - 10 * 60 * 60 * 1000).toISOString() },
];