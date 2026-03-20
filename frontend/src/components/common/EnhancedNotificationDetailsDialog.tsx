import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Scale,
  Package,
  CreditCard,
  MessageSquare,
  Calendar,
  User,
  Store,
  ArrowRight,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import type { Notification } from '@/services/notificationService';

interface EnhancedNotificationDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notification: Notification | null;
}

export const EnhancedNotificationDetailsDialog = ({
  open,
  onOpenChange,
  notification,
}: EnhancedNotificationDetailsDialogProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!notification) return null;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'negotiation': return <Scale className="h-6 w-6 text-purple-600" />;
      case 'order': return <Package className="h-6 w-6 text-blue-600" />;
      case 'payment': return <CreditCard className="h-6 w-6 text-green-600" />;
      default: return <MessageSquare className="h-6 w-6 text-gray-600" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'low': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
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

  const handleActionClick = () => {
    if (notification.data?.actionUrl) {
      onOpenChange(false);
      navigate(notification.data.actionUrl);
    }
  };

  const renderNegotiationDetails = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Scale className="h-5 w-5 text-purple-600" />
            Negotiation Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notification.data?.negotiationId && (
            <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">Negotiation ID</p>
                <p className="text-sm text-gray-600 font-mono">{notification.data.negotiationId}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">Product ID</p>
                <p className="text-sm text-gray-600 font-mono">{notification.data.productId}</p>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm font-medium text-gray-700">Status</span>
              <Badge variant="outline" className="bg-purple-100 text-purple-800">
                Submitted
              </Badge>
            </div>
            
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm font-medium text-gray-700">Type</span>
              <span className="text-sm text-gray-600">Price Negotiation</span>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-gray-700">Next Step</span>
              <span className="text-sm text-gray-600">Waiting for seller response</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderOrderDetails = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5 text-blue-600" />
            Order Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {notification.data?.orderId && (
            <div className="grid grid-cols-1 gap-4 p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">Order ID</p>
                <p className="text-sm text-gray-600 font-mono">{notification.data.orderId}</p>
              </div>
            </div>
          )}
          
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm font-medium text-gray-700">Status</span>
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                Processing
              </Badge>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-gray-700">Type</span>
              <span className="text-sm text-gray-600">Product Order</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderPaymentDetails = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-green-600" />
            Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm font-medium text-gray-700">Status</span>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                Completed
              </Badge>
            </div>
            
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-gray-700">Type</span>
              <span className="text-sm text-gray-600">Payment Notification</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDetails = () => {
    switch (notification.type) {
      case 'negotiation': return renderNegotiationDetails();
      case 'order': return renderOrderDetails();
      case 'payment': return renderPaymentDetails();
      default: 
        return (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">General notification - no additional details available.</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl font-semibold text-gray-900 mb-2">
                {notification.title}
              </DialogTitle>
              <p className="text-gray-600 text-sm leading-relaxed">
                {notification.message}
              </p>
            </div>
          </div>
          
          {/* Notification metadata */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Badge variant="outline" className={getTypeColor(notification.type)}>
              {notification.type}
            </Badge>
            
            <div className="flex items-center gap-1 text-sm text-gray-500">
              {getPriorityIcon(notification.priority)}
              <span className="capitalize">{notification.priority} priority</span>
            </div>
            
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(notification.createdAt), 'PPp')}</span>
            </div>
            
            {!notification.isRead && (
              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                Unread
              </Badge>
            )}
          </div>
        </DialogHeader>

        <Separator />

        {/* Notification details based on type */}
        <div className="py-4">
          {renderDetails()}
        </div>

        <Separator />

        <DialogFooter className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};