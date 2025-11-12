const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateInvoiceNumber = async (businessId) => {
  const settings = await prisma.businessSettings.findUnique({
    where: { businessId }
  });

  const invoiceNumber = `${settings.invoicePrefix}${settings.nextInvoiceNumber.toString().padStart(6, '0')}`;
  
  // Increment the next invoice number
  await prisma.businessSettings.update({
    where: { businessId },
    data: { nextInvoiceNumber: settings.nextInvoiceNumber + 1 }
  });

  return invoiceNumber;
};

module.exports = { generateInvoiceNumber };
