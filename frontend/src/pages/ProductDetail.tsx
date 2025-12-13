import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import type { RootState } from '@/store';
import { addToCart } from '@/store/cartSlice';
import { createNegotiation } from '@/store/catalogSlice';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  MapPin, 
  Package, 
  Calendar, 
  User, 
  ShoppingCart, 
  MessageSquare, 
  LogIn, 
  Phone, 
  MessageCircle, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles, 
  Plus, 
  Minus, 
  CheckCircle2, 
  CreditCard, 
  Scale,
  Shield,
  Truck,
  Star,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { ProductCard } from '@/components/catalog/ProductCard';
import { Product } from '@/store/catalogSlice';

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
  
  // Negotiation states
  const [negotiationQty, setNegotiationQty] = useState(10); // Minimum 10 kg
  const [negotiationPrice, setNegotiationPrice] = useState('');
  const [negotiationNotes, setNegotiationNotes] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setQty(1); // Reset quantity when product changes
    // Reset negotiation states when product changes
    setNegotiationQty(10);
    setNegotiationPrice('');
    setNegotiationNotes('');
    setDeliveryDate('');
  }, [id]);

  // Calculate delivery dates (tomorrow to next 7 days)
  const deliveryDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return {
      value: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    };
  });

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
              <p className="font-semibold text-sm text-gray-900">{qty}kg of {product.name}</p>
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

  const handleNegotiate = () => {
    if (!user || user.role !== 'buyer') {
      toast.error('Please sign in as a buyer to negotiate');
      navigate('/login');
      return;
    }

    if (!negotiationPrice || Number(negotiationPrice) <= 0) {
      toast.error('Please enter a valid negotiation price');
      return;
    }

    if (negotiationQty < 10) {
      toast.error('Minimum purchase quantity for negotiation is 10kg');
      return;
    }

    if (!deliveryDate) {
      toast.error('Please select a preferred delivery date');
      return;
    }

    const negotiation = {
      id: `neg-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      buyerId: user.id,
      buyerName: user.name,
      sellerId: product.sellerId,
      sellerName: product.sellerName,
      currentPrice: product.pricePerKg,
      requestedPrice: Number(negotiationPrice),
      requestedQty: negotiationQty,
      deliveryDate: deliveryDate,
      notes: negotiationNotes,
      status: 'open' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    dispatch(createNegotiation(negotiation));
    toast.success('Negotiation request sent successfully!');
    setNegotiateOpen(false);
    setNegotiationPrice('');
    setNegotiationNotes('');
    setDeliveryDate('');
  };

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
          {/* Product Image */}
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

          {/* Product Info */}
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
                  {product.supplyType === 'wholesale' ? 'Wholesale' : 'Small Scale'}
                </Badge>
                {product.stockQty > 0 && (
                  <Badge className="bg-green-100 text-green-800 border-green-200 text-sm px-3 py-1">
                    <Sparkles className="h-3 w-3 mr-1" />
                    In Stock
                  </Badge>
                )}
                {showWhatsAppButton && (
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm px-3 py-1 border-0">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Agent Available
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
                      <p className="text-xs text-muted-foreground mb-1">Expires On</p>
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
                      <p className="text-xs text-muted-foreground mb-1">Location</p>
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
                      <p className="text-xs text-muted-foreground mb-1">Available Stock</p>
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
                      <p className="text-xs text-muted-foreground mb-1">Farmer</p>
                      <p className="font-semibold text-gray-900">{product.sellerId}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            {/* Price and Purchase Card */}
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
                  <p className="text-sm text-muted-foreground">Price per kilogram</p>
                </div>

                {/* Quantity Section */}
                <div className="mb-4">
                  <Label htmlFor="qty" className="text-sm font-semibold mb-2 block">
                    Quantity (kg)
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
                      <div className="text-sm text-muted-foreground">Subtotal</div>
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
                      onClick={handleWhatsAppClick}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <MessageCircle className="h-6 w-6" />
                        <div className="text-left">
                          <div className="font-bold text-lg">Chat with Agent</div>
                          <div className="text-xs font-normal opacity-90">Instant WhatsApp Support</div>
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
                          toast.info('Please login to negotiate');
                          navigate('/login', { state: { from: `/product/${product.id}` } });
                          return;
                        }
                        if (user.role !== 'buyer') {
                          toast.error('Only buyers can negotiate prices');
                          return;
                        }
                        setNegotiateOpen(true);
                      }}
                    >
                      <Scale className="mr-2 h-5 w-5" />
                      Negotiate Price
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
                      Checkout
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  )}

                  {/* View Agent Details Button (for mobile/alternative) */}
                  {showWhatsAppButton && (
                    <Button
                      variant="outline"
                      className="w-full h-12 border-2 border-green-200 hover:border-green-300 hover:bg-green-50 text-green-700"
                      onClick={() => setAgentDetailsOpen(true)}
                    >
                      <Shield className="mr-2 h-5 w-5" />
                      View Agent Details
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 sm:mt-16 lg:mt-20">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold font-poppins bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                Related Products
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                More {category?.name || 'products'} you might like
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onAddToCart={handleRelatedProductAddToCart}
                />
              ))}
            </div>
          </div>
        )}

        {/* Other Products Section */}
        {otherProducts.length > 0 && (
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
                  onAddToCart={handleRelatedProductAddToCart}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* NEGOTIATION DIALOG */}
      {product.negotiationEnabled && (
        <Dialog open={negotiateOpen} onOpenChange={setNegotiateOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-lg mx-auto">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
                <Scale className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                Negotiate Price
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                Minimum purchase quantity: <span className="font-semibold text-purple-600">10 kg</span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 sm:space-y-5 overflow-y-auto max-h-[calc(100vh-200px)]">
              {/* Product Information */}
              <Card className="border border-gray-200 sm:border-2 sm:border-gray-100">
                <CardContent className="p-3 sm:p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{product.name}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">{category?.name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Minimum Quantity Section */}
              <div>
                <Label className="text-sm sm:text-base font-semibold mb-2 block">Quantity (kg) *</Label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex items-center gap-1 bg-gray-50 rounded-lg sm:rounded-xl border border-gray-200 sm:border-2 sm:border-gray-200 p-1 w-fit sm:w-auto">
                    <button
                      onClick={() => setNegotiationQty(Math.max(10, negotiationQty - 1))}
                      className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Decrease quantity"
                      disabled={negotiationQty <= 10}
                    >
                      <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                    <Input
                      type="number"
                      min="10"
                      max={product.stockQty}
                      value={negotiationQty}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setNegotiationQty(Math.max(10, Math.min(product.stockQty, value)));
                      }}
                      className="w-20 sm:w-24 text-center bg-transparent border-0 focus:ring-0 font-semibold text-gray-900 text-sm sm:text-base px-2"
                    />
                    <button
                      onClick={() => setNegotiationQty(Math.min(product.stockQty, negotiationQty + 1))}
                      className="p-1.5 sm:p-2 rounded-lg hover:bg-purple-100 transition-colors text-purple-600 hover:text-purple-700"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                  <div className="text-xs sm:text-sm text-muted-foreground">
                    Minimum 10 kg required for negotiation
                  </div>
                </div>
              </div>

              {/* Current Price (Readonly) */}
              <div>
                <Label className="text-sm sm:text-base font-semibold mb-2 block">Current Price (per kg)</Label>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      value={`Rs. ${product.pricePerKg}`}
                      readOnly
                      className="bg-gray-50 border-gray-200 text-gray-700 text-sm sm:text-base pr-24"
                    />
                    <Badge 
                      variant="outline" 
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 whitespace-nowrap text-xs sm:text-sm"
                    >
                      Original Price
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Negotiation Price (Editable) */}
              <div>
                <Label className="text-sm sm:text-base font-semibold mb-2 block">
                  Your Offer Price (per kg) *
                </Label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm sm:text-base">
                    Rs.
                  </div>
                  <Input
                    type="number"
                    value={negotiationPrice}
                    onChange={(e) => setNegotiationPrice(e.target.value)}
                    className="pl-10 sm:pl-12 text-sm sm:text-base"
                    placeholder="Enter your offer price"
                    min="0"
                    step="0.01"
                  />
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  Total for {negotiationQty} kg: 
                  <span className="font-semibold text-gray-900 ml-2">
                    Rs. {(Number(negotiationPrice || 0) * negotiationQty).toFixed(2)}
                  </span>
                </p>
              </div>

              {/* Delivery Date */}
              <div>
                <Label className="text-sm sm:text-base font-semibold mb-2 block">Preferred Delivery Date *</Label>
                <Select value={deliveryDate} onValueChange={setDeliveryDate}>
                  <SelectTrigger className="w-full text-sm sm:text-base">
                    <SelectValue placeholder="Select delivery date" />
                  </SelectTrigger>
                  <SelectContent className="text-sm sm:text-base max-h-[200px]">
                    {deliveryDates.map((date) => (
                      <SelectItem key={date.value} value={date.value} className="text-sm sm:text-base">
                        {date.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Product Description/Notes */}
              <div>
                <Label className="text-sm sm:text-base font-semibold mb-2 block">Additional Notes</Label>
                <Textarea
                  value={negotiationNotes}
                  onChange={(e) => setNegotiationNotes(e.target.value)}
                  className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
                  placeholder="Add any special requirements, quality specifications, or additional notes..."
                />
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  This will be sent to the seller along with your offer.
                </p>
              </div>

              {/* Seller Information (Readonly) */}
              <div>
                <Label className="text-sm sm:text-base font-semibold mb-2 block">Seller Information</Label>
                <Input
                  type="text"
                  value={product.sellerId}
                  readOnly
                  className="bg-gray-50 border-gray-200 text-gray-700 text-sm sm:text-base"
                />
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  Your negotiation request will be sent to this seller.
                </p>
              </div>
            </div>

            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setNegotiateOpen(false)} 
                className="w-full sm:w-auto border sm:border-2 text-sm sm:text-base"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleNegotiate}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm sm:text-base"
                disabled={!negotiationPrice || !deliveryDate}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Submit Negotiation Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Agent Dialog - Only show for wholesale with agents */}
      {showWhatsAppButton && (
        <Dialog open={agentDetailsOpen} onOpenChange={setAgentDetailsOpen}>
          <DialogContent className="max-w-md sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                Connect with Regional Agent
              </DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                Get personalized assistance for your wholesale purchase.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50/50">
                <CardContent className="p-5 sm:p-6 space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center shadow-lg">
                        <User className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg sm:text-xl text-gray-900">{sellerAgent?.name}</h4>
                      <p className="text-sm sm:text-base text-muted-foreground">Regional Agent</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          {product.locationDistrict}
                        </Badge>
                        <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                          Wholesale Specialist
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-100">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                        <Phone className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Contact Number</p>
                        <p className="font-bold text-lg text-gray-900">{sellerAgent?.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-100">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Coverage Area</p>
                        <p className="font-medium text-gray-900">{sellerAgent?.regions.join(', ')}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Button 
                  className="w-full h-12 bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#1da851] hover:to-[#0d6e5f] text-white text-lg font-bold shadow-lg shadow-green-500/30"
                  onClick={handleWhatsAppClick}
                >
                  <MessageCircle className="mr-3 h-6 w-6" />
                  Chat on WhatsApp Now
                  <Zap className="ml-2 h-5 w-5 animate-pulse" />
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full h-12 border-2 border-green-200 hover:bg-green-50 hover:border-green-300"
                  onClick={() => {
                    // Copy phone number to clipboard
                    if (sellerAgent?.phone) {
                      navigator.clipboard.writeText(sellerAgent.phone);
                      toast.success('Phone number copied to clipboard!');
                    }
                  }}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Copy Phone Number
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setAgentDetailsOpen(false)} 
                className="border-2"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProductDetail;