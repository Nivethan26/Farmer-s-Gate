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
import { SellerProfile } from "@/components/seller/SellerProfile";

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
          <TabsList className="flex flex-wrap gap-2 md:gap-0 border-b mb-20">
            <TabsTrigger value="home" className="flex-1 text-center">
              {t("seller.home")}
            </TabsTrigger>
            <TabsTrigger value="listings" className="flex-1 text-center">
              {t("seller.myListings")}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1 text-center">
              {t("seller.analytics")}
            </TabsTrigger>
            <TabsTrigger value="negotiations" className="flex-1 text-center">
              {t("seller.negotiations")}
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex-1 text-center">
              {t("seller.profile.title")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="space-y-6">
            <SellerStatsCards
              products={products}
              onAddProduct={() => setAddDialogOpen(true)}
            />
          </TabsContent>

          <TabsContent value="listings" className="space-y-6">
            <SellerProductList
              products={products}
              onAddProduct={() => setAddDialogOpen(true)}
              onEditProduct={openEditDialog}
              onDeleteProduct={openDeleteDialog}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <SellerAnalytics products={products} />
          </TabsContent>

          <TabsContent value="negotiations" className="space-y-6">
            <SellerNegotiationsTab />
          </TabsContent>
          <TabsContent value="profile" className="space-y-6">
            <SellerProfile />
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
