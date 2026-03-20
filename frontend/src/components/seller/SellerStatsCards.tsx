import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Plus,
  AlertCircle,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import type { Product } from "@/store/catalogSlice";
import { useNavigate } from "react-router-dom";

interface SellerStatsCardsProps {
  products: Product[];
  onAddProduct: () => void;
}

const SellerStatsCards = ({
  products,
  onAddProduct,
}: SellerStatsCardsProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // Get today at start of day for consistent comparison
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calculate all stats
  const stats = products.reduce(
    (acc, product) => {
      const expiryDate = new Date(product.expiresOn);
      expiryDate.setHours(0, 0, 0, 0);

      const diffTime = expiryDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        acc.active++;
        if (diffDays <= 3) {
          acc.expiringSoon.push({ ...product, daysLeft: diffDays });
          acc.expiringSoonCount++;
        } else if (diffDays <= 7) {
          acc.expiringThisWeek.push({ ...product, daysLeft: diffDays });
          acc.expiringThisWeekCount++;
        } else if (diffDays <= 30) {
          acc.expiringThisMonth.push({ ...product, daysLeft: diffDays });
          acc.expiringThisMonthCount++;
        }
      } else {
        acc.expired++;
        if (diffDays === 0) {
          acc.expiredToday.push(product);
          acc.expiredTodayCount++;
        } else {
          acc.expiredEarlier.push(product);
          acc.expiredEarlierCount++;
        }
      }

      return acc;
    },
    {
      total: products.length,
      active: 0,
      expired: 0,
      expiringSoon: [] as Array<Product & { daysLeft: number }>,
      expiringSoonCount: 0,
      expiringThisWeek: [] as Array<Product & { daysLeft: number }>,
      expiringThisWeekCount: 0,
      expiringThisMonth: [] as Array<Product & { daysLeft: number }>,
      expiringThisMonthCount: 0,
      expiredToday: [] as Product[],
      expiredTodayCount: 0,
      expiredEarlier: [] as Product[],
      expiredEarlierCount: 0,
    }
  );

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Main Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("seller.totalProducts")}
                </p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">
                  {stats.total}
                </p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Package className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("seller.active")}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">
                  {stats.active}
                </p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.expiringSoonCount > 0
                ? t("seller.expiringSoonCount", {
                    count: stats.expiringSoonCount,
                  })
                : t("seller.allGood")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("seller.expiringSoon")}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-orange-600 mt-1">
                  {stats.expiringSoonCount}
                </p>
              </div>
              <div className="p-2 bg-orange-50 rounded-lg">
                <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {t("seller.willExpireWithin3Days")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t("seller.expired")}
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-red-600 mt-1">
                  {stats.expired}
                </p>
              </div>
              <div className="p-2 bg-red-50 rounded-lg">
                <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {stats.expiredTodayCount > 0
                ? `${stats.expiredTodayCount} ${t("seller.expiredToday")}`
                : t("seller.pastExpiries")}
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Summary and Actions */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>{t("seller.quickActions")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={onAddProduct} className="w-full text-xs">
              <Plus className="mr-2 h-4 w-4" />
              {t("seller.addNewProduct")}
            </Button>
            <Button
              onClick={() => navigate("/seller/orders")}
              className="w-full text-xs hover:bg-green-50 hover:border-green-200 border-green-300 text-white hover:text-green-700"
            >
              <Package className="mr-2 h-4 w-4" />
              {t("orders.title")}
            </Button>

            {stats.expired > 0 && (
              <Button
                variant="outline"
                className="w-full text-red-600 border-red-200 hover:bg-red-50 text-xs hover:text-red-600"
              >
                <XCircle className="mr-2 h-4 w-4 " />
                {t("seller.remove")} {t("seller.expired")}{" "}
                {t("seller.products")} ({stats.expired})
              </Button>
            )}

            {stats.expiringSoonCount > 0 && (
              <Button
                variant="outline"
                className="w-full text-orange-600 border-orange-200 hover:bg-orange-50"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {t("seller.extendexpirydates")} ({stats.expiringSoonCount})
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <Card>
          <CardHeader>
            <CardTitle>{t("seller.inventorySummery")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("seller.total")} {t("seller.active")}{" "}
                  {t("seller.products")}{" "}
                </span>
                <span className="font-medium">{stats.active}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("seller.nearestexpiry")}
                </span>
                <span className="font-medium">
                  {stats.expiringSoonCount > 0
                    ? `${Math.min(
                        ...stats.expiringSoon.map((p) => p.daysLeft)
                      )} ${t("seller.days")}`
                    : stats.expiringThisWeekCount > 0
                    ? `${Math.min(
                        ...stats.expiringThisWeek.map((p) => p.daysLeft)
                      )} ${t("seller.days")}`
                    : stats.expiringThisMonthCount > 0
                    ? `${Math.min(
                        ...stats.expiringThisMonth.map((p) => p.daysLeft)
                      )} ${t("seller.days")}`
                    : t("seller.morethan30days")}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {t("seller.expiryhealth")}
                </span>
                <Badge
                  variant={
                    stats.expiringSoonCount > 0
                      ? "destructive"
                      : stats.expired > 0
                      ? "outline"
                      : "default"
                  }
                >
                  {stats.expiringSoonCount > 0
                    ? t("seller.needsAttention")
                    : stats.expired > 0
                    ? t("seller.good")
                    : t("seller.excellent")}
                </Badge>
              </div>
              <div className="pt-3 border-t">
                <p className="text-xs text-muted-foreground">
                  {t("seller.today")}: {today.toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Expiry Timeline Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t("seller.expiryTimeline")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Expiring Soon Section */}
            {stats.expiringSoonCount > 0 && (
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    <h3 className="font-semibold text-orange-900">
                      {t("seller.productsExpiringSoon")} (1-3 days)
                    </h3>
                  </div>
                  <Badge className="bg-orange-100 text-orange-800">
                    {stats.expiringSoonCount} {t("seller.item")}
                    {stats.expiringSoonCount !== 1 ? "s" : ""}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {stats.expiringSoon.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between bg-white p-3 rounded border border-orange-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {t("seller.expires")}:{" "}
                            {formatDate(product.expiresOn)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-orange-600">
                          {product.daysLeft} {t("seller.days")}{" "}
                          {t("seller.left")}
                        </p>
                        <p className="text-xs text-orange-500">
                          {t("seller.hurryUp")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expiring This Week */}
            {stats.expiringThisWeekCount > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <h3 className="font-semibold text-blue-900">
                      {t("seller.expirythisweek")} (4-7 {t("seller.days")})
                    </h3>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    {stats.expiringThisWeekCount} {t("seller.item")}
                    {stats.expiringThisWeekCount !== 1 ? "s" : ""}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {stats.expiringThisWeek.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between bg-white p-3 rounded border border-blue-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {t("seller.expires")}:{" "}
                            {formatDate(product.expiresOn)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">
                          {product.daysLeft} {t("seller.days")}{" "}
                          {t("seller.left")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expiring This Month */}
            {stats.expiringThisMonthCount > 0 && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-green-600" />
                    <h3 className="font-semibold text-green-900">
                      {t("seller.expirythismonth")} (8-30 {t("seller.days")})
                    </h3>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {stats.expiringThisMonthCount} {""}
                    {stats.expiringThisMonthCount !== 1
                      ? t("seller.items")
                      : t("seller.item")}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {stats.expiringThisMonth.slice(0, 3).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between bg-white p-3 rounded border border-green-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {t("seller.expires")} :{" "}
                            {formatDate(product.expiresOn)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          {product.daysLeft} {t("seller.day")}{" "}
                          {t("seller.left")}
                        </p>
                      </div>
                    </div>
                  ))}
                  {stats.expiringThisMonthCount > 3 && (
                    <p className="text-sm text-green-600 text-center">
                      +{stats.expiringThisMonthCount - 3} {t("seller.more")}{" "}
                      {t("seller.product")}
                      {stats.expiringThisMonthCount - 3 !== 1 ? "s" : ""}{" "}
                      {t("seller.expiringThisMonth")}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Expired Products */}
            {stats.expired > 0 && (
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <h3 className="font-semibold text-red-900">
                      {t("seller.expiredProducts")}
                    </h3>
                  </div>
                  <Badge variant="destructive">
                    {stats.expired}{" "}
                    {stats.expired === 1 ? t("seller.item") : t("seller.items")}
                  </Badge>
                </div>
                <div className="space-y-2">
                  {stats.expiredToday.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between bg-white p-3 rounded border border-red-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover grayscale"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-red-700">
                            {product.name}
                          </p>
                          <p className="text-sm text-red-600">
                            {t("seller.expiredToday")}:{" "}
                            {formatDate(product.expiresOn)}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="destructive"
                        className="whitespace-nowrap"
                      >
                        {t("seller.expired")}
                      </Badge>
                    </div>
                  ))}
                  {stats.expiredEarlier.slice(0, 3).map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between bg-white p-3 rounded border border-red-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="h-full w-full object-cover grayscale opacity-50"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-red-700 line-through">
                            {product.name}
                          </p>
                          <p className="text-sm text-red-600">
                            {t("seller.expired")}:{" "}
                            {formatDate(product.expiresOn)}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="destructive"
                        className="whitespace-nowrap bg-red-100 text-red-800"
                      >
                        {t("seller.remove")}
                      </Badge>
                    </div>
                  ))}
                  {stats.expired > 3 && (
                    <p className="text-sm text-red-600 text-center">
                      +{stats.expired - 3} {t("seller.more")}{" "}
                      {t("seller.expired")} {t("seller.product")}
                      {stats.expired - 3 !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* No Expiring Products Message */}
            {stats.expiringSoonCount === 0 &&
              stats.expiringThisWeekCount === 0 &&
              stats.expiringThisMonthCount === 0 && (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                  <h3 className="text-lg font-semibold text-green-700 mb-2">
                    {t("seller.noProductsExpiringSoon")}
                  </h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    {t("seller.allProductsHealthy")}
                  </p>
                </div>
              )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerStatsCards;
