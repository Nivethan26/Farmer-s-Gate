import { useState } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { negotiationAPI, type CreateNegotiationRequest } from '@/services/negotiationService';
import { addNotification, fetchNotifications, fetchUnreadCount } from '@/store/notificationSlice';
import { toast } from 'sonner';

export const useNegotiationSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useAppDispatch();

  const submitNegotiation = async (negotiationData: CreateNegotiationRequest) => {
    setIsSubmitting(true);
    try {
      // Submit negotiation to backend
      const result = await negotiationAPI.createNegotiation(negotiationData);
      
      // Show success toast immediately
      toast.success('Negotiation request submitted successfully!', {
        description: 'Your negotiation request has been sent to the seller.',
        duration: 5000,
      });

      // Create and dispatch a notification (this will also be saved to database via backend)
      const notification = {
        _id: `temp_${Date.now()}`, // Temporary ID for immediate UI update
        userId: 'current_user', // Will be set properly in backend
        type: 'negotiation' as const,
        title: 'Negotiation Request Submitted',
        message: `Your negotiation request for "${negotiationData.productId}" has been submitted successfully.`,
        data: {
          negotiationId: result._id,
          productId: negotiationData.productId,
          actionUrl: '/dashboard?tab=negotiations'
        },
        isRead: false,
        priority: 'medium' as const,
        createdAt: new Date().toISOString()
      };

      // Add notification to Redux store for immediate UI update
      dispatch(addNotification(notification));

      // Refresh notifications and unread count to sync with backend
      setTimeout(() => {
        dispatch(fetchNotifications({ page: 1, limit: 10 }));
        dispatch(fetchUnreadCount());
      }, 100);

      return result;
    } catch (error) {
      console.error('Error submitting negotiation:', error);
      toast.error('Failed to submit negotiation request', {
        description: error instanceof Error ? error.message : 'Please try again later.',
        duration: 5000,
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitNegotiation,
    isSubmitting
  };
};