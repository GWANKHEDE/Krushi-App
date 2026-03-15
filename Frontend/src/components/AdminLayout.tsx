import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useAuth } from '@/lib/auth'
import { toast } from '@/lib/toast'
import { Sprout, LayoutDashboard, Package, ShoppingCart, FileText, BarChart3, Settings, LogOut, Bell, Search, User as UserIcon } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar'
import { AppSidebar } from './AppSidebar'
import { Separator } from '@/components/ui/separator'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'

export function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { t } = useTranslation()

  const handleLogout = () => {
    logout()
    toast.success('Signed out successfully')
    navigate('/admin/login')
  }

  const initial = user?.name?.charAt(0).toUpperCase() || 'A'

  // Page title from pathname
  const getPageTitle = () => {
    const path = location.pathname.split('/').pop() || 'dashboard'
    return t(path) || path.charAt(0).toUpperCase() + path.slice(1)
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        <SidebarInset className="flex flex-col min-w-0">

          {/* iOS-style sticky top bar */}
          <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border/50 bg-card/80 backdrop-blur-xl px-4 md:px-6">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="h-8 w-8 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors" />
              <Separator orientation="vertical" className="h-4 bg-border/50" />
              <div className="hidden md:flex items-center relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={t('search') + '...'}
                  className="pl-9 h-8 w-56 lg:w-80 bg-muted/60 border-transparent rounded-xl text-sm focus-visible:ring-primary/20 focus-visible:bg-background focus-visible:border-primary/30 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl relative text-muted-foreground hover:text-foreground hover:bg-muted">
                <Bell className="h-4 w-4" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full p-0 overflow-hidden ring-2 ring-border hover:ring-primary/40 transition-all">
                    <Avatar className="h-full w-full">
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">{initial}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl border-border/60 shadow-strong p-2">
                  <DropdownMenuLabel className="px-3 py-2">
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem className="rounded-xl px-3 py-2.5 text-sm cursor-pointer" onClick={() => navigate('/admin/settings')}>
                    <Settings className="mr-2.5 h-4 w-4" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-xl px-3 py-2.5 text-sm cursor-pointer" onClick={() => navigate('/admin/profile')}>
                    <UserIcon className="mr-2.5 h-4 w-4" /> Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem className="rounded-xl px-3 py-2.5 text-sm text-destructive focus:text-destructive cursor-pointer" onClick={handleLogout}>
                    <LogOut className="mr-2.5 h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 overflow-auto bg-background">
            {user?.business?.logo && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] z-0" aria-hidden="true">
                <img src={user.business.logo} alt="" className="w-1/2 max-w-[400px] object-contain grayscale" />
              </div>
            )}
            <div className="relative z-10 p-4 md:p-6 page-enter">
              <Outlet />
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
