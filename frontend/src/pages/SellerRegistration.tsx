import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Navbar } from '@/components/layout/Navbar';
import { OTPVerificationModal } from '@/components/seller/OTPVerificationModal';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Loader2 } from 'lucide-react';
import { sellerApprovalAPI } from '@/services/sellerApprovalService';
import { toast } from 'sonner';
import type { SellerRegistration } from '@/types/seller';

// Sri Lankan districts
const SRI_LANKAN_DISTRICTS = [
  'Ampara', 'Anuradhapura', 'Badulla', 'Batticaloa', 'Colombo', 'Galle', 
  'Gampaha', 'Hambantota', 'Jaffna', 'Kalutara', 'Kandy', 'Kegalle', 
  'Kilinochchi', 'Kurunegala', 'Mannar', 'Matale', 'Matara', 'Monaragala', 
  'Mullaitivu', 'Nuwara Eliya', 'Polonnaruwa', 'Puttalam', 'Ratnapura', 
  'Trincomalee', 'Vavuniya'
];

export const SellerRegistrationPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<SellerRegistration>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    farmName: '',
    district: '',
    address: '',
    bank: {
      accountName: '',
      accountNo: '',
      bankName: '',
      branch: ''
    }
  });

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, number, and special character';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Invalid phone number (10 digits required)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.farmName.trim()) newErrors.farmName = 'Farm name is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.bank.accountName.trim()) newErrors['bank.accountName'] = 'Account name is required';
    if (!formData.bank.accountNo.trim()) {
      newErrors['bank.accountNo'] = 'Account number is required';
    } else if (!/^[0-9]{8,20}$/.test(formData.bank.accountNo)) {
      newErrors['bank.accountNo'] = 'Invalid account number';
    }
    if (!formData.bank.bankName.trim()) newErrors['bank.bankName'] = 'Bank name is required';
    if (!formData.bank.branch.trim()) newErrors['bank.branch'] = 'Branch is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    setStep(1);
    setErrors({});
    window.scrollTo(0, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep2()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      const response = await sellerApprovalAPI.registerSeller(formData);
      toast.success(response.message);
      setShowOTPModal(true);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      toast.error(errorMessage);
      
      if (errorMessage.includes('email')) {
        setErrors({ email: errorMessage });
        setStep(1);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOTPSuccess = () => {
    // Show success message and redirect to login
    toast.success(
      'Registration successful! Your account is pending admin approval. You will receive an email once approved.',
      { duration: 5000 }
    );
    navigate('/login', { 
      state: { 
        message: 'Registration pending approval. You will be notified via email once approved.' 
      } 
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => {
      if (field.startsWith('bank.')) {
        const bankField = field.replace('bank.', '');
        return {
          ...prev,
          bank: { ...prev.bank, [bankField]: value }
        };
      }
      return { ...prev, [field]: value };
    });
    // Clear error for this field
    setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center">Register as Seller</CardTitle>
            <CardDescription className="text-center">
              Step {step} of 2: {step === 1 ? 'Personal Information' : 'Business Information'}
            </CardDescription>
            
            {/* Progress bar */}
            <div className="flex gap-2 mt-4">
              <div className={`h-2 flex-1 rounded ${step >= 1 ? 'bg-primary' : 'bg-gray-200'}`} />
              <div className={`h-2 flex-1 rounded ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <div className="space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      placeholder="john@example.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleChange('password', e.target.value)}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600 flex items-start gap-1">
                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <span>{errors.password}</span>
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Must contain: uppercase, lowercase, number, and special character
                    </p>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleChange('confirmPassword', e.target.value)}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-600 flex items-start gap-1">
                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <span>{errors.confirmPassword}</span>
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      placeholder="0771234567"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <Button type="button" onClick={handleNext} className="w-full" size="lg">
                    Next
                  </Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  {/* Farm Name */}
                  <div className="space-y-2">
                    <Label htmlFor="farmName">Farm Name *</Label>
                    <Input
                      id="farmName"
                      value={formData.farmName}
                      onChange={(e) => handleChange('farmName', e.target.value)}
                      placeholder="Green Valley Farm"
                    />
                    {errors.farmName && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.farmName}
                      </p>
                    )}
                  </div>

                  {/* District */}
                  <div className="space-y-2">
                    <Label htmlFor="district">District *</Label>
                    <Select
                      value={formData.district}
                      onValueChange={(value) => handleChange('district', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {SRI_LANKAN_DISTRICTS.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.district && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.district}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      placeholder="123 Main Street, Colombo"
                    />
                    {errors.address && (
                      <p className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="pt-4">
                    <h3 className="font-semibold mb-4">Bank Details</h3>
                    
                    {/* Account Name */}
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="accountName">Account Holder Name *</Label>
                      <Input
                        id="accountName"
                        value={formData.bank.accountName}
                        onChange={(e) => handleChange('bank.accountName', e.target.value)}
                        placeholder="John Doe"
                      />
                      {errors['bank.accountName'] && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors['bank.accountName']}
                        </p>
                      )}
                    </div>

                    {/* Account Number */}
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="accountNo">Account Number *</Label>
                      <Input
                        id="accountNo"
                        value={formData.bank.accountNo}
                        onChange={(e) => handleChange('bank.accountNo', e.target.value)}
                        placeholder="1234567890"
                      />
                      {errors['bank.accountNo'] && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors['bank.accountNo']}
                        </p>
                      )}
                    </div>

                    {/* Bank Name */}
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="bankName">Bank Name *</Label>
                      <Input
                        id="bankName"
                        value={formData.bank.bankName}
                        onChange={(e) => handleChange('bank.bankName', e.target.value)}
                        placeholder="Bank of Ceylon"
                      />
                      {errors['bank.bankName'] && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors['bank.bankName']}
                        </p>
                      )}
                    </div>

                    {/* Branch */}
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="branch">Branch *</Label>
                      <Input
                        id="branch"
                        value={formData.bank.branch}
                        onChange={(e) => handleChange('bank.branch', e.target.value)}
                        placeholder="Colombo"
                      />
                      {errors['bank.branch'] && (
                        <p className="text-sm text-red-600 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors['bank.branch']}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button type="button" onClick={handleBack} variant="outline" className="flex-1" size="lg">
                      Back
                    </Button>
                    <Button type="submit" disabled={isSubmitting} className="flex-1" size="lg">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        'Complete Registration'
                      )}
                    </Button>
                  </div>
                </div>
              )}

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Registration Process</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Submit your information</li>
                      <li>Verify your email with OTP</li>
                      <li>Wait for admin approval (1-2 business days)</li>
                      <li>Receive approval email and start selling!</li>
                    </ul>
                  </div>
                </div>
              </div>

              <p className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <a href="/login" className="text-primary hover:underline font-medium">
                  Login here
                </a>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>

      <OTPVerificationModal
        open={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={formData.email}
        onSuccess={handleOTPSuccess}
      />
    </div>
  );
};
