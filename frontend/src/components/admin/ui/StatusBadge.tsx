import { Badge } from '@/components/ui/badge';
import { getStatusColor } from '@/utils/adminUtils';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => (
  <Badge variant="outline" className={getStatusColor(status)}>
    {status}
  </Badge>
);