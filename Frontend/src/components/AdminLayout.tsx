import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useAuth } from "@/lib/auth"
import { toast } from "@/lib/toast"
import { Settings, LogOut, User as UserIcon, Bell, Search, X } from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "./AppSidebar"
import { useTranslation } from "react-i18next"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { MobileTabBar } from "./MobileTabBar"
import { useSearch } from "@/lib/SearchContext"
import { useEffect, useRef } from "react"

/* Page-specific search placeholder labels */
const PAGE_PLACEHOLDERS: Record<string, string> = {
  "/admin/dashboard":  "Search products, sales, customers…",
  "/admin/products":   "Search products or SKU…",
  "/admin/billing":    "Search products in billing…",
  "/admin/khatabook":  "Search customers…",
  "/admin/purchases":  "Search purchases…",
  "/admin/reports":    "Search transactions…",
  "/admin/settings":   "Search settings…",
}

export function AdminLayout() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const { user, logout } = useAuth()
  const { t }     = useTranslation()
  const { query, setQuery, clearQuery } = useSearch()
  const inputRef  = useRef<HTMLInputElement>(null)

  const handleLogout = () => { logout(); toast.success("Signed out"); navigate("/admin/login") }
  const initial = user?.name?.charAt(0).toUpperCase() || "A"

  /* Clear search whenever the route changes */
  useEffect(() => { clearQuery() }, [location.pathname])

  const placeholder = PAGE_PLACEHOLDERS[location.pathname] ?? `${t("search")}…`

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="flex flex-col min-w-0">

        {/* ── Top navbar ── */}
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b bg-background/80 backdrop-blur-md px-3 md:px-5">

          {/* Left: sidebar trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <SidebarTrigger className="h-9 w-9 rounded-lg hover:bg-accent text-muted-foreground shrink-0" />
          </div>

          {/* Centre: search bar — visible on ALL screen sizes */}
          <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-9 pr-8 h-9 rounded-xl bg-muted border border-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15 transition-all"
            />
            {query && (
              <button
                onClick={() => { clearQuery(); inputRef.current?.focus() }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Right: lang, theme, bell, avatar */}
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="hidden sm:block"><LanguageSwitcher /></div>
            <ThemeToggle />

            {/* Bell */}
            <button className="relative h-9 w-9 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-destructive" />
            </button>

            {/* Avatar dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-8 w-8 rounded-full ring-2 ring-border hover:ring-primary/40 transition-all overflow-hidden outline-none cursor-pointer">
                  <Avatar className="h-full w-full">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                      {initial}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="w-56 rounded-2xl p-1.5">
                <DropdownMenuLabel className="px-3 py-2.5">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/admin/settings")} className="rounded-xl px-3 py-2.5 gap-2.5 cursor-pointer">
                  <Settings className="h-4 w-4 text-muted-foreground" /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/admin/profile")} className="rounded-xl px-3 py-2.5 gap-2.5 cursor-pointer">
                  <UserIcon className="h-4 w-4 text-muted-foreground" /> Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="rounded-xl px-3 py-2.5 gap-2.5 cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4" /> Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-auto bg-muted/20 dark:bg-background">
          {user?.business?.logo && (
            <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-0" aria-hidden>
              <img src={user.business.logo} alt="" className="w-[25%] max-w-[240px] object-contain grayscale opacity-[0.02]" />
            </div>
          )}
          <div className="relative z-10 p-4 md:p-6 pb-20 md:pb-6 hig-page-enter">
            <Outlet />
          </div>
        </main>
      </SidebarInset>

      <MobileTabBar />
    </SidebarProvider>
  )
}
