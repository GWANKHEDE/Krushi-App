const { PrismaClient } = require('@prisma/client');
const { successResponse, errorResponse } = require('../utils/response');
const prisma = new PrismaClient();

const getSalesReport = async (req, res) => {
  try {
    const businessId = req.user.business.id;
    const { startDate, endDate, groupBy = 'day' } = req.query;

    const where = { businessId };

    if (startDate || endDate) {
      where.saleDate = {};
      if (startDate) where.saleDate.gte = new Date(startDate);
      if (endDate) where.saleDate.lte = new Date(endDate);
    }

    let groupByFormat;
    switch (groupBy) {
      case 'day':
        groupByFormat = '%Y-%m-%d';
        break;
      case 'month':
        groupByFormat = '%Y-%m';
        break;
      case 'year':
        groupByFormat = '%Y';
        break;
      default:
        groupByFormat = '%Y-%m-%d';
    }

    // For PostgreSQL, you would use date formatting functions
    const salesData = await prisma.sale.groupBy({
      by: ['saleDate'],
      where,
      _sum: {
        totalAmount: true,
        taxAmount: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        saleDate: 'asc',
      },
    });

    successResponse(res, { salesData });
  } catch (error) {
    errorResponse(res, error.message);
  }
};

const getGSTReport = async (req, res) => {
  try {
    const businessId = req.user.business.id;
    const { startDate, endDate } = req.query;

    const where = { businessId };

    if (startDate || endDate) {
      where.saleDate = {};
      if (startDate) where.saleDate.gte = new Date(startDate);
      if (endDate) where.saleDate.lte = new Date(endDate);
    }

    const sales = await prisma.sale.aggregate({
      where,
      _sum: {
        totalAmount: true,
        taxAmount: true,
      },
      _count: {
        id: true,
      },
    });

    const purchases = await prisma.purchase.aggregate({
      where: { businessId },
      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
    });

    const gstSummary = {
      totalSales: sales._sum.totalAmount || 0,
      totalGSTCollected: sales._sum.taxAmount || 0,
      totalPurchases: purchases._sum.totalAmount || 0,
      totalGSTPaid: (purchases._sum.totalAmount || 0) * 0.18, // Assuming 18% GST
      netGST: (sales._sum.taxAmount || 0) - ((purchases._sum.totalAmount || 0) * 0.18),
      totalTransactions: (sales._count.id || 0) + (purchases._count.id || 0),
    };

    successResponse(res, { gstSummary });
  } catch (error) {
    errorResponse(res, error.message);
  }
};

module.exports = {
  getSalesReport,
  getGSTReport,
};
