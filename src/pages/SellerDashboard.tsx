import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import type { RootState } from '@/store';
import { selectSellerProducts } from '@/store/selectors';
import { addProduct, updateProduct, deleteProduct, type Product } from '@/store/catalogSlice';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Plus, Edit, Trash2, TrendingUp, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  category: z.string().min(1, 'Category is required'),
  pricePerKg: z.number().min(1, 'Price must be greater than 0'),
  supplyType: z.enum(['wholesale', 'small_scale']),
  locationDistrict: z.string().min(1, 'Location is required'),
  stockQty: z.number().min(1, 'Stock quantity is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  expiresOn: z.string().min(1, 'Expiry date is required'),
});

type ProductFormData = z.infer<typeof productSchema>;

const SellerDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const products = useAppSelector(selectSellerProducts);
  const categories = useAppSelector((state: RootState) => state.catalog.categories);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      supplyType: 'small_scale',
    },
  });

  const supplyType = watch('supplyType');
  const category = watch('category');

  const handleAddProduct = (data: ProductFormData) => {
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: data.name,
      category: data.category,
      pricePerKg: data.pricePerKg,
      supplyType: data.supplyType,
      locationDistrict: data.locationDistrict,
      stockQty: data.stockQty,
      description: data.description,
      expiresOn: data.expiresOn,
      sellerId: user!.id,
      sellerName: user!.name,
      image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400',
      createdAt: new Date().toISOString(),
    };

    dispatch(addProduct(newProduct));
    toast.success(t('seller.productAdded'));
    setAddDialogOpen(false);
    reset();
  };

  const handleEditProduct = (data: ProductFormData) => {
    if (!selectedProduct) return;

    const updatedProduct = {
      ...selectedProduct,
      ...data,
    };

    dispatch(updateProduct(updatedProduct));
    toast.success(t('seller.productUpdated'));
    setEditDialogOpen(false);
    setSelectedProduct(null);
    reset();
  };

  const handleDeleteProduct = () => {
    if (!selectedProduct) return;

    dispatch(deleteProduct(selectedProduct.id));
    toast.success(t('seller.productDeleted'));
    setDeleteDialogOpen(false);
    setSelectedProduct(null);
  };

  const openEditDialog = (product: any) => {
    setSelectedProduct(product);
    setValue('name', product.name);
    setValue('category', product.category);
    setValue('pricePerKg', product.pricePerKg);
    setValue('supplyType', product.supplyType);
    setValue('locationDistrict', product.locationDistrict);
    setValue('stockQty', product.stockQty);
    setValue('description', product.description);
    setValue('expiresOn', product.expiresOn.split('T')[0]);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (product: any) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  const activeProducts = products.filter((p) => new Date(p.expiresOn) > new Date());
  const expiredProducts = products.filter((p) => new Date(p.expiresOn) <= new Date());
  const expiringSoon = products.filter((p) => {
    const daysUntilExpiry = (new Date(p.expiresOn).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return daysUntilExpiry > 0 && daysUntilExpiry <= 3;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-poppins mb-2">{t('seller.dashboard')}</h1>
          <p className="text-muted-foreground">{t('seller.welcomeBack')}, {user?.name}!</p>
        </div>

        <Tabs defaultValue="home" className="space-y-6">
          <TabsList>
            <TabsTrigger value="home">{t('seller.home')}</TabsTrigger>
            <TabsTrigger value="listings">{t('seller.myListings')}</TabsTrigger>
            <TabsTrigger value="analytics">{t('seller.analytics')}</TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('seller.activeListings')}</p>
                    <p className="text-2xl font-bold">{activeProducts.length}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-full bg-blue-100 p-3">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('seller.totalProducts')}</p>
                    <p className="text-2xl font-bold">{products.length}</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-full bg-orange-100 p-3">
                    <AlertCircle className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('seller.expiringSoon')}</p>
                    <p className="text-2xl font-bold">{expiringSoon.length}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Expiring Soon Alert */}
            {expiringSoon.length > 0 && (
              <Card className="border-orange-200 bg-orange-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-orange-900">{t('seller.productsExpiringSoon')}</p>
                      <p className="text-sm text-orange-700 mt-1">
                        {expiringSoon.length} {t('seller.willExpireWithin3Days')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('seller.quickActions')}</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setAddDialogOpen(true)} className="w-full md:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  {t('seller.addNewProduct')}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Listings Tab */}
          <TabsContent value="listings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{t('seller.myListings')}</h2>
              <Button onClick={() => setAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                {t('seller.addProduct')}
              </Button>
            </div>

            {products.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">{t('seller.noProducts')}</h3>
                  <p className="text-muted-foreground mb-4">{t('seller.addFirstProduct')}</p>
                  <Button onClick={() => setAddDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('seller.addProduct')}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {products.map((product) => {
                  const isExpired = new Date(product.expiresOn) <= new Date();
                  const daysUntilExpiry = (new Date(product.expiresOn).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
                  const isExpiringSoon = daysUntilExpiry > 0 && daysUntilExpiry <= 3;

                  return (
                    <Card key={product.id} className={isExpired ? 'opacity-60' : ''}>
                      <div className="aspect-video overflow-hidden rounded-t-lg">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold">{product.name}</h3>
                          {isExpired ? (
                            <Badge variant="destructive">{t('seller.expired')}</Badge>
                          ) : isExpiringSoon ? (
                            <Badge className="bg-orange-100 text-orange-800">{t('seller.expiringSoon')}</Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-800">{t('seller.active')}</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {product.locationDistrict} • {product.stockQty}kg
                        </p>
                        <p className="text-xl font-bold text-primary mb-3">
                          Rs. {product.pricePerKg}/kg
                        </p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => openEditDialog(product)}
                          >
                            <Edit className="mr-1 h-3 w-3" />
                            {t('common.edit')}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 text-destructive hover:text-destructive"
                            onClick={() => openDeleteDialog(product)}
                          >
                            <Trash2 className="mr-1 h-3 w-3" />
                            {t('common.delete')}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-1">{t('seller.totalProducts')}</p>
                  <p className="text-3xl font-bold">{products.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-1">{t('seller.active')}</p>
                  <p className="text-3xl font-bold text-green-600">{activeProducts.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-1">{t('seller.expired')}</p>
                  <p className="text-3xl font-bold text-red-600">{expiredProducts.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground mb-1">{t('seller.totalStock')}</p>
                  <p className="text-3xl font-bold">
                    {products.reduce((sum, p) => sum + p.stockQty, 0)} kg
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Product Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('seller.addNewProduct')}</DialogTitle>
            <DialogDescription>{t('seller.fillDetails')}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAddProduct)} className="space-y-4">
            <div>
              <Label htmlFor="name">{t('seller.productName')} {t('seller.required')}</Label>
              <Input id="name" {...register('name')} placeholder="Fresh Tomatoes" />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="category">{t('seller.category')} {t('seller.required')}</Label>
              <Select value={category} onValueChange={(value) => setValue('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t('seller.selectCategory')} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-sm text-destructive mt-1">{errors.category.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pricePerKg">{t('seller.pricePerKg')} {t('seller.required')}</Label>
                <Input
                  id="pricePerKg"
                  type="number"
                  {...register('pricePerKg', { valueAsNumber: true })}
                  placeholder="150"
                />
                {errors.pricePerKg && <p className="text-sm text-destructive mt-1">{errors.pricePerKg.message}</p>}
              </div>

              <div>
                <Label htmlFor="stockQty">{t('seller.stockQuantity')} {t('seller.required')}</Label>
                <Input
                  id="stockQty"
                  type="number"
                  {...register('stockQty', { valueAsNumber: true })}
                  placeholder="500"
                />
                {errors.stockQty && <p className="text-sm text-destructive mt-1">{errors.stockQty.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="supplyType">{t('seller.supplyType')} {t('seller.required')}</Label>
              <Select value={supplyType} onValueChange={(value: any) => setValue('supplyType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small_scale">{t('seller.smallScale')}</SelectItem>
                  <SelectItem value="wholesale">{t('seller.wholesale')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="locationDistrict">{t('seller.locationDistrict')} {t('seller.required')}</Label>
              <Input id="locationDistrict" {...register('locationDistrict')} placeholder="Nuwara Eliya" />
              {errors.locationDistrict && <p className="text-sm text-destructive mt-1">{errors.locationDistrict.message}</p>}
            </div>

            <div>
              <Label htmlFor="expiresOn">{t('seller.expiresOn')} {t('seller.required')}</Label>
              <Input id="expiresOn" type="date" {...register('expiresOn')} />
              {errors.expiresOn && <p className="text-sm text-destructive mt-1">{errors.expiresOn.message}</p>}
            </div>

            <div>
              <Label htmlFor="description">{t('seller.description')} {t('seller.required')}</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder={t('seller.describeProduct')}
                rows={3}
              />
              {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit">{t('seller.addProduct')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('seller.editProduct')}</DialogTitle>
            <DialogDescription>{t('seller.updateDetails')}</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleEditProduct)} className="space-y-4">
            <div>
              <Label htmlFor="edit-name">{t('seller.productName')} {t('seller.required')}</Label>
              <Input id="edit-name" {...register('name')} />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="edit-category">{t('seller.category')} {t('seller.required')}</Label>
              <Select value={category} onValueChange={(value) => setValue('category', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-pricePerKg">{t('seller.pricePerKg')} {t('seller.required')}</Label>
                <Input
                  id="edit-pricePerKg"
                  type="number"
                  {...register('pricePerKg', { valueAsNumber: true })}
                />
                {errors.pricePerKg && <p className="text-sm text-destructive mt-1">{errors.pricePerKg.message}</p>}
              </div>

              <div>
                <Label htmlFor="edit-stockQty">{t('seller.stockQuantity')} {t('seller.required')}</Label>
                <Input
                  id="edit-stockQty"
                  type="number"
                  {...register('stockQty', { valueAsNumber: true })}
                />
                {errors.stockQty && <p className="text-sm text-destructive mt-1">{errors.stockQty.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="edit-supplyType">{t('seller.supplyType')} {t('seller.required')}</Label>
              <Select value={supplyType} onValueChange={(value: any) => setValue('supplyType', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small_scale">{t('seller.smallScale')}</SelectItem>
                  <SelectItem value="wholesale">{t('seller.wholesale')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="edit-locationDistrict">{t('seller.locationDistrict')} {t('seller.required')}</Label>
              <Input id="edit-locationDistrict" {...register('locationDistrict')} />
              {errors.locationDistrict && <p className="text-sm text-destructive mt-1">{errors.locationDistrict.message}</p>}
            </div>

            <div>
              <Label htmlFor="edit-expiresOn">{t('seller.expiresOn')} {t('seller.required')}</Label>
              <Input id="edit-expiresOn" type="date" {...register('expiresOn')} />
              {errors.expiresOn && <p className="text-sm text-destructive mt-1">{errors.expiresOn.message}</p>}
            </div>

            <div>
              <Label htmlFor="edit-description">{t('seller.description')} {t('seller.required')}</Label>
              <Textarea id="edit-description" {...register('description')} rows={3} />
              {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit">{t('seller.editProduct')}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('seller.areYouSure')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('seller.deleteConfirmation')} "{selectedProduct?.name}". {t('seller.cannotBeUndone')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProduct} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SellerDashboard;
