import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { addToCart } from '@/store/cartSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, ShoppingCart, Scale, CreditCard, ArrowRight, Shield, MessageCircle, Zap, Plus, Minus, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import type { Product } from '@/store/catalogSlice';
import type { User } from '@/store/authSlice';

interface PriceAndPurchaseSectionProps {
  product: Product;
  user: User | null;
  qty: number;
  setQty: (qty: number) => void;
  showWhatsAppButton: boolean;
  sellerAgent: any;
  category: any;
  onWhatsAppClick: () => void;
  onAgentDetailsOpen: () => void;
  onNegotiateOpen: () => void;
}

export const PriceAndPurchaseSection = ({
  product,
  user,
  qty,
  setQty,
  showWhatsAppButton,
  sellerAgent,
  category,
  onWhatsAppClick,
  onAgentDetailsOpen,
  onNegotiateOpen,
}: PriceAndPurchaseSectionProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleAddToCart = () => {
    if (!user) {
      toast.info('Please login to add items to cart');
      navigate('/login', { state: { from: `/product/${product.id}` } });
      return;
    }

    dispatch(
      addToCart({
        productId: product.id,
        productName: product.name,
        pricePerKg: product.pricePerKg,
        qty,
        image: product.image,
        sellerId: product.sellerId,
        sellerName: product.sellerName,
      })
    );

    // Custom toast with loading animation
    toast.custom(
      () => (
        <div className="bg-white rounded-lg shadow-xl border-2 border-green-200 p-3 min-w-[300px] relative overflow-hidden animate-[slideInRight_0.3s_ease-out]">
          {/* Loading line animation */}
          <div className="absolute top-0 left-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 animate-[loading_2s_ease-in-out_forwards]"></div>

          {/* Content */}
          <div className="flex items-center gap-2.5">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
              <CheckCircle2 className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-gray-900">{t('product.qtyOfProduct', { qty, product: product.name })}</p>
              <p className="text-xs text-green-600 font-medium">{t('product.addedToCart')}</p>
            </div>
          </div>
        </div>
      ),
      {
        duration: 2500,
      }
    );
  };

  return (
    <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50/50">
      <CardContent className="p-4 sm:p-5">
        {/* Price Section */}
        <div className="mb-4 pb-4 border-b border-gray-200">
          <div className="flex items-baseline gap-2 mb-2">
            <p className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Rs. {product.pricePerKg}
            </p>
            <span className="text-lg text-muted-foreground">/kg</span>
          </div>
          <p className="text-sm text-muted-foreground">{t('product.pricePerKgLabel')}</p>
        </div>

        {/* Quantity Section */}
        <div className="mb-4">
          <Label htmlFor="qty" className="text-sm font-semibold mb-2 block">
            {t('cart.quantity')} (kg)
          </Label>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-gray-50 rounded-xl border-2 border-gray-200 p-1">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-900"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <Input
                id="qty"
                type="number"
                min="1"
                max={product.stockQty}
                value={qty}
                onChange={(e) => setQty(Math.max(1, Math.min(product.stockQty, Number(e.target.value))))}
                className="w-20 text-center bg-transparent border-0 focus:ring-0 font-semibold text-gray-900"
              />
              <button
                onClick={() => setQty(Math.min(product.stockQty, qty + 1))}
                className="p-2 rounded-lg hover:bg-green-100 transition-colors text-green-600 hover:text-green-700"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1">
              <div className="text-sm text-muted-foreground">{t('cart.subtotal')}</div>
              <div className="text-xl font-bold text-gray-900">Rs. {(product.pricePerKg * qty).toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {/* WhatsApp Button - Show at top for wholesale products */}
          {showWhatsAppButton && (
            <Button
              className="w-full h-12 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#1da851] hover:to-[#0d6e5f] text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 text-base font-semibold animate-pulse-slow border-2 border-white/20"
              onClick={onWhatsAppClick}
            >
              <div className="flex items-center justify-center gap-2">
                <MessageCircle className="h-6 w-6" />
                <div className="text-left">
                  <div className="font-bold text-lg">{t('product.chatWithAgent')}</div>
                  <div className="text-xs font-normal opacity-90">{t('product.instantSupport')}</div>
                </div>
                <Zap className="h-5 w-5 ml-auto animate-bounce" />
              </div>
            </Button>
          )}

          <Button
            className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 text-base font-semibold"
            variant={!user ? "outline" : "default"}
            onClick={handleAddToCart}
          >
            {!user ? (
              <>
                <LogIn className="mr-2 h-5 w-5" />
                {t('catalog.loginToBuy')}
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-5 w-5" />
                {t('catalog.addToCart')}
              </>
            )}
          </Button>

          {/* Negotiation Button - Only show if seller enabled negotiation */}
          {product.negotiationEnabled && (
            <Button
              variant="outline"
              className="w-full h-12 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-purple-700 hover:text-purple-800 hover:border-purple-300 text-base font-semibold"
              onClick={() => {
                if (!user) {
                  toast.info(t('product.loginToNegotiate'));
                  navigate('/login', { state: { from: `/product/${product.id}` } });
                  return;
                }
                if (user.role !== 'buyer') {
                  toast.error(t('product.onlyBuyersNegotiate'));
                  return;
                }
                onNegotiateOpen();
              }}
            >
              <Scale className="mr-2 h-5 w-5" />
              {t('product.negotiatePrice')}
            </Button>
          )}

          {/* Checkout Button */}
          {user && (
            <Button
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 text-base font-semibold"
              onClick={() => {
                // Add to cart first, then navigate to checkout
                dispatch(
                  addToCart({
                    productId: product.id,
                    productName: product.name,
                    pricePerKg: product.pricePerKg,
                    qty,
                    image: product.image,
                    sellerId: product.sellerId,
                    sellerName: product.sellerName,
                  })
                );
                navigate('/buyer/cart');
              }}
            >
              <CreditCard className="mr-2 h-5 w-5" />
              {t('product.checkout')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}

          {/* View Agent Details Button (for mobile/alternative) */}
          {showWhatsAppButton && (
            <Button
              variant="outline"
              className="w-full h-12 border-2 border-green-200 hover:border-green-300 hover:bg-green-50 text-green-700"
              onClick={onAgentDetailsOpen}
            >
              <Shield className="mr-2 h-5 w-5" />
              {t('product.viewAgentDetails')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

