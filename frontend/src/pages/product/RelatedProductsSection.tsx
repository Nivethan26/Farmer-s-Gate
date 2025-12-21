import { ProductCard } from '@/components/catalog/ProductCard';
import type { Product } from '@/store/catalogSlice';
import type { Category } from '@/store/catalogSlice';

interface RelatedProductsSectionProps {
  relatedProducts: Product[];
  category: Category | undefined;
  onAddToCart: (product: Product) => void;
}

export const RelatedProductsSection = ({
  relatedProducts,
  category,
  onAddToCart,
}: RelatedProductsSectionProps) => {
  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 sm:mt-16 lg:mt-20">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold font-poppins bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          Related Products
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          More {category?.name || 'products'} you might like
        </p>
      </div>
      <div>
        {/* Horizontal scroll on small screens, grid on sm+ */}
        <div className="flex gap-4 overflow-x-auto hide-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0 block sm:hidden">
          <div className="flex items-stretch gap-4">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="min-w-[220px] flex-shrink-0 sm:min-w-0 sm:w-full">
                <ProductCard
                  product={relatedProduct}
                  onAddToCart={onAddToCart}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Grid fallback for larger screens */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-5 mt-4">
          {relatedProducts.map((relatedProduct) => (
            <ProductCard
              key={relatedProduct.id}
              product={relatedProduct}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

