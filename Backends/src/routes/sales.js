const express = require('express');
const { 
  getAllSales, 
  getSale, 
  createSale, 
  updateSale, 
  deleteSale,
  getSalesStats 
} = require('../controllers/saleController');
const { authenticateToken } = require('../middleware/auth');
const { validateSale } = require('../middleware/validation');
const router = express.Router();

router.get('/', authenticateToken, getAllSales);
router.get('/stats', authenticateToken, getSalesStats);
router.get('/:id', authenticateToken, getSale);
router.post('/', authenticateToken, validateSale, createSale);
router.put('/:id', authenticateToken, updateSale);
router.delete('/:id', authenticateToken, deleteSale);

module.exports = router;
