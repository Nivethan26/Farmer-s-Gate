import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { RootState } from "@/store";
import { updateUserProfile } from "@/store/authSlice";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  MapPin,
  Phone,
  Mail,
  User,
  Banknote,
  Edit,
  Save,
  X,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

export const SellerProfile = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const isLoading = useAppSelector((state: RootState) => state.auth.loading);
  
  // Check if user exists and is a seller
  const seller = user?.role === 'seller' ? user : null;

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: seller?.name || "",
    phone: seller?.phone || "",
    address: seller?.address || "",
    district: seller?.district || "",
    farmName: seller?.farmName || "",
    bankName: seller?.bank?.bankName || "",
    branch: seller?.bank?.branch || "",
    accountName: seller?.bank?.accountName || "",
    accountNo: seller?.bank?.accountNo || "",
  });

  // Update form when seller data changes
  useEffect(() => {
    if (seller) {
      setForm({
        name: seller.name || "",
        phone: seller.phone || "",
        address: seller.address || "",
        district: seller.district || "",
        farmName: seller.farmName || "",
        bankName: seller.bank?.bankName || "",
        branch: seller.bank?.branch || "",
        accountName: seller.bank?.accountName || "",
        accountNo: seller.bank?.accountNo || "",
      });
    }
  }, [seller]);

  if (!seller) {
    return (
      <Card className="border-gray-200 shadow-lg overflow-hidden">
        <CardContent className="p-12 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6">
            <User className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Seller Profile Not Available
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Please log in as a seller to view your profile information.
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!form.name.trim()) {
        toast.error("Name is required");
        return;
      }
      
      // Only include fields that have actually changed
      const updateData: any = {};
      
      if (form.name !== seller?.name) updateData.name = form.name;
      if (form.phone !== seller?.phone) updateData.phone = form.phone;
      if (form.address !== seller?.address) updateData.address = form.address;
      if (form.district !== seller?.district) updateData.district = form.district;
      if (form.farmName !== seller?.farmName) updateData.farmName = form.farmName;

      // Handle bank fields - only send bank object if any bank field has changed
      const bankChanged = 
        form.bankName !== seller?.bank?.bankName ||
        form.branch !== seller?.bank?.branch ||
        form.accountName !== seller?.bank?.accountName ||
        form.accountNo !== seller?.bank?.accountNo;

      if (bankChanged) {
        updateData.bank = {
          bankName: form.bankName,
          branch: form.branch,
          accountName: form.accountName,
          accountNo: form.accountNo,
        };
      }

      // Only make API call if there are actual changes
      if (Object.keys(updateData).length === 0) {
        toast.info("No changes to save");
        setEditMode(false);
        return;
      }

      const result = await dispatch(updateUserProfile(updateData));
      
      if (updateUserProfile.fulfilled.match(result)) {
        toast.success("Profile updated successfully!");
        setEditMode(false);
      } else {
        throw new Error(result.payload as string);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    if (seller) {
      setForm({
        name: seller.name || "",
        phone: seller.phone || "",
        address: seller.address || "",
        district: seller.district || "",
        farmName: seller.farmName || "",
        bankName: seller.bank?.bankName || "",
        branch: seller.bank?.branch || "",
        accountName: seller.bank?.accountName || "",
        accountNo: seller.bank?.accountNo || "",
      });
    }
    setEditMode(false);
  };

  const getStatusConfig = (status?: string) => {
    switch (status) {
      case "active":
        return {
          color: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200",
          textColor: "text-green-700",
          icon: <CheckCircle className="h-4 w-4" />,
          label: "Active",
        };
      case "pending":
        return {
          color: "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200",
          textColor: "text-amber-700",
          icon: <AlertCircle className="h-4 w-4" />,
          label: "Pending",
        };
      case "suspended":
        return {
          color: "bg-gradient-to-r from-red-50 to-rose-50 border-red-200",
          textColor: "text-red-700",
          icon: <Shield className="h-4 w-4" />,
          label: "Suspended",
        };
      default:
        return {
          color: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200",
          textColor: "text-green-700",
          icon: <CheckCircle className="h-4 w-4" />,
          label: "Active",
        };
    }
  };

  const statusConfig = getStatusConfig((seller as any).status || "active");

  return (
    <div className="max-w-5xl mx-auto">
      <Card className="border-gray-200 shadow-xl overflow-hidden bg-gradient-to-br from-white to-gray-50/50">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-emerald-600">
          <CardHeader className="text-white">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold">
                    Seller Profile
                  </CardTitle>
                  <p className="text-blue-100 mt-1">
                    Manage your seller information
                  </p>
                </div>
              </div>
              <Badge
                className={`px-4 py-2 ${statusConfig.color} ${statusConfig.textColor} border shadow-sm flex items-center gap-2`}
              >
                {statusConfig.icon}
                <span className="font-semibold">{statusConfig.label}</span>
              </Badge>
            </div>
          </CardHeader>
        </div>

        <CardContent className="p-8">
          {/* Profile Overview */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-1 bg-gradient-to-b from-blue-500 to-emerald-500 rounded-full"></div>
              <h3 className="text-lg font-bold text-gray-900">
                Personal Information
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[
                {
                  label: "Full Name",
                  value: form.name,
                  name: "name",
                  icon: <User className="h-5 w-5 text-blue-500" />,
                  disabled: !editMode,
                },
                {
                  label: "Farm Name",
                  value: form.farmName,
                  name: "farmName",
                  icon: <Building className="h-5 w-5 text-emerald-500" />,
                  disabled: !editMode,
                },
                {
                  label: "Email",
                  value: seller.email,
                  name: "email",
                  icon: <Mail className="h-5 w-5 text-purple-500" />,
                  disabled: true,
                },
                {
                  label: "Phone Number",
                  value: form.phone,
                  name: "phone",
                  icon: <Phone className="h-5 w-5 text-amber-500" />,
                  disabled: !editMode,
                },
                {
                  label: "District",
                  value: form.district,
                  name: "district",
                  icon: <MapPin className="h-5 w-5 text-green-500" />,
                  disabled: !editMode,
                },
                {
                  label: "Address",
                  value: form.address,
                  name: "address",
                  icon: <MapPin className="h-5 w-5 text-rose-500" />,
                  disabled: !editMode,
                  fullWidth: true,
                },
              ].map((field, index) => (
                <div
                  key={index}
                  className={field.fullWidth ? "lg:col-span-2" : ""}
                >
                  <Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <div className="p-1.5 bg-gray-100 rounded-lg">
                      {field.icon}
                    </div>
                    {field.label}
                  </Label>
                  <div className="relative">
                    <Input
                      name={field.name}
                      value={field.value || ""}
                      onChange={field.disabled ? undefined : handleChange}
                      disabled={field.disabled || isLoading}
                      readOnly={field.disabled}
                      className={`h-12 rounded-lg border-gray-300 ${
                        field.disabled
                          ? "bg-gray-50 text-gray-600"
                          : "bg-white hover:border-blue-400 focus:border-blue-500"
                      } ${editMode && field.name && !field.disabled ? "ring-1 ring-blue-300" : ""}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bank Details */}
          <div className="mb-10 pt-10 border-t border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-1 bg-gradient-to-b from-amber-500 to-orange-500 rounded-full"></div>
              <h3 className="text-lg font-bold text-gray-900">
                Banking Information
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[
                {
                  label: "Bank Name",
                  value: form.bankName,
                  name: "bankName",
                  disabled: !editMode,
                },
                {
                  label: "Branch",
                  value: form.branch,
                  name: "branch",
                  disabled: !editMode,
                },
                {
                  label: "Account Name",
                  value: form.accountName,
                  name: "accountName",
                  disabled: !editMode,
                },
                {
                  label: "Account Number",
                  value: form.accountNo,
                  name: "accountNo",
                  disabled: !editMode,
                },
              ].map((field, index) => (
                <div key={index}>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <div className="p-1.5 bg-gray-100 rounded-lg">
                      <Banknote className="h-4 w-4 text-amber-500" />
                    </div>
                    {field.label}
                  </Label>
                  <Input
                    name={field.name}
                    value={field.value || ""}
                    onChange={field.disabled ? undefined : handleChange}
                    disabled={field.disabled || isLoading}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    className={`h-12 rounded-lg border-gray-300 ${
                      field.disabled
                        ? "bg-gray-50 text-gray-600"
                        : "bg-white hover:border-blue-400 focus:border-blue-500"
                    } ${editMode && field.name && !field.disabled ? "ring-1 ring-blue-300" : ""}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-10 border-t border-gray-100">
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              {editMode ? (
                <>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="h-12 px-6 rounded-lg border-gray-300 hover:border-gray-400 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <X className="h-5 w-5" />
                    <span className="font-medium">Cancel</span>
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="h-12 px-8 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="font-semibold">Updating...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        <span className="font-semibold">Save Changes</span>
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setEditMode(true)}
                  disabled={isLoading}
                  className="h-12 px-8 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow hover:shadow-md transition-all duration-300 flex items-center gap-2"
                >
                  <Edit className="h-5 w-5" />
                  <span className="font-semibold">
                    Edit Profile
                  </span>
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};