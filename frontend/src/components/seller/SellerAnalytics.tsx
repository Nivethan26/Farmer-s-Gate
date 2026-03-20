import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { Product } from "@/store/catalogSlice";
import { TrendingUp, TrendingDown, Package, DollarSign } from "lucide-react";

interface SellerAnalyticsProps {
  products: Product[];
}

const SellerAnalytics = ({ products }: SellerAnalyticsProps) => {
  const { t } = useTranslation();

  // Calculate analytics data
  const totalProducts = products.length;
  const activeProducts = products.filter(p => new Date(p.expiresOn) > new Date()).length;
  const expiredProducts = products.filter(p => new Date(p.expiresOn) <= new Date()).length;
  const totalStock = products.reduce((sum, p) => sum + p.stockQty, 0);
  const totalValue = products.reduce((sum, p) => sum + (p.pricePerKg * p.stockQty), 0);

  // Data for category distribution
  const categoryData = products.reduce((acc, product) => {
    const existing = acc.find(item => item.name === product.category);
    if (existing) {
      existing.value += 1;
    } else {
      acc.push({ name: product.category, value: 1 });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  // Data for stock by product
  const stockByProduct = products.slice(0, 5).map(product => ({
    name: product.name.length > 10 ? product.name.substring(0, 10) + '...' : product.name,
    stock: product.stockQty,
    value: product.pricePerKg * product.stockQty,
  }));

  // Data for status distribution
  const statusData = [
    { name: t("seller.active"), value: activeProducts, color: '#10b981' },
    { name: t("seller.expired"), value: expiredProducts, color: '#ef4444' },
    { name: t("seller.expiringSoon"), value: products.filter(p => {
      const daysUntilExpiry = (new Date(p.expiresOn).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
      return daysUntilExpiry > 0 && daysUntilExpiry <= 3;
    }).length, color: '#f59e0b' },
  ];

  // Data for price distribution
  const priceDistribution = products.reduce((acc, product) => {
    const priceRange = Math.floor(product.pricePerKg / 100) * 100;
    const existing = acc.find(item => item.range === priceRange);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ range: priceRange, count: 1 });
    }
    return acc;
  }, [] as { range: number; count: number }[])
  .sort((a, b) => a.range - b.range)
  .map(item => ({ 
    range: `Rs. ${item.range}-${item.range + 99}`, 
    count: item.count 
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <div className="space-y-6">
      {/* Quick Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t("seller.totalProducts")}
                </p>
                <p className="text-3xl font-bold">{totalProducts}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-4 w-4 mr-1" />
                {activeProducts} {t("seller.active")}
              </span>
              <span className="ml-4 text-red-600 flex items-center">
                <TrendingDown className="h-4 w-4 mr-1" />
                {expiredProducts} {t("seller.expired")}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t("seller.totalStock")}
                </p>
                <p className="text-3xl font-bold">{totalStock} {t("seller.kg")}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {t("seller.average")}: {products.length > 0 ? (totalStock / products.length).toFixed(1) : 0} {t("seller.kg")}/{t("seller.product")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                 {t("seller.totalinventoryValue")}
                </p>
                <p className="text-3xl font-bold">Rs. {totalValue.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-full">
                <DollarSign className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {t("seller.average")}: Rs. {products.length > 0 ? (totalValue / products.length).toLocaleString() : 0}/{t("seller.product")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {t("seller.statusoverview")}
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
                    <span className="text-lg font-bold">{activeProducts}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
                    <span className="text-lg font-bold">{expiredProducts}</span>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {((activeProducts / totalProducts) * 100).toFixed(1)}% {t("seller.activerate")}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Product Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t("seller.productStatusDistribution")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Stock by Product Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>{t("seller.topProductsByStock")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={stockByProduct}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="stock" name={t("seller.stockKg")} fill="#8884d8" />
                  <Bar dataKey="value" name={t("seller.valueRs")} fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Price Distribution Bar Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("seller.priceDistribution")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={priceDistribution}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" name={t("seller.numberOfProducts")} fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        {categoryData.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t("seller.categoryDistribution")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${entry.name}: ${entry.value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Expiry Timeline */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{t("seller.productExpiryTimeline")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={products
                    .filter(p => new Date(p.expiresOn) > new Date())
                    .sort((a, b) => new Date(a.expiresOn).getTime() - new Date(b.expiresOn).getTime())
                    .map((p, index) => ({
                      name: `Day ${index + 1}`,
                      days: Math.ceil((new Date(p.expiresOn).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
                      product: p.name,
                    }))}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="days" stroke="#8884d8" name="Days Until Expiry" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("seller.productSummary")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">{t("seller.productName")}</th>
                  <th className="text-left py-3 px-4 font-medium">{t("seller.category")}</th>
                  <th className="text-left py-3 px-4 font-medium">{t("seller.stock")}</th>
                  <th className="text-left py-3 px-4 font-medium">{t("seller.priceKg")}</th>
                  <th className="text-left py-3 px-4 font-medium">{t("seller.totalValue")}</th>
                  <th className="text-left py-3 px-4 font-medium">{t("seller.status")}</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 10).map((product) => {
                  const isExpired = new Date(product.expiresOn) <= new Date();
                  const daysUntilExpiry = Math.ceil(
                    (new Date(product.expiresOn).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                  );
                  
                  return (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{product.name}</td>
                      <td className="py-3 px-4">{product.category}</td>
                      <td className="py-3 px-4">{product.stockQty}</td>
                      <td className="py-3 px-4">Rs. {product.pricePerKg}</td>
                      <td className="py-3 px-4">Rs. {(product.pricePerKg * product.stockQty).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        {isExpired ? (
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                             {t("seller.expired")}
                          </span>
                        ) : daysUntilExpiry <= 3 ? (
                          <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                              {t("seller.expiringInDays", { days: daysUntilExpiry })}
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            {t("seller.active")} ({daysUntilExpiry} {t("seller.days")})
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {products.length > 10 && (
            <p className="text-sm text-muted-foreground mt-4 text-center">
              {t("seller.showingProducts", { count: 10, total: products.length })}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerAnalytics;