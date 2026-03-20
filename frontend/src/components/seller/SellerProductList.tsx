import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, Plus, Edit, Trash2 } from "lucide-react";
import type { Product } from "@/store/catalogSlice";

interface SellerProductListProps {
  products: Product[];
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (product: Product) => void;
}

const SellerProductList = ({ 
  products, 
  onAddProduct, 
  onEditProduct, 
  onDeleteProduct 
}: SellerProductListProps) => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">{t("seller.myListings")}</h2>
        <Button onClick={onAddProduct} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          {t("seller.addProduct")}
        </Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">
              {t("seller.noProducts")}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t("seller.addFirstProduct")}
            </p>
            <Button onClick={onAddProduct}>
              <Plus className="mr-2 h-4 w-4" />
              {t("seller.addProduct")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            const isExpired = new Date(product.expiresOn) <= new Date();
            const daysUntilExpiry =
              (new Date(product.expiresOn).getTime() - Date.now()) /
              (1000 * 60 * 60 * 24);
            const isExpiringSoon =
              daysUntilExpiry > 0 && daysUntilExpiry <= 3;

            return (
              <Card
                key={product.id}
                className={`overflow-hidden ${isExpired ? "opacity-60" : ""}`}
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold line-clamp-1">{product.name}</h3>
                    {isExpired ? (
                      <Badge variant="destructive">
                        {t("seller.expired")}
                      </Badge>
                    ) : isExpiringSoon ? (
                      <Badge className="bg-orange-100 text-orange-800">
                        {t("seller.expiringSoon")}
                      </Badge>
                    ) : (
                      <Badge className="bg-green-100 text-green-800">
                        {t("seller.active")}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {product.locationDistrict} • {product.stockQty}kg
                  </p>
                  <p className="text-xl font-bold text-primary mb-3">
                    Rs. {product.pricePerKg}/kg
                  </p>
                  <div className="flex flex-col xs:flex-row gap-2 h-20">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => onEditProduct(product)}
                    >
                      <Edit className="mr-1 h-3 w-3" />
                      {t("common.edit")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-destructive hover:text-destructive hover:border-destructive"
                      onClick={() => onDeleteProduct(product)}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      {t("common.delete")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
};

export default SellerProductList;