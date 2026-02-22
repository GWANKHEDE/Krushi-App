import { useState, useRef, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useAuth } from '@/lib/auth'
import { toast } from '@/lib/toast'
import { Menu, Sprout, LayoutDashboard, Package, ShoppingCart, FileText, BarChart3, Settings, LogOut, Bell, Search, User as UserIcon, Mail } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { Separator } from '@/components/ui/separator'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'

const NAV_ITEMS = [
  { name: 'dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'inventory', href: '/admin/products', icon: Package },
  { name: 'billing', href: '/admin/billing', icon: ShoppingCart },
  { name: 'purchase', href: '/admin/purchases', icon: FileText },
  { name: 'reports', href: '/admin/reports', icon: BarChart3 },
  { name: 'settings', href: '/admin/settings', icon: Settings },
]

export function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { t } = useTranslation()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/admin/login')
  }

  const initial = user?.name?.charAt(0).toUpperCase() || 'A'
  const isActive = (path: string) => location.pathname === path

  const NavLinks = ({ className = "" }: { className?: string }) => (
    <nav className={cn("flex items-center gap-4 text-xs font-bold uppercase tracking-widest", className)}>
      <Link to="/admin/dashboard" className="flex items-center gap-2 text-base font-black text-primary md:text-sm mr-4">
        <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <Sprout className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="hidden lg:inline-block">{user?.business?.name || 'KRUSHI'}</span>
      </Link>
      {NAV_ITEMS.map(({ name, href }) => (
        <Link
          key={name}
          to={href}
          className={cn(
            "transition-colors hover:text-primary",
            isActive(href) ? "text-primary" : "text-muted-foreground"
          )}
        >
          {t(name)}
        </Link>
      ))}
    </nav>
  )

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex flex-col">
          <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between gap-4 border-b bg-background/80 backdrop-blur-md px-4 md:px-6 transition-all">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="-ml-1 h-9 w-9 rounded-lg hover:bg-primary/5 text-primary" />
              <Separator orientation="vertical" className="mr-2 h-4 bg-primary/10" />
              <div className="hidden md:flex relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input
                  type="search"
                  placeholder={t('search')}
                  className="pl-10 h-8 w-[250px] lg:w-[400px] border-primary/10 bg-muted/30 focus-visible:ring-primary rounded-xl text-xs font-bold transition-all focus:bg-background shadow-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <LanguageSwitcher />
                <ThemeToggle />
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl relative text-muted-foreground hover:text-primary hover:bg-primary/5">
                  <Bell className="h-4 w-4" />
                  <Badge className="absolute top-1 right-1 h-3 w-3 p-0 flex items-center justify-center text-[8px] bg-primary border-2 border-background font-black">3</Badge>
                </Button>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full ml-1 border-2 border-primary/10 p-0 overflow-hidden hover:scale-105 transition-transform flex items-center justify-center">
                    <Avatar className="h-full w-full">
                      <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-black">{initial}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-2xl border-primary/10 shadow-strong p-2 animate-in fade-in zoom-in-95 duration-200">
                  <DropdownMenuLabel className="p-3">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-bold leading-none">{user?.name}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-primary/5" />
                  <DropdownMenuItem className="rounded-xl p-3 font-bold text-[10px] uppercase tracking-widest cursor-pointer hover:bg-primary/5" onClick={() => navigate('/admin/settings')}>
                    <Settings className="mr-3 h-4 w-4" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-xl p-3 font-bold text-[10px] uppercase tracking-widest cursor-pointer hover:bg-primary/5" onClick={() => navigate('/admin/profile')}>
                    <UserIcon className="mr-3 h-4 w-4" /> Profile Details
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-primary/5" />
                  <DropdownMenuItem className="rounded-xl p-3 font-bold text-[10px] uppercase tracking-widest text-destructive focus:text-destructive cursor-pointer hover:bg-destructive/5" onClick={handleLogout}>
                    <LogOut className="mr-3 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 p-4 w-full mx-auto animate-in fade-in duration-700 bg-gradient-to-br from-green-100 via-yellow-50 to-green-200 dark:from-slate-950 dark:via-emerald-950/30 dark:to-slate-950 relative overflow-hidden">
            {/* Logo Watermark specifically for Admin Content */}
            {user?.business?.logo && (
              <div
                className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.05] dark:opacity-[0.05] z-0"
                aria-hidden="true"
              >
                <img
                  src={user.business.logo}
                  alt=""
                  className="w-1/2 max-w-[500px] object-contain grayscale scale-150 rotate-[-15deg]"
                />
              </div>
            )}
            <div className="relative z-10 w-full h-full">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
