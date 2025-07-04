const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { 
  createProductValidationRules,  // Измененное имя
  updateProductValidationRules,  // Новое правило
  validate 
} = require('../validators/productValidator');

// Get all products with optional pagination and filtering
router.get('/', async (req, res) => {
  try {
    const { limit, offset, category } = req.query;
    const products = await Product.getAll(
      parseInt(limit),
      parseInt(offset),
      category
    );
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.getById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new product
router.post('/', createProductValidationRules(), validate, async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update product
router.put('/:id', updateProductValidationRules(), validate, async (req, res) => {
    try {
    const updatedProduct = await Product.update(req.params.id, req.body);
    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const success = await Product.delete(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;