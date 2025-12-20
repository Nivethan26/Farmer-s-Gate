import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, MapPin, Award as IdCard, Lock, Shield } from 'lucide-react';
import type { User as AuthUser } from '@/store/authSlice';

type ProfileFormData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  nic?: string;
  address?: string;
  district?: string;
};

interface ProfileFormFieldsSectionProps {
  user: AuthUser;
  isBuyer: boolean;
  isEditing: boolean;
  editableFields: string[];
  register: UseFormRegister<ProfileFormData>;
  errors: FieldErrors<ProfileFormData>;
  setValue: UseFormSetValue<ProfileFormData>;
  watch: UseFormWatch<ProfileFormData>;
  getFirstName: () => string;
  getLastName: () => string;
  sriLankaDistricts: string[];
}

export const ProfileFormFieldsSection = ({
  user,
  isBuyer,
  isEditing,
  editableFields,
  register,
  errors,
  setValue,
  watch,
  getFirstName,
  getLastName,
  sriLankaDistricts,
}: ProfileFormFieldsSectionProps) => {
  const { t } = useTranslation();
  const selectedDistrict = watch('district') || '';

  // Helper function to check if field is editable
  const isFieldEditable = (fieldName: string) => {
    return isEditing && editableFields.includes(fieldName);
  };

  return (
    <div className="pt-4 space-y-6 sm:pt-6 sm:space-y-8">
      {/* Name Fields Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* First Name */}
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-semibold flex items-center gap-2 text-gray-700">
            <User className="h-4 w-4 text-green-600" />
            {t('profile.firstName')}
            {isBuyer && isFieldEditable('firstName') && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {t('profile.editable')}
              </Badge>
            )}
          </Label>
          {isEditing ? (
            <Input id="firstName" {...register('firstName')} className="w-full max-w-lg lg:max-w-md border-2 border-green-200 focus:border-green-400 transition-all" />
          ) : (
            <div className="relative group">
              <Input
                id="firstName"
                value={getFirstName()}
                disabled
                className="bg-gray-50/80 border-gray-200 pr-10 disabled:opacity-70 group-hover:border-gray-300 transition-colors"
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-semibold flex items-center gap-2 text-gray-700">
            <User className="h-4 w-4 text-green-600" />
            {t('profile.lastName')}
            {isBuyer && isFieldEditable('lastName') && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {t('profile.editable')}
              </Badge>
            )}
          </Label>
          {isEditing ? (
            <Input id="lastName" {...register('lastName')} className="w-full max-w-lg lg:max-w-md border-2 border-green-200 focus:border-green-400 transition-all" />
          ) : (
            <div className="relative group">
              <Input
                id="lastName"
                value={getLastName()}
                disabled
                className="bg-gray-50/80 border-gray-200 pr-10 disabled:opacity-70 group-hover:border-gray-300 transition-colors"
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100"></div>

      {/* Email + NIC Row (email and NIC are read-only) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2 text-gray-700">
            <Mail className="h-4 w-4 text-green-600" />
            {t('profile.email')}
          </Label>
          <div className="relative group">
            <Input
              id="email"
              value={user.email}
              disabled
              className="w-full max-w-lg lg:max-w-md bg-gray-50/80 border-gray-200 pr-10 disabled:opacity-70 group-hover:border-gray-300 transition-colors"
            />
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Shield className="h-3 w-3" />
            {t('profile.fieldCannotChange')}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="nic" className="text-sm font-semibold flex items-center gap-2 text-gray-700">
            <IdCard className="h-4 w-4 text-green-600" />
            {t('profile.nic')}
            {isBuyer && isFieldEditable('nic') && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {t('profile.editable')}
              </Badge>
            )}
          </Label>
          {isEditing ? (
            <Input id="nic" {...register('nic')} className="w-full max-w-lg lg:max-w-md border-2 border-green-200 focus:border-green-400 transition-all font-mono" />
          ) : (
            <div className="relative group">
              <Input
                id="nic"
                value={user.nic || t('buyer.notProvided')}
                disabled
                className="w-full max-w-lg lg:max-w-md bg-gray-50/80 border-gray-200 pr-10 disabled:opacity-70 group-hover:border-gray-300 transition-colors font-mono"
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100"></div>

      {/* Phone + District Row (editable when allowed) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-semibold flex items-center gap-2 text-gray-700">
            <Phone className="h-4 w-4 text-green-600" />
            {t('profile.phone')}
            {isBuyer && <span className="text-green-600 text-base">*</span>}
            {isBuyer && isFieldEditable('phone') && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {t('profile.editable')}
              </Badge>
            )}
          </Label>
          {isEditing && editableFields.includes('phone') ? (
            <div className="space-y-2">
              <Input
                id="phone"
                {...register('phone')}
                className="w-full max-w-lg lg:max-w-md border-2 border-green-200 focus:border-green-400 focus:ring-green-400/20 transition-all"
                placeholder={t('profile.enterPhone')}
              />
              {errors.phone && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <span className="text-base">⚠</span>
                  {errors.phone.message}
                </p>
              )}
            </div>
          ) : (
            <div className="relative group">
              <Input
                id="phone"
                value={user.phone || t('buyer.notProvided')}
                disabled
                className="w-full max-w-lg lg:max-w-md bg-gray-50/80 border-gray-200 pr-10 disabled:opacity-70"
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="district" className="text-sm font-semibold flex items-center gap-2 text-gray-700">
            <MapPin className="h-4 w-4 text-green-600" />
            {t('profile.district')}
            {isBuyer && <span className="text-green-600 text-base">*</span>}
            {isBuyer && isFieldEditable('district') && (
              <Badge variant="secondary" className="ml-2 text-xs">
                {t('profile.editable')}
              </Badge>
            )}
          </Label>
          <input type="hidden" {...register('district')} />
          {isEditing && editableFields.includes('district') ? (
            <Select
              value={selectedDistrict}
              onValueChange={(value) => setValue('district', value, { shouldDirty: true })}
            >
              <SelectTrigger className="w-full max-w-lg lg:max-w-md border-2 border-green-200 focus:border-green-400 focus:ring-green-400/20 transition-all">
                <SelectValue placeholder={t('profile.selectDistrict')} />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {sriLankaDistricts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="relative group">
              <Input
                id="district"
                value={user.district || t('buyer.notProvided')}
                disabled
                className="w-full max-w-lg lg:max-w-md bg-gray-50/80 border-gray-200 pr-10 disabled:opacity-70"
              />
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Address - Editable for Buyers */}
      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-semibold flex items-center gap-2 text-gray-700">
          <MapPin className="h-4 w-4 text-green-600" />
          {t('profile.fullAddress')}
          {isBuyer && <span className="text-green-600 text-base">*</span>}
          {isBuyer && isFieldEditable('address') && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {t('profile.editable')}
            </Badge>
          )}
        </Label>
        {isEditing && editableFields.includes('address') ? (
          <Textarea
            id="address"
            {...register('address')}
            className="border-2 border-green-200 focus:border-green-400 focus:ring-green-400/20 transition-all min-h-[120px] resize-none"
            placeholder={t('profile.addressPlaceholder')}
          />
        ) : (
          <div className="relative group">
            <Textarea
              id="address"
              value={user.address || t('buyer.notProvided')}
              disabled
              className="bg-gray-50/80 border-gray-200 pr-10 disabled:opacity-70 min-h-[120px] resize-none"
            />
            <Lock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        )}
      </div>
    </div>
  );
};