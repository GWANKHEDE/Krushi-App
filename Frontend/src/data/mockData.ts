import { Product, Bill, Purchase, DashboardStats, Transaction } from "@/types";
import urea from "@/assets/uera.avif";
import soya from "@/assets/soya.webp";
import DAP from "@/assets/DAP.png";
import cotton from "@/assets/cotton.webp";
import potash from "@/assets/potash.jfif";
import calarix from "@/assets/calaris.jpg";

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Urea (46% N)",
    category: "Fertilizer",
    brand: "IFFCO",
    stock: 10,
    unit: "kg",
    price: 270,
    description: "Popular nitrogen fertilizer suitable for all crops.",
    imageUrl: urea,
    usageInstructions: "Apply 100-150 kg per acre as top dressing.",
    isActive: true,
    createdAt: new Date("2024-04-10"),
    updatedAt: new Date("2024-04-15"),
  },
  {
    id: "2",
    name: "Cotton Seeds (JK Durga)",
    category: "Seeds",
    brand: "JK Agri Genetics",
    stock: 300,
    unit: "packet",
    price: 850,
    description: "BT cotton hybrid seeds with high boll retention.",
    imageUrl: cotton,
    usageInstructions: "Sowing rate: 1 packet per acre.",
    isActive: true,
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date("2024-04-06"),
  },
  {
    id: "3",
    name: "IPL Potash Fertilizer",
    category: "Fertilizer",
    brand: "IPL (India Potash Limited)",
    stock: 10,
    unit: "kg",
    price: 1200,
    description:
      "High-quality potash fertilizer that improves root strength and crop yield.",
    imageUrl: potash,
    usageInstructions: "Apply as per crop requirement. Mix well with soil.",
    isActive: true,
    createdAt: new Date("2024-03-20"),
    updatedAt: new Date("2024-03-28"),
  },
  {
    id: "4",
    name: "Calarix Pesticide",
    category: "Pesticide",
    brand: "Rallis India",
    stock: 5,
    unit: "liter",
    price: 1150,
    description:
      "Broad-spectrum pesticide effective against aphids, whiteflies, and other crop-damaging insects.",
    imageUrl: calarix,
    usageInstructions:
      "Dilute 3–5 ml per liter of water and spray on affected crops.",
    isActive: true,
    createdAt: new Date("2024-02-18"),
    updatedAt: new Date("2024-02-22"),
  },
  {
    id: "5",
    name: "Soybean Seeds (JS-9560)",
    category: "Seeds",
    brand: "Mahabeej",
    stock: 9,
    unit: "kg",
    price: 85,
    description: "High-yield soybean variety with good oil content.",
    imageUrl: soya,
    usageInstructions: "Sowing rate: 30-35 kg per acre.",
    isActive: true,
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-03-10"),
  },
  {
    id: "6",
    name: "DAP Fertilizer (Diammonium Phosphate)",
    category: "Fertilizer",
    brand: "IFFCO",
    stock: 50,
    unit: "kg",
    price: 1400,
    description:
      "Essential plant nutrient fertilizer with high phosphorus content.",
    imageUrl: DAP,
    usageInstructions:
      "Apply during sowing. Mix well in the soil. Do not overdose.",
    isActive: true,
    createdAt: new Date("2024-02-25"),
    updatedAt: new Date("2024-03-01"),
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: "T001",
    type: "sale",
    amount: 2537,
    method: "cash",
    customerName: "Deepak",
    date: new Date("2024-01-20"),
    referenceId: "B001", // linked to bill
  },
  {
    id: "T002",
    type: "purchase",
    amount: 75000,
    method: "bank",
    supplierName: "Fertilizer Depot",
    date: new Date("2024-01-15"),
    referenceId: "P001", // linked to purchase
  },
  {
    id: "T003",
    type: "sale",
    amount: 1450,
    method: "upi",
    customerName: "Suresh Pawar",
    date: new Date("2024-02-10"),
    referenceId: "B002",
  },
  {
    id: "T004",
    type: "purchase",
    amount: 12000,
    method: "cash",
    supplierName: "Agro Tools Ltd.",
    date: new Date("2024-02-05"),
    referenceId: "P002",
  },
];

export const mockBills: Bill[] = [
  {
    id: "B001",
    billNumber: "KSK/2024/001",
    customerId: "C001",
    customerName: "Deepak",
    customerPhone: "+91 9876543210",
    items: [
      {
        productId: "1",
        productName: "NPK Fertilizer 20-20-0",
        quantity: 2,
        unit: "kg",
        price: 850,
        total: 1700,
      },
      {
        productId: "2",
        productName: "Wheat Seeds (HD 2967)",
        quantity: 10,
        unit: "kg",
        price: 45,
        total: 450,
      },
    ],
    subtotal: 2150,
    tax: 387,
    discount: 0,
    total: 2537,
    createdAt: new Date("2024-01-20"),
    status: "paid",
  },
];

export const mockPurchases: Purchase[] = [
  {
    id: "P001",
    productId: "1",
    productName: "NPK Fertilizer 20-20-0",
    quantity: 100,
    costPrice: 750,
    supplier: "Fertilizer Depot",
    purchaseDate: new Date("2024-01-15"),
    total: 75000,
  },
];

export const mockDashboardStats: DashboardStats = {
  totalProducts: 6,
  totalSales: 25000,
  totalProfit: 5000,
  lowStockProducts: 1,
  todaySales: 2537,
  monthlyProfit: 15000,
};

export const categories = ["All", "Fertilizer", "Seeds", "Tools", "Pesticide"];
export const brands = [
  "All",
  "Krishak",
  "IARI",
  "Netafim",
  "Bayer",
  "Punjab Seeds",
  "Solo",
];
