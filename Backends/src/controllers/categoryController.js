const { PrismaClient } = require('@prisma/client');
const { successResponse, errorResponse } = require('../utils/response');
const prisma = new PrismaClient();

const getAllCategories = async (req, res) => {
  try {
    const businessId = req.user.business.id;

    const categories = await prisma.category.findMany({
      where: { businessId },
      include: {
        _count: {
          select: { products: true }
        }
      },
      orderBy: { name: 'asc' }
    });

    successResponse(res, { categories });
  } catch (error) {
    errorResponse(res, error.message);
  }
};

const getCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const businessId = req.user.business.id;

    const category = await prisma.category.findFirst({
      where: { id, businessId },
      include: {
        products: {
          where: { isActive: true },
          include: {
            saleItems: {
              include: { sale: true }
            }
          }
        }
      }
    });

    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }

    successResponse(res, category);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

const createCategory = async (req, res) => {
  try {
    const businessId = req.user.business.id;
    const { name, description } = req.body;

    if (!name) {
      return errorResponse(res, 'Category name is required', 400);
    }

    // Check if category already exists
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: name,
          mode: 'insensitive'
        },
        businessId
      }
    });

    if (existingCategory) {
      return errorResponse(res, 'Category with this name already exists', 400);
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        businessId
      }
    });

    successResponse(res, category, 'Category created successfully', 201);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const businessId = req.user.business.id;
    const { name, description } = req.body;

    const category = await prisma.category.findFirst({
      where: { id, businessId }
    });

    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: { name, description }
    });

    successResponse(res, updatedCategory, 'Category updated successfully');
  } catch (error) {
    errorResponse(res, error.message);
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const businessId = req.user.business.id;

    const category = await prisma.category.findFirst({
      where: { id, businessId },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!category) {
      return errorResponse(res, 'Category not found', 404);
    }

    if (category._count.products > 0) {
      return errorResponse(res, 'Cannot delete category with existing products', 400);
    }

    await prisma.category.delete({
      where: { id }
    });

    successResponse(res, null, 'Category deleted successfully');
  } catch (error) {
    errorResponse(res, error.message);
  }
};

module.exports = {
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};
