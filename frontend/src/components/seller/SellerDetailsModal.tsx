import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, User, Mail, Phone, Building2, CreditCard, MapPin } from 'lucide-react';
import type { SellerApprovalRequest } from '@/types/seller';

interface SellerDetailsModalProps {
  open: boolean;
  onClose: () => void;
  seller: SellerApprovalRequest;
  onApprove: () => void;
  onReject: () => void;
}

export const SellerDetailsModal = ({
  open,
  onClose,
  seller,
  onApprove,
  onReject,
}: SellerDetailsModalProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Seller Registration Details</DialogTitle>
          <DialogDescription>
            Review all information provided by the seller applicant
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Date */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 mt-1">
                Pending Approval
              </Badge>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Submitted</p>
              <p className="text-sm font-medium mt-1">{formatDate(seller.submittedAt)}</p>
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-4 pl-7">
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium">{seller.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium flex items-center gap-1">
                  <Mail className="h-4 w-4 text-gray-400" />
                  {seller.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone Number</p>
                <p className="font-medium flex items-center gap-1">
                  <Phone className="h-4 w-4 text-gray-400" />
                  {seller.phone}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Farm Information
            </h3>
            <div className="grid grid-cols-2 gap-4 pl-7">
              <div>
                <p className="text-sm text-gray-600">Farm Name</p>
                <p className="font-medium">{seller.farmName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">District</p>
                <p className="font-medium">{seller.district}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  {seller.address}
                </p>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          {seller.bank && (
            <div className="border-t pt-4">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Bank Account Details
              </h3>
              <div className="grid grid-cols-2 gap-4 pl-7">
                <div>
                  <p className="text-sm text-gray-600">Account Holder Name</p>
                  <p className="font-medium">{seller.bank.accountName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account Number</p>
                  <p className="font-medium font-mono">{seller.bank.accountNo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bank Name</p>
                  <p className="font-medium">{seller.bank.bankName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Branch</p>
                  <p className="font-medium flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    {seller.bank.branch}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Verification Info */}
          <div className="border-t pt-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium text-green-800 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Email Verified
              </p>
              <p className="text-xs text-green-700 mt-1">
                The seller has successfully verified their email address via OTP.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onReject}>
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
          <Button variant="default" onClick={onApprove} className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
