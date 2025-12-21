import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import type { RootState } from '@/store';
import { addToCart } from '@/store/cartSlice';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Product } from '@/store/catalogSlice';
import { ProductImageSection } from './product/ProductImageSection';
import { ProductInfoSection } from './product/ProductInfoSection';
import { PriceAndPurchaseSection } from './product/PriceAndPurchaseSection';
import { RelatedProductsSection } from './product/RelatedProductsSection';
import { OtherProductsSection } from './product/OtherProductsSection';
import { NegotiationDialogSection } from './product/NegotiationDialogSection';
import { AgentDialogSection } from './product/AgentDialogSection';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const product = useAppSelector((state: RootState) =>
    state.catalog.products.find((p) => p.id === id)
  );
  const category = useAppSelector((state: RootState) =>
    state.catalog.categories.find((c) => c.id === product?.category)
  );
  const agents = useAppSelector((state: RootState) => state.users.agents);
  const allProducts = useAppSelector((state: RootState) => state.catalog.products);

  // Get related products (same category, exclude current product)
  const relatedProducts = product
    ? allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
    : [];

  // Get other products (different categories, exclude current product)
  const otherProducts = product
    ? allProducts.filter((p) => p.category !== product.category && p.id !== product.id).slice(0, 4)
    : [];

  // Find agent for seller's district
  const sellerAgent = product ? agents.find((agent) =>
    agent.regions.includes(product.locationDistrict) && agent.status === 'active'
  ) : null;

  const [qty, setQty] = useState(1);
  const [negotiateOpen, setNegotiateOpen] = useState(false);
  const [agentDetailsOpen, setAgentDetailsOpen] = useState(false);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setQty(1); // Reset quantity when product changes
  }, [id]);

  const handleWhatsAppClick = () => {
    if (!sellerAgent || !product) return;

    const productUrl = window.location.href;
    const message = encodeURIComponent(
      `Hello ${sellerAgent.name}!\n\nI'm interested in purchasing "${product.name}" (${category?.name}).\n\n` +
      `Product Details:\n` +
      `• Price: Rs. ${product.pricePerKg}/kg\n` +
      `• Quantity: ${qty} kg\n` +
      `• Location: ${product.locationDistrict}\n` +
      `• Expires: ${new Date(product.expiresOn).toLocaleDateString()}\n\n` +
      `Please let me know about availability and next steps.\n\n` +
      `Product Link: ${productUrl}`
    );

    const whatsappUrl = `https://wa.me/${sellerAgent.phone.replace(/[^0-9]/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');

    // Track click
    toast.success('Opening WhatsApp to contact agent!', {
      icon: <MessageCircle className="h-5 w-5" />,
    });
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate('/catalog')}>Back to Catalog</Button>
        </div>
      </div>
    );
  }


  const handleRelatedProductAddToCart = (relatedProduct: Product) => {
    if (!user) {
      toast.info('Please login to add items to cart');
      navigate('/login', { state: { from: `/product/${product?.id}` } });
      return;
    }

    dispatch(
      addToCart({
        productId: relatedProduct.id,
        productName: relatedProduct.name,
        pricePerKg: relatedProduct.pricePerKg,
        qty: 1,
        image: relatedProduct.image,
        sellerId: relatedProduct.sellerId,
        sellerName: relatedProduct.sellerName,
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
              <p className="font-semibold text-sm text-gray-900">{relatedProduct.name}</p>
              <p className="text-xs text-green-600 font-medium">{t('catalog.addToCart')}!</p>
            </div>
          </div>
        </div>
      ),
      {
        duration: 2500,
      }
    );
  };

  const expiresDate = new Date(product.expiresOn);
  const isExpiringSoon = (expiresDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24) < 3;

  // Check if WhatsApp button should be shown
  const showWhatsAppButton = sellerAgent && product.supplyType === 'wholesale';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/catalog')}
          className="mb-4 sm:mb-6 hover:bg-green-50 hover:text-green-700"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Catalog
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          <ProductImageSection
            product={product}
            isExpiringSoon={isExpiringSoon}
          />

          <div className="lg:col-span-7 space-y-4">
            <ProductInfoSection
              product={product}
              category={category}
              showWhatsAppButton={showWhatsAppButton}
              expiresDate={expiresDate}
            />

            <PriceAndPurchaseSection
              product={product}
              user={user}
              qty={qty}
              setQty={setQty}
              showWhatsAppButton={showWhatsAppButton}
              sellerAgent={sellerAgent}
              category={category}
              onWhatsAppClick={handleWhatsAppClick}
              onAgentDetailsOpen={() => setAgentDetailsOpen(true)}
              onNegotiateOpen={() => setNegotiateOpen(true)}
            />
          </div>
        </div>

        <RelatedProductsSection
          relatedProducts={relatedProducts}
          category={category}
          onAddToCart={handleRelatedProductAddToCart}
        />

        <OtherProductsSection
          otherProducts={otherProducts}
          onAddToCart={handleRelatedProductAddToCart}
        />
      </div>

      <NegotiationDialogSection
        product={product}
        category={category}
        user={user}
        open={negotiateOpen}
        onOpenChange={setNegotiateOpen}
        sellerAgent={sellerAgent}
        onWhatsAppClick={handleWhatsAppClick}
        onAgentDetailsOpen={() => setAgentDetailsOpen(true)}
      />

      <AgentDialogSection
        product={product}
        sellerAgent={sellerAgent}
        open={agentDetailsOpen}
        onOpenChange={setAgentDetailsOpen}
        onWhatsAppClick={handleWhatsAppClick}
      />
    </div>
  );
};

export default ProductDetail;