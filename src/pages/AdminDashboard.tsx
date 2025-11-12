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
} from "recharts";
import { dashboardAPI, DashboardData, User } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface QuickAction {
  icon: React.ComponentType<any>;
  label: string;
  path: string;
}


export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await dashboardAPI.getDashboardData();
      
      if (response.data.success) {
        setDashboardData(response.data.data);
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

  const COLORS = ["#4f46e5", "#22c55e", "#facc15", "#ef4444", "#8b5cf6"];

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
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm">
            {new Date().toLocaleDateString('en-IN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Badge>
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
        <Card className="hover:shadow-lg bg-gradient-to-r from-lime-100 to-green-100 transition-shadow">
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
          <CardContent>
            <div className="space-y-4">
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
        <Card className="hover:shadow-lg bg-gradient-to-r from-lime-100 to-green-100 transition-shadow">
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
                    {product.category}
                  </p>
                </div>
                <div className="text-right">
                  <Badge 
                    className="bg-red-100 text-red-600 font-semibold"
                    variant={product.currentStock === 0 ? "destructive" : "secondary"}
                  >
                    {product.currentStock} units
                  </Badge>
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
            <CardTitle>Sales Trend</CardTitle>
            <CardDescription>Sales for the past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dashboardData?.salesTrend || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value: any) => [`₹${value}`, 'Sales']}
                  labelFormatter={(label: any) => `Date: ${new Date(label).toLocaleDateString()}`}
                />
                <Bar
                  dataKey="totalSales"
                  fill="url(#gradientSales)"
                  radius={[6, 6, 0, 0]}
                />
                <defs>
                  <linearGradient
                    id="gradientSales"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Product Categories Donut Chart */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
            <CardDescription>
              Distribution of products by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dashboardData?.productCategories || []}
                  dataKey="productCount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  label={({ name, productCount }: { name: string; productCount: number }) => `${name}: ${productCount}`}
                >
                  {(dashboardData?.productCategories || []).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
