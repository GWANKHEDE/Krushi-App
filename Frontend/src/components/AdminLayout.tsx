/*
  AdminLayout — Apple HIG Navigation Bar pattern
  ────────────────────────────────────────────────
  • 44pt navbar height (HIG compact)
  • systemBackground + translucency blur (20px, saturate 180%)
  • 0.5px separator (rgba 60,60,67,0.29)
  • Title: 17pt semibold centered or leading
  • Back/action buttons: systemBlue tintColor
  • No heavy borders — separation via material/blur
*/
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useAuth } from "@/lib/auth"
import { toast } from "@/lib/toast"
import { Settings, LogOut, User as UserIcon, Bell, Search } from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { useTranslation } from "react-i18next"
import { LanguageSwitcher } from "./LanguageSwitcher"

export function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { t } = useTranslation()

  const handleLogout = () => {
    logout()
    toast.success("Signed out")
    navigate("/admin/login")
  }

  const initial = user?.name?.charAt(0).toUpperCase() || "A"
  const segment = location.pathname.split("/").pop() || "dashboard"
  const pageTitle = t(segment) || segment.charAt(0).toUpperCase() + segment.slice(1)

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full" style={{ background: "hsl(var(--background))" }}>
        <AppSidebar />
        <SidebarInset className="flex flex-col min-w-0">

          {/*
            iOS Navigation Bar
            ─────────────────
            44px height, frosted glass material (92-96% opacity + blur),
            0.5px bottom separator (not 1px — Apple uses 0.5px on Retina).
          */}
          <header
            style={{
              height: 44,
              position: "sticky", top: 0, zIndex: 40,
              background: "rgba(242,242,247,0.92)",
              backdropFilter: "saturate(180%) blur(20px)",
              WebkitBackdropFilter: "saturate(180%) blur(20px)",
              borderBottom: "0.5px solid rgba(60,60,67,0.29)",
              display: "flex", alignItems: "center",
              justifyContent: "space-between", gap: 8,
              padding: "0 16px",
            }}
            className="dark:[background:rgba(0,0,0,0.85)] dark:[border-bottom:0.5px_solid_rgba(84,84,88,0.65)]"
          >
            {/* Left: sidebar trigger */}
            <div className="flex items-center gap-2" style={{ flex: 1 }}>
              <SidebarTrigger
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "hsl(var(--muted-foreground))",
                  transition: "background 0.12s"
                }}
                className="hover:bg-black/5 dark:hover:bg-white/8"
              />
              {/* Desktop search — iOS-style pill */}
              <div className="hidden md:flex hig-search flex-1 max-w-64">
                <Search style={{ width: 15, height: 15, color: "hsl(var(--muted-foreground))", flexShrink: 0 }} />
                <input placeholder={`${t("search")}…`} />
              </div>
            </div>

            {/* Center: page title (iOS convention) */}
            <p
              className="hidden sm:block absolute left-1/2 -translate-x-1/2"
              style={{ fontSize: 17, fontWeight: 600, color: "hsl(var(--foreground))", letterSpacing: "-0.01em" }}
            >
              {pageTitle}
            </p>

            {/* Right: action icons */}
            <div className="flex items-center gap-1" style={{ flex: 1, justifyContent: "flex-end" }}>
              <LanguageSwitcher />
              <ThemeToggle />

              {/* Notification — iOS red dot, no count badge (cleaner) */}
              <button
                style={{
                  width: 32, height: 32, borderRadius: 8,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "relative", color: "hsl(var(--muted-foreground))"
                }}
                className="hover:bg-black/5 dark:hover:bg-white/8 transition-colors"
              >
                <Bell style={{ width: 18, height: 18 }} />
                {/* iOS notification badge — small red dot */}
                <span style={{
                  position: "absolute", top: 7, right: 7,
                  width: 7, height: 7, borderRadius: "50%",
                  background: "#FF3B30",
                  border: "1.5px solid rgba(242,242,247,0.92)"
                }} />
              </button>

              {/* User avatar */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    style={{
                      width: 28, height: 28, borderRadius: "50%",
                      overflow: "hidden", marginLeft: 2,
                      outline: "none",
                      border: "1.5px solid rgba(60,60,67,0.18)"
                    }}
                    className="hover:opacity-80 transition-opacity"
                  >
                    <Avatar style={{ width: "100%", height: "100%" }}>
                      <AvatarFallback
                        style={{
                          background: "hsl(var(--primary) / 0.12)",
                          color: "hsl(var(--primary))",
                          fontSize: 11, fontWeight: 700
                        }}
                      >
                        {initial}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end" sideOffset={8}
                  style={{ width: 220, borderRadius: 14, border: "0.5px solid rgba(60,60,67,0.18)", boxShadow: "0 8px 32px rgba(0,0,0,0.14)" }}
                  className="p-1.5"
                >
                  <DropdownMenuLabel className="px-3 py-2.5" style={{ borderRadius: 10 }}>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{user?.name}</p>
                    <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", marginTop: 1 }}>{user?.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator style={{ background: "rgba(60,60,67,0.12)", margin: "4px 0" }} />
                  {[
                    { label: "Settings", icon: Settings, path: "/admin/settings" },
                    { label: "Profile", icon: UserIcon, path: "/admin/profile" },
                  ].map(({ label, icon: Icon, path }) => (
                    <DropdownMenuItem
                      key={label}
                      style={{ borderRadius: 10, padding: "10px 12px", fontSize: 14, gap: 10, cursor: "pointer" }}
                      onClick={() => navigate(path)}
                    >
                      <Icon style={{ width: 16, height: 16, color: "hsl(var(--muted-foreground))" }} />
                      {label}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator style={{ background: "rgba(60,60,67,0.12)", margin: "4px 0" }} />
                  <DropdownMenuItem
                    style={{ borderRadius: 10, padding: "10px 12px", fontSize: 14, gap: 10, cursor: "pointer", color: "#FF3B30" }}
                    className="focus:text-[#FF3B30]"
                    onClick={handleLogout}
                  >
                    <LogOut style={{ width: 16, height: 16 }} />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main content — systemGroupedBackground */}
          <main className="flex-1 overflow-auto" style={{ background: "hsl(var(--background))" }}>
            {user?.business?.logo && (
              <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-0" aria-hidden>
                <img src={user.business.logo} alt="" style={{ width: "28%", maxWidth: 280, objectFit: "contain", filter: "grayscale(1)", opacity: 0.025 }} />
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
