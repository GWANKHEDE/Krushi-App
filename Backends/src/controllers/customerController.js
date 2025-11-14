const { PrismaClient } = require('@prisma/client');
const { successResponse, errorResponse } = require('../utils/response');
const prisma = new PrismaClient();

const getAllCustomers = async (req, res) => {
  try {
    const businessId = req.user.business.id;
    const { page = 1, limit = 100, search } = req.query;

    const where = { businessId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const customers = await prisma.customer.findMany({
      where,
      orderBy: { name: 'asc' },
      skip: (page - 1) * limit,
      take: parseInt(limit)
    });

    const total = await prisma.customer.count({ where });

    successResponse(res, {
      customers,
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

const getCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const businessId = req.user.business.id;

    const customer = await prisma.customer.findFirst({
      where: { id, businessId },
      include: {
        sales: {
          include: {
            saleItems: {
              include: { product: true }
            }
          },
          orderBy: { saleDate: 'desc' },
          take: 10
        }
      }
    });

    if (!customer) {
      return errorResponse(res, 'Customer not found', 404);
    }

    successResponse(res, customer);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

const createCustomer = async (req, res) => {
  try {
    const businessId = req.user.business.id;
    const { name, email, phone, address, gstin } = req.body;

    if (!name) {
      return errorResponse(res, 'Customer name is required', 400);
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
        address,
        gstin,
        businessId
      }
    });

    successResponse(res, customer, 'Customer created successfully', 201);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const businessId = req.user.business.id;
    const updateData = req.body;

    const customer = await prisma.customer.findFirst({
      where: { id, businessId }
    });

    if (!customer) {
      return errorResponse(res, 'Customer not found', 404);
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id },
      data: updateData
    });

    successResponse(res, updatedCustomer, 'Customer updated successfully');
  } catch (error) {
    errorResponse(res, error.message);
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    const businessId = req.user.business.id;

    const customer = await prisma.customer.findFirst({
      where: { id, businessId }
    });

    if (!customer) {
      return errorResponse(res, 'Customer not found', 404);
    }

    // Check if customer has sales
    const salesCount = await prisma.sale.count({
      where: { customerId: id }
    });

    if (salesCount > 0) {
      return errorResponse(res, 'Cannot delete customer with existing sales', 400);
    }

    await prisma.customer.delete({
      where: { id }
    });

    successResponse(res, null, 'Customer deleted successfully');
  } catch (error) {
    errorResponse(res, error.message);
  }
};

module.exports = {
  getAllCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
