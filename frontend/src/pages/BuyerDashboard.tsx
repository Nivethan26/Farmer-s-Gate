import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '@/store/hooks';
import { selectUserOrders, selectUserNegotiations } from '@/store/selectors';
import { useOrderNotifications } from '@/hooks/useOrderNotifications';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Store, ArrowRight, CheckCircle2, Truck, Clock, Package, Home } from 'lucide-react';
import type { RootState } from '@/store';
import { OverviewSection } from './buyer/OverviewSection';
import { OrdersSection } from './buyer/OrdersSection';
import { NegotiationsSection } from './buyer/NegotiationsSection';
import { ProfileSection } from './buyer/ProfileSection';

const BuyerDashboard = () => {
  const { t } = useTranslation();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const cartItems = useAppSelector((state: RootState) => state.cart.items);
  const orders = useAppSelector(selectUserOrders);
  const negotiations = useAppSelector(selectUserNegotiations);

  // Watch for order status changes and show notifications
  useOrderNotifications();

  const pendingOrders = orders.filter((o) => o.status === 'pending' || o.status === 'processing').length;

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
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                asChild
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5 hover:shadow-xl hover:scale-105 transition-all duration-300 h-auto whitespace-normal"
              >
                <Link to="/" className="flex items-center justify-center gap-2">
                  <Home className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{t('buyer.home')}</span>
                  <span className="sm:hidden">{t('buyer.home')}</span>
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                </Link>
              </Button>
              <Button
                asChild
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30 w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-2.5 hover:shadow-xl hover:scale-105 transition-all duration-300 h-auto whitespace-normal"
              >
                <Link to="/catalog" className="flex items-center justify-center gap-2">
                  <Store className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  <span className="hidden sm:inline">{t('buyer.browseProducts')}</span>
                  <span className="sm:hidden">{t('buyer.browse')}</span>
                  <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <Tabs defaultValue="home" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm h-auto p-1">
            <TabsTrigger value="home" className="data-[state=active]:bg-green-600 data-[state=active]:text-white h-auto py-2 whitespace-normal text-center">
              {t('nav.home')}
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-green-600 data-[state=active]:text-white h-auto py-2 whitespace-normal text-center">
              {t('nav.orders')}
            </TabsTrigger>
            <TabsTrigger value="negotiations" className="data-[state=active]:bg-green-600 data-[state=active]:text-white h-auto py-2 whitespace-normal text-center">
              {t('buyer.negotiations')}
            </TabsTrigger>
            <TabsTrigger value="profile" className="data-[state=active]:bg-green-600 data-[state=active]:text-white h-auto py-2 whitespace-normal text-center">
              {t('buyer.profile')}
            </TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-6">
            <OverviewSection
              t={t}
              cartItems={cartItems}
              orders={orders}
              pendingOrders={pendingOrders}
              user={user}
              getStatusIcon={getStatusIcon}
              getOrderStatusColor={getOrderStatusColor}
            />
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-4">
            <OrdersSection
              t={t}
              orders={orders}
              getStatusIcon={getStatusIcon}
              getOrderStatusColor={getOrderStatusColor}
            />
          </TabsContent>

          {/* Negotiations Tab */}
          <TabsContent value="negotiations" className="space-y-4">
            <NegotiationsSection
              t={t}
              negotiations={negotiations}
              getNegotiationStatusColor={getNegotiationStatusColor}
            />
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-4">
            <ProfileSection user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BuyerDashboard;
