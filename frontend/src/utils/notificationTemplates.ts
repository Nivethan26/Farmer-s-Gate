export const notificationTemplates = {
  newOrder: (orderId: string) => ({
    title: "New Order",
    message: `Order #${orderId} received`,
    category: "order",
    role: "seller",
    link: `/seller/orders/${orderId}`,
  }),

  orderUpdate: (orderId: string, status: string) => ({
    title: "Order Update",
    message: `Order #${orderId} is now ${status}`,
    category: "order",
    role: "buyer",
    link: `/buyer/orders/${orderId}`,
  }),

  systemNotice: (message: string) => ({
    title: "System Notice",
    message,
    category: "system",
    role: "all",
  }),
};
