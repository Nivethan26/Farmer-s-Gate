import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Package, ShoppingCart, LogIn, MessageSquare } from "lucide-react";
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

  return (
    <Card className="group overflow-hidden border border-gray-200 bg-white transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-green-200 h-full flex flex-col">
      <Link to={`/product/${product.id}`} className="block flex-shrink-0">
        <div className="aspect-square overflow-hidden relative">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>
      <CardContent className="p-4 flex-grow flex flex-col">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="font-bold text-base mb-2 group-hover:text-green-600 transition-colors duration-300 line-clamp-2">
            {displayName}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mb-2">
          <Badge
            className={`${
              product.supplyType === "wholesale"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-amber-500 hover:bg-amber-600"
            } text-white text-xs font-semibold whitespace-nowrap`}
          >
            {product.supplyType === "wholesale"
              ? t("seller.wholesale")
              : t("seller.smallScale")}
          </Badge>
        </div>
        <div className="space-y-1.5 text-xs text-gray-600 mb-3">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
            <span className="font-medium truncate">{product.locationDistrict}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Package className="h-3.5 w-3.5 text-green-600 flex-shrink-0" />
            <span className="font-medium">{product.stockQty} kg available</span>
          </div>
        </div>
        <div className="mt-auto pt-3 border-t border-gray-100">
          <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Rs. {product.pricePerKg}
            <span className="text-sm font-normal text-gray-500">/kg</span>
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        <div className="w-full flex flex-col xs:flex-row gap-2">
          {/* Add to Cart Button - Full width on mobile, flex on larger screens */}
          <Button
            className={`h-11 rounded-xl font-semibold transition-all duration-300 flex-1 w-full xs:w-auto ${
              !user
                ? "border-2 hover:bg-green-50 hover:border-green-400"
                : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl hover:scale-105"
            }`}
            variant={!user ? "outline" : "default"}
            onClick={() => onAddToCart?.(product)}
          >
            <ShoppingCart className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{t("catalog.addToCart")}</span>
          </Button>

          {/* NEGOTIATE BUTTON — only for wholesale products */}
          {product.supplyType === "wholesale" && (
            <Button
              variant="outline"
              className="h-11 rounded-xl border-green-600 text-green-700 hover:bg-green-50 hover:border-green-700 flex-1 w-full xs:w-auto"
              asChild
            >
              <Link to={`/product/${product.id}?negotiate=true`}>
                <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{t("catalog.negotiate")}</span>
              </Link>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};