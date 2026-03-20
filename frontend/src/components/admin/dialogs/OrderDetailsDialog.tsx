import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '../ui/StatusBadge';
import { formatCurrency, formatDate } from '@/utils/adminUtils';
import { X, Package, MapPin, Calendar, CreditCard, User, Mail, Phone } from 'lucide-react';
import type { Order } from '@/types/admin';

interface OrderDetailsDialogProps {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}

export const OrderDetailsDialog = ({ order, open, onClose }: OrderDetailsDialogProps) => {
  if (!order) return null;

  // Get the base URL for the backend
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
  
  // Construct the full receipt URL
  const getReceiptUrl = (url: string | undefined) => {
    if (!url) return '';
    // If the URL already starts with http, return as is
    if (url.startsWith('http')) return url;
    // Otherwise, prepend the base URL
    return `${API_BASE_URL.replace('/api', '')}${url}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Order Details</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Order ID</p>
                  <p className="font-mono font-semibold">{order._id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <StatusBadge status={order.status} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Order Date
                  </p>
                  <p className="font-medium">{formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Total Amount
                  </p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(order.total)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Buyer Information */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5" />
                Buyer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Name</p>
                  <p className="font-medium">{order.buyerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </p>
                  <p className="font-medium">{order.buyerEmail}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Delivery Address
                  </p>
                  <p className="font-medium">{order.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        Seller: {item.sellerName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.qty} kg × {formatCurrency(item.pricePerKg)}/kg
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{formatCurrency(item.qty * item.pricePerKg)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Price Breakdown */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-4">Price Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Subtotal</p>
                  <p className="font-medium">{formatCurrency(order.subtotal)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Delivery Fee</p>
                  <p className="font-medium">{formatCurrency(order.deliveryFee)}</p>
                </div>
                {order.redeemedPoints > 0 && (
                  <div className="flex justify-between text-green-600">
                    <p>Redeemed Points</p>
                    <p className="font-medium">-{formatCurrency(order.redeemedPoints)}</p>
                  </div>
                )}
                <div className="border-t pt-2 flex justify-between">
                  <p className="font-semibold text-lg">Total</p>
                  <p className="font-bold text-lg text-green-600">{formatCurrency(order.total)}</p>
                </div>
                {order.pointsEarned > 0 && (
                  <div className="text-sm text-muted-foreground text-right">
                    Points Earned: {order.pointsEarned}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          {(order.paidAt || order.deliveredAt || order.receiptUrl) && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Additional Information</h3>
                <div className="space-y-2">
                  {order.paidAt && (
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Paid At</p>
                      <p className="font-medium">{formatDate(order.paidAt)}</p>
                    </div>
                  )}
                  {order.deliveredAt && (
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Delivered At</p>
                      <p className="font-medium">{formatDate(order.deliveredAt)}</p>
                    </div>
                  )}
                  {order.receiptUrl && (
                    <div>
                      <p className="text-muted-foreground mb-2">Receipt</p>
                      <Button variant="outline" size="sm" asChild>
                        <a 
                          href={getReceiptUrl(order.receiptUrl)} 
                          target="_blank" 
                          rel="noopener noreferrer"
                        >
                          View Receipt
                        </a>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
