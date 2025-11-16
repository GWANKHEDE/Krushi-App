const express = require('express');
const { 
  updateProfile,
  updateBusiness,
  updatePassword,
  updateSettings,
  generatePDF
} = require('../controllers/settingsController');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

router.put('/profile', authenticateToken, updateProfile);
router.put('/business', authenticateToken, updateBusiness);
router.put('/password', authenticateToken, updatePassword);
router.put('/preferences', authenticateToken, updateSettings);
router.post('/generate-pdf', authenticateToken, generatePDF);

module.exports = router;
