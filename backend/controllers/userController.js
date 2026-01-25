import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const role = req.query.role;

  let query = {};
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

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await User.deleteOne({ _id: req.params.id });
    res.json({ message: 'User removed' });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get user stats
// @route   GET /api/users/stats
// @access  Private/Admin
const getUserStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const buyers = await User.countDocuments({ role: 'buyer' });
  const sellers = await User.countDocuments({ role: 'seller' });
  const agents = await User.countDocuments({ role: 'agent' });
  const admins = await User.countDocuments({ role: 'admin' });
  const activeUsers = await User.countDocuments({ status: 'active' });
  const pendingUsers = await User.countDocuments({ status: 'pending' });

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

  if (user.role !== 'seller') {
    res.status(400);
    throw new Error('User is not a seller');
  }

  // Toggle between active and inactive
  user.status = user.status === 'active' ? 'inactive' : 'active';
  
  const updatedUser = await user.save();

  res.json({
    success: true,
    message: `Seller status updated to ${updatedUser.status}`,
    data: {
      _id: updatedUser._id,
      status: updatedUser.status,
      name: updatedUser.name,
      email: updatedUser.email
    }
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
};