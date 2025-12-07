import { useEffect, useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectUserOrders } from '@/store/selectors';
import { toast } from 'sonner';

export const useOrderNotifications = () => {
  const orders = useAppSelector(selectUserOrders);
  const previousOrdersRef = useRef<typeof orders>([]);

  useEffect(() => {
    // Skip on initial load
    if (previousOrdersRef.current.length === 0) {
      previousOrdersRef.current = orders;
      return;
    }

    // Check for status changes
    orders.forEach((currentOrder) => {
      const previousOrder = previousOrdersRef.current.find(
        (o) => o.id === currentOrder.id
      );

      if (previousOrder && previousOrder.status !== currentOrder.status) {
        // Status changed - show notification
        switch (currentOrder.status) {
          case 'processing':
            toast.info('Order Under Processing', {
              description: `Order #${currentOrder.id} is now being processed.`,
              duration: 5000,
            });
            break;
          case 'shipped':
            toast.success('Order Shipped!', {
              description: `Order #${currentOrder.id} has been shipped and is on its way.`,
              duration: 5000,
            });
            break;
          case 'delivered':
            toast.success('Order Delivered!', {
              description: `Order #${currentOrder.id} has been delivered successfully.`,
              duration: 5000,
            });
            break;
        }
      }
    });

    // Update previous orders
    previousOrdersRef.current = orders;
  }, [orders]);
};

