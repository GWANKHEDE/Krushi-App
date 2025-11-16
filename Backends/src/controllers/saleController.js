const { PrismaClient } = require('@prisma/client');
const { successResponse, errorResponse } = require('../utils/response');
const { generateInvoiceNumber } = require('../utils/invoice');
const prisma = new PrismaClient();

const getAllSales = async (req, res) => {
  try {
    const businessId = req.user.business.id;
    const { page = 1, limit = 20, startDate, endDate, customerId } = req.query;

    const where = { businessId };

    if (startDate || endDate) {
      where.saleDate = {};
      if (startDate) where.saleDate.gte = new Date(startDate);
      if (endDate) where.saleDate.lte = new Date(endDate);
    }

    if (customerId) {
      where.customerId = customerId;
    }

    const sales = await prisma.sale.findMany({
      where,
      include: {
        customer: true,
        saleItems: {
          include: {
            product: true
          }
        }
      },
      orderBy: { saleDate: 'desc' },
      skip: (page - 1) * limit,
      take: parseInt(limit)
    });

    const total = await prisma.sale.count({ where });
    const totalAmount = await prisma.sale.aggregate({
      where,
      _sum: { totalAmount: true }
    });

    successResponse(res, {
      sales,
      summary: {
        totalSales: total,
        totalAmount: totalAmount._sum.totalAmount || 0
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    errorResponse(res, error.message);
  }
};

const getSale = async (req, res) => {
  try {
    const { id } = req.params;
    const businessId = req.user.business.id;

    const sale = await prisma.sale.findFirst({
      where: { id, businessId },
      include: {
        customer: true,
        saleItems: {
          include: {
            product: true
          }
        }
      }
    });

    if (!sale) {
      return errorResponse(res, 'Sale not found', 404);
    }

    successResponse(res, sale);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

const createSale = async (req, res) => {
  try {
    const businessId = req.user.business.id;
    const { 
      customerId, 
      customerName, 
      customerPhone, 
      saleItems, 
      subtotal, 
      taxAmount, 
      discount = 0, 
      totalAmount, 
      paymentMethod = 'CASH', 
      paymentStatus = 'PAID',
      notes 
    } = req.body;

    // Validate required fields
    if (!saleItems || !Array.isArray(saleItems) || saleItems.length === 0) {
      return errorResponse(res, 'Sale items are required', 400);
    }

    if (subtotal === undefined || totalAmount === undefined) {
      return errorResponse(res, 'Subtotal and total amount are required', 400);
    }

    // Validate that either customerId or customerName is provided
    if (!customerId && !customerName) {
      return errorResponse(res, 'Either customer ID or customer name is required', 400);
    }

    // Generate invoice number
    const invoiceNumber = await generateInvoiceNumber(businessId);

    // Create sale with transaction
    const sale = await prisma.$transaction(async (tx) => {
      // Validate stock and calculate totals
      for (const item of saleItems) {
        const product = await tx.product.findFirst({
          where: { 
            id: item.productId,
            businessId,
            isActive: true
          }
        });

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        if (product.currentStock < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}. Available: ${product.currentStock}, Requested: ${item.quantity}`);
        }
      }

      // Prepare sale data
      const saleData = {
        invoiceNumber,
        businessId,
        subtotal: parseFloat(subtotal),
        taxAmount: parseFloat(taxAmount || 0),
        discount: parseFloat(discount),
        totalAmount: parseFloat(totalAmount),
        paymentMethod,
        paymentStatus,
        notes,
        saleItems: {
          create: saleItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice
          }))
        }
      };

      // Add customer information
      if (customerId) {
        saleData.customerId = customerId;
      } else {
        saleData.customerName = customerName;
        saleData.customerPhone = customerPhone;
      }

      // Create sale
      const sale = await tx.sale.create({
        data: saleData,
        include: {
          saleItems: {
            include: {
              product: true
            }
          },
          customer: true
        }
      });

      // Update product stock
      for (const item of saleItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            currentStock: {
              decrement: item.quantity
            }
          }
        });
      }

      return sale;
    });

    successResponse(res, sale, 'Sale created successfully', 201);
  } catch (error) {
    console.error('Error creating sale:', error);
    errorResponse(res, error.message);
  }
};

const updateSale = async (req, res) => {
  try {
    const { id } = req.params;
    const businessId = req.user.business.id;
    const { paymentStatus, paymentMethod, notes } = req.body;

    const sale = await prisma.sale.findFirst({
      where: { id, businessId }
    });

    if (!sale) {
      return errorResponse(res, 'Sale not found', 404);
    }

    const updatedSale = await prisma.sale.update({
      where: { id },
      data: {
        paymentStatus,
        paymentMethod,
        notes
      },
      include: {
        customer: true,
        saleItems: {
          include: {
            product: true
          }
        }
      }
    });

    successResponse(res, updatedSale, 'Sale updated successfully');
  } catch (error) {
    errorResponse(res, error.message);
  }
};

const deleteSale = async (req, res) => {
  try {
    const { id } = req.params;
    const businessId = req.user.business.id;

    const sale = await prisma.sale.findFirst({
      where: { id, businessId },
      include: { saleItems: true }
    });

    if (!sale) {
      return errorResponse(res, 'Sale not found', 404);
    }

    // Restore product stock and delete sale
    await prisma.$transaction(async (tx) => {
      // Restore product stock
      for (const item of sale.saleItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            currentStock: {
              increment: item.quantity
            }
          }
        });
      }

      // Delete sale items and sale
      await tx.saleItem.deleteMany({
        where: { saleId: id }
      });

      await tx.sale.delete({
        where: { id }
      });
    });

    successResponse(res, null, 'Sale deleted successfully');
  } catch (error) {
    errorResponse(res, error.message);
  }
};

// Get sales statistics
const getSalesStats = async (req, res) => {
  try {
    const businessId = req.user.business.id;
    const { period = 'month' } = req.query; // day, week, month, year

    const now = new Date();
    let startDate;

    switch (period) {
      case 'day':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const stats = await prisma.sale.aggregate({
      where: {
        businessId,
        saleDate: { gte: startDate }
      },
      _count: { id: true },
      _sum: { 
        totalAmount: true,
        taxAmount: true,
        discount: true
      }
    });

    successResponse(res, {
      period,
      startDate,
      totalSales: stats._count.id,
      totalRevenue: stats._sum.totalAmount || 0,
      totalTax: stats._sum.taxAmount || 0,
      totalDiscount: stats._sum.discount || 0
    });
  } catch (error) {
    errorResponse(res, error.message);
  }
};

module.exports = {
  getAllSales,
  getSale,
  createSale,
  updateSale,
  deleteSale,
  getSalesStats
};
