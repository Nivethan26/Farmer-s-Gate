import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectUserOrders, selectUserNegotiations } from '@/store/selectors';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Package, Clock, MessageSquare, Store, TrendingUp } from 'lucide-react';
import type { RootState } from '@/store';

const BuyerDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const cartItems = useAppSelector((state: RootState) => state.cart.items);
  const orders = useAppSelector(selectUserOrders);
  const negotiations = useAppSelector(selectUserNegotiations);

  useEffect(() => {
    navigate('/catalog', { replace: true });
  }, [navigate]);

  const pendingOrders = orders.filter((o) => o.status === 'pending').length;

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'paid':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getNegotiationStatusColor = (status: string) => {
    switch (status) {
      case 'agreed':
        return 'bg-green-100 text-green-800';
      case 'countered':
        return 'bg-blue-100 text-blue-800';
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-poppins mb-2">{t('buyer.dashboard')}</h1>
          <p className="text-muted-foreground">{t('buyer.welcomeBack')}, {user?.name}!</p>
        </div>

        <Tabs defaultValue="home" className="space-y-6">
          <TabsList>
            <TabsTrigger value="home">{t('nav.home')}</TabsTrigger>
            <TabsTrigger value="orders">{t('nav.orders')}</TabsTrigger>
            <TabsTrigger value="negotiations">{t('buyer.negotiations')}</TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-full bg-primary/10 p-3">
                    <ShoppingCart className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('buyer.cartItems')}</p>
                    <p className="text-2xl font-bold">{cartItems.length}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-full bg-blue-100 p-3">
                    <Package className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('buyer.totalOrders')}</p>
                    <p className="text-2xl font-bold">{orders.length}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-full bg-orange-100 p-3">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('buyer.pendingOrders')}</p>
                    <p className="text-2xl font-bold">{pendingOrders}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('buyer.quickActions')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <Link to="/catalog">
                    <Button className="w-full" variant="outline">
                      <Store className="mr-2 h-4 w-4" />
                      {t('buyer.browseProducts')}
                    </Button>
                  </Link>
                  <Link to="/buyer/cart">
                    <Button className="w-full" variant="outline">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {t('buyer.viewCart')} ({cartItems.length})
                    </Button>
                  </Link>
                  <Link to="/profile">
                    <Button className="w-full" variant="outline">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      {t('buyer.myProfile')}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recent Orders */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t('buyer.recentOrders')}</CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="#orders">{t('common.viewAll')}</Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>{t('buyer.noOrders')}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Order #{order.id}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.items.length} items • Rs. {order.total.toFixed(2)}
                          </p>
                        </div>
                        <Badge className={getOrderStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
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
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">{t('buyer.noOrders')}</h3>
                  <p className="text-muted-foreground mb-4">{t('buyer.startShopping')}</p>
                  <Button asChild>
                    <Link to="/catalog">{t('buyer.browseProducts')}</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              orders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-semibold text-lg">Order #{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getOrderStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>
                            {item.productName} × {item.qty}kg
                          </span>
                          <span className="font-medium">
                            Rs. {(item.pricePerKg * item.qty).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal:</span>
                        <span>Rs. {order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Delivery Fee:</span>
                        <span>Rs. {order.deliveryFee.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-primary">Rs. {order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Negotiations Tab */}
          <TabsContent value="negotiations" className="space-y-4">
            {negotiations.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">{t('buyer.noNegotiations')}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t('buyer.browseWholesale')}
                  </p>
                  <Button asChild>
                    <Link to="/catalog">{t('buyer.browseProducts')}</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              negotiations.map((negotiation) => (
                <Card key={negotiation.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="font-semibold text-lg">{negotiation.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          Seller: {negotiation.sellerName}
                        </p>
                      </div>
                      <Badge className={getNegotiationStatusColor(negotiation.status)}>
                        {negotiation.status.charAt(0).toUpperCase() + negotiation.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Price</p>
                        <p className="text-lg font-semibold">Rs. {negotiation.currentPrice}/kg</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Your Offer</p>
                        <p className="text-lg font-semibold text-primary">
                          Rs. {negotiation.requestedPrice}/kg
                        </p>
                      </div>
                    </div>

                    {negotiation.status === 'countered' && negotiation.counterPrice && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                        <p className="text-sm font-medium text-blue-900 mb-1">Counter Offer</p>
                        <p className="text-lg font-bold text-blue-900">
                          Rs. {negotiation.counterPrice}/kg
                        </p>
                        {negotiation.counterNotes && (
                          <p className="text-sm text-blue-700 mt-2">{negotiation.counterNotes}</p>
                        )}
                      </div>
                    )}

                    {negotiation.notes && (
                      <div className="bg-muted rounded-lg p-3">
                        <p className="text-sm text-muted-foreground mb-1">Your Notes:</p>
                        <p className="text-sm">{negotiation.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BuyerDashboard;
