const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { successResponse, errorResponse } = require('../utils/response');
const prisma = new PrismaClient();

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, phone } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        business: {
          update: {
            contactNumber: phone
          }
        }
      },
      include: {
        business: {
          include: {
            settings: true
          }
        }
      }
    });

    successResponse(res, updatedUser, 'Profile updated successfully');
  } catch (error) {
    errorResponse(res, error.message);
  }
};

const updateBusiness = async (req, res) => {
  try {
    const businessId = req.user.business.id;
    const { name, address, email, gstin } = req.body;

    const updatedBusiness = await prisma.business.update({
      where: { id: businessId },
      data: {
        name,
        address,
        email,
        gstin
      },
      include: {
        settings: true
      }
    });

    successResponse(res, updatedBusiness, 'Business information updated successfully');
  } catch (error) {
    errorResponse(res, error.message);
  }
};

const updatePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return errorResponse(res, 'User not found', 404);
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return errorResponse(res, 'Current password is incorrect', 400);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    successResponse(res, null, 'Password updated successfully');
  } catch (error) {
    errorResponse(res, error.message);
  }
};

const updateSettings = async (req, res) => {
  try {
    const businessId = req.user.business.id;
    const { lowStockAlert, gstReminder, gstRate, invoicePrefix } = req.body;

    const updatedSettings = await prisma.businessSettings.upsert({
      where: { businessId },
      update: {
        lowStockAlert,
        gstReminder,
        gstRate,
        invoicePrefix
      },
      create: {
        businessId,
        lowStockAlert,
        gstReminder,
        gstRate,
        invoicePrefix,
        nextInvoiceNumber: 1
      }
    });

    successResponse(res, updatedSettings, 'Settings updated successfully');
  } catch (error) {
    errorResponse(res, error.message);
  }
};

const generatePDF = async (req, res) => {
  try {
    const businessId = req.user.business.id;
    const { billData } = req.body;

    // In a real implementation, you would generate PDF here
    // This is a simplified version
    const pdfUrl = `/api/bills/generate-pdf`; // Your PDF generation endpoint

    successResponse(res, { pdfUrl }, 'PDF generated successfully');
  } catch (error) {
    errorResponse(res, error.message);
  }
};

module.exports = {
  updateProfile,
  updateBusiness,
  updatePassword,
  updateSettings,
  generatePDF
};
