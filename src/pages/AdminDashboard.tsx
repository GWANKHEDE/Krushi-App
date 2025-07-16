import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatsCard } from '@/components/ui/stats-card';
import { Badge } from '@/components/ui/badge';
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
} from 'lucide-react';
import { mockProducts, mockDashboardStats, mockBills } from '@/data/mockData';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('today');

  const lowStockProducts = mockProducts.filter(p => p.stock <= 10);
  const recentBills = mockBills.slice(0, 5);

  const statsCards = [
    {
      title: 'Total Products',
      value: mockDashboardStats.totalProducts,
      description: 'Active products in inventory',
      icon: Package,
      variant: 'default' as const
    },
    {
      title: "Today's Sales",
      value: `₹${mockDashboardStats.todaySales.toLocaleString()}`,
      description: 'Revenue generated today',
      icon: TrendingUp,
      variant: 'success' as const,
      trend: 'up' as const,
      trendValue: '+12%'
    },
    {
      title: 'Low Stock Items',
      value: mockDashboardStats.lowStockProducts,
      description: 'Products need restocking',
      icon: AlertTriangle,
      variant: 'warning' as const
    },
    {
      title: 'Monthly Profit',
      value: `₹${mockDashboardStats.monthlyProfit.toLocaleString()}`,
      description: 'Profit this month',
      icon: IndianRupee,
      variant: 'info' as const,
      trend: 'up' as const,
      trendValue: '+8%'
    }
  ];

  // Data for charts
  const salesTrendData = [
    { date: 'Jul 1', sales: 1200 },
    { date: 'Jul 2', sales: 1800 },
    { date: 'Jul 3', sales: 1400 },
    { date: 'Jul 4', sales: 2200 },
    { date: 'Jul 5', sales: 2000 },
    { date: 'Jul 6', sales: 2500 },
    { date: 'Jul 7', sales: 2800 },
  ];

  const productCategoryData = [
    { name: 'Fertilizer', value: 12 },
    { name: 'Seeds', value: 8 },
    { name: 'Tools', value: 5 },
    { name: 'Pesticide', value: 3 },
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50'];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening at your store.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Product
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5" />
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
                <div key={bill.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{bill.customerName}</p>
                    <p className="text-sm text-muted-foreground">
                      {bill.items.length} items • {bill.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{bill.total.toLocaleString()}</p>
                    <Badge variant={bill.status === 'paid' ? 'default' : 'secondary'}>
                      {bill.status}
                    </Badge>
                  </div>
                </div>
              ))}
              {recentBills.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No recent sales</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span>Low Stock Alert</span>
                </CardTitle>
                <CardDescription>Products that need restocking</CardDescription>
              </div>
              <Badge variant="destructive" className="px-2 py-1">
                {lowStockProducts.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowStockProducts.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={product.stock === 0 ? 'destructive' : 'secondary'}>
                      {product.stock} {product.unit}
                    </Badge>
                  </div>
                </div>
              ))}
              {lowStockProducts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>All products are well stocked</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="h-5 w-5" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Plus className="h-6 w-6" />
              <span className="text-sm">Add Product</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <ShoppingCart className="h-6 w-6" />
              <span className="text-sm">Create Bill</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Package className="h-6 w-6" />
              <span className="text-sm">Stock Entry</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <BarChart3 className="h-6 w-6" />
              <span className="text-sm">View Reports</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend Chart */}
        <Card>
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
                <Bar dataKey="sales" fill="#4f46e5" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Product Categories Donut Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Product Categories</CardTitle>
            <CardDescription>Distribution of products by category</CardDescription>
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
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {productCategoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
