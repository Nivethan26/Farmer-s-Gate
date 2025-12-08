import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectUserOrders, selectUserNegotiations } from '@/store/selectors';
import { useOrderNotifications } from '@/hooks/useOrderNotifications';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Package, Clock, MessageSquare, Store, TrendingUp, Gift, ArrowRight, CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import type { RootState } from '@/store';

const BuyerDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const cartItems = useAppSelector((state: RootState) => state.cart.items);
  const orders = useAppSelector(selectUserOrders);
  const negotiations = useAppSelector(selectUserNegotiations);

  // Watch for order status changes and show notifications
  useOrderNotifications();

  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'processing').length;
  const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'shipped':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paid':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getNegotiationStatusColor = (status: string) => {
    switch (status) {
      case 'agreed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'countered':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'open':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'shipped':
        return <Truck className="h-4 w-4" />;
      case 'processing':
        return <Clock className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Welcome Header */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-poppins bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                {t('buyer.dashboard')}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                {t('buyer.welcomeBack')}, <span className="font-semibold text-gray-900">{user?.name}</span>! 👋
              </p>
            </div>
            <Button 
              asChild 
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30"
            >
              <Link to="/catalog" className="flex items-center gap-2">
                <Store className="h-4 w-4" />
                Browse Products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="home" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
            <TabsTrigger value="home" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              {t('nav.home')}
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              {t('nav.orders')}
            </TabsTrigger>
            <TabsTrigger value="negotiations" className="data-[state=active]:bg-green-600 data-[state=active]:text-white">
              {t('buyer.negotiations')}
            </TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-emerald-50/50 overflow-hidden group">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 p-3 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
                      <ShoppingCart className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">{cartItems.length}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">{t('buyer.cartItems')}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    asChild 
                    className="w-full mt-2 text-green-700 hover:text-green-800 hover:bg-green-100"
                  >
                    <Link to="/buyer/cart">View Cart →</Link>
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-cyan-50/50 overflow-hidden group">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 p-3 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">{orders.length}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">{t('buyer.totalOrders')}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full mt-2 text-blue-700 hover:text-blue-800 hover:bg-blue-100"
                    onClick={() => {
                      const ordersTab = document.querySelector('[value="orders"]') as HTMLElement;
                      if (ordersTab) ordersTab.click();
                    }}
                  >
                    View All →
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-orange-50 to-amber-50/50 overflow-hidden group">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 p-3 shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-300">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">{pendingOrders}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">{t('buyer.pendingOrders')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50/50 overflow-hidden group">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 p-3 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                      <Gift className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900">{user?.rewardPoints || 0}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground mt-1">{t('buyer.rewardPoints')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-green-600"></div>
                  {t('buyer.quickActions')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Link to="/catalog">
                    <Button 
                      className="w-full h-auto py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-md hover:shadow-lg transition-all duration-300 group"
                    >
                      <Store className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                      <span className="font-semibold">{t('buyer.browseProducts')}</span>
                    </Button>
                  </Link>
                  <Link to="/buyer/cart">
                    <Button 
                      variant="outline" 
                      className="w-full h-auto py-4 px-6 border-2 border-green-200 hover:border-green-400 hover:bg-green-50 transition-all duration-300 group"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
                      <span className="font-semibold text-green-700">
                        {t('buyer.viewCart')} 
                        {cartItems.length > 0 && (
                          <span className="ml-2 bg-green-600 text-white px-2 py-0.5 rounded-full text-xs">
                            {cartItems.length}
                          </span>
                        )}
                      </span>
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button 
                      variant="outline" 
                      className="w-full h-auto py-4 px-6 border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 group"
                    >
                      <TrendingUp className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                      <span className="font-semibold">{t('buyer.myProfile')}</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-semibold flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-green-600"></div>
                    {t('buyer.recentOrders')}
                  </CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="#orders" className="text-green-600 hover:text-green-700">
                      View All <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                      <Package className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">{t('buyer.noOrders')}</h3>
                    <p className="text-muted-foreground mb-6">{t('buyer.startShopping')}</p>
                    <Button asChild className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                      <Link to="/catalog">{t('buyer.browseProducts')}</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.slice(0, 3).map((order) => (
                      <div 
                        key={order.id} 
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300 group"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-100 text-green-700">
                              {getStatusIcon(order.status)}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                                Order #{order.id.slice(-8)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {order.items.length} items • Rs. {order.total.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                        <Badge className={`${getOrderStatusColor(order.status)} border font-medium px-3 py-1`}>
                          {order.status === 'processing' ? 'Under Processing' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
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
                            <p className="font-semibold text-lg text-gray-900 mb-1">Order #{order.id.slice(-8)}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                            </p>
                          </div>
                        </div>
                        <Badge className={`${getOrderStatusColor(order.status)} border font-medium px-4 py-1.5`}>
                          {order.status === 'processing' ? 'Under Processing' : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="space-y-3 mb-6">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-700">
                              {item.productName} × {item.qty}kg
                            </span>
                            <span className="font-semibold text-gray-900">
                              Rs. {(item.pricePerKg * item.qty).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="bg-gradient-to-r from-green-50 to-emerald-50/50 rounded-xl p-4 space-y-2 border border-green-100">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal:</span>
                          <span className="font-medium text-gray-900">Rs. {order.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Delivery Fee:</span>
                          <span className="font-medium text-gray-900">Rs. {order.deliveryFee.toFixed(2)}</span>
                        </div>
                        {(order.redeemedPoints || order.pointsEarned) && (
                          <>
                            {order.redeemedPoints && order.redeemedPoints > 0 && (
                              <div className="flex justify-between text-sm pt-2 border-t border-green-200">
                                <span className="text-muted-foreground">Points Redeemed:</span>
                                <span className="font-medium text-orange-600">-{order.redeemedPoints} points</span>
                              </div>
                            )}
                            {order.pointsEarned && order.pointsEarned > 0 && (
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Points Earned:</span>
                                <span className="font-semibold text-green-600 flex items-center gap-1">
                                  <Gift className="h-4 w-4" />
                                  +{order.pointsEarned} points
                                </span>
                              </div>
                            )}
                          </>
                        )}
                        <div className="flex justify-between font-bold text-lg pt-2 border-t-2 border-green-300">
                          <span className="text-gray-900">Total:</span>
                          <span className="text-green-700">Rs. {order.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Negotiations Tab */}
          <TabsContent value="negotiations" className="space-y-4">
            {negotiations.length === 0 ? (
              <Card className="border-0 shadow-lg">
                <CardContent className="py-16 text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-6">
                    <MessageSquare className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{t('buyer.noNegotiations')}</h3>
                  <p className="text-muted-foreground mb-6">
                    {t('buyer.browseWholesale')}
                  </p>
                  <Button asChild className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                    <Link to="/catalog">{t('buyer.browseProducts')}</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:gap-6">
                {negotiations.map((negotiation) => (
                  <Card key={negotiation.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 pb-6 border-b">
                        <div>
                          <p className="font-semibold text-lg text-gray-900 mb-1">{negotiation.productName}</p>
                          <p className="text-sm text-muted-foreground">
                            Seller: <span className="font-medium text-gray-700">{negotiation.sellerName}</span>
                          </p>
                        </div>
                        <Badge className={`${getNegotiationStatusColor(negotiation.status)} border font-medium px-4 py-1.5`}>
                          {negotiation.status.charAt(0).toUpperCase() + negotiation.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Current Price</p>
                          <p className="text-2xl font-bold text-gray-900">Rs. {negotiation.currentPrice}/kg</p>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Your Offer</p>
                          <p className="text-2xl font-bold text-green-700">
                            Rs. {negotiation.requestedPrice}/kg
                          </p>
                        </div>
                      </div>

                      {negotiation.status === 'countered' && negotiation.counterPrice && (
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-5 mb-6">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="h-5 w-5 text-blue-600" />
                            <p className="text-sm font-semibold text-blue-900">Counter Offer Received</p>
                          </div>
                          <p className="text-2xl font-bold text-blue-900 mb-2">
                            Rs. {negotiation.counterPrice}/kg
                          </p>
                          {negotiation.counterNotes && (
                            <p className="text-sm text-blue-700 mt-2">{negotiation.counterNotes}</p>
                          )}
                        </div>
                      )}

                      {negotiation.notes && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide">Your Notes</p>
                          <p className="text-sm text-gray-700">{negotiation.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BuyerDashboard;
