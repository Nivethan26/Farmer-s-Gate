import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { authAPI } from "@/services/authService";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sprout,
  Sun,
  Leaf,
  Wheat,
  User,
  BadgeCheck,
  Fingerprint,
  Mail,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

// NIC validation regex for Sri Lankan NIC formats (old: 9 digits with optional V, new: 12 digits)
const nicRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/;

// Sri Lankan districts
const SRI_LANKAN_DISTRICTS = [
  "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Colombo",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Monaragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya",
];

const buyerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    nic: z
      .string()
      .regex(
        nicRegex,
        "Please enter a valid NIC (9 digits with V/X or 12 digits)",
      ),
    district: z.string().min(1, "District is required"),
    address: z.string().min(5, "Address is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type BuyerFormData = z.infer<typeof buyerSchema>;

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [otpError, setOtpError] = useState("");

  const buyerForm = useForm<BuyerFormData>({
    resolver: zodResolver(buyerSchema),
  });

  const onBuyerSubmit = async (data: BuyerFormData) => {
    setIsLoading(true);
    try {
      // Initiate registration - sends OTP
      await authAPI.initiateRegistration({
        role: "buyer",
        email: data.email,
        password: data.password,
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        nic: data.nic,
        district: data.district,
        address: data.address,
      });

      setUserEmail(data.email);
      setShowOTPModal(true);
      toast.success(
        "OTP sent to your email. Please verify to complete registration.",
      );
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setOtpError("Please enter the complete 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    setOtpError("");

    try {
      const response = await authAPI.verifyRegistrationOTP({
        email: userEmail,
        otp: otp,
      });

      toast.success("Registration successful! You can now log in.");
      setShowOTPModal(false);
      navigate("/login");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Invalid OTP";
      setOtpError(errorMessage);
      setOtp("");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      await authAPI.resendRegistrationOTP({ email: userEmail });
      toast.success("OTP resent to your email");
      setOtp("");
      setOtpError("");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to resend OTP";
      toast.error(errorMessage);
    }
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
            {/* Buyer Registration Form */}
            <div className="space-y-6 animate-fade-in">
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
                <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-700">
                    Want to sell your produce?{" "}
                    <button
                      onClick={() => navigate("/seller-registration")}
                      className="font-bold text-green-600 hover:text-green-800 underline"
                    >
                      Register as Seller
                    </button>
                  </p>
                </div>
              </div>

              <form
                onSubmit={buyerForm.handleSubmit(onBuyerSubmit)}
                className="space-y-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label
                      htmlFor="buyer-firstName"
                      className="text-green-800 font-semibold"
                    >
                      {t("profile.firstName")} *
                    </Label>
                    <Input
                      id="buyer-firstName"
                      {...buyerForm.register("firstName")}
                      placeholder="John"
                      className="border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                      disabled={isLoading}
                    />
                    {buyerForm.formState.errors.firstName && (
                      <p className="text-sm text-red-600 mt-1">
                        {buyerForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="buyer-lastName"
                      className="text-green-800 font-semibold"
                    >
                      {t("profile.lastName")} *
                    </Label>
                    <Input
                      id="buyer-lastName"
                      {...buyerForm.register("lastName")}
                      placeholder="Doe"
                      className="border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                      disabled={isLoading}
                    />
                    {buyerForm.formState.errors.lastName && (
                      <p className="text-sm text-red-600 mt-1">
                        {buyerForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      htmlFor="buyer-confirmPassword"
                      className="text-green-800 font-semibold"
                    >
                      Confirm Password *
                    </Label>
                    <Input
                      id="buyer-confirmPassword"
                      type="password"
                      {...buyerForm.register("confirmPassword")}
                      placeholder="••••••••"
                      className="border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                      disabled={isLoading}
                    />
                    {buyerForm.formState.errors.confirmPassword && (
                      <p className="text-sm text-red-600 mt-1">
                        {buyerForm.formState.errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label
                      htmlFor="buyer-nic"
                      className="text-green-800 font-semibold flex items-center gap-2"
                    >
                      {t("profile.nic")} *
                    </Label>
                    <Input
                      id="buyer-nic"
                      {...buyerForm.register("nic")}
                      placeholder="123456789V or 123456789012"
                      className="border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300"
                      disabled={isLoading}
                    />
                    {buyerForm.formState.errors.nic && (
                      <p className="text-sm text-red-600 mt-1">
                        {buyerForm.formState.errors.nic.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="buyer-district"
                      className="text-green-800 font-semibold"
                    >
                      {t("profile.district")} *
                    </Label>
                    <Select
                      value={buyerForm.watch("district")}
                      onValueChange={(value) =>
                        buyerForm.setValue("district", value)
                      }
                      disabled={isLoading}
                    >
                      <SelectTrigger className="border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300">
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {SRI_LANKAN_DISTRICTS.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {buyerForm.formState.errors.district && (
                      <p className="text-sm text-red-600 mt-1">
                        {buyerForm.formState.errors.district.message}
                      </p>
                    )}
                  </div>
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
            </div>

            {/* Seller Registration Redirect Notice */}
            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg mb-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="rounded-full bg-green-100 p-4">
                    <BadgeCheck className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">
                    Are you a Farmer/Seller?
                  </h3>
                  <p className="text-green-700 mb-4">
                    Use our dedicated seller registration with enhanced
                    features:
                  </p>
                  <ul className="text-sm text-green-600 space-y-1 mb-4">
                    <li>✓ Email verification with OTP</li>
                    <li>✓ Admin approval for quality assurance</li>
                    <li>✓ Secure bank account setup</li>
                    <li>✓ Email notifications at every step</li>
                  </ul>
                </div>
                <Button
                  type="button"
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                  onClick={() => navigate("/seller-registration")}
                >
                  Proceed to Seller Registration
                </Button>
              </div>
            </div>

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

        {/* OTP Verification Modal */}
        <Dialog open={showOTPModal} onOpenChange={setShowOTPModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 rounded-full bg-green-100">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <DialogTitle className="text-center text-2xl">
                Verify Your Email
              </DialogTitle>
              <DialogDescription className="text-center">
                We've sent a 6-digit OTP to <strong>{userEmail}</strong>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div>
                <Label htmlFor="otp" className="sr-only">
                  Enter OTP
                </Label>
                <Input
                  id="otp"
                  type="text"
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setOtp(value);
                    setOtpError("");
                  }}
                  className="text-center text-2xl tracking-widest font-mono"
                  disabled={isVerifying}
                />
              </div>

              {otpError && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{otpError}</p>
                </div>
              )}

              <Button
                onClick={handleVerifyOTP}
                disabled={otp.length !== 6 || isVerifying}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                {isVerifying ? "Verifying..." : "Verify OTP"}
              </Button>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Didn't receive the code?
                </p>
                <Button
                  type="button"
                  variant="link"
                  onClick={handleResendOTP}
                  className="text-green-600 hover:text-green-700"
                >
                  Resend OTP
                </Button>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm text-green-800">
                  <p className="font-medium mb-1">✓ What happens next?</p>
                  <p className="text-xs">
                    After verification, you can immediately log in and start
                    shopping for fresh produce!
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

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
