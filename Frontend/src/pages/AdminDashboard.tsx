/*
  AdminDashboard — Apple HIG Dashboard
  ──────────────────────────────────────
  • Large Title (34pt bold) at top — iOS standard
  • Widgets: white cards on systemGroupedBackground (#F2F2F7)
  • System colors for status indicators
  • Grouped table view style for lists
  • No decorative gradients — color used semantically
  • Touch targets: minimum 44×44pt
*/
import { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/auth"
import {
  getDashboardStats, getSalesTrend, getLowStockProducts,
  getRecentSales, getCategories
} from "@/lib/store"
import { toast } from "@/lib/toast"
import {
  Package, TrendingUp, AlertTriangle, ShoppingCart,
  BarChart3, Plus, IndianRupee, RefreshCw, ChevronRight
} from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts"
import { useTranslation as i18n } from "react-i18next"

/* iOS system colors for chart */
const PIE_COLORS = ["#34C759","#007AFF","#FF9500","#FF3B30","#AF52DE","#5AC8FA","#FFCC00"]

/* ── Reusable Widget component ── */
function Widget({ color, iconBg, iconColor, icon: Icon, label, value, sub }:
  { color: string; iconBg: string; iconColor: string; icon: any; label: string; value: string|number; sub: string }
) {
  return (
    <div
      style={{
        background: "hsl(var(--card))",
        borderRadius: 16,
        padding: "14px 14px 12px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        position: "relative", overflow: "hidden",
        borderTop: `3px solid ${color}`,
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "default"
      }}
      className="hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-start justify-between mb-2.5">
        <div style={{ width: 36, height: 36, borderRadius: 9, background: iconBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon style={{ width: 18, height: 18, color: iconColor }} />
        </div>
        <ChevronRight style={{ width: 14, height: 14, color: "hsl(var(--muted-foreground))", opacity: 0.4, marginTop: 2 }} />
      </div>
      <p style={{ fontSize: 26, fontWeight: 700, color: "hsl(var(--foreground))", letterSpacing: "-0.025em", lineHeight: 1.1 }}>{value}</p>
      <p style={{ fontSize: 13, fontWeight: 500, color: "hsl(var(--foreground))", marginTop: 5, opacity: 0.8 }}>{label}</p>
      <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>{sub}</p>
    </div>
  )
}

/* ── Reusable Section Header ── */
function SectionHeader({ title, subtitle, action, onAction }:
  { title: string; subtitle?: string; action?: string; onAction?: () => void }
) {
  return (
    <div className="flex items-end justify-between mb-2 px-0.5">
      <div>
        <p style={{ fontSize: 20, fontWeight: 700, color: "hsl(var(--foreground))", letterSpacing: "-0.015em" }}>{title}</p>
        {subtitle && <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 1 }}>{subtitle}</p>}
      </div>
      {action && (
        <button onClick={onAction} style={{ fontSize: 14, color: "#007AFF", fontWeight: 400, display: "flex", alignItems: "center", gap: 2 }}
          className="hover:opacity-70 transition-opacity">
          {action} <ChevronRight style={{ width: 14, height: 14 }} />
        </button>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { t } = useTranslation()
  const [key, setKey] = useState(0)

  const stats    = useMemo(() => getDashboardStats(),    [key])
  const trend    = useMemo(() => getSalesTrend(7),       [key])
  const lowStock = useMemo(() => getLowStockProducts(),   [key])
  const sales    = useMemo(() => getRecentSales(8),      [key])
  const catData  = useMemo(() =>
    getCategories().map(c => ({ name: c.name, value: c._count?.products || 0 })).filter(c => c.value > 0),
    [key]
  )

  const greet = () => {
    const h = new Date().getHours()
    return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening"
  }

  const dateStr = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })

  /* iOS system colors */
  const widgets = [
    { label: t("total_products"), value: stats.totalProducts,                       sub: "In inventory",    icon: Package,       color: "#007AFF", iconBg: "rgba(0,122,255,0.1)",    iconColor: "#007AFF" },
    { label: t("todays_sales"),   value: `₹${stats.todaysSales.toLocaleString()}`,  sub: "Today's revenue", icon: TrendingUp,    color: "#34C759", iconBg: "rgba(52,199,89,0.1)",     iconColor: "#34C759" },
    { label: t("low_stock"),      value: stats.lowStockItems,                        sub: "Need restock",    icon: AlertTriangle, color: "#FF9500", iconBg: "rgba(255,149,0,0.1)",     iconColor: "#FF9500" },
    { label: t("monthly_profit"), value: `₹${stats.monthlyProfit.toLocaleString()}`, sub: "This month",     icon: IndianRupee,   color: "#AF52DE", iconBg: "rgba(175,82,222,0.1)",    iconColor: "#AF52DE" },
  ]

  /* Quick actions — iOS App Library grid style */
  const actions = [
    { icon: Plus,         label: t("add_product_action"), path: "/admin/products",  color: "#34C759", bg: "rgba(52,199,89,0.12)" },
    { icon: ShoppingCart, label: t("create_bill"),         path: "/admin/billing",   color: "#007AFF", bg: "rgba(0,122,255,0.12)" },
    { icon: Package,      label: t("stock_entry"),         path: "/admin/purchases", color: "#FF9500", bg: "rgba(255,149,0,0.12)" },
    { icon: BarChart3,    label: t("reports"),             path: "/admin/reports",   color: "#AF52DE", bg: "rgba(175,82,222,0.12)" },
  ]

  return (
    <div className="space-y-5 hig-page-enter">

      {/*
        Large Title — iOS standard top section
        34pt bold, letterSpacing -0.025em
      */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", fontWeight: 400 }}>{dateStr}</p>
          <h1 className="ios-large-title" style={{ color: "hsl(var(--foreground))", marginTop: 2 }}>
            {greet()}, {user?.name?.split(" ")[0]} 👋
          </h1>
        </div>
        <button
          onClick={() => { setKey(k => k + 1); toast.success("Refreshed") }}
          style={{
            width: 34, height: 34, borderRadius: 9,
            background: "hsl(var(--card))",
            border: "0.5px solid rgba(60,60,67,0.18)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "hsl(var(--muted-foreground))",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            marginTop: 6, flexShrink: 0,
            transition: "opacity 0.12s, transform 0.12s"
          }}
          className="hover:opacity-70 active:scale-95"
        >
          <RefreshCw style={{ width: 15, height: 15 }} />
        </button>
      </div>

      {/*
        Quick Actions — App Library style grid
        44pt minimum touch target, rounded icon + label below
      */}
      <div>
        <div className="grid grid-cols-4 gap-2.5 hig-list">
          {actions.map((a, i) => (
            <button
              key={i}
              onClick={() => navigate(a.path)}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                padding: "12px 4px", borderRadius: 14,
                background: "hsl(var(--card))",
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                border: "0.5px solid rgba(60,60,67,0.1)",
                cursor: "pointer", transition: "transform 0.15s, opacity 0.15s",
                minHeight: 72,
              }}
              className="hover:opacity-90 active:scale-95"
            >
              <div style={{ width: 40, height: 40, borderRadius: 10, background: a.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <a.icon style={{ width: 20, height: 20, color: a.color }} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 500, color: "hsl(var(--foreground))", textAlign: "center", lineHeight: 1.3, letterSpacing: "-0.003em" }}>
                {a.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/*
        Stat Widgets — iOS widget style
        White cards on gray (#F2F2F7) grouped background.
      */}
      <div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 hig-list">
          {widgets.map((w, i) => <Widget key={i} {...w} />)}
        </div>
      </div>

      {/* Sales + Low Stock — Grouped Table View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Recent Sales */}
        <div>
          <SectionHeader
            title={t("recent_sales")}
            subtitle="Latest transactions"
            action="See All"
            onAction={() => navigate("/admin/reports")}
          />
          <div className="hig-grouped-section">
            {sales.length > 0 ? sales.map((s, i) => (
              <div key={s.id} className="hig-cell">
                {/* Avatar — iOS initials circle */}
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "hsl(var(--primary) / 0.1)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "hsl(var(--primary))", fontSize: 14, fontWeight: 600, flexShrink: 0
                }}>
                  {s.customerName?.charAt(0) || "C"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="hig-cell-title truncate">{s.customerName}</p>
                  <p className="hig-cell-subtitle">
                    {s.items} items · {new Date(s.saleDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#34C759" }}>₹{s.totalAmount.toLocaleString()}</p>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: "1px 7px", borderRadius: 99,
                    background: s.paymentStatus === "PAID" ? "rgba(52,199,89,0.12)" : "rgba(255,149,0,0.12)",
                    color: s.paymentStatus === "PAID" ? "#34C759" : "#FF9500",
                    display: "inline-block", marginTop: 2
                  }}>
                    {s.paymentStatus.toLowerCase()}
                  </span>
                </div>
              </div>
            )) : (
              <div style={{ padding: "40px 16px", textAlign: "center" }}>
                <ShoppingCart style={{ width: 36, height: 36, margin: "0 auto 8px", color: "hsl(var(--muted-foreground))", opacity: 0.25 }} />
                <p style={{ fontSize: 15, color: "hsl(var(--muted-foreground))" }}>No sales yet</p>
                <button onClick={() => navigate("/admin/billing")} style={{ fontSize: 14, color: "#007AFF", marginTop: 6 }}>
                  Create first bill →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock */}
        <div>
          <SectionHeader
            title={t("low_stock_alert")}
            subtitle="Items needing restock"
            action={lowStock.length > 0 ? `${lowStock.length} items` : undefined}
          />
          <div className="hig-grouped-section">
            {lowStock.length > 0 ? lowStock.map(p => (
              <div key={p.id} className="hig-cell">
                <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(255,149,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Package style={{ width: 18, height: 18, color: "#FF9500" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="hig-cell-title truncate">{p.name}</p>
                  <p className="hig-cell-subtitle">SKU: {p.sku}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <span style={{
                    fontSize: 12, fontWeight: 600, padding: "2px 8px", borderRadius: 99,
                    background: p.currentStock === 0 ? "rgba(255,59,48,0.1)" : "rgba(255,149,0,0.1)",
                    color: p.currentStock === 0 ? "#FF3B30" : "#FF9500",
                  }}>
                    {p.currentStock} units
                  </span>
                  <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>Alert: {p.lowStockAlert}</p>
                </div>
              </div>
            )) : (
              <div style={{ padding: "40px 16px", textAlign: "center" }}>
                <p style={{ fontSize: 15, fontWeight: 500, color: "#34C759" }}>All stock healthy ✓</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Charts — in cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Sales Trend — 2 cols */}
        <div className="lg:col-span-2">
          <SectionHeader title={t("sales_trend")} subtitle={`₹${trend.reduce((s, d) => s + d.sales, 0).toLocaleString()} · ${trend.reduce((s, d) => s + d.transactions, 0)} transactions`} />
          <div className="hig-card p-4">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={trend} barSize={20} barCategoryGap="40%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(60,60,67,0.1)" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", fontFamily: "Inter" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", fontFamily: "Inter" }} axisLine={false} tickLine={false} tickFormatter={v => `₹${v/1000}k`} width={48} />
                <Tooltip
                  formatter={(v: number) => [`₹${v.toLocaleString()}`, "Sales"]}
                  contentStyle={{ borderRadius: 12, border: "0.5px solid rgba(60,60,67,0.18)", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", background: "hsl(var(--card))", color: "hsl(var(--foreground))", fontSize: 13, fontFamily: "Inter" }}
                  cursor={{ fill: "rgba(60,60,67,0.05)", radius: 6 }}
                />
                {/* systemGreen fill */}
                <Bar dataKey="sales" fill="#34C759" radius={[5,5,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie — 1 col */}
        <div>
          <SectionHeader title={t("product_categories")} subtitle={`${catData.length} categories`} />
          <div className="hig-card p-4">
            {catData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={catData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={44} outerRadius={70} paddingAngle={3}>
                      {catData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: "0.5px solid rgba(60,60,67,0.18)", background: "hsl(var(--card))", color: "hsl(var(--foreground))", fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
                  {catData.map((c, i) => (
                    <div key={c.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: PIE_COLORS[i % PIE_COLORS.length], flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: "hsl(var(--foreground))", opacity: 0.8 }} className="truncate max-w-24">{c.name}</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "hsl(var(--muted-foreground))" }}>{c.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ padding: "40px 0", textAlign: "center" }}>
                <Package style={{ width: 32, height: 32, margin: "0 auto 8px", opacity: 0.2 }} />
                <button onClick={() => navigate("/admin/products")} style={{ fontSize: 14, color: "#007AFF" }}>Add products →</button>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  )
}
