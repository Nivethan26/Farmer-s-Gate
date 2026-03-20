import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Navbar } from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const ResetPasswordOTP = () => {
  const location = useLocation();
  const initialEmail = location.state?.email || "";

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const navigate = useNavigate();

  const handleResendOTP = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "OTP resent to your email.");
      } else {
        toast.error(data.message || "Failed to resend OTP.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !otp) {
      toast.error("Email and OTP are required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-reset-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setOtpVerified(true);
        toast.success(data.message || "OTP verified successfully");
      } else {
        toast.error(data.message || "Invalid or expired OTP");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          newPassword: password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Password reset successful. Please log in.");
        navigate("/login");
      } else {
        toast.error(data.message || "Failed to reset password.");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-amber-50 to-green-50 p-4">
        <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-green-200 shadow-2xl animate-fade-in-up z-20">
          <CardHeader className="text-center space-y-4 pb-6">
            <CardTitle className="text-2xl font-bold font-poppins text-green-800 tracking-tight">
              Reset Password (OTP)
            </CardTitle>
            <CardDescription className="text-green-600 text-base">
              {otpVerified
                ? "OTP verified! Set your new password."
                : "Enter the OTP sent to your email and verify it."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {!otpVerified ? (
              <form onSubmit={handleVerifyOTP} className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-green-800 font-semibold text-sm uppercase tracking-wide">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@agrilink.lk"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 py-3 bg-white/50"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="otp" className="text-green-800 font-semibold text-sm uppercase tracking-wide">
                    OTP
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    disabled={loading}
                    className="border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 py-3 bg-white/50"
                  />
                </div>

                <Button
                  type="button"
                  className="w-full mt-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold py-2 rounded-lg transition-all duration-300 shadow border-0"
                  onClick={handleResendOTP}
                  disabled={loading}
                >
                  Resend OTP
                </Button>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold py-3 rounded-lg transform hover:scale-[1.02] transition-all duration-300 shadow-lg border-0"
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-green-800 font-semibold text-sm uppercase tracking-wide">
                    New Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 py-3 bg-white/50"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="confirmPassword" className="text-green-800 font-semibold text-sm uppercase tracking-wide">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 py-3 bg-white/50"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold py-3 rounded-lg transform hover:scale-[1.02] transition-all duration-300 shadow-lg border-0"
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default ResetPasswordOTP;