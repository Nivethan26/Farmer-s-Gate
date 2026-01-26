import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Package, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { FilterBar } from '../ui/FilterBar';
import { formatCurrency } from '@/utils/adminUtils';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product, Category } from '@/types/admin';

interface ProductsTabProps {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  onRefresh?: () => Promise<void>;
}

export const ProductsTab = ({ products, categories, isLoading, onRefresh }: ProductsTabProps) => {
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    setIsRefreshing(true);
    try {
      await onRefresh();
      toast.success('Products refreshed successfully');
    } catch (error) {
      toast.error('Failed to refresh products');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      categoryFilter === 'all' || product.category === categoryFilter
    );
  }, [products, categoryFilter]);

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map(cat => ({ value: cat.name, label: cat.name }))
  ];

  return (
    <div className="space-y-6">
      {/* Header with Refresh Button */}
      <Card className="dashboard-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Products Management</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </CardHeader>
      </Card>

      <FilterBar
        filterValue={categoryFilter}
        onFilterChange={setCategoryFilter}
        filterOptions={categoryOptions}
        filterPlaceholder="All Categories"
      />

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
            <Card key={product._id} className="dashboard-card transition-all">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="secondary">{product.category}</Badge>
                </div>

                <h3 className="font-semibold mb-1">{product.name}</h3>
                <p className="text-lg font-bold text-primary mb-2">
                  {formatCurrency(product.pricePerKg)} /kg
                </p>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span>Stock: {product.stockQty} kg</span>
                  <span>Seller: {product.sellerName}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={product.supplyType === 'wholesale' ? 'default' : 'secondary'}>
                    {product.supplyType}
                  </Badge>
                  {product.negotiationEnabled && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-200">
                      Negotiable
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};