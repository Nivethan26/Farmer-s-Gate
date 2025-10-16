import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Sprout } from 'lucide-react';
import { toast } from 'sonner';

const buyerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  district: z.string().min(1, 'District is required'),
  address: z.string().min(5, 'Address is required'),
});

const sellerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  farmName: z.string().min(2, 'Farm name is required'),
  district: z.string().min(1, 'District is required'),
  address: z.string().min(5, 'Address is required'),
  bankAccountName: z.string().min(2, 'Account name is required'),
  bankAccountNo: z.string().min(5, 'Account number is required'),
  bankName: z.string().min(2, 'Bank name is required'),
  bankBranch: z.string().min(2, 'Branch is required'),
});

type BuyerFormData = z.infer<typeof buyerSchema>;
type SellerFormData = z.infer<typeof sellerSchema>;

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('buyer');

  const buyerForm = useForm<BuyerFormData>({
    resolver: zodResolver(buyerSchema),
  });

  const sellerForm = useForm<SellerFormData>({
    resolver: zodResolver(sellerSchema),
  });

  const onBuyerSubmit = (data: BuyerFormData) => {
    console.log('Buyer signup:', data);
    toast.success(t('auth.buyerAccountCreated'));
    navigate('/login');
  };

  const onSellerSubmit = (data: SellerFormData) => {
    console.log('Seller signup:', data);
    toast.success(t('auth.sellerApplicationSubmitted'));
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <Card className="w-full max-w-2xl animate-fade-in">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary p-3">
              <Sprout className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl font-poppins">{t('auth.joinTitle')}</CardTitle>
          <CardDescription>{t('auth.createAccount')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="buyer">{t('auth.buyer')}</TabsTrigger>
              <TabsTrigger value="seller">{t('auth.farmerSeller')}</TabsTrigger>
            </TabsList>

            {/* Buyer Signup */}
            <TabsContent value="buyer">
              <form onSubmit={buyerForm.handleSubmit(onBuyerSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="buyer-name">{t('profile.name')} *</Label>
                  <Input
                    id="buyer-name"
                    {...buyerForm.register('name')}
                    placeholder="John Doe"
                  />
                  {buyerForm.formState.errors.name && (
                    <p className="text-sm text-destructive mt-1">
                      {buyerForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="buyer-email">{t('common.email')} *</Label>
                  <Input
                    id="buyer-email"
                    type="email"
                    {...buyerForm.register('email')}
                    placeholder="john@example.com"
                  />
                  {buyerForm.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1">
                      {buyerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="buyer-password">{t('common.password')} *</Label>
                  <Input
                    id="buyer-password"
                    type="password"
                    {...buyerForm.register('password')}
                    placeholder="••••••••"
                  />
                  {buyerForm.formState.errors.password && (
                    <p className="text-sm text-destructive mt-1">
                      {buyerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="buyer-phone">{t('profile.phone')} *</Label>
                  <Input
                    id="buyer-phone"
                    {...buyerForm.register('phone')}
                    placeholder="+94771234567"
                  />
                  {buyerForm.formState.errors.phone && (
                    <p className="text-sm text-destructive mt-1">
                      {buyerForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="buyer-district">{t('profile.district')} *</Label>
                  <Input
                    id="buyer-district"
                    {...buyerForm.register('district')}
                    placeholder="Colombo"
                  />
                  {buyerForm.formState.errors.district && (
                    <p className="text-sm text-destructive mt-1">
                      {buyerForm.formState.errors.district.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="buyer-address">{t('profile.address')} *</Label>
                  <Textarea
                    id="buyer-address"
                    {...buyerForm.register('address')}
                    placeholder="123 Main Street, Colombo"
                  />
                  {buyerForm.formState.errors.address && (
                    <p className="text-sm text-destructive mt-1">
                      {buyerForm.formState.errors.address.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full">
                  {t('auth.createBuyerAccount')}
                </Button>
              </form>
            </TabsContent>

            {/* Seller Signup */}
            <TabsContent value="seller">
              <form onSubmit={sellerForm.handleSubmit(onSellerSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="seller-name">{t('profile.name')} *</Label>
                  <Input
                    id="seller-name"
                    {...sellerForm.register('name')}
                    placeholder="Nimal Perera"
                  />
                  {sellerForm.formState.errors.name && (
                    <p className="text-sm text-destructive mt-1">
                      {sellerForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="seller-email">{t('common.email')} *</Label>
                  <Input
                    id="seller-email"
                    type="email"
                    {...sellerForm.register('email')}
                    placeholder="nimal@farm.lk"
                  />
                  {sellerForm.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1">
                      {sellerForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="seller-password">{t('common.password')} *</Label>
                  <Input
                    id="seller-password"
                    type="password"
                    {...sellerForm.register('password')}
                    placeholder="••••••••"
                  />
                  {sellerForm.formState.errors.password && (
                    <p className="text-sm text-destructive mt-1">
                      {sellerForm.formState.errors.password.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="seller-phone">{t('profile.phone')} *</Label>
                  <Input
                    id="seller-phone"
                    {...sellerForm.register('phone')}
                    placeholder="+94771234567"
                  />
                  {sellerForm.formState.errors.phone && (
                    <p className="text-sm text-destructive mt-1">
                      {sellerForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="seller-farmName">{t('profile.farmName')} *</Label>
                  <Input
                    id="seller-farmName"
                    {...sellerForm.register('farmName')}
                    placeholder="Green Valley Farms"
                  />
                  {sellerForm.formState.errors.farmName && (
                    <p className="text-sm text-destructive mt-1">
                      {sellerForm.formState.errors.farmName.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="seller-district">{t('profile.district')} *</Label>
                  <Input
                    id="seller-district"
                    {...sellerForm.register('district')}
                    placeholder="Nuwara Eliya"
                  />
                  {sellerForm.formState.errors.district && (
                    <p className="text-sm text-destructive mt-1">
                      {sellerForm.formState.errors.district.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="seller-address">{t('auth.farmAddress')} *</Label>
                  <Textarea
                    id="seller-address"
                    {...sellerForm.register('address')}
                    placeholder="Ramboda Road, Nuwara Eliya"
                  />
                  {sellerForm.formState.errors.address && (
                    <p className="text-sm text-destructive mt-1">
                      {sellerForm.formState.errors.address.message}
                    </p>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">{t('profile.bankDetails')}</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="seller-bankAccountName">{t('profile.accountName')} *</Label>
                      <Input
                        id="seller-bankAccountName"
                        {...sellerForm.register('bankAccountName')}
                        placeholder="Nimal Perera"
                      />
                      {sellerForm.formState.errors.bankAccountName && (
                        <p className="text-sm text-destructive mt-1">
                          {sellerForm.formState.errors.bankAccountName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="seller-bankAccountNo">{t('profile.accountNumber')} *</Label>
                      <Input
                        id="seller-bankAccountNo"
                        {...sellerForm.register('bankAccountNo')}
                        placeholder="1234567890"
                      />
                      {sellerForm.formState.errors.bankAccountNo && (
                        <p className="text-sm text-destructive mt-1">
                          {sellerForm.formState.errors.bankAccountNo.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="seller-bankName">{t('profile.bankName')} *</Label>
                      <Input
                        id="seller-bankName"
                        {...sellerForm.register('bankName')}
                        placeholder="Bank of Ceylon"
                      />
                      {sellerForm.formState.errors.bankName && (
                        <p className="text-sm text-destructive mt-1">
                          {sellerForm.formState.errors.bankName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="seller-bankBranch">{t('profile.branch')} *</Label>
                      <Input
                        id="seller-bankBranch"
                        {...sellerForm.register('bankBranch')}
                        placeholder="Nuwara Eliya"
                      />
                      {sellerForm.formState.errors.bankBranch && (
                        <p className="text-sm text-destructive mt-1">
                          {sellerForm.formState.errors.bankBranch.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  {t('auth.submitSellerApplication')}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  {t('auth.applicationReview')}
                </p>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {t('auth.alreadyHaveAccount')}{' '}
              <Link to="/login" className="text-primary hover:underline font-medium">
                {t('auth.signIn')}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
