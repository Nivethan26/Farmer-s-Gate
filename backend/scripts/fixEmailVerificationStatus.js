import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const fixEmailVerificationStatus = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    // Find all sellers with pending status who have isEmailVerified = false or undefined
    const result = await User.updateMany(
      {
        role: 'seller',
        status: { $in: ['pending', 'active'] },
        $or: [
          { isEmailVerified: false },
          { isEmailVerified: { $exists: false } }
        ]
      },
      {
        $set: { isEmailVerified: true }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} sellers to have isEmailVerified: true`);

    // Show the updated sellers
    const updatedSellers = await User.find({
      role: 'seller',
      status: { $in: ['pending', 'active'] },
      isEmailVerified: true
    }).select('name email status isEmailVerified');

    console.log('\nUpdated sellers:');
    updatedSellers.forEach(seller => {
      console.log(`  - ${seller.name} (${seller.email}) - Status: ${seller.status}, Email Verified: ${seller.isEmailVerified}`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixEmailVerificationStatus();
