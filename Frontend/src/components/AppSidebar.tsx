import { LayoutDashboard, Package, ShoppingCart, FileText, BarChart3, Settings, LogOut, Sprout, BookOpen, ChevronRight } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/auth"
import { toast } from '@/lib/toast'
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import { useSidebar } from "@/components/ui/sidebar"

const items = [
  { title: "dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "products",  url: "/admin/products",  icon: Package },
  { title: "billing",   url: "/admin/billing",   icon: ShoppingCart },
  { title: "khatabook", url: "/admin/khatabook", icon: BookOpen },
  { title: "purchase",  url: "/admin/purchases", icon: FileText },
  { title: "reports",   url: "/admin/reports",   icon: BarChart3 },
  { title: "settings",  url: "/admin/settings",  icon: Settings },
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
    toast.success('Signed out')
    navigate('/admin/login')
  }

  const initial = user?.name?.charAt(0).toUpperCase() || 'A'

  return (
    <Sidebar collapsible="icon" className="border-r-0 bg-card shadow-[1px_0_0_0_hsl(var(--border)/0.5)]">
      {/* ── Header ── */}
      <SidebarHeader className="px-4 py-5">
        <div className={cn("flex items-center gap-3 overflow-hidden", collapsed && "justify-center")}>
          <div className="ios-icon ios-icon-md bg-primary text-primary-foreground shadow-[0_4px_12px_hsl(var(--primary)/0.35)] flex-shrink-0">
            <Sprout className="h-[18px] w-[18px]" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-[15px] font-bold text-foreground tracking-tight truncate leading-tight">Krushi Kendra</span>
              <span className="text-[11px] text-muted-foreground font-medium truncate leading-tight mt-0.5">
                {user?.business?.name || 'Management'}
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* ── Divider ── */}
      <div className="h-px mx-3 bg-border/50" />

      {/* ── Nav ── */}
      <SidebarContent className="px-2 py-3 overflow-y-auto hide-scrollbar">
        {!collapsed && (
          <p className="px-3 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/50">
            {t('navigation')}
          </p>
        )}
        <nav className="flex flex-col gap-0.5">
          {items.map((item) => {
            const isActive = location.pathname === item.url
            return (
              <Link
                key={item.title}
                to={item.url}
                title={collapsed ? t(item.title) : undefined}
                className={cn(
                  "ios-nav-item group relative",
                  collapsed && "justify-center px-2",
                  isActive && "active"
                )}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-primary" />
                )}
                <item.icon className={cn(
                  "h-[18px] w-[18px] flex-shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground/70"
                )} />
                {!collapsed && (
                  <span className="flex-1 text-[14px]">{t(item.title)}</span>
                )}
                {!collapsed && isActive && (
                  <ChevronRight className="h-3.5 w-3.5 text-primary/50" />
                )}
              </Link>
            )
          })}
        </nav>
      </SidebarContent>

      {/* ── Footer ── */}
      <SidebarFooter className="p-2 border-t border-border/40">
        <button
          onClick={handleLogout}
          title={collapsed ? 'Sign out' : undefined}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl",
            "hover:bg-destructive/8 group transition-colors text-left",
            collapsed && "justify-center px-2"
          )}
        >
          {/* Avatar */}
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold flex-shrink-0 ring-2 ring-primary/10">
            {initial}
          </div>
          {!collapsed && (
            <>
              <div className="flex flex-col min-w-0 flex-1">
                <span className="text-[13px] font-semibold text-foreground truncate leading-tight">{user?.name}</span>
                <span className="text-[11px] text-muted-foreground truncate leading-tight">{user?.email}</span>
              </div>
              <LogOut className="h-4 w-4 text-muted-foreground/40 group-hover:text-destructive transition-colors flex-shrink-0" />
            </>
          )}
        </button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
