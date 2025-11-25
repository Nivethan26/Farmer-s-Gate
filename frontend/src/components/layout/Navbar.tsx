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
        {/* Main Navbar Container - Professional Height & Alignment */}
        <div className="w-full px-6 md:px-12">
          <div className="flex min-h-[100px] items-center justify-between gap-4">
            {/* Left Section - Logo & Brand */}
            <Link
              to={user ? `/${user.role}` : "/"}
              className="flex items-center gap-3 font-poppins group relative shrink-0"
            >
              <div className="relative">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 opacity-0 group-hover:opacity-30 blur-2xl transition-all duration-700 scale-90 group-hover:scale-125" />
                
                {/* Floating particles */}
                <div className="absolute -top-1.5 -left-1.5 opacity-60">
                  <Sparkles className="h-2.5 w-2.5 text-green-400 animate-float" style={{ animationDelay: '0s' }} />
                </div>
                <div className="absolute -bottom-0.5 -right-1.5 opacity-60">
                  <Sparkles className="h-2 w-2 text-emerald-400 animate-float" style={{ animationDelay: '0.3s' }} />
                </div>
                <div className="absolute top-0 -right-2 opacity-60">
                  <Sparkles className="h-1.5 w-1.5 text-green-300 animate-float" style={{ animationDelay: '0.6s' }} />
                </div>
                
                {/* Main logo container */}
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-900/20 to-green-400/20 scale-100 group-hover:scale-125 transition-all duration-700 blur-sm" />
                  
                  <div className="relative rounded-2xl bg-gradient-to-br from-amber-800 via-green-800 to-emerald-800 p-4 shadow-xl overflow-visible" style={{ animation: 'soil-transition 6s ease-in-out infinite' }}>
                    <div className="relative w-9 h-9 flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center justify-center" style={{ animation: 'seed-to-plant 6s ease-in-out infinite' }}>
                        <div className="relative w-6 h-6 bg-amber-700 rounded-full shadow-lg">
                          <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-amber-900 rounded-full" />
                          <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-amber-300 rounded-full opacity-60" />
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-0.5 h-2.5 bg-amber-950/30 rounded-full" />
                          <div className="absolute inset-0 rounded-full shadow-inner" />
                        </div>
                      </div>
                      
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                        <div className="w-0.5 bg-gradient-to-b from-amber-600 to-amber-800 rounded-full" style={{ animation: 'root-grow 6s ease-in-out infinite' }} />
                      </div>
                      
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                        <div className="w-0.5 bg-gradient-to-t from-green-700 to-green-500 rounded-t-full" style={{ animation: 'stem-grow 6s ease-in-out infinite' }} />
                      </div>
                      
                      <div className="absolute inset-0" style={{ animation: 'sprout-appear 6s ease-in-out infinite' }}>
                        <Sprout className="h-9 w-9 text-white drop-shadow-2xl" />
                      </div>
                      
                      <div className="absolute -left-0.5 top-0.5 origin-right" style={{ animation: 'leaves-sprout 6s ease-in-out infinite' }}>
                        <div className="w-1.5 h-2.5 bg-green-400/80 rounded-tl-full rounded-bl-full transform -rotate-12" />
                      </div>
                      <div className="absolute -right-0.5 top-0.5 origin-left" style={{ animation: 'leaves-sprout 6s ease-in-out infinite' }}>
                        <div className="w-1.5 h-2.5 bg-green-400/80 rounded-tr-full rounded-br-full transform rotate-12" />
                      </div>
                      
                      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2" style={{ animation: 'top-leaves-flourish 6s ease-in-out infinite' }}>
                        <div className="flex gap-0.5">
                          <div className="w-1.5 h-2 bg-emerald-400 rounded-full transform -rotate-20" />
                          <div className="w-1.5 h-2 bg-emerald-300 rounded-full" />
                          <div className="w-1.5 h-2 bg-emerald-400 rounded-full transform rotate-20" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-green-400/10 to-transparent rounded-2xl animate-pulse-slow" />
                  </div>
                  
                  <div className="absolute top-0 right-0 transform translate-x-0.5 -translate-y-0.5" style={{ animation: 'leaves-sprout 6s ease-in-out infinite' }}>
                    <div className="w-3 h-3 bg-green-400 rounded-full blur-sm animate-pulse-slow" />
                  </div>
                  <div className="absolute bottom-0 left-0 transform -translate-x-0.5 translate-y-0.5" style={{ animation: 'leaves-sprout 6s ease-in-out infinite' }}>
                    <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full blur-sm animate-pulse-slow" style={{ animationDelay: '0.5s' }} />
                  </div>
                </div>
                
                <div className="absolute -top-0.5 -right-0.5 group-hover:scale-125 transition-transform duration-500">
                  <div className="relative">
                    <div className="absolute inset-0 animate-spin" style={{ animationDuration: '8s' }}>
                      <div className="absolute top-1/2 left-1/2 w-3 h-0.5 bg-gradient-to-r from-amber-400 to-transparent transform -translate-x-1/2 -translate-y-1/2" />
                      <div className="absolute top-1/2 left-1/2 w-3 h-0.5 bg-gradient-to-r from-amber-400 to-transparent transform -translate-x-1/2 -translate-y-1/2 rotate-45" />
                      <div className="absolute top-1/2 left-1/2 w-3 h-0.5 bg-gradient-to-r from-amber-400 to-transparent transform -translate-x-1/2 -translate-y-1/2 rotate-90" />
                      <div className="absolute top-1/2 left-1/2 w-3 h-0.5 bg-gradient-to-r from-amber-400 to-transparent transform -translate-x-1/2 -translate-y-1/2 rotate-135" />
                    </div>
                    <div className="w-2.5 h-2.5 bg-gradient-to-br from-amber-300 to-amber-500 rounded-full shadow-lg shadow-amber-400/50 animate-pulse-slow" />
                  </div>
                </div>
              </div>
              
              {/* Brand name */}
              <div className="flex flex-col gap-0.5">
                <span className="text-3xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent group-hover:from-green-700 group-hover:via-emerald-700 group-hover:to-green-800 transition-all duration-500 tracking-tight leading-tight">
                  AgriLink Lanka
                </span>
                <div className="flex items-center gap-1">
                  <div className="flex gap-0.5">
                    <div className="w-0.5 h-0.5 rounded-full bg-green-500 animate-pulse-slow" />
                    <div className="w-0.5 h-0.5 rounded-full bg-emerald-500 animate-pulse-slow" style={{ animationDelay: '0.2s' }} />
                    <div className="w-0.5 h-0.5 rounded-full bg-green-600 animate-pulse-slow" style={{ animationDelay: '0.4s' }} />
                  </div>
                  <span className="text-[11px] text-green-600/80 font-semibold tracking-wider uppercase leading-tight">Eco-Friendly</span>
                </div>
              </div>
            </Link>

            {/* Center Section - Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {!user &&
                navigationItems.map((item, index) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link key={item.path} to={item.path}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`relative px-7 py-3 h-12 font-semibold rounded-xl transition-smooth group overflow-hidden ${
                          isActive
                            ? "text-white bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 shadow-glow-green"
                            : "text-green-800 hover:text-white hover:shadow-lg hover:shadow-green-200/50"
                        }`}
                      >
                        <span className="relative z-10 flex items-center gap-1.5">
                          <item.icon
                            className={`h-6 w-6 transition-all duration-400 ${
                              isActive
                                ? "scale-110 drop-shadow-md"
                                : "group-hover:scale-110 group-hover:rotate-6"
                            }`}
                          />
                          <span className="relative text-lg">
                            {item.label}
                            {!isActive && (
                              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-500 to-emerald-500 group-hover:w-full transition-all duration-400" />
                            )}
                          </span>
                        </span>
                        {!isActive && (
                          <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-600 to-green-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left rounded-xl" />
                        )}
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
                  className="relative h-12 w-12 rounded-xl hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 hover:text-green-600 transition-smooth hover:scale-110 hover:shadow-lg hover:shadow-green-200/50 group"
                  onClick={() => navigate("/buyer/cart")}
                >
                  <ShoppingCart className="h-7 w-7 transition-transform duration-400 group-hover:scale-110" />
                  {cartItems.length > 0 && (
                    <Badge className="absolute -right-0.5 -top-0.5 h-4.5 w-4.5 p-0 flex items-center justify-center text-[10px] bg-gradient-to-br from-red-500 to-pink-600 text-white font-bold animate-bounce-subtle shadow-lg">
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
                    className="relative h-12 w-12 rounded-xl hover:bg-gradient-to-br hover:from-amber-50 hover:to-orange-50 hover:text-amber-600 transition-smooth hover:scale-110 hover:shadow-lg hover:shadow-amber-200/50 group"
                  >
                    <Bell className="h-7 w-7 transition-transform duration-400 group-hover:rotate-12 group-hover:scale-110" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -right-0.5 -top-0.5 h-4.5 w-4.5 p-0 flex items-center justify-center text-[10px] bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold animate-pulse-slow shadow-lg">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="relative h-12 w-12 rounded-xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 hover:text-blue-600 transition-smooth hover:scale-110 hover:shadow-lg hover:shadow-blue-200/50 group overflow-hidden"
                      >
                        <User className="h-7 w-7 relative z-10 transition-transform duration-400 group-hover:scale-110" />
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
                    className="relative px-8 py-3 h-12 bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 hover:from-green-700 hover:via-emerald-700 hover:to-green-800 text-white shadow-lg hover:shadow-2xl hover:shadow-green-500/50 transform hover:scale-105 transition-smooth rounded-xl font-semibold overflow-hidden group"
                  >
                    <span className="relative z-10 flex items-center gap-1.5">
                      <span className="text-lg">{t("common.login")}</span>
                      <User className="h-6 w-6 transition-transform duration-400 group-hover:translate-x-1" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700 animate-shimmer" />
                  </Button>
                </Link>
              )}

              <div className="pl-3 ml-1 border-l border-green-200/50 h-10">
                <LanguageSwitcher />
              </div>
            </div>

            {/* Mobile - Language & Menu Button */}
            <div className="md:hidden flex items-center gap-2 shrink-0">
              <div className="flex-shrink-0">
                <LanguageSwitcher />
              </div>
              
              <button
                className="p-2 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 text-green-700 transition-smooth hover:scale-110 shadow-md hover:shadow-lg border border-green-200/50 active:scale-95"
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