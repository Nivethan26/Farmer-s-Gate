const Negotiation = require('../models/Negotiation');

exports.listNegotiationsForUser = async (req, res) => {
  try {
    const negotiations = await Negotiation.find({ $or: [{ buyerId: req.userId }, { sellerId: req.userId }] }).populate('productId').populate('buyerId').populate('sellerId').sort({ createdAt: -1 });
    res.status(200).json(negotiations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getNegotiation = async (req, res) => {
  try {
    const negotiation = await Negotiation.findById(req.params.id).populate('productId').populate('buyerId').populate('sellerId');
    if (!negotiation) return res.status(404).json({ error: 'Negotiation not found' });
    if (negotiation.buyerId._id.toString() !== req.userId && negotiation.sellerId._id.toString() !== req.userId) return res.status(403).json({ error: 'Unauthorized' });
    res.status(200).json(negotiation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createNegotiation = async (req, res) => {
  try {
    const { productId, proposedPrice, quantity, message, sellerId } = req.body;
    const negotiation = new Negotiation({ productId, buyerId: req.userId, sellerId, proposedPrice, quantity, message, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) });
    await negotiation.save();
    await negotiation.populate('productId').populate('buyerId').populate('sellerId');
    res.status(201).json({ message: 'Negotiation created successfully', negotiation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.acceptNegotiation = async (req, res) => {
  try {
    const negotiation = await Negotiation.findById(req.params.id);
    if (!negotiation) return res.status(404).json({ error: 'Negotiation not found' });
    if (negotiation.sellerId.toString() !== req.userId) return res.status(403).json({ error: 'Unauthorized' });
    negotiation.status = 'accepted';
    await negotiation.save();
    await negotiation.populate('productId').populate('buyerId').populate('sellerId');
    res.status(200).json({ message: 'Negotiation accepted', negotiation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.rejectNegotiation = async (req, res) => {
  try {
    const negotiation = await Negotiation.findById(req.params.id);
    if (!negotiation) return res.status(404).json({ error: 'Negotiation not found' });
    if (negotiation.sellerId.toString() !== req.userId) return res.status(403).json({ error: 'Unauthorized' });
    negotiation.status = 'rejected';
    await negotiation.save();
    await negotiation.populate('productId').populate('buyerId').populate('sellerId');
    res.status(200).json({ message: 'Negotiation rejected', negotiation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteNegotiation = async (req, res) => {
  try {
    const negotiation = await Negotiation.findById(req.params.id);
    if (!negotiation) return res.status(404).json({ error: 'Negotiation not found' });
    if (negotiation.buyerId.toString() !== req.userId && negotiation.sellerId.toString() !== req.userId) return res.status(403).json({ error: 'Unauthorized' });
    await Negotiation.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Negotiation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
