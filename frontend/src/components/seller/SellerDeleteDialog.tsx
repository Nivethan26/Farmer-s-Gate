import { useTranslation } from "react-i18next";
import { useAppDispatch } from "@/store/hooks";
import { deleteProduct } from "@/store/catalogSlice";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SellerDeleteDialogProps {
  open: boolean;
  selectedProduct: any;
  onOpenChange: (open: boolean) => void;
  onSuccess: (message: string) => void;
  onClose: () => void;
}

const SellerDeleteDialog = ({
  open,
  selectedProduct,
  onOpenChange,
  onSuccess,
  onClose,
}: SellerDeleteDialogProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const handleDeleteProduct = () => {
    if (!selectedProduct) return;

    dispatch(deleteProduct(selectedProduct.id));
    onSuccess(t("seller.productDeleted"));
    onOpenChange(false);
    onClose();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("seller.areYouSure")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("seller.deleteConfirmation")} "{selectedProduct?.name}".{" "}
            {t("seller.cannotBeUndone")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteProduct}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t("common.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SellerDeleteDialog;