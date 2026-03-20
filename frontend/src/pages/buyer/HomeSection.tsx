import { Link } from 'react-router-dom';
import { TFunction } from 'i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Package, Clock, Gift, Store, User, ArrowRight } from 'lucide-react';
import type { CartItem } from '@/store/cartSlice';
import type { Order } from '@/store/ordersSlice';
import type { User as AuthUser } from '@/store/authSlice';

interface HomeSectionProps {
  t: TFunction;
  cartItems: CartItem[];
  orders: Order[];
  pendingOrders: number;
  user: AuthUser | null;
  onViewOrders: () => void;
  getStatusIcon: (status: string) => JSX.Element;
  getOrderStatusColor: (status: string) => string;
}

export const HomeSection = ({
  t,
  cartItems,
  orders,
  pendingOrders,
  user,
  onViewOrders,
  getStatusIcon,
  getOrderStatusColor,
}: HomeSectionProps) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50/50 overflow-hidden group">
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-2 sm:p-3 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
                <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{cartItems.length}</p>
                <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground mt-0.5 sm:mt-1">{t('buyer.cartItems')}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="w-full mt-2 text-green-700 hover:text-green-800 hover:bg-green-100 text-xs sm:text-sm py-1.5 sm:py-2 h-auto whitespace-normal flex items-center justify-center gap-1"
            >
              <Link to="/buyer/cart" className="flex items-center justify-center gap-1 w-full h-full">
                <span className="truncate">{t('buyer.viewCart')}</span>
                <ArrowRight className="h-3 w-3 ml-0 flex-shrink-0" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50/50 overflow-hidden group">
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 p-2 sm:p-3 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{orders.length}</p>
                <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground mt-0.5 sm:mt-1 break-words">{t('buyer.totalOrders')}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-2 text-blue-700 hover:text-blue-800 hover:bg-blue-100 text-xs sm:text-sm py-1.5 sm:py-2 h-auto whitespace-normal flex items-center justify-center gap-1"
              onClick={onViewOrders}
            >
              <span>{t('buyer.viewAll')}</span>
              <ArrowRight className="h-3 w-3 flex-shrink-0" />
            </Button>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-amber-50/50 overflow-hidden group">
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 p-2 sm:p-3 shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{pendingOrders}</p>
                <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground mt-0.5 sm:mt-1 break-words">{t('buyer.pendingOrders')}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50/50 overflow-hidden group">
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 p-2 sm:p-3 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                <Gift className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div className="text-right">
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{user?.rewardPoints || 0}</p>
                <p className="text-[10px] sm:text-xs lg:text-sm text-muted-foreground mt-0.5 sm:mt-1 break-words">{t('buyer.rewardPoints')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
          <CardTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-green-600"></div>
            {t('buyer.quickActions')}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <Link to="/catalog">
              <Button className="w-full h-full py-4 px-4 sm:px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-300 group text-sm sm:text-base whitespace-normal text-center leading-tight">
                <Store className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform flex-shrink-0" />
                <span className="font-semibold">{t('buyer.browseProducts')}</span>
              </Button>
            </Link>
            <Link to="/buyer/cart">
              <Button
                variant="outline"
                className="w-full h-full py-4 px-4 sm:px-6 border-2 border-green-200 hover:border-green-400 hover:bg-green-50 transition-all duration-300 group text-sm sm:text-base whitespace-normal text-center leading-tight"
              >
                <ShoppingCart className="mr-2 h-5 w-5 text-green-600 group-hover:scale-110 transition-transform flex-shrink-0" />
                <span className="font-semibold text-green-700 flex items-center gap-2">
                  {t('buyer.viewCart')}
                  {cartItems.length > 0 && (
                    <span className="bg-green-600 text-white px-2 py-0.5 rounded-full text-xs">
                      {cartItems.length}
                    </span>
                  )}
                </span>
              </Button>
            </Link>
            <Link to="/profile">
              <Button
                variant="outline"
                className="w-full h-full py-4 px-4 sm:px-6 border-2 border-blue-300 text-blue-600 hover:border-sky-400 hover:bg-sky-50 transition-all duration-300 group text-sm sm:text-base whitespace-normal text-center leading-tight"
              >
                <User className="mr-2 h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform flex-shrink-0" />
                <span className="font-semibold text-blue-600">{t('buyer.myProfile')}</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 flex-wrap">
            <CardTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-green-600"></div>
              {t('buyer.recentOrders')}
            </CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-xs sm:text-sm h-auto whitespace-normal flex items-center gap-1">
              <Link to="#orders" className="text-green-600 hover:text-green-700 flex items-center gap-1">
                <span>{t('buyer.viewAll')}</span>
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          {orders.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 mb-3 sm:mb-4">
                <Package className="h-8 w-8 sm:h-10 sm:w-10 text-muted-foreground" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-900">{t('buyer.noOrders')}</h3>
              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 px-4">{t('buyer.startShopping')}</p>
              <Button asChild className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5">
                <Link to="/catalog">{t('buyer.browseProducts')}</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {orders.slice(0, 3).map((order) => (
                <div
                  key={order.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300 group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-green-100 text-green-700 flex-shrink-0">
                        {getStatusIcon(order.status)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm sm:text-base text-gray-900 group-hover:text-green-700 transition-colors truncate">
                          {t('orderNumber', { number: order.id.slice(-8) })}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          {order.items.length} {t('items')} • Rs. {order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Badge className={`${getOrderStatusColor(order.status)} border font-medium px-2 sm:px-3 py-1 text-xs sm:text-sm whitespace-nowrap`}>
                    {t(`buyer.status.${order.status}`)}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

