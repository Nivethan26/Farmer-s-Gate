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
  Building,
  User,
  CreditCard,
  Hash,
  Banknote,
  Copy,
  CheckCheck,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { addNotification } from "@/store/uiSlice";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Bank details interface
interface BankDetails {
  id: string;
  name: string;
  accountHolder: string;
  accountNumber: string;
  branch: string;
  icon: React.ReactNode;
  color: string;
}

const Cart = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const cart = useAppSelector((state: RootState) => state.cart);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);
  const [selectedBank, setSelectedBank] = useState<string>("boc");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showBankDetails, setShowBankDetails] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    accountHolderName: "",
    bankName: "",
    accountNumber: "",
    referenceNumber: "",
    amount: cart.total.toFixed(2),
  });

  // Bank details configuration
  const bankDetails: BankDetails[] = [
    {
      id: "boc",
      name: "Bank of Ceylon",
      accountHolder: "Agro Market Pvt Ltd",
      accountNumber: "1234567890",
      branch: "Colombo Main Branch",
      icon: <Building className="h-5 w-5" />,
      color: "from-blue-600 to-blue-800",
    },
    {
      id: "peoples",
      name: "Peoples Bank",
      accountHolder: "Agro Market Pvt Ltd",
      accountNumber: "0987654321",
      branch: "Colombo City Branch",
      icon: <Banknote className="h-5 w-5" />,
      color: "from-green-600 to-emerald-800",
    },
  ];

  const selectedBankDetail = bankDetails.find(bank => bank.id === selectedBank);

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

  const handleCopyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`${field} copied to clipboard!`);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handlePaymentFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitOrder = () => {
    // Validate payment form
    if (!paymentForm.accountHolderName.trim()) {
      toast.error("Please enter account holder name");
      return;
    }
    if (!paymentForm.bankName.trim()) {
      toast.error("Please enter bank name");
      return;
    }
    if (!paymentForm.accountNumber.trim()) {
      toast.error("Please enter account number");
      return;
    }
    if (!paymentForm.referenceNumber.trim()) {
      toast.error("Please enter reference number");
      return;
    }
    if (!receiptFile) {
      toast.error("Please upload payment receipt");
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
      address: user!.address,
      buyerEmail: user!.email,
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
      paymentDetails: {
        ...paymentForm,
        selectedBank: selectedBankDetail?.name || "",
      },
      createdAt: new Date().toISOString(),
      paidAt: null,
      deliveredAt: null,
      redeemedPoints: redeemedPoints > 0 ? redeemedPoints : undefined,
      pointsEarned: pointsEarned > 0 ? pointsEarned : undefined,
    };

    dispatch(createOrder(order));

    // Send notifications
    Object.entries(itemsBySeller).forEach(([sellerId, items]) => {
      // Create a simplified order object for the seller metadata containing only their items
      const sellerOrderMetadata = {
        ...order,
        items: items, // Only show items relevant to this seller
        total: items.reduce((sum, item) => sum + (item.pricePerKg * item.qty), 0) // Recalculate total for this seller
      };

      dispatch(
        addNotification({
          title: "New Order Received",
          message: `${user!.name} placed an order with ${items.length
            } item(s).`,
          type: "info",
          category: "order",
          role: "seller",
          sellerId: sellerId,
          buyerId: user!.id,
          link: `/seller/orders/`,
          metadata: sellerOrderMetadata,
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
        metadata: order,
      })
    );

    // Show order status notification
    toast.info("Order Under Processing", {
      description: `Order #${order.id} has been placed and is now being processed.`,
      duration: 5000,
    });

    // Add reward points
    if (pointsEarned > 0 && user) {
      dispatch(addRewardPoints(pointsEarned));
      toast.success(`Order placed! You earned ${pointsEarned} reward points!`);
    } else {
      toast.success("Order placed successfully!");
    }

    // Reset everything
    dispatch(clearCart());
    setCheckoutOpen(false);
    setReceiptFile(null);
    setPointsToRedeem(0);
    setShowBankDetails(false);
    setPaymentForm({
      accountHolderName: "",
      bankName: "",
      accountNumber: "",
      referenceNumber: "",
      amount: "0.00",
    });
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
                {t("cart.emptyTitle")}
              </h2>
              <p className="text-muted-foreground mb-8 text-sm sm:text-base">
                {t("cart.emptyDesc")}
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
              {t("cart.title")}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {t(cart.items.length === 1 ? "cart.itemsInCart_one" : "cart.itemsInCart_other", { count: cart.items.length })}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate("/catalog")}
              className="border-2 text-green-600 hover:bg-green-50 hover:border-green-300 hover:text-green-700"
            >
              {t("cart.continueShopping")}
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
              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 hover:text-red-700"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {t("cart.clearCart")}
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
                      {t("cart.orderSummary")}
                    </h2>
                    <p className="text-green-50 text-sm">
                      {t("cart.reviewOrder")}
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

                  {/* Updated Total Price Section - Mobile Optimized */}
                  <div className="border-t-2 border-green-200 pt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-lg font-bold text-gray-900">
                          {t("cart.totalAmount")}:
                        </span>
                        <div className="sm:hidden text-xs text-muted-foreground">
                          ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end gap-1">
                        <span className="text-2xl sm:text-3xl font-bold text-green-600">
                          Rs. {cart.total.toFixed(2)}
                        </span>
                        <div className="hidden sm:block text-xs text-muted-foreground">
                          ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Updated Checkout Buttons - Mobile Optimized */}
                  <div className="pt-2 space-y-3">
                    <Button
                      className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 font-semibold text-sm sm:text-base"
                      onClick={handleCheckout}
                    >
                      <Shield className="mr-2 h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                      <span className="truncate">
                        {t("cart.checkout")}
                        <span className="hidden sm:inline ml-2 opacity-90">
                          ({t("cart.itemsInCart_other", { count: cart.items.length })})
                        </span>
                      </span>
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full h-11 border-2 text-green-600 hover:bg-green-50 hover:border-green-300 hover:text-green-700 text-sm sm:text-base"
                      onClick={() => navigate("/catalog")}
                    >
                      <span className="truncate">{t("cart.continueShopping")}</span>
                      <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />
                    </Button>
                  </div>
                </CardContent>

                {/* Footer */}
                <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-gray-50 to-green-50/50 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-xs">
                      {t("cart.secureCheckoutDesc")}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </aside>
        </div>
      </div>

      {/* Enhanced Checkout Dialog - Fully Responsive */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className="sm:max-w-2xl lg:max-w-4xl max-w-[95vw] max-h-[90vh] sm:max-h-[95vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {t("cart.paySecurely")}
            </DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              {t("cart.chooseBankDesc")}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 mt-4">
            {/* Left Column - Bank Details */}
            <div className="lg:w-1/2 space-y-4 sm:space-y-6">
              {/* Total Amount */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                <Label className="text-sm sm:text-base font-semibold text-gray-900 block mb-2">
                  {t("cart.totalToPay")}
                </Label>
                <div className="text-2xl sm:text-3xl font-bold text-green-700">
                  Rs. {cart.total.toFixed(2)}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                  {t("cart.transferExact")}
                </p>
              </div>

              {/* Points Redemption */}
              {cart.redeemedPoints > 0 && (
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100">
                      <Gift className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-purple-800">
                        Redeeming {cart.redeemedPoints} reward points
                      </p>
                      <p className="text-xs text-purple-600">
                        Rs. {cart.redeemedPoints.toFixed(2)} discount applied
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Bank Selection */}
              <div>
                <Label className="text-sm sm:text-base font-semibold mb-3 block">
                  Select Bank for Transfer
                </Label>
                <RadioGroup
                  value={selectedBank}
                  onValueChange={setSelectedBank}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  {bankDetails.map((bank) => (
                    <div key={bank.id}>
                      <RadioGroupItem
                        value={bank.id}
                        id={bank.id}
                        className="sr-only"
                      />
                      <Label
                        htmlFor={bank.id}
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${selectedBank === bank.id
                          ? `border-green-400 bg-gradient-to-r ${bank.color}/10`
                          : "border-gray-200 hover:border-gray-300"
                          }`}
                      >
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${bank.color} text-white`}>
                          {bank.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                            {bank.name}
                          </p>
                          <p className="text-xs text-muted-foreground">Click to select</p>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Bank Details Toggle for Mobile */}
              <div className="lg:hidden">
                <Button
                  variant="outline"
                  className="w-full justify-between"
                  onClick={() => setShowBankDetails(!showBankDetails)}
                >
                  <span className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    View Bank Details
                  </span>
                  {showBankDetails ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>

                {showBankDetails && selectedBankDetail && (
                  <div className="mt-4">
                    <Card className="border-2 border-green-200 overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-gray-50 to-green-50/50 pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <div className={`p-2 rounded-lg bg-gradient-to-r ${selectedBankDetail.color} text-white`}>
                            {selectedBankDetail.icon}
                          </div>
                          <span className="truncate">{selectedBankDetail.name} Details</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-4 space-y-4">
                        <div className="space-y-3">
                          {/* Account Holder */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm font-medium">Account Holder</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <code className="bg-gray-100 px-3 py-1 rounded-lg font-mono text-sm break-all max-w-[200px] sm:max-w-none">
                                {selectedBankDetail.accountHolder}
                              </code>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 flex-shrink-0"
                                onClick={() => handleCopyToClipboard(selectedBankDetail.accountHolder, "Account Holder")}
                              >
                                {copiedField === "Account Holder" ? (
                                  <CheckCheck className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          {/* Account Number */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm font-medium">Account Number</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <code className="bg-gray-100 px-3 py-1 rounded-lg font-mono text-sm break-all max-w-[200px] sm:max-w-none">
                                {selectedBankDetail.accountNumber}
                              </code>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 flex-shrink-0"
                                onClick={() => handleCopyToClipboard(selectedBankDetail.accountNumber, "Account Number")}
                              >
                                {copiedField === "Account Number" ? (
                                  <CheckCheck className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          {/* Branch */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              <span className="text-sm font-medium">Branch</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <code className="bg-gray-100 px-3 py-1 rounded-lg font-mono text-sm break-all max-w-[200px] sm:max-w-none">
                                {selectedBankDetail.branch}
                              </code>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 flex-shrink-0"
                                onClick={() => handleCopyToClipboard(selectedBankDetail.branch, "Branch")}
                              >
                                {copiedField === "Branch" ? (
                                  <CheckCheck className="h-4 w-4 text-green-600" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Important Note */}
                        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3">
                          <p className="text-sm text-yellow-800 font-medium">
                            💡 Important: Please include your reference number in the payment description
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>

              {/* Bank Details for Desktop */}
              <div className="hidden lg:block">
                {selectedBankDetail && (
                  <Card className="border-2 border-green-200 overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-gray-50 to-green-50/50 pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${selectedBankDetail.color} text-white`}>
                          {selectedBankDetail.icon}
                        </div>
                        <span className="truncate">{selectedBankDetail.name} Details</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-4">
                      <div className="space-y-3">
                        {/* Account Holder */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm font-medium">Account Holder</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <code className="bg-gray-100 px-3 py-1 rounded-lg font-mono text-sm break-all max-w-[200px] sm:max-w-none">
                              {selectedBankDetail.accountHolder}
                            </code>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 flex-shrink-0"
                              onClick={() => handleCopyToClipboard(selectedBankDetail.accountHolder, "Account Holder")}
                            >
                              {copiedField === "Account Holder" ? (
                                <CheckCheck className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Account Number */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm font-medium">Account Number</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <code className="bg-gray-100 px-3 py-1 rounded-lg font-mono text-sm break-all max-w-[200px] sm:max-w-none">
                              {selectedBankDetail.accountNumber}
                            </code>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 flex-shrink-0"
                              onClick={() => handleCopyToClipboard(selectedBankDetail.accountNumber, "Account Number")}
                            >
                              {copiedField === "Account Number" ? (
                                <CheckCheck className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        {/* Branch */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm font-medium">Branch</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <code className="bg-gray-100 px-3 py-1 rounded-lg font-mono text-sm break-all max-w-[200px] sm:max-w-none">
                              {selectedBankDetail.branch}
                            </code>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 flex-shrink-0"
                              onClick={() => handleCopyToClipboard(selectedBankDetail.branch, "Branch")}
                            >
                              {copiedField === "Branch" ? (
                                <CheckCheck className="h-4 w-4 text-green-600" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Important Note */}
                      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-3">
                        <p className="text-sm text-yellow-800 font-medium">
                          💡 Important: Please include your reference number in the payment description
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Right Column - Payment Form */}
            <div className="lg:w-1/2 space-y-4 sm:space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Details
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Fill in your payment transfer details
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Account Holder Name */}
                  <div className="space-y-2">
                    <Label htmlFor="accountHolderName" className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4" />
                      Account Holder Name
                    </Label>
                    <Input
                      id="accountHolderName"
                      name="accountHolderName"
                      value={paymentForm.accountHolderName}
                      onChange={handlePaymentFormChange}
                      placeholder="Enter your name as in bank account"
                      className="border h-11"
                      required
                    />
                  </div>

                  {/* Bank Name and Account Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bankName" className="flex items-center gap-2 text-sm">
                        <Building className="h-4 w-4" />
                        Bank Name
                      </Label>
                      <Input
                        id="bankName"
                        name="bankName"
                        value={paymentForm.bankName}
                        onChange={handlePaymentFormChange}
                        placeholder="Your bank name"
                        className="border h-11"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="accountNumber" className="flex items-center gap-2 text-sm">
                        <CreditCard className="h-4 w-4" />
                        Account Number
                      </Label>
                      <Input
                        id="accountNumber"
                        name="accountNumber"
                        value={paymentForm.accountNumber}
                        onChange={handlePaymentFormChange}
                        placeholder="Your account number"
                        className="border h-11"
                        required
                      />
                    </div>
                  </div>

                  {/* Reference Number */}
                  <div className="space-y-2">
                    <Label htmlFor="referenceNumber" className="flex items-center gap-2 text-sm">
                      <Hash className="h-4 w-4" />
                      Payment Reference Number
                    </Label>
                    <Input
                      id="referenceNumber"
                      name="referenceNumber"
                      value={paymentForm.referenceNumber}
                      onChange={handlePaymentFormChange}
                      placeholder="Enter payment reference number"
                      className="border h-11"
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      This is the unique reference number from your bank transfer
                    </p>
                  </div>

                  {/* Amount Transferred */}
                  <div className="space-y-2">
                    <Label htmlFor="amount" className="flex items-center gap-2 text-sm">
                      <Banknote className="h-4 w-4" />
                      Amount Transferred
                    </Label>
                    <Input
                      id="amount"
                      name="amount"
                      value={paymentForm.amount}
                      onChange={handlePaymentFormChange}
                      placeholder="Amount"
                      className="border h-11 font-mono"
                      required
                      readOnly
                    />
                  </div>

                  {/* Upload Receipt */}
                  <div className="space-y-3">
                    <Label htmlFor="receipt" className="block text-base font-semibold">
                      Upload Payment Receipt
                    </Label>
                    <label
                      htmlFor="receipt"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all duration-300 group"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4">
                        <Upload className="h-10 w-10 text-muted-foreground group-hover:text-green-600 mb-3 transition-colors" />
                        <p className="mb-2 text-sm font-medium text-gray-700 group-hover:text-green-700 text-center">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground text-center">
                          JPG, PNG, PDF (MAX. 5MB)
                        </p>
                      </div>
                      <Input
                        id="receipt"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                        className="hidden"
                        required
                      />
                    </label>

                    {receiptFile && (
                      <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border-2 border-green-200">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 rounded-lg bg-green-100 flex-shrink-0">
                            <Upload className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {receiptFile.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {(receiptFile.size / 1024).toFixed(2)} KB
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setReceiptFile(null)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0 ml-2 h-8 w-8"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer - Mobile optimized buttons */}
          <DialogFooter className="flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-4 border-t mt-4">
            <Button
              variant="outline"
              onClick={() => setCheckoutOpen(false)}
              className="w-full sm:w-auto border h-10 sm:h-11"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitOrder}
              disabled={!receiptFile || !paymentForm.referenceNumber}
              className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 disabled:opacity-50 h-10 sm:h-11"
              size="sm"
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