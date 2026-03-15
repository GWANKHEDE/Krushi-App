import { useState, useMemo } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts'
import { IndianRupee, Percent, Receipt, History, PieChart as PieChartIcon, BarChart3, TrendingUp, Package, Users, ShoppingCart, RefreshCw } from 'lucide-react'
import { getDashboardStats, getSalesTrend, getSales, getPurchases, getCategories } from '@/lib/store'
import { toast } from '@/lib/toast'

const CHART_COLORS = ['#34C759','#007AFF','#FF9500','#FF3B30','#AF52DE','#5AC8FA']

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 20, fontWeight: 700, color: "hsl(var(--foreground))", letterSpacing: "-0.015em", marginBottom: 8 }}>{children}</p>
}

export default function Report() {
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar')
  const [activeTab, setActiveTab] = useState<'billing' | 'purchases' | 'gst' | 'all'>('billing')
  const [refreshKey, setRefreshKey] = useState(0)

  const stats = useMemo(() => getDashboardStats(), [refreshKey])
  const salesTrend = useMemo(() => getSalesTrend(7), [refreshKey])
  const sales = useMemo(() => getSales().slice(0, 50), [refreshKey])
  const purchases = useMemo(() => getPurchases().slice(0, 50), [refreshKey])
  const categories = useMemo(() => getCategories(), [refreshKey])
  const categoryData = categories.map(c => ({ name: c.name, value: c._count?.products || 0 })).filter(c => c.value > 0)

  const gst = {
    collected: sales.reduce((s, sale) => s + (sale.totalAmount - sale.totalAmount / 1.18), 0),
    paid: purchases.reduce((s, p) => s + (p.totalAmount - p.totalAmount / 1.18), 0),
    get net() { return this.collected - this.paid },
    get cgstC() { return this.collected / 2 }, get sgstC() { return this.collected / 2 },
    get cgstP() { return this.paid / 2 }, get sgstP() { return this.paid / 2 },
  }

  const transactions = [
    ...sales.slice(0, 10).map(s => ({ id: s.id, type: 'sale' as const, amount: s.totalAmount, date: s.saleDate, desc: `Sale #${s.invoiceNumber}` })),
    ...purchases.slice(0, 10).map(p => ({ id: p.id, type: 'purchase' as const, amount: p.totalAmount, date: p.purchaseDate, desc: `Purchase – ${p.supplier.name}` })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 12)

  const refresh = () => { setRefreshKey(k => k + 1); toast.success('Refreshed') }

  const tooltipStyle = { borderRadius: 14, border: "0.5px solid rgba(60,60,67,0.18)", boxShadow: "0 12px 40px rgba(0,0,0,0.12)", background: "rgba(255,255,255,0.92)", backdropFilter: "blur(20px)", color: "hsl(var(--foreground))", fontSize: 13, fontFamily: "Inter" }

  const statCards = [
    { title: 'Total Sales',     value: `₹${stats.todaysSales.toLocaleString()}`,   sub: `${sales.length} transactions`, icon: IndianRupee, color: "#34C759", bg: "rgba(52,199,89,0.10)"  },
    { title: 'Monthly Profit',  value: `₹${stats.monthlyProfit.toLocaleString()}`, sub: 'Net revenue',                  icon: TrendingUp,  color: "#007AFF", bg: "rgba(0,122,255,0.10)"  },
    { title: 'Products',        value: stats.totalProducts,                         sub: `${stats.lowStockItems} low`,    icon: Package,     color: "#FF9500", bg: "rgba(255,149,0,0.10)"  },
    { title: 'Customers',       value: stats.totalCustomers,                        sub: 'Active',                        icon: Users,       color: "#AF52DE", bg: "rgba(175,82,222,0.10)" },
  ]

  return (
    <div className="space-y-5 hig-page-enter">
      {/* Header */}
      {/* Header — refresh icon inline next to title (same as dashboard) */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div>
          <p style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", fontWeight: 400 }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 3 }}>
            <h1 className="ios-large-title" style={{ color: "hsl(var(--foreground))", lineHeight: 1 }}>Reports</h1>
            {/* Inline refresh — right next to title, same as dashboard */}
            <button
              onClick={refresh}
              className="glass hig-pop"
              style={{ width: 32, height: 32, borderRadius: 9, padding: 0, border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "hsl(var(--muted-foreground))", cursor: "pointer", flexShrink: 0 }}
            >
              <RefreshCw style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </div>
      </div>

      {/* Stat widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 hig-list">
        {statCards.map((s, i) => (
          <div key={i} className="glass-widget" style={{ padding: "16px 14px 12px" }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
              <s.icon style={{ width: 18, height: 18, color: s.color }} />
            </div>
            <p style={{ fontSize: 22, fontWeight: 700, color: "hsl(var(--foreground))", letterSpacing: "-0.025em", lineHeight: 1 }}>{s.value}</p>
            <p style={{ fontSize: 12, fontWeight: 500, color: "hsl(var(--foreground))", marginTop: 5, opacity: 0.72 }}>{s.title}</p>
            <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", marginTop: 1 }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <SectionTitle>Sales Overview</SectionTitle>
            <div className="hig-segmented" style={{ width: 120 }}>
              {([['bar', BarChart3], ['line', TrendingUp], ['pie', PieChartIcon]] as const).map(([type, Icon]) => (
                <button key={type} className={`hig-seg ${chartType === type ? 'active' : ''}`} onClick={() => setChartType(type)} style={{ padding: "0 6px" }}>
                  <Icon style={{ width: 13, height: 13 }} />
                </button>
              ))}
            </div>
          </div>
          <div className="glass" style={{ padding: "16px 14px", borderRadius: 18 }}>
            <ResponsiveContainer width="100%" height={260}>
              {chartType === 'bar' ? (
                <BarChart data={salesTrend} barSize={20} barCategoryGap="38%">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(60,60,67,0.10)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}k`} width={46} />
                  <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Sales']} contentStyle={tooltipStyle} cursor={{ fill: "rgba(52,199,89,0.05)", radius: 6 }} />
                  <Bar dataKey="sales" fill="#34C759" radius={[6, 6, 0, 0]} />
                </BarChart>
              ) : chartType === 'line' ? (
                <LineChart data={salesTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(60,60,67,0.10)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v / 1000}k`} width={46} />
                  <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Sales']} contentStyle={tooltipStyle} />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#007AFF" strokeWidth={2.5} dot={{ fill: "#007AFF", r: 3 }} name="Sales" />
                </LineChart>
              ) : (
                <PieChart>
                  <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} innerRadius={55} paddingAngle={3} strokeWidth={0} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {categoryData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent transactions */}
        <div>
          <SectionTitle>Recent Transactions</SectionTitle>
          <div className="hig-section" style={{ maxHeight: 320, overflowY: "auto" }} >
            {transactions.map(txn => (
              <div key={txn.id} className="hig-cell">
                <div style={{ width: 34, height: 34, borderRadius: 9, background: txn.type === 'sale' ? "rgba(52,199,89,0.10)" : "rgba(255,149,0,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {txn.type === 'sale' ? <TrendingUp style={{ width: 16, height: 16, color: "#34C759" }} /> : <Package style={{ width: 16, height: 16, color: "#FF9500" }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500 }} className="truncate">{txn.desc}</p>
                  <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>{new Date(txn.date).toLocaleDateString()}</p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 600, color: txn.type === 'sale' ? "#34C759" : "#FF9500", flexShrink: 0 }}>
                  {txn.type === 'sale' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                </span>
              </div>
            ))}
            {transactions.length === 0 && <div style={{ padding: "32px 16px", textAlign: "center", color: "hsl(var(--muted-foreground))", fontSize: 14 }}>No transactions yet</div>}
          </div>
        </div>
      </div>

      {/* Tabs section */}
      <div>
        {/* Tab bar — icon always visible, label on sm+, no overflow */}
        <div
          className="mb-4 w-full"
          style={{ display: "flex", gap: 4, background: "rgba(118,118,128,0.12)", borderRadius: 12, padding: 3 }}
        >
          {([
            ['billing',   'Bills',     Receipt,      '#007AFF'],
            ['purchases', 'Purchases', ShoppingCart, '#34C759'],
            ['gst',       'GST',       Percent,      '#FF9500'],
            ['all',       'All',       History,      '#AF52DE'],
          ] as const).map(([key, label, Icon, col]) => {
            const active = activeTab === key
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  flex: 1, minWidth: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                  padding: "8px 4px", borderRadius: 9, border: "none", cursor: "pointer",
                  background: active ? "hsl(var(--card))" : "transparent",
                  color: active ? col : "hsl(var(--muted-foreground))",
                  fontWeight: active ? 600 : 400, fontSize: 13,
                  boxShadow: active ? "0 1px 3px rgba(0,0,0,0.10)" : "none",
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap",
                }}
              >
                <Icon style={{ width: 14, height: 14, flexShrink: 0 }} />
                <span className="hidden sm:inline" style={{ overflow: "hidden", textOverflow: "ellipsis", fontSize: 12 }}>{label}</span>
              </button>
            )
          })}
        </div>

        {activeTab === 'billing' && (
          <div>
            <SectionTitle>Recent Bills ({sales.length})</SectionTitle>
            <div className="hig-section" style={{ maxHeight: 380, overflowY: "auto" }}>
              {sales.slice(0, 20).map(s => (
                <div key={s.id} className="hig-cell">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <p style={{ fontSize: 14, fontWeight: 500 }}>#{s.invoiceNumber}</p>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 7px", borderRadius: 99, background: s.paymentStatus === 'PAID' ? "rgba(52,199,89,0.12)" : "rgba(255,149,0,0.12)", color: s.paymentStatus === 'PAID' ? "#34C759" : "#FF9500" }}>{s.paymentStatus}</span>
                    </div>
                    <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}>{s.customerName || 'Walk-in'} · {new Date(s.saleDate).toLocaleDateString()}</p>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#34C759", flexShrink: 0 }}>₹{s.totalAmount.toLocaleString()}</p>
                </div>
              ))}
              {sales.length === 0 && <div style={{ padding: "32px 16px", textAlign: "center", fontSize: 14, color: "hsl(var(--muted-foreground))" }}>No bills yet</div>}
            </div>
          </div>
        )}

        {activeTab === 'purchases' && (
          <div>
            <SectionTitle>Purchases ({purchases.length})</SectionTitle>
            <div className="hig-section" style={{ maxHeight: 380, overflowY: "auto" }}>
              {purchases.slice(0, 20).map(p => (
                <div key={p.id} className="hig-cell">
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>{p.supplier.name}</p>
                    <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}>{p.purchaseItems.length} items · {new Date(p.purchaseDate).toLocaleDateString()}</p>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#FF9500", flexShrink: 0 }}>₹{p.totalAmount.toLocaleString()}</p>
                </div>
              ))}
              {purchases.length === 0 && <div style={{ padding: "32px 16px", textAlign: "center", fontSize: 14, color: "hsl(var(--muted-foreground))" }}>No purchases yet</div>}
            </div>
          </div>
        )}

        {activeTab === 'gst' && (
          <div className="space-y-4">
            <SectionTitle>GST Summary</SectionTitle>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Output Tax (Collected)", value: gst.collected, sub: `From ${sales.length} sales`, color: "#007AFF", bg: "rgba(0,122,255,0.08)" },
                { label: "Input Tax (Paid)",        value: gst.paid,      sub: `From ${purchases.length} purchases`, color: "#FF9500", bg: "rgba(255,149,0,0.08)" },
                { label: "Net GST Liability",        value: Math.abs(gst.net), sub: gst.net >= 0 ? "Payable to Govt" : "Refundable", color: gst.net >= 0 ? "#34C759" : "#FF3B30", bg: gst.net >= 0 ? "rgba(52,199,89,0.08)" : "rgba(255,59,48,0.08)" },
              ].map((g, i) => (
                <div key={i} className="glass-widget" style={{ padding: "16px 14px" }}>
                  <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginBottom: 6 }}>{g.label}</p>
                  <p style={{ fontSize: 24, fontWeight: 700, color: g.color, letterSpacing: "-0.022em" }}>₹{g.value.toFixed(2)}</p>
                  <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", marginTop: 4 }}>{g.sub}</p>
                </div>
              ))}
            </div>
            <div className="glass" style={{ borderRadius: 18, overflow: "hidden" }}>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: "0.5px solid rgba(60,60,67,0.12)" }}>
                      {["Component", "Collected", "ITC", "Net Payable"].map(h => (
                        <th key={h} style={{ padding: "10px 14px", textAlign: h === "Component" ? "left" : "right", fontWeight: 600, color: "hsl(var(--muted-foreground))", fontSize: 12 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[["CGST (9%)", gst.cgstC, gst.cgstP], ["SGST (9%)", gst.sgstC, gst.sgstP], ["IGST (18%)", 0, 0]].map(([name, c, p]) => (
                      <tr key={String(name)} style={{ borderBottom: "0.5px solid rgba(60,60,67,0.08)" }}>
                        <td style={{ padding: "10px 14px", fontWeight: 600, color: "hsl(var(--primary))" }}>{name}</td>
                        <td style={{ padding: "10px 14px", textAlign: "right" }}>₹{Number(c).toFixed(2)}</td>
                        <td style={{ padding: "10px 14px", textAlign: "right" }}>₹{Number(p).toFixed(2)}</td>
                        <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 700 }}>₹{(Number(c) - Number(p)).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'all' && (
          <div>
            <SectionTitle>All Transactions ({transactions.length})</SectionTitle>
            <div className="hig-section" style={{ maxHeight: 400, overflowY: "auto" }}>
              {transactions.map(txn => (
                <div key={txn.id} className="hig-cell">
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: txn.type === 'sale' ? "rgba(52,199,89,0.10)" : "rgba(255,149,0,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {txn.type === 'sale' ? <TrendingUp style={{ width: 16, height: 16, color: "#34C759" }} /> : <Package style={{ width: 16, height: 16, color: "#FF9500" }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, textTransform: "capitalize" }}>{txn.type}</p>
                    <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }}>{txn.desc}</p>
                  </div>
                  <span style={{ fontSize: 14, fontWeight: 600, color: txn.type === 'sale' ? "#34C759" : "#FF9500", flexShrink: 0 }}>
                    {txn.type === 'sale' ? '+' : '-'}₹{txn.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
