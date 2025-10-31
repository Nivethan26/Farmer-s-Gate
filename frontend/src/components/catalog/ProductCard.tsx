import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Package, ShoppingCart, LogIn } from 'lucide-react';
import { Product } from '@/store/catalogSlice';
import { getProductNameTranslationKey } from '@/utils/translations';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const { t } = useTranslation();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const productNameKey = getProductNameTranslationKey(product.name);
  const displayName = productNameKey ? t(productNameKey) : product.name;
  
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link to={`/product/${product.id}`}>
        <div className="aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
            {displayName}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant={product.supplyType === 'wholesale' ? 'default' : 'secondary'}>
            {product.supplyType === 'wholesale' ? t('seller.wholesale') : t('seller.smallScale')}
          </Badge>
        </div>
        <div className="space-y-1 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            <span>{product.locationDistrict}</span>
          </div>
          <div className="flex items-center gap-1">
            <Package className="h-3 w-3" />
            <span>{product.stockQty} kg available</span>
          </div>
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold text-primary">
            Rs. {product.pricePerKg}
            <span className="text-sm font-normal text-muted-foreground">/kg</span>
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          variant={!user ? "outline" : "default"}
          onClick={() => onAddToCart?.(product)}
        >
          {!user ? (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Login to Buy
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              {t('catalog.addToCart')}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
