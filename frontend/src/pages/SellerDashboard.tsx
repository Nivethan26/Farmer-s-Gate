import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store";
import { selectSellerProducts } from "@/store/selectors";
import { Navbar } from "@/components/layout/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import SellerStatsCards from "@/components/seller/SellerStatsCards";
import SellerProductList from "@/components/seller/SellerProductList";
import SellerProductForms from "@/components/seller/SellerProductForms";
import SellerDeleteDialog from "@/components/seller/SellerDeleteDialog";
import SellerNegotiationsTab from "@/components/seller/SellerNegotiationsTab";
import SellerAnalytics from "@/components/seller/SellerAnalytics";

const SellerDashboard = () => {
  const { t } = useTranslation();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const products = useAppSelector(selectSellerProducts);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const openEditDialog = (product: any) => {
    setSelectedProduct(product);
    setEditDialogOpen(true);
  };

  const openDeleteDialog = (product: any) => {
    setSelectedProduct(product);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-poppins mb-2">
            {t("seller.dashboard")}
          </h1>
          <p className="text-muted-foreground">
            {t("seller.welcomeBack")}, {user?.name}!
          </p>
        </div>

        <Tabs defaultValue="home" className="space-y-6">
          <TabsList>
            <TabsTrigger value="home">{t("seller.home")}</TabsTrigger>
            <TabsTrigger value="listings">{t("seller.myListings")}</TabsTrigger>
            <TabsTrigger value="analytics">{t("seller.analytics")}</TabsTrigger>
            <TabsTrigger value="negotiations">Negotiations</TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-6">
            <SellerStatsCards
              products={products}
              onAddProduct={() => setAddDialogOpen(true)}
            />
          </TabsContent>

          {/* Listings Tab */}
          <TabsContent value="listings" className="space-y-6">
            <SellerProductList
              products={products}
              onAddProduct={() => setAddDialogOpen(true)}
              onEditProduct={openEditDialog}
              onDeleteProduct={openDeleteDialog}
            />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <SellerAnalytics products={products} />
          </TabsContent>

          {/* Negotiations Tab */}
          <TabsContent value="negotiations" className="space-y-6">
            <SellerNegotiationsTab />
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialogs */}
      <SellerProductForms
        addDialogOpen={addDialogOpen}
        editDialogOpen={editDialogOpen}
        selectedProduct={selectedProduct}
        onAddDialogChange={setAddDialogOpen}
        onEditDialogChange={setEditDialogOpen}
        onSuccess={(message) => toast.success(message)}
      />

      <SellerDeleteDialog
        open={deleteDialogOpen}
        selectedProduct={selectedProduct}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={(message) => toast.success(message)}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default SellerDashboard;
