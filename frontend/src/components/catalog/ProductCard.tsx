import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Package, ShoppingCart, LogIn, MessageSquare, Sparkles } from "lucide-react";
import { Product } from "@/store/catalogSlice";
import { getProductNameTranslationKey } from "@/utils/translations";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const { t } = useTranslation();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const productNameKey = getProductNameTranslationKey(product.name);
  const displayName = productNameKey ? t(productNameKey) : product.name;

  // Check if product is expiring soon
  const expiresDate = new Date(product.expiresOn);
  const isExpiringSoon = (expiresDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24) < 3;
  
  return (
    <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm hover:-translate-y-1 flex flex-col h-full">
      {/* Product Image - Smaller and more compact */}
      <Link to={`/product/${product.id}`} className="block relative">
        <div className="relative h-48 sm:h-52 lg:h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Expiring Soon Badge - Only on image */}
          {isExpiringSoon && (
            <div className="absolute top-3 right-3 z-10">
              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-2.5 py-1 border-0 shadow-lg shadow-red-500/50">
                Expiring Soon
              </Badge>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4 flex-grow flex flex-col">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 line-clamp-2 hover:text-green-600 transition-colors">
            {displayName}
          </h3>
        </Link>

        {/* Supply Type Badge - Moved to details section */}
        <div className="mb-3">
          <Badge 
            className={`${
              product.supplyType === 'wholesale' 
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md shadow-green-500/30' 
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/30'
            } text-xs font-bold px-3 py-1 border-0`}
          >
            {product.supplyType === 'wholesale' ? t('seller.wholesale') : t('seller.smallScale')}
          </Badge>
        </div>

        {/* Location and Stock Info */}
        <div className="space-y-2 mb-3 flex-1">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-green-100 text-green-600 flex-shrink-0">
              <MapPin className="h-3 w-3" />
            </div>
            <span className="font-medium truncate">{product.locationDistrict}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex-shrink-0">
              <Package className="h-3 w-3" />
            </div>
            <span className="font-medium">{product.stockQty} kg available</span>
          </div>
        </div>

        {/* Price Section */}
        <div className="mt-auto pt-3 border-t border-gray-200">
          <div className="flex items-baseline justify-between gap-2">
            <div>
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Rs. {product.pricePerKg}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">per kilogram</p>
            </div>
            {product.stockQty > 0 && (
              <div className="flex items-center gap-1 text-green-600">
                <Sparkles className="h-4 w-4" />
                <span className="text-xs font-semibold">In Stock</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>

      {/* Card Footer - Add to Cart Button */}
      <CardFooter className="p-4 sm:p-5 pt-0">
        <Button
          className={`w-full min-h-[44px] sm:min-h-[48px] rounded-xl font-semibold transition-all duration-300 text-sm sm:text-base ${
            !user 
              ? 'border-2 border-green-300 hover:bg-green-50 hover:border-green-400 text-green-700 hover:text-green-800' 
              : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:scale-[1.02] active:scale-[0.98]'
          }`}
          variant={!user ? "outline" : "default"}
          onClick={() => onAddToCart?.(product)}
        >
        {!user ? (
            <>
              <LogIn className="mr-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">{t('catalog.loginToBuy')}</span>
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
              <span className="truncate">{t('catalog.addToCart')}</span>
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};