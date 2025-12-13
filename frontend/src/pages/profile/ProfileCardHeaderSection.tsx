import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit2 } from 'lucide-react';
import type { User } from '@/store/authSlice';

interface ProfileCardHeaderSectionProps {
  user: User;
  isBuyer: boolean;
  isEditing: boolean;
  onEditClick: () => void;
}

export const ProfileCardHeaderSection = ({
  user,
  isBuyer,
  isEditing,
  onEditClick,
}: ProfileCardHeaderSectionProps) => {
  return (
    <CardHeader className="pb-6 space-y-4 bg-gradient-to-br from-green-50/50 to-emerald-50/30 border-b">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <CardTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse"></div>
              Personal Information
            </CardTitle>
            <Badge variant="outline" className="border-green-300 text-green-700 bg-green-50">
              {user.role === 'buyer' ? 'Buyer Account' : 'Seller Account'}
            </Badge>
          </div>
          <CardDescription className="text-xs sm:text-sm">
            {isBuyer
              ? 'You can update your email, phone, address, and district'
              : 'Update your personal details'}
          </CardDescription>
        </div>

        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={onEditClick}
            className="border-2 border-green-300 hover:bg-green-50 hover:border-green-400 transition-all duration-200 shadow-sm hover:shadow-md w-full sm:w-auto"
          >
            <Edit2 className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </div>
    </CardHeader>
  );
};

