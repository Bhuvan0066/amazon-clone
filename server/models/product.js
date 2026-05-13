const mongoose = require("mongoose");

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

  category: {
    type: String,
    default: "General",
  },

  stock: {
    type: Number,
    default: 10,
  },

});

module.exports = mongoose.model("Product", productSchema);