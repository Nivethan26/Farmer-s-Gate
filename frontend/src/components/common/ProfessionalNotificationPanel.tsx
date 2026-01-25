import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { 
  fetchNotifications, 
  fetchUnreadCount, 
  markNotificationAsRead,
  markAllNotificationsAsRead 
} from '@/store/notificationSlice';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Bell, 
  Package, 
  Scale, 
  CreditCard, 
  MessageSquare, 
  CheckCheck, 
  X, 
  Loader2,
  Eye,
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import type { Notification } from '@/services/notificationService';
import { EnhancedNotificationDetailsDialog } from './EnhancedNotificationDetailsDialog';

export const ProfessionalNotificationPanel = () => {
  const dispatch = useAppDispatch();
  const { notifications, unreadCount, loading } = useAppSelector((state) => state.notifications);
  const user = useAppSelector((state) => state.auth.user);
  
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (user) {
      // Initial unread count fetch when component mounts
      dispatch(fetchUnreadCount());
      
      // Poll for unread count every 15 seconds for more responsive updates
      const unreadCountInterval = setInterval(() => {
        dispatch(fetchUnreadCount());
      }, 15000);
      
      return () => clearInterval(unreadCountInterval);
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (user && isOpen) {
      // Only fetch full notifications when dropdown is opened
      dispatch(fetchNotifications({ page: 1, limit: 10 }));
    }
  }, [dispatch, user, isOpen]);

  // Auto-refresh notifications every 30 seconds
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        dispatch(fetchUnreadCount());
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [dispatch, user]);

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read if unread
    if (!notification.isRead) {
      try {
        await dispatch(markNotificationAsRead(notification._id));
        // Refresh unread count to ensure it's in sync
        dispatch(fetchUnreadCount());
      } catch (error) {
        console.error('Failed to mark notification as read:', error);
      }
    }
    
    // Show details
    setSelectedNotification(notification);
    setDetailsOpen(true);
  };

  const handleMarkAllAsRead = async () => {
    try {
      await dispatch(markAllNotificationsAsRead());
      // Refresh unread count to ensure it's in sync
      dispatch(fetchUnreadCount());
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'negotiation': return <Scale className="h-4 w-4" />;
      case 'order': return <Package className="h-4 w-4" />;
      case 'payment': return <CreditCard className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'negotiation': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'order': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'payment': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  return (
    <>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative hover:bg-gray-50 hover:text-gray-900 transition-colors duration-200"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs p-0 min-w-[1.25rem] animate-pulse"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent 
          className="w-96 p-0 shadow-xl border-0" 
          align="end"
          sideOffset={8}
        >
          <Card className="border-0 shadow-2xl">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <p className="text-sm text-gray-600">
                      {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
                    </p>
                  )}
                </div>
                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                    className="text-xs hover:bg-gray-100"
                  >
                    <CheckCheck className="h-3 w-3 mr-1" />
                    Mark all read
                  </Button>
                )}
              </div>
            </CardHeader>
            
            <Separator />
            
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                  <span className="ml-2 text-sm text-gray-600">Loading notifications...</span>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6">
                  <Bell className="h-12 w-12 text-gray-300 mb-3" />
                  <h4 className="font-medium text-gray-900 mb-1">No notifications yet</h4>
                  <p className="text-sm text-gray-500 text-center">
                    You'll see notifications about your orders, negotiations, and other activities here.
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-80">
                  <div className="space-y-1">
                    {notifications.map((notification, index) => (
                      <div key={notification._id}>
                        <div
                          className={`
                            relative p-4 cursor-pointer transition-all duration-200 hover:bg-gray-50 group
                            ${!notification.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : ''}
                          `}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex items-start space-x-3">
                            {/* Icon */}
                            <div className={`
                              flex-shrink-0 p-2 rounded-lg
                              ${notification.type === 'negotiation' ? 'bg-purple-100 text-purple-600' : ''}
                              ${notification.type === 'order' ? 'bg-blue-100 text-blue-600' : ''}
                              ${notification.type === 'payment' ? 'bg-green-100 text-green-600' : ''}
                              ${notification.type === 'general' ? 'bg-gray-100 text-gray-600' : ''}
                            `}>
                              {getNotificationIcon(notification.type)}
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className={`
                                    text-sm font-medium truncate
                                    ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}
                                  `}>
                                    {notification.title}
                                  </h4>
                                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {notification.message}
                                  </p>
                                  
                                  {/* Meta info */}
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs ${getTypeColor(notification.type)}`}
                                    >
                                      {notification.type}
                                    </Badge>
                                    <span className="text-xs text-gray-500">
                                      {formatTimeAgo(notification.createdAt)}
                                    </span>
                                    {!notification.isRead && (
                                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                    )}
                                  </div>
                                </div>
                                
                                {/* Priority indicator */}
                                {notification.priority === 'high' && (
                                  <div className="flex-shrink-0 ml-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full" />
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Hover actions */}
                            <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleNotificationClick(notification);
                                }}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        {index < notifications.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
              
              {notifications.length > 0 && (
                <>
                  <Separator />
                  <div className="p-3">
                    <Button 
                      variant="ghost" 
                      className="w-full text-sm text-gray-600 hover:text-gray-900"
                      onClick={() => {
                        setIsOpen(false);
                        // Navigate to full notifications page if you have one
                      }}
                    >
                      View all notifications
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Notification Details Dialog */}
      <EnhancedNotificationDetailsDialog
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        notification={selectedNotification}
      />
    </>
  );
};