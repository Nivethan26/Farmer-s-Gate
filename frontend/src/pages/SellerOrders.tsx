import { useMemo, useState } from "react";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  User,
  Calendar,
  Truck,
  DollarSign,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  ShoppingBag,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Navbar } from "@/components/layout/Navbar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";

// Status configuration with translation keys
const getStatusConfig = (status: string, t: any) => {
  switch (status) {
    case "processing":
      return {
        color: "bg-blue-100 text-blue-800 border-blue-200",
        icon: <Clock className="h-4 w-4" />,
        label: t("orders.status.processing", "Processing"),
      };
    case "paid":
      return {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <DollarSign className="h-4 w-4" />,
        label: t("orders.status.paid", "Paid"),
      };
    case "shipped":
      return {
        color: "bg-purple-100 text-purple-800 border-purple-200",
        icon: <Truck className="h-4 w-4" />,
        label: t("orders.status.shipped", "Shipped"),
      };
    case "delivered":
      return {
        color: "bg-emerald-100 text-emerald-800 border-emerald-200",
        icon: <CheckCircle className="h-4 w-4" />,
        label: t("orders.status.delivered", "Delivered"),
      };
    case "cancelled":
      return {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: <AlertCircle className="h-4 w-4" />,
        label: t("orders.status.cancelled", "Cancelled"),
      };
    default:
      return {
        color: "bg-gray-100 text-gray-800 border-gray-200",
        icon: <Package className="h-4 w-4" />,
        label: t("orders.status.unknown", "Unknown"),
      };
  }
};

const SellerOrders = () => {
  const seller = useAppSelector((s: RootState) => s.auth.user);
  const orders = useAppSelector((s: RootState) => s.orders.orders);
  const { t, i18n } = useTranslation();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const sellerOrders = useMemo(() => {
    if (!seller) return [];

    return orders
      .map((order) => {
        const sellerItems = order.items.filter(
          (item) => item.sellerId === seller.id
        );

        if (sellerItems.length === 0) return null;

        // Calculate subtotal for seller's items
        const subtotal = sellerItems.reduce(
          (sum, item) => sum + item.qty * item.pricePerKg,
          0
        );

        return {
          ...order,
          items: sellerItems,
          sellerSubtotal: subtotal,
          totalItems: sellerItems.length,
          totalQty: sellerItems.reduce((sum, item) => sum + item.qty, 0),
        };
      })
      .filter(Boolean);
  }, [orders, seller]);

  const handleOrderClick = (order: any) => {
    setSelectedOrder(order);
    setDialogOpen(true);
  };

  // Format date based on current language
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    
    // Define locale based on current language
    const localeMap: Record<string, string> = {
      en: "en-US",
      ta: "ta-IN",
      si: "si-LK"
    };
    
    const locale = localeMap[i18n.language] || "en-US";
    
    return date.toLocaleDateString(locale, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!sellerOrders.length) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <Navbar />
        <div className="max-w-7xl mx-auto p-6">
          <Card className="border-0 shadow-lg bg-white/50 backdrop-blur-sm">
            <CardContent className="py-20 text-center">
              <div className="inline-flex p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full mb-6">
                <Package className="h-16 w-16 text-blue-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {t("orders.noOrders.title", "No Orders Yet")}
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-6">
                {t("orders.noOrders.description", 
                  "When buyers purchase your products, their orders will appear here for you to manage.")}
              </p>
              <div className="flex items-center justify-center gap-4">
                <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  {t("orders.actions.viewProducts", "View Products")}
                </Button>
                <Button variant="outline">
                  {t("orders.actions.exploreMarketplace", "Explore Marketplace")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("orders.pageTitle", "Order Management")}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-gray-600">
              {t("orders.pageSubtitle", "Manage and track all orders for your products")}
            </p>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="px-3 py-1">
                {t("orders.summary.totalOrders", "{{count}} Total Orders", { 
                  count: sellerOrders.length 
                })}
              </Badge>
              <Badge
                variant="outline"
                className="px-3 py-1 bg-blue-50 text-blue-700 border-blue-200"
              >
                {t("orders.summary.processingOrders", "{{count}} Processing", {
                  count: sellerOrders.filter((o) => o.status === "processing").length
                })}
              </Badge>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sellerOrders.map((order) => {
            const statusConfig = getStatusConfig(order.status, t);

            return (
              <Card
                key={order.id}
                className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border hover:border-blue-200 bg-white/60 backdrop-blur-sm"
                onClick={() => handleOrderClick(order)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg">
                        <ShoppingBag className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {t("orders.orderNumber", "Order #{{number}}", {
                            number: order.id.slice(0, 8)
                          })}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3" />
                          {new Date(order.createdAt).toLocaleDateString(i18n.language === 'ta' ? 'ta-IN' : i18n.language === 'si' ? 'si-LK' : 'en-US')}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={`px-3 py-1 ${statusConfig.color} flex items-center gap-1.5`}
                      >
                        {statusConfig.icon}
                        <span className="font-medium">
                          {statusConfig.label}
                        </span>
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Order Summary */}
                  <div className="space-y-4">
                    {/* Buyer Info */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-white rounded border">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.buyerName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {t("orders.buyer", "Buyer")}
                        </p>
                      </div>
                    </div>

                    {/* Items Summary */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {t("orders.items", "Items")}
                        </span>
                        <span className="font-medium">
                          {t("orders.productCount", "{{count}} products", {
                            count: order.totalItems
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {t("orders.totalQuantity", "Total Quantity")}
                        </span>
                        <span className="font-medium">
                          {t("orders.quantityKg", "{{qty}} kg", {
                            qty: order.totalQty
                          })}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {t("orders.subtotal", "Subtotal")}
                        </span>
                        <span className="text-lg font-bold text-blue-600">
                          {t("common.currencyFormat", "Rs. {{amount}}", {
                            amount: order.sellerSubtotal.toFixed(2)
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="pt-3">
                      <Button
                        variant="outline"
                        className="w-full group-hover:border-blue-300 group-hover:text-blue-600 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOrderClick(order);
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {t("orders.actions.viewDetails", "View Details")}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-2xl">
                      {t("orders.orderNumber", "Order #{{number}}", {
                        number: selectedOrder.id.slice(0, 8)
                      })}
                    </DialogTitle>
                    <DialogDescription className="flex items-center gap-2 mt-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(selectedOrder.createdAt)}
                    </DialogDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={`px-4 py-2 text-lg ${
                      getStatusConfig(selectedOrder.status, t).color
                    } flex items-center gap-2`}
                  >
                    {getStatusConfig(selectedOrder.status, t).icon}
                    {getStatusConfig(selectedOrder.status, t).label}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Buyer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {t("orders.buyerInformation", "Buyer Information")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          {t("orders.buyerName", "Buyer Name")}
                        </p>
                        <p className="font-medium">{selectedOrder.buyerName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          {t("orders.email", "Email")}
                        </p>
                        <p className="font-medium">
                          {selectedOrder.buyerEmail || t("orders.notProvided", "Not provided")}
                        </p>
                      </div>
                    </div>
                    {selectedOrder.address && (
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-500">
                            {t("orders.shippingAddress", "Shipping Address")}
                          </p>
                          <p className="font-medium">{selectedOrder.address}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      {t("orders.orderItems", "Order Items")} ({selectedOrder.items.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedOrder.items.map((item, index) => (
                        <div
                          key={item.productId}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex items-start justify-between">
                            <div className="space-y-3 w-full">
                              {/* Product Header */}
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded">
                                  <ShoppingBag className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <h4 className="font-semibold">
                                    {item.productName}
                                  </h4>
                                  <p className="text-sm text-gray-500">
                                    {t("orders.productId", "Product ID")}: {item.productId.slice(0, 8)}
                                  </p>
                                </div>
                              </div>

                              {/* Mobile-friendly grid layout */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-sm">
                                {/* Quantity */}
                                <div className="flex flex-col sm:block">
                                  <p className="text-gray-500">
                                    {t("orders.quantity", "Quantity")}
                                  </p>
                                  <p className="font-medium">
                                    {t("orders.quantityKg", "{{qty}} kg", {
                                      qty: item.qty
                                    })}
                                  </p>
                                </div>

                                {/* Price per kg */}
                                <div className="flex flex-col sm:block">
                                  <p className="text-gray-500">
                                    {t("orders.pricePerKg", "Price per kg")}
                                  </p>
                                  <p className="font-medium">
                                    {t("common.currencyFormat", "Rs. {{amount}}", {
                                      amount: item.pricePerKg.toFixed(2)
                                    })}
                                  </p>
                                </div>

                                {/* Subtotal */}
                                <div className="flex flex-col sm:block">
                                  <p className="text-gray-500">
                                    {t("orders.subtotal", "Subtotal")}
                                  </p>
                                  <p className="font-medium">
                                    {t("common.currencyFormat", "Rs. {{amount}}", {
                                      amount: (item.qty * item.pricePerKg).toFixed(2)
                                    })}
                                  </p>
                                </div>

                                {/* Status */}
                                <div className="flex flex-col sm:block">
                                  <p className="text-gray-500">
                                    {t("orders.status.label", "Status")}
                                  </p>
                                  <div className="mt-1 sm:mt-0">
                                    <Badge
                                      variant="outline"
                                      className="bg-green-50 text-green-700 border-green-200 whitespace-nowrap"
                                    >
                                      {String(t(`orders.status.label${selectedOrder.status}`, selectedOrder.status))}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Order Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      {t("orders.orderSummary", "Order Summary")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">
                          {t("orders.subtotal", "Subtotal")}
                        </span>
                        <span className="font-medium">
                          {t("common.currencyFormat", "Rs. {{amount}}", {
                            amount: selectedOrder.sellerSubtotal.toFixed(2)
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">
                          {t("orders.shippingFee", "Shipping Fee")}
                        </span>
                        <span className="font-medium">
                          {t("common.currencyFormat", "Rs. {{amount}}", {
                            amount: selectedOrder.shippingFee || 0.0
                          })}
                        </span>
                      </div>
                      {selectedOrder.tax && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">
                            {t("orders.tax", "Tax")}
                          </span>
                          <span className="font-medium">
                            {t("common.currencyFormat", "Rs. {{amount}}", {
                              amount: selectedOrder.tax.toFixed(2)
                            })}
                          </span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex items-center justify-between text-lg">
                        <span className="font-bold">
                          {t("orders.totalAmount", "Total Amount")}
                        </span>
                        <span className="font-bold text-blue-600">
                          {t("common.currencyFormat", "Rs. {{amount}}", {
                            amount: (
                              selectedOrder.sellerSubtotal +
                              (selectedOrder.shippingFee || 0) +
                              (selectedOrder.tax || 0)
                            ).toFixed(2)
                          })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  {t("orders.actions.close", "Close")}
                </Button>
                {selectedOrder.status === "processing" && (
                  <>
                    <Button
                      variant="outline"
                      className="border-green-200 text-green-700 hover:bg-green-50"
                    >
                      {t("orders.actions.markAsPaid", "Mark as Paid")}
                    </Button>
                    <Button
                      variant="outline"
                      className="border-blue-200 text-blue-700 hover:bg-blue-50"
                    >
                      {t("orders.actions.updateShipping", "Update Shipping")}
                    </Button>
                  </>
                )}
                {selectedOrder.status === "shipped" && (
                  <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                    {t("orders.actions.markAsDelivered", "Mark as Delivered")}
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SellerOrders;