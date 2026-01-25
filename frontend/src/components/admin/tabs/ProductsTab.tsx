import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package } from 'lucide-react';
import { FilterBar } from '../ui/FilterBar';
import { formatCurrency } from '@/utils/adminUtils';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product, Category } from '@/types/admin';

interface ProductsTabProps {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
}

export const ProductsTab = ({ products, categories, isLoading }: ProductsTabProps) => {
  const [categoryFilter, setCategoryFilter] = useState('all');

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