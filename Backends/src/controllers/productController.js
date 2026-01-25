const { PrismaClient } = require('@prisma/client');
const { successResponse, errorResponse } = require('../utils/response');
const prisma = new PrismaClient();

const getAllProducts = async (req, res) => {
  try {
    const businessId = req.user.business.id;
    const { page = 1, limit = 10, search, category } = req.query;

    const where = {
      businessId,
      isActive: true
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (category) {
      where.categoryId = category;
    }

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      skip: (page - 1) * limit,
      take: parseInt(limit),
      orderBy: { name: 'asc' }
    });

    const total = await prisma.product.count({ where });

    successResponse(res, {
      products,
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

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const businessId = req.user.business.id;

    const product = await prisma.product.findFirst({
      where: { id, businessId },
      include: {
        category: true,
        saleItems: {
          include: { sale: true },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    successResponse(res, product);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

const createProduct = async (req, res) => {
  try {
    const businessId = req.user.business.id;
    const {
      name,
      description,
      sku,
      categoryId,
      costPrice,
      sellingPrice,
      currentStock,
      lowStockAlert,
      unit
    } = req.body;

    // Check if SKU already exists
    const existingProduct = await prisma.product.findFirst({
      where: { sku, businessId }
    });

    if (existingProduct) {
      return errorResponse(res, 'Product with this SKU already exists', 400);
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        sku,
        categoryId,
        costPrice: parseFloat(costPrice),
        sellingPrice: parseFloat(sellingPrice),
        currentStock: parseInt(currentStock),
        lowStockAlert: parseInt(lowStockAlert) || 10,
        unit: unit || 'kg',
        businessId
      },
      include: { category: true }
    });

    successResponse(res, product, 'Product created successfully', 201);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const businessId = req.user.business.id;
    const updateData = req.body;

    const product = await prisma.product.findFirst({
      where: { id, businessId }
    });

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
      include: { category: true }
    });

    successResponse(res, updatedProduct, 'Product updated successfully');
  } catch (error) {
    errorResponse(res, error.message);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const businessId = req.user.business.id;

    const product = await prisma.product.findFirst({
      where: { id, businessId }
    });

    if (!product) {
      return errorResponse(res, 'Product not found', 404);
    }

    // Soft delete
    await prisma.product.update({
      where: { id },
      data: { isActive: false }
    });

    successResponse(res, null, 'Product deleted successfully');
  } catch (error) {
    errorResponse(res, error.message);
  }
};

module.exports = {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
