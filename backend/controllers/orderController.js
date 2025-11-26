const Order = require('../models/Order');

exports.listOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('buyerId').populate('items.productId');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.listBuyerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.userId }).populate('items.productId').sort({ createdAt: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('buyerId').populate('items.productId');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.buyerId.toString() !== req.userId && req.userRole !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { items, subtotal, deliveryFee, total } = req.body;
    const order = new Order({ buyerId: req.userId, items, subtotal, deliveryFee, total, status: 'pending' });
    await order.save();
    await order.populate('items.productId');
    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['pending', 'paid', 'shipped', 'delivered', 'cancelled'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
    const order = await Order.findByIdAndUpdate(req.params.id, { status, ...(status === 'paid' && { paidAt: new Date() }), ...(status === 'delivered' && { deliveredAt: new Date() }) }, { new: true }).populate('items.productId');
    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.buyerId.toString() !== req.userId) return res.status(403).json({ error: 'Unauthorized' });
    order.status = 'paid';
    order.paidAt = new Date();
    await order.save();
    await order.populate('items.productId');
    res.status(200).json({ message: 'Order marked as paid', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.buyerId.toString() !== req.userId && req.userRole !== 'admin') return res.status(403).json({ error: 'Unauthorized' });
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
