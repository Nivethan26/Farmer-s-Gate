import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateUserProfile } from '@/store/authSlice';
import type { RootState } from '@/store';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { ProfileCardHeaderSection } from '@/pages/profile/ProfileCardHeaderSection';
import { ProfileFormFieldsSection } from '@/pages/profile/ProfileFormFieldsSection';
import { ProfileActionButtonsSection } from '@/pages/profile/ProfileActionButtonsSection';
import { ChangePasswordForm } from '@/components/common/ChangePasswordForm';
import type { User } from '@/store/authSlice';

interface ProfileSectionProps {
  user: User | null;
}

const profileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
  address: z.string().optional(),
  district: z.string().optional(),
  nic: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfileSection = ({ user }: ProfileSectionProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state: RootState) => state.auth.loading);
  const [isEditing, setIsEditing] = useState(false);

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
      firstName: getFirstName(),
      lastName: getLastName(),
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      district: user?.district || '',
      nic: user?.nic || '',
    },
  });

  if (!user) return null;

  const onSubmit = async (data: ProfileFormData) => {
    try {
      // Only include fields that have actually changed
      const updates: any = {};
      
      if (data.firstName !== getFirstName()) updates.firstName = data.firstName;
      if (data.lastName !== getLastName()) updates.lastName = data.lastName;
      if (data.email !== user.email) updates.email = data.email;
      if (data.phone !== user.phone) updates.phone = data.phone;
      if (data.address !== user.address) updates.address = data.address;
      if (data.district !== user.district) updates.district = data.district;
      if (data.nic !== user.nic) updates.nic = data.nic;

      // Only make API call if there are actual changes
      if (Object.keys(updates).length === 0) {
        toast.info("No changes to save");
        setIsEditing(false);
        return;
      }

      const result = await dispatch(updateUserProfile(updates));
      
      if (updateUserProfile.fulfilled.match(result)) {
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        throw new Error(result.payload as string);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleCancel = () => {
    reset({
      firstName: getFirstName(),
      lastName: getLastName(),
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      district: user?.district || '',
      nic: user?.nic || '',
    });
    setIsEditing(false);
  };

  const isBuyer = user.role === 'buyer';
  const editableFields = isBuyer ? ['firstName', 'lastName', 'phone', 'address', 'district', 'nic'] : [];

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

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <ProfileCardHeaderSection
          user={user}
          isBuyer={isBuyer}
          isEditing={isEditing}
          onEditClick={() => setIsEditing(true)}
        />

        <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <ProfileFormFieldsSection
              user={user}
              isBuyer={isBuyer}
              isEditing={isEditing}
              editableFields={editableFields}
              register={register}
              errors={errors}
              setValue={setValue}
              watch={watch}
              getFirstName={getFirstName}
              getLastName={getLastName}
              sriLankaDistricts={sriLankaDistricts}
            />

            <ProfileActionButtonsSection 
              isEditing={isEditing} 
              isLoading={isLoading}
              onCancel={handleCancel} 
            />
          </form>
        </CardContent>
      </Card>

      {/* Change Password Section */}
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardContent className="px-4 sm:px-6 py-4 sm:py-6">
          <h3 className="text-lg font-semibold mb-4">Change Password</h3>
          <ChangePasswordForm />
        </CardContent>
      </Card>
    </div>
  );
};
