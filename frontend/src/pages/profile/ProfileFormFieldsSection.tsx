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
  email?: string;
  phone?: string;
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

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Name Fields Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* First Name - Read Only */}
        <div className="space-y-2">
          <Label
            htmlFor="firstName"
            className="text-sm font-semibold flex items-center gap-2 text-gray-700"
          >
            <User className="h-4 w-4 text-green-600" />
            {t('profile.firstName')}
          </Label>
          <div className="relative group">
            <Input
              id="firstName"
              value={getFirstName()}
              disabled
              className="bg-gray-50/80 border-gray-200 pr-10 disabled:opacity-70 group-hover:border-gray-300 transition-colors"
            />
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Shield className="h-3 w-3" />
            {t('profile.fieldCannotChange')}
          </p>
        </div>

        {/* Last Name - Read Only */}
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-semibold flex items-center gap-2 text-gray-700">
            <User className="h-4 w-4 text-green-600" />
            {t('profile.lastName')}
          </Label>
          <div className="relative group">
            <Input
              id="lastName"
              value={getLastName()}
              disabled
              className="bg-gray-50/80 border-gray-200 pr-10 disabled:opacity-70 group-hover:border-gray-300 transition-colors"
            />
            <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Shield className="h-3 w-3" />
            {t('profile.fieldCannotChange')}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100"></div>

      {/* Email - Editable for Buyers */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold flex items-center gap-2 text-gray-700">
          <Mail className="h-4 w-4 text-green-600" />
          {t('profile.email')}
          {isBuyer && <span className="text-green-600 text-base">*</span>}
          {isBuyer && isEditing && (
            <Badge variant="secondary" className="ml-2 text-xs">
              {t('profile.editable')}
            </Badge>
          )}
        </Label>
        {isEditing && editableFields.includes('email') ? (
          <div className="space-y-2">
            <Input
              id="email"
              type="email"
              {...register('email')}
              className="border-2 border-green-200 focus:border-green-400 focus:ring-green-400/20 transition-all"
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <span className="text-base">⚠</span>
                {errors.email.message}
              </p>
            )}
          </div>
        ) : (
          <div className="relative group">
            <Input
              id="email"
              value={user.email}
              disabled
              className="bg-gray-50/80 border-gray-200 pr-10 disabled:opacity-70 group-hover:border-gray-300 transition-colors"
            />
            {!isBuyer && (
              <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            )}
          </div>
        )}
        {!isBuyer && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Shield className="h-3 w-3" />
            {t('profile.emailCannotChange')}
          </p>
        )}
      </div>

      {/* NIC - Read Only */}
      <div className="space-y-2">
        <Label htmlFor="nic" className="text-sm font-semibold flex items-center gap-2 text-gray-700">
          <IdCard className="h-4 w-4 text-green-600" />
          {t('profile.nic')}
        </Label>
        <div className="relative group">
          <Input
            id="nic"
            value={user.nic || t('buyer.notProvided')}
            disabled
            className="bg-gray-50/80 border-gray-200 pr-10 disabled:opacity-70 group-hover:border-gray-300 transition-colors font-mono"
          />
          <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Shield className="h-3 w-3" />
          {t('profile.fieldCannotChange')}
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100"></div>

      {/* Phone - Editable for Buyers */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-sm font-semibold flex items-center gap-2 text-gray-700">
          <Phone className="h-4 w-4 text-green-600" />
          {t('profile.phone')}
          {isBuyer && <span className="text-green-600 text-base">*</span>}
          {isBuyer && isEditing && (
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
              className="border-2 border-green-200 focus:border-green-400 focus:ring-green-400/20 transition-all"
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
          <Input
            id="phone"
            value={user.phone || t('buyer.notProvided')}
            disabled
            className="bg-gray-50/80 border-gray-200 disabled:opacity-70"
          />
        )}
      </div>

      {/* Location Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* District - Editable for Buyers */}
        <div className="space-y-2">
          <Label htmlFor="district" className="text-sm font-semibold flex items-center gap-2 text-gray-700">
            <MapPin className="h-4 w-4 text-green-600" />
            {t('profile.district')}
            {isBuyer && <span className="text-green-600 text-base">*</span>}
            {isBuyer && isEditing && (
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
              <SelectTrigger className="border-2 border-green-200 focus:border-green-400 focus:ring-green-400/20 transition-all">
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
            <Input
              id="district"
              value={user.district || t('buyer.notProvided')}
              disabled
              className="bg-gray-50/80 border-gray-200 disabled:opacity-70"
            />
          )}
        </div>
      </div>

      {/* Address - Editable for Buyers */}
      <div className="space-y-2">
        <Label htmlFor="address" className="text-sm font-semibold flex items-center gap-2 text-gray-700">
          <MapPin className="h-4 w-4 text-green-600" />
          {t('profile.fullAddress')}
          {isBuyer && <span className="text-green-600 text-base">*</span>}
          {isBuyer && isEditing && (
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
          <Textarea
            id="address"
            value={user.address || t('buyer.notProvided')}
            disabled
            className="bg-gray-50/80 border-gray-200 disabled:opacity-70 min-h-[120px] resize-none"
          />
        )}
      </div>
    </div>
  );
};

