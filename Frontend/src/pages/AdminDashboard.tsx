import { useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/auth"
import { getDashboardStats, getSalesTrend, getLowStockProducts, getRecentSales, getCategories } from "@/lib/store"
import { toast } from "@/lib/toast"
import { Package, TrendingUp, AlertTriangle, ShoppingCart, BarChart3, Plus, IndianRupee, RefreshCw, ChevronRight, ArrowUpRight } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts"

const PIE_COLORS = ["#34C759","#007AFF","#FF9500","#FF3B30","#AF52DE","#5AC8FA"]

/* ── Glass Widget (iOS Control Centre card) ── */
function GlassWidget({ tint, icon: Icon, iconColor, label, value, sub, trend }:
  { tint: string; icon: any; iconColor: string; label: string; value: string|number; sub: string; trend?: number }) {
  return (
    <div className={`glass-widget ${tint} relative`} style={{ padding: "18px 16px 14px" }}>
      {/* Content sits above the specular ::before layer */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
          <div className="icon-md" style={{ background: `${iconColor}22`, backdropFilter: "blur(8px)" }}>
            <Icon style={{ width: 20, height: 20, color: iconColor }} />
          </div>
          {trend !== undefined && (
            <div style={{ display: "flex", alignItems: "center", gap: 3, background: trend >= 0 ? "rgba(52,199,89,.18)" : "rgba(255,59,48,.15)", borderRadius: 999, padding: "2px 7px" }}>
              <ArrowUpRight style={{ width: 11, height: 11, color: trend >= 0 ? "#34C759" : "#FF3B30", transform: trend < 0 ? "scaleY(-1)" : "none" }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: trend >= 0 ? "#1d8639" : "#cc1f1a" }}>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        <p style={{ fontSize: 30, fontWeight: 700, color: "hsl(var(--foreground))", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 5 }}>{value}</p>
        <p style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--foreground))", opacity: 0.75, marginBottom: 2 }}>{label}</p>
        <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>{sub}</p>
      </div>
    </div>
  )
}

/* ── Quick Action tile ── */
function ActionTile({ icon: Icon, label, color, bg, onClick }: { icon: any; label: string; color: string; bg: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="glass scale-in"
      style={{ padding: "16px 10px 12px", borderRadius: 18, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer", border: "1px solid var(--glass-border)" }}
    >
      <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: bg, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 12px ${color}30` }}>
          <Icon style={{ width: 22, height: 22, color: color }} />
        </div>
        <span style={{ fontSize: 11, fontWeight: 500, color: "hsl(var(--foreground))", textAlign: "center", lineHeight: 1.25, letterSpacing: "-0.003em" }}>{label}</span>
      </div>
    </button>
  )
}

/* ── Section header ── */
function SectionHead({ title, sub, action, onAction }: { title: string; sub?: string; action?: string; onAction?: () => void }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 10 }}>
      <div>
        <p className="t-title-3" style={{ color: "hsl(var(--foreground))" }}>{title}</p>
        {sub && <p className="t-caption-1" style={{ color: "hsl(var(--muted-foreground))", marginTop: 1 }}>{sub}</p>}
      </div>
      {action && (
        <button onClick={onAction} style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 14, color: "var(--sys-blue)", fontWeight: 400 }}
          className="hover:opacity-70 transition-opacity">
          {action}<ChevronRight style={{ width: 14, height: 14 }} />
        </button>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user }  = useAuth()
  const { t }     = useTranslation()
  const [key, setKey] = useState(0)

  const stats    = useMemo(() => getDashboardStats(), [key])
  const trend    = useMemo(() => getSalesTrend(7),    [key])
  const lowStock = useMemo(() => getLowStockProducts(), [key])
  const sales    = useMemo(() => getRecentSales(8),   [key])
  const catData  = useMemo(() =>
    getCategories().map(c => ({ name: c.name, value: c._count?.products||0 })).filter(c=>c.value>0), [key])

  const greet = () => { const h = new Date().getHours(); return h<12?"Good morning":h<17?"Good afternoon":"Good evening" }
  const dateStr = new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long" })

  const widgets = [
    { tint:"glass-blue",   icon:Package,       iconColor:"#007AFF", label:t("total_products"), value:stats.totalProducts,                       sub:"In inventory",    trend:5  },
    { tint:"glass-green",  icon:TrendingUp,     iconColor:"#34C759", label:t("todays_sales"),   value:`₹${stats.todaysSales.toLocaleString()}`,  sub:"Today's revenue", trend:12 },
    { tint:"glass-orange", icon:AlertTriangle,  iconColor:"#FF9500", label:t("low_stock"),      value:stats.lowStockItems,                        sub:"Need restock",    trend:-3 },
    { tint:"glass-purple", icon:IndianRupee,    iconColor:"#AF52DE", label:t("monthly_profit"), value:`₹${stats.monthlyProfit.toLocaleString()}`, sub:"This month",      trend:8  },
  ]

  const actions = [
    { icon:Plus,         label:t("add_product_action"), color:"#34C759", bg:"rgba(52,199,89,.15)",   path:"/admin/products"  },
    { icon:ShoppingCart, label:t("create_bill"),         color:"#007AFF", bg:"rgba(0,122,255,.15)",  path:"/admin/billing"   },
    { icon:Package,      label:t("stock_entry"),         color:"#FF9500", bg:"rgba(255,149,0,.15)",  path:"/admin/purchases" },
    { icon:BarChart3,    label:t("reports"),             color:"#AF52DE", bg:"rgba(175,82,222,.15)", path:"/admin/reports"   },
  ]

  return (
    <div className="space-y-6 page-in">

      {/* ── Large title header ── */}
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:12 }}>
        <div>
          <p className="t-footnote" style={{ color:"hsl(var(--muted-foreground))" }}>{dateStr}</p>
          <h1 className="t-large-title" style={{ color:"hsl(var(--foreground))", marginTop:2 }}>
            {greet()}, {user?.name?.split(" ")[0]} 👋
          </h1>
        </div>
        <button onClick={() => { setKey(k=>k+1); toast.success("Refreshed") }} className="glass scale-in"
          style={{ width:36, height:36, borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", color:"hsl(var(--muted-foreground))", flexShrink:0, marginTop:6 }}>
          <RefreshCw style={{ width:15, height:15 }} />
        </button>
      </div>

      {/* ── Quick Actions ── */}
      <div>
        <div className="grid grid-cols-4 gap-3 list-stagger">
          {actions.map((a,i) => <ActionTile key={i} {...a} onClick={() => navigate(a.path)} />)}
        </div>
      </div>

      {/* ── Glass Widgets ── */}
      <div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 list-stagger">
          {widgets.map((w,i) => <GlassWidget key={i} {...w} />)}
        </div>
      </div>

      {/* ── Sales + Low Stock ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Sales */}
        <div>
          <SectionHead title={t("recent_sales")} sub="Latest transactions" action="See All" onAction={() => navigate("/admin/reports")} />
          <div className="glass" style={{ borderRadius:20, overflow:"hidden" }}>
            {sales.length > 0 ? sales.map((s,i) => (
              <div key={s.id} className="list-row" style={{ position:"relative", zIndex:2 }}>
                <div style={{ width:38,height:38,borderRadius:"50%",background:"hsl(var(--primary)/.10)",display:"flex",alignItems:"center",justifyContent:"center",color:"hsl(var(--primary))",fontSize:14,fontWeight:700,flexShrink:0 }}>
                  {s.customerName?.charAt(0)||"C"}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p className="t-callout truncate" style={{ fontWeight:500, color:"hsl(var(--foreground))" }}>{s.customerName}</p>
                  <p className="t-caption-1" style={{ color:"hsl(var(--muted-foreground))" }}>{s.items} items · {new Date(s.saleDate).toLocaleDateString("en-IN",{day:"numeric",month:"short"})}</p>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <p style={{ fontSize:14,fontWeight:600,color:"#34C759" }}>₹{s.totalAmount.toLocaleString()}</p>
                  <span className={`pill ${s.paymentStatus==="PAID"?"pill-green":"pill-amber"}`} style={{ marginTop:2, display:"inline-flex" }}>
                    {s.paymentStatus.toLowerCase()}
                  </span>
                </div>
              </div>
            )) : (
              <div style={{ padding:"40px 20px",textAlign:"center",position:"relative",zIndex:2 }}>
                <ShoppingCart style={{ width:36,height:36,margin:"0 auto 8px",opacity:.2 }} />
                <p className="t-callout" style={{ color:"hsl(var(--muted-foreground))" }}>No sales yet</p>
                <button onClick={() => navigate("/admin/billing")} style={{ fontSize:14,color:"var(--sys-blue)",marginTop:6,display:"block",margin:"8px auto 0" }}>Create first bill →</button>
              </div>
            )}
          </div>
        </div>

        {/* Low Stock */}
        <div>
          <SectionHead title={t("low_stock_alert")} sub="Items needing restock"
            action={lowStock.length > 0 ? `${lowStock.length} items` : undefined} />
          <div className="glass" style={{ borderRadius:20, overflow:"hidden" }}>
            {lowStock.length > 0 ? lowStock.map(p => (
              <div key={p.id} className="list-row" style={{ position:"relative",zIndex:2 }}>
                <div className="icon-sm" style={{ background:"rgba(255,149,0,.14)", borderRadius:9, flexShrink:0 }}>
                  <Package style={{ width:16,height:16,color:"#FF9500" }} />
                </div>
                <div style={{ flex:1,minWidth:0 }}>
                  <p className="t-callout truncate" style={{ fontWeight:500,color:"hsl(var(--foreground))" }}>{p.name}</p>
                  <p className="t-caption-1" style={{ color:"hsl(var(--muted-foreground))" }}>SKU: {p.sku}</p>
                </div>
                <div style={{ textAlign:"right",flexShrink:0 }}>
                  <span className={`pill ${p.currentStock===0?"pill-red":"pill-amber"}`}>{p.currentStock} units</span>
                  <p className="t-caption-2" style={{ color:"hsl(var(--muted-foreground))",marginTop:2 }}>Alert: {p.lowStockAlert}</p>
                </div>
              </div>
            )) : (
              <div style={{ padding:"40px 20px",textAlign:"center",position:"relative",zIndex:2 }}>
                <p className="t-callout" style={{ color:"#34C759",fontWeight:500 }}>All stock levels healthy ✓</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Charts ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Sales Trend */}
        <div className="lg:col-span-2">
          <SectionHead title={t("sales_trend")}
            sub={`₹${trend.reduce((s,d)=>s+d.sales,0).toLocaleString()} · ${trend.reduce((s,d)=>s+d.transactions,0)} transactions`} />
          <div className="glass" style={{ borderRadius:20, padding:"16px 12px 12px" }}>
            <div style={{ position:"relative",zIndex:2 }}>
              <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={trend} barSize={18} margin={{ top:4, right:4, left:0, bottom:0 }}>
                  <defs>
                    <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#34C759" stopOpacity={0.30} />
                      <stop offset="100%" stopColor="#34C759" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(60,60,67,.10)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize:11, fill:"hsl(var(--muted-foreground))", fontFamily:"Inter" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize:11, fill:"hsl(var(--muted-foreground))", fontFamily:"Inter" }} axisLine={false} tickLine={false} tickFormatter={v=>`₹${v/1000}k`} width={46} />
                  <Tooltip formatter={(v:number)=>[`₹${v.toLocaleString()}`,"Sales"]}
                    contentStyle={{ borderRadius:14, border:"1px solid var(--glass-border)", boxShadow:"var(--glass-shadow)", background:"var(--glass-bg)", backdropFilter:"var(--glass-blur)", WebkitBackdropFilter:"var(--glass-blur)", color:"hsl(var(--foreground))", fontSize:13 }}
                    cursor={{ stroke:"rgba(52,199,89,.35)", strokeWidth:1 }} />
                  <Area type="monotone" dataKey="sales" stroke="#34C759" strokeWidth={2.5} fill="url(#salesGrad)" dot={false} activeDot={{ r:5, fill:"#34C759", strokeWidth:2, stroke:"white" }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Category Pie */}
        <div>
          <SectionHead title={t("product_categories")} sub={`${catData.length} categories`} />
          <div className="glass" style={{ borderRadius:20, padding:"16px 14px" }}>
            <div style={{ position:"relative",zIndex:2 }}>
              {catData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={catData} dataKey="value" cx="50%" cy="50%" innerRadius={44} outerRadius={68} paddingAngle={3} stroke="none">
                        {catData.map((_,i) => <Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius:12, border:"1px solid var(--glass-border)", background:"var(--glass-bg)", backdropFilter:"var(--glass-blur)", WebkitBackdropFilter:"var(--glass-blur)", color:"hsl(var(--foreground))", fontSize:12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display:"flex",flexDirection:"column",gap:7,marginTop:6 }}>
                    {catData.map((c,i) => (
                      <div key={c.name} style={{ display:"flex",alignItems:"center",justifyContent:"space-between" }}>
                        <div style={{ display:"flex",alignItems:"center",gap:7 }}>
                          <div style={{ width:8,height:8,borderRadius:"50%",background:PIE_COLORS[i%PIE_COLORS.length],flexShrink:0 }} />
                          <span className="t-caption-1 truncate max-w-[100px]" style={{ color:"hsl(var(--foreground))",opacity:.8 }}>{c.name}</span>
                        </div>
                        <span className="t-caption-1" style={{ fontWeight:600,color:"hsl(var(--muted-foreground))" }}>{c.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ padding:"40px 0",textAlign:"center" }}>
                  <Package style={{ width:32,height:32,margin:"0 auto 8px",opacity:.2 }} />
                  <button onClick={() => navigate("/admin/products")} style={{ fontSize:14,color:"var(--sys-blue)" }}>Add products →</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
