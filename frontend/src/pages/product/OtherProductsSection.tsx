import { ProductCard } from '@/components/catalog/ProductCard';
import type { Product } from '@/store/catalogSlice';

interface OtherProductsSectionProps {
  otherProducts: Product[];
  onAddToCart: (product: Product) => void;
}

export const OtherProductsSection = ({
  otherProducts,
  onAddToCart,
}: OtherProductsSectionProps) => {
  if (otherProducts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 sm:mt-16 lg:mt-20">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold font-poppins bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
          Other Products
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Explore products from other categories
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {otherProducts.map((otherProduct) => (
          <ProductCard
            key={otherProduct.id}
            product={otherProduct}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

