const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");

// @desc    Get AI-like search suggestions
// @route   GET /api/products/suggestions
// @access  Public
const getProductSuggestions = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword;
  if (!keyword) return res.json([]);
  
  const products = await Product.find({
    title: { $regex: keyword, $options: 'i' }
  }).select('title').limit(5);
  
  res.json(products);
});

// @desc    Fetch all products with keyword and filtering
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
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
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Product already reviewed');
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
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
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
});

module.exports = {
  getProductSuggestions,
  getProducts,
  getProductById,
  createProductReview,
  createProduct,
};
