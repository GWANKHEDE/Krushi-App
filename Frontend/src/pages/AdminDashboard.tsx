import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth'
import { getDashboardStats, getSalesTrend, getLowStockProducts, getRecentSales, getCategories, getProducts } from '@/lib/store'
import { toast } from '@/lib/toast'
import { Package, TrendingUp, AlertTriangle, ShoppingCart, BarChart3, Plus, IndianRupee, RefreshCw } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Line, Legend } from 'recharts'

const COLORS = ['#4f46e5', '#22c55e', '#facc15', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316']

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [refreshKey, setRefreshKey] = useState(0)

  const stats = useMemo(() => getDashboardStats(), [refreshKey])
  const salesTrend = useMemo(() => getSalesTrend(7), [refreshKey])
  const lowStock = useMemo(() => getLowStockProducts(), [refreshKey])
  const recentSales = useMemo(() => getRecentSales(10), [refreshKey])

  const categoryData = useMemo(() => {
    const cats = getCategories()
    return cats.map(c => ({ name: c.name, productCount: c._count?.products || 0 })).filter(c => c.productCount > 0)
  }, [refreshKey])

  const refresh = () => {
    setRefreshKey(k => k + 1)
    toast.success('Dashboard refreshed')
  }

  const statCards = [
    { title: 'Total Products', value: stats.totalProducts, desc: 'Active in inventory', icon: Package, color: 'text-blue-600' },
    { title: "Today's Sales", value: `₹${stats.todaysSales.toLocaleString()}`, desc: 'Revenue today', icon: TrendingUp, color: 'text-green-600' },
    { title: 'Low Stock', value: stats.lowStockItems, desc: 'Need restocking', icon: AlertTriangle, color: 'text-orange-500' },
    { title: 'Monthly Profit', value: `₹${stats.monthlyProfit.toLocaleString()}`, desc: 'This month', icon: IndianRupee, color: 'text-emerald-600' },
  ]

  const quickActions = [
    { icon: Plus, label: 'Add Product', path: '/admin/products' },
    { icon: ShoppingCart, label: 'Create Bill', path: '/admin/billing' },
    { icon: Package, label: 'Stock Entry', path: '/admin/purchases' },
    { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
  ]

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight uppercase text-primary">Welcome, {user?.name}!</h1>
          <p className="text-xs text-muted-foreground font-medium italic">Store summary for today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-[10px] font-bold uppercase tracking-widest hidden sm:flex">
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
          </Badge>
          <Button variant="outline" size="sm" onClick={refresh} className="h-8 text-xs font-bold uppercase tracking-widest">
            <RefreshCw className="h-3.5 w-3.5 mr-2" />Refresh
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {quickActions.map((a, i) => (
          <Button key={i} variant="outline" onClick={() => navigate(a.path)} className="h-auto py-2 flex flex-col sm:flex-row items-center gap-2 rounded-xl border-primary/10 hover:bg-primary/5 transition-all">
            <a.icon className="h-4 w-4 text-primary" /><span className="text-[10px] font-bold uppercase tracking-widest">{a.label}</span>
          </Button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{s.title}</p>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <p className="text-xl font-bold tracking-tight">{s.value}</p>
              <p className="text-[9px] font-bold uppercase tracking-tighter text-muted-foreground/60 mt-0.5">{s.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sales & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="max-h-96 flex flex-col">
          <CardHeader className="border-b pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base"><ShoppingCart className="h-5 w-5 text-primary" />Recent Sales</CardTitle>
                <CardDescription>Latest transactions</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/admin/reports')}>View All</Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-2 p-4 hide-scrollbar">
            {recentSales.length > 0 ? recentSales.map(sale => (
              <div key={sale.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium text-sm">{sale.customerName}</p>
                  <p className="text-xs text-muted-foreground">{sale.items} items • {new Date(sale.saleDate).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">₹{sale.totalAmount.toLocaleString()}</p>
                  <Badge variant={sale.paymentStatus === 'PAID' ? 'default' : 'secondary'} className="text-xs">{sale.paymentStatus.toLowerCase()}</Badge>
                </div>
              </div>
            )) : <p className="text-center text-muted-foreground py-8">No sales yet — create your first bill!</p>}
          </CardContent>
        </Card>

        <Card className="max-h-96 flex flex-col">
          <CardHeader className="border-b pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-base"><AlertTriangle className="h-5 w-5 text-destructive" />Low Stock Alert</CardTitle>
                <CardDescription>Products needing restock</CardDescription>
              </div>
              <Badge variant="destructive">{lowStock.length}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-2 p-4 hide-scrollbar">
            {lowStock.length > 0 ? lowStock.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-destructive/5 transition-colors">
                <div>
                  <p className="font-medium text-sm">{p.name}</p>
                  <p className="text-xs text-muted-foreground">SKU: {p.sku}</p>
                </div>
                <div className="text-right">
                  <Badge variant={p.currentStock === 0 ? 'destructive' : 'secondary'}>{p.currentStock} units</Badge>
                  <p className="text-xs text-muted-foreground mt-1">Alert at: {p.lowStockAlert}</p>
                </div>
              </div>
            )) : <p className="text-center text-muted-foreground py-8">All stock levels healthy ✓</p>}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="border-b pb-3">
            <CardTitle className="text-base">Sales Trend (7 Days)</CardTitle>
            <CardDescription>
              Total: ₹{salesTrend.reduce((s, d) => s + d.sales, 0).toLocaleString()} • {salesTrend.reduce((s, d) => s + d.transactions, 0)} transactions
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}k`} />
                <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Sales']} />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="transactions" stroke="#8b5cf6" strokeWidth={2} />
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b pb-3">
            <CardTitle className="text-base">Product Categories</CardTitle>
            <CardDescription>{categoryData.length} categories</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {categoryData.length > 0 ? (
              <div className="flex flex-col md:flex-row items-center gap-4">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={categoryData} dataKey="productCount" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3}
                      label={({ name, productCount }) => `${name}: ${productCount}`} labelLine={false}>
                      {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 min-w-[160px]">
                  {categoryData.map((c, i) => (
                    <div key={c.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="truncate max-w-[100px]">{c.name}</span>
                      </div>
                      <span className="font-medium">{c.productCount}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No product data yet</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => navigate('/admin/products')}>Add Products</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
