import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  markNotificationRead,
  markAllNotificationsRead,
  clearNotifications,
  removeNotification,
} from '@/store/uiSlice';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Check,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
  Trash2,
  ShoppingBag,
  MessageSquare,
  ExternalLink,
  Clock,
  User,
  Store,
  Shield,
  DollarSign,
  Truck
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { NotificationDetailsDialog } from './NotificationDetailsDialog';
import type { Notification } from '@/store/uiSlice';

interface NotificationCenterProps {
  trigger?: React.ReactNode;
}

const getNotificationIcon = (type: string, category?: string) => {
  switch (category) {
    case 'order': return <ShoppingBag className="h-4 w-4" />;
    case 'delivery': return <Truck className="h-4 w-4" />;
    case 'message': return <MessageSquare className="h-4 w-4" />;
    case 'payment': return <DollarSign className="h-4 w-4" />;
    case 'system': return <Shield className="h-4 w-4" />;
    default:
      switch (type) {
        case 'success': return <CheckCircle className="h-4 w-4" />;
        case 'error': return <AlertCircle className="h-4 w-4" />;
        case 'warning': return <AlertTriangle className="h-4 w-4" />;
        default: return <Info className="h-4 w-4" />;
      }
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'success': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'error': return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'warning': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'neutral': return 'bg-gray-50 text-gray-700 border-gray-200';
    default: return 'bg-blue-50 text-blue-700 border-blue-200';
  }
};

const getSenderIcon = (role?: string) => {
  switch (role) {
    case 'admin': return <Shield className="h-3 w-3" />;
    case 'seller': return <Store className="h-3 w-3" />;
    case 'agent': return <User className="h-3 w-3" />;
    default: return <User className="h-3 w-3" />;
  }
};

export const NotificationCenter = ({ trigger }: NotificationCenterProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  const user = useAppSelector((state) => state.auth.user);
  const notifications = useAppSelector((state) => state.ui.notifications);

  // Filter notifications by role and tab
  const filteredNotifications = notifications.filter((n) => {
    // Filter by user role
    if (n.role && n.role !== 'all' && n.role !== user?.role) return false;

    // Filter by tab
    if (activeTab !== 'all' && n.category !== activeTab) return false;

    // Filter by read status
    if (showUnreadOnly && n.read) return false;

    return true;
  });

  const unreadCount = filteredNotifications.filter((n) => !n.read).length;
  const totalUnread = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      dispatch(markNotificationRead(notification.id));
    }

    // Check if we should open details dialog
    if (notification.metadata) {
      setSelectedNotification(notification);
      setOpen(false);
      return;
    }

    if (notification.link) {
      navigate(notification.link);
      setOpen(false);
    }
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsRead());
  };

  const handleClearAll = () => {
    dispatch(clearNotifications());
  };

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(removeNotification(id));
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return t('notifications.justNow');
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`;
    } else {
      return format(date, 'MMM dd, yyyy');
    }
  };

  const categories = [
    { value: 'all', label: t('notifications.categories.all'), count: notifications.length },
    { value: 'order', label: t('notifications.categories.order'), count: notifications.filter(n => n.category === 'order').length },
    { value: 'message', label: t('notifications.categories.message'), count: notifications.filter(n => n.category === 'message').length },
    { value: 'system', label: t('notifications.categories.system'), count: notifications.filter(n => n.category === 'system').length },
  ];

  const PremiumTrigger = trigger || (
    <Button
      variant="ghost"
      size="icon"
      className="relative group rounded-full w-10 h-10 bg-gradient-to-br from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 border border-gray-200 shadow-sm"
    >
      <div className="relative">
        <Bell className="h-5 w-5 text-gray-600 group-hover:text-emerald-600 transition-colors" />
        {totalUnread > 0 && (
          <Badge className="absolute -right-4 -top-3 h-5 w-5 p-0 flex items-center justify-center text-[10px] bg-gradient-to-br from-emerald-500 to-emerald-600 text-white font-bold border-2 border-white shadow-sm">
            {totalUnread > 9 ? '9+' : totalUnread}
          </Badge>
        )}
      </div>
    </Button>
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        {PremiumTrigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[90vw] max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl p-0 border border-gray-200 shadow-xl rounded-xl overflow-hidden bg-white"
        sideOffset={5}
        collisionPadding={16}
      >
        {/* Header */}
        <div className="relative p-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <div className="absolute top-3 right-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-white/20 h-8 w-8"
              onClick={() => setOpen(false)}
              aria-label={t('notifications.dialog.close')}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 flex-shrink-0">
              <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                <Bell className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-lg truncate">{t('notifications.title')}</h3>
                <p className="text-sm text-gray-300 truncate">
                  {unreadCount > 0
                    ? t('notifications.unreadCount', { count: unreadCount })
                    : t('notifications.allRead')
                  }
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {totalUnread > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 h-8 shrink-0"
                  onClick={handleMarkAllRead}
                >
                  <Check className="h-4 w-4 mr-1 hidden sm:inline" />
                  <span className="hidden sm:inline">{t('notifications.markAllRead')}</span>
                  <span className="sm:hidden">Read</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-3 sm:px-4 pt-3 pb-3 border-b overflow-x-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex flex-wrap w-full gap-3 bg-transparent border-none shadow-none h-auto p-0">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.value}
                  value={cat.value}
                  className="flex-1 min-w-[80px] bg-white border border-gray-200 rounded-lg h-auto py-2.5 whitespace-normal text-center px-3 sm:px-4 font-medium transition-all duration-200 text-gray-700 hover:text-green-600 hover:border-green-300 hover:shadow-sm data-[state=active]:bg-green-600 data-[state=active]:text-white data-[state=active]:border-green-600 data-[state=active]:hover:bg-green-600 data-[state=active]:hover:text-white text-xs sm:text-sm"
                >
                  <span className="truncate">{cat.label}</span>
                  {cat.count > 0 && (
                    <Badge className={`ml-1.5 sm:ml-2 h-5 min-w-5 px-2 text-[10px] ${activeTab === cat.value ? 'bg-white text-green-600' : 'bg-emerald-500 text-white'}`}>
                      {cat.count > 9 ? '9+' : cat.count}
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Notifications List */}
        <ScrollArea className="h-[60vh] sm:h-96 max-h-[500px]">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-6 sm:p-8 text-center">
              <div className="p-4 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full mb-4">
                <Bell className="h-10 w-10 sm:h-12 sm:w-12 text-gray-300" />
              </div>
              <h3 className="font-semibold text-gray-700 mb-2 text-sm sm:text-base">
                {t('notifications.noNotifications')}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 max-w-xs">
                {t('notifications.noNotificationsDesc')}
              </p>
            </div>
          ) : (
            <div className="p-2 sm:p-3 space-y-2">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    "group relative p-3 sm:p-4 rounded-lg sm:rounded-xl border cursor-pointer transition-all duration-200 hover:shadow-sm sm:hover:shadow-md",
                    getNotificationColor(notification.type),
                    !notification.read && "ring-1 ring-emerald-500/20"
                  )}
                >
                  <div className="flex items-start gap-2 sm:gap-3">
                    {/* Icon */}
                    <div className={cn(
                      "flex-shrink-0 p-2 sm:p-3 rounded-md sm:rounded-lg",
                      getNotificationColor(notification.type).split(' ')[0]
                    )}>
                      {getNotificationIcon(notification.type, notification.category)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                            {notification.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1 leading-relaxed line-clamp-2">
                            {notification.message}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-5 w-5 sm:h-6 sm:w-6 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-1"
                          onClick={(e) => handleRemove(notification.id, e)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>

                      {/* Meta info */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-2 sm:mt-3 gap-1 sm:gap-0">
                        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{formatTime(notification.createdAt)}</span>
                          </span>

                          {notification.sender && (
                            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-600">
                              <div className={cn(
                                "p-1 rounded flex-shrink-0",
                                notification.sender.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                  notification.sender.role === 'seller' ? 'bg-blue-100 text-blue-700' :
                                    'bg-gray-100 text-gray-700'
                              )}>
                                {getSenderIcon(notification.sender.role)}
                              </div>
                              <span className="truncate max-w-[80px]">{notification.sender.name}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between sm:justify-end">
                          {notification.category && (
                            <span className="text-xs text-gray-500 capitalize sm:hidden">
                              {notification.category}
                            </span>
                          )}
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse ml-2"></div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      {notification.link && (
                        <div className="mt-2 sm:mt-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs border-gray-300 hover:border-emerald-300 hover:text-emerald-700 w-full sm:w-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNotificationClick(notification);
                            }}
                          >
                            {t('notifications.viewDetails')}
                            <ExternalLink className="ml-2 h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        {filteredNotifications.length > 0 && (
          <div className="p-3 border-t bg-gray-50">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-800 w-full justify-center"
              onClick={handleClearAll}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {t('notifications.clearAll')}
            </Button>
          </div>
        )}
      </DropdownMenuContent>
      <NotificationDetailsDialog
        open={!!selectedNotification}
        onOpenChange={(open) => !open && setSelectedNotification(null)}
        notification={selectedNotification}
      />
    </DropdownMenu>
  );
};