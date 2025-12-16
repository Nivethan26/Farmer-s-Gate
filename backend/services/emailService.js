import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Farmer's Gate" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email send error:', error);
    return { success: false, error: error.message };
  }
};

const sendOTPEmail = async (email, otp) => {
  const subject = 'Your OTP for Farmer\'s Gate';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2d5a27;">Farmer's Gate - OTP Verification</h2>
      <p>Your OTP for verification is:</p>
      <div style="background-color: #f0f0f0; padding: 20px; text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
        ${otp}
      </div>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn't request this OTP, please ignore this email.</p>
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

export { sendEmail, sendOTPEmail, sendWelcomeEmail };
