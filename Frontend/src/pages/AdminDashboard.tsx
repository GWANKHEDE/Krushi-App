import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/ui/stats-card";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  BarChart3,
  Download,
  Plus,
  Search,
  IndianRupee,
  Activity,
  RefreshCw,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts";
import { dashboardAPI, salesAPI, productsAPI, DashboardData, User } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface QuickAction {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
}

interface SalesTrendData {
  sales: number;
  transactions: number;
  date: string;
  totalSales: number;
  transactionCount: number;
  _sum?: {
    totalAmount: number;
  };
  _count?: {
    id: number;
  };
}

interface ProductCategoryData {
  id: string;
  name: string;
  productCount: number;
  _count?: {
    products: number;
  };
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [salesTrend, setSalesTrend] = useState<SalesTrendData[]>([]);
  const [productCategories, setProductCategories] = useState<ProductCategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [dashboardResponse, salesResponse, categoriesResponse] = await Promise.all([
        dashboardAPI.getDashboardData(),
        salesAPI.getAllSales({ limit: 100 }),
        productsAPI.getAllProducts({ limit: 1000 })
      ]);
      
      if (dashboardResponse.data.success) {
        setDashboardData(dashboardResponse.data.data);
        
        // Process sales data for trend chart
        processSalesTrend(salesResponse.data.data.sales || []);
        
        // Process product categories data
        processProductCategories(categoriesResponse.data.data.products || []);
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch dashboard data';
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      setIsRefreshing(true);
      await fetchDashboardData();
      toast({
        title: "Success",
        description: "Dashboard data refreshed successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to refresh data",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const processSalesTrend = (sales: any[]) => {
    // Group sales by date for the last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const salesByDate = sales.reduce((acc: any, sale: any) => {
      const saleDate = new Date(sale.saleDate).toISOString().split('T')[0];
      if (acc[saleDate]) {
        acc[saleDate].totalSales += sale.totalAmount;
        acc[saleDate].transactionCount += 1;
      } else {
        acc[saleDate] = {
          totalSales: sale.totalAmount,
          transactionCount: 1
        };
      }
      return acc;
    }, {});

    const trendData = last7Days.map(date => {
      const salesData = salesByDate[date] || { totalSales: 0, transactionCount: 0 };
      return {
        date: new Date(date).toLocaleDateString('en-IN', { 
          month: 'short', 
          day: 'numeric' 
        }),
        fullDate: date,
        sales: salesData.totalSales,
        transactions: salesData.transactionCount,
        totalSales: salesData.totalSales,
        transactionCount: salesData.transactionCount,
        formattedSales: `₹${salesData.totalSales.toLocaleString('en-IN')}`,
        formattedDate: new Date(date).toLocaleDateString('en-IN', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        })
      };
    });

    setSalesTrend(trendData);
  };

  const processProductCategories = (products: any[]) => {
    // Group products by category
    const categoriesMap = products.reduce((acc: any, product: any) => {
      const categoryName = product.category?.name || 'Uncategorized';
      if (acc[categoryName]) {
        acc[categoryName] += 1;
      } else {
        acc[categoryName] = 1;
      }
      return acc;
    }, {});

    const categoriesData = Object.entries(categoriesMap).map(([name, count]) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      productCount: count as number,
      value: count as number
    }));

    setProductCategories(categoriesData);
  };

  // Get user from localStorage
  const user: User = JSON.parse(localStorage.getItem('user') || '{}');
  const ownerName = user.name || 'Admin';

  const statsCards = [
    {
      title: "Total Products",
      value: dashboardData?.totals.totalProducts || 0,
      description: "Active products in inventory",
      icon: Package,
      variant: "default" as const,
    },
    {
      title: "Today's Sales",
      value: `₹${(dashboardData?.totals.todaysSales || 0).toLocaleString()}`,
      description: "Revenue generated today",
      icon: TrendingUp,
      variant: "success" as const,
      trend: "up" as const,
      trendValue: "+12%",
    },
    {
      title: "Low Stock Items",
      value: dashboardData?.totals.lowStockItems || 0,
      description: "Products need restocking",
      icon: AlertTriangle,
      variant: "warning" as const,
    },
    {
      title: "Monthly Profit",
      value: `₹${(dashboardData?.totals.monthlyProfit || 0).toLocaleString()}`,
      description: "Profit this month",
      icon: IndianRupee,
      variant: "info" as const,
      trend: "up" as const,
      trendValue: "+8%",
    },
  ];

  const quickActions: QuickAction[] = [
    { icon: Plus, label: "Add Product", path: "/admin/products" },
    { icon: ShoppingCart, label: "Create Bill", path: "/admin/billing" },
    { icon: Package, label: "Stock Entry", path: "/admin/purchases" },
    { icon: BarChart3, label: "View Reports", path: "/admin/reports" },
  ];

  const COLORS = [
    "#4f46e5", "#22c55e", "#facc15", "#ef4444", "#8b5cf6", 
    "#06b6d4", "#84cc16", "#f97316", "#ec4899", "#14b8a6",
    "#a855f7", "#3b82f6", "#eab308", "#84cc16", "#10b981"
  ];

  // Calculate total sales from trend data
  const totalSales = salesTrend.reduce((sum, day) => sum + day.sales, 0);
  const totalTransactions = salesTrend.reduce((sum, day) => sum + day.transactions, 0);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 bg-gradient-to-br from-green-50 via-white to-lime-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error && !dashboardData) {
    return (
      <div className="p-6 space-y-6 bg-gradient-to-br from-green-50 via-white to-lime-100 min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Failed to load dashboard</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={fetchDashboardData}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-green-50 via-white to-lime-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            Welcome back, {ownerName}!
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening at your store today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-sm">
            {new Date().toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 w-full mb-6">
        {quickActions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <Button
              key={idx}
              variant="ghost"
              onClick={() => navigate(action.path)}
              className="w-full flex items-center justify-center px-4 py-2 rounded-full border border-green-500 text-green-700 bg-gradient-to-r from-lime-100 to-green-100 hover:shadow-md transition-all"
            >
              <Icon className="h-5 w-5 mr-0 ml-0 text-green-600" />
              <span className="font-medium">{action.label}</span>
            </Button>
          );
        })}

        {/* Export Report Button */}
        <Button
          variant="ghost"
          onClick={() => {
            // Handle export logic
          }}
          className="w-full flex items-center justify-center px-4 py-2 rounded-full border border-green-500 text-green-700 bg-gradient-to-r from-lime-100 to-green-100 hover:shadow-md transition-all"
        >
          <Download className="h-5 w-5 mr-0 ml-0 text-green-600" />
          <span className="font-medium">Export Report</span>
        </Button>

        {/* New Product Button */}
        <Button
          variant="ghost"
          onClick={() => navigate("/admin/products")}
          className="w-full flex items-center justify-center px-4 py-2 rounded-full border border-green-500 text-green-700 bg-gradient-to-r from-lime-100 to-green-100 hover:shadow-md transition-all"
        >
          <Plus className="h-5 w-5 mr-0 ml-0 text-green-600" />
          <span className="font-medium">New Product</span>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <Card className="hover:shadow-lg bg-gradient-to-r from-lime-100 to-green-100 transition-shadow max-h-96 flex flex-col">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5 text-green-600" />
                  <span>Recent Sales</span>
                </CardTitle>
                <CardDescription>Latest customer transactions</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/admin/reports')}>
                <Search className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-3 pr-2 hide-scrollbar">
            <div className="space-y-2">
              {dashboardData?.recentSales?.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-lime-50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{sale.customerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {sale.items} items • {new Date(sale.saleDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-700">
                      ₹{sale.totalAmount.toLocaleString()}
                    </p>
                    <Badge
                      variant={sale.paymentStatus === "PAID" ? "default" : "secondary"}
                      className="capitalize"
                    >
                      {sale.paymentStatus.toLowerCase()}
                    </Badge>
                  </div>
                </div>
              ))}
              {(!dashboardData?.recentSales || dashboardData.recentSales.length === 0) && (
                <p className="text-center text-muted-foreground py-4">No recent sales</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card className="hover:shadow-lg bg-gradient-to-r from-lime-100 to-green-100 transition-shadow hide-scrollbar">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span>Low Stock Alert</span>
                </CardTitle>
                <CardDescription>Products that need restocking</CardDescription>
              </div>
              <Badge
                variant="destructive"
                className="px-2 py-1 text-white font-bold"
              >
                {dashboardData?.totals.lowStockItems || 0}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 max-h-60 overflow-y-auto">
            {dashboardData?.lowStockAlerts?.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-red-50 transition-colors"
              >
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    SKU: {product.sku}
                  </p>
                </div>
                <div className="text-right">
                  <Badge 
                    className="bg-red-100 text-red-600 font-semibold"
                    variant={product.currentStock === 0 ? "destructive" : "secondary"}
                  >
                    {product.currentStock} units
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">
                    Alert at: {product.lowStockAlert}
                  </p>
                </div>
              </div>
            ))}
            {(!dashboardData?.lowStockAlerts || dashboardData.lowStockAlerts.length === 0) && (
              <p className="text-center text-muted-foreground py-4">No low stock items</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <span>Sales Trend</span>
                </CardTitle>
                <CardDescription>Sales for the past 7 days</CardDescription>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-green-600">
                  Total: ₹{totalSales.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-muted-foreground">
                  {totalTransactions} transactions
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <Tooltip 
                  formatter={(value: any, name: string) => {
                    if (name === 'sales') {
                      return [`₹${Number(value).toLocaleString('en-IN')}`, 'Sales Amount'];
                    }
                    return [value, 'Transactions'];
                  }}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return `Date: ${payload[0].payload.formattedDate}`;
                    }
                    return `Date: ${label}`;
                  }}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar
                  dataKey="sales"
                  fill="url(#salesGradient)"
                  radius={[4, 4, 0, 0]}
                  name="Sales Amount"
                />
                <Line
                  type="monotone"
                  dataKey="transactions"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                  name="Transactions"
                />
                <Legend />
                <defs>
                  <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.8}/>
                    <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.2}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Product Categories Donut Chart */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Product Categories</CardTitle>
                <CardDescription>
                  Distribution of products by category
                </CardDescription>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-blue-600">
                  Total: {productCategories.reduce((sum, cat) => sum + cat.productCount, 0)} products
                </p>
                <p className="text-xs text-muted-foreground">
                  {productCategories.length} categories
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {productCategories.length > 0 ? (
              <div className="flex flex-col lg:flex-row items-center gap-6">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={productCategories}
                      dataKey="productCount"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={2}
                      label={({ name, productCount, percent }) => 
                        `${name}: ${productCount} (${(percent * 100).toFixed(1)}%)`
                      }
                      labelLine={false}
                    >
                      {productCategories.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any, name: string, props: any) => {
                        const total = productCategories.reduce((sum, cat) => sum + cat.productCount, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return [
                          `${value} products (${percentage}%)`,
                          props.payload.name
                        ];
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Category Legend */}
                <div className="space-y-2 min-w-[200px]">
                  <h4 className="font-semibold text-sm mb-3">Categories</h4>
                  {productCategories.map((category, index) => (
                    <div key={category.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="truncate max-w-[120px]">{category.name}</span>
                      </div>
                      <span className="font-medium">{category.productCount}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                <Package className="h-12 w-12 mb-4 opacity-50" />
                <p>No product categories data available</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  onClick={() => navigate('/admin/products')}
                >
                  Add Products
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}