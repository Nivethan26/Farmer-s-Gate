import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Users, Building, Package, ShoppingCart, UserCheck } from 'lucide-react';

export const AdminTabNavigation = () => (
  <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto gap-2 bg-transparent p-0">
    {[
      { value: 'overview', label: 'Overview', icon: BarChart3 },
      { value: 'sellers', label: 'Sellers', icon: Users },
      { value: 'agents', label: 'Agents', icon: Building },
      { value: 'products', label: 'Products', icon: Package },
      { value: 'orders', label: 'Orders', icon: ShoppingCart },
      { value: 'approvals', label: 'Approvals', icon: UserCheck },
    ].map(tab => (
      <TabsTrigger 
        key={tab.value}
        value={tab.value}
        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2.5 rounded-lg border bg-card"
      >
        <tab.icon className="h-4 w-4 mr-2" />
        {tab.label}
      </TabsTrigger>
    ))}
  </TabsList>
);