import { Link } from 'react-router-dom';
import { TFunction } from 'i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Gift } from 'lucide-react';
import type { Order } from '@/store/ordersSlice';

interface OrdersSectionProps {
  t: TFunction;
  orders: Order[];
  getStatusIcon: (status: string) => JSX.Element;
  getOrderStatusColor: (status: string) => string;
}

export const OrdersSection = ({
  t,
  orders,
  getStatusIcon,
  getOrderStatusColor,
}: OrdersSectionProps) => {
  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="py-16 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-6">
              <Package className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">{t('buyer.noOrders')}</h3>
            <p className="text-muted-foreground mb-6">{t('buyer.startShopping')}</p>
            <Button asChild className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
              <Link to="/catalog">{t('buyer.browseProducts')}</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:gap-6">
          {orders.map((order) => (
            <Card key={order.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 pb-6 border-b">
                  <div className="flex items-start gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-100 text-green-700 flex-shrink-0">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <p className="font-semibold text-lg text-gray-900 mb-1">{t('buyer.orderId')} {order.id.slice(-8)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${getOrderStatusColor(order.status)} border font-medium px-4 py-1.5 h-auto whitespace-normal text-center`}>
                    {t(`buyer.status.${order.status}`)}
                  </Badge>
                </div>

                <div className="space-y-3 mb-6">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-gray-50 rounded-lg gap-2">
                      <span className="text-sm font-medium text-gray-700 break-words">
                        {item.productName} × {item.qty}kg
                      </span>
                      <span className="font-semibold text-gray-900 whitespace-nowrap">
                        Rs. {(item.pricePerKg * item.qty).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50/50 rounded-xl p-4 space-y-2 border border-green-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('buyer.subtotal')}:</span>
                    <span className="font-medium text-gray-900">Rs. {order.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('buyer.deliveryFee')}:</span>
                    <span className="font-medium text-gray-900">Rs. {order.deliveryFee.toFixed(2)}</span>
                  </div>
                  {(order.redeemedPoints || order.pointsEarned) && (
                    <>
                      {order.redeemedPoints && order.redeemedPoints > 0 && (
                        <div className="flex justify-between text-sm pt-2 border-t border-green-200">
                          <span className="text-muted-foreground">{t('buyer.pointsRedeemed')}:</span>
                          <span className="font-medium text-orange-600">-{order.redeemedPoints} {t('buyer.points')}</span>
                        </div>
                      )}
                      {order.pointsEarned && order.pointsEarned > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{t('buyer.pointsEarned')}:</span>
                          <span className="font-semibold text-green-600 flex items-center gap-1">
                            <Gift className="h-4 w-4" />
                            +{order.pointsEarned} {t('buyer.points')}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex justify-between font-bold text-lg pt-2 border-t-2 border-green-300">
                    <span className="text-gray-900">{t('buyer.total')}:</span>
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
