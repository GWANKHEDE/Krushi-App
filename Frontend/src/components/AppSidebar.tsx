import {
  LayoutDashboard, Package, ShoppingCart, FileText,
  BarChart3, Settings, LogOut, Sprout, BookOpen, ChevronRight
} from "lucide-react"
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarRail,
  SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarSeparator,
} from "@/components/ui/sidebar"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/auth"
import { toast } from "@/lib/toast"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

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
  const navigate  = useNavigate()
  const { user, logout } = useAuth()
  const { t }     = useTranslation()
  const initial   = user?.name?.charAt(0).toUpperCase() || "A"

  const handleLogout = () => {
    logout()
    toast.success("Signed out")
    navigate("/admin/login")
  }

  return (
    /* Use bg-sidebar from CSS vars — works in both light and dark */
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      {/* ── Brand header ── */}
      <SidebarHeader className="h-14 px-4 flex flex-row items-center gap-3 border-b border-sidebar-border">
        {/* App icon */}
        <div className="hig-app-icon flex items-center justify-center flex-shrink-0"
          style={{ width: 32, height: 32, background: "hsl(var(--primary))", boxShadow: "0 2px 8px hsl(var(--primary)/.30)" }}>
          <Sprout className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
          <p className="text-sm font-semibold text-sidebar-foreground truncate leading-tight">Krushi Kendra</p>
          <p className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5">
            {user?.business?.name || "Management"}
          </p>
        </div>
      </SidebarHeader>

      {/* ── Navigation ── */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-widest text-muted-foreground/60">
            {t("navigation")}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const active = location.pathname === item.url
                return (
                  <SidebarMenuItem key={item.key}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={t(item.key)}
                      className={cn(
                        "rounded-lg h-9 transition-colors",
                        active
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="font-medium text-sm">{t(item.key)}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* ── User footer ── */}
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Sign out"
              className="rounded-lg h-10 text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive group transition-colors"
            >
              <Avatar className="h-6 w-6 shrink-0">
                <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                  {initial}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0 text-left group-data-[collapsible=icon]:hidden">
                <p className="text-xs font-semibold truncate">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
              </div>
              <LogOut className="h-4 w-4 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
