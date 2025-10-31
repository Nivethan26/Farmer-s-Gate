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
import { Input } from "@/components/ui/input";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";
import { motion, AnimatePresence } from "framer-motion";
import "./NavbarEnhancements.css";

export const Navbar = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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
        className={`sticky top-0 z-50 w-full border-b transition-all duration-500 ${
          scrolled
            ? "bg-white/70 backdrop-blur-2xl shadow-2xl border-green-200/50 supports-[backdrop-filter]:bg-white/60"
            : "bg-white/50 backdrop-blur-xl border-green-100/30 supports-[backdrop-filter]:bg-white/40"
        }`}
      >
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          {/* Left Section - Eco-Friendly Animated Logo */}
          <Link
            to={user ? `/${user.role}` : "/"}
            className="flex items-center gap-4 font-poppins group relative"
          >
            <div className="relative">
              {/* Outer glow ring - grows on hover */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 opacity-0 group-hover:opacity-30 blur-2xl transition-all duration-700 scale-90 group-hover:scale-125" />
              
              {/* Floating leaf particles - always animating */}
              <div className="absolute -top-2 -left-2 opacity-60">
                <Sparkles className="h-3 w-3 text-green-400 animate-float" style={{ animationDelay: '0s' }} />
              </div>
              <div className="absolute -bottom-1 -right-2 opacity-60">
                <Sparkles className="h-2.5 w-2.5 text-emerald-400 animate-float" style={{ animationDelay: '0.3s' }} />
              </div>
              <div className="absolute top-0 -right-3 opacity-60">
                <Sparkles className="h-2 w-2 text-green-300 animate-float" style={{ animationDelay: '0.6s' }} />
              </div>
              
              {/* Main logo container - Seed to Plant Growth Animation */}
              <div className="relative">
                {/* Growing ring effect - soil expanding */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-900/20 to-green-400/20 scale-100 group-hover:scale-125 transition-all duration-700 blur-sm" />
                
                {/* Logo background - represents soil (animates automatically) */}
                <div className="relative rounded-3xl bg-gradient-to-br from-amber-800 via-green-800 to-emerald-800 p-3 shadow-xl overflow-visible" style={{ animation: 'soil-transition 6s ease-in-out infinite' }}>
                  
                  {/* Seed to Plant Growth Stages - Continuous Animation */}
                  <div className="relative w-7 h-7 flex items-center justify-center">
                    
                    {/* Stage 1: Seed (visible at start, disappears) */}
                    <div className="absolute inset-0 flex items-center justify-center" style={{ animation: 'seed-to-plant 6s ease-in-out infinite' }}>
                      <div className="relative w-4 h-5 bg-amber-700 rounded-full shadow-lg">
                        {/* Seed gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-900 rounded-full" />
                        {/* Highlight on seed */}
                        <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-amber-300 rounded-full opacity-60" />
                        {/* Seed crack line (ready to sprout) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-3 bg-amber-950/30 rounded-full" />
                        {/* Inner shadow for depth */}
                        <div className="absolute inset-0 rounded-full shadow-inner" />
                      </div>
                    </div>
                    
                    {/* Stage 2: Root emerging downward */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                      <div className="w-0.5 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full" style={{ animation: 'root-grow 6s ease-in-out infinite' }} />
                    </div>
                    
                    {/* Stage 3: Stem growing upward */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                      <div className="w-1 bg-gradient-to-t from-green-700 to-green-500 rounded-t-full" style={{ animation: 'stem-grow 6s ease-in-out infinite' }} />
                    </div>
                    
                    {/* Stage 4: Sprout icon appears and rises */}
                    <div className="absolute inset-0" style={{ animation: 'sprout-appear 6s ease-in-out infinite' }}>
                      <Sprout className="h-7 w-7 text-white drop-shadow-2xl" />
                    </div>
                    
                    {/* Stage 5: Side leaves sprouting */}
                    <div className="absolute -left-1 top-1 origin-right" style={{ animation: 'leaves-sprout 6s ease-in-out infinite' }}>
                      <div className="w-2 h-3 bg-green-400/80 rounded-tl-full rounded-bl-full transform -rotate-12" />
                    </div>
                    <div className="absolute -right-1 top-1 origin-left" style={{ animation: 'leaves-sprout 6s ease-in-out infinite' }}>
                      <div className="w-2 h-3 bg-green-400/80 rounded-tr-full rounded-br-full transform rotate-12" />
                    </div>
                    
                    {/* Stage 6: Top leaves flourishing */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2" style={{ animation: 'top-leaves-flourish 6s ease-in-out infinite' }}>
                      <div className="flex gap-1">
                        <div className="w-2 h-2.5 bg-emerald-400 rounded-full transform -rotate-20" />
                        <div className="w-2 h-2.5 bg-emerald-300 rounded-full" />
                        <div className="w-2 h-2.5 bg-emerald-400 rounded-full transform rotate-20" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Soil layer - subtle animation */}
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-t from-amber-800/40 to-transparent" />
                  
                  {/* Growth energy glow */}
                  <div className="absolute inset-0 bg-gradient-to-t from-transparent via-green-400/10 to-transparent rounded-3xl animate-pulse-slow" />
                </div>
                
                {/* Orbiting leaves - continuous animation */}
                <div className="absolute top-0 right-0 transform translate-x-1 -translate-y-1" style={{ animation: 'leaves-sprout 6s ease-in-out infinite' }}>
                  <div className="w-4 h-4 bg-green-400 rounded-full blur-sm animate-pulse-slow" />
                </div>
                <div className="absolute bottom-0 left-0 transform -translate-x-1 translate-y-1" style={{ animation: 'leaves-sprout 6s ease-in-out infinite' }}>
                  <div className="w-3 h-3 bg-emerald-400 rounded-full blur-sm animate-pulse-slow" style={{ animationDelay: '0.5s' }} />
                </div>
              </div>
              
              {/* Sun/Energy indicator with rays */}
              <div className="absolute -top-1 -right-1 group-hover:scale-125 transition-transform duration-500">
                <div className="relative">
                  {/* Sun rays */}
                  <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
                    <div className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-gradient-to-r from-amber-400 to-transparent transform -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-gradient-to-r from-amber-400 to-transparent transform -translate-x-1/2 -translate-y-1/2 rotate-45" />
                    <div className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-gradient-to-r from-amber-400 to-transparent transform -translate-x-1/2 -translate-y-1/2 rotate-90" />
                    <div className="absolute top-1/2 left-1/2 w-4 h-0.5 bg-gradient-to-r from-amber-400 to-transparent transform -translate-x-1/2 -translate-y-1/2 rotate-135" />
                  </div>
                  {/* Sun core */}
                  <div className="w-3 h-3 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full shadow-lg shadow-amber-400/50 animate-pulse-slow" />
                </div>
              </div>
            </div>
            
            {/* Brand name with organic feel */}
            <div className="flex flex-col gap-0.5">
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent group-hover:from-green-700 group-hover:via-emerald-700 group-hover:to-green-800 transition-all duration-500 tracking-tight">
                AgriLink Lanka
              </span>
              <div className="flex items-center gap-1.5">
                <div className="flex gap-0.5">
                  <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse-slow" />
                  <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse-slow" style={{ animationDelay: '0.2s' }} />
                  <div className="w-1 h-1 rounded-full bg-green-600 animate-pulse-slow" style={{ animationDelay: '0.4s' }} />
                </div>
                <span className="text-[10px] text-green-600/80 font-semibold tracking-widest uppercase">Eco-Friendly</span>
              </div>
            </div>
          </Link>

          {/* Center Section - Enhanced Desktop Menu with Active States */}
          <div className="hidden md:flex items-center gap-2">
            {!user &&
              navigationItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`relative px-5 py-2.5 font-semibold rounded-xl transition-smooth group overflow-hidden ${
                        isActive
                          ? "text-white bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 shadow-glow-green"
                          : "text-green-800 hover:text-white hover:shadow-lg hover:shadow-green-200/50"
                      }`}
                    >
                      <span className="relative z-10 flex items-center gap-2">
                        <item.icon
                          className={`h-4 w-4 transition-all duration-400 ${
                            isActive
                              ? "scale-110 drop-shadow-md"
                              : "group-hover:scale-110 group-hover:rotate-6"
                          }`}
                        />
                        <span className="relative">
                          {item.label}
                          {/* Animated underline for non-active items */}
                          {!isActive && (
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 group-hover:w-full transition-all duration-400" />
                          )}
                        </span>
                      </span>
                      {/* Hover background gradient for non-active items */}
                      {!isActive && (
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-600 to-green-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left rounded-xl" />
                      )}
                    </Button>
                  </Link>
                );
              })}
          </div>

          {/* Right Section (Desktop only) */}
          <div className="hidden md:flex items-center gap-2">
            {user && user.role === "buyer" && (
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-xl hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 hover:text-green-600 transition-smooth hover:scale-110 hover:shadow-lg hover:shadow-green-200/50 group"
                onClick={() => navigate("/buyer/cart")}
              >
                <ShoppingCart className="h-5 w-5 transition-transform duration-400 group-hover:scale-110" />
                {cartItems.length > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-gradient-to-br from-red-500 to-pink-600 text-white font-bold animate-bounce-subtle shadow-lg">
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
                  className="relative h-10 w-10 rounded-xl hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50 hover:text-amber-600 transition-smooth hover:scale-110 hover:shadow-lg hover:shadow-amber-200/50 group"
                >
                  <Bell className="h-5 w-5 transition-transform duration-400 group-hover:rotate-12 group-hover:scale-110" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold animate-pulse-slow shadow-lg">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="relative h-10 w-10 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-smooth hover:scale-110 hover:shadow-lg hover:shadow-blue-200/50 group overflow-hidden"
                    >
                      <User className="h-5 w-5 relative z-10 transition-transform duration-400 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/10 group-hover:to-indigo-500/10 transition-all duration-400 rounded-xl" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 border-green-200/50 shadow-2xl backdrop-blur-xl bg-white/95 animate-slide-down rounded-2xl overflow-hidden"
                  >
                    <DropdownMenuLabel className="bg-gradient-to-br from-green-50 via-emerald-50 to-green-50 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg animate-glow-pulse">
                          <User className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-semibold text-green-800">
                            {user.name}
                          </p>
                          <p className="text-xs text-green-600">{user.email}</p>
                          <p className="text-xs text-green-500 capitalize font-medium px-2 py-0.5 bg-green-100 rounded-full inline-block w-fit">
                            {user.role}
                          </p>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-green-200 to-transparent" />
                    <DropdownMenuItem
                      onClick={() => navigate("/account")}
                      className="cursor-pointer text-green-700 hover:text-green-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-smooth mx-2 my-1 rounded-lg group"
                    >
                      <User className="mr-3 h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                      <span className="font-medium">{t("nav.account")}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-green-200 to-transparent" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="text-red-600 cursor-pointer hover:text-red-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-smooth mx-2 my-1 mb-2 rounded-lg group"
                    >
                      <LogOut className="mr-3 h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:translate-x-1" />
                      <span className="font-medium">{t("common.logout")}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {!user && (
              <Link to="/login">
                <Button
                  size="sm"
                  className="relative px-6 py-2 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 text-white shadow-lg hover:shadow-2xl hover:shadow-green-500/50 transform hover:scale-105 transition-smooth rounded-xl font-semibold overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    {t("common.login")}
                    <User className="h-4 w-4 transition-transform duration-400 group-hover:translate-x-1" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 animate-shimmer" />
                </Button>
              </Link>
            )}

            <div className="pl-3 ml-2 border-l-2 border-green-200/50">
              <LanguageSwitcher />
            </div>
          </div>

          {/* Mobile Language Switcher & Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Language switcher visible on mobile */}
            <div className="flex-shrink-0">
              <LanguageSwitcher />
            </div>
            
            {/* Mobile Menu Button */}
            <button
              className="p-2.5 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 text-green-700 transition-smooth hover:scale-110 shadow-md hover:shadow-lg border border-green-200/50 active:scale-95"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
            <AnimatePresence mode="wait">
              {menuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: 0, opacity: 0 }}
                  animate={{ rotate: 90, opacity: 1 }}
                  exit={{ rotate: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
          </div>
        </div>

        {/* Enhanced Mobile Dropdown Menu */}
        <div
          className={`md:hidden border-t bg-white/95 backdrop-blur-2xl shadow-2xl transition-all duration-500 overflow-hidden ${
            menuOpen
              ? "max-h-[32rem] opacity-100 border-green-100/50"
              : "max-h-0 opacity-0 border-transparent"
          }`}
        >
          <div className="flex flex-col items-start p-4 space-y-1">
            {!user &&
              navigationItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <motion.div
                    key={item.path}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    className="w-full"
                  >
                    <Link
                      to={item.path}
                      onClick={() => setMenuOpen(false)}
                      className="w-full"
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`w-full justify-start rounded-xl transition-smooth group ${
                          isActive
                            ? "text-white bg-gradient-to-r from-green-600 to-emerald-600 shadow-glow-green"
                            : "text-green-800 hover:text-green-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50"
                        }`}
                      >
                        <item.icon className={`mr-3 h-4 w-4 transition-transform duration-300 ${
                          isActive ? "scale-110" : "group-hover:scale-110 group-hover:rotate-6"
                        }`} />
                        <span className="font-medium">{item.label}</span>
                      </Button>
                    </Link>
                  </motion.div>
                );
              })}

            {/* Divider */}
            <div className="border-t border-green-100 my-2 w-full" />

            {/* Mobile User Actions - Enhanced */}
            <div className="w-full space-y-2">
              {!user ? (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                >
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="w-full">
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl font-semibold rounded-xl group overflow-hidden relative"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        {t("common.login")}
                        <User className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                    </Button>
                  </Link>
                </motion.div>
              ) : (
                <div className="space-y-2">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigate("/account");
                        setMenuOpen(false);
                      }}
                      className="w-full justify-start text-green-700 hover:text-green-600 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 rounded-xl font-medium transition-smooth group"
                    >
                      <User className="mr-3 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                      {t("nav.account")}
                    </Button>
                  </motion.div>
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 rounded-xl font-medium transition-smooth group"
                    >
                      <LogOut className="mr-3 h-4 w-4 transition-transform duration-300 group-hover:scale-110 group-hover:translate-x-1" />
                      {t("common.logout")}
                    </Button>
                  </motion.div>
                </div>
              )}
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