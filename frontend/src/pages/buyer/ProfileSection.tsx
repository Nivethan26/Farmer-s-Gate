import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppDispatch } from '@/store/hooks';
import { updateProfile } from '@/store/authSlice';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { ProfileCardHeaderSection } from '@/pages/profile/ProfileCardHeaderSection';
import { ProfileFormFieldsSection } from '@/pages/profile/ProfileFormFieldsSection';
import { ProfileActionButtonsSection } from '@/pages/profile/ProfileActionButtonsSection';
import type { User } from '@/store/authSlice';

interface ProfileSectionProps {
  user: User | null;
}

const profileSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
  address: z.string().optional(),
  district: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export const ProfileSection = ({ user }: ProfileSectionProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
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
      email: user?.email || '',
      phone: user?.phone || '',
      address: user?.address || '',
      district: user?.district || '',
    },
  });

  if (!user) return null;

  const onSubmit = (data: ProfileFormData) => {
    const updates: any = {
      email: data.email,
      phone: data.phone,
      address: data.address,
      district: data.district,
    };

    dispatch(updateProfile(updates));
    toast.success(t('profile.updateSuccess'));
    setIsEditing(false);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  const isBuyer = user.role === 'buyer';
  const editableFields = isBuyer ? ['email', 'phone', 'address', 'district'] : [];

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

            <ProfileActionButtonsSection isEditing={isEditing} onCancel={handleCancel} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
