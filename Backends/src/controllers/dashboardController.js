const { PrismaClient } = require('@prisma/client');
const { successResponse, errorResponse } = require('../utils/response');
const prisma = new PrismaClient();

const getDashboardData = async (req, res) => {
  try {
    const businessId = req.user.business.id;
    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Total Products
    const totalProducts = await prisma.product.count({
      where: { businessId, isActive: true }
    });

    // Today's Sales
    const todaysSales = await prisma.sale.aggregate({
      where: { 
        businessId,
        saleDate: { gte: startOfToday }
      },
      _sum: { totalAmount: true }
    });

    // Low Stock Items
    const lowStockItems = await prisma.product.findMany({
      where: {
        businessId,
        isActive: true,
        currentStock: { lte: prisma.product.fields.lowStockAlert }
      },
      include: { category: true }
    });

    // Monthly Profit (simplified calculation)
    const monthlySales = await prisma.sale.findMany({
      where: {
        businessId,
        saleDate: { gte: startOfMonth }
      },
      include: {
        saleItems: {
          include: {
            product: true
          }
        }
      }
    });

    let monthlyProfit = 0;
    monthlySales.forEach(sale => {
      sale.saleItems.forEach(item => {
        const profit = (item.unitPrice - item.product.costPrice) * item.quantity;
        monthlyProfit += profit;
      });
    });

    // Recent Sales
    const recentSales = await prisma.sale.findMany({
      where: { businessId },
      include: { 
        customer: true,
        saleItems: {
          include: { product: true }
        }
      },
      orderBy: { saleDate: 'desc' },
      take: 10
    });

    // Sales Trend (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesTrend = await prisma.sale.groupBy({
      by: ['saleDate'],
      where: {
        businessId,
        saleDate: { gte: sevenDaysAgo }
      },
      _sum: { totalAmount: true },
      _count: { id: true }
    });

    // Product Categories
    const productCategories = await prisma.category.findMany({
      where: { businessId },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    const dashboardData = {
      totals: {
        totalProducts,
        todaysSales: todaysSales._sum.totalAmount || 0,
        lowStockItems: lowStockItems.length,
        monthlyProfit
      },
      recentSales,
      lowStockAlerts: lowStockItems,
      salesTrend,
      productCategories
    };

    successResponse(res, dashboardData);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

module.exports = { getDashboardData };
