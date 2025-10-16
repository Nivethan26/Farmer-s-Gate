import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sprout, User, LogOut, Bell, ShoppingCart } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import type { RootState } from '@/store';
import { logout } from '@/store/authSlice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';

export const Navbar = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const cartItems = useAppSelector((state: RootState) => state.cart.items);
  const notifications = useAppSelector((state: RootState) => state.ui.notifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-card backdrop-blur supports-[backdrop-filter]:bg-card/95">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to={user ? `/${user.role}` : '/'} className="flex items-center gap-2 font-poppins">
          <Sprout className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-primary">AgriLink Lanka</span>
        </Link>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          
          {!user && (
            <>
              <Link to="/catalog">
                <Button variant="ghost" size="sm">{t('catalog.title')}</Button>
              </Link>
              <Link to="/login">
                <Button size="sm">{t('common.login')}</Button>
              </Link>
            </>
          )}

          {user && user.role === 'buyer' && (
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate('/buyer/cart')}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItems.length > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {cartItems.length}
                </Badge>
              )}
            </Button>
          )}

          {user && (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge className="absolute -right-1 -top-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/account')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    {t('nav.account')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('common.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
