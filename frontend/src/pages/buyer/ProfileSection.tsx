import { Link } from 'react-router-dom';
import { TFunction } from 'i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { User } from '@/store/authSlice';

interface ProfileSectionProps {
  t: TFunction;
  user: User | null;
}

export const ProfileSection = ({ t, user }: ProfileSectionProps) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6 pt-4 sm:pt-6">
          <CardTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-green-600"></div>
            My Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="space-y-4 sm:space-y-6">
            {/* Profile Info */}
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xl">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-base sm:text-lg">{user?.name}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild className="md:ml-auto md:self-start text-xs sm:text-sm">
                <Link to="/profile">Edit Profile</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Contact Information</h4>
                <div className="grid grid-cols-1 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <p className="text-muted-foreground text-[10px] sm:text-xs">Phone</p>
                    <p className="font-medium mt-1">{user?.phone || 'Not provided'}</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <p className="text-muted-foreground text-[10px] sm:text-xs">District</p>
                    <p className="font-medium mt-1">{user?.district || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Account Details</h4>
                <div className="grid grid-cols-1 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <p className="text-muted-foreground text-[10px] sm:text-xs">Reward Points</p>
                    <p className="font-medium text-purple-700 mt-1">{user?.rewardPoints || 0} points</p>
                  </div>
                  <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <p className="text-muted-foreground text-[10px] sm:text-xs">NIC</p>
                    <p className="font-medium mt-1">{user?.nic || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

