import { Badge } from '@/components/ui/badge';
import { Scale, Truck } from 'lucide-react';
import type { Product } from '@/store/catalogSlice';

interface ProductImageSectionProps {
  product: Product;
  isExpiringSoon: boolean;
}

export const ProductImageSection = ({ product, isExpiringSoon }: ProductImageSectionProps) => {
  return (
    <div className="lg:col-span-5">
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 border-2 border-gray-200 shadow-xl group">
        <div className="h-[400px] sm:h-[450px] lg:h-[500px]">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        {/* Expiring Soon Badge */}
        {isExpiringSoon && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 border-0 shadow-lg shadow-red-500/50">
              Expiring Soon
            </Badge>
          </div>
        )}
        {/* Allow Negotiation Badge */}
        {product.negotiationEnabled && (
          <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1.5 border-0 shadow-lg shadow-purple-500/50">
              <Scale className="h-3 w-3 mr-1" />
              Negotiation Enabled
            </Badge>
          </div>
        )}
        {/* Wholesale Badge */}
        {product.supplyType === 'wholesale' && (
          <div className="absolute bottom-4 left-4 z-10">
            <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold px-3 py-1.5 border-0 shadow-lg shadow-blue-500/50">
              <Truck className="h-3 w-3 mr-1" />
              Wholesale
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};

