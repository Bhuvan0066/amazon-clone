const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true }
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
  }],
  description: {
    type: String,
    required: true,
    default: "Product description"
  },
  category: {
    type: String,
    default: "General",
  },
  stock: {
    type: Number,
    default: 10,
  },
  location: {
    type: String,
    default: "India",
  },
  locationCode: {
    type: String,
    default: "IN",
  },
  badges: [{
    type: String
  }],
  ratings: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  },
  reviews: [reviewSchema],
}, { timestamps: true });

// Add text index for fast AI-like autocomplete search
productSchema.index({ title: 'text', category: 'text' });

module.exports = mongoose.model("Product", productSchema);