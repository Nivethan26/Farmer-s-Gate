import { useMemo } from 'react';
import { StatsCard } from '../ui/StatsCard';
import { CategoryChart } from '../charts/CategoryChart';
import { RevenueChart } from '../charts/RevenueChart';
import { OrderStatusGrid } from '../charts/OrderStatusGrid';
import { DollarSign, ShoppingCart, Users, Package } from 'lucide-react';
import { formatCurrency, exportToCSV } from '@/utils/adminUtils';
import type { Order, Seller, Product } from '@/types/admin';

interface OverviewTabProps {
  orders: Order[];
  sellers: Seller[];
  products: Product[];
  isLoading: boolean;
}

export const OverviewTab = ({ orders, sellers, products, isLoading }: OverviewTabProps) => {
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

  // Chart data for products
  const categoryChartData = useMemo(() => {
    const categoryTotals = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + (product.stockQty || 0);
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categoryTotals).map(([name, sold]) => ({
      name,
      sold,
      revenue: products
        .filter(p => p.category === name)
        .reduce((sum, p) => sum + (p.stockQty * p.pricePerKg), 0) / 1000,
    }));
  }, [products]);

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