import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import type { RootState } from "@/store";
import { login } from "@/store/authSlice";
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
import { Sprout, Sun, Leaf, Wheat } from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const user = useAppSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(`/${user.role}`, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const stateBefore = isAuthenticated;
    dispatch(login({ email, password }));

    setTimeout(() => {
      const stateAfter = isAuthenticated;
      if (!stateBefore && stateAfter) {
        toast.success(t("auth.loginSuccess"));
      } else if (!stateAfter) {
        toast.error(t("auth.invalidCredentials"));
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-amber-50 to-green-50 p-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-green-200 rounded-full opacity-20 animate-pulse-slow"></div>
        <div
          className="absolute -bottom-16 -right-16 w-40 h-40 bg-amber-200 rounded-full opacity-30 animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        ></div>
        <div className="absolute top-1/4 right-20 opacity-10 animate-float">
          <Wheat className="h-24 w-24 text-amber-600" />
        </div>
        <div className="absolute bottom-1/4 left-20 opacity-10 animate-float-delayed">
          <Leaf className="h-20 w-20 text-green-600" />
        </div>
      </div>

      {/* Main Card */}
      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-green-200 shadow-2xl animate-fade-in-up z-20">
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
              <div className="absolute -top-1 -right-1">
                <Sun className="h-5 w-5 text-amber-500 animate-spin-slow" />
              </div>
            </div>
          </div>

          <CardTitle className="text-3xl font-bold font-poppins text-green-800 tracking-tight">
            {t("auth.loginTitle")}
          </CardTitle>
          <CardDescription className="text-green-600 text-base">
            {t("auth.loginDescription")}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-3">
              <Label
                htmlFor="email"
                className="text-green-800 font-semibold text-sm uppercase tracking-wide"
              >
                {t("common.email")}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@agrilink.lk"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 py-3 bg-white/50"
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <Label
                htmlFor="password"
                className="text-green-800 font-semibold text-sm uppercase tracking-wide"
              >
                {t("common.password")}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 py-3 bg-white/50"
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold py-3 rounded-lg transform hover:scale-[1.02] transition-all duration-300 shadow-lg border-0"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                t("auth.loginButton")
              )}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl border border-amber-200 shadow-sm">
            <p className="text-sm font-semibold mb-3 text-amber-800 flex items-center">
              <Sun className="h-4 w-4 mr-2 text-amber-600" />
              Demo Credentials
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-amber-100">
                <span className="font-medium text-amber-700">Buyer</span>
                <span className="text-amber-600">buyer@agrilink.lk / buyer123</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-amber-100">
                <span className="font-medium text-amber-700">Seller</span>
                <span className="text-amber-600">seller@agrilink.lk / seller123</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-amber-100">
                <span className="font-medium text-amber-700">Admin</span>
                <span className="text-amber-600">admin@agrilink.lk / admin123</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-amber-100">
                <span className="font-medium text-amber-700">Agent</span>
                <span className="text-amber-600">agent@agrilink.lk / agent123</span>
              </div>
            </div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center pt-4 border-t border-green-100">
            <p className="text-green-700 text-sm">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-emerald-600 hover:text-emerald-800 font-bold underline-offset-4 hover:underline transition-all duration-300"
              >
                Join Our Farm Community
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
    <Footer  />
    </>
  );
};

export default Login;
