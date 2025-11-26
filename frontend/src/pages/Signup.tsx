import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Sprout,
  Sun,
  Leaf,
  Wheat,
  User,
  Users,
  Shield,
  BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const buyerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  district: z.string().min(1, "District is required"),
  address: z.string().min(5, "Address is required"),
});

const sellerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  farmName: z.string().min(2, "Farm name is required"),
  district: z.string().min(1, "District is required"),
  address: z.string().min(5, "Address is required"),
  bankAccountName: z.string().min(2, "Account name is required"),
  bankAccountNo: z.string().min(5, "Account number is required"),
  bankName: z.string().min(2, "Bank name is required"),
  bankBranch: z.string().min(2, "Branch is required"),
});

type BuyerFormData = z.infer<typeof buyerSchema>;
type SellerFormData = z.infer<typeof sellerSchema>;

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("buyer");
  const [isLoading, setIsLoading] = useState(false);

  const buyerForm = useForm<BuyerFormData>({
    resolver: zodResolver(buyerSchema),
  });

  const sellerForm = useForm<SellerFormData>({
    resolver: zodResolver(sellerSchema),
  });

  const onBuyerSubmit = async (data: BuyerFormData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Buyer signup:", data);
    toast.success(t("auth.buyerAccountCreated"));
    setIsLoading(false);
    navigate("/login");
  };

  const onSellerSubmit = async (data: SellerFormData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log("Seller signup:", data);
    toast.success(t("auth.sellerApplicationSubmitted"));
    setIsLoading(false);
    navigate("/login");
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-amber-50 to-green-50 p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-green-200 rounded-full opacity-20 animate-pulse-slow"></div>
        <div
          className="absolute -bottom-32 -right-32 w-80 h-80 bg-amber-200 rounded-full opacity-30 animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/4 right-32 opacity-10 animate-float">
          <Wheat className="h-32 w-32 text-amber-600" />
        </div>
        <div className="absolute bottom-1/4 left-32 opacity-10 animate-float-delayed">
          <Leaf className="h-28 w-28 text-green-600" />
        </div>
        <div className="absolute top-40 left-40 opacity-5 animate-spin-slow">
          <Sun className="h-24 w-24 text-amber-400" />
        </div>
      </div>

      {/* Main Card */}
      <Card className="w-full max-w-4xl bg-white/80 backdrop-blur-sm border-green-200 shadow-2xl animate-fade-in-up z-20">
        <CardHeader className="text-center space-y-4 pb-6">
          {/* Animated Logo */}
          <div className="flex justify-center mb-2">
            <div className="relative">
              <div className="rounded-full bg-gradient-to-br from-green-500 to-emerald-600 p-4 shadow-lg transform hover:scale-105 transition-transform duration-300">
                <a href="/">
                  {" "}
                  <Sprout className="h-8 w-8 text-white animate-pulse" />{" "}
                </a>
              </div>
              <div className="absolute -top-2 -right-2">
                <Sun className="h-6 w-6 text-amber-500 animate-spin-slow" />
              </div>
            </div>
          </div>

          <CardTitle className="text-3xl font-bold font-poppins text-green-800 tracking-tight">
            {t("auth.joinTitle")}
          </CardTitle>
          <CardDescription className="text-green-600 text-lg">
            {t("auth.createAccount")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-green-100 p-1 rounded-xl border border-green-200">
              <TabsTrigger
                value="buyer"
                className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-green-200 rounded-lg transition-all duration-300"
              >
                <User className="h-4 w-4" />
                <span>{t("auth.buyer")}</span>
              </TabsTrigger>
              <TabsTrigger
                value="seller"
                className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-green-200 rounded-lg transition-all duration-300"
              >
                <Users className="h-4 w-4" />
                <span>{t("auth.farmerSeller")}</span>
              </TabsTrigger>
            </TabsList>

            {/* Buyer Signup */}
            <TabsContent value="buyer" className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-3">
                  <div className="rounded-full bg-blue-100 p-3">
                    <User className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-green-800">
                  Join as a Buyer
                </h3>
                <p className="text-green-600">
                  Purchase fresh produce directly from local farmers
                </p>
              </div>

              <form
                onSubmit={buyerForm.handleSubmit(onBuyerSubmit)}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label
                      htmlFor="buyer-name"
                      className="text-green-800 font-semibold"
                    >
                      {t("profile.name")} *
                    </Label>
                    <Input
                      id="buyer-name"
                      {...buyerForm.register("name")}
                      placeholder="John Doe"
                      className="border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                      disabled={isLoading}
                    />
                    {buyerForm.formState.errors.name && (
                      <p className="text-sm text-red-600 mt-1">
                        {buyerForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="buyer-email"
                      className="text-green-800 font-semibold"
                    >
                      {t("common.email")} *
                    </Label>
                    <Input
                      id="buyer-email"
                      type="email"
                      {...buyerForm.register("email")}
                      placeholder="john@example.com"
                      className="border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                      disabled={isLoading}
                    />
                    {buyerForm.formState.errors.email && (
                      <p className="text-sm text-red-600 mt-1">
                        {buyerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label
                      htmlFor="buyer-password"
                      className="text-green-800 font-semibold"
                    >
                      {t("common.password")} *
                    </Label>
                    <Input
                      id="buyer-password"
                      type="password"
                      {...buyerForm.register("password")}
                      placeholder="••••••••"
                      className="border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                      disabled={isLoading}
                    />
                    {buyerForm.formState.errors.password && (
                      <p className="text-sm text-red-600 mt-1">
                        {buyerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="buyer-phone"
                      className="text-green-800 font-semibold"
                    >
                      {t("profile.phone")} *
                    </Label>
                    <Input
                      id="buyer-phone"
                      {...buyerForm.register("phone")}
                      placeholder="+94771234567"
                      className="border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                      disabled={isLoading}
                    />
                    {buyerForm.formState.errors.phone && (
                      <p className="text-sm text-red-600 mt-1">
                        {buyerForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="buyer-district"
                    className="text-green-800 font-semibold"
                  >
                    {t("profile.district")} *
                  </Label>
                  <Input
                    id="buyer-district"
                    {...buyerForm.register("district")}
                    placeholder="Colombo"
                    className="border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                    disabled={isLoading}
                  />
                  {buyerForm.formState.errors.district && (
                    <p className="text-sm text-red-600 mt-1">
                      {buyerForm.formState.errors.district.message}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="buyer-address"
                    className="text-green-800 font-semibold"
                  >
                    {t("profile.address")} *
                  </Label>
                  <Textarea
                    id="buyer-address"
                    {...buyerForm.register("address")}
                    placeholder="123 Main Street, Colombo"
                    className="border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 min-h-[80px]"
                    disabled={isLoading}
                  />
                  {buyerForm.formState.errors.address && (
                    <p className="text-sm text-red-600 mt-1">
                      {buyerForm.formState.errors.address.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 rounded-lg transform hover:scale-[1.02] transition-all duration-300 shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Creating Account...</span>
                    </div>
                  ) : (
                    t("auth.createBuyerAccount")
                  )}
                </Button>
              </form>
            </TabsContent>

            {/* Seller Signup */}
            <TabsContent value="seller" className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-3">
                  <div className="rounded-full bg-green-100 p-3">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-green-800">
                  Join as a Farmer/Seller
                </h3>
                <p className="text-green-600">
                  Sell your fresh produce directly to buyers nationwide
                </p>
              </div>

              <form
                onSubmit={sellerForm.handleSubmit(onSellerSubmit)}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label
                      htmlFor="seller-name"
                      className="text-green-800 font-semibold"
                    >
                      {t("profile.name")} *
                    </Label>
                    <Input
                      id="seller-name"
                      {...sellerForm.register("name")}
                      placeholder="Nimal Perera"
                      className="border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                      disabled={isLoading}
                    />
                    {sellerForm.formState.errors.name && (
                      <p className="text-sm text-red-600 mt-1">
                        {sellerForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="seller-email"
                      className="text-green-800 font-semibold"
                    >
                      {t("common.email")} *
                    </Label>
                    <Input
                      id="seller-email"
                      type="email"
                      {...sellerForm.register("email")}
                      placeholder="nimal@farm.lk"
                      className="border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                      disabled={isLoading}
                    />
                    {sellerForm.formState.errors.email && (
                      <p className="text-sm text-red-600 mt-1">
                        {sellerForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label
                      htmlFor="seller-password"
                      className="text-green-800 font-semibold"
                    >
                      {t("common.password")} *
                    </Label>
                    <Input
                      id="seller-password"
                      type="password"
                      {...sellerForm.register("password")}
                      placeholder="••••••••"
                      className="border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                      disabled={isLoading}
                    />
                    {sellerForm.formState.errors.password && (
                      <p className="text-sm text-red-600 mt-1">
                        {sellerForm.formState.errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="seller-phone"
                      className="text-green-800 font-semibold"
                    >
                      {t("profile.phone")} *
                    </Label>
                    <Input
                      id="seller-phone"
                      {...sellerForm.register("phone")}
                      placeholder="+94771234567"
                      className="border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                      disabled={isLoading}
                    />
                    {sellerForm.formState.errors.phone && (
                      <p className="text-sm text-red-600 mt-1">
                        {sellerForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label
                      htmlFor="seller-farmName"
                      className="text-green-800 font-semibold"
                    >
                      {t("profile.farmName")} *
                    </Label>
                    <Input
                      id="seller-farmName"
                      {...sellerForm.register("farmName")}
                      placeholder="Green Valley Farms"
                      className="border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                      disabled={isLoading}
                    />
                    {sellerForm.formState.errors.farmName && (
                      <p className="text-sm text-red-600 mt-1">
                        {sellerForm.formState.errors.farmName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="seller-district"
                      className="text-green-800 font-semibold"
                    >
                      {t("profile.district")} *
                    </Label>
                    <Input
                      id="seller-district"
                      {...sellerForm.register("district")}
                      placeholder="Nuwara Eliya"
                      className="border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                      disabled={isLoading}
                    />
                    {sellerForm.formState.errors.district && (
                      <p className="text-sm text-red-600 mt-1">
                        {sellerForm.formState.errors.district.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="seller-address"
                    className="text-green-800 font-semibold"
                  >
                    {t("auth.farmAddress")} *
                  </Label>
                  <Textarea
                    id="seller-address"
                    {...sellerForm.register("address")}
                    placeholder="Ramboda Road, Nuwara Eliya"
                    className="border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 min-h-[80px]"
                    disabled={isLoading}
                  />
                  {sellerForm.formState.errors.address && (
                    <p className="text-sm text-red-600 mt-1">
                      {sellerForm.formState.errors.address.message}
                    </p>
                  )}
                </div>

                {/* Bank Details Section */}
                <div className="border-t border-green-200 pt-6 mt-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Shield className="h-5 w-5 text-green-600" />
                    <h3 className="font-bold text-green-800 text-lg">
                      {t("profile.bankDetails")}
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label
                        htmlFor="seller-bankAccountName"
                        className="text-green-800 font-semibold"
                      >
                        {t("profile.accountName")} *
                      </Label>
                      <Input
                        id="seller-bankAccountName"
                        {...sellerForm.register("bankAccountName")}
                        placeholder="Nimal Perera"
                        className="border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                        disabled={isLoading}
                      />
                      {sellerForm.formState.errors.bankAccountName && (
                        <p className="text-sm text-red-600 mt-1">
                          {sellerForm.formState.errors.bankAccountName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="seller-bankAccountNo"
                        className="text-green-800 font-semibold"
                      >
                        {t("profile.accountNumber")} *
                      </Label>
                      <Input
                        id="seller-bankAccountNo"
                        {...sellerForm.register("bankAccountNo")}
                        placeholder="1234567890"
                        className="border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                        disabled={isLoading}
                      />
                      {sellerForm.formState.errors.bankAccountNo && (
                        <p className="text-sm text-red-600 mt-1">
                          {sellerForm.formState.errors.bankAccountNo.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="seller-bankName"
                        className="text-green-800 font-semibold"
                      >
                        {t("profile.bankName")} *
                      </Label>
                      <Input
                        id="seller-bankName"
                        {...sellerForm.register("bankName")}
                        placeholder="Bank of Ceylon"
                        className="border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                        disabled={isLoading}
                      />
                      {sellerForm.formState.errors.bankName && (
                        <p className="text-sm text-red-600 mt-1">
                          {sellerForm.formState.errors.bankName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <Label
                        htmlFor="seller-bankBranch"
                        className="text-green-800 font-semibold"
                      >
                        {t("profile.branch")} *
                      </Label>
                      <Input
                        id="seller-bankBranch"
                        {...sellerForm.register("bankBranch")}
                        placeholder="Nuwara Eliya"
                        className="border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                        disabled={isLoading}
                      />
                      {sellerForm.formState.errors.bankBranch && (
                        <p className="text-sm text-red-600 mt-1">
                          {sellerForm.formState.errors.bankBranch.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold py-3 rounded-lg transform hover:scale-[1.02] transition-all duration-300 shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Submitting Application...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <BadgeCheck className="h-4 w-4" />
                      <span>{t("auth.submitSellerApplication")}</span>
                    </div>
                  )}
                </Button>
                <p className="text-xs text-green-600 text-center">
                  {t("auth.applicationReview")}
                </p>
              </form>
            </TabsContent>
          </Tabs>

          <div className="text-center pt-6 border-t border-green-100">
            <p className="text-green-700">
              {t("auth.alreadyHaveAccount")}{" "}
              <Link
                to="/login"
                className="text-emerald-600 hover:text-emerald-800 font-bold underline-offset-4 hover:underline transition-all duration-300"
              >
                {t("auth.signIn")}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes float-delayed {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.2;
          }
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
    <Footer />
    </>
  );
};

export default Signup;
