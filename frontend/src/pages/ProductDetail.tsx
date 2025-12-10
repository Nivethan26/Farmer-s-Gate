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
import { MapPin, Package, Calendar, User, ShoppingCart, MessageSquare, LogIn, Phone, MessageCircle, ArrowLeft, ArrowRight, Sparkles, Plus, Minus, CheckCircle2, CreditCard } from 'lucide-react';
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

  // Find agent for seller's district
  const sellerAgent = product ? agents.find((agent) =>
    agent.regions.includes(product.locationDistrict) && agent.status === 'active'
  ) : null;

  const [qty, setQty] = useState(1);
  const [negotiateOpen, setNegotiateOpen] = useState(false);
  const [agentDetailsOpen, setAgentDetailsOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState('');
  const [negotiateNotes, setNegotiateNotes] = useState('');

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setQty(1); // Reset quantity when product changes
  }, [id]);

  const handleWhatsAppClick = () => {
    if (!sellerAgent || !product) return;
    const productUrl = window.location.href;
    const message = encodeURIComponent(`Hello ${sellerAgent.name}, I'm interested in negotiating the price for ${product.name}. Product link: ${productUrl}`);
    const whatsappUrl = `https://wa.me/${sellerAgent.phone.replace(/[^0-9]/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
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

    if (!targetPrice || Number(targetPrice) <= 0) {
      toast.error('Please enter a valid target price');
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
      requestedPrice: Number(targetPrice),
      notes: negotiateNotes,
      status: 'open' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    console.log(negotiation);
    dispatch(createNegotiation(negotiation));
    toast.success('Negotiation request sent!');
    setNegotiateOpen(false);
    setTargetPrice('');
    setNegotiateNotes('');
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
          {/* Product Image - Compact height to match description */}
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
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-7 space-y-4">
            {/* Header Section - More compact */}
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
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold font-poppins mb-2 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                {product.name}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground line-clamp-3">
                {product.description}
              </p>
            </div>

            {/* Product Details Cards - More compact */}
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
                      <p className="font-semibold text-gray-900">{user?.role === 'buyer' ? product.sellerId : product.sellerName}</p>
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
      </div>

      {/* NEGOTIATION UI ONLY FOR WHOLESALE */}
      {product.supplyType === 'wholesale' && (
        <>
          {/* Agent Dialog */}
          <Dialog open={agentDetailsOpen} onOpenChange={setAgentDetailsOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Contact Agent for Negotiation</DialogTitle>
                <DialogDescription>
                  {sellerAgent
                    ? `Contact the regional agent for ${product.locationDistrict}.`
                    : `No agent found for this district. You can submit a negotiation request.`}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {sellerAgent ? (
                  <>
                    <Card className="border-2 border-green-200 bg-green-50/50">
                      <CardContent className="p-5 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-100 text-green-600">
                            <User className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{sellerAgent.name}</p>
                            <p className="text-sm text-muted-foreground">Regional Agent</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-600">
                            <Phone className="h-5 w-5" />
                          </div>
                          <span className="font-medium text-gray-900">{sellerAgent.phone}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100 text-purple-600">
                            <MapPin className="h-5 w-5" />
                          </div>
                          <span className="text-sm text-gray-700">Regions: {sellerAgent.regions.join(', ')}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white" 
                        onClick={handleWhatsAppClick}
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Open WhatsApp Chat
                      </Button>
                      <Button
                        variant="outline"
                        className="border-2"
                        onClick={() => {
                          setAgentDetailsOpen(false);
                          setNegotiateOpen(true);
                        }}
                      >
                        Submit Request
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-200">
                      <p className="text-sm text-yellow-800">
                        No regional agent available. You can submit negotiation directly.
                      </p>
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                      onClick={() => {
                        setAgentDetailsOpen(false);
                        setNegotiateOpen(true);
                      }}
                    >
                      Submit Negotiation Request
                    </Button>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setAgentDetailsOpen(false)} className="border-2">
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Negotiation Form */}
          <Dialog open={negotiateOpen} onOpenChange={setNegotiateOpen}>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Negotiate Price</DialogTitle>
                <DialogDescription className="text-base">
                  Current price: <span className="font-semibold text-green-600">Rs. {product.pricePerKg}/kg</span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5">
                <div>
                  <Label className="text-base font-semibold mb-2 block">Your Target Price (Rs.)</Label>
                  <Input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    className="text-lg"
                    placeholder="Enter your offer"
                  />
                </div>

                <div>
                  <Label className="text-base font-semibold mb-2 block">Notes (optional)</Label>
                  <Textarea
                    value={negotiateNotes}
                    onChange={(e) => setNegotiateNotes(e.target.value)}
                    className="min-h-[100px]"
                    placeholder="Add any additional notes or requirements..."
                  />
                </div>
              </div>

              <DialogFooter className="gap-3">
                <Button variant="outline" onClick={() => setNegotiateOpen(false)} className="border-2">
                  Cancel
                </Button>
                <Button 
                  onClick={handleNegotiate}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Submit Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
};

export default ProductDetail;
