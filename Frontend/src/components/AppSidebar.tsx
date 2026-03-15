import { LayoutDashboard, Package, ShoppingCart, FileText, BarChart3, Settings, LogOut, Sprout, BookOpen, ChevronRight } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/auth"
import { toast } from "@/lib/toast"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import { useSidebar } from "@/components/ui/sidebar"

const NAV = [
  { key:"dashboard", url:"/admin/dashboard", icon:LayoutDashboard },
  { key:"products",  url:"/admin/products",  icon:Package },
  { key:"billing",   url:"/admin/billing",   icon:ShoppingCart },
  { key:"khatabook", url:"/admin/khatabook", icon:BookOpen },
  { key:"purchase",  url:"/admin/purchases", icon:FileText },
  { key:"reports",   url:"/admin/reports",   icon:BarChart3 },
  { key:"settings",  url:"/admin/settings",  icon:Settings },
]

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { t } = useTranslation()
  const { state } = useSidebar()
  const collapsed = state === "collapsed"
  const initial = user?.name?.charAt(0).toUpperCase() || "A"

  const handleLogout = () => {
    logout(); toast.success("Signed out"); navigate("/admin/login")
  }

  return (
    <Sidebar collapsible="icon" className="border-none glass-sidebar">
      {/* ── Brand header ── */}
      <SidebarHeader style={{ padding: collapsed ? "18px 8px" : "18px 14px" }}>
        <div className={cn("flex items-center gap-3 overflow-hidden", collapsed && "justify-center")}>
          {/* App icon — 22.37% HIG radius */}
          <div style={{
            width:38, height:38, borderRadius:"22.37%",
            background:"hsl(var(--primary))",
            display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
            boxShadow:"0 3px 10px hsl(var(--primary)/.35), inset 0 1px 0 rgba(255,255,255,0.25)"
          }}>
            <Sprout style={{width:20,height:20,color:"white"}} />
          </div>
          {!collapsed && (
            <div style={{minWidth:0}}>
              <p style={{fontSize:15,fontWeight:600,color:"hsl(var(--foreground))",letterSpacing:"-0.01em",lineHeight:1.2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>Krushi Kendra</p>
              <p style={{fontSize:11,color:"hsl(var(--muted-foreground))",marginTop:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user?.business?.name || "Management"}</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* 0.5px HIG separator */}
      <div style={{height:"0.5px",background:"rgba(60,60,67,0.14)",margin:`0 ${collapsed?6:12}px`}} className="dark:[background:rgba(84,84,88,0.40)]" />

      {/* ── Navigation ── */}
      <SidebarContent style={{padding: collapsed?"8px 4px":"8px 8px",overflowY:"auto"}} className="hide-scrollbar">
        {!collapsed && <p className="hig-sidebar-section">{t("navigation")}</p>}
        <nav style={{display:"flex",flexDirection:"column",gap:2}}>
          {NAV.map(item => {
            const active = location.pathname === item.url
            return (
              <Link key={item.key} to={item.url}
                title={collapsed ? t(item.key) : undefined}
                className={cn("hig-sidebar-item", active && "selected", collapsed && "justify-center")}
                style={collapsed ? {padding:"7px 6px"} : {}}
              >
                <item.icon style={{width:18,height:18,flexShrink:0,opacity: active ? 1 : 0.65}} />
                {!collapsed && (
                  <>
                    <span style={{flex:1}}>{t(item.key)}</span>
                    {active && <ChevronRight style={{width:14,height:14,opacity:0.5}}/>}
                  </>
                )}
              </Link>
            )
          })}
        </nav>
      </SidebarContent>

      {/* ── User footer ── */}
      <SidebarFooter style={{padding: collapsed?"8px 4px":"8px 8px"}}>
        <div style={{height:"0.5px",background:"rgba(60,60,67,0.14)",margin:`0 4px 8px`}} className="dark:[background:rgba(84,84,88,0.40)]" />
        <button onClick={handleLogout}
          className={cn("w-full hig-sidebar-item group", collapsed && "justify-center")}
          style={{minHeight:44, padding: collapsed?"8px 6px":"8px 10px"}}
        >
          {/* Avatar circle */}
          <div style={{
            width:32,height:32,borderRadius:"50%",flexShrink:0,
            background:"hsl(var(--primary)/.12)",
            border:"1.5px solid hsl(var(--primary)/.22)",
            display:"flex",alignItems:"center",justifyContent:"center",
            color:"hsl(var(--primary))",fontSize:13,fontWeight:700
          }}>{initial}</div>
          {!collapsed && (
            <>
              <div style={{flex:1,minWidth:0}}>
                <p style={{fontSize:14,fontWeight:500,color:"hsl(var(--foreground))",letterSpacing:"-0.008em",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user?.name}</p>
                <p style={{fontSize:11,color:"hsl(var(--muted-foreground))",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user?.email}</p>
              </div>
              <LogOut style={{width:15,height:15,opacity:.4,flexShrink:0}} className="group-hover:opacity-80 group-hover:text-red-500 transition-all" />
            </>
          )}
        </button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
