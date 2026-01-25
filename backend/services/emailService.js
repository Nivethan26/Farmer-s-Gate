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

const sendOTPEmail = async (email, otp, name = '') => {
  const subject = 'Verify Your Email - Farmer\'s Gate';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2d5a27;">Farmer's Gate - Email Verification</h2>
      <p>Dear ${name},</p>
      <p>Thank you for registering as a seller on Farmer's Gate!</p>
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

export { sendOTPEmail, sendWelcomeEmail, sendRegistrationPendingEmail, sendSellerApprovedEmail, sendSellerRejectedEmail };
