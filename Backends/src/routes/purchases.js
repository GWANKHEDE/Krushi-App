const express = require('express');
const { 
  createPurchase,
  getAllPurchases 
} = require('../controllers/purchaseController');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticateToken, getAllPurchases);
router.post('/', authenticateToken, createPurchase);

module.exports = router;
