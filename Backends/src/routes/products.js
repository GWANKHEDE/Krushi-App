const express = require('express');
const {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { authenticateToken } = require('../middleware/auth');
const { validateProduct } = require('../middleware/validation');
const router = express.Router();

router.get('/', authenticateToken, getAllProducts);
router.get('/:id', authenticateToken, getProduct);
router.post('/', authenticateToken, validateProduct, createProduct);
router.put('/:id', authenticateToken, validateProduct, updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);

module.exports = router;
