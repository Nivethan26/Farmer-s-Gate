# Seller Approval System - Frontend Integration Guide

## Overview
The seller approval system frontend has been fully implemented with OTP verification, admin approval workflow, and status-based login restrictions.

## Completed Components

### 1. Type Definitions (`/frontend/src/types/seller.ts`)
- `BankDetails` - Bank account information
- `SellerRegistration` - Registration form data
- `OTPVerification` - OTP verification request
- `SellerApprovalRequest` - Approval workflow state
- `ApprovalAction`, `RejectionAction` - Admin actions
- `UserStatus` - User status enum
- `LoginError` - Login error codes

### 2. API Service (`/frontend/src/services/sellerApprovalService.ts`)
**Seller Endpoints:**
- `registerSeller(data)` - Register new seller
- `verifyOTP(data)` - Verify OTP code
- `resendOTP(data)` - Resend OTP with 60s cooldown

**Admin Endpoints:**
- `getPendingRequests()` - Get all pending seller requests
- `approveSeller(data)` - Approve seller application
- `rejectSeller(data)` - Reject seller application

### 3. Redux State Management (`/frontend/src/store/sellerApprovalSlice.ts`)
**State:**
```typescript
{
  pendingRequests: SellerApprovalRequest[];
  loading: boolean;
  error: string | null;
  total: number;
}
```

**Async Thunks:**
- `fetchPendingRequests` - Load pending approval requests
- `approveSellerRequest` - Approve a seller
- `rejectSellerRequest` - Reject a seller with reason

**Integrated into:** `/frontend/src/store/index.ts`

### 4. UI Components

#### Seller Registration (`/frontend/src/pages/SellerRegistration.tsx`)
**Features:**
- 2-step form with progress indicator
- Step 1: Personal info (name, email, password, phone)
- Step 2: Business info (farm name, bank details)
- Comprehensive validation:
  - Email format validation
  - Password strength (8+ chars, uppercase, lowercase, number, special char)
  - Phone number validation (10 digits)
  - Bank account number validation
- Opens OTP modal on successful registration
- Redirects to login with pending approval message

#### OTP Input Component (`/frontend/src/components/ui/OTPInput.tsx`)
**Features:**
- 6-digit input with individual boxes
- Auto-focus next field on input
- Paste support (auto-distributes digits)
- Keyboard navigation (arrows, backspace)
- Error state styling
- Disabled state support
- Auto-submit on completion

#### Countdown Timer (`/frontend/src/components/ui/CountdownTimer.tsx`)
**Features:**
- Configurable initial seconds
- Two display formats: mm:ss or text ("X minutes Y seconds left")
- Auto-complete callback when timer ends
- Warning styling when under 60 seconds
- Reset functionality

#### OTP Verification Modal (`/frontend/src/components/seller/OTPVerificationModal.tsx`)
**Features:**
- 6-digit OTP input with validation
- 10-minute expiry countdown timer
- 60-second resend cooldown timer
- Attempts tracking (max 5 attempts)
- Error message display
- Success flow to registration pending state
- Informational "What happens next?" section
- Professional UI with icons and helpful messages

#### Seller Approval Tab (`/frontend/src/components/seller/SellerApprovalTab.tsx`)
**Admin Features:**
- Table of pending seller requests
- Columns: Name, Email, Farm, Phone, Submitted Date, Status
- Actions: View Details, Approve, Reject
- Refresh button to reload pending requests
- Empty state when no pending requests
- Error handling with retry capability
- Loading states for all async operations

#### Seller Details Modal (`/frontend/src/components/seller/SellerDetailsModal.tsx`)
**Display Sections:**
- Status and submission date
- Personal information (name, email, phone)
- Farm information
- Bank account details
- Email verification status badge
- Action buttons: Approve, Reject, Cancel

#### Reject Seller Modal (`/frontend/src/components/seller/RejectSellerModal.tsx`)
**Features:**
- Rejection reason text area (required, min 10 chars)
- Warning message about email notification
- Note that applicant can re-apply with different email
- Validation and error handling
- Loading state during rejection

### 5. Enhanced Login (`/frontend/src/pages/Login.tsx`)
**New Status Handling:**
- `EMAIL_NOT_VERIFIED` - Shows message to check email for OTP
- `PENDING_APPROVAL` - Notifies about waiting for admin approval
- `ACCOUNT_REJECTED` - Directs to contact support
- `ACCOUNT_INACTIVE` - Directs to contact support
- All with appropriate user-friendly error messages

### 6. Enhanced Signup (`/frontend/src/pages/Signup.tsx`)
**Seller Tab Update:**
- Added prominent banner promoting new seller registration
- Lists new features (OTP verification, admin approval, etc.)
- "Proceed to Seller Registration" button redirects to `/seller-registration`
- Old form still available for backward compatibility

### 7. Admin Dashboard Integration (`/frontend/src/pages/AdminDashboard.tsx`)
- Added "Approvals" tab to admin navigation
- Renders `SellerApprovalTab` component
- Tab navigation updated to 6 tabs (was 5)

### 8. Navigation (`/frontend/src/components/admin/AdminTabNavigation.tsx`)
- Added "Approvals" tab with UserCheck icon
- Updated grid from 5 to 6 columns
- Consistent styling with other tabs

### 9. Routing (`/frontend/src/App.tsx`)
- Added `/seller-registration` route
- Public route (no authentication required)
- Imported `SellerRegistrationPage` component

## User Flows

### Seller Registration Flow
1. User visits `/seller-registration`
2. Fills Step 1: Personal info (name, email, password, phone)
3. Clicks "Next" → validates and moves to Step 2
4. Fills Step 2: Farm name + bank details
5. Clicks "Complete Registration" → sends registration request
6. OTP modal opens automatically
7. User enters 6-digit OTP from email
8. OTP verified → redirects to login with "pending approval" message
9. User waits for admin approval email

### Admin Approval Flow
1. Admin logs in and navigates to "Approvals" tab
2. Views table of pending seller requests
3. Clicks "View" to see full seller details
4. Reviews information in modal
5. Clicks "Approve" → seller gets activated and receives approval email
   OR
   Clicks "Reject" → enters rejection reason → seller receives rejection email
6. Approved seller can now log in and access seller dashboard

### Login with Status Checks
1. User enters credentials
2. Backend checks user status
3. If `unverified` → Error: "Please verify your email address first"
4. If `pending` → Error: "Your account is pending admin approval"
5. If `rejected` → Error: "Application was rejected. Contact support"
6. If `inactive` → Error: "Account deactivated. Contact support"
7. If `active` → Login successful, redirect to dashboard

## Security Features Implemented

### Frontend
- Password strength validation
- Email format validation
- Phone number validation
- Bank account number format validation
- OTP input validation (6 digits only)
- Rate limiting UI (60s resend cooldown, 5 max attempts)
- Error state management

### Backend (Previously Implemented)
- OTP hashing with bcrypt
- 10-minute OTP expiry
- 60-second resend cooldown
- 5 maximum OTP attempts
- Audit logging for all admin actions
- Status-based login restrictions
- Email notifications for all status changes

## Testing Checklist

### Seller Registration
- [ ] Navigate to `/seller-registration`
- [ ] Test Step 1 validation (all fields required, email format, password strength, phone format)
- [ ] Test Step 2 validation (farm name, bank details)
- [ ] Test duplicate email error handling
- [ ] Verify OTP modal opens on successful registration
- [ ] Test OTP input (paste, keyboard navigation)
- [ ] Test OTP verification with correct code
- [ ] Test OTP expiry countdown (10 minutes)
- [ ] Test resend OTP with 60s cooldown
- [ ] Test max attempts (5 attempts)
- [ ] Verify redirect to login with pending message

### Admin Approval
- [ ] Login as admin
- [ ] Navigate to "Approvals" tab
- [ ] Verify pending requests table displays correctly
- [ ] Click "View" to open seller details modal
- [ ] Verify all seller information displays correctly
- [ ] Test "Approve" button (success toast, email sent, request removed from table)
- [ ] Test "Reject" button opens rejection modal
- [ ] Test rejection reason validation (required, min 10 chars)
- [ ] Verify rejection email is sent
- [ ] Test refresh button

### Login Status Checks
- [ ] Try logging in as unverified seller → see email verification error
- [ ] Try logging in as pending seller → see pending approval error
- [ ] Try logging in as rejected seller → see rejection error
- [ ] Try logging in as approved seller → successful login

### Email Notifications
- [ ] Verify OTP email received on registration
- [ ] Verify "Registration Pending" email received after OTP verification
- [ ] Verify "Account Approved" email received after admin approval
- [ ] Verify "Account Rejected" email received after admin rejection

## Configuration

### Environment Variables
Ensure these are set in `/backend/.env`:
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=Farmer's Gate <noreply@farmersgate.com>
FRONTEND_URL=http://localhost:5173
```

### Database
No migration required - Mongoose will create collections automatically:
- `otpverifications`
- `sellerapprovalrequests`
- `adminactionlogs`

User collection will use updated status enum automatically.

## Next Steps

### Optional Enhancements
1. **Email Templates** - Customize email HTML templates in `/backend/services/emailService.js`
2. **Seller Dashboard** - Add "Application Status" widget showing current approval status
3. **Admin Dashboard** - Add approval statistics to overview tab
4. **Notifications** - Add real-time notifications for admins when new seller registers
5. **File Uploads** - Add document upload for seller verification (business license, etc.)
6. **Bulk Actions** - Allow admins to approve/reject multiple sellers at once
7. **Search & Filter** - Add search and filter to seller approval table
8. **Analytics** - Track approval/rejection rates, average approval time

### Production Deployment
1. Set production email credentials
2. Configure FRONTEND_URL for production domain
3. Test email delivery in production
4. Set up monitoring for failed OTP sends
5. Configure rate limiting at reverse proxy level
6. Set up audit log rotation

## File Summary

**Created Files (Frontend):**
1. `/frontend/src/types/seller.ts` - TypeScript types
2. `/frontend/src/services/sellerApprovalService.ts` - API client
3. `/frontend/src/store/sellerApprovalSlice.ts` - Redux state
4. `/frontend/src/components/ui/OTPInput.tsx` - OTP input component
5. `/frontend/src/components/ui/CountdownTimer.tsx` - Timer component
6. `/frontend/src/components/seller/OTPVerificationModal.tsx` - OTP modal
7. `/frontend/src/pages/SellerRegistration.tsx` - Registration page
8. `/frontend/src/components/seller/SellerApprovalTab.tsx` - Admin approval tab
9. `/frontend/src/components/seller/SellerDetailsModal.tsx` - Seller details modal
10. `/frontend/src/components/seller/RejectSellerModal.tsx` - Rejection modal

**Modified Files (Frontend):**
1. `/frontend/src/store/index.ts` - Added sellerApprovalReducer
2. `/frontend/src/pages/Login.tsx` - Added status-based error handling & seller reg link
3. `/frontend/src/pages/Signup.tsx` - Added redirect banner to new seller registration
4. `/frontend/src/App.tsx` - Added `/seller-registration` route
5. `/frontend/src/pages/AdminDashboard.tsx` - Added Approvals tab
6. `/frontend/src/components/admin/AdminTabNavigation.tsx` - Added Approvals navigation

**Backend Files (Previously Created):**
- Models: OTPVerification.js, SellerApprovalRequest.js, AdminActionLog.js, User.js (updated)
- Controllers: sellerApprovalController.js
- Routes: authRoutes.js (updated), adminApprovalRoutes.js
- Services: emailService.js (enhanced with 4 templates)
- Documentation: SELLER_APPROVAL_SYSTEM.md, IMPLEMENTATION_SUMMARY.md

## Support
- Backend documentation: `/backend/SELLER_APPROVAL_SYSTEM.md`
- Implementation guide: `/backend/IMPLEMENTATION_SUMMARY.md`
- API testing guide: `/API-TESTING-GUIDE.md`
