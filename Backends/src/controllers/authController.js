const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { successResponse, errorResponse } = require('../utils/response');
const prisma = new PrismaClient();

const register = async (req, res) => {
  try {
    const { email, password, name, businessName, phone, address } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return errorResponse(res, 'User already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role: 'OWNER',
        business: {
          create: {
            name: businessName,
            contactNumber: phone,
            address,
            settings: {
              create: {
                lowStockAlert: true,
                gstReminder: true,
                gstRate: 18,
                invoicePrefix: 'INV',
                nextInvoiceNumber: 1
              }
            }
          }
        }
      },
      include: { business: true }
    });

    const token = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    successResponse(res, { user: { id: user.id, email: user.email, name: user.name }, token }, 'User registered successfully', 201);
  } catch (error) {
    errorResponse(res, error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { business: true }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return errorResponse(res, 'Invalid credentials', 401);
    }

    const token = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    successResponse(res, { 
      user: { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role,
        business: user.business 
      }, 
      token 
    }, 'Login successful');
  } catch (error) {
    errorResponse(res, error.message);
  }
};

module.exports = { register, login };
