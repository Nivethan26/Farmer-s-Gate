import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Users, Building, Package, ShoppingCart, UserCheck } from 'lucide-react';

interface AdminTabNavigationProps {
  activeTab: string;
}

export const AdminTabNavigation = ({ activeTab }: AdminTabNavigationProps) => (
  <TabsList className="grid w-full grid-cols-5 h-auto bg-transparent p-0">
    {[
      { value: 'overview', label: 'Overview', icon: BarChart3 },
      { value: 'users', label: 'Users', icon: Users },
      { value: 'products', label: 'Products', icon: Package },
      { value: 'orders', label: 'Orders', icon: ShoppingCart },
      { value: 'approvals', label: 'Approvals', icon: UserCheck },
    ].map(tab => (
      <TabsTrigger 
        key={tab.value}
        value={tab.value}
        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-3 py-2.5 rounded-lg border bg-card flex items-center justify-center gap-2"
      >
        <tab.icon className="h-4 w-4" />
        {/* On mobile: show label only for active tab, On desktop: always show label */}
        <span className={`text-xs sm:text-sm ${activeTab === tab.value ? '' : 'hidden lg:inline'}`}>
          {tab.label}
        </span>
      </TabsTrigger>
    ))}
  </TabsList>
);