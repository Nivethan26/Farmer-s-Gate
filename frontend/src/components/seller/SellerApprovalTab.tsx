import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchPendingRequests, approveSellerRequest, rejectSellerRequest } from '@/store/sellerApprovalSlice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Eye, Loader2, RefreshCw, AlertCircle } from 'lucide-react';
import { SellerDetailsModal } from '@/components/seller/SellerDetailsModal';
import { RejectSellerModal } from '@/components/seller/RejectSellerModal';
import { toast } from 'sonner';
import type { SellerApprovalRequest } from '@/types/seller';

export const SellerApprovalTab = () => {
  const dispatch = useAppDispatch();
  const { pendingRequests, loading, error } = useAppSelector((state) => state.sellerApproval);
  const [selectedSeller, setSelectedSeller] = useState<SellerApprovalRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPendingRequests());
  }, [dispatch]);

  const handleViewDetails = (seller: SellerApprovalRequest) => {
    setSelectedSeller(seller);
    setShowDetailsModal(true);
  };

  const handleApprove = async (requestId: string) => {
    setActionLoading(requestId);
    try {
      const result = await dispatch(approveSellerRequest({ requestId }));
      if (approveSellerRequest.fulfilled.match(result)) {
        toast.success('Seller approved successfully! Approval email has been sent.');
        dispatch(fetchPendingRequests());
      } else {
        toast.error(result.payload as string || 'Failed to approve seller');
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = (seller: SellerApprovalRequest) => {
    setSelectedSeller(seller);
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async (reason: string) => {
    if (!selectedSeller) return;

    setActionLoading(selectedSeller._id);
    try {
      const result = await dispatch(rejectSellerRequest({ 
        requestId: selectedSeller._id, 
        rejectionReason: reason 
      }));
      if (rejectSellerRequest.fulfilled.match(result)) {
        toast.success('Seller rejected. Rejection email has been sent.');
        dispatch(fetchPendingRequests());
        setShowRejectModal(false);
        setSelectedSeller(null);
      } else {
        toast.error(result.payload as string || 'Failed to reject seller');
      }
    } finally {
      setActionLoading(null);
    }
  };

  const handleRefresh = () => {
    dispatch(fetchPendingRequests());
    toast.success('Refreshed seller requests');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && !pendingRequests.length) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Seller Approval Requests</CardTitle>
              <CardDescription>
                Review and approve or reject seller registration requests
              </CardDescription>
            </div>
            <Button onClick={handleRefresh} variant="outline" size="sm" disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-medium">Error loading seller requests</p>
                <p>{error}</p>
              </div>
            </div>
          )}

          {!loading && pendingRequests.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-700">No pending seller requests</p>
              <p className="text-sm text-gray-500 mt-2">
                All seller applications have been processed
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Farm Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRequests.map((seller) => (
                    <TableRow key={seller._id}>
                      <TableCell className="font-medium">{seller.name}</TableCell>
                      <TableCell>{seller.email}</TableCell>
                      <TableCell>{seller.farmName}</TableCell>
                      <TableCell>{seller.phone}</TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {formatDate(seller.submittedAt)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          Pending
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(seller)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleApprove(seller._id)}
                            disabled={actionLoading === seller._id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {actionLoading === seller._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(seller)}
                            disabled={actionLoading === seller._id}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedSeller && (
        <>
          <SellerDetailsModal
            open={showDetailsModal}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedSeller(null);
            }}
            seller={selectedSeller}
            onApprove={() => {
              setShowDetailsModal(false);
              handleApprove(selectedSeller._id);
            }}
            onReject={() => {
              setShowDetailsModal(false);
              handleReject(selectedSeller);
            }}
          />

          <RejectSellerModal
            open={showRejectModal}
            onClose={() => {
              setShowRejectModal(false);
              setSelectedSeller(null);
            }}
            sellerName={selectedSeller.name}
            onConfirm={handleRejectConfirm}
          />
        </>
      )}
    </>
  );
};
