// localStorage data layer — replaces API calls with local persistence
const get = <T>(key: string, fallback: T): T => {
    try { return JSON.parse(localStorage.getItem(key) || '') } catch { return fallback }
}
const set = <T>(key: string, data: T) => localStorage.setItem(key, JSON.stringify(data))
const uid = () => Math.random().toString(36).slice(2, 11)
const now = () => new Date().toISOString()

// ── Types ──
export type Role = 'ADMIN' | 'STAFF' | 'USER'
export type PaymentMethod = 'CASH' | 'CARD' | 'UPI' | 'BANK_TRANSFER'
export type PaymentStatus = 'PENDING' | 'PAID' | 'PARTIALLY_PAID'

export interface User { id: string; email: string; name: string; role: Role; phone?: string; business?: Business }
export interface Business {
    id: string;
    name: string;
    address?: string;
    contactNumber?: string;
    email?: string;
    gstin?: string;
    logo?: string;
}

export const updateBusinessDetails = (details: Partial<Business>) => {
    const business = { ...getBusinessDetails(), ...details }
    localStorage.setItem('business', JSON.stringify(business))
    return business
}
export interface Category { id: string; name: string; description?: string; _count?: { products: number } }
export interface Product {
    id: string; name: string; description?: string; sku: string; categoryId: string
    category?: Category; costPrice: number; sellingPrice: number; currentStock: number
    lowStockAlert: number; unit: string; isActive: boolean; createdAt: string
}
export interface Customer { id: string; name: string; email?: string; phone?: string; address?: string; gstin?: string }
export interface Supplier { id: string; name: string; contactPerson?: string; email?: string; phone?: string; address?: string; gstin?: string }
export interface SaleItem { productId: string; quantity: number; unitPrice: number; totalPrice: number; product?: Product }
export interface Sale {
    id: string; invoiceNumber: string; customerId?: string; customerName?: string; customerPhone?: string
    saleItems: (SaleItem & { id: string; product: Product })[]; subtotal: number; taxAmount: number
    discount: number; totalAmount: number; paymentMethod: PaymentMethod; paymentStatus: PaymentStatus
    saleDate: string; notes?: string; createdAt: string
}
export interface PurchaseItem { productId: string; quantity: number; costPrice: number; totalCost: number; product?: Product }
export interface Purchase {
    id: string; supplierId: string; supplier: Supplier; purchaseItems: (PurchaseItem & { id: string; product: Product })[]
    totalAmount: number; purchaseDate: string; notes?: string; createdAt: string
}
export interface BusinessSettings {
    id: string; lowStockAlert: boolean; gstReminder: boolean; gstRate: number
    invoicePrefix: string; nextInvoiceNumber: number
}

// ── Seed Data ──
const SEED_CATEGORIES: Category[] = [
    { id: 'cat-1', name: 'Fertilizers', description: 'Chemical & organic fertilizers' },
    { id: 'cat-2', name: 'Seeds', description: 'Crop & vegetable seeds' },
    { id: 'cat-3', name: 'Pesticides', description: 'Insecticides & herbicides' },
    { id: 'cat-4', name: 'Tools', description: 'Agricultural tools & equipment' },
]

const SEED_PRODUCTS: Product[] = [
    { id: 'p-1', name: 'Urea Fertilizer (50kg)', sku: 'FER-001', categoryId: 'cat-1', costPrice: 280, sellingPrice: 350, currentStock: 150, lowStockAlert: 20, unit: 'bag', isActive: true, description: 'High nitrogen content urea', createdAt: now() },
    { id: 'p-2', name: 'DAP Fertilizer (50kg)', sku: 'FER-002', categoryId: 'cat-1', costPrice: 1200, sellingPrice: 1450, currentStock: 80, lowStockAlert: 15, unit: 'bag', isActive: true, description: 'Di-ammonium phosphate', createdAt: now() },
    { id: 'p-3', name: 'Potash MOP (50kg)', sku: 'FER-003', categoryId: 'cat-1', costPrice: 900, sellingPrice: 1100, currentStock: 5, lowStockAlert: 10, unit: 'bag', isActive: true, description: 'Muriate of potash', createdAt: now() },
    { id: 'p-4', name: 'Cotton Seeds (1kg)', sku: 'SED-001', categoryId: 'cat-2', costPrice: 750, sellingPrice: 950, currentStock: 200, lowStockAlert: 30, unit: 'packet', isActive: true, description: 'BT cotton hybrid seeds', createdAt: now() },
    { id: 'p-5', name: 'Soybean Seeds (5kg)', sku: 'SED-002', categoryId: 'cat-2', costPrice: 400, sellingPrice: 550, currentStock: 120, lowStockAlert: 20, unit: 'packet', isActive: true, description: 'High-yield soybean', createdAt: now() },
    { id: 'p-6', name: 'Calaris Herbicide (1L)', sku: 'PES-001', categoryId: 'cat-3', costPrice: 650, sellingPrice: 820, currentStock: 0, lowStockAlert: 10, unit: 'bottle', isActive: true, description: 'Broad-spectrum herbicide', createdAt: now() },
    { id: 'p-7', name: 'Spray Pump (16L)', sku: 'TOL-001', categoryId: 'cat-4', costPrice: 1800, sellingPrice: 2500, currentStock: 25, lowStockAlert: 5, unit: 'piece', isActive: true, description: 'Manual knapsack sprayer', createdAt: now() },
    { id: 'p-8', name: 'NPK 10-26-26 (50kg)', sku: 'FER-004', categoryId: 'cat-1', costPrice: 1350, sellingPrice: 1600, currentStock: 45, lowStockAlert: 10, unit: 'bag', isActive: true, description: 'Complex NPK fertilizer', createdAt: now() },
]

const SEED_CUSTOMERS: Customer[] = [
    { id: 'c-1', name: 'Ramesh Patil', phone: '9876543210', email: 'ramesh@gmail.com', address: 'Penur, Parbhani' },
    { id: 'c-2', name: 'Suresh Jadhav', phone: '9123456789', address: 'Purna, Parbhani' },
    { id: 'c-3', name: 'Ganesh Wankhede', phone: '9988776655', email: 'ganesh@gmail.com', address: 'Parbhani' },
]

const SEED_SUPPLIERS: Supplier[] = [
    { id: 's-1', name: 'IFFCO', contactPerson: 'Vikram Singh', phone: '9112233445', email: 'supply@iffco.in' },
    { id: 's-2', name: 'Rashtriya Chemicals', contactPerson: 'Amit Desai', phone: '9223344556', email: 'sales@rcf.in' },
]

const SEED_SETTINGS: BusinessSettings = {
    id: 'bs-1', lowStockAlert: true, gstReminder: true, gstRate: 18, invoicePrefix: 'INV', nextInvoiceNumber: 1001,
}

const SEED_BUSINESS: Business = {
    id: 'b-1',
    name: 'Wankhede Krushi Seva Kendra',
    address: 'Gandhi Chowk, Nanded, Maharashtra - 431601',
    contactNumber: '9823332198',
    email: 'info@krushisevakendra.com',
    gstin: '27AABCW1234F1Z5',
    logo: 'https://cdn-icons-png.flaticon.com/512/1127/1127815.png' // Agri logo placeholder
}

const SEED_USER: User = {
    id: 'u-1', email: 'admin@krushi.com', name: 'Admin', role: 'ADMIN',
    phone: '9823332198',
    business: SEED_BUSINESS,
}

// ── Init seed if empty ──
export function initStore() {
    if (!localStorage.getItem('krushi_products')) {
        set('krushi_categories', SEED_CATEGORIES)
        set('krushi_products', SEED_PRODUCTS)
        set('krushi_customers', SEED_CUSTOMERS)
        set('krushi_suppliers', SEED_SUPPLIERS)
        set('krushi_sales', [])
        set('krushi_purchases', [])
        set('krushi_settings', SEED_SETTINGS)
    }
}

// ── Categories ──
export const getCategories = (): Category[] => {
    const cats = get<Category[]>('krushi_categories', [])
    const prods = get<Product[]>('krushi_products', [])
    return cats.map(c => ({ ...c, _count: { products: prods.filter(p => p.categoryId === c.id).length } }))
}
export const addCategory = (data: Omit<Category, 'id'>) => {
    const cats = get<Category[]>('krushi_categories', [])
    const cat = { ...data, id: uid() }
    set('krushi_categories', [...cats, cat])
    return cat
}
export const updateCategory = (id: string, data: Partial<Category>) => {
    const cats = get<Category[]>('krushi_categories', []).map(c => c.id === id ? { ...c, ...data } : c)
    set('krushi_categories', cats)
    return cats.find(c => c.id === id)!
}
export const deleteCategory = (id: string) => {
    set('krushi_categories', get<Category[]>('krushi_categories', []).filter(c => c.id !== id))
}

// ── Products ──
const enrichProduct = (p: Product): Product => {
    const cats = get<Category[]>('krushi_categories', [])
    return { ...p, category: cats.find(c => c.id === p.categoryId) }
}
export const getProducts = (): Product[] => get<Product[]>('krushi_products', []).map(enrichProduct)
export const getProduct = (id: string) => enrichProduct(get<Product[]>('krushi_products', []).find(p => p.id === id)!)
export const addProduct = (data: Omit<Product, 'id' | 'createdAt' | 'category'>) => {
    const prods = get<Product[]>('krushi_products', [])
    const p: Product = { ...data, id: uid(), createdAt: now() }
    set('krushi_products', [...prods, p])
    return enrichProduct(p)
}
export const updateProduct = (id: string, data: Partial<Product>) => {
    const prods = get<Product[]>('krushi_products', []).map(p => p.id === id ? { ...p, ...data } : p)
    set('krushi_products', prods)
    return enrichProduct(prods.find(p => p.id === id)!)
}
export const deleteProduct = (id: string) => {
    set('krushi_products', get<Product[]>('krushi_products', []).filter(p => p.id !== id))
}

// ── Customers ──
export const getCustomers = (): Customer[] => get('krushi_customers', [])
export const addCustomer = (data: Omit<Customer, 'id'>) => {
    const all = get<Customer[]>('krushi_customers', [])
    const c = { ...data, id: uid() }
    set('krushi_customers', [...all, c])
    return c
}
export const updateCustomer = (id: string, data: Partial<Customer>) => {
    const all = get<Customer[]>('krushi_customers', []).map(c => c.id === id ? { ...c, ...data } : c)
    set('krushi_customers', all)
    return all.find(c => c.id === id)!
}
export const deleteCustomer = (id: string) => {
    set('krushi_customers', get<Customer[]>('krushi_customers', []).filter(c => c.id !== id))
}

// ── Suppliers ──
export const getSuppliers = (): Supplier[] => get('krushi_suppliers', [])
export const addSupplier = (data: Omit<Supplier, 'id'>) => {
    const all = get<Supplier[]>('krushi_suppliers', [])
    const s = { ...data, id: uid() }
    set('krushi_suppliers', [...all, s])
    return s
}
export const updateSupplier = (id: string, data: Partial<Supplier>) => {
    const all = get<Supplier[]>('krushi_suppliers', []).map(s => s.id === id ? { ...s, ...data } : s)
    set('krushi_suppliers', all)
}
export const deleteSupplier = (id: string) => {
    set('krushi_suppliers', get<Supplier[]>('krushi_suppliers', []).filter(s => s.id !== id))
}

// ── Sales ──
export const getSales = (): Sale[] => get('krushi_sales', [])
export const createSale = (data: {
    customerId?: string; customerName?: string; customerPhone?: string
    saleItems: SaleItem[]; subtotal: number; taxAmount: number; discount?: number
    totalAmount: number; paymentMethod: PaymentMethod; paymentStatus: PaymentStatus; notes?: string
}) => {
    const sales = get<Sale[]>('krushi_sales', [])
    const settings = getSettings()
    const invoiceNumber = `${settings.invoicePrefix}${settings.nextInvoiceNumber.toString().padStart(6, '0')}`
    const products = get<Product[]>('krushi_products', [])

    const enrichedItems = data.saleItems.map(item => ({
        ...item, id: uid(),
        product: enrichProduct(products.find(p => p.id === item.productId)!),
    }))

    // Decrement stock
    const updatedProducts = products.map(p => {
        const item = data.saleItems.find(si => si.productId === p.id)
        return item ? { ...p, currentStock: Math.max(0, p.currentStock - item.quantity) } : p
    })
    set('krushi_products', updatedProducts)

    const sale: Sale = {
        id: uid(), invoiceNumber, ...data, discount: data.discount || 0,
        saleItems: enrichedItems, saleDate: now(), createdAt: now(),
    }
    set('krushi_sales', [sale, ...sales])
    updateSettings({ nextInvoiceNumber: settings.nextInvoiceNumber + 1 })
    return sale
}
export const deleteSale = (id: string) => {
    set('krushi_sales', get<Sale[]>('krushi_sales', []).filter(s => s.id !== id))
}

// ── Purchases ──
export const getPurchases = (): Purchase[] => get('krushi_purchases', [])
export const createPurchase = (data: {
    supplierId: string; purchaseItems: PurchaseItem[]
    totalAmount: number; purchaseDate: string; notes?: string
}) => {
    const purchases = get<Purchase[]>('krushi_purchases', [])
    const suppliers = get<Supplier[]>('krushi_suppliers', [])
    const products = get<Product[]>('krushi_products', [])

    const enrichedItems = data.purchaseItems.map(item => ({
        ...item, id: uid(),
        product: enrichProduct(products.find(p => p.id === item.productId)!),
    }))

    // Increment stock
    const updatedProducts = products.map(p => {
        const item = data.purchaseItems.find(pi => pi.productId === p.id)
        return item ? { ...p, currentStock: p.currentStock + item.quantity } : p
    })
    set('krushi_products', updatedProducts)

    const purchase: Purchase = {
        id: uid(), ...data,
        supplier: suppliers.find(s => s.id === data.supplierId)!,
        purchaseItems: enrichedItems, createdAt: now(),
    }
    set('krushi_purchases', [purchase, ...purchases])
    return purchase
}

// ── Settings ──
export const getSettings = (): BusinessSettings => get('krushi_settings', SEED_SETTINGS)
export const updateSettings = (data: Partial<BusinessSettings>) => {
    const s = { ...getSettings(), ...data }
    set('krushi_settings', s)
    return s
}

export const getBusinessDetails = (): Business => {
    // In a real app, this would come from a dedicated settings key or the logged-in user's business
    // For now, we'll pull it from SEED_USER or a dedicated key if we add one.
    return SEED_BUSINESS
}

// ── Dashboard Stats ──
export const getDashboardStats = () => {
    const products = getProducts()
    const sales = getSales()
    const customers = getCustomers()
    const today = new Date().toISOString().split('T')[0]

    const todaysSales = sales
        .filter(s => s.saleDate.startsWith(today))
        .reduce((sum, s) => sum + s.totalAmount, 0)

    const thisMonth = new Date().toISOString().slice(0, 7)
    const monthlySales = sales.filter(s => s.saleDate.startsWith(thisMonth))
    const monthlyRevenue = monthlySales.reduce((sum, s) => sum + s.totalAmount, 0)
    const monthlyCost = monthlySales.reduce((sum, s) =>
        sum + s.saleItems.reduce((t, i) => t + (i.product?.costPrice || 0) * i.quantity, 0), 0)

    return {
        totalProducts: products.length,
        todaysSales,
        lowStockItems: products.filter(p => p.currentStock <= p.lowStockAlert).length,
        monthlyProfit: monthlyRevenue - monthlyCost,
        totalCustomers: customers.length,
        totalSales: sales.length,
    }
}

export const getSalesTrend = (days = 7) => {
    const sales = getSales()
    return Array.from({ length: days }, (_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (days - 1 - i))
        const dateStr = d.toISOString().split('T')[0]
        const daySales = sales.filter(s => s.saleDate.startsWith(dateStr))
        return {
            date: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
            fullDate: dateStr,
            sales: daySales.reduce((sum, s) => sum + s.totalAmount, 0),
            transactions: daySales.length,
        }
    })
}

export const getLowStockProducts = () =>
    getProducts().filter(p => p.isActive && p.currentStock <= p.lowStockAlert)

export const getRecentSales = (limit = 10) =>
    getSales().slice(0, limit).map(s => ({
        id: s.id, invoiceNumber: s.invoiceNumber,
        customerName: s.customerName || 'Walk-in Customer',
        totalAmount: s.totalAmount, saleDate: s.saleDate,
        paymentStatus: s.paymentStatus, items: s.saleItems.length,
    }))

// ── Auth helpers ──
const DEMO_USERS = [
    { email: 'admin@krushi.com', password: 'password123', ...SEED_USER },
    { email: 'staff@krushi.com', password: 'staff123', id: 'u-2', name: 'Staff User', role: 'STAFF' as Role, phone: '9876543210' },
]

export const authenticateUser = (email: string, password: string): User | null => {
    const user = DEMO_USERS.find(u => u.email === email && u.password === password)
    return user ? { id: user.id, email: user.email, name: user.name, role: user.role, phone: user.phone, business: user.business } : null
}
