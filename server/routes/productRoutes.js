const express = require("express");
const router = express.Router();

const Product = require("../models/Product");

// GET All Products
router.get("/", async (req, res) => {

  try {

    const products = await Product.find();

    res.json(products);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});

// ADD Product
router.post("/", async (req, res) => {

  try {

    const newProduct = new Product({
      title: req.body.title,
      price: req.body.price,
      image: req.body.image,
      category: req.body.category,
      stock: req.body.stock,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
});

module.exports = router;