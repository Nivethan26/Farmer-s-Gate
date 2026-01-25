# Seller Registration & Approval System - Complete Documentation

## 📋 System Overview

This document provides a comprehensive guide for implementing a secure seller registration and approval system with OTP verification and admin approval workflow.

---

## 🔄 Status Flow Diagram

```
┌──────────────┐
│  UNVERIFIED  │ ← Initial registration
└──────┬───────┘
       │ OTP sent to email
       ▼
┌──────────────┐
│OTP_VERIFIED  │ ← After successful OTP verification
└──────┬───────┘
       │ Auto-created approval request
       ▼
┌──────────────┐
│   PENDING    │ ← Waiting for admin approval
└──────┬───────┘
       │
       ├─── Approve ──→ ┌────────┐
       │                 │ ACTIVE │ ← Can login & sell
       │                 └────────┘
       │
       └─── Reject ───→ ┌─────────┐
                         │REJECTED │ ← Cannot login
                         └─────────┘
```

---

## 🗂️ Database Schema Design

### 1. **User Model** (Enhanced)
```javascript
{
  _id: ObjectId,
  role: String, // 'buyer', 'seller', 'agent', 'admin'
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  phone: String,
  
  // Enhanced status field
  status: {
    type: String,
    enum: ['unverified', 'otp_verified', 'pending', 'active', 'inactive', 'rejected'],
    default: 'unverified'
  },
  
  // OTP verification
  isEmailVerified: Boolean (default: false),
  
  // Seller specific
  farmName: String,
  bank: {
    accountName: String,
    accountNo: String,
    bankName: String,
    branch: String
  },
  
  // Metadata
  rejectionReason: String,
  approvedBy: ObjectId (ref: 'User'),
  approvedAt: Date,
  rejectedBy: ObjectId (ref: 'User'),
  rejectedAt: Date,
  
  createdAt: Date,
  updatedAt: Date
}
```

### 2. **OTPVerification Model** (New)
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', indexed),
  email: String (indexed),
  otp: String (hashed),
  purpose: String, // 'registration', 'password_reset', 'email_change'
  expiresAt: Date (indexed, TTL),
  attempts: Number (default: 0),
  maxAttempts: Number (default: 5),
  isUsed: Boolean (default: false),
  lastSentAt: Date,
  createdAt: Date
}
```

### 3. **SellerApprovalRequest Model** (New)
```javascript
{
  _id: ObjectId,
  sellerId: ObjectId (ref: 'User', indexed),
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  
  // Seller details snapshot at time of request
  sellerDetails: {
    name: String,
    email: String,
    phone: String,
    farmName: String,
    bank: Object
  },
  
  // Admin action
  reviewedBy: ObjectId (ref: 'User'),
  reviewedAt: Date,
  rejectionReason: String,
  adminNotes: String,
  
  createdAt: Date,
  updatedAt: Date
}
```

### 4. **AdminActionLog Model** (New - Optional but Recommended)
```javascript
{
  _id: ObjectId,
  adminId: ObjectId (ref: 'User', indexed),
  actionType: String, // 'approve_seller', 'reject_seller', 'activate_user', 'deactivate_user'
  targetUserId: ObjectId (ref: 'User', indexed),
  targetUserEmail: String,
  details: Object, // Flexible field for any additional data
  ipAddress: String,
  userAgent: String,
  createdAt: Date (indexed)
}
```

---

## 🔌 API Endpoints

### **1. Seller Registration**
```
POST /api/auth/register/seller
Body: {
  name: String,
  email: String,
  password: String,
  phone: String,
  farmName: String,
  bank: {
    accountName: String,
    accountNo: String,
    bankName: String,
    branch: String
  }
}

Response Success (201):
{
  success: true,
  message: "Registration successful. Please verify your email with the OTP sent to your inbox.",
  data: {
    userId: String,
    email: String,
    otpSent: true
  }
}

Response Error (400):
{
  success: false,
  message: "Email already registered"
}
```

### **2. Verify OTP**
```
POST /api/auth/verify-otp
Body: {
  email: String,
  otp: String
}

Response Success (200):
{
  success: true,
  message: "Email verified successfully. Your registration request has been submitted to the admin for approval. You will be notified once approved.",
  data: {
    userId: String,
    status: "pending"
  }
}

Response Error (400):
{
  success: false,
  message: "Invalid or expired OTP"
}
```

### **3. Resend OTP**
```
POST /api/auth/resend-otp
Body: {
  email: String
}

Response Success (200):
{
  success: true,
  message: "OTP resent successfully",
  data: {
    cooldownSeconds: 60,
    attemptsRemaining: 4
  }
}

Response Error (429):
{
  success: false,
  message: "Please wait 60 seconds before requesting another OTP"
}
```

### **4. Login (Enhanced with Status Check)**
```
POST /api/auth/login
Body: {
  email: String,
  password: String
}

Response Success (200):
{
  success: true,
  token: String,
  user: {
    id: String,
    name: String,
    email: String,
    role: String,
    status: "active"
  }
}

Response Error - Unverified (403):
{
  success: false,
  message: "Please verify your email first. Check your inbox for OTP.",
  code: "EMAIL_NOT_VERIFIED"
}

Response Error - Pending Approval (403):
{
  success: false,
  message: "Your account is pending admin approval. You will be notified once approved.",
  code: "PENDING_APPROVAL"
}

Response Error - Rejected (403):
{
  success: false,
  message: "Your registration was rejected. Reason: [rejection reason]",
  code: "ACCOUNT_REJECTED"
}
```

### **5. Admin: Get Pending Seller Requests**
```
GET /api/admin/sellers/pending
Headers: { Authorization: Bearer <admin_token> }

Response Success (200):
{
  success: true,
  data: {
    requests: [
      {
        _id: String,
        sellerId: String,
        sellerDetails: {
          name: String,
          email: String,
          phone: String,
          farmName: String,
          bank: Object
        },
        status: "pending",
        createdAt: Date
      }
    ],
    total: Number
  }
}
```

### **6. Admin: Approve Seller**
```
POST /api/admin/sellers/approve/:requestId
Headers: { Authorization: Bearer <admin_token> }
Body: {
  adminNotes: String (optional)
}

Response Success (200):
{
  success: true,
  message: "Seller approved successfully. Approval email sent.",
  data: {
    sellerId: String,
    status: "active"
  }
}
```

### **7. Admin: Reject Seller**
```
POST /api/admin/sellers/reject/:requestId
Headers: { Authorization: Bearer <admin_token> }
Body: {
  rejectionReason: String (required),
  adminNotes: String (optional)
}

Response Success (200):
{
  success: true,
  message: "Seller registration rejected. Notification email sent.",
  data: {
    sellerId: String,
    status: "rejected"
  }
}
```

---

## 🎨 UI/UX Behavior Rules

### **Registration Flow**
1. **Seller Registration Form**
   - Validate all fields before submission
   - Show loading spinner during registration
   - On success: Show OTP verification modal/page
   - On error: Show inline error messages

2. **OTP Verification Screen**
   - 6-digit OTP input field
   - "Verify" button
   - "Resend OTP" link (disabled for 60s cooldown)
   - Display remaining attempts
   - Success: Show popup message + redirect to login with info banner
   - Error: Show error message below OTP input

3. **Post-Verification Popup**
   ```
   ✓ Registration Successful!
   
   Your registration request has been submitted.
   You can log in only after the admin approves your account.
   
   You will receive an email notification once approved.
   
   [OK, Got It]
   ```

### **Login Screen Behavior**

1. **Before Email Verification (status: unverified)**
   ```
   ⚠️ Email Not Verified
   
   Please verify your email first.
   Check your inbox for the OTP.
   
   [Resend OTP] [OK]
   ```

2. **Pending Admin Approval (status: pending)**
   ```
   ⏳ Approval Pending
   
   Your account is pending admin approval.
   Please wait for approval. You will be notified via email.
   
   [OK]
   ```

3. **Account Rejected (status: rejected)**
   ```
   ❌ Registration Rejected
   
   Your registration was rejected by the admin.
   
   Reason: [Rejection Reason Here]
   
   Please contact support for more information.
   
   [Contact Support] [Close]
   ```

### **Admin Dashboard - Seller Approval Tab**

**Pending Requests View:**
```
┌─────────────────────────────────────────────────────────┐
│  Pending Seller Registration Requests (Badge: 3)       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Table:                                                 │
│  ┌────┬──────────┬─────────┬────────────┬──────────┐  │
│  │ ID │   Name   │  Email  │  Farm Name │ Actions  │  │
│  ├────┼──────────┼─────────┼────────────┼──────────┤  │
│  │FG1 │ John Doe │john@... │Green Farm  │[Details] │  │
│  │    │          │         │            │[Approve] │  │
│  │    │          │         │            │[Reject]  │  │
│  └────┴──────────┴─────────┴────────────┴──────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Seller Details Modal:**
```
┌──────────────────────────────────────┐
│  Seller Registration Details    [×]  │
├──────────────────────────────────────┤
│                                      │
│  Personal Information:               │
│  • Name: John Doe                    │
│  • Email: john@example.com           │
│  • Phone: +94 77 123 4567            │
│                                      │
│  Business Information:               │
│  • Farm Name: Green Valley Farm      │
│                                      │
│  Bank Details:                       │
│  • Account Name: John Doe            │
│  • Account No: 1234567890            │
│  • Bank: Bank of Ceylon              │
│  • Branch: Colombo                   │
│                                      │
│  Registration Date: 2026-01-25       │
│                                      │
│  [Approve]  [Reject]  [Cancel]       │
│                                      │
└──────────────────────────────────────┘
```

**Rejection Modal:**
```
┌───────────────────────────────────────┐
│  Reject Seller Registration      [×]  │
├───────────────────────────────────────┤
│                                       │
│  Seller: John Doe (john@example.com)  │
│                                       │
│  Rejection Reason: *                  │
│  ┌─────────────────────────────────┐ │
│  │                                 │ │
│  │ [Text area for reason]          │ │
│  │                                 │ │
│  └─────────────────────────────────┘ │
│                                       │
│  Admin Notes (Optional):              │
│  ┌─────────────────────────────────┐ │
│  │                                 │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ⚠️ The seller will be notified via  │
│     email with this reason.           │
│                                       │
│  [Cancel]  [Confirm Rejection]        │
│                                       │
└───────────────────────────────────────┘
```

---

## 📧 Email Templates

### **1. OTP Verification Email**
```html
Subject: Verify Your Email - Farmer's Gate

Dear [Name],

Thank you for registering as a seller on Farmer's Gate!

Your OTP for email verification is:

━━━━━━━━━━━━━━━━━━━━━
      [OTP CODE]
━━━━━━━━━━━━━━━━━━━━━

This OTP will expire in 10 minutes.

If you didn't request this, please ignore this email.

Best regards,
Farmer's Gate Team
```

### **2. Registration Pending Email**
```html
Subject: Registration Submitted - Awaiting Approval

Dear [Name],

Your registration request has been successfully submitted!

✓ Email verified
⏳ Pending admin approval

You can log in only after the admin approves your account.
You will receive an email notification once approved.

Typical approval time: 1-2 business days

Best regards,
Farmer's Gate Team
```

### **3. Account Approved Email**
```html
Subject: 🎉 Your Account Has Been Approved!

Dear [Name],

Great news! Your seller account has been approved.

✓ Account Status: ACTIVE
✓ You can now log in and start selling!

Login here: [Login Link]

Start uploading your products and connect with buyers today!

Best regards,
Farmer's Gate Team
```

### **4. Account Rejected Email**
```html
Subject: Registration Update - Farmer's Gate

Dear [Name],

We regret to inform you that your seller registration has been rejected.

Reason: [Rejection Reason]

If you believe this is an error or have questions, please contact our support team at support@farmersgate.com

Best regards,
Farmer's Gate Team
```

---

## 🔒 Security & Validation Rules

### **Password Security**
- Minimum 8 characters
- Must contain: uppercase, lowercase, number, special character
- Hash using bcrypt (salt rounds: 10)
- Never store plain text passwords

### **OTP Security**
- 6-digit numeric code
- Store hashed OTP in database
- Expiry: 10 minutes
- Max attempts: 5
- Rate limiting: 1 OTP per 60 seconds
- Mark OTP as used after successful verification

### **Email Validation**
- Must be valid email format
- Check uniqueness before registration
- Case-insensitive comparison
- Prevent disposable email domains (optional)

### **Rate Limiting**
```javascript
// Registration endpoint: 5 requests per 15 minutes per IP
// OTP verification: 5 attempts per OTP
// Resend OTP: 1 request per 60 seconds
// Login: 5 attempts per 15 minutes per email
```

### **Session Security**
- JWT tokens with 7-day expiry
- Refresh tokens for long sessions
- Blacklist tokens on logout
- Validate user status on each protected route

### **Audit Logging**
- Log all admin actions (approve/reject)
- Store IP address and user agent
- Timestamp all actions
- Keep logs for 90 days minimum

---

## ⚠️ Edge Cases & Error Handling

### **1. Duplicate Email Registration**
```
Scenario: User tries to register with existing email
Action: Return error "Email already registered"
UI: Show error message with "Login instead?" link
```

### **2. OTP Expired**
```
Scenario: User submits OTP after 10 minutes
Action: Return error "OTP expired"
UI: Show "Resend OTP" button
DB: Mark old OTP as expired
```

### **3. Maximum OTP Attempts Exceeded**
```
Scenario: 5 wrong OTP attempts
Action: Invalidate current OTP, require new OTP generation
UI: Show "Too many attempts. Request new OTP"
DB: Set attempts = maxAttempts, isUsed = true
```

### **4. Login Before Email Verification**
```
Scenario: User tries to login with unverified email
Action: Return 403 with EMAIL_NOT_VERIFIED code
UI: Show popup with "Verify Email" and "Resend OTP" options
Flow: Redirect to OTP verification page
```

### **5. Login During Pending Approval**
```
Scenario: Seller tries to login while status = 'pending'
Action: Return 403 with PENDING_APPROVAL code
UI: Show friendly popup explaining approval process
DB: No changes
```

### **6. Admin Approval Without OTP Verification**
```
Scenario: Admin tries to approve seller with unverified email
Action: Prevent approval, return error
UI: Show warning "Cannot approve unverified seller"
DB: No status change
```

### **7. Rejected Seller Re-registration**
```
Scenario: Rejected seller tries to register again
Action: 
  - Option A: Allow re-registration (recommended)
  - Option B: Block for 30 days
UI: Show message based on policy
DB: If allowing, create new user record
```

### **8. Concurrent Approval/Rejection**
```
Scenario: Two admins try to approve same request simultaneously
Action: Use optimistic locking
DB: Check if request is still 'pending' before updating
UI: Show error "This request was already processed"
```

### **9. OTP Resend Cooldown**
```
Scenario: User clicks "Resend OTP" multiple times quickly
Action: Enforce 60-second cooldown
UI: Disable button with countdown timer
Response: Return cooldown remaining seconds
```

### **10. Seller Deletes Account After Approval Request**
```
Scenario: Seller account deleted while approval pending
Action: Mark approval request as 'cancelled'
UI: Admin sees request as cancelled
DB: Soft delete user, keep approval request for audit
```

---

## 🚀 Implementation Checklist

### **Backend**
- [ ] Update User model with new status enum
- [ ] Create OTPVerification model
- [ ] Create SellerApprovalRequest model
- [ ] Create AdminActionLog model
- [ ] Implement OTP generation and validation utility
- [ ] Create email templates
- [ ] Implement seller registration endpoint
- [ ] Implement OTP verification endpoint
- [ ] Implement resend OTP endpoint
- [ ] Update login endpoint with status checks
- [ ] Create admin endpoints (get pending, approve, reject)
- [ ] Add rate limiting middleware
- [ ] Implement audit logging
- [ ] Add unit tests for critical flows
- [ ] Add integration tests

### **Frontend**
- [ ] Create seller registration form
- [ ] Create OTP verification component
- [ ] Add status-based login error handling
- [ ] Create admin seller approval tab
- [ ] Create seller details modal
- [ ] Create rejection reason modal
- [ ] Add toast notifications for all actions
- [ ] Implement resend OTP with cooldown
- [ ] Add loading states
- [ ] Add form validation
- [ ] Implement responsive design
- [ ] Add accessibility features

### **DevOps & Deployment**
- [ ] Set up email service (SendGrid/AWS SES)
- [ ] Configure environment variables
- [ ] Set up Redis for OTP storage (production)
- [ ] Configure rate limiting
- [ ] Set up monitoring and alerts
- [ ] Database migrations
- [ ] Backup strategy
- [ ] Performance testing
- [ ] Security audit

---

## 📊 Testing Scenarios

### **Unit Tests**
1. OTP generation and validation
2. Password hashing and comparison
3. Email format validation
4. Status transitions
5. Rate limiting logic

### **Integration Tests**
1. Complete registration flow
2. OTP verification flow
3. Login with different statuses
4. Admin approval flow
5. Admin rejection flow
6. Email delivery

### **E2E Tests**
1. Seller registers → Verifies OTP → Waits for approval → Logs in
2. Seller registers → Admin rejects → Seller cannot login
3. Multiple OTP resend attempts with cooldown
4. Concurrent admin actions

---

## 📈 Monitoring & Metrics

### **Key Metrics to Track**
- Registration completion rate
- OTP verification success rate
- Average approval time
- Rejection rate and reasons
- Login attempt failures by status
- Email delivery success rate

### **Alerts to Set Up**
- High OTP failure rate (>20%)
- Email delivery failures
- Long pending approval time (>48 hours)
- High rejection rate (>30%)
- Unusual login attempt patterns

---

## 🎯 Success Criteria

✓ Sellers cannot login until email verified
✓ Sellers cannot login until admin approved
✓ All status transitions logged
✓ All email notifications sent
✓ Clear error messages for each scenario
✓ Admin can view all pending requests
✓ Admin actions are audited
✓ OTP system is secure (rate limited, expiring)
✓ Rejected sellers get clear reasons
✓ Zero downtime during implementation

---

**Document Version:** 1.0  
**Last Updated:** January 25, 2026  
**Author:** Development Team  
**Status:** Production-Ready Blueprint
