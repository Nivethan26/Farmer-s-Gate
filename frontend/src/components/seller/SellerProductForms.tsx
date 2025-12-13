import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import type { RootState } from "@/store";
import { addProduct, updateProduct, type Product } from "@/store/catalogSlice";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Image as ImageIcon, Upload, X, Handshake } from "lucide-react";
import { toast } from "sonner";

// Extend the schema to include image and negotiationEnabled
const productSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  category: z.string().min(1, "Category is required"),
  pricePerKg: z.number().min(1, "Price must be greater than 0"),
  supplyType: z.enum(["wholesale", "small_scale"]),
  locationDistrict: z.string().min(1, "Location is required"),
  stockQty: z.number().min(1, "Stock quantity is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  expiresOn: z.string().min(1, "Expiry date is required"),
  imageUrl: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  negotiationEnabled: z.boolean().default(true),
});

type ProductFormData = z.infer<typeof productSchema>;

interface SellerProductFormsProps {
  addDialogOpen: boolean;
  editDialogOpen: boolean;
  selectedProduct: Product | null;
  onAddDialogChange: (open: boolean) => void;
  onEditDialogChange: (open: boolean) => void;
  onSuccess: (message: string) => void;
}

const SellerProductForms = ({
  addDialogOpen,
  editDialogOpen,
  selectedProduct,
  onAddDialogChange,
  onEditDialogChange,
  onSuccess,
}: SellerProductFormsProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const categories = useAppSelector(
    (state: RootState) => state.catalog.categories
  );

  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
    trigger,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      supplyType: "small_scale",
      name: "",
      category: "",
      pricePerKg: 0,
      locationDistrict: "",
      stockQty: 0,
      description: "",
      expiresOn: "",
      imageUrl: "",
      negotiationEnabled: true,
    },
  });

  const supplyType = watch("supplyType");
  const category = watch("category");
  const imageUrl = watch("imageUrl");
  const negotiationEnabled = watch("negotiationEnabled");

  // Reset form when dialogs close
  useEffect(() => {
    if (!addDialogOpen && !editDialogOpen) {
      reset();
      setImagePreview("");
    }
  }, [addDialogOpen, editDialogOpen, reset]);

  // Populate form when editing
  useEffect(() => {
    if (selectedProduct && editDialogOpen) {
      setValue("name", selectedProduct.name);
      setValue("category", selectedProduct.category);
      setValue("pricePerKg", selectedProduct.pricePerKg);
      setValue("supplyType", selectedProduct.supplyType);
      setValue("locationDistrict", selectedProduct.locationDistrict);
      setValue("stockQty", selectedProduct.stockQty);
      setValue("description", selectedProduct.description);
      setValue("expiresOn", selectedProduct.expiresOn.substring(0, 10));
      setValue("imageUrl", selectedProduct.image);
      setValue("negotiationEnabled", selectedProduct.negotiationEnabled);
      setImagePreview(selectedProduct.image);
    }
  }, [selectedProduct, editDialogOpen, setValue]);

  // Update image preview when URL changes
  useEffect(() => {
    if (imageUrl && imageUrl.startsWith("http")) {
      setImagePreview(imageUrl);
    }
  }, [imageUrl]);

  // Sample images for quick selection
  const sampleImages = [
    {
      name: "Vegetables",
      url: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400",
    },
    {
      name: "Fruits",
      url: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w-400",
    },
    {
      name: "Grains",
      url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
    },
    {
      name: "Spices",
      url: "https://images.unsplash.com/photo-1604586376807-f73185cf5867?w=400",
    },
    {
      name: "Default",
      url: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400",
    },
  ];

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
      image:
        data.imageUrl ||
        "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400",
      createdAt: new Date().toISOString(),
      negotiationEnabled: data.negotiationEnabled,
    };

    dispatch(addProduct(newProduct));
    onSuccess(t("seller.productAdded"));
    onAddDialogChange(false);
    reset();
    setImagePreview("");
  };

  const handleEditProduct = (data: ProductFormData) => {
    if (!selectedProduct) return;

    const updatedProduct = {
      ...selectedProduct,
      ...data,
      image: data.imageUrl || selectedProduct.image,
    };

    dispatch(updateProduct(updatedProduct));
    onSuccess(t("seller.productUpdated"));
    onEditDialogChange(false);
    reset();
    setImagePreview("");
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      // In a real app, you would upload to a server/cloud storage
      // For now, we'll create a local URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setValue("imageUrl", base64String);
        trigger("imageUrl");
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setImagePreview("");
    setValue("imageUrl", "");
  };

  const selectSampleImage = (url: string) => {
    setImagePreview(url);
    setValue("imageUrl", url);
    trigger("imageUrl");
  };

  const renderForm = (isEdit: boolean = false) => (
    <form
      onSubmit={handleSubmit(isEdit ? handleEditProduct : handleAddProduct)}
      className="space-y-4"
    >
      {/* Image Section */}
      <div className="space-y-3">
        <Label htmlFor="image">
          {t("seller.productimage")} {t("seller.required")}
        </Label>

        {/* Image Preview */}
        {imagePreview && (
          <div className="relative group">
            <div className="aspect-video overflow-hidden rounded-lg border bg-gray-50">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            </div>
            <Button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Upload Options */}
        <div className="space-y-3">
          {/* URL Input */}
          <div>
            <Input
              id="imageUrl"
              {...register("imageUrl")}
              placeholder="https://example.com/image.jpg"
              className="w-full"
            />
            {errors.imageUrl && (
              <p className="text-sm text-destructive mt-1">
                {errors.imageUrl.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              Enter image URL or upload from your device
            </p>
          </div>

          {/* File Upload */}
          <div>
            <Input
              type="file"
              id="file-upload"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isUploading}
            />
            <Label htmlFor="file-upload" className="cursor-pointer">
              <div className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                {isUploading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-green-600 border-t-transparent" />
                    <span>Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    <span>{t("seller.uploadImage")}</span>
                  </>
                )}
              </div>
            </Label>
          </div>

          {/* Sample Images */}
          <div>
            <p className="text-sm font-medium mb-2">
              Or select a sample image:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {sampleImages.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => selectSampleImage(img.url)}
                  className="relative aspect-square overflow-hidden rounded-lg border hover:border-green-500 hover:shadow-sm transition-all group"
                >
                  <img
                    src={img.url}
                    alt={img.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1 text-center truncate">
                    {img.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Rest of the form fields */}
      <div>
        <Label htmlFor="name">
          {t("seller.productName")} {t("seller.required")}
        </Label>
        <Input id="name" {...register("name")} placeholder="Fresh Tomatoes" />
        {errors.name && (
          <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="category">
          {t("seller.category")} {t("seller.required")}
        </Label>
        <Select
          value={category}
          onValueChange={(value) => setValue("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("seller.selectCategory")} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-destructive mt-1">
            {errors.category.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pricePerKg">
            {t("seller.pricePerKg")} {t("seller.required")}
          </Label>
          <Input
            id="pricePerKg"
            type="number"
            {...register("pricePerKg", { valueAsNumber: true })}
            placeholder="150"
          />
          {errors.pricePerKg && (
            <p className="text-sm text-destructive mt-1">
              {errors.pricePerKg.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="stockQty">
            {t("seller.stockQuantity")} {t("seller.required")}
          </Label>
          <Input
            id="stockQty"
            type="number"
            {...register("stockQty", { valueAsNumber: true })}
            placeholder="500"
          />
          {errors.stockQty && (
            <p className="text-sm text-destructive mt-1">
              {errors.stockQty.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="supplyType">
            {t("seller.supplyType")} {t("seller.required")}
          </Label>
          <Select
            value={supplyType}
            onValueChange={(value: any) => setValue("supplyType", value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small_scale">
                {t("seller.smallScale")}
              </SelectItem>
              <SelectItem value="wholesale">{t("seller.wholesale")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            <Handshake className="h-5 w-5 text-gray-500" />
            <div>
              <Label htmlFor="negotiationEnabled" className="font-medium">
                {t("seller.enableNegotiation")}
              </Label>
              <p className="text-xs text-muted-foreground">
                {t("seller.enableNegotiationInfo")}
              </p>
            </div>
          </div>
          <Switch
            id="negotiationEnabled"
            checked={negotiationEnabled}
            onCheckedChange={(checked) =>
              setValue("negotiationEnabled", checked)
            }
          />
        </div>
      </div>

      <div>
        <Label htmlFor="locationDistrict">
          {t("seller.locationDistrict")} {t("seller.required")}
        </Label>
        <Input
          id="locationDistrict"
          {...register("locationDistrict")}
          placeholder="Nuwara Eliya"
        />
        {errors.locationDistrict && (
          <p className="text-sm text-destructive mt-1">
            {errors.locationDistrict.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="expiresOn">
          {t("seller.expiresOn")} {t("seller.required")}
        </Label>
        <Input id="expiresOn" type="date" {...register("expiresOn")} />
        {errors.expiresOn && (
          <p className="text-sm text-destructive mt-1">
            {errors.expiresOn.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="description">
          {t("seller.description")} {t("seller.required")}
        </Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder={t("seller.describeProduct")}
          rows={3}
        />
        {errors.description && (
          <p className="text-sm text-destructive mt-1">
            {errors.description.message}
          </p>
        )}
      </div>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            isEdit ? onEditDialogChange(false) : onAddDialogChange(false)
          }
        >
          {t("common.cancel")}
        </Button>
        <Button type="submit" disabled={isUploading}>
          {isEdit ? t("seller.editProduct") : t("seller.addProduct")}
        </Button>
      </DialogFooter>
    </form>
  );

  return (
    <>
      {/* Add Product Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={onAddDialogChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("seller.addNewProduct")}</DialogTitle>
            <DialogDescription>{t("seller.fillDetails")}</DialogDescription>
          </DialogHeader>
          {renderForm(false)}
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={onEditDialogChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("seller.editProduct")}</DialogTitle>
            <DialogDescription>{t("seller.updateDetails")}</DialogDescription>
          </DialogHeader>
          {renderForm(true)}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SellerProductForms;
