import { useMemo } from 'react';
import { StatsCard } from '../ui/StatsCard';
import { CategoryChart } from '../charts/CategoryChart';
import { RevenueChart } from '../charts/RevenueChart';
import { OrderStatusGrid } from '../charts/OrderStatusGrid';
import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import { formatCurrency, exportToCSV } from '@/utils/adminUtils';
import type { Order, Seller, Product, Category } from '@/types/admin';

interface OverviewTabProps {
  orders: Order[];
  sellers: Seller[];
  products: Product[];
  categories: Category[];
  isLoading: boolean;
}

export const OverviewTab = ({ orders, sellers, products, categories, isLoading }: OverviewTabProps) => {
  const now = new Date();
  
  // Calculate sales metrics
  const { last24HoursSales, previous24HoursSales, salesTrend } = useMemo(() => {
    const cutoff24 = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const cutoff48 = new Date(now.getTime() - 48 * 60 * 60 * 1000);
    
    const last24Orders = orders.filter(o => new Date(o.createdAt) >= cutoff24);
    const prev24Orders = orders.filter(o => {
      const date = new Date(o.createdAt);
      return date >= cutoff48 && date < cutoff24;
    });
    
    const last24HoursSales = {
      total: last24Orders.reduce((sum, o) => sum + o.total, 0),
      count: last24Orders.length,
    };
    
    const previous24HoursSales = {
      total: prev24Orders.reduce((sum, o) => sum + o.total, 0),
      count: prev24Orders.length,
    };
    
    const salesTrend = previous24HoursSales.total === 0 
      ? { direction: 'up' as const, value: '100%' }
      : {
          direction: ((last24HoursSales.total - previous24HoursSales.total) / previous24HoursSales.total) >= 0 ? 'up' as const : 'down' as const,
          value: `${Math.abs(((last24HoursSales.total - previous24HoursSales.total) / previous24HoursSales.total) * 100).toFixed(1)}%`,
        };
    
    return { last24HoursSales, previous24HoursSales, salesTrend };
  }, [orders, now]);

  // Order counts by status
  const orderCounts = useMemo(() => ({
    pending: orders.filter(o => o.status === 'pending').length,
    paid: orders.filter(o => o.status === 'paid').length,
    shipped: orders.filter(o => o.status === 'processing').length, // Map 'processing' to 'shipped' for UI
    delivered: orders.filter(o => o.status === 'delivered').length,
  }), [orders]);

  // Chart data - calculate actual sales from orders
  const categoryChartData = useMemo(() => {
    const categoryData: Record<string, { sold: number; revenue: number }> = {};
    
    // Process all order items to calculate actual sales by category
    orders.forEach(order => {
      order.items.forEach(item => {
        // Find the product to get its category
        const product = products.find(p => p._id === item.productId);
        if (product) {
          const categoryId = product.category;
          // Find the category name from categories array
          const category = categories.find(c => c._id === categoryId || c.slug === categoryId || c.name === categoryId);
          const categoryName = category ? category.name : categoryId;
          
          if (!categoryData[categoryName]) {
            categoryData[categoryName] = { sold: 0, revenue: 0 };
          }
          categoryData[categoryName].sold += item.qty;
          categoryData[categoryName].revenue += item.qty * item.pricePerKg;
        }
      });
    });
    
    return Object.entries(categoryData).map(([name, data]) => ({
      name,
      sold: data.sold,
      revenue: data.revenue / 1000, // Convert to thousands for display
    }));
  }, [orders, products, categories]);

  const handleExportChartData = () => {
    exportToCSV(categoryChartData, 'category_analytics');
  };

  return (
    <div className="space-y-6">
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
          subtitle={`${products.length} total`}
          icon={Package}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <CategoryChart data={categoryChartData} onExport={handleExportChartData} />
        <RevenueChart data={categoryChartData} />
      </div>

      {/* Order Status Overview */}
      <OrderStatusGrid orderCounts={orderCounts} />
    </div>
  );
};