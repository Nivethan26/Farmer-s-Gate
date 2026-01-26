import { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Navbar } from '@/components/layout/Navbar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminTabNavigation } from '@/components/admin/AdminTabNavigation';
import { OverviewTab } from '@/components/admin/tabs/OverviewTab';
import { SellersTab } from '@/components/admin/tabs/SellersTab';
import { AgentsTab } from '@/components/admin/tabs/AgentsTab';
import { ProductsTab } from '@/components/admin/tabs/ProductsTab';
import { OrdersTab } from '@/components/admin/tabs/OrdersTab';
import { SellerApprovalTab } from '@/components/seller/SellerApprovalTab';
import { useAdminData } from '@/hooks/useAdminData';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const {
    sellers,
    agents,
    products,
    orders,
    categories,
    isLoading,
  } = useAdminData();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AdminHeader />
      
      <main className="container px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <AdminTabNavigation />

          <TabsContent value="overview" className="space-y-6">
            <OverviewTab 
              orders={orders} 
              sellers={sellers} 
              products={products}
              categories={categories}
              isLoading={isLoading} 
            />
          </TabsContent>

          <TabsContent value="sellers" className="space-y-6">
            <SellersTab sellers={sellers} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <AgentsTab agents={agents} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <ProductsTab 
              products={products} 
              categories={categories} 
              isLoading={isLoading} 
            />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <OrdersTab orders={orders} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="approvals" className="space-y-6">
            <SellerApprovalTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;