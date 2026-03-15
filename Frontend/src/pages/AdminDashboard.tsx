import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth'
import { getDashboardStats, getSalesTrend, getLowStockProducts, getRecentSales, getCategories, getProducts } from '@/lib/store'
import { toast } from '@/lib/toast'
import { Package, TrendingUp, AlertTriangle, ShoppingCart, BarChart3, Plus, IndianRupee, RefreshCw, ArrowUpRight, ArrowRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const COLORS = ['#16a34a', '#22c55e', '#f59e0b', '#ef4444', '#6366f1', '#06b6d4', '#84cc16', '#f97316']

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useTranslation()
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
    {
      title: t('total_products'),
      value: stats.totalProducts,
      desc: 'In inventory',
      icon: Package,
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
      text: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: t('todays_sales'),
      value: `₹${stats.todaysSales.toLocaleString()}`,
      desc: 'Today\'s revenue',
      icon: TrendingUp,
      gradient: 'from-emerald-500 to-green-600',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      text: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: t('low_stock'),
      value: stats.lowStockItems,
      desc: 'Items need restock',
      icon: AlertTriangle,
      gradient: 'from-amber-500 to-orange-500',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      text: 'text-amber-600 dark:text-amber-400',
    },
    {
      title: t('monthly_profit'),
      value: `₹${stats.monthlyProfit.toLocaleString()}`,
      desc: 'This month',
      icon: IndianRupee,
      gradient: 'from-violet-500 to-purple-600',
      bg: 'bg-violet-50 dark:bg-violet-950/30',
      text: 'text-violet-600 dark:text-violet-400',
    },
  ]

  const quickActions = [
    { icon: Plus, label: t('add_product_action'), path: '/admin/products', color: 'text-emerald-600' },
    { icon: ShoppingCart, label: t('create_bill'), path: '/admin/billing', color: 'text-blue-600' },
    { icon: Package, label: t('stock_entry'), path: '/admin/purchases', color: 'text-amber-600' },
    { icon: BarChart3, label: t('reports'), path: '/admin/reports', color: 'text-violet-600' },
  ]

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })

  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">
            Good morning, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 font-medium">{today}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          className="h-9 px-4 rounded-xl text-sm font-semibold border-border/60 hover:bg-muted gap-2"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 stagger">
        {quickActions.map((a, i) => (
          <button
            key={i}
            onClick={() => navigate(a.path)}
            className="animate-fade-up ios-card p-4 flex flex-col sm:flex-row items-center gap-2.5 text-center sm:text-left hover:shadow-medium transition-all group"
          >
            <div className={`h-9 w-9 rounded-xl bg-muted flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform ${a.color}`}>
              <a.icon className="h-4 w-4" />
            </div>
            <span className="text-xs font-semibold text-foreground leading-tight">{a.label}</span>
          </button>
        ))}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        {statCards.map((s, i) => (
          <div key={i} className="stat-card animate-fade-up group cursor-default">
            <div className="flex items-start justify-between mb-3">
              <div className={`h-10 w-10 rounded-2xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`h-5 w-5 ${s.text}`} />
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
            </div>
            <p className="text-2xl font-extrabold text-foreground tracking-tight">{s.value}</p>
            <p className="text-xs text-muted-foreground font-medium mt-0.5">{s.title}</p>
            <p className="text-[11px] text-muted-foreground/60 mt-0.5">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Recent Sales + Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent Sales */}
        <Card className="rounded-2xl border-border/50 shadow-soft overflow-hidden">
          <CardHeader className="pb-3 pt-5 px-5 border-b border-border/30">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-primary" /> {t('recent_sales')}
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">Latest transactions</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/admin/reports')} className="h-8 px-3 text-xs rounded-xl text-primary hover:text-primary hover:bg-primary/5">
                View all <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="max-h-72 overflow-y-auto hide-scrollbar p-3 space-y-1">
            {recentSales.length > 0 ? recentSales.map(sale => (
              <div key={sale.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/60 transition-colors cursor-default">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                    {sale.customerName?.charAt(0) || 'C'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{sale.customerName}</p>
                    <p className="text-[11px] text-muted-foreground">{sale.items} items · {new Date(sale.saleDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">₹{sale.totalAmount.toLocaleString()}</p>
                  <Badge className={`text-[10px] px-2 py-0 rounded-full mt-0.5 ${sale.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'} border-0`}>
                    {sale.paymentStatus.toLowerCase()}
                  </Badge>
                </div>
              </div>
            )) : (
              <div className="text-center text-muted-foreground py-10 space-y-2">
                <ShoppingCart className="h-10 w-10 mx-auto opacity-20" />
                <p className="text-sm">No sales yet — create your first bill!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Low Stock Alert */}
        <Card className="rounded-2xl border-border/50 shadow-soft overflow-hidden">
          <CardHeader className="pb-3 pt-5 px-5 border-b border-border/30">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" /> {t('low_stock_alert')}
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">Items needing restock</CardDescription>
              </div>
              {lowStock.length > 0 && (
                <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400 border-0 rounded-full px-2.5 text-xs font-semibold">
                  {lowStock.length}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="max-h-72 overflow-y-auto hide-scrollbar p-3 space-y-1">
            {lowStock.length > 0 ? lowStock.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/60 transition-colors cursor-default">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                    <Package className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{p.name}</p>
                    <p className="text-[11px] text-muted-foreground">SKU: {p.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`text-xs px-2.5 py-0.5 rounded-full border-0 ${p.currentStock === 0 ? 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'}`}>
                    {p.currentStock} units
                  </Badge>
                  <p className="text-[10px] text-muted-foreground mt-1">Alert: {p.lowStockAlert}</p>
                </div>
              </div>
            )) : (
              <div className="text-center text-muted-foreground py-10 space-y-2">
                <Package className="h-10 w-10 mx-auto opacity-20" />
                <p className="text-sm font-medium text-emerald-600">All stock levels healthy ✓</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Sales Trend */}
        <Card className="rounded-2xl border-border/50 shadow-soft">
          <CardHeader className="pb-3 pt-5 px-5 border-b border-border/30">
            <CardTitle className="text-base font-bold">{t('sales_trend')}</CardTitle>
            <CardDescription className="text-xs">
              ₹{salesTrend.reduce((s, d) => s + d.sales, 0).toLocaleString()} · {salesTrend.reduce((s, d) => s + d.transactions, 0)} transactions
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 px-3 pb-4">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={salesTrend} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}k`} />
                <Tooltip
                  formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Sales']}
                  contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', boxShadow: 'var(--shadow-medium)', background: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="rounded-2xl border-border/50 shadow-soft">
          <CardHeader className="pb-3 pt-5 px-5 border-b border-border/30">
            <CardTitle className="text-base font-bold">{t('product_categories')}</CardTitle>
            <CardDescription className="text-xs">{categoryData.length} categories</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {categoryData.length > 0 ? (
              <div className="flex flex-col md:flex-row items-center gap-4">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={categoryData} dataKey="productCount" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4}>
                      {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 min-w-[140px]">
                  {categoryData.map((c, i) => (
                    <div key={c.name} className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-xs font-medium text-foreground truncate max-w-[100px]">{c.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground">{c.productCount}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground space-y-3">
                <Package className="h-12 w-12 mx-auto opacity-20" />
                <p className="text-sm">No product data yet</p>
                <Button variant="outline" size="sm" className="rounded-xl" onClick={() => navigate('/admin/products')}>Add Products</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
