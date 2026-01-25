import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

async function removeBuyerNameField() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find all buyer users that have a name field
    const buyersWithName = await User.find({ 
      role: 'buyer',
      name: { $exists: true }
    });

    console.log(`📊 Found ${buyersWithName.length} buyer users with name field`);

    if (buyersWithName.length === 0) {
      console.log('✅ No buyer users found with name field. Database is already clean.');
      return;
    }

    // Log the buyers that will be updated (for confirmation)
    console.log('\n📋 Buyers that will have name field removed:');
    buyersWithName.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user._id} | Name: "${user.name}" | Email: ${user.email} | FirstName: "${user.firstName || 'N/A'}" | LastName: "${user.lastName || 'N/A'}"`);
    });

    console.log('\n🔄 Starting cleanup process...');

    // Remove the name field from all buyer users
    const result = await User.updateMany(
      { role: 'buyer' },
      { $unset: { name: "" } }
    );

    console.log(`✅ Successfully updated ${result.modifiedCount} buyer users`);
    console.log(`📊 Matched ${result.matchedCount} buyer users`);

    // Verify the cleanup
    const remainingBuyersWithName = await User.countDocuments({ 
      role: 'buyer',
      name: { $exists: true }
    });

    if (remainingBuyersWithName === 0) {
      console.log('✅ Cleanup verification passed: No buyer users have name field anymore');
    } else {
      console.log(`⚠️  Warning: ${remainingBuyersWithName} buyer users still have name field`);
    }

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the cleanup
removeBuyerNameField();