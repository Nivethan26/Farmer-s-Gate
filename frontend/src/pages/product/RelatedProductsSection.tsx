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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {relatedProducts.map((relatedProduct) => (
          <ProductCard
            key={relatedProduct.id}
            product={relatedProduct}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

