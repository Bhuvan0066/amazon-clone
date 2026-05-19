const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

// @desc    Toggle item in wishlist
// @route   POST /api/users/wishlist
// @access  Private
router.post("/wishlist", protect, async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (user.wishlist.includes(productId)) {
      // Remove from wishlist
      user.wishlist = user.wishlist.filter(id => id.toString() !== productId.toString());
      await user.save();
      res.json({ message: "Removed from wishlist", wishlist: user.wishlist });
    } else {
      // Add to wishlist
      user.wishlist.push(productId);
      await user.save();
      res.json({ message: "Added to wishlist", wishlist: user.wishlist });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
router.get("/wishlist", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
