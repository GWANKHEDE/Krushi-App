const express = require('express');
const { 
  getAllSuppliers, 
  createSupplier 
} = require('../controllers/supplierController');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.get('/', authenticateToken, getAllSuppliers);
router.post('/', authenticateToken, createSupplier);

module.exports = router;
