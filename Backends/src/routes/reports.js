const express = require('express');
const { 
  getSalesReport,
  getGSTReport 
} = require('../controllers/reportController');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.get('/sales', authenticateToken, getSalesReport);
router.get('/gst', authenticateToken, getGSTReport);

module.exports = router;
