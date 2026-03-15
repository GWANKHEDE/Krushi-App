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
      <div className="flex min-h-screen w-full" style={{ background: "hsl(var(--background))" }}>
        <AppSidebar />
        <SidebarInset className="flex flex-col min-w-0">

          {/* ── iOS-style glass nav bar — 44px ── */}
          <header className="glass-navbar sticky top-0 z-40"
            style={{ height: 44, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 16px", gap: 8 }}>

            {/* Left */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
              <SidebarTrigger style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "hsl(var(--muted-foreground))" }}
                className="hover:bg-black/5 dark:hover:bg-white/8 transition-colors" />
              <div className="hidden md:flex search-bar flex-1 max-w-72">
                <Search style={{ width: 14, height: 14, color: "hsl(var(--muted-foreground))", flexShrink: 0 }} />
                <input placeholder={`${t("search")}…`} />
              </div>
            </div>

            {/* Center — page title */}
            <p className="t-headline absolute left-1/2 -translate-x-1/2 hidden sm:block"
               style={{ color: "hsl(var(--foreground))", letterSpacing: "-0.01em", pointerEvents: "none" }}>
              {pageTitle}
            </p>

            {/* Right */}
            <div style={{ display: "flex", alignItems: "center", gap: 4, flex: 1, justifyContent: "flex-end" }}>
              <LanguageSwitcher />
              <ThemeToggle />
              <button style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", color: "hsl(var(--muted-foreground))" }}
                className="hover:bg-black/5 dark:hover:bg-white/8 transition-colors">
                <Bell style={{ width: 17, height: 17 }} />
                <span style={{ position: "absolute", top: 8, right: 7, width: 7, height: 7, borderRadius: "50%", background: "#FF3B30", border: "1.5px solid rgba(242,242,247,.9)" }} />
              </button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button style={{ width: 28, height: 28, borderRadius: "50%", overflow: "hidden", marginLeft: 4, border: "1.5px solid rgba(60,60,67,.15)", outline: "none" }}
                    className="hover:opacity-80 transition-opacity">
                    <Avatar style={{ width: "100%", height: "100%" }}>
                      <AvatarFallback style={{ background: "hsl(var(--primary)/.12)", color: "hsl(var(--primary))", fontSize: 11, fontWeight: 700 }}>{initial}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={10}
                  className="glass"
                  style={{ width: 220, borderRadius: 16, border: "1px solid var(--glass-border)", boxShadow: "var(--glass-shadow-lg)", padding: 6 }}>
                  <DropdownMenuLabel style={{ padding: "8px 10px 10px", borderRadius: 10 }}>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{user?.name}</p>
                    <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 1 }}>{user?.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator style={{ background: "rgba(60,60,67,.1)", margin: "4px 0" }} />
                  {[{ l: "Settings", I: Settings, p: "/admin/settings" }, { l: "Profile", I: UserIcon, p: "/admin/profile" }].map(({ l, I, p }) => (
                    <DropdownMenuItem key={l} onClick={() => navigate(p)}
                      style={{ borderRadius: 10, padding: "10px 10px", fontSize: 14, gap: 10, cursor: "pointer" }}>
                      <I style={{ width: 15, height: 15, color: "hsl(var(--muted-foreground))" }} />{l}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator style={{ background: "rgba(60,60,67,.1)", margin: "4px 0" }} />
                  <DropdownMenuItem onClick={handleLogout} style={{ borderRadius: 10, padding: "10px 10px", fontSize: 14, gap: 10, cursor: "pointer", color: "#FF3B30" }} className="focus:text-[#FF3B30]">
                    <LogOut style={{ width: 15, height: 15 }} /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* ── Content ── */}
          <main className="flex-1 overflow-auto page-in" style={{ background: "hsl(var(--background))" }}>
            {user?.business?.logo && (
              <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-0" aria-hidden>
                <img src={user.business.logo} alt="" style={{ width: "28%", maxWidth: 260, objectFit: "contain", filter: "grayscale(1)", opacity: 0.02 }} />
              </div>
            )}
            <div className="relative z-10 p-4 md:p-5"><Outlet /></div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
