import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useAuth } from "@/lib/auth"
import { toast } from "@/lib/toast"
import { Settings, LogOut, User as UserIcon, Bell, Search } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { useTranslation } from "react-i18next"
import { LanguageSwitcher } from "./LanguageSwitcher"

export function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { t } = useTranslation()
  const handleLogout = () => { logout(); toast.success("Signed out"); navigate("/admin/login") }
  const initial = user?.name?.charAt(0).toUpperCase() || "A"
  const segment = location.pathname.split("/").pop() || "dashboard"
  const pageTitle = t(segment) || segment.charAt(0).toUpperCase() + segment.slice(1)

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full page-bg">
        <AppSidebar />
        <SidebarInset className="flex flex-col min-w-0">

          {/* ── iOS Navigation Bar — glass-thin, 44px ── */}
          <header className="glass-thin sticky top-0 z-40"
            style={{height:44,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 16px",gap:8}}>

            {/* Left */}
            <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
              <SidebarTrigger style={{width:32,height:32,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:"hsl(var(--muted-foreground))"}} className="hover:bg-black/5 dark:hover:bg-white/8 transition-colors" />
              <div style={{width:"0.5px",height:16,background:"rgba(60,60,67,0.22)"}} className="hidden sm:block" />
              <div className="hig-search hidden md:flex flex-1 max-w-64">
                <Search style={{width:15,height:15,color:"hsl(var(--muted-foreground))",flexShrink:0}} />
                <input placeholder={`${t("search")}…`} />
              </div>
            </div>

            {/* Center — page title */}
            <p className="hidden sm:block absolute left-1/2 -translate-x-1/2 pointer-events-none"
               style={{fontSize:17,fontWeight:600,color:"hsl(var(--foreground))",letterSpacing:"-0.01em",whiteSpace:"nowrap"}}>
              {pageTitle}
            </p>

            {/* Right */}
            <div style={{display:"flex",alignItems:"center",gap:4,flex:1,justifyContent:"flex-end"}}>
              <LanguageSwitcher />
              <ThemeToggle />
              {/* Notification dot */}
              <button style={{width:32,height:32,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",color:"hsl(var(--muted-foreground))"}}
                className="hover:bg-black/5 dark:hover:bg-white/8 transition-colors">
                <Bell style={{width:18,height:18}} />
                <span style={{position:"absolute",top:7,right:7,width:7,height:7,borderRadius:"50%",background:"#FF3B30",border:"1.5px solid rgba(242,242,247,0.9)"}} />
              </button>
              {/* Avatar */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button style={{width:28,height:28,borderRadius:"50%",overflow:"hidden",border:"1.5px solid rgba(60,60,67,0.18)",marginLeft:2,outline:"none"}} className="hover:opacity-80 transition-opacity">
                    <Avatar style={{width:"100%",height:"100%"}}>
                      <AvatarFallback style={{background:"hsl(var(--primary)/.12)",color:"hsl(var(--primary))",fontSize:11,fontWeight:700}}>{initial}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8}
                  style={{width:220,borderRadius:16,border:"0.5px solid rgba(60,60,67,0.18)",boxShadow:"0 20px 60px rgba(0,0,0,0.15)",backdropFilter:"blur(20px)",background:"rgba(255,255,255,0.88)"}}
                  className="p-1.5 dark:[background:rgba(28,28,30,0.88)] dark:[border-color:rgba(84,84,88,0.55)]">
                  <DropdownMenuLabel style={{padding:"10px 12px",borderRadius:10}}>
                    <p style={{fontSize:14,fontWeight:600}}>{user?.name}</p>
                    <p style={{fontSize:12,color:"hsl(var(--muted-foreground))",marginTop:1}}>{user?.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator style={{background:"rgba(60,60,67,0.12)",margin:"4px 0"}} />
                  {[{l:"Settings",I:Settings,p:"/admin/settings"},{l:"Profile",I:UserIcon,p:"/admin/profile"}].map(({l,I,p}) => (
                    <DropdownMenuItem key={l} onClick={()=>navigate(p)}
                      style={{borderRadius:10,padding:"10px 12px",fontSize:14,gap:10,cursor:"pointer"}} className="hover:bg-black/5 dark:hover:bg-white/5">
                      <I style={{width:16,height:16,color:"hsl(var(--muted-foreground))"}} />{l}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator style={{background:"rgba(60,60,67,0.12)",margin:"4px 0"}} />
                  <DropdownMenuItem onClick={handleLogout}
                    style={{borderRadius:10,padding:"10px 12px",fontSize:14,gap:10,cursor:"pointer",color:"#FF3B30"}} className="focus:text-[#FF3B30]">
                    <LogOut style={{width:16,height:16}} />Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* ── Main page content — page-bg gradient ── */}
          <main className="flex-1 overflow-auto page-bg" style={{minHeight:0}}>
            {user?.business?.logo && (
              <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-0" aria-hidden>
                <img src={user.business.logo} alt="" style={{width:"25%",maxWidth:240,objectFit:"contain",filter:"grayscale(1)",opacity:.02}} />
              </div>
            )}
            <div className="relative z-10 p-4 md:p-5 hig-page-enter">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
