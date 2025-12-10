import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import type { RootState } from '@/store';
import { updateProfile } from '@/store/authSlice';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Mail, Phone, MapPin, IdCard, Edit2, Save, X, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

// Profile schema - only editable fields for buyers
const profileSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
  address: z.string().optional(),
  district: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const sriLankaDistricts = [
  'Colombo',
  'Gampaha',
  'Kalutara',
  'Kandy',
  'Matale',
  'Nuwara Eliya',
  'Galle',
  'Matara',
  'Hambantota',
  'Jaffna',
  'Kilinochchi',
  'Mannar',
  'Mullaitivu',
  'Vavuniya',
  'Puttalam',
  'Kurunegala',
  'Anuradhapura',
  'Polonnaruwa',
  'Badulla',
  'Monaragala',
  'Ratnapura',
  'Kegalle',
  'Trincomalee',
  'Batticaloa',
  'Ampara',
];

const AccountProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);

  // Split name into first and last name if available, otherwise use name
  const getFirstName = () => {
    if (user?.firstName) return user.firstName;
    if (user?.name) {
      const parts = user.name.split(' ');
      return parts[0] || user.name;
    }
    return '';
  };

  const getLastName = () => {
    if (user?.lastName) return user.lastName;
    if (user?.name) {
      const parts = user.name.split(' ');
      return parts.slice(1).join(' ') || '';
    }
    return '';
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      district: user?.district || '',
    },
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const onSubmit = (data: ProfileFormData) => {
    const updates: any = {
      email: data.email,
      phone: data.phone,
      address: data.address,
      district: data.district,
    };

    // For sellers, include additional fields
    if (user.role === 'seller') {
      // Seller-specific updates can be added here
    }

    dispatch(updateProfile(updates));
    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  // For buyers, only these fields are editable
  const isBuyer = user.role === 'buyer';
  const editableFields = isBuyer ? ['email', 'phone', 'address', 'district'] : [];
  const selectedDistrict = watch('district') || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-green-50/30">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-4 hover:bg-green-50 hover:text-green-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-poppins bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
            My Profile
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Main Profile Card */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <div className="h-1 w-1 rounded-full bg-green-600"></div>
                    Personal Information
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {isBuyer ? 'You can update your email, phone, address, and district' : 'Update your personal details'}
                  </CardDescription>
                </div>
                {!isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="border-2 hover:bg-green-50 hover:border-green-300"
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Read-only Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* First Name - Read Only */}
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-semibold flex items-center gap-2">
                      <User className="h-4 w-4 text-green-600" />
                      First Name
                    </Label>
                    <div className="relative">
                      <Input
                        id="firstName"
                        value={getFirstName()}
                        disabled
                        className="bg-gray-50 border-gray-200 pr-10"
                      />
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">This field cannot be changed</p>
                  </div>

                  {/* Last Name - Read Only */}
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-semibold flex items-center gap-2">
                      <User className="h-4 w-4 text-green-600" />
                      Last Name
                    </Label>
                    <div className="relative">
                      <Input
                        id="lastName"
                        value={getLastName()}
                        disabled
                        className="bg-gray-50 border-gray-200 pr-10"
                      />
                      <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">This field cannot be changed</p>
                  </div>
                </div>

                {/* Email - Editable for Buyers */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2">
                    <Mail className="h-4 w-4 text-green-600" />
                    Email Address
                    {isBuyer && <span className="text-green-600">*</span>}
                  </Label>
                  {isEditing && editableFields.includes('email') ? (
                    <>
                      <Input
                        id="email"
                        type="email"
                        {...register('email')}
                        className="border-2 focus:border-green-400"
                        placeholder="your.email@example.com"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </>
                  ) : (
                    <div className="relative">
                      <Input
                        id="email"
                        value={user.email}
                        disabled
                        className="bg-gray-50 border-gray-200 pr-10"
                      />
                      {!isBuyer && (
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  )}
                  {!isBuyer && (
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  )}
                </div>

                {/* NIC - Read Only */}
                <div className="space-y-2">
                  <Label htmlFor="nic" className="text-sm font-semibold flex items-center gap-2">
                    <IdCard className="h-4 w-4 text-green-600" />
                    NIC Number
                  </Label>
                  <div className="relative">
                    <Input
                      id="nic"
                      value={user.nic || 'Not provided'}
                      disabled
                      className="bg-gray-50 border-gray-200 pr-10"
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                  <p className="text-xs text-muted-foreground">This field cannot be changed</p>
                </div>

                {/* Phone - Editable for Buyers */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-semibold flex items-center gap-2">
                    <Phone className="h-4 w-4 text-green-600" />
                    Phone Number
                    {isBuyer && <span className="text-green-600">*</span>}
                  </Label>
                  {isEditing && editableFields.includes('phone') ? (
                    <>
                      <Input
                        id="phone"
                        {...register('phone')}
                        className="border-2 focus:border-green-400"
                        placeholder="+94771234567"
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-600">{errors.phone.message}</p>
                      )}
                    </>
                  ) : (
                    <Input
                      id="phone"
                      value={user.phone || 'Not provided'}
                      disabled
                      className="bg-gray-50 border-gray-200"
                    />
                  )}
                </div>

                {/* District - Editable for Buyers */}
                <div className="space-y-2">
                  <Label htmlFor="district" className="text-sm font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    District
                    {isBuyer && <span className="text-green-600">*</span>}
                  </Label>
                  <input type="hidden" {...register('district')} />
                  {isEditing && editableFields.includes('district') ? (
                    <Select
                      value={selectedDistrict}
                      onValueChange={(value) => setValue('district', value, { shouldDirty: true })}
                    >
                      <SelectTrigger className="border-2 focus:border-green-400">
                        <SelectValue placeholder="Select your district" />
                      </SelectTrigger>
                      <SelectContent>
                        {sriLankaDistricts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="district"
                      value={user.district || 'Not provided'}
                      disabled
                      className="bg-gray-50 border-gray-200"
                    />
                  )}
                </div>

                {/* Address - Editable for Buyers */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-green-600" />
                    Address
                    {isBuyer && <span className="text-green-600">*</span>}
                  </Label>
                  {isEditing && editableFields.includes('address') ? (
                    <Textarea
                      id="address"
                      {...register('address')}
                      className="border-2 focus:border-green-400 min-h-[100px]"
                      placeholder="Enter your full address"
                    />
                  ) : (
                    <Textarea
                      id="address"
                      value={user.address || 'Not provided'}
                      disabled
                      className="bg-gray-50 border-gray-200 min-h-[100px]"
                    />
                  )}
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-500/30"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="border-2"
                    >
                      <X className="mr-2 h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          {/* Side Info Card
          <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-emerald-50/50">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-white/80 rounded-xl border border-green-200">
                <p className="text-xs text-muted-foreground mb-1">Account Type</p>
                <p className="text-lg font-bold text-gray-900 capitalize">{user.role}</p>
              </div>
              
              {user.rewardPoints !== undefined && (
                <div className="p-4 bg-white/80 rounded-xl border border-green-200">
                  <p className="text-xs text-muted-foreground mb-1">Reward Points</p>
                  <p className="text-2xl font-bold text-green-600">{user.rewardPoints || 0}</p>
                </div>
              )}

              <div className="p-4 bg-white/80 rounded-xl border border-green-200">
                <p className="text-xs text-muted-foreground mb-1">User ID</p>
                <p className="text-sm font-mono text-gray-700">{user.id}</p>
              </div>

              {isBuyer && (
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-xs text-blue-800 mb-1">Editable Fields</p>
                  <ul className="text-xs text-blue-700 space-y-1">
                    <li>• Email Address</li>
                    <li>• Phone Number</li>
                    <li>• Address</li>
                    <li>• District</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
};

export default AccountProfile;
