import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import type { RootState } from '@/store';
import { removeFromCart, updateQty, clearCart } from '@/store/cartSlice';
import { createOrder } from '@/store/ordersSlice';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Trash2, ShoppingBag, Upload } from 'lucide-react';
import { toast } from 'sonner';

const Cart = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const cart = useAppSelector((state: RootState) => state.cart);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);

  const handleUpdateQty = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateQty({ productId, qty: newQty }));
    }
  };

  const handleCheckout = () => {
    if (!user || user.role !== 'buyer') {
      toast.error(t('cart.pleaseSignIn'));
      navigate('/login');
      return;
    }
    setCheckoutOpen(true);
  };

  const handleSubmitOrder = () => {
    if (!receiptFile) {
      toast.error(t('cart.uploadReceipt'));
      return;
    }

    const order = {
      id: `order-${Date.now()}`,
      buyerId: user!.id,
      buyerName: user!.name,
      items: cart.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        qty: item.qty,
        pricePerKg: item.pricePerKg,
      })),
      subtotal: cart.subtotal,
      deliveryFee: cart.deliveryFee,
      total: cart.total,
      status: 'pending' as const,
      receiptUrl: `receipt-${Date.now()}.jpg`,
      createdAt: new Date().toISOString(),
      paidAt: null,
      deliveredAt: null,
    };

    dispatch(createOrder(order));
    dispatch(clearCart());
    toast.success(t('cart.orderPlaced'));
    setCheckoutOpen(false);
    navigate('/buyer/orders');
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <Card className="group max-w-md mx-auto text-center transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-primary/20 cursor-pointer">
            <CardContent className="pt-12 pb-12">
              <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground transition-transform duration-300 group-hover:scale-110 group-hover:text-primary" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">
                Start adding products to your cart from our catalog
              </p>
              <Button onClick={() => navigate('/catalog')} className="transition-all duration-300 hover:scale-105 hover:shadow-lg">Browse Products</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold font-poppins mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <Card key={item.productId}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{item.productName}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        by {item.sellerName}
                      </p>
                      <p className="text-primary font-semibold">
                        Rs. {item.pricePerKg}/kg
                      </p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => dispatch(removeFromCart(item.productId))}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQty(item.productId, item.qty - 1)}
                        >
                          -
                        </Button>
                        <Input
                          type="number"
                          value={item.qty}
                          onChange={(e) => handleUpdateQty(item.productId, Number(e.target.value))}
                          className="w-16 text-center"
                          min="1"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQty(item.productId, item.qty + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <p className="font-semibold mt-2">
                        Rs. {(item.pricePerKg * item.qty).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold">Rs. {cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span className="font-semibold">Rs. {cart.deliveryFee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-4 flex justify-between text-lg">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-primary">Rs. {cart.total.toFixed(2)}</span>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <Button className="w-full" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/catalog')}
                >
                  Continue Shopping
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="hover:border-2 hover:border-black transition-all">
          <DialogHeader>
            <DialogTitle>Upload Payment Receipt</DialogTitle>
            <DialogDescription>
              Please upload your payment receipt. Your order will be verified by our admin team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Total Amount: Rs. {cart.total.toFixed(2)}</Label>
            </div>
            <div>
              <Label htmlFor="receipt">Payment Receipt</Label>
              <div className="mt-2 flex items-center gap-2">
                <Input
                  id="receipt"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                />
                <Upload className="h-5 w-5 text-muted-foreground" />
              </div>
              {receiptFile && (
                <p className="text-sm text-muted-foreground mt-2">
                  Selected: {receiptFile.name}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCheckoutOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitOrder}>Submit Order</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cart;
