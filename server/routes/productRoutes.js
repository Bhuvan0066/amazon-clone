const express = require("express");
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');

const Product = require("../models/Product");

// @desc    Get AI-like search suggestions
// @route   GET /api/products/suggestions
// @access  Public
router.get("/suggestions", async (req, res) => {
  try {
    const keyword = req.query.keyword;
    if (!keyword) return res.json([]);
    
    // Find top 5 matching product titles
    const products = await Product.find({
      title: { $regex: keyword, $options: 'i' }
    }).select('title').limit(5);
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Fetch all products with keyword and filtering
// @route   GET /api/products
// @access  Public
// @desc    Get AI-like search suggestions
// @route   GET /api/products/suggestions
// @access  Public
router.get('/suggestions', async (req, res) => {
  try {
    const keyword = req.query.keyword;
    if (!keyword) return res.json([]);
    const products = await Product.find({
      title: { $regex: keyword, $options: 'i' }
    }).select('title').limit(5);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? {
          title: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};

    const category = req.query.category ? { category: req.query.category } : {};

    const products = await Product.find({ ...keyword, ...category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
router.post("/:id/reviews", protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }

      const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.ratings =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const newProduct = new Product({
      title: req.body.title || 'Sample title',
      price: req.body.price || 0,
      image: req.body.image || '/images/sample.jpg',
      images: req.body.images || [],
      description: req.body.description || 'Sample description',
      category: req.body.category || 'General',
      stock: req.body.stock || 10,
      badges: req.body.badges || [],
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
