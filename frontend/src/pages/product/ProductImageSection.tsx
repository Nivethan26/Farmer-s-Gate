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
        <div className="h-[250px] sm:h-[450px] lg:h-[500px]">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        {/* Badges container: All badges in a single line at the top */}
        <div className="absolute top-3 left-3 right-3 z-10 pointer-events-none">
          <div className="flex flex-row flex-wrap items-center gap-2 pointer-events-auto">
            {product.negotiationEnabled && (
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/40 text-[10px] sm:text-xs font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 border-0 rounded-full">
                <Scale className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                Negotiation
              </Badge>
            )}
            {product.supplyType === 'wholesale' && (
              <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/40 text-[10px] sm:text-xs font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 border-0 rounded-full">
                <Truck className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                Wholesale
              </Badge>
            )}
            {isExpiringSoon && (
              <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/40 text-[10px] sm:text-xs font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 border-0 rounded-full">
                Expiring Soon
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

