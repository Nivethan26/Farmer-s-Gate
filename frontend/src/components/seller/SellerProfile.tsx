import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/store/hooks";
import { RootState } from "@/store";
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
} from "lucide-react";

export const SellerProfile = () => {
  const { t } = useTranslation();
  const sellerId = useAppSelector((s: RootState) => s.auth.user?.id);
  
  const seller = useAppSelector((s: RootState) =>
    s.users.sellers.find((sel) => sel.id === sellerId)
  );

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: seller?.name || "",
    phone: seller?.phone || "",
    address: seller?.address || "",
    farmName: seller?.farmName || "",
    bankName: seller?.bank?.bankName || "",
    branch: seller?.bank?.branch || "",
  });

  if (!seller) {
    return (
      <Card className="border-gray-200 shadow-lg overflow-hidden">
        <CardContent className="p-12 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6">
            <User className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {t("seller.profileNotFound")}
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            {t("seller.profileNotFoundDesc")}
          </p>
        </CardContent>
      </Card>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    console.log("Updated seller data:", form);
    setEditMode(false);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          color: "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200",
          textColor: "text-green-700",
          icon: <CheckCircle className="h-4 w-4" />,
          label: t("seller.active"),
        };
      case "pending":
        return {
          color: "bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200",
          textColor: "text-amber-700",
          icon: <AlertCircle className="h-4 w-4" />,
          label: t("seller.pending"),
        };
      case "suspended":
        return {
          color: "bg-gradient-to-r from-red-50 to-rose-50 border-red-200",
          textColor: "text-red-700",
          icon: <Shield className="h-4 w-4" />,
          label: t("seller.suspended"),
        };
      default:
        return {
          color: "bg-gray-50 border-gray-200",
          textColor: "text-gray-700",
          icon: null,
          label: status,
        };
    }
  };

  const statusConfig = getStatusConfig(seller.status);

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
                    {t("seller.profile.title")}
                  </CardTitle>
                  <p className="text-blue-100 mt-1">
                    {t("seller.profile.subtitlePremium")}
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
                {t("seller.profile.personalInfo")}
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[
                {
                  label: t("common.name"),
                  value: form.name,
                  name: "name",
                  icon: <User className="h-5 w-5 text-blue-500" />,
                  disabled: !editMode,
                },
                {
                  label: t("seller.profile.farmName"),
                  value: form.farmName,
                  name: "farmName",
                  icon: <Building className="h-5 w-5 text-emerald-500" />,
                  disabled: !editMode,
                },
                {
                  label: t("common.email"),
                  value: seller.email,
                  icon: <Mail className="h-5 w-5 text-purple-500" />,
                  disabled: true,
                },
                {
                  label: t("common.phone"),
                  value: form.phone,
                  name: "phone",
                  icon: <Phone className="h-5 w-5 text-amber-500" />,
                  disabled: !editMode,
                },
                {
                  label: t("common.address"),
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
                      value={field.value}
                      onChange={handleChange}
                      disabled={field.disabled}
                      className={`pl-12 h-12 rounded-lg border-gray-300 ${
                        field.disabled
                          ? "bg-gray-50 text-gray-600"
                          : "bg-white hover:border-blue-400 focus:border-blue-500"
                      } ${editMode && field.name ? "ring-1 ring-blue-300" : ""}`}
                    />
                    <div className="absolute left-3 top-1/2 -translate-y-1/2">
                      {field.icon}
                    </div>
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
                {t("seller.profile.bankDetails")}
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[
                {
                  label: t("seller.profile.bankName"),
                  value: form.bankName,
                  name: "bankName",
                  disabled: !editMode,
                },
                {
                  label: t("seller.profile.branch"),
                  value: form.branch,
                  name: "branch",
                  disabled: !editMode,
                },
                {
                  label: t("seller.profile.accountName"),
                  value: seller.bank?.accountName || "",
                  disabled: true,
                },
                {
                  label: t("seller.profile.accountNumber"),
                  value: seller.bank?.accountNo || "",
                  disabled: true,
                },
              ].map((field, index) => (
                <div key={index}>
                  <Label className="text-sm font-semibold text-gray-700 mb-2">
                    {field.label}
                  </Label>
                  <Input
                    name={field.name}
                    value={field.value}
                    onChange={handleChange}
                    disabled={field.disabled}
                    className={`h-12 rounded-lg border-gray-300 ${
                      field.disabled
                        ? "bg-gray-50 text-gray-600"
                        : "bg-white hover:border-blue-400 focus:border-blue-500"
                    } ${editMode && field.name ? "ring-1 ring-blue-300" : ""}`}
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
                    onClick={() => setEditMode(false)}
                    className="h-12 px-6 rounded-lg border-gray-300 hover:border-gray-400 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <X className="h-5 w-5" />
                    <span className="font-medium">{t("common.cancel")}</span>
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="h-12 px-8 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
                  >
                    <Save className="h-5 w-5" />
                    <span className="font-semibold">
                      {t("common.saveChanges")}
                    </span>
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setEditMode(true)}
                  className="h-12 px-8 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow hover:shadow-md transition-all duration-300 flex items-center gap-2"
                >
                  <Edit className="h-5 w-5" />
                  <span className="font-semibold">
                    {t("seller.profile.editProfile")}
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