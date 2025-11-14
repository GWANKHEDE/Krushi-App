import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import {
  DollarSign,
  IndianRupee,
  Percent,
  Receipt,
  History,
  PieChart as PieChartIcon,
  BarChart3,
  TrendingUp,
  Package,
  Users,
  ShoppingCart,
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { dashboardAPI, salesAPI, purchasesAPI } from '@/services/api';

const COLORS = ['#4f46e5', '#16a34a', '#f97316', '#e11d48', '#8b5cf6', '#06b6d4'];

interface ReportData {
  totals: {
    totalProducts: number;
    todaysSales: number;
    lowStockItems: number;
    monthlyProfit: number;
    totalCustomers?: number;
    totalSales?: number;
  };
  recentSales: any[];
  lowStockAlerts: any[];
  salesTrend: any[];
  productCategories: any[];
}

interface Sale {
  id: string;
  invoiceNumber: string;
  customerName?: string;
  customer?: { name: string };
  totalAmount: number;
  saleDate: string;
  paymentStatus: string;
  saleItems: any[];
}

interface Purchase {
  id: string;
  supplier: { name: string };
  totalAmount: number;
  purchaseDate: string;
  purchaseItems: any[];
}

export default function Report() {
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load report data
  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = async () => {
    try {
      setLoading(true);
      const [dashboardResponse, salesResponse, purchasesResponse] = await Promise.all([
        dashboardAPI.getDashboardData(),
        salesAPI.getAllSales({ limit: 50 }),
        purchasesAPI.getAllPurchases({ limit: 50 })
      ]);

      setReportData(dashboardResponse.data.data);
      setSales(salesResponse.data.data.sales || []);
      setPurchases(purchasesResponse.data.data.purchases || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to load report data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Process sales data for charts
  const salesData = reportData?.salesTrend?.map(item => ({
    date: new Date(item.saleDate).toLocaleDateString('en-IN', { 
      month: 'short', 
      day: 'numeric' 
    }),
    sales: item._sum?.totalAmount || 0,
    transactions: item._count?.id || 0,
  })) || [];

  // Category distribution data
  const categoryData = reportData?.productCategories?.map(category => ({
    name: category.name,
    value: category._count?.products || 0,
  })) || [];

  // Recent transactions (combining sales and purchases)
  const recentTransactions = [
    ...sales.slice(0, 10).map(sale => ({
      id: sale.id,
      type: 'sale' as const,
      amount: sale.totalAmount,
      date: sale.saleDate,
      description: `Sale #${sale.invoiceNumber}`,
      customer: sale.customerName || sale.customer?.name || 'Walk-in Customer',
    })),
    ...purchases.slice(0, 10).map(purchase => ({
      id: purchase.id,
      type: 'purchase' as const,
      amount: purchase.totalAmount,
      date: purchase.purchaseDate,
      description: `Purchase from ${purchase.supplier.name}`,
      customer: purchase.supplier.name,
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
   .slice(0, 10);

  // GST Summary Calculation
  const gstSummary = {
    totalCollected: sales.reduce((sum, sale) => sum + (sale.totalAmount - sale.totalAmount / 1.18), 0),
    totalPaid: purchases.reduce((sum, purchase) => sum + (purchase.totalAmount - purchase.totalAmount / 1.18), 0),
    netGST: 0,
  };
  gstSummary.netGST = gstSummary.totalCollected - gstSummary.totalPaid;

  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p>Loading reports...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10 space-y-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Business Report Overview</h2>
        <div className="flex gap-2">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
            <option value="year">Last Year</option>
          </select>
          <button
            onClick={loadReportData}
            className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <div className="relative p-4">
            <IndianRupee className="absolute top-4 right-4 h-5 w-5 text-green-600" />    
            <CardHeader className="p-0">
              <CardTitle className="text-lg">Total Sales</CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <p className="text-2xl font-bold">
                ₹{reportData?.totals.todaysSales?.toLocaleString('en-IN') || '0'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {sales.length} transactions
              </p>
            </CardContent>
          </div>
        </Card>

        <Card>
          <div className="relative p-4">
            <TrendingUp className="absolute top-4 right-4 h-5 w-5 text-emerald-600" />
            <CardHeader className="p-0">
              <CardTitle className="text-lg">Monthly Profit</CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <p className="text-2xl font-bold">
                ₹{reportData?.totals.monthlyProfit?.toLocaleString('en-IN') || '0'}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Net revenue
              </p>
            </CardContent>
          </div>
        </Card>

        <Card>
          <div className="relative p-4">
            <Package className="absolute top-4 right-4 h-5 w-5 text-blue-600" />
            <CardHeader className="p-0">
              <CardTitle className="text-lg">Products</CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <p className="text-2xl font-bold">{reportData?.totals.totalProducts || 0}</p>
              <p className="text-sm text-red-600 text-muted-foreground mt-1">
                {reportData?.totals.lowStockItems || 0} low stock
              </p>
            </CardContent>
          </div>
        </Card>

        <Card>
          <div className="relative p-4">
            <Users className="absolute top-4 right-4 h-5 w-5 text-purple-600" />
            <CardHeader className="p-0">
              <CardTitle className="text-lg">Customers</CardTitle>
            </CardHeader>
            <CardContent className="pt-8">
              <p className="text-2xl font-bold">{reportData?.totals.totalCustomers || 0}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Active customers
              </p>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card>
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle>Sales Overview</CardTitle>
            <div className="flex gap-2">
              <button
                className={`p-2 rounded border ${
                  chartType === 'bar' ? 'bg-primary text-white' : 'text-primary border-primary'
                }`}
                onClick={() => setChartType('bar')}
              >
                <BarChart3 className="h-4 w-4" />
              </button>
              <button
                className={`p-2 rounded border ${
                  chartType === 'line' ? 'bg-primary text-white' : 'text-primary border-primary'
                }`}
                onClick={() => setChartType('line')}
              >
                <TrendingUp className="h-4 w-4" />
              </button>
              <button
                className={`p-2 rounded border ${
                  chartType === 'pie' ? 'bg-primary text-white' : 'text-primary border-primary'
                }`}
                onClick={() => setChartType('pie')}
              >
                <PieChartIcon className="h-4 w-4" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {chartType === 'bar' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Sales']}
                    />
                    <Legend />
                    <Bar 
                      dataKey="sales" 
                      fill="#4f46e5" 
                      radius={[5, 5, 0, 0]} 
                      name="Sales Amount"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : chartType === 'line' ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Sales']}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#4f46e5" 
                      strokeWidth={2}
                      name="Sales Trend"
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={60}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} products`, 'Count']} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card className="max-h-96 flex flex-col"> {/* 96 = ~384px */}
  <CardHeader>
    <CardTitle className="-mt-2 -mb-2">Recent Transactions</CardTitle>
  </CardHeader>

  <CardContent className="flex-1 overflow-y-auto space-y-3 pr-2 hide-scrollbar"> {/* scroll only here */}
    {recentTransactions.length > 0 ? (
      recentTransactions.map((txn) => (
        <div
          key={txn.id}
          className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors"
        >
          <div className="flex-1">
            <p className="font-semibold text-sm capitalize">{txn.type}</p>
            <p className="text-xs text-muted-foreground truncate">
              {txn.description}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(txn.date).toLocaleDateString('en-IN')}
            </p>
          </div>
          <Badge
            variant={txn.type === 'sale' ? 'default' : 'secondary'}
            className="ml-2 whitespace-nowrap"
          >
            {txn.type === 'sale' ? '+' : '-'}₹
            {txn.amount.toLocaleString('en-IN')}
          </Badge>
        </div>
      ))
    ) : (
      <div className="text-center py-8 text-muted-foreground">
        <History className="h-8 w-8 mx-auto mb-2" />
        <p>No transactions found</p>
      </div>
    )}
  </CardContent>
</Card>

      </div>

      {/* Detailed Reports Tabs */}
      <Tabs defaultValue="billing">
          <TabsList className="grid grid-cols-4">
    <TabsTrigger value="billing" className="flex items-center justify-center gap-2">
      <Receipt className="h-4 w-4" />
      <span className="hidden md:inline">Billing Records</span>
    </TabsTrigger>

    <TabsTrigger value="purchases" className="flex items-center justify-center gap-2">
      <ShoppingCart className="h-4 w-4" />
      <span className="hidden md:inline">Purchases</span>
    </TabsTrigger>

    <TabsTrigger value="gst" className="flex items-center justify-center gap-2">
      <Percent className="h-4 w-4" />
      <span className="hidden md:inline">GST Summary</span>
    </TabsTrigger>

    <TabsTrigger value="transactions" className="flex items-center justify-center gap-2">
      <History className="h-4 w-4" />
      <span className="hidden md:inline">All Transactions</span>
    </TabsTrigger>
  </TabsList>

        <TabsContent value="billing">
          <Card className="max-h-96 flex flex-col">
            <CardHeader>
              <CardTitle>Recent Bills ({sales.length})</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-3 pr-2 hide-scrollbar">
              <div className="space-y-3">
                {sales.slice(0, 20).map((sale) => (
                  <div key={sale.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">#{sale.invoiceNumber}</p>
                        <Badge variant={sale.paymentStatus === 'PAID' ? 'default' : 'secondary'}>
                          {sale.paymentStatus}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {sale.customerName || sale.customer?.name || 'Walk-in Customer'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(sale.saleDate).toLocaleDateString('en-IN')} • 
                        {sale.saleItems.length} items
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">₹{sale.totalAmount.toLocaleString('en-IN')}</p>
                      <p className="text-xs text-muted-foreground">
                        GST: ₹{(sale.totalAmount * 0.18).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases">
          <Card className="max-h-96 flex flex-col">
            <CardHeader>
              <CardTitle>Purchase Entries ({purchases.length})</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-3 pr-2 hide-scrollbar">
              <div className="space-y-3">
                {purchases.slice(0, 20).map((purchase) => (
                  <div key={purchase.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold">{purchase.supplier.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {purchase.purchaseItems.length} items
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(purchase.purchaseDate).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-orange-600">
                        ₹{purchase.totalAmount.toLocaleString('en-IN')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Total items: {purchase.purchaseItems.reduce((sum, item) => sum + item.quantity, 0)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gst">
          <Card>
            <CardHeader>
              <CardTitle>GST Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-700">GST Collected</p>
                  <p className="text-2xl font-bold text-blue-900">
                    ₹{gstSummary.totalCollected.toFixed(2)}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    From {sales.length} sales
                  </p>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm font-medium text-orange-700">GST Paid</p>
                  <p className="text-2xl font-bold text-orange-900">
                    ₹{gstSummary.totalPaid.toFixed(2)}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">
                    From {purchases.length} purchases
                  </p>
                </div>
                
                <div className={`p-4 rounded-lg ${
                  gstSummary.netGST >= 0 ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  <p className="text-sm font-medium text-green-700">Net GST</p>
                  <p className={`text-2xl font-bold ${
                    gstSummary.netGST >= 0 ? 'text-green-900' : 'text-red-900'
                  }`}>
                    ₹{Math.abs(gstSummary.netGST).toFixed(2)}
                    {gstSummary.netGST >= 0 ? ' (Payable)' : ' (Refundable)'}
                  </p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-semibold mb-2">GST Calculation</h4>
                <p className="text-sm text-muted-foreground">
                  • Sales GST (18%): Collected on all sales transactions<br/>
                  • Purchase GST (18%): Paid on all purchase transactions<br/>
                  • Net GST: Difference between collected and paid amounts
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="max-h-96 flex flex-col">
            <CardHeader>
              <CardTitle>All Transactions ({recentTransactions.length})</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-3 pr-2">
              <div className="space-y-3">
                {recentTransactions.map((txn) => (
                  <div key={txn.id} className="flex justify-between items-center p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        txn.type === 'sale' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'
                      }`}>
                        {txn.type === 'sale' ? <TrendingUp className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                      </div>
                      <div>
                        <p className="font-semibold capitalize">{txn.type}</p>
                        <p className="text-sm text-muted-foreground">{txn.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(txn.date).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={txn.type === 'sale' ? 'default' : 'secondary'}
                      className="text-lg font-semibold"
                    >
                      {txn.type === 'sale' ? '+' : '-'}₹{txn.amount.toLocaleString('en-IN')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
