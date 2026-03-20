import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Package, User, Sparkles, MessageCircle } from 'lucide-react';
import type { Product } from '@/store/catalogSlice';
import type { Category } from '@/store/catalogSlice';
import { useTranslation } from 'react-i18next';

interface ProductInfoSectionProps {
  product: Product;
  category: Category | undefined;
  showWhatsAppButton: boolean;
  expiresDate: Date;
}

export const ProductInfoSection = ({
  product,
  category,
  showWhatsAppButton,
  expiresDate,
}: ProductInfoSectionProps) => {
  const { t } = useTranslation();
  return (
    <div className="lg:col-span-7 space-y-4">
      {/* Header Section */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="outline" className="text-sm px-3 py-1">
            {category?.icon} {category?.name}
          </Badge>
          <Badge
            className={`${
              product.supplyType === 'wholesale'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
            } text-sm px-3 py-1 border-0`}
          >
            {product.supplyType === 'wholesale' ? t('product.wholesale', 'Wholesale') : t('product.smallScale', 'Small Scale')}
          </Badge>
          {product.stockQty > 0 && (
            <Badge className="bg-green-100 text-green-800 border-green-200 text-sm px-3 py-1">
              <Sparkles className="h-3 w-3 mr-1" />
              {t('product.inStock', 'In Stock')}
            </Badge>
          )}
          {showWhatsAppButton && (
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm px-3 py-1 border-0">
              <MessageCircle className="h-3 w-3 mr-1" />
              {t('product.agentAvailable', 'Agent Available')}
            </Badge>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold font-poppins mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          {product.name}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground line-clamp-3">
          {product.description}
        </p>
      </div>

      {/* Product Details Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-orange-100 text-orange-600">
                <Calendar className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t('product.expiresOn', 'Expires On')}</p>
                <p className="font-semibold text-gray-900">{expiresDate.toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-100 text-blue-600">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t('product.location', 'Location')}</p>
                <p className="font-semibold text-gray-900">{product.locationDistrict}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-100 text-purple-600">
                <Package className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t('product.availableStock', 'Available Stock')}</p>
                <p className="font-semibold text-gray-900">{product.stockQty} kg</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white/80 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-100 text-green-600">
                <User className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">{t('product.sellerId', 'ID')}</p>
                <p className="font-semibold text-gray-900">{product.sellerId}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

