// Send password reset email with secure link
const sendPasswordResetEmail = async (email, name, resetUrl) => {
  const subject = 'Reset Your Password - Farmer\'s Gate';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2d5a27;">Password Reset Request</h2>
      <p>Dear ${name || 'User'},</p>
      <p>We received a request to reset your password for your Farmer's Gate account.</p>
      <p>If you did not request this, you can safely ignore this email.</p>
      <div style="margin: 30px 0; text-align: center;">
        <a href="${resetUrl}" style="background-color: #2d5a27; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-size: 18px; font-weight: bold; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #ff6b6b; font-weight: bold;">⚠️ This link will expire in 10 minutes for your security.</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #666; font-size: 12px;">Best regards,<br>Farmer's Gate Team</p>
    </div>
  `;
  return await sendEmail(email, subject, html);
};
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // false for 587, true for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false // Accept self-signed certificates
  }
});

// Verify transporter configuration on startup
transporter.verify((error, success) => {
  if (error) {
console.log(process.env.EMAIL_USER)
console.log(process.env.EMAIL_PASS)


    console.error('❌ Email transporter verification failed:', error.message);
    console.log('📧 Email will not be sent. Please check your EMAIL_USER and EMAIL_PASS in .env');
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

const sendEmail = async (to, subject, html) => {
  // Check if email is configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn('⚠️  Email not configured. EMAIL_USER or EMAIL_PASS missing in .env');
    console.log('📧 Email would be sent to:', to);
    console.log('📧 Subject:', subject);
    return { success: false, error: 'Email not configured' };
  }

  try {
    const info = await transporter.sendMail({
      from: `"Farmer's Gate" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('✅ Email sent successfully:', info.messageId);
    console.log('📧 To:', to);
    console.log('📧 Subject:', subject);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email send error:', error.message);
    console.error('Full error:', error);
    return { success: false, error: error.message };
  }
};

const sendOTPEmail = async (email, otp, name = '', role = 'buyer') => {
  const subject = "Verify Your Email - Farmer's Gate";
  let roleText = '';
  if (role === 'seller') {
    roleText = 'Thank you for registering as a <b>seller</b> on Farmer\'s Gate!';
  } else if (role === 'buyer') {
    roleText = 'Thank you for registering as a <b>buyer</b> on Farmer\'s Gate!';
  } else if (role === 'agent') {
    roleText = 'Thank you for registering as an <b>agent</b> on Farmer\'s Gate!';
  } else {
    roleText = 'Thank you for registering on Farmer\'s Gate!';
  }
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2d5a27;">Farmer's Gate - Email Verification</h2>
      <p>Dear ${name},</p>
      <p>${roleText}</p>
      <p>Your OTP for email verification is:</p>
      <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; margin: 20px 0; letter-spacing: 5px; border-radius: 8px;">
        ${otp}
      </div>
      <p style="color: #ff6b6b; font-weight: bold;">⚠️ This OTP will expire in 10 minutes.</p>
      <p>If you didn't request this OTP, please ignore this email.</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #666; font-size: 12px;">Best regards,<br>Farmer's Gate Team</p>
    </div>
  `;
  return await sendEmail(email, subject, html);
};

const sendWelcomeEmail = async (email, name) => {
  const subject = 'Welcome to Farmer\'s Gate!';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2d5a27;">Welcome to Farmer's Gate, ${name}!</h2>
      <p>Thank you for joining our platform. You can now:</p>
      <ul>
        <li>Browse fresh produce from local farmers</li>
        <li>Negotiate prices directly with sellers</li>
        <li>Place orders and track deliveries</li>
        <li>Connect with the agricultural community</li>
      </ul>
      <p>Happy farming and trading!</p>
    </div>
  `;
  return await sendEmail(email, subject, html);
};

const sendRegistrationPendingEmail = async (email, name) => {
  const subject = 'Registration Submitted - Awaiting Approval';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2d5a27;">Registration Successfully Submitted!</h2>
      <p>Dear ${name},</p>
      <p>Your seller registration request has been successfully submitted.</p>
      <div style="background-color: #f8f9fa; padding: 20px; border-left: 4px solid #2d5a27; margin: 20px 0;">
        <p style="margin: 0;"><strong>✓ Email verified</strong></p>
        <p style="margin: 10px 0 0 0; color: #f39c12;"><strong>⏳ Pending admin approval</strong></p>
      </div>
      <p style="font-size: 16px; color: #ff6b6b; font-weight: bold;">
        📌 You can log in only after the admin approves your account.
      </p>
      <p>You will receive an email notification once your account is approved.</p>
      <p style="color: #666;">Typical approval time: <strong>1-2 business days</strong></p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #666; font-size: 12px;">Best regards,<br>Farmer's Gate Team</p>
    </div>
  `;
  return await sendEmail(email, subject, html);
};

const sendSellerApprovedEmail = async (email, name) => {
  const subject = '🎉 Your Seller Account Has Been Approved!';
  const loginUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2d5a27;">🎉 Great News, ${name}!</h2>
      <p>Your seller account has been <strong style="color: #27ae60;">APPROVED</strong>!</p>
      <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border: 2px solid #28a745;">
        <p style="margin: 0; color: #155724; font-size: 18px; font-weight: bold;">✓ Account Status: ACTIVE</p>
        <p style="margin: 10px 0 0 0; color: #155724;">✓ You can now log in and start selling!</p>
      </div>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${loginUrl}/login" style="background-color: #2d5a27; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">
          Login Now
        </a>
      </div>
      <p>Start uploading your products and connect with buyers today!</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #666; font-size: 12px;">Best regards,<br>Farmer's Gate Team</p>
    </div>
  `;
  return await sendEmail(email, subject, html);
};

const sendSellerRejectedEmail = async (email, name, rejectionReason) => {
  const subject = 'Registration Update - Farmer\'s Gate';
  const supportEmail = process.env.SUPPORT_EMAIL || 'support@farmersgate.com';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #c0392b;">Registration Update</h2>
      <p>Dear ${name},</p>
      <p>We regret to inform you that your seller registration has been <strong>rejected</strong>.</p>
      <div style="background-color: #f8d7da; padding: 20px; border-left: 4px solid #c0392b; margin: 20px 0;">
        <p style="margin: 0; font-weight: bold;">Reason for rejection:</p>
        <p style="margin: 10px 0 0 0; color: #721c24;">${rejectionReason}</p>
      </div>
      <p>If you believe this is an error or have questions, please contact our support team:</p>
      <p style="text-align: center;">
        <a href="mailto:${supportEmail}" style="color: #2d5a27; font-weight: bold;">${supportEmail}</a>
      </p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      <p style="color: #666; font-size: 12px;">Best regards,<br>Farmer's Gate Team</p>
    </div>
  `;
  return await sendEmail(email, subject, html);
};

const sendAgentCredentialsEmail = async (email, name, password, regions) => {
  const subject = '🎉 Welcome to Farmer\'s Gate - Agent Account Created';
  const loginUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
      <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2d5a27; margin: 0;">🌾 Farmer's Gate</h1>
          <p style="color: #666; margin: 10px 0 0 0;">Regional Coordinator Platform</p>
        </div>
        
        <h2 style="color: #2d5a27;">Welcome, ${name}! 👋</h2>
        <p>Your agent account has been successfully created by the administrator.</p>
        
        <div style="background-color: #d4edda; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #28a745;">
          <p style="margin: 0; color: #155724; font-weight: bold;">✓ Account Status: ACTIVE</p>
          <p style="margin: 10px 0 0 0; color: #155724;">✓ Role: Regional Coordinator (Agent)</p>
        </div>

        <div style="background-color: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffc107;">
          <h3 style="margin: 0 0 15px 0; color: #856404;">🔐 Your Login Credentials</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0; color: #333;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666; font-weight: bold;">Password:</td>
              <td style="padding: 8px 0;">
                <code style="background-color: #f0f0f0; padding: 5px 10px; border-radius: 4px; font-size: 16px; color: #c0392b; font-weight: bold;">${password}</code>
              </td>
            </tr>
          </table>
          <p style="margin: 15px 0 0 0; color: #856404; font-size: 14px;">
            <strong>⚠️ Important:</strong> Please change your password after your first login for security.
          </p>
        </div>

        <div style="background-color: #e7f3ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2196F3;">
          <h3 style="margin: 0 0 10px 0; color: #1976D2;">📍 Your Assigned Regions</h3>
          <p style="margin: 0; color: #1565C0; font-size: 16px; font-weight: bold;">${regions.join(', ')}</p>
        </div>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${loginUrl}/login" style="background-color: #2d5a27; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold; display: inline-block;">
            Login to Dashboard
          </a>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 15px 0; color: #2d5a27;">📋 Your Responsibilities</h3>
          <ul style="margin: 0; padding-left: 20px; color: #666;">
            <li style="margin: 10px 0;">Monitor farmers (sellers) in your assigned regions</li>
            <li style="margin: 10px 0;">Facilitate price negotiations between buyers and sellers</li>
            <li style="margin: 10px 0;">Add internal notes to track negotiation progress</li>
            <li style="margin: 10px 0;">Mark negotiations as connected when parties are engaged</li>
            <li style="margin: 10px 0;">Escalate complex issues to administrators</li>
          </ul>
        </div>

        <div style="background-color: #fff; padding: 15px; border: 2px dashed #ddd; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #666; font-size: 14px; text-align: center;">
            <strong>💡 First Steps:</strong> Log in → Explore Farmers Tab → Review Negotiations 
          </p>
        </div>

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        
        <div style="text-align: center; color: #666; font-size: 12px;">
          <p style="margin: 0;">Need help? Contact your administrator</p>
          <p style="margin: 10px 0 0 0;"><strong>Farmer's Gate Team</strong></p>
        </div>
      </div>
    </div>
  `;
  return await sendEmail(email, subject, html);
};

export { 
  sendOTPEmail, 
  sendWelcomeEmail, 
  sendRegistrationPendingEmail, 
  sendSellerApprovedEmail, 
  sendSellerRejectedEmail,
  sendAgentCredentialsEmail 
  ,sendPasswordResetEmail
};
