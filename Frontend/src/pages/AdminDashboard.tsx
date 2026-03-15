import { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/auth"
import { getDashboardStats, getSalesTrend, getLowStockProducts, getRecentSales, getCategories } from "@/lib/store"
import { toast } from "@/lib/toast"
import {
  Package, TrendingUp, AlertTriangle, ShoppingCart,
  BarChart3, Plus, IndianRupee, RefreshCw, ChevronRight
} from "lucide-react"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts"

const PIE = ["#34C759","#007AFF","#FF9500","#FF3B30","#AF52DE","#5AC8FA","#FFCC00"]

/* ─────────────────────────────────────────────────────────────────
   Liquid Glass Widget Card
   • Tinted glass via .glass-widget + color class
   • 3-px top accent gradient bar
   • Specular sheen from CSS ::before / ::after
   ───────────────────────────────────────────────────────────────── */
function Widget({ icon: Icon, label, value, sub, glassClass, iconBg, iconColor, accentTop }: any) {
  return (
    <div className={`glass-widget ${glassClass}`} style={{ padding: "18px 16px 14px" }}>
      {/* Top colour accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        borderRadius: "22px 22px 0 0",
        background: `linear-gradient(90deg, ${accentTop}dd 0%, ${accentTop}44 100%)`,
        zIndex: 2,
      }} />
      {/* Icon + chevron row */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: iconBg,
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          boxShadow: `0 3px 10px ${iconColor}30`,
        }}>
          <Icon style={{ width: 20, height: 20, color: iconColor }} />
        </div>
        <ChevronRight style={{ width: 14, height: 14, color: "hsl(var(--muted-foreground))", opacity: 0.38, marginTop: 4 }} />
      </div>
      {/* Value */}
      <p style={{ fontSize: 28, fontWeight: 700, color: "hsl(var(--foreground))", letterSpacing: "-0.028em", lineHeight: 1 }}>
        {value}
      </p>
      <p style={{ fontSize: 13, fontWeight: 500, color: "hsl(var(--foreground))", marginTop: 6, opacity: 0.72 }}>{label}</p>
      <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", marginTop: 2 }}>{sub}</p>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   Section header — title + optional See All link
   ───────────────────────────────────────────────────────────────── */
function Section({ title, sub, action, onAction }: any) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 8, padding: "0 2px" }}>
      <div>
        <p style={{ fontSize: 20, fontWeight: 700, color: "hsl(var(--foreground))", letterSpacing: "-0.015em", lineHeight: 1.2 }}>{title}</p>
        {sub && <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 1 }}>{sub}</p>}
      </div>
      {action && (
        <button onClick={onAction}
          style={{ fontSize: 14, color: "#007AFF", display: "flex", alignItems: "center", gap: 1, background: "none", border: "none", cursor: "pointer", padding: "0 2px" }}
          className="hover:opacity-70 transition-opacity dark:[color:#0A84FF]">
          {action}<ChevronRight style={{ width: 14, height: 14 }} />
        </button>
      )}
    </div>
  )
}

/* ═════════════════════════════════════════════════════════════════ */
export default function AdminDashboard() {
  const navigate  = useNavigate()
  const { user }  = useAuth()
  const { t }     = useTranslation()
  const [k, setK] = useState(0)

  const stats    = useMemo(() => getDashboardStats(),    [k])
  const trend    = useMemo(() => getSalesTrend(7),       [k])
  const lowStock = useMemo(() => getLowStockProducts(),  [k])
  const sales    = useMemo(() => getRecentSales(8),      [k])
  const catData  = useMemo(() =>
    getCategories()
      .map(c => ({ name: c.name, value: c._count?.products || 0 }))
      .filter(c => c.value > 0),
    [k]
  )

  const greet   = () => { const h = new Date().getHours(); return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening" }
  const dateStr = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })

  const widgets = [
    { label: t("total_products"), value: stats.totalProducts,                        sub: "In inventory",    icon: Package,       glassClass: "glass-blue",   iconBg: "rgba(0,122,255,0.12)",   iconColor: "#007AFF", accentTop: "#007AFF" },
    { label: t("todays_sales"),   value: `₹${stats.todaysSales.toLocaleString()}`,   sub: "Today's revenue", icon: TrendingUp,    glassClass: "glass-green",  iconBg: "rgba(52,199,89,0.12)",   iconColor: "#34C759", accentTop: "#34C759" },
    { label: t("low_stock"),      value: stats.lowStockItems,                         sub: "Need restock",    icon: AlertTriangle, glassClass: "glass-orange", iconBg: "rgba(255,149,0,0.12)",   iconColor: "#FF9500", accentTop: "#FF9500" },
    { label: t("monthly_profit"), value: `₹${stats.monthlyProfit.toLocaleString()}`, sub: "This month",      icon: IndianRupee,   glassClass: "glass-purple", iconBg: "rgba(175,82,222,0.12)",  iconColor: "#AF52DE", accentTop: "#AF52DE" },
  ]

  /* Quick actions — desktop only (mobile uses bottom tab bar) */
  const actions = [
    { icon: Plus,         label: t("add_product_action"), path: "/admin/products",  color: "#34C759", bg: "rgba(52,199,89,0.12)" },
    { icon: ShoppingCart, label: t("create_bill"),         path: "/admin/billing",   color: "#007AFF", bg: "rgba(0,122,255,0.12)" },
    { icon: Package,      label: t("stock_entry"),         path: "/admin/purchases", color: "#FF9500", bg: "rgba(255,149,0,0.12)" },
    { icon: BarChart3,    label: t("reports"),             path: "/admin/reports",   color: "#AF52DE", bg: "rgba(175,82,222,0.12)" },
  ]

  return (
    <div className="space-y-5 hig-page-enter">

      {/* ══════════════════════════════════════════════════════
          HEADER ROW
          • "Good morning, Name" on left
          • Refresh icon button immediately to the right of name
            (inline, not pushed to far right)
          • On mobile: compact, inline
          • On desktop: same layout, larger type
          ══════════════════════════════════════════════════════ */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        {/* Left: greeting + refresh side-by-side */}
        <div>
          <p style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", fontWeight: 400, lineHeight: 1 }}>{dateStr}</p>
          {/* Name + refresh icon on same baseline row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 3 }}>
            <h1 className="ios-large-title" style={{ color: "hsl(var(--foreground))", lineHeight: 1 }}>
              {greet()}, {user?.name?.split(" ")[0]} 👋
            </h1>
            {/* Refresh icon — right of greeting text, glass pill */}
            <button
              onClick={() => { setK(p => p + 1); toast.success("Refreshed") }}
              className="glass hig-pop"
              style={{
                width: 32, height: 32, borderRadius: 9, padding: 0, border: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "hsl(var(--muted-foreground))", cursor: "pointer", flexShrink: 0,
              }}
            >
              <RefreshCw style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          QUICK ACTIONS — Desktop only (md+)
          On mobile these live in the bottom tab bar
          ══════════════════════════════════════════════════════ */}
      <div className="hidden md:grid grid-cols-4 gap-3 hig-list">
        {actions.map((a, i) => (
          <button key={i} onClick={() => navigate(a.path)} className="glass-action"
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, padding: "14px 8px", minHeight: 80 }}>
            <div style={{
              width: 42, height: 42, borderRadius: 11,
              background: a.bg,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 3px 10px ${a.color}28`,
            }}>
              <a.icon style={{ width: 21, height: 21, color: a.color }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 500, color: "hsl(var(--foreground))", textAlign: "center", lineHeight: 1.3, opacity: 0.78 }}>
              {a.label}
            </span>
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════════════════════
          STAT WIDGETS — Liquid Glass grid
          2 cols on mobile, 4 on desktop
          ══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 hig-list">
        {widgets.map((w, i) => <Widget key={i} {...w} />)}
      </div>

      {/* ══════════════════════════════════════════════════════
          RECENT SALES + LOW STOCK — glass sections
          ══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Sales */}
        <div>
          <Section title={t("recent_sales")} sub="Latest transactions" action="See All" onAction={() => navigate("/admin/reports")} />
          <div className="hig-section">
            {sales.length > 0 ? sales.map(s => (
              <div key={s.id} className="hig-cell">
                <div style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "hsl(var(--primary)/.10)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "hsl(var(--primary))", fontSize: 14, fontWeight: 600, flexShrink: 0,
                }}>
                  {s.customerName?.charAt(0) || "C"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="hig-cell-title truncate">{s.customerName}</p>
                  <p className="hig-cell-subtitle">{s.items} items · {new Date(s.saleDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#34C759" }} className="dark:[color:#30D158]">
                    ₹{s.totalAmount.toLocaleString()}
                  </p>
                  <span className="hig-badge" style={{
                    background: s.paymentStatus === "PAID" ? "rgba(52,199,89,0.12)" : "rgba(255,149,0,0.12)",
                    color: s.paymentStatus === "PAID" ? "#34C759" : "#FF9500",
                    marginTop: 3, display: "block",
                  }}>
                    {s.paymentStatus.toLowerCase()}
                  </span>
                </div>
              </div>
            )) : (
              <div style={{ padding: "40px 16px", textAlign: "center" }}>
                <ShoppingCart style={{ width: 36, height: 36, margin: "0 auto 8px", opacity: .2 }} />
                <p style={{ fontSize: 15, color: "hsl(var(--muted-foreground))" }}>No sales yet</p>
                <button onClick={() => navigate("/admin/billing")} style={{ fontSize: 14, color: "#007AFF", marginTop: 6, background: "none", border: "none", cursor: "pointer" }}
                  className="dark:[color:#0A84FF]">
                  Create first bill →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock */}
        <div>
          <Section title={t("low_stock_alert")} sub="Items needing restock"
            action={lowStock.length > 0 ? `${lowStock.length} items` : undefined} />
          <div className="hig-section">
            {lowStock.length > 0 ? lowStock.map(p => (
              <div key={p.id} className="hig-cell">
                <div style={{ width: 36, height: 36, borderRadius: 9, background: "rgba(255,149,0,0.10)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Package style={{ width: 18, height: 18, color: "#FF9500" }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="hig-cell-title truncate">{p.name}</p>
                  <p className="hig-cell-subtitle">SKU: {p.sku}</p>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <span className="hig-badge" style={{
                    background: p.currentStock === 0 ? "rgba(255,59,48,.1)" : "rgba(255,149,0,.1)",
                    color: p.currentStock === 0 ? "#FF3B30" : "#FF9500",
                  }}>
                    {p.currentStock} units
                  </span>
                  <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", marginTop: 3 }}>Alert: {p.lowStockAlert}</p>
                </div>
              </div>
            )) : (
              <div style={{ padding: "40px 16px", textAlign: "center" }}>
                <p style={{ fontSize: 15, fontWeight: 500, color: "#34C759" }} className="dark:[color:#30D158]">All stock healthy ✓</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          CHARTS — glass cards
          ══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Bar chart — 2/3 */}
        <div className="lg:col-span-2">
          <Section
            title={t("sales_trend")}
            sub={`₹${trend.reduce((s, d) => s + d.sales, 0).toLocaleString()} · ${trend.reduce((s, d) => s + d.transactions, 0)} transactions`}
          />
          <div className="glass" style={{ padding: "20px 16px 16px", borderRadius: 20 }}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={trend} barSize={20} barCategoryGap="38%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(60,60,67,0.10)" vertical={false} />
                <XAxis dataKey="date"
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", fontFamily: "Inter" }}
                  axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))", fontFamily: "Inter" }}
                  axisLine={false} tickLine={false}
                  tickFormatter={v => `₹${v / 1000}k`} width={46} />
                <Tooltip
                  formatter={(v: number) => [`₹${v.toLocaleString()}`, "Sales"]}
                  contentStyle={{
                    borderRadius: 14,
                    border: "0.5px solid rgba(60,60,67,0.18)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.12)",
                    background: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(20px)",
                    color: "hsl(var(--foreground))",
                    fontSize: 13, fontFamily: "Inter",
                  }}
                  cursor={{ fill: "rgba(52,199,89,0.06)", radius: 6 }}
                />
                <Bar dataKey="sales" fill="#34C759" radius={[6, 6, 0, 0]}>
                  {trend.map((_, i) => (
                    <Cell key={i} fill={i === trend.length - 1 ? "#007AFF" : "#34C759"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie chart — 1/3 */}
        <div>
          <Section title={t("product_categories")} sub={`${catData.length} categories`} />
          <div className="glass" style={{ padding: "20px 16px", borderRadius: 20 }}>
            {catData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={catData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                      innerRadius={44} outerRadius={68} paddingAngle={3} strokeWidth={0}>
                      {catData.map((_, i) => <Cell key={i} fill={PIE[i % PIE.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{
                      borderRadius: 12, border: "0.5px solid rgba(60,60,67,0.18)",
                      background: "rgba(255,255,255,0.92)", backdropFilter: "blur(16px)",
                      color: "hsl(var(--foreground))", fontSize: 12,
                    }} />
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6 }}>
                  {catData.map((c, i) => (
                    <div key={c.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: PIE[i % PIE.length], flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: "hsl(var(--foreground))", opacity: .8 }} className="truncate max-w-24">{c.name}</span>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "hsl(var(--muted-foreground))" }}>{c.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ padding: "40px 0", textAlign: "center" }}>
                <Package style={{ width: 32, height: 32, margin: "0 auto 8px", opacity: .2 }} />
                <button onClick={() => navigate("/admin/products")}
                  style={{ fontSize: 14, color: "#007AFF", background: "none", border: "none", cursor: "pointer" }}
                  className="dark:[color:#0A84FF]">
                  Add products →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom padding so last card clears the mobile tab bar */}
      <div className="md:hidden" style={{ height: 8 }} />
    </div>
  )
}
