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
import { toast } from 'sonner';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  address: z.string().optional(),
  district: z.string().optional(),
  farmName: z.string().optional(),
  bankAccountName: z.string().optional(),
  bankAccountNo: z.string().optional(),
  bankName: z.string().optional(),
  bankBranch: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const AccountProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      address: user?.address || '',
      district: user?.district || '',
      farmName: user?.farmName || '',
      bankAccountName: user?.bank?.accountName || '',
      bankAccountNo: user?.bank?.accountNo || '',
      bankName: user?.bank?.bankName || '',
      bankBranch: user?.bank?.branch || '',
    },
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const onSubmit = (data: ProfileFormData) => {
    const updates: any = {
      name: data.name,
      phone: data.phone,
      address: data.address,
      district: data.district,
    };

    if (user.role === 'seller') {
      updates.farmName = data.farmName;
      updates.bank = {
        accountName: data.bankAccountName || '',
        accountNo: data.bankAccountNo || '',
        bankName: data.bankName || '',
        branch: data.bankBranch || '',
      };
    }

    dispatch(updateProfile(updates));
    toast.success(t('profile.updateSuccess'));
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              ← {t('common.back')}
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t('nav.account')}</CardTitle>
              <CardDescription>
                {t('profile.manageInfo')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Common Fields */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email">{t('common.email')}</Label>
                    <Input
                      id="email"
                      value={user.email}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground mt-1">{t('profile.emailCannotChange')}</p>
                  </div>

                  <div>
                    <Label htmlFor="role">{t('profile.role')}</Label>
                    <Input
                      id="role"
                      value={user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      disabled
                      className="bg-muted capitalize"
                    />
                  </div>

                  <div>
                    <Label htmlFor="name">{t('profile.name')} *</Label>
                    <Input
                      id="name"
                      {...register('name')}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-muted' : ''}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">{t('profile.phone')} *</Label>
                    <Input
                      id="phone"
                      {...register('phone')}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-muted' : ''}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="district">{t('profile.district')}</Label>
                    <Input
                      id="district"
                      {...register('district')}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-muted' : ''}
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">{t('profile.address')}</Label>
                    <Textarea
                      id="address"
                      {...register('address')}
                      disabled={!isEditing}
                      className={!isEditing ? 'bg-muted' : ''}
                    />
                  </div>
                </div>

                {/* Seller-specific Fields */}
                {user.role === 'seller' && (
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="font-semibold text-lg">{t('profile.farmInfo')}</h3>
                    
                    <div>
                      <Label htmlFor="farmName">{t('profile.farmName')}</Label>
                      <Input
                        id="farmName"
                        {...register('farmName')}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-muted' : ''}
                      />
                    </div>

                    <h3 className="font-semibold text-lg mt-6">{t('profile.bankDetails')}</h3>
                    
                    <div>
                      <Label htmlFor="bankAccountName">{t('profile.accountName')}</Label>
                      <Input
                        id="bankAccountName"
                        {...register('bankAccountName')}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-muted' : ''}
                      />
                    </div>

                    <div>
                      <Label htmlFor="bankAccountNo">{t('profile.accountNumber')}</Label>
                      <Input
                        id="bankAccountNo"
                        {...register('bankAccountNo')}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-muted' : ''}
                      />
                    </div>

                    <div>
                      <Label htmlFor="bankName">{t('profile.bankName')}</Label>
                      <Input
                        id="bankName"
                        {...register('bankName')}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-muted' : ''}
                      />
                    </div>

                    <div>
                      <Label htmlFor="bankBranch">{t('profile.branch')}</Label>
                      <Input
                        id="bankBranch"
                        {...register('bankBranch')}
                        disabled={!isEditing}
                        className={!isEditing ? 'bg-muted' : ''}
                      />
                    </div>
                  </div>
                )}

                {/* Agent-specific Fields */}
                {user.role === 'agent' && user.regions && (
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="font-semibold text-lg">{t('profile.agentInfo')}</h3>
                    
                    <div>
                      <Label>{t('profile.assignedRegions')}</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {user.regions.map((region) => (
                          <span
                            key={region}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            {region}
                          </span>
                        ))}
                      </div>
                    </div>

                    {user.officeContact && (
                      <div>
                        <Label>{t('profile.officeContact')}</Label>
                        <Input value={user.officeContact} disabled className="bg-muted" />
                      </div>
                    )}
                  </div>
                )}

                {/* Admin-specific Fields */}
                {user.role === 'admin' && user.permissions && (
                  <div className="space-y-4 border-t pt-6">
                    <h3 className="font-semibold text-lg">{t('profile.adminInfo')}</h3>
                    
                    <div>
                      <Label>{t('profile.permissions')}</Label>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {user.permissions.map((permission) => (
                          <span
                            key={permission}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  {!isEditing ? (
                    <Button type="button" onClick={() => setIsEditing(true)}>
                      {t('profile.editProfile')}
                    </Button>
                  ) : (
                    <>
                      <Button type="submit">{t('profile.saveChanges')}</Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        {t('common.cancel')}
                      </Button>
                    </>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AccountProfile;
