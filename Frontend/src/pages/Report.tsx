import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts'
import { IndianRupee, Percent, Receipt, History, PieChart as PieChartIcon, BarChart3, TrendingUp, Package, Users, ShoppingCart, RefreshCw } from 'lucide-react'
import { getDashboardStats, getSalesTrend, getSales, getPurchases, getCategories, type Sale, type Purchase } from '@/lib/store'
import { toast } from '@/lib/toast'

const COLORS = ['#4f46e5', '#16a34a', '#f97316', '#e11d48', '#8b5cf6', '#06b6d4']

export default function Report() {
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar')
  const [refreshKey, setRefreshKey] = useState(0)

  const stats = useMemo(() => getDashboardStats(), [refreshKey])
  const salesTrend = useMemo(() => getSalesTrend(7), [refreshKey])
  const sales = useMemo(() => getSales().slice(0, 50), [refreshKey])
  const purchases = useMemo(() => getPurchases().slice(0, 50), [refreshKey])
  const categories = useMemo(() => getCategories(), [refreshKey])

  const categoryData = categories.map(c => ({ name: c.name, value: c._count?.products || 0 })).filter(c => c.value > 0)

  const gstSummary = {
    collected: sales.reduce((s, sale) => s + (sale.totalAmount - sale.totalAmount / 1.18), 0),
    paid: purchases.reduce((s, p) => s + (p.totalAmount - p.totalAmount / 1.18), 0),
    get net() { return this.collected - this.paid },
  }

  const transactions = [
    ...sales.slice(0, 10).map(s => ({ id: s.id, type: 'sale' as const, amount: s.totalAmount, date: s.saleDate, desc: `Sale #${s.invoiceNumber}` })),
    ...purchases.slice(0, 10).map(p => ({ id: p.id, type: 'purchase' as const, amount: p.totalAmount, date: p.purchaseDate, desc: `Purchase from ${p.supplier.name}` })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 10)

  const refresh = () => { setRefreshKey(k => k + 1); toast.success('Report refreshed') }

  const statCards = [
    { title: 'Total Sales', value: `₹${stats.todaysSales.toLocaleString()}`, sub: `${sales.length} transactions`, icon: IndianRupee, color: 'text-green-600' },
    { title: 'Monthly Profit', value: `₹${stats.monthlyProfit.toLocaleString()}`, sub: 'Net revenue', icon: TrendingUp, color: 'text-emerald-600' },
    { title: 'Products', value: stats.totalProducts, sub: `${stats.lowStockItems} low stock`, icon: Package, color: 'text-blue-600' },
    { title: 'Customers', value: stats.totalCustomers, sub: 'Active', icon: Users, color: 'text-purple-600' },
  ]

  const ChartToggle = () => (
    <div className="flex gap-1">
      {([['bar', BarChart3], ['line', TrendingUp], ['pie', PieChartIcon]] as const).map(([t, Icon]) => (
        <button key={t} onClick={() => setChartType(t)} className={`p-2 rounded border transition-colors ${chartType === t ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}>
          <Icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  )

  return (
    <div className="container px-4 py-6 md:py-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl font-bold tracking-tight uppercase text-primary">Business Reports</h1>
        <Button variant="outline" size="sm" onClick={refresh} className="h-8 text-xs font-bold uppercase tracking-widest"><RefreshCw className="h-3.5 w-3.5 mr-2" />Refresh</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <Card key={i}>
            <CardContent className="p-4 md:p-5">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{s.title}</p>
                <s.icon className={`h-4 w-4 ${s.color}`} />
              </div>
              <p className="text-xl font-bold tracking-tight">{s.value}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60 mt-0.5">{s.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row justify-between items-center border-b pb-3">
            <CardTitle className="text-base">Sales Overview</CardTitle>
            <ChartToggle />
          </CardHeader>
          <CardContent className="pt-4">
            <ResponsiveContainer width="100%" height={300}>
              {chartType === 'bar' ? (
                <BarChart data={salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Sales']} />
                  <Legend /><Bar dataKey="sales" fill="#4f46e5" radius={[5, 5, 0, 0]} name="Sales" />
                </BarChart>
              ) : chartType === 'line' ? (
                <LineChart data={salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Sales']} />
                  <Legend /><Line type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={2} name="Sales Trend" />
                </LineChart>
              ) : (
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={60}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie><Tooltip />
                </PieChart>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="max-h-96 flex flex-col">
          <CardHeader className="border-b pb-3"><CardTitle className="text-base">Recent Transactions</CardTitle></CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-2 pr-2 hide-scrollbar">
            {transactions.length > 0 ? transactions.map(t => (
              <div key={t.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-semibold text-sm capitalize">{t.type}</p>
                  <p className="text-xs text-muted-foreground">{t.desc}</p>
                  <p className="text-xs text-muted-foreground">{new Date(t.date).toLocaleDateString()}</p>
                </div>
                <Badge variant={t.type === 'sale' ? 'default' : 'secondary'}>{t.type === 'sale' ? '+' : '-'}₹{t.amount.toLocaleString()}</Badge>
              </div>
            )) : <p className="text-center py-8 text-muted-foreground">No transactions yet</p>}
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="billing">
        <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full">
          <TabsTrigger value="billing" className="gap-1"><Receipt className="h-4 w-4" /><span className="hidden sm:inline">Bills</span></TabsTrigger>
          <TabsTrigger value="purchases" className="gap-1"><ShoppingCart className="h-4 w-4" /><span className="hidden sm:inline">Purchases</span></TabsTrigger>
          <TabsTrigger value="gst" className="gap-1"><Percent className="h-4 w-4" /><span className="hidden sm:inline">GST</span></TabsTrigger>
          <TabsTrigger value="transactions" className="gap-1"><History className="h-4 w-4" /><span className="hidden sm:inline">All</span></TabsTrigger>
        </TabsList>

        <TabsContent value="billing">
          <Card className="max-h-96 flex flex-col">
            <CardHeader className="border-b pb-3"><CardTitle className="text-base">Recent Bills ({sales.length})</CardTitle></CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-2 hide-scrollbar">
              {sales.slice(0, 20).map(s => (
                <div key={s.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-sm">#{s.invoiceNumber}</p>
                      <Badge variant={s.paymentStatus === 'PAID' ? 'default' : 'secondary'} className="text-xs">{s.paymentStatus}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{s.customerName || 'Walk-in'} • {new Date(s.saleDate).toLocaleDateString()}</p>
                  </div>
                  <p className="font-bold">₹{s.totalAmount.toLocaleString()}</p>
                </div>
              ))}
              {sales.length === 0 && <p className="text-center py-8 text-muted-foreground">No bills yet</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchases">
          <Card className="max-h-96 flex flex-col">
            <CardHeader className="border-b pb-3"><CardTitle className="text-base">Purchases ({purchases.length})</CardTitle></CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-2 hide-scrollbar">
              {purchases.slice(0, 20).map(p => (
                <div key={p.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-semibold text-sm">{p.supplier.name}</p>
                    <p className="text-xs text-muted-foreground">{p.purchaseItems.length} items • {new Date(p.purchaseDate).toLocaleDateString()}</p>
                  </div>
                  <p className="font-bold text-orange-600">₹{p.totalAmount.toLocaleString()}</p>
                </div>
              ))}
              {purchases.length === 0 && <p className="text-center py-8 text-muted-foreground">No purchases yet</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gst">
          <Card>
            <CardHeader className="border-b pb-3"><CardTitle className="text-base">GST Summary</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">GST Collected</p>
                  <p className="text-2xl font-bold">₹{gstSummary.collected.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">From {sales.length} sales</p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
                  <p className="text-sm font-medium text-orange-700 dark:text-orange-300">GST Paid</p>
                  <p className="text-2xl font-bold">₹{gstSummary.paid.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground mt-1">From {purchases.length} purchases</p>
                </div>
                <div className={`p-4 rounded-lg ${gstSummary.net >= 0 ? 'bg-green-50 dark:bg-green-950/30' : 'bg-red-50 dark:bg-red-950/30'}`}>
                  <p className="text-sm font-medium">Net GST</p>
                  <p className="text-2xl font-bold">₹{Math.abs(gstSummary.net).toFixed(2)}<span className="text-sm ml-1">{gstSummary.net >= 0 ? '(Payable)' : '(Refundable)'}</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="max-h-96 flex flex-col">
            <CardHeader className="border-b pb-3"><CardTitle className="text-base">All Transactions ({transactions.length})</CardTitle></CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-2 hide-scrollbar">
              {transactions.map(t => (
                <div key={t.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${t.type === 'sale' ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' : 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300'}`}>
                      {t.type === 'sale' ? <TrendingUp className="h-4 w-4" /> : <Package className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-semibold text-sm capitalize">{t.type}</p>
                      <p className="text-xs text-muted-foreground">{t.desc}</p>
                    </div>
                  </div>
                  <Badge variant={t.type === 'sale' ? 'default' : 'secondary'} className="text-sm">{t.type === 'sale' ? '+' : '-'}₹{t.amount.toLocaleString()}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
