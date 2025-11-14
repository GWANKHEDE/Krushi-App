const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateInvoiceNumber = async (businessId) => {
  try {
    const settings = await prisma.businessSettings.findUnique({
      where: { businessId }
    });

    if (!settings) {
      throw new Error('Business settings not found');
    }

    const invoiceNumber = `${settings.invoicePrefix}${settings.nextInvoiceNumber.toString().padStart(6, '0')}`;
    
    // Increment the next invoice number
    await prisma.businessSettings.update({
      where: { businessId },
      data: { nextInvoiceNumber: settings.nextInvoiceNumber + 1 }
    });

    return invoiceNumber;
  } catch (error) {
    console.error('Error generating invoice number:', error);
    // Fallback invoice number
    return `INV${Date.now()}`;
  }
};

module.exports = { generateInvoiceNumber };
