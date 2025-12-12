import { Link } from 'react-router-dom';
import { TFunction } from 'i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Gift } from 'lucide-react';
import type { Order } from '@/store/ordersSlice';

interface OrdersSectionProps {
  t: TFunction;
  orders: Order[];
  deliveredOrders: number;
  pendingOrders: number;
  getStatusIcon: (status: string) => JSX.Element;
  getOrderStatusColor: (status: string) => string;
  formatDate: (date: any) => string;
  userRewardPoints?: number;
}

export const OrdersSection = ({
  t,
  orders,
  deliveredOrders,
  pendingOrders,
  getStatusIcon,
  getOrderStatusColor,
  formatDate,
  userRewardPoints,
}: OrdersSectionProps) => {
  return (
    <div className="space-y-3 sm:space-y-4" id="orders">
      {/* Order Summary */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
          <CardTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-green-600"></div>
            Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Total Orders</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-700">{orders.length}</p>
            </div>
            <div className="p-3 sm:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Delivered</p>
              <p className="text-xl sm:text-2xl font-bold text-green-700">{deliveredOrders}</p>
            </div>
            <div className="p-3 sm:p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-200">
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Pending</p>
              <p className="text-xl sm:text-2xl font-bold text-orange-700">{pendingOrders}</p>
            </div>
            <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-1">Reward Points</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-700">{userRewardPoints || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {orders.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="py-12 sm:py-16 text-center px-4">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-100 mb-4 sm:mb-6">
              <Package className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">{t('buyer.noOrders')}</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">{t('buyer.startShopping')}</p>
            <Button asChild className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5">
              <Link to="/catalog">{t('buyer.browseProducts')}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:gap-4 lg:gap-6">
          {orders.map((order) => (
            <Card key={order.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <CardContent className="p-4 sm:p-5 lg:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-green-100 text-green-700 flex-shrink-0">
                      {getStatusIcon(order.status)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-base sm:text-lg text-gray-900 mb-1">Order #{order.id.slice(-8)}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                    </div>
                  </div>
                  <Badge className={`${getOrderStatusColor(order.status)} border font-medium px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm whitespace-nowrap`}>
                    {order.status === 'processing' ? 'Under Processing' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-2 sm:p-3 bg-gray-50 rounded-lg gap-2">
                      <span className="text-xs sm:text-sm font-medium text-gray-700 truncate flex-1">
                        {item.productName} × {item.qty}kg
                      </span>
                      <span className="font-semibold text-xs sm:text-sm text-gray-900 whitespace-nowrap">
                        Rs. {(item.pricePerKg * item.qty).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50/50 rounded-xl p-3 sm:p-4 space-y-2 border border-green-100">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="font-medium text-gray-900">Rs. {order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span className="text-muted-foreground">Delivery Fee:</span>
                    <span className="font-medium text-gray-900">Rs. {order.deliveryFee.toFixed(2)}</span>
                  </div>
                  {(order.redeemedPoints || order.pointsEarned) && (
                    <>
                      {order.redeemedPoints && order.redeemedPoints > 0 && (
                        <div className="flex justify-between text-xs sm:text-sm pt-2 border-t border-green-200">
                          <span className="text-muted-foreground">Points Redeemed:</span>
                          <span className="font-medium text-orange-600">-{order.redeemedPoints} points</span>
                        </div>
                      )}
                      {order.pointsEarned && order.pointsEarned > 0 && (
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-muted-foreground">Points Earned:</span>
                          <span className="font-semibold text-green-600 flex items-center gap-1">
                            <Gift className="h-3 w-3 sm:h-4 sm:w-4" />
                            +{order.pointsEarned} points
                          </span>
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex justify-between font-bold text-base sm:text-lg pt-2 border-t-2 border-green-300">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-green-700">Rs. {order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

