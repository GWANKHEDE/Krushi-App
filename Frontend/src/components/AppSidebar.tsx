/*
  AppSidebar — Apple HIG Sidebar/Navigation pattern
  ────────────────────────────────────────────────────
  • systemGray6 (#F2F2F7) background
  • Selected item: solid tint color fill, white label
  • Row height: 32pt minimum
  • Sidebar section headers: 11pt uppercase, gray, letter-spaced
  • No decorative borders — separation comes from background contrast
  • App icon: rounded rect at top, 22.37% border-radius
*/

import { LayoutDashboard, Package, ShoppingCart, FileText, BarChart3, Settings, LogOut, Sprout, BookOpen, ChevronRight } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/auth"
import { toast } from '@/lib/toast'
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import { useSidebar } from "@/components/ui/sidebar"

const NAV_ITEMS = [
  { key: "dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { key: "products",  url: "/admin/products",  icon: Package },
  { key: "billing",   url: "/admin/billing",   icon: ShoppingCart },
  { key: "khatabook", url: "/admin/khatabook", icon: BookOpen },
  { key: "purchase",  url: "/admin/purchases", icon: FileText },
  { key: "reports",   url: "/admin/reports",   icon: BarChart3 },
  { key: "settings",  url: "/admin/settings",  icon: Settings },
]

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { t } = useTranslation()
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  const handleLogout = () => {
    logout()
    toast.success("Signed out")
    navigate("/admin/login")
  }

  const initial = user?.name?.charAt(0).toUpperCase() || "A"

  return (
    <Sidebar
      collapsible="icon"
      className="border-none"
      style={{ background: "hsl(var(--sidebar-background))" }}
    >
      {/* ── App Brand Header ── */}
      <SidebarHeader className="p-4 pb-3">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          {/* App icon — 22.37% rounding per HIG */}
          <div
            className="flex-shrink-0 flex items-center justify-center"
            style={{
              width: 36, height: 36,
              borderRadius: "22.37%",
              background: "hsl(var(--primary))",
              boxShadow: "0 2px 8px hsl(var(--primary)/.35)"
            }}
          >
            <Sprout className="text-white" style={{ width: 20, height: 20 }} />
          </div>

          {!collapsed && (
            <div className="min-w-0">
              <p style={{ fontSize: 15, fontWeight: 600, color: "hsl(var(--foreground))", lineHeight: 1.2, letterSpacing: "-0.01em" }}>
                Krushi Kendra
              </p>
              <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", lineHeight: 1.3 }}>
                {user?.business?.name || "Management"}
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* HIG separator — 0.5px */}
      <div style={{ height: "0.5px", background: "rgba(60,60,67,0.18)", margin: "0 12px" }} className="dark:[background:rgba(84,84,88,0.55)]" />

      {/* ── Navigation ── */}
      <SidebarContent className="px-2 py-2 overflow-y-auto hide-scrollbar">
        {/* Section header: 11pt, uppercase, letter-spaced */}
        {!collapsed && (
          <p className="hig-sidebar-section">{t("navigation")}</p>
        )}

        <nav className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const active = location.pathname === item.url
            return (
              <Link
                key={item.key}
                to={item.url}
                title={collapsed ? t(item.key) : undefined}
                className={cn(
                  "hig-sidebar-item",
                  active && "selected",
                  collapsed && "justify-center px-2"
                )}
              >
                <item.icon
                  className={cn("hig-sidebar-icon flex-shrink-0")}
                  style={{ width: 18, height: 18 }}
                />
                {!collapsed && (
                  <>
                    <span style={{ flex: 1, fontSize: 15, letterSpacing: "-0.005em" }}>
                      {t(item.key)}
                    </span>
                    {active && (
                      <ChevronRight style={{ width: 14, height: 14, opacity: 0.5 }} />
                    )}
                  </>
                )}
              </Link>
            )
          })}
        </nav>
      </SidebarContent>

      {/* ── User footer ── */}
      <SidebarFooter className="p-2">
        <div style={{ height: "0.5px", background: "rgba(60,60,67,0.18)", margin: "0 8px 8px" }} className="dark:[background:rgba(84,84,88,0.55)]" />
        <button
          onClick={handleLogout}
          title={collapsed ? "Sign out" : undefined}
          className={cn(
            "w-full hig-sidebar-item group",
            collapsed && "justify-center px-2"
          )}
          style={{ minHeight: 44 }}
        >
          {/* User avatar */}
          <div
            style={{
              width: 32, height: 32, borderRadius: "50%",
              background: "hsl(var(--primary) / 0.12)",
              color: "hsl(var(--primary))",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 600, flexShrink: 0,
              border: "1.5px solid hsl(var(--primary) / 0.2)"
            }}
          >
            {initial}
          </div>

          {!collapsed && (
            <>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 14, fontWeight: 500, color: "hsl(var(--foreground))", lineHeight: 1.2, letterSpacing: "-0.008em" }} className="truncate">
                  {user?.name}
                </p>
                <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", lineHeight: 1.3 }} className="truncate">
                  {user?.email}
                </p>
              </div>
              <LogOut
                style={{ width: 15, height: 15, flexShrink: 0, opacity: 0.4 }}
                className="group-hover:opacity-80 group-hover:text-red-500 transition-all"
              />
            </>
          )}
        </button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
