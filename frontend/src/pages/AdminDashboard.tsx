import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { 
  Search, Bell, Download, Eye, Edit, Trash2, Check, X, 
  ChevronDown, Filter, TrendingUp, TrendingDown, Package,
  Users, ShoppingCart, DollarSign, BarChart3, Mail, Phone,
  MapPin, Building, Star, CheckCircle, Clock, Truck, Archive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Navbar } from '@/components/layout/Navbar';
import { toast } from 'sonner';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Area } from 'recharts';


// TYPE DEFINITIONS

interface Seller {
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

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  regions: string[];
  district: string;
  status: 'active' | 'inactive';
}

interface Product {
  id: string;
  name: string;
  category: string;
  sellerId: string;
  price: number;
  stock: number;
  visible: boolean;
  soldCount: number;
}

interface Order {
  id: string;
  buyerName: string;
  buyerEmail: string;
  sellerId: string;
  productId: string;
  amount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  productCount: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'seller' | 'system';
  relatedId?: string;
  read: boolean;
  createdAt: string;
}

// MOCK DATA - Replace with Redux selectors in production

const now = new Date();
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const twoDaysAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

const mockSellers: Seller[] = [
  { id: 'FG001', name: 'Arun Kumar', email: 'arun@farm.lk', phone: '+94771234567', farmName: 'Green Valley Farm', district: 'Jaffna', status: 'active', rating: 4.8, createdAt: '2024-01-15' },
  { id: 'FG002', name: 'Priya Devi', email: 'priya@farm.lk', phone: '+94772345678', farmName: 'Sunshine Organics', district: 'Colombo', status: 'active', rating: 4.5, createdAt: '2024-02-20' },
  { id: 'FG003', name: 'Raj Mohan', email: 'raj@farm.lk', phone: '+94773456789', farmName: 'Hill Top Gardens', district: 'Kandy', status: 'pending', rating: 0, createdAt: '2024-11-01' },
  { id: 'FG004', name: 'Lakshmi Nair', email: 'lakshmi@farm.lk', phone: '+94774567890', farmName: 'Paddy Fields Co', district: 'Jaffna', status: 'active', rating: 4.2, createdAt: '2024-03-10' },
  { id: 'FG005', name: 'Suresh Perera', email: 'suresh@farm.lk', phone: '+94775678901', farmName: 'Tropical Fruits Ltd', district: 'Galle', status: 'suspended', rating: 3.1, createdAt: '2024-04-05' },
  { id: 'FG006', name: 'Anitha Rajan', email: 'anitha@farm.lk', phone: '+94776789012', farmName: 'Spice Garden', district: 'Kandy', status: 'active', rating: 4.9, createdAt: '2024-05-12' },
];

const mockAgents: Agent[] = [
  { id: 'AG001', name: 'Kumara Silva', email: 'kumara@agents.lk', phone: '+94781234567', regions: ['North', 'East'], district: 'Jaffna', status: 'active' },
  { id: 'AG002', name: 'Nimal Fernando', email: 'nimal@agents.lk', phone: '+94782345678', regions: ['West', 'South'], district: 'Colombo', status: 'active' },
  { id: 'AG003', name: 'Saman Jayawardena', email: 'saman@agents.lk', phone: '+94783456789', regions: ['Central'], district: 'Kandy', status: 'inactive' },
  { id: 'AG004', name: 'Dilshan Ratne', email: 'dilshan@agents.lk', phone: '+94784567890', regions: ['South'], district: 'Galle', status: 'active' },
];

const mockProducts: Product[] = [
  { id: 'P001', name: 'Organic Rice', category: 'Grains', sellerId: 'FG001', price: 250, stock: 100, visible: true, soldCount: 450 },
  { id: 'P002', name: 'Fresh Mangoes', category: 'Fruits', sellerId: 'FG002', price: 150, stock: 50, visible: true, soldCount: 320 },
  { id: 'P003', name: 'Ceylon Cinnamon', category: 'Spices', sellerId: 'FG006', price: 500, stock: 200, visible: true, soldCount: 180 },
  { id: 'P004', name: 'Red Onions', category: 'Vegetables', sellerId: 'FG004', price: 80, stock: 300, visible: true, soldCount: 520 },
  { id: 'P005', name: 'Coconut Oil', category: 'Oils', sellerId: 'FG001', price: 350, stock: 75, visible: false, soldCount: 290 },
  { id: 'P006', name: 'Black Pepper', category: 'Spices', sellerId: 'FG006', price: 800, stock: 150, visible: true, soldCount: 140 },
  { id: 'P007', name: 'Bananas', category: 'Fruits', sellerId: 'FG005', price: 60, stock: 200, visible: true, soldCount: 680 },
  { id: 'P008', name: 'Turmeric Powder', category: 'Spices', sellerId: 'FG006', price: 400, stock: 100, visible: true, soldCount: 95 },
];

const mockOrders: Order[] = [
  { id: 'ORD001', buyerName: 'John Doe', buyerEmail: 'john@email.com', sellerId: 'FG001', productId: 'P001', amount: 2500, status: 'delivered', createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString() },
  { id: 'ORD002', buyerName: 'Jane Smith', buyerEmail: 'jane@email.com', sellerId: 'FG002', productId: 'P002', amount: 1500, status: 'shipped', createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString() },
  { id: 'ORD003', buyerName: 'Mike Brown', buyerEmail: 'mike@email.com', sellerId: 'FG006', productId: 'P003', amount: 5000, status: 'paid', createdAt: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString() },
  { id: 'ORD004', buyerName: 'Sara Wilson', buyerEmail: 'sara@email.com', sellerId: 'FG004', productId: 'P004', amount: 800, status: 'pending', createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString() },
  { id: 'ORD005', buyerName: 'Tom Lee', buyerEmail: 'tom@email.com', sellerId: 'FG001', productId: 'P005', amount: 3500, status: 'delivered', createdAt: new Date(now.getTime() - 20 * 60 * 60 * 1000).toISOString() },
  { id: 'ORD006', buyerName: 'Amy Chen', buyerEmail: 'amy@email.com', sellerId: 'FG006', productId: 'P006', amount: 8000, status: 'pending', createdAt: new Date(now.getTime() - 23 * 60 * 60 * 1000).toISOString() },
  { id: 'ORD007', buyerName: 'Bob Martin', buyerEmail: 'bob@email.com', sellerId: 'FG002', productId: 'P002', amount: 3000, status: 'paid', createdAt: new Date(now.getTime() - 30 * 60 * 60 * 1000).toISOString() },
  { id: 'ORD008', buyerName: 'Lisa Park', buyerEmail: 'lisa@email.com', sellerId: 'FG005', productId: 'P007', amount: 600, status: 'shipped', createdAt: new Date(now.getTime() - 36 * 60 * 60 * 1000).toISOString() },
];

const mockCategories: Category[] = [
  { id: 'CAT001', name: 'Grains', productCount: 1 },
  { id: 'CAT002', name: 'Fruits', productCount: 2 },
  { id: 'CAT003', name: 'Spices', productCount: 3 },
  { id: 'CAT004', name: 'Vegetables', productCount: 1 },
  { id: 'CAT005', name: 'Oils', productCount: 1 },
];

const mockNotifications: Notification[] = [
  { id: 'N001', title: 'New Seller Registration', message: 'Raj Mohan has registered and is awaiting approval', type: 'seller', relatedId: 'FG003', read: false, createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString() },
  { id: 'N002', title: 'Order Pending Payment', message: 'Order ORD004 is pending payment for 12 hours', type: 'order', relatedId: 'ORD004', read: false, createdAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString() },
  { id: 'N003', title: 'Low Stock Alert', message: 'Fresh Mangoes stock is running low (50 units)', type: 'system', read: true, createdAt: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString() },
  { id: 'N004', title: 'New Order Received', message: 'New order ORD006 worth LKR 8,000', type: 'order', relatedId: 'ORD006', read: false, createdAt: new Date(now.getTime() - 10 * 60 * 60 * 1000).toISOString() },
];

// HELPER FUNCTIONS

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', minimumFractionDigits: 0 }).format(amount);
};

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const exportToCSV = <T extends object>(data: T[], filename: string): void => {
  if (data.length === 0) {
    toast.error('No data to export');
    return;
  }
  const headers = Object.keys(data[0] as object);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => JSON.stringify((row as Record<string, unknown>)[header] ?? '')).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
  link.click();
  toast.success(`Exported ${data.length} records to ${filename}.csv`);
};

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    pending: 'bg-amber-500/10 text-amber-600 border-amber-200',
    suspended: 'bg-red-500/10 text-red-600 border-red-200',
    inactive: 'bg-slate-500/10 text-slate-600 border-slate-200',
    paid: 'bg-blue-500/10 text-blue-600 border-blue-200',
    shipped: 'bg-purple-500/10 text-purple-600 border-purple-200',
    delivered: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
  };
  return colors[status] || 'bg-slate-100 text-slate-600';
};

// SUB-COMPONENTS

// Stats Card Component
const StatsCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  trendValue 
}: { 
  title: string; 
  value: string; 
  subtitle: string; 
  icon: React.ElementType; 
  trend?: 'up' | 'down'; 
  trendValue?: string;
}) => (
  <Card className="dashboard-card group hover:shadow-lg transition-all duration-300">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <Icon className="h-5 w-5 text-primary" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold tracking-tight">{value}</div>
      <div className="flex items-center gap-2 mt-1">
        {trend && (
          <span className={`flex items-center text-xs font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-red-500'}`}>
            {trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
            {trendValue}
          </span>
        )}
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </CardContent>
  </Card>
);

// Loading Skeleton
const TableSkeleton = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-16" />
      </div>
    ))}
  </div>
);

// MAIN COMPONENT

const AdminDashboard = () => {
  // State Management
  const [sellers, setSellers] = useState<Seller[]>(mockSellers);
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [categories] = useState<Category[]>(mockCategories);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  
  // UI State
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [sellerSearch, setSellerSearch] = useState('');
  const [districtFilter, setDistrictFilter] = useState('all');
  const [agentDistrictFilter, setAgentDistrictFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearch, setOrderSearch] = useState('');
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const sellerRowRefs = useRef<Record<string, HTMLTableRowElement | null>>({});

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // COMPUTED DATA

  // Unique districts from sellers and agents
  const sellerDistricts = useMemo(() => 
    [...new Set(sellers.map(s => s.district))].sort(), 
    [sellers]
  );
  
  const agentDistricts = useMemo(() => 
    [...new Set(agents.map(a => a.district))].sort(), 
    [agents]
  );

  // Filtered sellers
  const filteredSellers = useMemo(() => {
    return sellers.filter(seller => {
      const matchesDistrict = districtFilter === 'all' || seller.district === districtFilter;
      const matchesSearch = sellerSearch === '' || 
        seller.id.toLowerCase().includes(sellerSearch.toLowerCase()) ||
        seller.name.toLowerCase().includes(sellerSearch.toLowerCase());
      return matchesDistrict && matchesSearch;
    });
  }, [sellers, districtFilter, sellerSearch]);

  // Filtered agents
  const filteredAgents = useMemo(() => {
    return agents.filter(agent => 
      agentDistrictFilter === 'all' || agent.district === agentDistrictFilter
    );
  }, [agents, agentDistrictFilter]);

  // Filtered products by category
  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      categoryFilter === 'all' || product.category === categoryFilter
    );
  }, [products, categoryFilter]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
      const matchesSearch = orderSearch === '' ||
        order.id.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.buyerName.toLowerCase().includes(orderSearch.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  // Last 24 hours sales
  const last24HoursSales = useMemo(() => {
    const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const recentOrders = orders.filter(o => new Date(o.createdAt) >= cutoff);
    return {
      total: recentOrders.reduce((sum, o) => sum + o.amount, 0),
      count: recentOrders.length,
    };
  }, [orders]);

  // Previous 24 hours sales (24-48 hours ago)
  const previous24HoursSales = useMemo(() => {
    const cutoff48 = new Date(now.getTime() - 48 * 60 * 60 * 1000);
    const cutoff24 = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const prevOrders = orders.filter(o => {
      const date = new Date(o.createdAt);
      return date >= cutoff48 && date < cutoff24;
    });
    return {
      total: prevOrders.reduce((sum, o) => sum + o.amount, 0),
      count: prevOrders.length,
    };
  }, [orders]);

  // Sales trend calculation
  const salesTrend = useMemo(() => {
    if (previous24HoursSales.total === 0) return { direction: 'up' as const, value: '100%' };
    const change = ((last24HoursSales.total - previous24HoursSales.total) / previous24HoursSales.total) * 100;
    return {
      direction: change >= 0 ? 'up' as const : 'down' as const,
      value: `${Math.abs(change).toFixed(1)}%`,
    };
  }, [last24HoursSales, previous24HoursSales]);

  // Order counts by status
  const orderCounts = useMemo(() => ({
    pending: orders.filter(o => o.status === 'pending').length,
    paid: orders.filter(o => o.status === 'paid').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  }), [orders]);

  // Unread notifications count
  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read).length, 
    [notifications]
  );

  // Chart data - Products sold by category
  const categoryChartData = useMemo(() => {
    const categoryTotals = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + product.soldCount;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      sold: value,
      revenue: products
        .filter(p => p.category === name)
        .reduce((sum, p) => sum + (p.soldCount * p.price), 0) / 1000,
    }));
  }, [products]);

  // Seller products for details modal
  const getSellerProducts = useCallback((sellerId: string) => {
    return products.filter(p => p.sellerId === sellerId);
  }, [products]);

  // Seller performance metrics
  const getSellerMetrics = useCallback((sellerId: string) => {
    const sellerOrders = orders.filter(o => o.sellerId === sellerId);
    return {
      totalSales: sellerOrders.reduce((sum, o) => sum + o.amount, 0),
      totalOrders: sellerOrders.length,
    };
  }, [orders]);

  // EVENT HANDLERS

  // Seller ID Search with auto-scroll and modal open
  const handleSellerSearch = useCallback((value: string) => {
    setSellerSearch(value);
    
    // Check for FG### format match
    const match = value.toUpperCase().match(/^FG\d{3}$/);
    if (match) {
      const seller = sellers.find(s => s.id.toUpperCase() === match[0]);
      if (seller) {
        // Set filter to show all to ensure seller is visible
        setDistrictFilter('all');
        
        // Scroll to seller row after a brief delay for render
        setTimeout(() => {
          const rowRef = sellerRowRefs.current[seller.id];
          if (rowRef) {
            rowRef.scrollIntoView({ behavior: 'smooth', block: 'center' });
            rowRef.classList.add('ring-2', 'ring-primary');
            setTimeout(() => rowRef.classList.remove('ring-2', 'ring-primary'), 2000);
          }
          setSelectedSeller(seller);
        }, 100);
      }
    }
  }, [sellers]);

  // Mark order as paid
  const handleMarkOrderPaid = useCallback((orderId: string) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId ? { ...o, status: 'paid' as const } : o
    ));
    toast.success(`Order ${orderId} marked as paid`);
  }, []);

  // Toggle product visibility
  const handleToggleProductVisibility = useCallback((productId: string) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, visible: !p.visible } : p
    ));
    toast.success('Product visibility updated');
  }, []);

  // Delete product
  const handleDeleteProduct = useCallback((product: Product) => {
    setProducts(prev => prev.filter(p => p.id !== product.id));
    setDeleteProduct(null);
    toast.success(`${product.name} has been deleted`);
  }, []);

  // Bulk select products
  const handleSelectProduct = useCallback((productId: string, checked: boolean) => {
    setSelectedProducts(prev => 
      checked ? [...prev, productId] : prev.filter(id => id !== productId)
    );
  }, []);

  // Export selected products
  const handleExportSelectedProducts = useCallback(() => {
    const selectedData = products.filter(p => selectedProducts.includes(p.id));
    exportToCSV(selectedData, 'selected_products');
    setSelectedProducts([]);
  }, [products, selectedProducts]);

  // Mark notification as read
  const handleMarkNotificationRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
  }, []);

  // Dismiss notification
  const handleDismissNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    toast.success('Notification dismissed');
  }, []);

  // Export chart data
  const handleExportChartData = useCallback(() => {
    exportToCSV(categoryChartData, 'category_analytics');
  }, [categoryChartData]);

  const handleDeleteSeller = (sellerId: string) => {
    if (!confirm("Are you sure you want to delete this seller?")) return;

    // Frontend-only state update
    setSellers(prev => prev.filter(seller => seller.id !== sellerId));
  };

  // For edit modal
const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
const [newStatus, setNewStatus] = useState<Agent["status"]>("active");

// Open edit modal with current status
const openEditModal = (agent: Agent) => {
  setEditingAgent(agent);
  setNewStatus(agent.status);
};

// Close modal
const closeModal = () => {
  setEditingAgent(null);
};

// Delete (frontend only)
const handleDeleteAgent = (id: string) => {
  if (!confirm("Are you sure you want to delete this agent?")) return;

  setAgents(prev => prev.filter(a => a.id !== id));
};

// Save updated status
const saveStatusChange = () => {
  if (!editingAgent) return;
  setAgents(prev =>
    prev.map(agent =>
      agent.id === editingAgent.id ? { ...agent, status: newStatus } : agent
    )
  );
  closeModal();
};
  // RENDER

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Navbar />
      <header className="mt-5 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-lg">Admin Dashboard</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto gap-2 bg-transparent p-0">
            {[
              { value: 'overview', label: 'Overview', icon: BarChart3 },
              { value: 'sellers', label: 'Sellers', icon: Users },
              { value: 'agents', label: 'Agents', icon: Building },
              { value: 'products', label: 'Products', icon: Package },
              { value: 'orders', label: 'Orders', icon: ShoppingCart },
            ].map(tab => (
              <TabsTrigger 
                key={tab.value}
                value={tab.value}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2.5 rounded-lg border bg-card"
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Sales (24h)"
                value={formatCurrency(last24HoursSales.total)}
                subtitle="vs previous 24h"
                icon={DollarSign}
                trend={salesTrend.direction}
                trendValue={salesTrend.value}
              />
              <StatsCard
                title="Orders (24h)"
                value={last24HoursSales.count.toString()}
                subtitle={`${orderCounts.pending} pending`}
                icon={ShoppingCart}
                trend={last24HoursSales.count >= previous24HoursSales.count ? 'up' : 'down'}
                trendValue={`${Math.abs(last24HoursSales.count - previous24HoursSales.count)} orders`}
              />
              <StatsCard
                title="Active Sellers"
                value={sellers.filter(s => s.status === 'active').length.toString()}
                subtitle={`${sellers.filter(s => s.status === 'pending').length} pending approval`}
                icon={Users}
              />
              <StatsCard
                title="Products"
                value={products.length.toString()}
                subtitle={`${products.filter(p => p.visible).length} visible`}
                icon={Package}
              />
            </div>

            {/* Charts */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Products Sold by Category */}
              <Card className="dashboard-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Products Sold by Category</CardTitle>
                    <CardDescription>Total units sold per category</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleExportChartData}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-[300px] w-full" />
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={categoryChartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="name" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Bar dataKey="sold" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              {/* Revenue Trend */}
              <Card className="dashboard-card">
                <CardHeader>
                  <CardTitle>Revenue by Category</CardTitle>
                  <CardDescription>Revenue in thousands (LKR)</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-[300px] w-full" />
                  ) : (
                    <ResponsiveContainer width="100%" height={300}>
                      <ComposedChart data={categoryChartData}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                        <XAxis dataKey="name" className="text-xs" />
                        <YAxis className="text-xs" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                          formatter={(value: number) => [`${value.toFixed(1)}K`, 'Revenue']}
                        />
                        <Area type="monotone" dataKey="revenue" fill="hsl(var(--primary) / 0.2)" stroke="hsl(var(--primary))" />
                        <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Order Status Overview */}
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle>Order Status Overview</CardTitle>
                <CardDescription>Real-time order status distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { status: 'pending', label: 'Pending', icon: Clock, count: orderCounts.pending },
                    { status: 'paid', label: 'Paid', icon: CheckCircle, count: orderCounts.paid },
                    { status: 'shipped', label: 'Shipped', icon: Truck, count: orderCounts.shipped },
                    { status: 'delivered', label: 'Delivered', icon: Archive, count: orderCounts.delivered },
                  ].map(item => (
                    <div 
                      key={item.status}
                      className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className={`p-2 rounded-lg ${getStatusColor(item.status)}`}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{item.count}</p>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SELLERS TAB */}
          <TabsContent value="sellers" className="space-y-6">
            {/* Filters */}
            <Card className="dashboard-card">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Label htmlFor="seller-search" className="sr-only">Search Seller ID</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="seller-search"
                        data-testid="seller-search"
                        placeholder="Search by ID (FG###) or name..."
                        value={sellerSearch}
                        onChange={(e) => handleSellerSearch(e.target.value)}
                        className="pl-10"
                        aria-label="Search sellers by ID or name"
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-48">
                    <Select value={districtFilter} onValueChange={setDistrictFilter}>
                      <SelectTrigger data-testid="district-filter" aria-label="Filter by district">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="All Districts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Districts</SelectItem>
                        {sellerDistricts.map(district => (
                          <SelectItem key={district} value={district}>{district}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => exportToCSV(filteredSellers, 'sellers')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Sellers Table */}
            <Card className="dashboard-card">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-6"><TableSkeleton /></div>
                ) : (
                  <>
                    {/* Desktop Table */}
                    <div className="hidden sm:block overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Farm</TableHead>
                            <TableHead>District</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {filteredSellers.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                No sellers found
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredSellers.map(seller => (
                              <TableRow key={seller.id}>
                                <TableCell className="font-mono text-sm">{seller.id}</TableCell>
                                <TableCell className="font-medium">{seller.name}</TableCell>
                                <TableCell>{seller.farmName}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                    {seller.district}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  {seller.rating > 0 ? (
                                    <div className="flex items-center gap-1">
                                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                      <span>{seller.rating.toFixed(1)}</span>
                                    </div>
                                  ) : (
                                    <span className="text-muted-foreground">N/A</span>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className={getStatusColor(seller.status)}>
                                    {seller.status}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button 
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteSeller(seller.id)}
                                  >
                                    Delete
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="sm:hidden space-y-4 p-4">
                      {filteredSellers.length === 0 ? (
                        <p className="text-center text-muted-foreground">No sellers found</p>
                      ) : (
                        filteredSellers.map(seller => (
                          <div 
                            key={seller.id} 
                            className="border rounded-lg p-4 space-y-2 bg-white shadow-sm"
                          >
                            <div className="flex justify-between">
                              <span className="font-mono text-sm font-bold">#{seller.id}</span>
                              <Badge variant="outline" className={getStatusColor(seller.status)}>
                                {seller.status}
                              </Badge>
                            </div>

                            <div>
                              <p className="font-medium text-lg">{seller.name}</p>
                              <p className="text-sm text-muted-foreground">{seller.farmName}</p>
                            </div>

                            <div className="flex items-center gap-1 text-sm">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              {seller.district}
                            </div>

                            <div className="flex items-center gap-1 text-sm">
                              {seller.rating > 0 ? (
                                <>
                                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                  <span>{seller.rating.toFixed(1)}</span>
                                </>
                              ) : (
                                <span className="text-muted-foreground">No Rating</span>
                              )}
                            </div>

                            <Button 
                              className="w-full mt-2"
                              variant="destructive"
                              onClick={() => handleDeleteSeller(seller.id)}
                            >
                              Delete Seller
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* AGENTS TAB */}
          <TabsContent value="agents" className="space-y-6">
            {/* Filter Card */}
            <Card className="dashboard-card">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Select value={agentDistrictFilter} onValueChange={setAgentDistrictFilter}>
                      <SelectTrigger aria-label="Filter agents by district">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="All Districts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Districts</SelectItem>
                        {agentDistricts.map(district => (
                          <SelectItem key={district} value={district}>{district}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button variant="outline" onClick={() => exportToCSV(filteredAgents, "agents")}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Notification
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Agents Table */}
            <Card className="dashboard-card">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-6"><TableSkeleton /></div>
                ) : (
                  <>
                    {/* Desktop Table */}
                    <div className="hidden sm:block overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Regions</TableHead>
                            <TableHead>District</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {filteredAgents.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                No agents found
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredAgents.map(agent => (
                              <TableRow key={agent.id}>
                                <TableCell className="font-medium">{agent.name}</TableCell>

                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <Mail className="h-3 w-3 text-muted-foreground" />
                                    {agent.email}
                                  </div>
                                </TableCell>

                                <TableCell>
                                  <div className="flex items-center gap-1">
                                    <Phone className="h-3 w-3 text-muted-foreground" />
                                    {agent.phone}
                                  </div>
                                </TableCell>

                                <TableCell>
                                  <div className="flex gap-1 flex-wrap">
                                    {agent.regions.map(region => (
                                      <Badge key={region} variant="secondary" className="text-xs">
                                        {region}
                                      </Badge>
                                    ))}
                                  </div>
                                </TableCell>

                                <TableCell>{agent.district}</TableCell>

                                <TableCell>
                                  <Badge variant="outline" className={getStatusColor(agent.status)}>
                                    {agent.status}
                                  </Badge>
                                </TableCell>

                                {/* ACTIONS COLUMN */}
                                <TableCell className="text-right flex gap-2 justify-end">
                                  {/* Edit */}
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => openEditModal(agent)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>

                                  {/* Delete */}
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => handleDeleteAgent(agent.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="sm:hidden space-y-4 p-4">
                      {filteredAgents.length === 0 ? (
                        <p className="text-center text-muted-foreground">No agents found</p>
                      ) : (
                        filteredAgents.map(agent => (
                          <div 
                            key={agent.id} 
                            className="border rounded-lg p-4 space-y-3 bg-white shadow-sm"
                          >
                            <div className="text-lg font-semibold">{agent.name}</div>

                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              {agent.email}
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              {agent.phone}
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {agent.regions.map(region => (
                                <Badge key={region} variant="secondary" className="text-xs px-2 py-0.5">
                                  {region}
                                </Badge>
                              ))}
                            </div>

                            <div className="text-sm">
                              <span className="font-medium">District: </span>
                              {agent.district}
                            </div>

                            <Badge variant="outline" className={getStatusColor(agent.status)}>
                              {agent.status}
                            </Badge>

                            {/* Mobile Action Buttons */}
                            <div className="flex gap-3 pt-2">
                              <Button 
                                className="flex-1"
                                variant="outline"
                                onClick={() => openEditModal(agent)}
                              >
                                <Edit className="h-4 w-4 mr-1" /> Edit
                              </Button>

                              <Button 
                                className="flex-1"
                                variant="destructive"
                                onClick={() => handleDeleteAgent(agent.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" /> Delete
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* EDIT MODAL */}
            {editingAgent && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg w-80 space-y-4 shadow-lg">
                  <h2 className="text-lg font-semibold">Edit Status</h2>

                  <Select value={newStatus} onValueChange={value => setNewStatus(value as Agent["status"])}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={closeModal}>Cancel</Button>
                    <Button onClick={saveStatusChange}>Save</Button>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* PRODUCTS TAB */}
          <TabsContent value="products" className="space-y-6">
            <Card className="dashboard-card">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                      <SelectTrigger aria-label="Filter by category">
                        <Package className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(cat => (
                          <SelectItem key={cat.id} value={cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <Card key={i} className="dashboard-card">
                    <CardContent className="pt-6">
                      <Skeleton className="h-6 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-1/2 mb-4" />
                      <Skeleton className="h-10 w-full" />
                    </CardContent>
                  </Card>
                ))
              ) : filteredProducts.length === 0 ? (
                <Card className="col-span-full dashboard-card">
                  <CardContent className="py-12 text-center text-muted-foreground">
                    No products found in this category
                  </CardContent>
                </Card>
              ) : (
                filteredProducts.map(product => (
                  <Card key={product.id} className={`dashboard-card transition-all`}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-4">
                        <Badge variant="secondary">{product.category}</Badge>
                      </div>

                      <h3 className="font-semibold mb-1">{product.name}</h3>
                      <p className="text-lg font-bold text-primary mb-2">
                        {formatCurrency(product.price)}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span>Stock: {product.stock}</span>
                        <span>Sold: {product.soldCount}</span>
                      </div>

                      {/* No action buttons → pure view only */}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* ORDERS TAB */}
          <TabsContent value="orders" className="space-y-6" data-testid="orders-filter">
            <Card className="dashboard-card">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by order ID or buyer name..."
                        value={orderSearch}
                        onChange={(e) => setOrderSearch(e.target.value)}
                        className="pl-10"
                        aria-label="Search orders"
                      />
                    </div>
                  </div>
                  <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
                    <SelectTrigger className="w-full sm:w-40" aria-label="Filter by status">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    variant="outline"
                    onClick={() => exportToCSV(filteredOrders, 'orders')}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Real-time Status Counts */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { status: 'pending', label: 'Pending', count: orderCounts.pending, color: 'bg-amber-500' },
                { status: 'paid', label: 'Paid', count: orderCounts.paid, color: 'bg-blue-500' },
                { status: 'shipped', label: 'Shipped', count: orderCounts.shipped, color: 'bg-purple-500' },
                { status: 'delivered', label: 'Delivered', count: orderCounts.delivered, color: 'bg-emerald-500' },
              ].map(item => (
                <Card 
                  key={item.status}
                  className={`dashboard-card cursor-pointer transition-all hover:scale-105 ${orderStatusFilter === item.status ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => setOrderStatusFilter(item.status)}
                >
                  <CardContent className="pt-4 pb-4 flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${item.color}`} />
                    <div>
                      <p className="text-2xl font-bold">{item.count}</p>
                      <p className="text-xs text-muted-foreground">{item.label}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="dashboard-card">
              <CardContent className="p-0">
                {isLoading ? (
                  <div className="p-6"><TableSkeleton /></div>
                ) : (
                  <>
                    {/* ---------------- DESKTOP TABLE VIEW ---------------- */}
                    <div className="hidden sm:block overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Buyer</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {filteredOrders.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                No orders found
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredOrders.map(order => (
                              <TableRow key={order.id}>
                                <TableCell className="font-mono text-sm">{order.id}</TableCell>

                                <TableCell>
                                  <div>
                                    <p className="font-medium">{order.buyerName}</p>
                                    <p className="text-xs text-muted-foreground">{order.buyerEmail}</p>
                                  </div>
                                </TableCell>

                                <TableCell className="font-semibold">
                                  {formatCurrency(order.amount)}
                                </TableCell>

                                <TableCell>
                                  <Badge variant="outline" className={getStatusColor(order.status)}>
                                    {order.status}
                                  </Badge>
                                </TableCell>

                                <TableCell className="text-sm text-muted-foreground">
                                  {formatDate(order.createdAt)}
                                </TableCell>

                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="sm">
                                      <Eye className="h-4 w-4" />
                                    </Button>

                                    {order.status === "pending" && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleMarkOrderPaid(order.id)}
                                      >
                                        <Check className="h-4 w-4 mr-1" />
                                        Mark Paid
                                      </Button>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {/* ---------------- MOBILE CARD VIEW ---------------- */}
                    <div className="sm:hidden space-y-4 p-4">
                      {filteredOrders.length === 0 ? (
                        <p className="text-center text-muted-foreground">No orders found</p>
                      ) : (
                        filteredOrders.map(order => (
                          <div
                            key={order.id}
                            className="border rounded-lg p-4 bg-white shadow-sm space-y-3"
                          >
                            {/* Order ID */}
                            <div className="font-mono text-sm text-muted-foreground">
                              #{order.id}
                            </div>

                            {/* Buyer */}
                            <div>
                              <p className="font-semibold">{order.buyerName}</p>
                              <p className="text-xs text-muted-foreground">{order.buyerEmail}</p>
                            </div>

                            {/* Amount */}
                            <div className="text-lg font-bold">
                              {formatCurrency(order.amount)}
                            </div>

                            {/* Status */}
                            <div>
                              <Badge variant="outline" className={getStatusColor(order.status)}>
                                {order.status}
                              </Badge>
                            </div>

                            {/* Date */}
                            <div className="text-sm text-muted-foreground">
                              {formatDate(order.createdAt)}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-2">
                              <Button variant="ghost" size="sm" className="flex-1">
                                <Eye className="h-4 w-4 mr-1" /> View
                              </Button>

                              {order.status === "pending" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => handleMarkOrderPaid(order.id)}
                                >
                                  <Check className="h-4 w-4 mr-1" /> Mark Paid
                                </Button>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}

              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* SELLER DETAILS SHEET */}
      
    </div>
  );
};

export default AdminDashboard;