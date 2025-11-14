const { PrismaClient } = require('@prisma/client');
const { successResponse, errorResponse } = require('../utils/response');
const prisma = new PrismaClient();

const getAllSuppliers = async (req, res) => {
  try {
    const businessId = req.user.business.id;
    const { page = 1, limit = 100, search } = req.query;

    const where = { businessId };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { contactPerson: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ];
    }

    const suppliers = await prisma.supplier.findMany({
      where,
      orderBy: { name: 'asc' },
      skip: (page - 1) * limit,
      take: parseInt(limit)
    });

    const total = await prisma.supplier.count({ where });

    successResponse(res, {
      suppliers,
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

const createSupplier = async (req, res) => {
  try {
    const businessId = req.user.business.id;
    const { name, contactPerson, email, phone, address, gstin } = req.body;

    if (!name) {
      return errorResponse(res, 'Supplier name is required', 400);
    }

    const supplier = await prisma.supplier.create({
      data: {
        name,
        contactPerson,
        email,
        phone,
        address,
        gstin,
        businessId
      }
    });

    successResponse(res, supplier, 'Supplier created successfully', 201);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

module.exports = {
  getAllSuppliers,
  createSupplier
};
