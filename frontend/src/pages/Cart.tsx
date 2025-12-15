import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import type { RootState } from "@/store";
import {
  removeFromCart,
  updateQty,
  clearCart,
  setRedeemedPoints,
} from "@/store/cartSlice";
import { createOrder } from "@/store/ordersSlice";
import { redeemRewardPoints, addRewardPoints } from "@/store/authSlice";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Trash2,
  ShoppingBag,
  Upload,
  ChevronLeft,
  Gift,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  Shield,
  Truck,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { addNotification } from "@/store/uiSlice";
const Cart = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const cart = useAppSelector((state: RootState) => state.cart);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);

  const handleUpdateQty = (productId: string, newQty: number) => {
    if (newQty <= 0) {
      dispatch(removeFromCart(productId));
    } else {
      dispatch(updateQty({ productId, qty: newQty }));
    }
  };

  const handleCheckout = () => {
    if (!user || user.role !== "buyer") {
      toast.error(t("cart.pleaseSignIn"));
      navigate("/login");
      return;
    }
    setCheckoutOpen(true);
  };

  const handleSubmitOrder = () => {
    if (!receiptFile) {
      toast.error(t("cart.uploadReceipt"));
      return;
    }

    // Calculate points earned (1 point per Rs. 100 spent, rounded down)
    const pointsEarned = Math.floor(cart.total / 100);
    const redeemedPoints = cart.redeemedPoints;
    const itemsBySeller: Record<string, typeof cart.items> = {};

    cart.items.forEach((item) => {
      if (!itemsBySeller[item.sellerId]) {
        itemsBySeller[item.sellerId] = [];
      }
      itemsBySeller[item.sellerId].push(item);
    });
    // Redeem points if any were used
    if (redeemedPoints > 0 && user) {
      dispatch(redeemRewardPoints(redeemedPoints));
    }

    const order = {
      id: `order-${Date.now()}`,
      buyerId: user!.id,
      buyerName: user!.name,
      items: cart.items.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        sellerId: item.sellerId,
        sellerName: item.sellerName,
        qty: item.qty,
        pricePerKg: item.pricePerKg,
      })),
      subtotal: cart.subtotal,
      deliveryFee: cart.deliveryFee,
      total: cart.total,
      status: "processing" as const,
      receiptUrl: `receipt-${Date.now()}.jpg`,
      createdAt: new Date().toISOString(),
      paidAt: null,
      deliveredAt: null,
      redeemedPoints: redeemedPoints > 0 ? redeemedPoints : undefined,
      pointsEarned: pointsEarned > 0 ? pointsEarned : undefined,
    };
    console.log(order);
    dispatch(createOrder(order));
    Object.entries(itemsBySeller).forEach(([sellerId, items]) => {
      dispatch(
        addNotification({
          title: "New Order Received",
          message: `${user!.name} placed an order with ${
            items.length
          } item(s).`,
          type: "info",
          category: "order",
          role: "seller",
          sellerId: sellerId,
          buyerId: user!.id,
          link: `/seller/orders/`,
        })
      );
    });

    dispatch(
      addNotification({
        title: "Order Placed",
        message: `Your order #${order.id} is under processing.`,
        type: "success",
        category: "order",
        role: "buyer",
        buyerId: user!.id,
        link: `/buyer/orders/`,
      })
    );

    // Show notification for order status
    toast.info("Order Under Processing", {
      description: `Order #${order.id} has been placed and is now being processed.`,
      duration: 5000,
    });

    // Add reward points to user account
    if (pointsEarned > 0 && user) {
      dispatch(addRewardPoints(pointsEarned));
      toast.success(`Order placed! You earned ${pointsEarned} reward points!`);
    } else {
      toast.success(t("cart.orderPlaced"));
    }

    dispatch(clearCart());
    setCheckoutOpen(false);
    setReceiptFile(null);
    setPointsToRedeem(0);
    navigate("/buyer/orders");
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
        <Navbar />
        <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
          <Card className="max-w-md mx-auto text-center shadow-2xl rounded-3xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm">
            <CardContent className="pt-16 pb-16 px-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 mb-6">
                <ShoppingBag className="h-12 w-12 text-green-600" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Your cart is empty
              </h2>
              <p className="text-muted-foreground mb-8 text-sm sm:text-base">
                Start adding products to your cart from our catalog
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-3">
                <Button
                  onClick={() => navigate("/catalog")}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30"
                >
                  Browse Products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/buyer")}
                  className="border-2 text-green-700 hover:text-green-800 hover:border-green-300 hover:bg-green-50"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
      <Navbar />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-poppins bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              Shopping Cart
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {cart.items.length} {cart.items.length === 1 ? "item" : "items"}{" "}
              in your cart
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate("/catalog")}
              className="border-2 hover:bg-green-50 hover:border-green-300"
            >
              Continue Shopping
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                dispatch(clearCart());
                // Custom toast with green styling
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
                          <p className="font-semibold text-sm text-gray-900">
                            Cart cleared
                          </p>
                          <p className="text-xs text-green-600 font-medium">
                            All items have been removed from your cart.
                          </p>
                        </div>
                      </div>
                    </div>
                  ),
                  {
                    duration: 2500,
                  }
                );
              }}
              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Cart
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Cart Items (main) */}
          <div className="lg:col-span-8 space-y-3 sm:space-y-4">
            {cart.items.map((item) => (
              <Card
                key={item.productId}
                className="border-0 shadow-md hover:shadow-lg transition-all duration-300 bg-white/90 backdrop-blur-sm overflow-hidden group"
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    {/* Product Image - More compact */}
                    <div className="flex-shrink-0 w-full sm:w-24 h-24 lg:w-28 lg:h-28 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200 group-hover:border-green-300 transition-colors">
                      <img
                        src={item.image}
                        alt={item.productName}
                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>

                    {/* Product Info - Compact layout */}
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 min-w-0">
                      {/* Left: Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 group-hover:text-green-700 transition-colors truncate">
                          {item.productName}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-2">
                          by{" "}
                          <span className="font-semibold text-gray-700">
                            {item.sellerName}
                          </span>
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg sm:text-xl font-bold text-green-600">
                              Rs. {item.pricePerKg}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              /kg
                            </span>
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            Subtotal:{" "}
                            <span className="font-semibold text-gray-900">
                              Rs. {(item.pricePerKg * item.qty).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Quantity Controls & Remove */}
                      <div className="flex items-center gap-3 sm:gap-4">
                        {/* Quantity Controls - Compact */}
                        <div className="flex items-center gap-1 bg-gray-50 rounded-lg border border-gray-200 p-0.5">
                          <button
                            aria-label="Decrease quantity"
                            onClick={() =>
                              handleUpdateQty(item.productId, item.qty - 1)
                            }
                            className="p-1.5 rounded-md hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-900"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <Input
                            type="number"
                            min={1}
                            value={item.qty}
                            onChange={(e) => {
                              const val = Number(e.target.value) || 1;
                              handleUpdateQty(item.productId, val);
                            }}
                            className="w-12 sm:w-14 text-center bg-transparent border-0 focus:ring-0 font-semibold text-gray-900 text-sm p-1"
                            aria-label="Quantity"
                          />
                          <button
                            aria-label="Increase quantity"
                            onClick={() =>
                              handleUpdateQty(item.productId, item.qty + 1)
                            }
                            className="p-1.5 rounded-md hover:bg-green-100 transition-colors text-green-600 hover:text-green-700"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Quantity Display & Remove */}
                        <div className="flex flex-col items-end gap-1">
                          <div className="text-xs font-semibold text-gray-700">
                            {item.qty} kg
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              dispatch(removeFromCart(item.productId))
                            }
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary (sidebar) */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24">
              <Card className="border-0 shadow-2xl overflow-hidden bg-white/90 backdrop-blur-sm">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 via-green-600 to-emerald-600 p-5 sm:p-6 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                  <div className="relative z-10">
                    <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5" />
                      Order Summary
                    </h2>
                    <p className="text-green-50 text-sm">
                      Review your items and place the order
                    </p>
                  </div>
                </div>

                {/* Summary Content */}
                <CardContent className="p-5 sm:p-6 space-y-4">
                  <div className="flex justify-between text-sm py-2 border-b border-gray-200">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold text-gray-900">
                      Rs. {cart.subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm py-2 border-b border-gray-200">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Truck className="h-4 w-4" />
                      Delivery Fee
                    </span>
                    <span className="font-semibold text-gray-900">
                      Rs. {cart.deliveryFee.toFixed(2)}
                    </span>
                  </div>

                  {/* Reward Points Redemption */}
                  {user && user.rewardPoints && user.rewardPoints > 0 && (
                    <div className="border-t border-gray-200 pt-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100">
                            <Gift className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <span className="font-medium text-gray-900">
                              Redeem Points
                            </span>
                            <p className="text-xs text-muted-foreground">
                              Available: {user.rewardPoints} pts
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          min="0"
                          max={Math.min(
                            user.rewardPoints,
                            cart.subtotal + cart.deliveryFee
                          )}
                          value={pointsToRedeem}
                          onChange={(e) => {
                            const value = Math.max(
                              0,
                              Math.min(
                                Number(e.target.value),
                                Math.min(
                                  user!.rewardPoints || 0,
                                  cart.subtotal + cart.deliveryFee
                                )
                              )
                            );
                            setPointsToRedeem(value);
                            dispatch(setRedeemedPoints(value));
                          }}
                          className="flex-1 border-2 focus:border-green-400"
                          placeholder="Points"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const maxRedeem = Math.min(
                              user!.rewardPoints || 0,
                              cart.subtotal + cart.deliveryFee
                            );
                            setPointsToRedeem(maxRedeem);
                            dispatch(setRedeemedPoints(maxRedeem));
                          }}
                          className="border-2 hover:bg-green-50 hover:border-green-400"
                        >
                          Max
                        </Button>
                      </div>
                      {cart.redeemedPoints > 0 && (
                        <div className="flex justify-between text-sm bg-green-50 rounded-lg p-3 border border-green-200">
                          <span className="text-green-700 font-medium">
                            Points Discount:
                          </span>
                          <span className="font-bold text-green-700">
                            -Rs. {cart.redeemedPoints.toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="border-t-2 border-green-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">
                        Total
                      </span>
                      <span className="text-2xl font-bold text-green-600">
                        Rs. {cart.total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 space-y-3">
                    <Button
                      className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 font-semibold text-base"
                      onClick={handleCheckout}
                    >
                      <Shield className="mr-2 h-5 w-5" />
                      {t("cart.checkout")}
                      <span className="ml-2 text-sm opacity-90">
                        ({cart.items.length} items)
                      </span>
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full h-11 border-2 hover:bg-green-50 hover:border-green-300"
                      onClick={() => navigate("/catalog")}
                    >
                      Continue Shopping
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>

                {/* Footer */}
                <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-green-50/50 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span>
                      Secure checkout • Admin will verify your payment receipt
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </aside>
        </div>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="max-w-xl sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Upload Payment Receipt
            </DialogTitle>
            <DialogDescription className="text-base">
              Please upload your payment receipt. Our admin team will verify the
              payment and process your order.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
              <Label className="text-base font-semibold text-gray-900">
                Total Amount
              </Label>
              <div className="text-2xl font-bold text-green-700">
                Rs. {cart.total.toFixed(2)}
              </div>
            </div>

            {cart.redeemedPoints > 0 && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-green-100">
                    <Gift className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Redeeming {cart.redeemedPoints} points
                    </p>
                    <p className="text-xs text-green-600">
                      Rs. {cart.redeemedPoints.toFixed(2)} discount applied
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label
                htmlFor="receipt"
                className="block mb-3 text-base font-semibold"
              >
                Payment Receipt
              </Label>
              <label
                htmlFor="receipt"
                className="flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 group"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="h-10 w-10 text-muted-foreground group-hover:text-green-600 mb-3 transition-colors" />
                  <p className="mb-2 text-sm font-medium text-gray-700 group-hover:text-green-700">
                    <span className="font-semibold">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Accepted: images, pdf (MAX. 5MB)
                  </p>
                </div>
                <Input
                  id="receipt"
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                  className="hidden"
                />
              </label>

              {receiptFile && (
                <div className="mt-4 flex items-center justify-between p-4 bg-green-50 rounded-xl border-2 border-green-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <Upload className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {receiptFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(receiptFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReceiptFile(null)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    Remove
                  </Button>
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="gap-3 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setCheckoutOpen(false)}
              className="border-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitOrder}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              Submit Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cart;
