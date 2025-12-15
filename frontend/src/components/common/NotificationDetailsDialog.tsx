import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import {
    ShoppingBag,
    Scale,
    Calendar,
    Package,
    CreditCard,
    MapPin,
    Clock,
    CircleDollarSign,
    User,
    Store
} from "lucide-react";
import type { Notification } from "@/store/uiSlice";

interface NotificationDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    notification: Notification | null;
}

export const NotificationDetailsDialog = ({
    open,
    onOpenChange,
    notification,
}: NotificationDetailsDialogProps) => {
    if (!notification || !notification.metadata) return null;

    const { metadata } = notification;

    // Determine if it's an Order or Negotiation based on metadata structure
    const isOrder = metadata.items && Array.isArray(metadata.items);
    const isNegotiation = metadata.requestedPrice !== undefined;

    const renderStatusBadge = (status: string) => {
        const statusMap: Record<string, string> = {
            pending: "bg-gray-100 text-gray-800 border-gray-200",
            processing: "bg-blue-100 text-blue-800 border-blue-200",
            shipped: "bg-purple-100 text-purple-800 border-purple-200",
            delivered: "bg-green-100 text-green-800 border-green-200",
            paid: "bg-emerald-100 text-emerald-800 border-emerald-200",
            open: "bg-gray-100 text-gray-800 border-gray-200",
            accepted: "bg-green-100 text-green-800 border-green-200",
            rejected: "bg-red-100 text-red-800 border-red-200",
            countered: "bg-amber-100 text-amber-800 border-amber-200",
        };

        const colorClass = statusMap[status.toLowerCase()] || "bg-gray-100 text-gray-800";

        return (
            <Badge className={`${colorClass} border px-3 py-1 capitalize`}>
                {status === 'open' ? 'Pending' : status}
            </Badge>
        );
    };

    const renderOrderDetails = () => (
        <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 md:gap-6">
            {/* Left Column: Items List (Takes full height on desktop) */}
            <div className="space-y-6">
                <div>
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-500" />
                        Order Items
                    </h4>
                    <div className="space-y-3">
                        {metadata.items.map((item: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-white shadow-sm">
                                <div>
                                    <p className="font-medium text-sm text-gray-900">{item.productName}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-gray-500">Qty: {item.qty} kg</span>
                                        <span className="text-xs text-gray-300">|</span>
                                        <span className="text-xs text-gray-500">Seller: {item.sellerName}</span>
                                    </div>
                                </div>
                                <p className="font-semibold text-sm">Rs. {(item.pricePerKg * item.qty).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Column: Summary & Info */}
            <div className="space-y-6">
                {/* Order Summary Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                        <p className="text-xs text-muted-foreground font-medium mb-1">Total Amount</p>
                        <p className="text-xl font-bold text-gray-900">Rs. {metadata.total.toFixed(2)}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                        <p className="text-xs text-muted-foreground font-medium mb-1">Items Count</p>
                        <p className="text-xl font-bold text-gray-900">{metadata.items.length} Items</p>
                    </div>
                </div>

                {/* Payment & Delivery Info - Stacked in right column */}
                <div className="space-y-6">
                    <div>
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-gray-500" />
                            Payment Details
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Method</span>
                                <span className="font-medium">Bank Transfer</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Bank</span>
                                <span className="font-medium">{metadata.paymentDetails?.selectedBank}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Ref No.</span>
                                <span className="font-medium font-mono text-xs">{metadata.paymentDetails?.referenceNumber}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            Delivery Info
                        </h4>
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                            <div className="text-sm">
                                <span className="text-gray-500 block text-xs mb-1">Delivery Address</span>
                                <span className="font-medium line-clamp-2">{metadata.address}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderNegotiationDetails = () => (
        <div className="space-y-6">
            {/* Product Highlight */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs text-purple-600 font-semibold mb-1 uppercase tracking-wider">Product</p>
                        <h3 className="text-lg font-bold text-gray-900">{metadata.productName}</h3>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                            <Store className="h-3 w-3" />
                            {metadata.sellerName}
                        </p>
                    </div>
                    <div className="bg-white px-3 py-1.5 rounded-lg shadow-sm border border-purple-100">
                        <p className="text-xs text-gray-500">Looking for</p>
                        <p className="font-bold text-purple-700">{metadata.requestedQty} kg</p>
                    </div>
                </div>
            </div>

            {/* Price Comparison */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">Current Market Price</p>
                    <p className="text-base font-semibold text-gray-700 decoration-gray-400 line-through decoration-auto">
                        Rs. {metadata.currentPrice}/kg
                    </p>
                </div>
                <div className="p-4 rounded-xl bg-green-50 border border-green-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-green-100 rounded-bl-full -mr-8 -mt-8"></div>
                    <p className="text-xs text-green-700 font-bold mb-1 relative z-10">Your Offer</p>
                    <p className="text-xl font-bold text-green-700 relative z-10">
                        Rs. {metadata.requestedPrice}/kg
                    </p>
                </div>
            </div>

            {/* Delivery & Notes */}
            <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-gray-900">Preferred Delivery Date</p>
                        <p className="text-sm text-gray-600">
                            {metadata.deliveryDate ? format(new Date(metadata.deliveryDate), 'EEEE, MMM dd, yyyy') : 'Not specified'}
                        </p>
                    </div>
                </div>

                {metadata.notes && (
                    <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-100">
                        <p className="text-xs text-yellow-700 font-semibold mb-1">Your Notes</p>
                        <p className="text-sm text-yellow-800 italic">"{metadata.notes}"</p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md md:max-w-lg lg:max-w-4xl mx-auto overflow-hidden p-0 border-0 shadow-2xl">
                <div className="flex flex-col max-h-[90vh]">
                    {/* Custom Header */}
                    <div className={`
            px-6 py-5 
            ${isOrder ? 'bg-gradient-to-br from-blue-600 to-indigo-600' : 'bg-gradient-to-br from-purple-600 to-pink-600'}
            text-white
          `}>
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                {isOrder ? <ShoppingBag className="h-4 w-4" /> : <Scale className="h-4 w-4" />}
                                <span className="text-xs font-bold uppercase tracking-wide">
                                    {isOrder ? 'Order Details' : 'Negotiation'}
                                </span>
                            </div>
                        </div>

                        <DialogTitle className="text-2xl font-bold flex items-center gap-3 mb-1">
                            {isOrder ? 'Order Placed' : 'Price Negotiation'}
                            {renderStatusBadge(metadata.status)}
                        </DialogTitle>
                        <DialogDescription className="text-white/80">
                            ID: <span className="font-mono opacity-100">{metadata.id}</span>
                            <span className="mx-2">•</span>
                            {format(new Date(metadata.createdAt), 'MMM dd, h:mm a')}
                        </DialogDescription>
                    </div>

                    {/* Content - Using overflow-y-auto instead of ScrollArea for natural behavior */}
                    <div className="flex-1 p-6 bg-white overflow-y-auto">
                        {isOrder ? renderOrderDetails() : isNegotiation ? renderNegotiationDetails() : (
                            <p className="text-center text-gray-500 py-8">Details not available.</p>
                        )}
                    </div>

                    <DialogFooter className="p-4 bg-gray-50 border-t mt-auto">
                        <Button
                            onClick={() => onOpenChange(false)}
                            className="w-full sm:w-auto"
                            variant="outline"
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
};
