const { PrismaClient } = require('@prisma/client');
const { successResponse, errorResponse } = require('../utils/response');
const prisma = new PrismaClient();

const createPurchase = async (req, res) => {
  try {
    const businessId = req.user.business.id;
    const { 
      supplierId, 
      purchaseItems, 
      totalAmount, 
      purchaseDate, 
      notes 
    } = req.body;

    // Validate required fields
    if (!supplierId || !purchaseItems || !Array.isArray(purchaseItems) || purchaseItems.length === 0) {
      return errorResponse(res, 'Supplier and purchase items are required', 400);
    }

    // Create purchase with transaction
    const purchase = await prisma.$transaction(async (tx) => {
      // Validate supplier
      const supplier = await tx.supplier.findFirst({
        where: { 
          id: supplierId,
          businessId
        }
      });

      if (!supplier) {
        throw new Error('Supplier not found');
      }

      // Validate products and calculate totals
      let calculatedTotal = 0;
      for (const item of purchaseItems) {
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

        if (item.quantity <= 0) {
          throw new Error(`Invalid quantity for product: ${product.name}`);
        }

        if (item.costPrice <= 0) {
          throw new Error(`Invalid cost price for product: ${product.name}`);
        }

        calculatedTotal += item.quantity * item.costPrice;
      }

      // Create purchase
      const purchase = await tx.purchase.create({
        data: {
          supplierId,
          businessId,
          totalAmount: calculatedTotal,
          purchaseDate: new Date(purchaseDate),
          notes,
          purchaseItems: {
            create: purchaseItems.map(item => ({
              productId: item.productId,
              quantity: item.quantity,
              costPrice: item.costPrice,
              totalCost: item.quantity * item.costPrice
            }))
          }
        },
        include: {
          supplier: true,
          purchaseItems: {
            include: {
              product: true
            }
          }
        }
      });

      // Update product stock and cost price
      for (const item of purchaseItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            currentStock: {
              increment: item.quantity
            },
            costPrice: item.costPrice // Update to latest cost price
          }
        });
      }

      return purchase;
    });

    successResponse(res, purchase, 'Purchase created successfully', 201);
  } catch (error) {
    console.error('Error creating purchase:', error);
    errorResponse(res, error.message);
  }
};

const getAllPurchases = async (req, res) => {
  try {
    const businessId = req.user.business.id;
    const { page = 1, limit = 20, startDate, endDate, supplierId } = req.query;

    const where = { businessId };

    if (startDate || endDate) {
      where.purchaseDate = {};
      if (startDate) where.purchaseDate.gte = new Date(startDate);
      if (endDate) where.purchaseDate.lte = new Date(endDate);
    }

    if (supplierId) {
      where.supplierId = supplierId;
    }

    const purchases = await prisma.purchase.findMany({
      where,
      include: {
        supplier: true,
        purchaseItems: {
          include: {
            product: true
          }
        }
      },
      orderBy: { purchaseDate: 'desc' },
      skip: (page - 1) * limit,
      take: parseInt(limit)
    });

    const total = await prisma.purchase.count({ where });
    const totalAmount = await prisma.purchase.aggregate({
      where,
      _sum: { totalAmount: true }
    });

    successResponse(res, {
      purchases,
      summary: {
        totalPurchases: total,
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

module.exports = {
  createPurchase,
  getAllPurchases
};
