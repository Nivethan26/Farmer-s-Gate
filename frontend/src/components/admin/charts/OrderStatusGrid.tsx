import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Clock, CheckCircle, Truck, Archive } from 'lucide-react';
import { getStatusColor } from '@/utils/adminUtils';

interface OrderStatusGridProps {
  orderCounts: {
    pending: number;
    paid: number;
    shipped: number;
    delivered: number;
  };
}

export const OrderStatusGrid = ({ orderCounts }: OrderStatusGridProps) => (
  <Card className="dashboard-card">
    <CardHeader>
      <CardTitle>Order Status Overview</CardTitle>
      <CardDescription>Real-time order status distribution</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { status: 'pending', label: 'Pending', icon: Clock, count: orderCounts.pending },
          { status: 'paid', label: 'Paid', icon: CheckCircle, count: orderCounts.paid },
          { status: 'shipped', label: 'Shipped', icon: Truck, count: orderCounts.shipped },
          { status: 'delivered', label: 'Delivered', icon: Archive, count: orderCounts.delivered },
        ].map(item => (
          <div 
            key={item.status}
            className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className={`p-2 rounded-lg ${getStatusColor(item.status)}`}>
              <item.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{item.count}</p>
              <p className="text-sm text-muted-foreground">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);