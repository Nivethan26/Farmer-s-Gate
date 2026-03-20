const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const isOTPValid = (otp, storedOTP, expiryTime) => {
  const currentTime = Date.now();
  return otp === storedOTP && currentTime < expiryTime;
};

export { generateOTP, isOTPValid };
