import { useState } from "react";
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
import { mockProducts, mockDashboardStats, mockBills } from "@/data/mockData";

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

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("today");
  const navigate = useNavigate();

  const lowStockProducts = mockProducts.filter((p) => p.stock <= 10);
  const recentBills = mockBills.slice(0, 5);

  const statsCards = [
    {
      title: "Total Products",
      value: mockDashboardStats.totalProducts,
      description: "Active products in inventory",
      icon: Package,
      variant: "default" as const,
    },
    {
      title: "Today's Sales",
      value: `₹${mockDashboardStats.todaySales.toLocaleString()}`,
      description: "Revenue generated today",
      icon: TrendingUp,
      variant: "success" as const,
      trend: "up" as const,
      trendValue: "+12%",
    },
    {
      title: "Low Stock Items",
      value: mockDashboardStats.lowStockProducts,
      description: "Products need restocking",
      icon: AlertTriangle,
      variant: "warning" as const,
    },
    {
      title: "Monthly Profit",
      value: `₹${mockDashboardStats.monthlyProfit.toLocaleString()}`,
      description: "Profit this month",
      icon: IndianRupee,
      variant: "info" as const,
      trend: "up" as const,
      trendValue: "+8%",
    },
  ];

  const salesTrendData = [
    { date: "Jul 1", sales: 1200 },
    { date: "Jul 2", sales: 1800 },
    { date: "Jul 3", sales: 1400 },
    { date: "Jul 4", sales: 2200 },
    { date: "Jul 5", sales: 2000 },
    { date: "Jul 6", sales: 2500 },
    { date: "Jul 7", sales: 2800 },
  ];

  const productCategoryData = [
    { name: "Fertilizer", value: 12 },
    { name: "Seeds", value: 8 },
    { name: "Tools", value: 5 },
    { name: "Pesticide", value: 3 },
  ];

  const quickActions = [
    { icon: Plus, label: "Add Product", path: "/admin/products" },
    { icon: ShoppingCart, label: "Create Bill", path: "/admin/billing" },
    { icon: Package, label: "Stock Entry", path: "/admin/purchases" },
    { icon: BarChart3, label: "View Reports", path: "/admin/reports" },
  ];

  const COLORS = ["#4f46e5", "#22c55e", "#facc15", "#ef4444"];
  const ownerName = "Wankhede Patil ";

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-green-50 via-white to-lime-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-muted-foreground">
            Welcome back{" "}
            <span className="font-bold text-green-700">{ownerName}</span>!
            Here's what's happening at your store.
          </h1>
        </div>
      </div>

      {/* Quick Actions as Tab Bar */}
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
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentBills.map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-lime-50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{bill.customerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {bill.items.length} items •{" "}
                      {bill.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-700">
                      ₹{bill.total.toLocaleString()}
                    </p>
                    <Badge
                      variant={bill.status === "paid" ? "default" : "secondary"}
                    >
                      {bill.status}
                    </Badge>
                  </div>
                </div>
              ))}
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
                {lowStockProducts.length}
              </Badge>
            </div>
          </CardHeader>

          {/* 👇 Added max-h + scroll */}
          <CardContent className="space-y-3 max-h-60 overflow-y-auto">
            {lowStockProducts.map((product) => (
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
                  <Badge className="bg-red-100 text-red-600 font-semibold"
                    variant={product.stock === 0 ? "destructive" : "secondary"}
                  >
                    {product.stock} {product.unit}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
            <CardDescription>Daily sales for the past 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="sales"
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
                  data={productCategoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  label
                >
                  {productCategoryData.map((entry, index) => (
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
