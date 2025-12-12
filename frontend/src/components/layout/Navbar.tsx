import { Link, useNavigate, useLocation } from "react-router-dom";
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
  Search,
  Sparkles,
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
  const location = useLocation();
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
    <nav
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-md border-gray-100"
          : "bg-white border-gray-100"
      }`}
    >
      {/* Main Navbar Container */}
      <div className="w-full px-4 sm:px-6 md:px-8 max-w-screen-2xl mx-auto">
        <div className="flex items-center justify-between gap-3 py-3 md:py-4">
          {/* Left Section - Logo & Brand */}
          <Link
            to={user ? `/${user.role}` : "/"}
            className="flex items-center gap-2 sm:gap-3 font-poppins min-w-0"
          >
            {/* Simplified Logo */}
            <div className="relative">
              <div className="relative rounded-xl bg-gradient-to-br from-green-700 to-emerald-800 p-2 sm:p-2.5 shadow-sm">
                <div className="relative w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                  <Sprout className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  <div className="absolute -left-0.5 top-0.5">
                    <div className="w-1 h-2 bg-green-400/80 rounded-tl-full rounded-bl-full transform -rotate-12" />
                  </div>
                  <div className="absolute -right-0.5 top-0.5">
                    <div className="w-1 h-2 bg-green-400/80 rounded-tr-full rounded-br-full transform rotate-12" />
                  </div>
                </div>
              </div>
              <div className="absolute -top-0.5 -right-0.5">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full shadow-sm" />
              </div>
            </div>
            
            {/* Brand name */}
            <div className="flex flex-col">
              <span className="text-base sm:text-xl md:text-2xl font-bold text-green-700 tracking-tight leading-tight">
                AgriLink Lanka
              </span>
              <span className="text-[10px] sm:text-xs text-green-600/70 font-medium uppercase tracking-wider">
                Eco-Friendly
              </span>
            </div>
          </Link>

          {/* Center Section - Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {!user &&
              navigationItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`relative px-4 py-2 h-10 font-medium rounded-lg transition-all ${
                        isActive
                          ? "text-white bg-gradient-to-r from-green-600 to-emerald-600"
                          : "text-green-800 hover:text-green-600 hover:bg-green-50"
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </span>
                    </Button>
                  </Link>
                );
              })}
          </div>

          {/* Right Section - Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            {user && user.role === "buyer" && (
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all"
                onClick={() => navigate("/buyer/cart")}
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItems.length > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-red-500 text-white font-bold">
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
                  className="relative h-10 w-10 rounded-lg hover:bg-amber-50 hover:text-amber-600 transition-all"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-amber-500 text-white font-bold">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative h-10 w-10 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all overflow-hidden"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 border-gray-200 shadow-lg bg-white"
                  >
                    <DropdownMenuLabel className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold text-green-800">
                            {user.name}
                          </p>
                          <p className="text-xs text-green-600">{user.email}</p>
                          <p className="text-xs text-green-500 capitalize font-medium mt-1 px-2 py-0.5 bg-green-100 rounded-full w-fit">
                            {user.role}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => navigate("/buyer")}
                      className="cursor-pointer text-green-700 hover:text-green-600 hover:bg-green-50"
                    >
                      <User className="mr-3 h-4 w-4" />
                      <span>{t("nav.dashboard")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 cursor-pointer hover:text-red-700 hover:bg-red-50"
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      <span>{t("common.logout")}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {!user && (
              <Link to="/login">
                <Button
                  size="sm"
                  className="px-6 py-2 h-10 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-sm hover:shadow transition-all rounded-lg font-medium"
                >
                  <span className="flex items-center gap-1.5">
                    <span>{t("common.login")}</span>
                    <User className="h-4 w-4" />
                  </span>
                </Button>
              </Link>
            )}

            <div className="pl-2 ml-1 border-l border-gray-200 ">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile - Language & Menu Button */}
          <div className="md:hidden flex items-center gap-2 shrink-0">
            {user && user.role === "buyer" && (
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-lg hover:bg-green-50 hover:text-green-600"
                onClick={() => navigate("/buyer/cart")}
              >
                <ShoppingCart className="h-4 w-4" />
                {cartItems.length > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-3.5 w-3.5 p-0 flex items-center justify-center text-[9px] bg-red-500 text-white font-bold">
                    {cartItems.length}
                  </Badge>
                )}
              </Button>
            )}
            
            <div className="flex-shrink-0">
              <LanguageSwitcher />
            </div>
            
            <button
              className="p-2 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition-all border border-green-200"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden border-t bg-white shadow-lg transition-all duration-300 overflow-hidden ${
          menuOpen
            ? "max-h-[24rem] opacity-100 border-gray-100"
            : "max-h-0 opacity-0 border-transparent"
        }`}
      >
        <div className="flex flex-col p-4 space-y-1">
          {!user &&
            navigationItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className="w-full"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`w-full justify-start rounded-lg ${
                      isActive
                        ? "text-white bg-gradient-to-r from-green-600 to-emerald-600"
                        : "text-green-800 hover:text-green-600 hover:bg-green-50"
                    }`}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}

          {/* Mobile User Actions */}
          <div className="space-y-2 pt-2">
            {!user ? (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="w-full">
                <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-medium rounded-lg"
                >
                  <span className="flex items-center justify-center gap-2">
                    {t("common.login")}
                    <User className="h-4 w-4" />
                  </span>
                </Button>
              </Link>
            ) : (
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigate("/buyer");
                    setMenuOpen(false);
                  }}
                  className="w-full justify-start text-green-700 hover:text-green-600 hover:bg-green-50 rounded-lg font-medium"
                >
                  <User className="mr-3 h-4 w-4" />
                  {t("nav.dashboard")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-medium"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  {t("common.logout")}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};