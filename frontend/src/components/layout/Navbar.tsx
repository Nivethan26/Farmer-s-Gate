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
  Bell,
  Package,
  Scale,
  CreditCard,
  MessageSquare,
  CheckCheck,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import type { RootState } from "@/store";
import { logout } from "@/store/authSlice";
import { 
  fetchNotifications, 
  fetchUnreadCount, 
  markNotificationAsRead,
  markAllNotificationsAsRead 
} from '@/store/notificationSlice';
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
import { toast } from 'sonner';


export const Navbar = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileNotificationOpen, setMobileNotificationOpen] = useState(false);

  const user = useAppSelector((state: RootState) => state.auth.user);
  const cartItems = useAppSelector((state: RootState) => state.cart.items);
  const { notifications, unreadCount, loading } = useAppSelector((state) => state.notifications);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch notifications when mobile panel opens
  useEffect(() => {
    if (user && mobileNotificationOpen) {
      dispatch(fetchNotifications({ page: 1, limit: 20 }));
      dispatch(fetchUnreadCount());
    }
  }, [dispatch, user, mobileNotificationOpen]);

  // Fetch unread count on mount
  useEffect(() => {
    if (user) {
      dispatch(fetchUnreadCount());
    }
  }, [dispatch, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleNotificationClick = async (notification: any) => {
    if (!notification.isRead) {
      try {
        await dispatch(markNotificationAsRead(notification._id));
        dispatch(fetchUnreadCount());
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await dispatch(markAllNotificationsAsRead());
      dispatch(fetchUnreadCount());
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'negotiation': return <Scale className="h-5 w-5" />;
      case 'order': return <Package className="h-5 w-5" />;
      case 'payment': return <CreditCard className="h-5 w-5" />;
      default: return <MessageSquare className="h-5 w-5" />;
    }
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return notificationDate.toLocaleDateString();
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
            to={'/'}
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
            {user && (
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-lg hover:bg-green-50 hover:text-green-600 transition-all"
                onClick={() => setMobileNotificationOpen(true)}
              >
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-4 w-4 p-0 flex items-center justify-center text-[9px] bg-red-500 text-white font-bold">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            )}

            <div className="flex-shrink-0">
              <LanguageSwitcher />
            </div>

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
    {/* Overlay with blur effect */}
    {menuOpen && (
      <div
        className="md:hidden fixed inset-0 bg-gradient-to-br from-green-900/40 to-emerald-900/40 backdrop-blur-sm z-30 transition-all duration-300"
        onClick={() => setMenuOpen(false)}
      />
    )}

    {/* Menu Panel - Green themed */}
    <div
      className={`md:hidden fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-gradient-to-b from-white via-green-50/30 to-white shadow-2xl transition-all duration-300 z-40 overflow-y-auto border-l-2 border-green-200 ${
        menuOpen
          ? "translate-x-0 opacity-100"
          : "translate-x-full opacity-0 pointer-events-none"
        }`}
    >
      {/* Header with brand colors
      <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-4 shadow-md z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <Sprout className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">AgriLink</h2>
              <p className="text-green-100 text-xs font-medium">Eco-Friendly</p>
            </div>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all shadow-md"
          >
            <X className="h-5 w-5 text-white" />
          </button>
        </div>
      </div> */}

      <div className="flex flex-col p-4 gap-4">
        {!user && (
          <>
            {/* Sign In & Register Buttons - Green themed */}
            <div className="flex gap-3 pt-2 mt-16">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="flex-1">
                <Button
                  variant="outline"
                  className="w-full border-2 border-green-600 text-green-700 hover:bg-green-50 rounded-xl font-semibold py-6 text-sm shadow-sm"
                >
                  <User className="h-4 w-4 mr-2" />
                  Sign In
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="flex-1">
                <Button
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-semibold py-6 text-sm shadow-md"
                >
                  Register
                </Button>
              </Link>
            </div>
          </>
        )}

        {user && (
          <>
            {/* User Profile Card - Green themed */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2  border-green-200 rounded-2xl shadow-md p-4 mt-16">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-green-100">
                  {user.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-green-800 truncate">{user.name}</h3>
                  <p className="text-xs text-green-600 truncate">{user.email}</p>
                  <div className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-xs font-semibold shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    {user.role}
                  </div>
                </div>
              </div>
            </div>

            {/* User Actions - Green themed cards */}
            <div className="flex flex-col gap-2 pb-3 border-b-2 border-green-100">

              <div className="bg-white rounded-xl border border-green-100 shadow-sm overflow-hidden">
                <Link
                  to={`/${user.role}`}
                  onClick={() => setMenuOpen(false)}
                  className="w-full block"
                >
                  <div className="flex items-center gap-3 p-3.5 hover:bg-green-50 transition-all active:bg-green-100">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
                      <User className="h-5 w-5 text-green-700" />
                    </div>
                    <span className="font-semibold text-sm text-gray-800">Dashboard</span>
                  </div>
                </Link>
              </div>

              <div className="bg-white rounded-xl border border-red-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="w-full block text-left"
                >
                  <div className="flex items-center gap-3 p-3.5 hover:bg-red-50 transition-all active:bg-red-100">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center">
                      <LogOut className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="font-semibold text-sm text-red-700">Logout</span>
                  </div>
                </button>
              </div>
            </div>
          </>
        )}

        {/* Navigation Items - Green themed */}
        <div className="flex flex-col gap-2 pb-3 border-b-2 border-green-100">
          <h3 className="text-xs font-bold text-green-700 uppercase tracking-wider px-2 mb-1">Menu</h3>
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMenuOpen(false)}
                className="w-full block"
              >
                <div className={`flex items-center gap-3 p-3.5 rounded-xl transition-all border-2 ${
                  isActive
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white border-green-700 shadow-md"
                    : "bg-white text-gray-800 border-green-100 hover:bg-green-50 hover:border-green-300 shadow-sm"
                }`}>
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isActive ? "bg-white/20" : "bg-green-50"
                  }`}>
                    <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-green-600"}`} />
                  </div>
                  <span className="font-semibold text-sm flex-1">{item.label}</span>
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  )}
                </div>
              </Link>
            );
          })}
          
          {user && user.role === "buyer" && (
            <Link
              to="/buyer/cart"
              onClick={() => setMenuOpen(false)}
              className="w-full block"
            >
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white border-2 border-green-100 hover:bg-green-50 hover:border-green-300 transition-all shadow-sm">
                <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center relative">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                  {cartItems.length > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] text-white font-bold">
                      {cartItems.length}
                    </div>
                  )}
                </div>
                <span className="font-semibold text-sm text-gray-800">Shopping Cart</span>
              </div>
            </Link>
          )}
        </div>

        {/* Shop Categories - Enhanced cards */}
        {user && user.role === "buyer" && (
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold text-green-700 uppercase tracking-wider px-2">Shop by Category</h3>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  to="/catalog"
                  onClick={() => setMenuOpen(false)}
                  className="group"
                >
                  <div className="bg-gradient-to-br from-white to-green-50 border-2 border-green-100 rounded-2xl text-center shadow-sm hover:shadow-lg hover:border-green-300 hover:scale-105 transition-all p-4">
                    <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform">{category.emoji}</div>
                    <p className="text-xs font-bold text-green-800 leading-tight">{category.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Footer branding */}
        <div className="mt-auto pt-4 pb-2">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <p className="text-xs text-center text-green-700 font-medium">
              🌱 Farm Fresh • Direct to You
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* Mobile Notification Panel */}
    {user && mobileNotificationOpen && (
      <>
        {/* Overlay */}
        <div
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-all duration-300"
          onClick={() => setMobileNotificationOpen(false)}
        />
        
        {/* Notification Panel - Sliding from right */}
        <div className="md:hidden fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-4 shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-white" />
                  <h2 className="text-white font-bold text-lg">Notifications</h2>
                  {unreadCount > 0 && (
                    <Badge className="bg-red-500 text-white text-xs">
                      {unreadCount} new
                    </Badge>
                  )}
                </div>
                <button
                  onClick={() => setMobileNotificationOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-all"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            {/* Mark all as read button */}
            {unreadCount > 0 && (
              <div className="px-4 py-2 bg-green-50 border-b border-green-100">
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-green-700 font-semibold hover:text-green-800 flex items-center gap-1"
                >
                  <CheckCheck className="h-4 w-4" />
                  Mark all as read
                </button>
              </div>
            )}
            
            {/* Notification Content */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full p-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
                  <p className="text-gray-500">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8">
                  <Bell className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No notifications</h3>
                  <p className="text-sm text-gray-500 text-center">You're all caught up! Check back later for new updates.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification: any) => (
                    <div
                      key={notification._id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 cursor-pointer transition-all active:bg-gray-50 ${
                        !notification.isRead ? 'bg-blue-50/50' : 'bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Icon */}
                        <div className={`flex-shrink-0 p-2.5 rounded-xl ${
                          notification.type === 'negotiation' ? 'bg-purple-100 text-purple-600' :
                          notification.type === 'order' ? 'bg-blue-100 text-blue-600' :
                          notification.type === 'payment' ? 'bg-green-100 text-green-600' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className={`text-sm font-semibold ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-1 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          
                          {/* Meta */}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="text-xs capitalize">
                              {notification.type}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Bottom Close Button */}
            <div className="border-t border-gray-200 p-3 bg-white">
              <button
                onClick={() => setMobileNotificationOpen(false)}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <X className="h-4 w-4" />
                Close
              </button>
            </div>
          </div>
        </div>
      </>
    )}
    </>
  );
};