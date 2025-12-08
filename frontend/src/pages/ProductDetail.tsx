import { useState } from 'react';
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
import { MapPin, Package, Calendar, User, ShoppingCart, MessageSquare, LogIn } from 'lucide-react';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const product = useAppSelector((state: RootState) =>
    state.catalog.products.find((p) => p.id === id)
  );
  const category = useAppSelector((state: RootState) =>
    state.catalog.categories.find((c) => c.id === product?.category)
  );

  const [qty, setQty] = useState(1);
  const [negotiateOpen, setNegotiateOpen] = useState(false);
  const [targetPrice, setTargetPrice] = useState('');
  const [negotiateNotes, setNegotiateNotes] = useState('');

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate('/catalog')}>Back to Catalog</Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Redirect to login if user is not logged in
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
    toast.success(`${qty}kg of ${product.name} added to cart!`);
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

  const expiresDate = new Date(product.expiresOn);
  const isExpiringSoon = (expiresDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24) < 3;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate('/catalog')} className="mb-6">
          ← Back to Catalog
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-square overflow-hidden rounded-2xl border">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline">{category?.icon} {category?.name}</Badge>
                <Badge variant={product.supplyType === 'wholesale' ? 'default' : 'secondary'}>
                  {product.supplyType === 'wholesale' ? 'Wholesale' : 'Small Scale'}
                </Badge>
                {isExpiringSoon && (
                  <Badge variant="destructive">Expiring Soon</Badge>
                )}
              </div>
              <h1 className="text-3xl font-bold font-poppins mb-2">{product.name}</h1>
              <p className="text-muted-foreground">{product.description}</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-5 w-5" />
                <span>Farmer: <strong className="text-foreground">{product.sellerName}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span>Location: <strong className="text-foreground">{product.locationDistrict}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Package className="h-5 w-5" />
                <span>Available: <strong className="text-foreground">{product.stockQty} kg</strong></span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-5 w-5" />
                <span>Expires: <strong className="text-foreground">{expiresDate.toLocaleDateString()}</strong></span>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4">
                  <p className="text-3xl font-bold text-primary">
                    Rs. {product.pricePerKg}
                    <span className="text-lg font-normal text-muted-foreground">/kg</span>
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="qty">Quantity (kg)</Label>
                    <Input
                      id="qty"
                      type="number"
                      min="1"
                      max={product.stockQty}
                      value={qty}
                      onChange={(e) => setQty(Math.max(1, Math.min(product.stockQty, Number(e.target.value))))}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span>Subtotal:</span>
                    <span className="text-lg font-semibold">Rs. {(product.pricePerKg * qty).toFixed(2)}</span>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      className="flex-1" 
                      variant={!user ? "outline" : "default"}
                      onClick={handleAddToCart}
                    >
                      {!user ? (
                        <>
                          <LogIn className="mr-2 h-4 w-4" />
                          Login to Buy
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Add to Cart
                        </>
                      )}
                    </Button>
                    {product.supplyType === 'wholesale' && (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          if (!user) {
                            toast.info('Please login to negotiate prices');
                            navigate('/login', { state: { from: `/product/${product.id}` } });
                            return;
                          }
                          setNegotiateOpen(true);
                        }}
                      >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Negotiate
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Negotiate Dialog */}
      <Dialog open={negotiateOpen} onOpenChange={setNegotiateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Negotiate Price</DialogTitle>
            <DialogDescription>
              Current price: Rs. {product.pricePerKg}/kg. Submit your target price and the farmer will review your request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="targetPrice">Your Target Price (Rs./kg)</Label>
              <Input
                id="targetPrice"
                type="number"
                placeholder="Enter your target price"
                value={targetPrice}
                onChange={(e) => setTargetPrice(e.target.value)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional information..."
                value={negotiateNotes}
                onChange={(e) => setNegotiateNotes(e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNegotiateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleNegotiate}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductDetail;
