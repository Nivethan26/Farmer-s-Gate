import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Check } from 'lucide-react';
import { FilterBar } from '../ui/FilterBar';
import { StatusBadge } from '../ui/StatusBadge';
import { TableSkeleton } from '../ui/TableSkeleton';
import { formatCurrency, formatDate, exportToCSV, getStatusColor } from '@/utils/adminUtils';
import type { Order } from '@/types/admin';
import { toast } from 'sonner';

interface OrdersTabProps {
  orders: Order[];
  isLoading: boolean;
}

export const OrdersTab = ({ orders, isLoading }: OrdersTabProps) => {
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
      const matchesSearch = orderSearch === '' ||
        order._id.toLowerCase().includes(orderSearch.toLowerCase()) ||
        order.buyerName.toLowerCase().includes(orderSearch.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  // Order counts by status
  const orderCounts = useMemo(() => ({
    pending: orders.filter(o => o.status === 'pending').length,
    paid: orders.filter(o => o.status === 'paid').length,
    processing: orders.filter(o => o.status === 'processing').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  }), [orders]);

  const handleExport = () => {
    exportToCSV(filteredOrders, 'orders');
  };

  const handleMarkOrderPaid = (orderId: string) => {
    toast.success(`Order ${orderId} marked as paid`);
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'processing', label: 'Processing' },
    { value: 'delivered', label: 'Delivered' },
  ];

  return (
    <div className="space-y-6">
      <FilterBar
        searchValue={orderSearch}
        onSearchChange={setOrderSearch}
        searchPlaceholder="Search by order ID or buyer name..."
        filterValue={orderStatusFilter}
        onFilterChange={setOrderStatusFilter}
        filterOptions={statusOptions}
        filterPlaceholder="All Status"
        onExport={handleExport}
      />

      {/* Real-time Status Counts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { status: 'pending', label: 'Pending', count: orderCounts.pending, color: 'bg-amber-500' },
          { status: 'paid', label: 'Paid', count: orderCounts.paid, color: 'bg-blue-500' },
          { status: 'processing', label: 'Processing', count: orderCounts.processing, color: 'bg-purple-500' },
          { status: 'delivered', label: 'Delivered', count: orderCounts.delivered, color: 'bg-emerald-500' },
        ].map(item => (
          <Card 
            key={item.status}
            className={`dashboard-card cursor-pointer transition-all hover:scale-105 ${orderStatusFilter === item.status ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setOrderStatusFilter(item.status)}
          >
            <CardContent className="pt-4 pb-4 flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${item.color}`} />
              <div>
                <p className="text-2xl font-bold">{item.count}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="dashboard-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6"><TableSkeleton /></div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No orders found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map(order => (
                        <TableRow key={order._id}>
                          <TableCell className="font-mono text-sm">{order._id.slice(-6)}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.buyerName}</p>
                              <p className="text-xs text-muted-foreground">{order.buyerEmail}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-semibold">
                            {formatCurrency(order.total)}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={order.status} />
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {formatDate(order.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              {order.status === "pending" && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleMarkOrderPaid(order._id)}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Mark Paid
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="sm:hidden space-y-4 p-4">
                {filteredOrders.length === 0 ? (
                  <p className="text-center text-muted-foreground">No orders found</p>
                ) : (
                  filteredOrders.map(order => (
                    <div
                      key={order._id}
                      className="border rounded-lg p-4 bg-white shadow-sm space-y-3"
                    >
                      <div className="font-mono text-sm text-muted-foreground">
                        #{order._id.slice(-6)}
                      </div>
                      <div>
                        <p className="font-semibold">{order.buyerName}</p>
                        <p className="text-xs text-muted-foreground">{order.buyerEmail}</p>
                      </div>
                      <div className="text-lg font-bold">
                        {formatCurrency(order.total)}
                      </div>
                      <div>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button variant="ghost" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        {order.status === "pending" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleMarkOrderPaid(order._id)}
                          >
                            <Check className="h-4 w-4 mr-1" /> Mark Paid
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};