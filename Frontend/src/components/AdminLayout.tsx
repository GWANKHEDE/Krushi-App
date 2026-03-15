import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useAuth } from '@/lib/auth'
import { toast } from '@/lib/toast'
import { Settings, LogOut, User as UserIcon, Bell, Search } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'

export function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { t } = useTranslation()

  const handleLogout = () => {
    logout()
    toast.success('Signed out')
    navigate('/admin/login')
  }

  const initial = user?.name?.charAt(0).toUpperCase() || 'A'

  // derive readable page title
  const segment = location.pathname.split('/').pop() || 'dashboard'
  const pageTitle = t(segment) || segment.charAt(0).toUpperCase() + segment.slice(1)

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex flex-col min-w-0">

          {/* ── iOS-style Top Bar ── */}
          <header className="ios-glass sticky top-0 z-40 flex h-[52px] items-center justify-between gap-4 px-4 md:px-5">
            {/* Left: trigger + title */}
            <div className="flex items-center gap-3">
              <SidebarTrigger className="h-8 w-8 rounded-xl hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0" />
              <div className="h-4 w-px bg-border/60" />
              <h1 className="text-[15px] font-semibold text-foreground tracking-tight hidden sm:block">
                {pageTitle}
              </h1>
            </div>

            {/* Center: search (desktop) */}
            <div className="hidden md:flex flex-1 max-w-xs mx-4">
              <div className="ios-input-wrap w-full flex items-center px-3 gap-2">
                <Search className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                <input
                  type="search"
                  placeholder={t('search') + '...'}
                  className="bg-transparent border-none outline-none text-sm w-full py-1.5 text-foreground placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-1.5">
              <LanguageSwitcher />
              <ThemeToggle />

              {/* Notification bell */}
              <button className="relative h-8 w-8 rounded-xl flex items-center justify-center hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-colors">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
              </button>

              {/* User avatar dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="ml-1 h-8 w-8 rounded-full ring-2 ring-border hover:ring-primary/30 transition-all overflow-hidden">
                    <Avatar className="h-full w-full">
                      <AvatarFallback className="bg-primary/15 text-primary text-xs font-bold">{initial}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={8} className="w-56 rounded-2xl border-border/60 shadow-[var(--shadow-4)] p-1.5">
                  <DropdownMenuLabel className="px-3 py-2.5 rounded-xl">
                    <p className="text-sm font-semibold text-foreground">{user?.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{user?.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/40 my-1" />
                  <DropdownMenuItem className="rounded-xl px-3 py-2.5 text-sm font-medium cursor-pointer gap-2.5" onClick={() => navigate('/admin/settings')}>
                    <Settings className="h-4 w-4 text-muted-foreground" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-xl px-3 py-2.5 text-sm font-medium cursor-pointer gap-2.5" onClick={() => navigate('/admin/profile')}>
                    <UserIcon className="h-4 w-4 text-muted-foreground" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/40 my-1" />
                  <DropdownMenuItem className="rounded-xl px-3 py-2.5 text-sm font-medium text-destructive focus:text-destructive cursor-pointer gap-2.5" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* ── Main content ── */}
          <main className="flex-1 overflow-auto">
            {/* Subtle logo watermark */}
            {user?.business?.logo && (
              <div className="fixed inset-0 pointer-events-none flex items-center justify-center opacity-[0.025] z-0" aria-hidden="true">
                <img src={user.business.logo} alt="" className="w-1/3 max-w-xs object-contain grayscale" />
              </div>
            )}
            <div className="relative z-10 p-4 md:p-5 ios-page">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
