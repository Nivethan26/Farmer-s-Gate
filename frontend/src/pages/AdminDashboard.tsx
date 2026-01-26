import { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Navbar } from '@/components/layout/Navbar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminTabNavigation } from '@/components/admin/AdminTabNavigation';
import { OverviewTab } from '@/components/admin/tabs/OverviewTab';
import { UsersTab } from '@/components/admin/tabs/UsersTab';
import { ProductsTab } from '@/components/admin/tabs/ProductsTab';
import { OrdersTab } from '@/components/admin/tabs/OrdersTab';
import { SellerApprovalTab } from '@/components/seller/SellerApprovalTab';
import { useAdminData } from '@/hooks/useAdminData';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const {
    sellers,
    buyers,
    agents,
    products,
    orders,
    categories,
    isLoading,
    refreshData,
  } = useAdminData();

  const handleTabChange = async (value: string) => {
    setActiveTab(value);
    // Refresh data when tab changes
    await refreshData();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AdminHeader />
      
      <main className="container px-4 py-6">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <AdminTabNavigation activeTab={activeTab} />

          <TabsContent value="overview" className="space-y-6">
            <OverviewTab 
              orders={orders} 
              sellers={sellers} 
              products={products}
              categories={categories}
              isLoading={isLoading}
              onRefresh={refreshData}
            />
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <UsersTab 
              sellers={sellers} 
              buyers={buyers} 
              agents={agents} 
              isLoading={isLoading}
              onRefresh={refreshData}
            />
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <ProductsTab 
              products={products} 
              categories={categories} 
              isLoading={isLoading}
              onRefresh={refreshData}
            />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <OrdersTab orders={orders} isLoading={isLoading} onRefresh={refreshData} />
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