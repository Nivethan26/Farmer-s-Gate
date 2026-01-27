import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { OTPInput } from '@/components/ui/OTPInput';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { AlertCircle, CheckCircle2, Mail } from 'lucide-react';
import { sellerApprovalAPI } from '@/services/sellerApprovalService';
import { toast } from 'sonner';

interface OTPVerificationModalProps {
  open: boolean;
  onClose: () => void;
  email: string;
  onSuccess: () => void;
}

export const OTPVerificationModal = ({ open, onClose, email, onSuccess }: OTPVerificationModalProps) => {
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [canResend, setCanResend] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [attemptsRemaining, setAttemptsRemaining] = useState(5);

  useEffect(() => {
    if (!open) {
      setOtp('');
      setError('');
      setCanResend(false);
      setResendCooldown(0);
    }
  }, [open]);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setIsVerifying(true);
    setError('');

    try {
      const response = await sellerApprovalAPI.verifyOTP({ email, otp });
      toast.success(response.message);
      onSuccess();
      onClose();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Invalid OTP. Please try again.';
      setError(errorMessage);
      setOtp('');
      
      // Update attempts remaining if available in error response
      if (errorMessage.includes('attempts remaining')) {
        const match = errorMessage.match(/(\d+) attempts remaining/);
        if (match) {
          setAttemptsRemaining(parseInt(match[1]));
        }
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    setError('');

    try {
      const response = await sellerApprovalAPI.resendOTP({ email });
      toast.success(response.message);
      setCanResend(false);
      setResendCooldown(60); // Default 60 seconds cooldown
      setOtp('');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to resend OTP';
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  const handleOTPExpiry = () => {
    setCanResend(true);
  };

  const handleCooldownComplete = () => {
    setCanResend(true);
    setResendCooldown(0);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Verify Your Email</DialogTitle>
          <DialogDescription className="text-center">
            We've sent a 6-digit OTP to <strong>{email}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <OTPInput
              value={otp}
              onChange={setOtp}
              disabled={isVerifying}
              error={!!error}
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <span>OTP expires in:</span>
              <CountdownTimer 
                initialSeconds={600} 
                onComplete={handleOTPExpiry}
              />
            </div>
            
            {attemptsRemaining < 5 && (
              <p className="text-xs text-orange-600">
                {attemptsRemaining} attempts remaining
              </p>
            )}
          </div>

          <Button
            onClick={handleVerifyOTP}
            disabled={otp.length !== 6 || isVerifying}
            className="w-full"
            size="lg"
          >
            {isVerifying ? 'Verifying...' : 'Verify OTP'}
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Didn't receive the code?</p>
            <Button
              variant="link"
              onClick={handleResendOTP}
              disabled={!canResend || isResending || resendCooldown > 0}
              className="text-primary"
            >
              {isResending
                ? 'Resending...'
                : resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : 'Resend OTP'}
            </Button>
            {resendCooldown > 0 && (
              <CountdownTimer
                initialSeconds={resendCooldown}
                onComplete={handleCooldownComplete}
                format="text"
              />
            )}
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">What happens next?</p>
                <ul className="list-disc list-inside space-y-1 text-xs">
                  <li>Your account will be created with pending status</li>
                  <li>An admin will review your registration</li>
                  <li>You'll receive an email once approved</li>
                  <li>You can then log in and start selling</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
