const { PrismaClient, UserRole, PaymentMethod, PaymentStatus } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed data creation...');

  // Create a sample business and user
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.create({
    data: {
      email: 'admin@krushi.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'OWNER',
      business: {
        create: {
          name: 'Krushi Farm Business',
          address: '123 Farm Road, Agricultural Zone, Farm City - 560001',
          contactNumber: '+91-9876543210',
          email: 'contact@krushifarm.com',
          gstin: '29ABCDE1234F1Z5',
          settings: {
            create: {
              lowStockAlert: true,
              gstReminder: true,
              gstRate: 18,
              invoicePrefix: 'INV',
              nextInvoiceNumber: 1001
            }
          }
        }
      }
    },
    include: {
      business: true
    }
  });

  console.log('Created user and business');

  const businessId = user.business.id;

  // Create categories
  const categories = await prisma.category.createMany({
    data: [
      {
        name: 'Grains & Cereals',
        description: 'Various types of grains and cereals',
        businessId: businessId
      },
      {
        name: 'Vegetables',
        description: 'Fresh vegetables',
        businessId: businessId
      },
      {
        name: 'Fruits',
        description: 'Seasonal and exotic fruits',
        businessId: businessId
      },
      {
        name: 'Dairy Products',
        description: 'Milk, cheese, and other dairy items',
        businessId: businessId
      },
      {
        name: 'Fertilizers & Seeds',
        description: 'Agricultural inputs',
        businessId: businessId
      }
    ]
  });

  console.log('Created categories');

  // Get created categories
  const categoryList = await prisma.category.findMany({
    where: { businessId: businessId }
  });

  const grainsCategory = categoryList.find(c => c.name === 'Grains & Cereals');
  const vegetablesCategory = categoryList.find(c => c.name === 'Vegetables');
  const fruitsCategory = categoryList.find(c => c.name === 'Fruits');
  const dairyCategory = categoryList.find(c => c.name === 'Dairy Products');
  const agriInputsCategory = categoryList.find(c => c.name === 'Fertilizers & Seeds');

  // Create products
  const products = await prisma.product.createMany({
    data: [
      {
        name: 'Basmati Rice',
        description: 'Premium quality basmati rice',
        sku: 'KRU-RICE-001',
        categoryId: grainsCategory.id,
        costPrice: 60,
        sellingPrice: 80,
        currentStock: 500,
        lowStockAlert: 50,
        unit: 'kg',
        isActive: true,
        businessId: businessId
      },
      {
        name: 'Wheat Flour',
        description: 'Organic wheat flour',
        sku: 'KRU-FLOUR-002',
        categoryId: grainsCategory.id,
        costPrice: 35,
        sellingPrice: 45,
        currentStock: 300,
        lowStockAlert: 30,
        unit: 'kg',
        isActive: true,
        businessId: businessId
      },
      {
        name: 'Tomatoes',
        description: 'Fresh farm tomatoes',
        sku: 'KRU-TOM-003',
        categoryId: vegetablesCategory.id,
        costPrice: 20,
        sellingPrice: 30,
        currentStock: 100,
        lowStockAlert: 20,
        unit: 'kg',
        isActive: true,
        businessId: businessId
      },
      {
        name: 'Potatoes',
        description: 'Fresh potatoes',
        sku: 'KRU-POT-004',
        categoryId: vegetablesCategory.id,
        costPrice: 15,
        sellingPrice: 25,
        currentStock: 200,
        lowStockAlert: 25,
        unit: 'kg',
        isActive: true,
        businessId: businessId
      },
      {
        name: 'Apples',
        description: 'Kashmiri apples',
        sku: 'KRU-APP-005',
        categoryId: fruitsCategory.id,
        costPrice: 80,
        sellingPrice: 120,
        currentStock: 150,
        lowStockAlert: 20,
        unit: 'kg',
        isActive: true,
        businessId: businessId
      },
      {
        name: 'Milk',
        description: 'Fresh cow milk',
        sku: 'KRU-MILK-006',
        categoryId: dairyCategory.id,
        costPrice: 40,
        sellingPrice: 50,
        currentStock: 200,
        lowStockAlert: 30,
        unit: 'litre',
        isActive: true,
        businessId: businessId
      },
      {
        name: 'Organic Fertilizer',
        description: 'Natural organic fertilizer',
        sku: 'KRU-FERT-007',
        categoryId: agriInputsCategory.id,
        costPrice: 200,
        sellingPrice: 300,
        currentStock: 50,
        lowStockAlert: 10,
        unit: 'kg',
        isActive: true,
        businessId: businessId
      }
    ]
  });

  console.log('Created products');

  // Create suppliers
  const suppliers = await prisma.supplier.createMany({
    data: [
      {
        name: 'Green Fields Agro',
        contactPerson: 'Ramesh Patel',
        email: 'ramesh@greenfieldsagro.com',
        phone: '+91-9876512345',
        address: '456 Supplier Street, Agricultural Market',
        gstin: '29AGRO1234A1Z2',
        businessId: businessId
      },
      {
        name: 'Fresh Farm Distributors',
        contactPerson: 'Suresh Kumar',
        email: 'suresh@freshfarm.com',
        phone: '+91-9876523456',
        address: '789 Distribution Road, Farm Zone',
        gstin: '29FARM5678B2Y3',
        businessId: businessId
      },
      {
        name: 'Agri Inputs Ltd.',
        contactPerson: 'Anita Sharma',
        email: 'anita@agriinputs.com',
        phone: '+91-9876534567',
        address: '321 Agri Park, Input Market',
        gstin: '29AGRI9012C3X4',
        businessId: businessId
      }
    ]
  });

  console.log('Created suppliers');

  // Create customers
  const customers = await prisma.customer.createMany({
    data: [
      {
        name: 'Local Grocery Store',
        email: 'grocery@localstore.com',
        phone: '+91-9876543211',
        address: '101 Market Street, City Center',
        gstin: '29GROC1234D1W2',
        businessId: businessId
      },
      {
        name: 'Restaurant Food Court',
        email: 'orders@foodcourt.com',
        phone: '+91-9876543212',
        address: '202 Restaurant Road, Downtown',
        gstin: '29REST5678E2V3',
        businessId: businessId
      },
      {
        name: 'Individual Customer',
        email: 'customer@email.com',
        phone: '+91-9876543213',
        address: '303 Residential Area, Suburbs',
        gstin: null,
        businessId: businessId
      },
      {
        name: 'Walk-in Customer',
        email: null,
        phone: null,
        address: null,
        gstin: null,
        businessId: businessId
      }
    ]
  });

  console.log('Created customers');

  // Get created records for relationships
  const [supplierList, customerList, productList] = await Promise.all([
    prisma.supplier.findMany({ where: { businessId: businessId } }),
    prisma.customer.findMany({ where: { businessId: businessId } }),
    prisma.product.findMany({ where: { businessId: businessId } })
  ]);

  // Create sample purchases
  const purchase1 = await prisma.purchase.create({
    data: {
      supplierId: supplierList[0].id,
      businessId: businessId,
      totalAmount: 15000,
      purchaseDate: new Date('2024-01-15'),
      notes: 'Monthly grains stock',
      purchaseItems: {
        create: [
          {
            productId: productList[0].id, // Rice
            quantity: 200,
            costPrice: 60,
            totalCost: 12000
          },
          {
            productId: productList[1].id, // Wheat Flour
            quantity: 100,
            costPrice: 35,
            totalCost: 3500
          }
        ]
      }
    }
  });

  const purchase2 = await prisma.purchase.create({
    data: {
      supplierId: supplierList[1].id,
      businessId: businessId,
      totalAmount: 8000,
      purchaseDate: new Date('2024-01-18'),
      notes: 'Vegetables and fruits stock',
      purchaseItems: {
        create: [
          {
            productId: productList[2].id, // Tomatoes
            quantity: 200,
            costPrice: 20,
            totalCost: 4000
          },
          {
            productId: productList[4].id, // Apples
            quantity: 50,
            costPrice: 80,
            totalCost: 4000
          }
        ]
      }
    }
  });

  console.log('Created purchases');

  // Create sample sales
  const sale1 = await prisma.sale.create({
    data: {
      invoiceNumber: 'INV1001',
      customerId: customerList[0].id,
      businessId: businessId,
      subtotal: 2500,
      taxAmount: 450,
      discount: 100,
      totalAmount: 2850,
      paymentMethod: PaymentMethod.UPI,
      paymentStatus: PaymentStatus.PAID,
      saleDate: new Date('2024-01-20'),
      notes: 'Regular customer order',
      saleItems: {
        create: [
          {
            productId: productList[0].id, // Rice
            quantity: 20,
            unitPrice: 80,
            totalPrice: 1600
          },
          {
            productId: productList[1].id, // Wheat Flour
            quantity: 20,
            unitPrice: 45,
            totalPrice: 900
          }
        ]
      }
    }
  });

  const sale2 = await prisma.sale.create({
    data: {
      invoiceNumber: 'INV1002',
      customerId: customerList[3].id, // Walk-in customer
      businessId: businessId,
      subtotal: 600,
      taxAmount: 108,
      discount: 0,
      totalAmount: 708,
      paymentMethod: PaymentMethod.CASH,
      paymentStatus: PaymentStatus.PAID,
      saleDate: new Date('2024-01-21'),
      notes: 'Walk-in customer purchase',
      saleItems: {
        create: [
          {
            productId: productList[2].id, // Tomatoes
            quantity: 10,
            unitPrice: 30,
            totalPrice: 300
          },
          {
            productId: productList[3].id, // Potatoes
            quantity: 10,
            unitPrice: 25,
            totalPrice: 250
          },
          {
            productId: productList[5].id, // Milk
            quantity: 1,
            unitPrice: 50,
            totalPrice: 50
          }
        ]
      }
    }
  });

  console.log('Created sales');

  // Create audit logs
  const auditLogs = await prisma.auditLog.createMany({
    data: [
      {
        businessId: businessId,
        action: 'CREATE',
        entityType: 'User',
        entityId: user.id,
        description: 'Initial user created during seeding',
        userId: user.id
      },
      {
        businessId: businessId,
        action: 'CREATE',
        entityType: 'Business',
        entityId: businessId,
        description: 'Business created during seeding',
        userId: user.id
      },
      {
        businessId: businessId,
        action: 'CREATE',
        entityType: 'Product',
        entityId: productList[0].id,
        description: 'Products created during seeding',
        userId: user.id
      },
      {
        businessId: businessId,
        action: 'CREATE',
        entityType: 'Sale',
        entityId: sale1.id,
        description: 'Sample sale created during seeding',
        userId: user.id
      }
    ]
  });

  console.log('Created audit logs');

  console.log('Seed data created successfully!');
  console.log('User credentials:');
  console.log('Email: admin@krushi.com');
  console.log('Password: password123');
}

main()
  .catch(e => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

  