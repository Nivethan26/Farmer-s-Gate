import { useMemo } from "react";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

const statusColor = (status: string) => {
  switch (status) {
    case "processing":
      return "outline";
    case "paid":
      return "default";
    case "shipped":
      return "secondary";
    case "delivered":
      return "default";
    default:
      return "outline";
  }
};

const SellerOrders = () => {
  const seller = useAppSelector((s: RootState) => s.auth.user);
  const orders = useAppSelector((s: RootState) => s.orders.orders);

  const sellerOrders = useMemo(() => {
    if (!seller) return [];

    return orders
      .map((order) => {
        const sellerItems = order.items.filter(
          (item) => item.sellerId === seller.id
          
        );
        console.log("ORDER ITEMS FOR SELLER", sellerItems);


        if (sellerItems.length === 0) return null;

        return {
          ...order,
          items: sellerItems,
        };
      })
      .filter(Boolean);
  }, [orders, seller]);

  if (!sellerOrders.length) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="py-16 text-center">
            <Package className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
            <h3 className="text-lg font-semibold">No Orders Yet</h3>
            <p className="text-sm text-muted-foreground">
              Orders from buyers will appear here
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">My Orders</h1>

      {sellerOrders.map((order) => (
        <Card key={order.id} className="shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">
              Order #{order.id}
            </CardTitle>
            <Badge variant={statusColor(order.status)}>
              {order.status.toUpperCase()}
            </Badge>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="text-sm">
              <p>
                <span className="font-medium">Buyer:</span>{" "}
                {order.buyerName}
              </p>
              <p className="text-muted-foreground">
                Placed on {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="border rounded-md divide-y">
              {order.items.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between p-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-muted-foreground">
                      {item.qty} kg × Rs. {item.pricePerKg}
                    </p>
                  </div>
                  <div className="font-semibold">
                    Rs. {(item.qty * item.pricePerKg).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SellerOrders;
