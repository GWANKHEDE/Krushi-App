import { LayoutDashboard, Package, ShoppingCart, FileText, BarChart3, Settings, LogOut, Sprout, BookOpen, ChevronRight } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/auth"
import { toast } from "@/lib/toast"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import { useSidebar } from "@/components/ui/sidebar"

const NAV = [
  { key: "dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { key: "products",  url: "/admin/products",  icon: Package },
  { key: "billing",   url: "/admin/billing",   icon: ShoppingCart },
  { key: "khatabook", url: "/admin/khatabook", icon: BookOpen },
  { key: "purchase",  url: "/admin/purchases", icon: FileText },
  { key: "reports",   url: "/admin/reports",   icon: BarChart3 },
  { key: "settings",  url: "/admin/settings",  icon: Settings },
]

export function AppSidebar() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const { user, logout } = useAuth()
  const { t }     = useTranslation()
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  const handleLogout = () => { logout(); toast.success("Signed out"); navigate("/admin/login") }
  const initial = user?.name?.charAt(0).toUpperCase() || "A"

  return (
    <Sidebar collapsible="icon" className="border-none glass-sidebar">
      {/* ── Brand ── */}
      <SidebarHeader className="p-4">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="icon-lg icon-app flex-shrink-0"
               style={{ background: "linear-gradient(145deg, #3ab26a 0%, #27854d 100%)", boxShadow: "0 4px 14px rgba(52,199,89,.35), inset 0 1px 0 rgba(255,255,255,.25)" }}>
            <Sprout style={{ width: 22, height: 22, color: "white" }} />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="t-headline truncate" style={{ color: "hsl(var(--foreground))" }}>Krushi Kendra</p>
              <p className="t-caption-1 truncate" style={{ color: "hsl(var(--muted-foreground))" }}>{user?.business?.name || "Management"}</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <div className="mx-3" style={{ height: "0.5px", background: "rgba(60,60,67,0.14)" }} />

      {/* ── Nav ── */}
      <SidebarContent className="px-2 py-2 overflow-y-auto hide-scrollbar">
        {!collapsed && <p className="nav-section">{t("navigation")}</p>}
        <nav className="flex flex-col gap-0.5">
          {NAV.map(item => {
            const active = location.pathname === item.url
            return (
              <Link key={item.key} to={item.url}
                title={collapsed ? t(item.key) : undefined}
                className={cn("nav-item", active && "active", collapsed && "justify-center px-2")}
              >
                <item.icon className="nav-icon flex-shrink-0" style={{ width: 18, height: 18, opacity: active ? 1 : 0.55 }} />
                {!collapsed && (
                  <>
                    <span style={{ flex: 1 }}>{t(item.key)}</span>
                    {active && <ChevronRight style={{ width: 13, height: 13, opacity: 0.5 }} />}
                  </>
                )}
              </Link>
            )
          })}
        </nav>
      </SidebarContent>

      {/* ── User footer ── */}
      <SidebarFooter className="p-2">
        <div className="mx-2 mb-2" style={{ height: "0.5px", background: "rgba(60,60,67,0.12)" }} />
        <button onClick={handleLogout} title={collapsed ? "Sign out" : undefined}
          className={cn("nav-item w-full group text-left", collapsed && "justify-center px-2")}
          style={{ minHeight: 48 }}>
          <div style={{ width: 34, height: 34, borderRadius: "50%", background: "hsl(var(--primary)/.12)", border: "1.5px solid hsl(var(--primary)/.20)", display: "flex", alignItems: "center", justifyContent: "center", color: "hsl(var(--primary))", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
            {initial}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 min-w-0 text-left">
                <p className="truncate t-subhead" style={{ color: "hsl(var(--foreground))", fontWeight: 500 }}>{user?.name}</p>
                <p className="truncate t-caption-1" style={{ color: "hsl(var(--muted-foreground))" }}>{user?.email}</p>
              </div>
              <LogOut style={{ width: 15, height: 15, opacity: 0.35, flexShrink: 0 }} className="group-hover:opacity-80 group-hover:text-red-500 transition-all" />
            </>
          )}
        </button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
