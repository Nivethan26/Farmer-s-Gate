import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import type { RootState } from '@/store';
import { selectFilteredProducts } from '@/store/selectors';
import { setFilters } from '@/store/catalogSlice';
import { addToCart } from '@/store/cartSlice';
import { Navbar } from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Filters } from '@/components/catalog/Filters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Search, SlidersHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '@/store/catalogSlice';

const Catalog = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const filteredProducts = useAppSelector(selectFilteredProducts);
  const filters = useAppSelector((state: RootState) => state.catalog.filters);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const handleAddToCart = (product: Product) => {
    // Redirect to login if user is not logged in
    if (!user) {
      toast.info('Please login to add items to cart');
      navigate('/login', { state: { from: '/catalog' } });
      return;
    }
    
    dispatch(
      addToCart({
        productId: product.id,
        productName: product.name,
        pricePerKg: product.pricePerKg,
        qty: 1,
        image: product.image,
        sellerId: product.sellerId,
        sellerName: product.sellerName,
      })
    );
    toast.success(`${product.name} ${t('catalog.addToCart')}!`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-poppins mb-2">{t('catalog.title')}</h1>
          <p className="text-muted-foreground">
            Browse fresh produce directly from Sri Lankan farmers
          </p>
        </div>

        {/* Search and Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={t('catalog.searchPlaceholder')}
              value={filters.search}
              onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
              className="pl-10"
            />
          </div>
          
          <Select
            value={filters.sortBy}
            onValueChange={(value: any) => dispatch(setFilters({ sortBy: value }))}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="name">Name (A-Z)</SelectItem>
            </SelectContent>
          </Select>

          {/* Mobile Filter Button */}
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="sm:hidden">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <Filters />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-6">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20 border rounded-lg p-4 bg-card">
              <Filters />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-4 text-sm text-muted-foreground">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </div>
            
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground mb-4">No products found</p>
                <Button onClick={() => dispatch(setFilters({ search: '', categories: [], districts: [], supplyTypes: [] }))}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Catalog;
