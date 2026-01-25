# Quick Start Guide - Seller Approval System

## Starting the Application

### Backend
```bash
cd backend
npm install
npm start
```
Server runs on: http://localhost:5000

### Frontend
```bash
cd frontend
npm install  # or bun install
npm run dev  # or bun dev
```
Frontend runs on: http://localhost:5173

## Testing the Complete Flow

### 1. Register a New Seller

**Navigate to:** http://localhost:5173/seller-registration

**Step 1 - Personal Information:**
- Full Name: Test Seller
- Email: testseller@example.com
- Password: TestSeller@123
- Phone: 0771234567

Click "Next"

**Step 2 - Business Information:**
- Farm Name: Green Valley Farm
- Account Holder Name: Test Seller
- Account Number: 1234567890
- Bank Name: Bank of Ceylon
- Branch: Colombo

Click "Complete Registration"

### 2. Verify OTP

**Check Email:** Look for OTP in testseller@example.com inbox
- Subject: "Email Verification - OTP Code"
- OTP expires in 10 minutes

**Enter OTP in Modal:**
- Type or paste the 6-digit code
- Click "Verify OTP"
- On success: redirected to login with pending approval message

**Check Second Email:** "Registration Pending Approval"
- Confirms your application is under review

### 3. Try Logging In (Should Fail)

**Navigate to:** http://localhost:5173/login
- Email: testseller@example.com
- Password: TestSeller@123

**Expected Result:** Error message "Your account is pending admin approval. You will receive an email once approved."

### 4. Admin Approves Seller

**Login as Admin:**
- Navigate to: http://localhost:5173/login
- Email: admin@agrilink.lk
- Password: admin123

**Navigate to Approvals Tab:**
1. Click "Approvals" in admin dashboard navigation
2. You should see "Test Seller" in the pending requests table

**View Details:**
1. Click "View" button
2. Review seller information:
   - Personal info
   - Farm name
   - Bank details
   - Submission date

**Approve Seller:**
1. Click "Approve" button (either in table or modal)
2. Confirmation toast: "Seller approved successfully!"
3. Seller removed from pending requests table

**Check Email:** testseller@example.com receives "Account Approved" email

### 5. Seller Logs In Successfully

**Navigate to:** http://localhost:5173/login
- Email: testseller@example.com
- Password: TestSeller@123

**Expected Result:** Successful login, redirected to `/seller` dashboard

## Alternative Flow: Rejection

### Reject a Seller

**From Admin Dashboard > Approvals Tab:**
1. Click "Reject" button for a pending seller
2. Rejection modal opens
3. Enter rejection reason (min 10 characters):
   - Example: "Farm location is outside our service area"
4. Click "Confirm Rejection"
5. Seller receives rejection email with reason

**Try Logging In as Rejected Seller:**
- Error: "Your seller application was rejected. Please contact support for more information."

## Testing OTP Features

### Test Resend OTP
1. Register a new seller
2. Wait for OTP modal to open
3. Click "Resend OTP" button
4. 60-second countdown starts
5. Button is disabled until cooldown ends
6. After 60 seconds, click "Resend OTP" again
7. New OTP is sent to email

### Test OTP Expiry
1. Register a new seller
2. Wait 10 minutes (or modify expiry time in code for testing)
3. Try to verify OTP
4. Error: "OTP has expired. Please request a new one."

### Test Max Attempts
1. Register a new seller
2. Enter incorrect OTP 5 times
3. Error: "Maximum OTP attempts exceeded. Please request a new OTP."
4. Request new OTP and try again

## Admin Dashboard Features

### View All Pending Requests
- Navigate to Admin Dashboard > Approvals tab
- Table shows all sellers awaiting approval
- Sorted by submission date (newest first)

### Refresh Pending Requests
- Click "Refresh" button to reload the table
- Useful when multiple admins are reviewing applications

### Bulk Processing
- Admins can quickly approve or reject from the table view
- Or click "View" for detailed review before decision

## Email Notifications Summary

| Event | Recipient | Subject | Content |
|-------|-----------|---------|---------|
| Registration | Seller | Email Verification - OTP Code | 6-digit OTP, valid for 10 minutes |
| OTP Verified | Seller | Registration Pending Approval | Confirmation that application is under review |
| Approved | Seller | Seller Account Approved | Welcome message, login instructions |
| Rejected | Seller | Seller Application Update | Rejection reason, re-application guidance |

## Troubleshooting

### OTP Not Received
- Check email service configuration in `/backend/.env`
- Verify EMAIL_USER and EMAIL_PASS are correct
- Check spam/junk folder
- Review backend logs for email sending errors

### Cannot Approve Seller
- Ensure you're logged in as admin
- Check browser console for API errors
- Verify backend is running
- Check admin token is valid

### TypeScript Errors
- All errors should be resolved
- If you see errors, run: `npm run build` to verify
- Check `/frontend/src/types/seller.ts` for type definitions

### Database Issues
- Ensure MongoDB is running
- Check connection string in `/backend/config/db.js`
- Verify collections are created (otpverifications, sellerapprovalrequests, adminactionlogs)

## API Endpoints Reference

### Public Seller Endpoints
- `POST /api/auth/register/seller` - Register new seller
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/resend-otp` - Resend OTP
- `POST /api/auth/login` - Login (with status checks)

### Protected Admin Endpoints
- `GET /api/admin/sellers/pending` - Get pending requests
- `POST /api/admin/sellers/approve/:requestId` - Approve seller
- `POST /api/admin/sellers/reject/:requestId` - Reject seller

## Demo Credentials

### Existing Users
- **Admin:** admin@agrilink.lk / admin123
- **Buyer:** buyer@agrilink.lk / buyer123
- **Seller (Active):** seller@agrilink.lk / seller123
- **Agent:** agent@agrilink.lk / agent123

### Test Seller Registration
Use any email you have access to for testing OTP verification.

## Production Checklist
- [ ] Configure production email service credentials
- [ ] Update FRONTEND_URL in backend .env
- [ ] Test email delivery in production
- [ ] Set up monitoring for OTP failures
- [ ] Configure CORS for production domain
- [ ] Set up SSL/TLS for API endpoints
- [ ] Review and adjust OTP expiry times
- [ ] Set up admin notification for new registrations
- [ ] Configure backup email service for reliability
- [ ] Set up audit log retention policy
