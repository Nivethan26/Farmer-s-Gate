import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import type { RootState } from '@/store';
import { selectPendingSellers, selectPendingOrders } from '@/store/selectors';
import { approveSeller, rejectSeller, setSellerStatus } from '@/store/usersSlice';
import { markOrderPaid } from '@/store/ordersSlice';
import { addCategory, updateCategory, deleteCategory } from '@/store/catalogSlice';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { DataTable, Column } from '@/components/common/DataTable';
import {
  Users,
  Store,
  Package,
  TrendingUp,
  CheckCircle,
  XCircle,
  Edit,
  Trash2,
  Plus,
  Eye,
  Download,
} from 'lucide-react';
import { toast } from 'sonner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const categorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  slug: z.string().min(2, 'Slug is required'),
  icon: z.string().min(1, 'Icon is required'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

const COLORS = ['#2E7D32', '#FFC107', '#0288D1', '#E91E63', '#9C27B0'];

const AdminDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const pendingSellers = useAppSelector(selectPendingSellers);
  const pendingOrders = useAppSelector(selectPendingOrders);
  const allSellers = useAppSelector((state: RootState) => state.users.sellers);
  const allAgents = useAppSelector((state: RootState) => state.users.agents);
  const allBuyers = useAppSelector((state: RootState) => state.users.buyers);
  const categories = useAppSelector((state: RootState) => state.catalog.categories);
  const products = useAppSelector((state: RootState) => state.catalog.products);
  const orders = useAppSelector((state: RootState) => state.orders.orders);

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editCategoryDialogOpen, setEditCategoryDialogOpen] = useState(false);
  const [deleteCategoryDialogOpen, setDeleteCategoryDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [receiptDialogOpen, setReceiptDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  // Analytics data
  const salesByCategory = categories.map((cat) => ({
    name: cat.name,
    products: products.filter((p) => p.category === cat.id).length,
  }));

  const ordersByStatus = [
    { name: 'Pending', value: orders.filter((o) => o.status === 'pending').length },
    { name: 'Paid', value: orders.filter((o) => o.status === 'paid').length },
    { name: 'Shipped', value: orders.filter((o) => o.status === 'shipped').length },
    { name: 'Delivered', value: orders.filter((o) => o.status === 'delivered').length },
  ];

  // Category CRUD
  const handleAddCategory = (data: CategoryFormData) => {
    const newCategory = {
      id: `cat-${Date.now()}`,
      ...data,
    };
    dispatch(addCategory(newCategory));
    toast.success(t('admin.categoryCreated'));
    setCategoryDialogOpen(false);
    reset();
  };

  const handleEditCategory = (data: CategoryFormData) => {
    if (!selectedCategory) return;
    dispatch(updateCategory({ ...selectedCategory, ...data }));
    toast.success(t('admin.categoryUpdated'));
    setEditCategoryDialogOpen(false);
    setSelectedCategory(null);
    reset();
  };

  const handleDeleteCategory = () => {
    if (!selectedCategory) return;
    dispatch(deleteCategory(selectedCategory.id));
    toast.success(t('admin.categoryDeleted'));
    setDeleteCategoryDialogOpen(false);
    setSelectedCategory(null);
  };

  const openEditCategoryDialog = (category: any) => {
    setSelectedCategory(category);
    setValue('name', category.name);
    setValue('slug', category.slug);
    setValue('icon', category.icon);
    setEditCategoryDialogOpen(true);
  };

  // Seller approval
  const handleApproveSeller = (sellerId: string) => {
    dispatch(approveSeller(sellerId));
    toast.success(t('admin.sellerApproved'));
  };

  const handleRejectSeller = (sellerId: string) => {
    dispatch(rejectSeller(sellerId));
    toast.success(t('admin.sellerRejected'));
  };

  // Order verification
  const handleMarkAsPaid = (orderId: string) => {
    dispatch(markOrderPaid(orderId));
    toast.success(t('admin.orderMarkedPaid'));
    setReceiptDialogOpen(false);
  };

  // CSV Export
  const exportToCSV = (data: any[], filename: string) => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map((row) => Object.values(row).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
  };

  // Seller table columns
  const sellerColumns: Column<any>[] = [
    { header: t('profile.name'), accessor: 'name', sortable: true },
    { header: t('common.email'), accessor: 'email' },
    { header: t('profile.farmName'), accessor: 'farmName' },
    { header: t('profile.district'), accessor: 'district', sortable: true },
    {
      header: 'Status',
      accessor: (row) => (
        <Badge
          className={
            row.status === 'active'
              ? 'bg-green-100 text-green-800'
              : row.status === 'pending'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }
        >
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      accessor: (row) => (
        <div className="flex gap-2">
          {row.status === 'active' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                dispatch(setSellerStatus({ id: row.id, status: 'inactive' }));
                toast.success(t('admin.sellerDeactivated'));
              }}
            >
              {t('admin.deactivate')}
            </Button>
          )}
          {row.status === 'inactive' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                dispatch(setSellerStatus({ id: row.id, status: 'active' }));
                toast.success(t('admin.sellerActivated'));
              }}
            >
              {t('admin.activate')}
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Agent table columns
  const agentColumns: Column<any>[] = [
    { header: 'Name', accessor: 'name', sortable: true },
    { header: 'Email', accessor: 'email' },
    { header: 'Phone', accessor: 'phone' },
    {
      header: 'Regions',
      accessor: (row) => row.regions.join(', '),
    },
    {
      header: 'Status',
      accessor: (row) => (
        <Badge className={row.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Badge>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-poppins mb-2">{t('admin.dashboard')}</h1>
          <p className="text-muted-foreground">{t('admin.managePlatform')}</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">{t('admin.overview')}</TabsTrigger>
            <TabsTrigger value="sellers">
              {t('admin.sellers')} {pendingSellers.length > 0 && <Badge className="ml-2">{pendingSellers.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="orders">
              {t('admin.orders')} {pendingOrders.length > 0 && <Badge className="ml-2">{pendingOrders.length}</Badge>}
            </TabsTrigger>
            <TabsTrigger value="categories">{t('admin.categories')}</TabsTrigger>
            <TabsTrigger value="agents">{t('admin.agents')}</TabsTrigger>
            <TabsTrigger value="analytics">{t('admin.analytics')}</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-full bg-blue-100 p-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('admin.totalBuyers')}</p>
                    <p className="text-2xl font-bold">{allBuyers.length}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-full bg-green-100 p-3">
                    <Store className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('admin.totalSellers')}</p>
                    <p className="text-2xl font-bold">{allSellers.length}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-full bg-purple-100 p-3">
                    <Package className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('admin.totalProducts')}</p>
                    <p className="text-2xl font-bold">{products.length}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-full bg-orange-100 p-3">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('admin.totalOrders')}</p>
                    <p className="text-2xl font-bold">{orders.length}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pending Actions */}
            {(pendingSellers.length > 0 || pendingOrders.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.pendingActions')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pendingSellers.length > 0 && (
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{pendingSellers.length} {t('admin.sellersAwaitingApproval')}</p>
                        <p className="text-sm text-muted-foreground">{t('admin.reviewApplications')}</p>
                      </div>
                    </div>
                  )}
                  {pendingOrders.length > 0 && (
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{pendingOrders.length} {t('admin.ordersNeedVerification')}</p>
                        <p className="text-sm text-muted-foreground">{t('admin.verifyReceipts')}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Sellers Tab */}
          <TabsContent value="sellers" className="space-y-6">
            {pendingSellers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.pendingApprovals')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pendingSellers.map((seller) => (
                    <div key={seller.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold">{seller.name}</p>
                        <p className="text-sm text-muted-foreground">{seller.email}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Farm: {seller.farmName} • {seller.district}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApproveSeller(seller.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          {t('admin.approve')}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRejectSeller(seller.id)}
                          className="text-destructive"
                        >
                          <XCircle className="mr-1 h-4 w-4" />
                          {t('admin.reject')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t('admin.allSellers')}</CardTitle>
                  <Button size="sm" variant="outline" onClick={() => exportToCSV(allSellers, 'sellers')}>
                    <Download className="mr-2 h-4 w-4" />
                    {t('admin.exportCSV')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable data={allSellers} columns={sellerColumns} searchPlaceholder={t('admin.searchSellers')} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            {pendingOrders.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('admin.ordersPendingVerification')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {pendingOrders.map((order) => (
                    <div key={order.id} className="flex items-start justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-semibold">Order #{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          Buyer: {order.buyerName} • Total: Rs. {order.total.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} items • {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedOrder(order);
                            setReceiptDialogOpen(true);
                          }}
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          {t('admin.viewReceipt')}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleMarkAsPaid(order.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="mr-1 h-4 w-4" />
                          {t('admin.markAsPaid')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>{t('admin.allOrders')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.buyerName} • Rs. {order.total.toFixed(2)}
                        </p>
                      </div>
                      <Badge
                        className={
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'paid'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-orange-100 text-orange-800'
                        }
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Categories Tab */}
          <TabsContent value="categories" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t('admin.productCategories')}</CardTitle>
                  <Button onClick={() => setCategoryDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('admin.addCategory')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {categories.map((category) => (
                    <Card key={category.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{category.icon}</span>
                            <div>
                              <p className="font-semibold">{category.name}</p>
                              <p className="text-xs text-muted-foreground">{category.slug}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => openEditCategoryDialog(category)}
                          >
                            <Edit className="mr-1 h-3 w-3" />
                            {t('common.edit')}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 text-destructive"
                            onClick={() => {
                              setSelectedCategory(category);
                              setDeleteCategoryDialogOpen(true);
                            }}
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            {t('common.delete')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agents Tab */}
          <TabsContent value="agents" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{t('admin.regionalAgents')}</CardTitle>
                  <Button size="sm" variant="outline" onClick={() => exportToCSV(allAgents, 'agents')}>
                    <Download className="mr-2 h-4 w-4" />
                    {t('admin.exportCSV')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <DataTable data={allAgents} columns={agentColumns} searchPlaceholder={t('admin.searchAgents')} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{t('admin.productsByCategory')}</CardTitle>
                    <Button size="sm" variant="outline" onClick={() => exportToCSV(salesByCategory, 'products-by-category')}>
                      <Download className="mr-2 h-4 w-4" />
                      {t('admin.export')}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salesByCategory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="products" fill="#2E7D32" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{t('admin.ordersByStatus')}</CardTitle>
                    <Button size="sm" variant="outline" onClick={() => exportToCSV(ordersByStatus, 'orders-by-status')}>
                      <Download className="mr-2 h-4 w-4" />
                      {t('admin.export')}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={ordersByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(entry) => entry.name}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {ordersByStatus.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>Create a new product category</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAddCategory)} className="space-y-4">
            <div>
              <Label htmlFor="name">Category Name *</Label>
              <Input id="name" {...register('name')} placeholder="Vegetables" />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="slug">Slug *</Label>
              <Input id="slug" {...register('slug')} placeholder="vegetables" />
              {errors.slug && <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>}
            </div>

            <div>
              <Label htmlFor="icon">Icon (Emoji) *</Label>
              <Input id="icon" {...register('icon')} placeholder="🥬" maxLength={2} />
              {errors.icon && <p className="text-sm text-destructive mt-1">{errors.icon.message}</p>}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCategoryDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Category</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={editCategoryDialogOpen} onOpenChange={setEditCategoryDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update category details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleEditCategory)} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Category Name *</Label>
              <Input id="edit-name" {...register('name')} />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="edit-slug">Slug *</Label>
              <Input id="edit-slug" {...register('slug')} />
              {errors.slug && <p className="text-sm text-destructive mt-1">{errors.slug.message}</p>}
            </div>

            <div>
              <Label htmlFor="edit-icon">Icon (Emoji) *</Label>
              <Input id="edit-icon" {...register('icon')} maxLength={2} />
              {errors.icon && <p className="text-sm text-destructive mt-1">{errors.icon.message}</p>}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditCategoryDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Category</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <AlertDialog open={deleteCategoryDialogOpen} onOpenChange={setDeleteCategoryDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the category "{selectedCategory?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCategory} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Receipt View Dialog */}
      <Dialog open={receiptDialogOpen} onOpenChange={setReceiptDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Receipt</DialogTitle>
            <DialogDescription>Order #{selectedOrder?.id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-2">Receipt File:</p>
              <p className="font-medium">{selectedOrder?.receiptUrl}</p>
              <p className="text-xs text-muted-foreground mt-2">(Receipt preview would appear here)</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm"><strong>Buyer:</strong> {selectedOrder?.buyerName}</p>
              <p className="text-sm"><strong>Total Amount:</strong> Rs. {selectedOrder?.total.toFixed(2)}</p>
              <p className="text-sm"><strong>Date:</strong> {selectedOrder && new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReceiptDialogOpen(false)}>
              Close
            </Button>
            <Button onClick={() => handleMarkAsPaid(selectedOrder?.id)} className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Paid
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
