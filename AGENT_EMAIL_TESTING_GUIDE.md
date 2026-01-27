# Testing Guide - Agent Email Notification

## Quick Test Steps

### 1. Configure Email Service (Backend)

Create or update `.env` file in backend directory:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
FRONTEND_URL=http://localhost:5173
SUPPORT_EMAIL=support@farmersgate.com
```

**For Gmail Users:**
1. Enable 2-Factor Authentication on your Google account
2. Generate App-Specific Password:
   - Go to: https://myaccount.google.com/apppasswords
   - Select App: "Mail"
   - Select Device: "Other (Custom name)"
   - Name it: "Farmers Gate"
   - Copy the 16-character password
   - Use this as EMAIL_PASS

### 2. Test Email Configuration

Start the backend server and check the logs:

```bash
cd backend
npm start

# Look for:
✅ Email server is ready to send messages
# or
❌ Email transporter verification failed
```

### 3. Create Agent via Admin Panel

**Option A: Via Frontend UI**

1. Login as Admin:
   - Email: `admin@agrilink.lk`
   - Password: `admin123`

2. Navigate to: Admin Dashboard → Users Tab → Agents

3. Click: "Add New Agent"

4. Fill the form:
   - Name: `Test Agent`
   - Email: `your-test-email@gmail.com` ← Use your real email
   - Phone: `+94771234567`
   - Password: `TestAgent@123`
   - District: `Kandy`
   - Regions: Select `Central` and `North Central`
   - Office Contact: `+94112345678`
   - Status: `Active`

5. Click: "Add Agent"

6. Check your email inbox for the credentials email

**Option B: Via API (Postman/cURL)**

```bash
# 1. Login as Admin
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@agrilink.lk",
    "password": "admin123"
  }'

# Copy the token from response

# 2. Create Agent
curl -X POST http://localhost:5000/api/users/agent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Test Agent",
    "email": "your-test-email@gmail.com",
    "phone": "+94771234567",
    "password": "TestAgent@123",
    "district": "Kandy",
    "regions": ["Central", "North Central"],
    "officeContact": "+94112345678",
    "status": "active"
  }'
```

### 4. Verify Email Receipt

Check your email inbox for:
- **Subject:** 🎉 Welcome to Farmer's Gate - Agent Account Created
- **From:** Farmer's Gate
- **Contains:**
  - Welcome message
  - Login credentials (email and password)
  - Assigned regions
  - Login button
  - Responsibilities list

### 5. Test Agent Login

1. Open login page
2. Use the credentials from the email:
   - Email: `your-test-email@gmail.com`
   - Password: `TestAgent@123`
3. You should be redirected to Agent Dashboard
4. Verify you see the 3 tabs: Farmers, Negotiations, Alerts

## Expected Results

### Success Case:
```
✅ Agent account created successfully
✅ Email sent to: your-test-email@gmail.com
✅ Response: 201 Created
✅ Email received in inbox within 1-2 minutes
```

### Common Issues:

#### Issue 1: Email not configured
```
⚠️  Email not configured. EMAIL_USER or EMAIL_PASS missing in .env
📧 Email would be sent to: agent@example.com
```
**Solution:** Add EMAIL_USER and EMAIL_PASS to .env file and restart server

#### Issue 2: Gmail authentication failed
```
❌ Email send error: Invalid login: 535-5.7.8 Username and Password not accepted
```
**Solution:** 
- Use App-Specific Password (not your regular Gmail password)
- Enable "Less secure app access" OR use OAuth2

#### Issue 3: Email in spam folder
**Solution:** Check spam/junk folder, mark as "Not Spam"

#### Issue 4: Duplicate email error
```
400 Bad Request: An account with this email already exists
```
**Solution:** Use a different email address or delete existing agent first

## Testing Checklist

### Pre-Testing:
- [ ] Backend server running
- [ ] Email credentials configured in .env
- [ ] Email service verified (check logs for "Email server is ready")
- [ ] Admin account accessible

### Create Agent:
- [ ] Navigate to Admin Dashboard → Users → Agents
- [ ] Click "Add New Agent"
- [ ] Fill all required fields
- [ ] Submit form
- [ ] See success toast message

### Email Verification:
- [ ] Email received in inbox (or spam)
- [ ] Subject line correct
- [ ] Email contains login credentials
- [ ] Password is clearly visible
- [ ] Assigned regions displayed
- [ ] Login button works

### Agent Login:
- [ ] Login with credentials from email
- [ ] Redirected to Agent Dashboard
- [ ] Can see Farmers tab with region data
- [ ] Can see Negotiations tab
- [ ] Can see Alerts tab

### Security:
- [ ] Password is hashed in database (not plain text)
- [ ] Email not accessible by non-admins
- [ ] Agent has correct role and permissions
- [ ] Agent can only see data from assigned regions

## Sample Test Data

### Test Agent 1:
```json
{
  "name": "Kumara Silva",
  "email": "kumara.test@gmail.com",
  "phone": "+94771234567",
  "password": "Agent2026!",
  "district": "Kandy",
  "regions": ["Central"],
  "officeContact": "+94112345678",
  "status": "active"
}
```

### Test Agent 2:
```json
{
  "name": "Nimal Fernando",
  "email": "nimal.test@gmail.com",
  "phone": "+94772345678",
  "password": "SecurePass@123",
  "district": "Colombo",
  "regions": ["West", "North Western"],
  "officeContact": "+94113456789",
  "status": "active"
}
```

## Troubleshooting

### Problem: Email not sending
**Check:**
1. Is EMAIL_USER and EMAIL_PASS set in .env?
2. Is backend server restarted after .env changes?
3. Is email service verified on startup (check logs)?
4. Is SMTP server accessible (firewall/network)?
5. Are email credentials correct?

### Problem: Email goes to spam
**Solutions:**
1. Add sender to contacts/safe senders
2. Mark email as "Not Spam"
3. Configure SPF/DKIM records (production)
4. Use professional email service (SendGrid, AWS SES)

### Problem: Cannot create agent
**Check:**
1. Are you logged in as admin?
2. Is authorization token valid?
3. Are all required fields filled?
4. Is email address unique (not already used)?
5. Check backend logs for error details

### Problem: Agent cannot login
**Verify:**
1. Agent status is "active"
2. Correct email and password used
3. Password copied exactly from email (no extra spaces)
4. Account was actually created (check database/users list)

## Production Considerations

### Before Deployment:
1. **Use Professional Email Service:**
   - SendGrid (recommended)
   - AWS SES
   - Mailgun
   - Not Gmail for production

2. **Configure DNS Records:**
   - SPF record for domain
   - DKIM signature
   - DMARC policy

3. **Email Best Practices:**
   - Use branded domain email (noreply@yourdomain.com)
   - Set up email bounce handling
   - Monitor email delivery rates
   - Implement email queue for reliability

4. **Security:**
   - Use environment variables (never commit credentials)
   - Rotate email credentials regularly
   - Monitor for suspicious activity
   - Implement rate limiting

## Alternative: Using SendGrid

### Setup SendGrid:
```env
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your_sendgrid_api_key
```

### Benefits:
- Better deliverability
- Email analytics
- Higher sending limits
- Professional service
- No Gmail restrictions

---

## Quick Commands

### Start Backend:
```bash
cd backend
npm install
npm start
```

### Check Logs:
```bash
# Look for email verification
✅ Email server is ready to send messages

# Look for agent creation
✅ Agent account created: agent@example.com
✅ Agent credentials email sent to: agent@example.com
```

### Test API:
```bash
# Health check
curl http://localhost:5000/api/health

# Create agent (replace token)
curl -X POST http://localhost:5000/api/users/agent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d @agent.json
```

---

**Need Help?**
- Check backend console logs for detailed error messages
- Verify .env file configuration
- Test with a different email provider
- Contact system administrator

**Email Issues?**
- Try a different email address
- Check spam/junk folder
- Verify email credentials
- Test SMTP connection manually
