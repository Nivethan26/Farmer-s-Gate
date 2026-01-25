import { Link, useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Sprout,
  User,
  LogOut,
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
// import { NotificationBell } from "@/components/common/NotificationBell";
import { ProfessionalNotificationPanel } from "../common/ProfessionalNotificationPanel";


export const Navbar = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const user = useAppSelector((state: RootState) => state.auth.user);
  const cartItems = useAppSelector((state: RootState) => state.cart.items);

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

  const categories = [
    { name: "Vegetables", emoji: "🥬" },
    { name: "Fruits", emoji: "🍎" },
    { name: "Rice & Grains", emoji: "🌾" },
    { name: "Spices", emoji: "🌶️" },
  ];

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${scrolled
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
                      className={`relative px-4 py-2 h-10 font-medium rounded-lg transition-all ${isActive
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
                <ProfessionalNotificationPanel />

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
                      onClick={() => navigate(`/${user.role}`)}
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
          <div className="md:hidden flex items-center gap-1.5 shrink-0">
            {user && user.role === "buyer" && (
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all"
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

            {user && (
              <div className="flex-shrink-0">
                {/* NotificationCenter removed from mobile - moved to sidebar menu */}
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-all"
            >
              <LanguageSwitcher />
            </Button>

            <button
              className="h-9 w-9 rounded-lg bg-green-50 hover:bg-green-100 text-green-700 transition-all border border-green-200 flex items-center justify-center"
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

      {/* Empty - menu moved outside nav */}
    </nav>

    {/* Mobile Sidebar Menu - Slides from Right (Outside Nav) */}
    {/* Overlay */}
    {menuOpen && (
      <div
        className="md:hidden fixed inset-0 bg-black/30 z-30 transition-opacity duration-300"
        onClick={() => setMenuOpen(false)}
      />
    )}

    {/* Menu Panel */}
    <div
      className={`md:hidden fixed right-0 top-0 bottom-0 w-80 bg-white shadow-2xl transition-all duration-300 z-40 overflow-y-auto ${
        menuOpen
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0 pointer-events-none"
        }`}
    >
      {/* Close Button */}
      <button
        onClick={() => setMenuOpen(false)}
        className="absolute top-3 right-3 p-2 bg-red-500 hover:bg-red-600 border border-red-600 rounded-md z-50 shadow-md transition-all"
      >
        <X className="h-4 w-4 text-white" />
      </button>

      <div className="flex flex-col h-full" style={{ padding: '16px', gap: '12px' }}>
        {!user && (
          <>
            {/* Sign In & Register Buttons */}
            <div className="flex" style={{ gap: '12px', marginTop: '65px', marginBottom: '8px' }}>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1">
                <Button
                  variant="outline"
                  className="w-full border-2 border-gray-400 text-gray-700 hover:bg-gray-50 rounded-lg font-semibold py-2.5 text-sm"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="flex-1">
                <Button
                  className="w-full bg-amber-700 hover:bg-amber-800 text-white rounded-lg font-semibold py-2.5 text-sm"
                >
                  Register
                </Button>
              </Link>
            </div>
          </>
        )}

        {user && (
          <>
            {/* User Profile Card at Top */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg shadow-md" style={{ padding: '12px', marginTop: '55px', marginBottom: '6px' }}>
              <div className="flex items-center" style={{ gap: '12px' }}>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-800">{user.name}</h3>
                  <p className="text-xs text-gray-600">{user.email}</p>
                </div>
              </div>
            </div>

            {/* User Actions Group - Notifications, Dashboard, Logout */}
            <div className="border-b border-gray-200" style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingBottom: '8px' }}>
              <Link
                to="#"
                onClick={() => {}}
                className="w-full block"
              >
                <div className="flex items-center justify-between rounded-md hover:bg-gray-50 transition-all" style={{ padding: '3px' }}>
                  <div className="flex items-center" style={{ gap: '10px' }}>
                    <span className="text-base">🔔</span>
                    <span className="font-semibold text-xs text-gray-800">Notifications</span>
                  </div>
                  
                </div>
              </Link>

              <Link
                to={`/${user.role}`}
                onClick={() => setMenuOpen(false)}
                className="w-full block"
              >
                <div className="flex items-center justify-between rounded-md hover:bg-gray-50 transition-all" style={{ padding: '3px' }}>
                  <div className="flex items-center" style={{ gap: '10px' }}>
                    <span className="text-base">👤</span>
                    <span className="font-semibold text-xs text-gray-800">Dashboard</span>
                  </div>
                 
                </div>
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="w-full block text-left"
              >
                <div className="flex items-center justify-between rounded-md hover:bg-gray-50 transition-all" style={{ padding: '3px' }}>
                  <div className="flex items-center" style={{ gap: '10px' }}>
                    <span className="text-base">↪️</span>
                    <span className="font-semibold text-xs text-gray-800">Logout</span>
                  </div>
                 
                </div>
              </button>
            </div>
          </>
        )}

        {/* Navigation Items */}
        <div className="border-b border-gray-200" style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '12px' }}>
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className="w-full block"
              >
                <div className={`flex items-center justify-between rounded-md transition-all ${
                  isActive
                    ? "bg-yellow-100"
                    : "hover:bg-gray-50"
                }`} style={{ padding: '3px' }}>
                  <div className="flex items-center" style={{ gap: '10px' }}>
                    <div className="text-base">
                      {item.icon === Home && "🏠"}
                      {item.icon === Grid && "🛍️"}
                      {item.icon === Info && "ℹ️"}
                      {item.icon === Phone && "📞"}
                    </div>
                    <span className={`font-semibold text-xs ${isActive ? "text-yellow-800" : "text-gray-800"}`}>
                      {item.label}
                    </span>
                  </div>
                  
                </div>
              </Link>
            );
          })}
          
          {user && user.role === "buyer" && (
            <>
              <Link
                to="/buyer/cart"
                onClick={() => setMenuOpen(false)}
                className="w-full block"
              >
                <div className="flex items-center justify-between rounded-md hover:bg-gray-50 transition-all" style={{ padding: '3px' }}>
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">🛒</span>
                    <span className="font-semibold text-xs text-gray-800">Shopping Cart</span>
                  </div>
                 
                </div>
              </Link>
              
            </>
          )}
        </div>

        {/* Shop Categories Section - Only for Buyers */}
        {user && user.role === "buyer" && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingBottom: '16px' }}>
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider px-1 text-[10px] letter-spacing">Shop Categories</h3>
            <div className="grid grid-cols-2" style={{ gap: '8px' }}>
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to="/catalog"
                  onClick={() => setMenuOpen(false)}
                  className="group"
                >
                  <div className="bg-white border border-gray-200 rounded-md text-center shadow-sm hover:bg-gray-50 hover:shadow-md transition-all" style={{ padding: '12px' }}>
                    <div className="text-3xl mb-1.5">{category.emoji}</div>
                    <p className="text-xs font-semibold text-gray-800 leading-tight">{category.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};