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
import { Search, SlidersHorizontal, Package, X } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50/30 to-white">
      <Navbar />

      <div className="w-full px-6 md:px-12 py-10">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2.5 rounded-full mb-4 font-semibold text-sm shadow-lg">
            <Package className="h-4 w-4" />
            Fresh from Farm
          </div>
          <h1 className="text-3xl md:text-5xl font-bold font-poppins mb-3 bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">{t('catalog.title')}</h1>
          <p className="text-base md:text-xl text-gray-600 font-medium">
            Browse fresh produce directly from Sri Lankan farmers
          </p>
        </div>

        {/* Search and Sort Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={t('catalog.searchPlaceholder')}
              value={filters.search}
              onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
              className="pl-11 h-12 rounded-xl border-gray-200 focus:border-green-400 focus:ring-green-400 shadow-sm"
            />
          </div>

          <Select
            value={filters.sortBy}
            onValueChange={(value: any) => dispatch(setFilters({ sortBy: value }))}
          >
            <SelectTrigger className="w-full sm:w-48 h-12 rounded-xl border-gray-200 shadow-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
            </SelectContent>
          </Select>

          {/* Mobile Filter Button */}
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="sm:hidden h-12 rounded-xl">
                <SlidersHorizontal className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-full sm:w-80 h-full flex flex-col p-0"
            >
              <div className="flex-1 overflow-hidden px-6 pt-4">
                <Filters isMobile={true} onClose={() => setMobileFiltersOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto border border-gray-200 rounded-2xl p-5 bg-white/80 backdrop-blur-sm shadow-lg">
              <Filters />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="mb-6 text-sm font-medium text-gray-600">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg font-medium text-gray-600 mb-6">No products found</p>
                <Button onClick={() => dispatch(setFilters({ search: '', categories: [], districts: [], supplyTypes: [] }))} className="rounded-xl">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-5">
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