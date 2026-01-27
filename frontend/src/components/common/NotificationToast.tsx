import { CheckCircle2, Bell, Scale, Package, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationToastProps {
  title: string;
  message: string;
  type: 'negotiation' | 'order' | 'payment' | 'general';
  action?: () => void;
  actionLabel?: string;
}

export const showNotificationToast = ({
  title,
  message,
  type,
  action,
  actionLabel = 'View Details'
}: NotificationToastProps) => {
  const getIcon = () => {
    switch (type) {
      case 'negotiation': return <Scale className="h-5 w-5 text-purple-600" />;
      case 'order': return <Package className="h-5 w-5 text-blue-600" />;
      case 'payment': return <CreditCard className="h-5 w-5 text-green-600" />;
      default: return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'negotiation': return 'border-l-purple-500 bg-purple-50';
      case 'order': return 'border-l-blue-500 bg-blue-50';
      case 'payment': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  toast.custom(() => (
    <div className={`
      flex items-start gap-3 p-4 bg-white rounded-lg shadow-lg border-l-4 ${getColor()}
      max-w-md mx-auto animate-in slide-in-from-top-5 duration-300
    `}>
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{message}</p>
        {action && (
          <button
            onClick={action}
            className="text-xs font-medium text-blue-600 hover:text-blue-800 mt-2 transition-colors"
          >
            {actionLabel}
          </button>
        )}
      </div>
      <div className="flex-shrink-0">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
      </div>
    </div>
  ), {
    duration: 5000,
    position: 'top-right'
  });
};