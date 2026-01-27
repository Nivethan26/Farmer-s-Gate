import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { sendAgentCredentialsEmail } from '../services/emailService.js';
import { createWithPublicId } from '../utils/createWithPublicId.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const role = req.query.role;

  let query = { isDeleted: { $ne: true } };
  if (role) {
    query.role = role;
  }

  const count = await User.countDocuments(query);
  const users = await User.find(query)
    .select('-password')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    users,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  });
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.status = req.body.status || user.status;

    // Update role-specific fields
    if (req.body.firstName !== undefined) user.firstName = req.body.firstName;
    if (req.body.lastName !== undefined) user.lastName = req.body.lastName;
    if (req.body.nic !== undefined) user.nic = req.body.nic;
    if (req.body.district !== undefined) user.district = req.body.district;
    if (req.body.address !== undefined) user.address = req.body.address;
    if (req.body.preferredCategories !== undefined) user.preferredCategories = req.body.preferredCategories;
    if (req.body.farmName !== undefined) user.farmName = req.body.farmName;
    if (req.body.bank !== undefined) user.bank = req.body.bank;
    if (req.body.regions !== undefined) user.regions = req.body.regions;
    if (req.body.officeContact !== undefined) user.officeContact = req.body.officeContact;
    if (req.body.permissions !== undefined) user.permissions = req.body.permissions;

    const updatedUser = await user.save();

    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Delete user (soft delete)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.isDeleted) {
    res.status(400);
    throw new Error('User is already deleted');
  }

  // Soft delete the user
  user.isDeleted = true;
  user.deletedAt = new Date();
  user.status = 'inactive';
  await user.save();

  // If user is a seller, deactivate all their products
  if (user.role === 'seller') {
    const result = await Product.updateMany(
      { sellerId: user._id.toString() },
      { 
        $set: { 
          isActive: false,
          updatedAt: new Date()
        } 
      }
    );
    
    res.json({ 
      message: 'User deleted successfully',
      productsDeactivated: result.modifiedCount
    });
  } else {
    res.json({ message: 'User deleted successfully' });
  }
});

// @desc    Get user stats
// @route   GET /api/users/stats
// @access  Private/Admin
const getUserStats = asyncHandler(async (req, res) => {
  const query = { isDeleted: { $ne: true } };
  const totalUsers = await User.countDocuments(query);
  const buyers = await User.countDocuments({ ...query, role: 'buyer' });
  const sellers = await User.countDocuments({ ...query, role: 'seller' });
  const agents = await User.countDocuments({ ...query, role: 'agent' });
  const admins = await User.countDocuments({ ...query, role: 'admin' });
  const activeUsers = await User.countDocuments({ ...query, status: 'active' });
  const pendingUsers = await User.countDocuments({ ...query, status: 'pending' });

  res.json({
    totalUsers,
    buyers,
    sellers,
    agents,
    admins,
    activeUsers,
    pendingUsers,
  });
});

// @desc    Add reward points to user
// @route   PUT /api/users/:id/add-points
// @access  Private/Admin
const addRewardPoints = asyncHandler(async (req, res) => {
  const { points } = req.body;
  const user = await User.findById(req.params.id);

  if (user) {
    user.rewardPoints = (user.rewardPoints || 0) + points;
    const updatedUser = await user.save();
    res.json({ rewardPoints: updatedUser.rewardPoints });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Redeem reward points from user
// @route   PUT /api/users/:id/redeem-points
// @access  Private/Admin or Self
const redeemRewardPoints = asyncHandler(async (req, res) => {
  const { points } = req.body;
  const user = await User.findById(req.params.id);

  if (user) {
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      res.status(403);
      throw new Error('Not authorized to redeem points for this user');
    }

    if (user.rewardPoints < points) {
      res.status(400);
      throw new Error('Insufficient reward points');
    }

    user.rewardPoints = (user.rewardPoints || 0) - points;
    const updatedUser = await user.save();
    res.json({ rewardPoints: updatedUser.rewardPoints });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Toggle seller status (active/inactive)
// @route   PATCH /api/users/:id/toggle-status
// @access  Private/Admin
const toggleSellerStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.isDeleted) {
    res.status(400);
    throw new Error('Cannot modify deleted user');
  }

  if (user.role !== 'seller') {
    res.status(400);
    throw new Error('User is not a seller');
  }

  // Toggle between active and inactive
  const newStatus = user.status === 'active' ? 'inactive' : 'active';
  user.status = newStatus;
  
  const updatedUser = await user.save();

  // Cascade status change to all seller's products
  const productUpdate = await Product.updateMany(
    { sellerId: user._id.toString() },
    { 
      $set: { 
        isActive: newStatus === 'active',
        updatedAt: new Date()
      } 
    }
  );

  res.json({
    success: true,
    message: `Seller status updated to ${updatedUser.status}`,
    data: {
      _id: updatedUser._id,
      status: updatedUser.status,
      name: updatedUser.name,
      email: updatedUser.email
    },
    productsUpdated: productUpdate.modifiedCount
  });
});

// @desc    Create agent account (Admin only)
// @route   POST /api/users/agent
// @access  Private/Admin
const createAgent = asyncHandler(async (req, res) => {
  const { name, email, phone, password, district, regions, officeContact, status } = req.body;

  // Validate required fields
  if (!name || !email || !phone || !password || !district || !regions || regions.length === 0) {
    res.status(400);
    throw new Error('Please provide all required fields: name, email, phone, password, district, and regions');
  }

  // Check if user with email already exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  // Validate regions array
  if (!Array.isArray(regions) || regions.length === 0) {
    res.status(400);
    throw new Error('At least one region must be assigned');
  }

  // Create agent user
  const agentData = {
    name,
    email,
    phone,
    password, // Will be hashed by pre-save middleware
    role: 'agent',
    district,
    regions,
    officeContact: officeContact || '',
    status: status || 'active',
    isEmailVerified: true, // Agent accounts are pre-verified
  };

  const agent = await createWithPublicId(User, agentData);

  if (agent) {
    // Send email with credentials to the agent
    try {
      await sendAgentCredentialsEmail(email, name, password, regions);
      console.log('✅ Agent credentials email sent to:', email);
    } catch (emailError) {
      console.error('❌ Failed to send agent credentials email:', emailError.message);
      // Don't fail the request if email fails, just log it
    }

    res.status(201).json({
      _id: agent._id,
      publicId: agent.publicId,
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      role: agent.role,
      district: agent.district,
      regions: agent.regions,
      officeContact: agent.officeContact,
      status: agent.status,
      message: 'Agent account created successfully. Credentials have been sent via email.',
    });
  } else {
    res.status(400);
    throw new Error('Failed to create agent account');
  }
});

// @desc    Update agent status (Admin only)
// @route   PATCH /api/users/:id/agent-status
// @access  Private/Admin
const updateAgentStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  if (!status || !['active', 'inactive'].includes(status)) {
    res.status(400);
    throw new Error('Valid status (active or inactive) is required');
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('Agent not found');
  }

  if (user.role !== 'agent') {
    res.status(400);
    throw new Error('User is not an agent');
  }

  user.status = status;
  const updatedAgent = await user.save();

  res.json({
    _id: updatedAgent._id,
    name: updatedAgent.name,
    email: updatedAgent.email,
    status: updatedAgent.status,
    message: `Agent status updated to ${status}`,
  });
});

// @desc    Get users (sellers/buyers) in agent's district
// @route   GET /api/users/agent/regional-users
// @access  Private/Agent
const getRegionalUsers = asyncHandler(async (req, res) => {
  // Get agent's assigned district
  const agentDistrict = req.user.district;
  
  console.log('Agent requesting regional users');
  console.log('Agent ID:', req.user._id);
  console.log('Agent district:', agentDistrict);
  
  if (!agentDistrict) {
    console.log('No district assigned to agent');
    return res.json({ sellers: [], buyers: [] });
  }

  // Check all sellers with their districts for debugging
  const allSellers = await User.find({ 
    role: 'seller',
    isDeleted: { $ne: true }
  }).select('_id name district').limit(10);
  
  console.log('Sample of all sellers in system:', allSellers.map(s => ({ name: s.name, district: s.district })));

  // Find all sellers and buyers in agent's district (case-insensitive)
  const sellers = await User.find({ 
    role: 'seller',
    district: { $regex: new RegExp(`^${agentDistrict}$`, 'i') },
    isDeleted: { $ne: true }
  }).select('-password').sort({ createdAt: -1 });

  const buyers = await User.find({ 
    role: 'buyer',
    district: { $regex: new RegExp(`^${agentDistrict}$`, 'i') },
    isDeleted: { $ne: true }
  }).select('-password').sort({ createdAt: -1 });

  console.log(`Found ${sellers.length} sellers in district: ${agentDistrict}`);
  console.log(`Found ${buyers.length} buyers in district: ${agentDistrict}`);
  
  // Log sample seller districts to debug
  if (sellers.length > 0) {
    console.log('Sample seller districts:', sellers.slice(0, 3).map(s => ({ id: s._id, district: s.district })));
  }

  res.json({ sellers, buyers });
});

// @desc    Get agents by district
// @route   GET /api/users/agents/by-district/:district
// @access  Public (for buyers to connect with agents)
const getAgentsByDistrict = asyncHandler(async (req, res) => {
  const district = req.params.district;

  if (!district) {
    res.status(400);
    throw new Error('District parameter is required');
  }

  // Find agents in the specified district
  const agents = await User.find({
    role: 'agent',
    district: { $regex: new RegExp(`^${district}$`, 'i') },
    isDeleted: { $ne: true }
  })
    .select('name email phone officeContact district regions')
    .sort({ createdAt: -1 });

  res.json(agents);
});

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private (All authenticated users)
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Please provide both current and new password');
  }

  if (newPassword.length < 6) {
    res.status(400);
    throw new Error('New password must be at least 6 characters');
  }

  // Get user with password
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Check if current password matches
  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

export {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserStats,
  addRewardPoints,
  redeemRewardPoints,
  toggleSellerStatus,
  createAgent,
  updateAgentStatus,
  getRegionalUsers,
  getAgentsByDistrict,
  changePassword,
};