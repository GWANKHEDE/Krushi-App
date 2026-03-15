import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { getDashboardStats, getSalesTrend, getLowStockProducts, getRecentSales, getCategories } from '@/lib/store'
import { toast } from '@/lib/toast'
import { Package, TrendingUp, AlertTriangle, ShoppingCart, BarChart3, Plus, IndianRupee, RefreshCw, ArrowRight, ChevronRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const PIE_COLORS = ['#16a34a', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useTranslation()
  const [key, setKey] = useState(0)

  const stats     = useMemo(() => getDashboardStats(),   [key])
  const trend     = useMemo(() => getSalesTrend(7),      [key])
  const lowStock  = useMemo(() => getLowStockProducts(),  [key])
  const sales     = useMemo(() => getRecentSales(8),     [key])
  const catData   = useMemo(() => {
    return getCategories()
      .map(c => ({ name: c.name, value: c._count?.products || 0 }))
      .filter(c => c.value > 0)
  }, [key])

  const greet = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

  const widgets = [
    { label: t('total_products'), value: stats.totalProducts,                      sub: 'in inventory',     icon: Package,       color: 'blue',   iconBg: 'bg-blue-50 dark:bg-blue-900/25',   iconColor: 'text-blue-600 dark:text-blue-400' },
    { label: t('todays_sales'),   value: `₹${stats.todaysSales.toLocaleString()}`, sub: "today's revenue",  icon: TrendingUp,    color: 'green',  iconBg: 'bg-emerald-50 dark:bg-emerald-900/25', iconColor: 'text-emerald-600 dark:text-emerald-400' },
    { label: t('low_stock'),      value: stats.lowStockItems,                      sub: 'need restock',     icon: AlertTriangle, color: 'amber',  iconBg: 'bg-amber-50 dark:bg-amber-900/25',  iconColor: 'text-amber-600 dark:text-amber-400' },
    { label: t('monthly_profit'), value: `₹${stats.monthlyProfit.toLocaleString()}`, sub: 'this month',     icon: IndianRupee,   color: 'purple', iconBg: 'bg-violet-50 dark:bg-violet-900/25', iconColor: 'text-violet-600 dark:text-violet-400' },
  ]

  const quickActions = [
    { icon: Plus,         label: t('add_product_action'), path: '/admin/products',  iconBg: 'bg-emerald-100 dark:bg-emerald-900/30', iconColor: 'text-emerald-700 dark:text-emerald-400' },
    { icon: ShoppingCart, label: t('create_bill'),         path: '/admin/billing',   iconBg: 'bg-blue-100 dark:bg-blue-900/30',     iconColor: 'text-blue-700 dark:text-blue-400' },
    { icon: Package,      label: t('stock_entry'),         path: '/admin/purchases', iconBg: 'bg-amber-100 dark:bg-amber-900/30',   iconColor: 'text-amber-700 dark:text-amber-400' },
    { icon: BarChart3,    label: t('reports'),             path: '/admin/reports',   iconBg: 'bg-violet-100 dark:bg-violet-900/30', iconColor: 'text-violet-700 dark:text-violet-400' },
  ]

  return (
    <div className="space-y-5 ios-page">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[13px] text-muted-foreground font-medium">{today}</p>
          <h1 className="text-[22px] font-bold text-foreground tracking-tight mt-0.5">
            {greet()}, {user?.name?.split(' ')[0]} 👋
          </h1>
        </div>
        <button
          onClick={() => { setKey(k => k + 1); toast.success('Refreshed') }}
          className="h-9 w-9 rounded-xl bg-muted/70 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 mt-1"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      {/* ── Quick Actions ── */}
      <div className="grid grid-cols-4 gap-2.5 ios-stagger">
        {quickActions.map((a, i) => (
          <button
            key={i}
            onClick={() => navigate(a.path)}
            className="ios-action-btn ios-scale"
          >
            <div className={`ios-icon ios-icon-md ${a.iconBg} ${a.iconColor}`}>
              <a.icon className="h-[18px] w-[18px]" />
            </div>
            <span className="text-[11px] font-medium text-foreground/80 leading-tight text-center">{a.label}</span>
          </button>
        ))}
      </div>

      {/* ── Stat Widgets ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 ios-stagger">
        {widgets.map((w, i) => (
          <div key={i} className={`ios-widget ${w.color} ios-scale`}>
            <div className="flex items-start justify-between mb-3">
              <div className={`ios-icon ios-icon-md ${w.iconBg} ${w.iconColor}`}>
                <w.icon className="h-[18px] w-[18px]" />
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground/25 mt-0.5" />
            </div>
            <p className="text-[24px] font-bold text-foreground tracking-tight leading-none">{w.value}</p>
            <p className="text-[12px] font-semibold text-foreground/70 mt-1.5">{w.label}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{w.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Recent Sales + Low Stock ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent Sales */}
        <div className="ios-card overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border/40">
            <div>
              <h2 className="text-[15px] font-semibold text-foreground">{t('recent_sales')}</h2>
              <p className="text-[12px] text-muted-foreground mt-0.5">Latest transactions</p>
            </div>
            <button
              onClick={() => navigate('/admin/reports')}
              className="text-[13px] text-primary font-medium flex items-center gap-0.5 hover:opacity-70 transition-opacity"
            >
              All <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="max-h-[280px] overflow-y-auto hide-scrollbar divide-y divide-border/30">
            {sales.length > 0 ? sales.map(s => (
              <div key={s.id} className="ios-list-row mx-1 my-0.5">
                {/* Avatar */}
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm flex-shrink-0">
                  {s.customerName?.charAt(0) || 'C'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-foreground truncate">{s.customerName}</p>
                  <p className="text-[11px] text-muted-foreground">{s.items} items · {new Date(s.saleDate).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[13px] font-semibold text-primary">₹{s.totalAmount.toLocaleString()}</p>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                    s.paymentStatus === 'PAID'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {s.paymentStatus.toLowerCase()}
                  </span>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
                <ShoppingCart className="h-10 w-10 opacity-20" />
                <p className="text-sm">No sales yet</p>
                <button onClick={() => navigate('/admin/billing')} className="text-xs text-primary font-medium hover:underline">Create first bill →</button>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock */}
        <div className="ios-card overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border/40">
            <div>
              <h2 className="text-[15px] font-semibold text-foreground">{t('low_stock_alert')}</h2>
              <p className="text-[12px] text-muted-foreground mt-0.5">Items needing restock</p>
            </div>
            {lowStock.length > 0 && (
              <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                {lowStock.length}
              </span>
            )}
          </div>
          <div className="max-h-[280px] overflow-y-auto hide-scrollbar divide-y divide-border/30">
            {lowStock.length > 0 ? lowStock.map(p => (
              <div key={p.id} className="ios-list-row mx-1 my-0.5">
                <div className="h-9 w-9 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                  <Package className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-foreground truncate">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground">SKU: {p.sku}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    p.currentStock === 0
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                  }`}>
                    {p.currentStock} units
                  </span>
                  <p className="text-[10px] text-muted-foreground mt-1">Alert: {p.lowStockAlert}</p>
                </div>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
                <Package className="h-10 w-10 opacity-20" />
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">All stock healthy ✓</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Sales Trend — takes 2 cols */}
        <div className="ios-card p-4 lg:col-span-2">
          <div className="mb-4">
            <h2 className="text-[15px] font-semibold text-foreground">{t('sales_trend')}</h2>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              ₹{trend.reduce((s, d) => s + d.sales, 0).toLocaleString()} · {trend.reduce((s, d) => s + d.transactions, 0)} transactions
            </p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={trend} barSize={22} barCategoryGap="35%">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} width={48} />
              <Tooltip
                formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Sales']}
                contentStyle={{
                  borderRadius: '14px',
                  border: '0.5px solid hsl(var(--border))',
                  boxShadow: 'var(--shadow-3)',
                  background: 'hsl(var(--card))',
                  color: 'hsl(var(--foreground))',
                  fontSize: 12,
                  padding: '8px 14px'
                }}
                cursor={{ fill: 'hsl(var(--muted) / 0.5)', radius: 6 }}
              />
              <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div className="ios-card p-4">
          <div className="mb-3">
            <h2 className="text-[15px] font-semibold text-foreground">{t('product_categories')}</h2>
            <p className="text-[12px] text-muted-foreground mt-0.5">{catData.length} categories</p>
          </div>
          {catData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={catData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={42} outerRadius={68} paddingAngle={3}>
                    {catData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '0.5px solid hsl(var(--border))', background: 'hsl(var(--card))', color: 'hsl(var(--foreground))', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-1">
                {catData.map((c, i) => (
                  <div key={c.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-[12px] text-foreground/80 truncate">{c.name}</span>
                    </div>
                    <span className="text-[12px] font-semibold text-muted-foreground">{c.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground gap-2">
              <Package className="h-10 w-10 opacity-20" />
              <p className="text-xs">No data yet</p>
              <button onClick={() => navigate('/admin/products')} className="text-xs text-primary font-medium hover:underline">Add products →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
