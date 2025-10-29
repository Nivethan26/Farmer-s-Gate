import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Sprout,
  User,
  LogOut,
  Bell,
  ShoppingCart,
  Menu,
  X,
  Home,
  Info,
  Phone,
  Grid,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import type { RootState } from "@/store";
import { logout } from "@/store/authSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";

export const Navbar = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const user = useAppSelector((state: RootState) => state.auth.user);
  const cartItems = useAppSelector((state: RootState) => state.cart.items);
  const notifications = useAppSelector(
    (state: RootState) => state.ui.notifications
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navigationItems = [
    { path: "/", label: t("common.Home"), icon: Home },
    { path: "/catalog", label: t("catalog.title"), icon: Grid },
    { path: "/about", label: t("common.About"), icon: Info },
    { path: "/contact", label: t("common.Contact"), icon: Phone },
  ];

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-xl shadow-lg border-green-100"
            : "bg-white/80 backdrop-blur-md border-green-50"
        }`}
      >
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Left Section - Logo with animation */}
          <Link
            to={user ? `/${user.role}` : "/"}
            className="flex items-center gap-2 font-poppins group"
          >
            <div className="relative">
              <div className="rounded-full bg-gradient-to-br from-green-500 to-emerald-600 p-2 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <Sprout className="h-6 w-6 text-white animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1">
                <div className="h-3 w-3 bg-amber-400 rounded-full animate-ping opacity-75" />
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-emerald-700 bg-clip-text text-transparent">
              AgriLink Lanka
            </span>
          </Link>

          {/* Center Section - Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {!user &&
              navigationItems.map((item, index) => (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="relative px-4 py-2 text-green-800 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-300 group overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                  </Button>
                </Link>
              ))}
          </div>

          {/* Right Section (Desktop only) */}
          <div className="hidden md:flex items-center gap-2">
            {user && user.role === "buyer" && (
              <Button
                variant="ghost"
                size="icon"
                className="relative rounded-full hover:bg-green-50 hover:text-green-600 transition-all duration-300 transform hover:scale-105"
                onClick={() => navigate("/buyer/cart")}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white animate-bounce">
                    {cartItems.length}
                  </Badge>
                )}
              </Button>
            )}

            {user && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative rounded-full hover:bg-amber-50 hover:text-amber-600 transition-all duration-300 transform hover:scale-105"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-amber-500 text-white animate-pulse">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 border-green-200 shadow-xl animate-in slide-in-from-top-5 duration-300"
                  >
                    <DropdownMenuLabel className="bg-gradient-to-r from-green-50 to-emerald-50">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-green-800">
                          {user.name}
                        </p>
                        <p className="text-xs text-green-600">{user.email}</p>
                        <p className="text-xs text-green-500 capitalize">
                          {user.role}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-green-100" />
                    <DropdownMenuItem
                      onClick={() => navigate("/account")}
                      className="cursor-pointer text-green-700 hover:text-green-600 hover:bg-green-50 transition-colors duration-200"
                    >
                      <User className="mr-2 h-4 w-4" />
                      {t("nav.account")}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-green-100" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 cursor-pointer hover:text-red-700 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {t("common.logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {!user && (
              <Link to="/login">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  {t("common.login")}
                </Button>
              </Link>
            )}

            <div className="pl-2 border-l border-green-200">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition-all duration-300 transform hover:scale-105"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="h-5 w-5 animate-spin-in" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <div
          className={`md:hidden border-t bg-white/95 backdrop-blur-xl shadow-lg transition-all duration-300 overflow-hidden ${
            menuOpen
              ? "max-h-96 opacity-100 border-green-100"
              : "max-h-0 opacity-0 border-transparent"
          }`}
        >
          <div className="flex flex-col items-start p-4 space-y-1">
            {!user &&
              navigationItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className="w-full"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-green-800 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 group"
                  >
                    <item.icon className="mr-3 h-4 w-4 transform group-hover:scale-110 transition-transform duration-200" />
                    {item.label}
                  </Button>
                </Link>
              ))}

            {/* Divider */}
            <div className="border-t border-green-100 my-2 w-full" />

            {/* Mobile User Actions */}
            <div className="w-full space-y-2">
              {!user ? (
                <Link to="/login" onClick={() => setMenuOpen(false)} className="w-full">
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-lg"
                  >
                    {t("common.login")}
                  </Button>
                </Link>
              ) : (
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigate("/account");
                      setMenuOpen(false);
                    }}
                    className="w-full justify-start text-green-700 hover:text-green-600 hover:bg-green-50"
                  >
                    <User className="mr-3 h-4 w-4" />
                    {t("nav.account")}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    {t("common.logout")}
                  </Button>
                </div>
              )}

              {/* Language switcher inside menu */}
              <div className="pt-3 w-full border-t border-green-100">
                <div className="flex justify-center">
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Custom Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        @keyframes spin-in {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(180deg); }
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
        .animate-spin-in {
          animation: spin-in 0.3s ease-out;
        }
        .animate-in {
          animation-duration: 0.3s;
          animation-timing-function: ease-out;
        }
        .slide-in-from-top-5 {
          animation-name: slideInFromTop;
        }
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
};