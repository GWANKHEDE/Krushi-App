import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Menu, Sprout, House, ShoppingCart, User, LogIn, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from './LanguageSwitcher'
import { cn } from '@/lib/utils'

const NAV = [
  { name: 'home',     href: '/',         icon: House },
  { name: 'products', href: '/products', icon: ShoppingCart },
  { name: 'about',    href: '/about',    icon: Sprout },
  { name: 'contact',  href: '/contact',  icon: User },
]

export function Layout() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { t } = useTranslation()
  const [biz, setBiz] = useState({ name: 'Krushi Seva Kendra', address: 'Penur, Tq Purna, Parbhani, MH 431511', phone: '+91 9823332198', email: 'info@krushisevakendra.com', logo: undefined as string | undefined })

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}')
      if (u?.business) setBiz(prev => ({ ...prev, name: u.business.name || prev.name, address: u.business.address || prev.address, phone: u.business.contactNumber || prev.phone, email: u.business.email || prev.email, logo: u.business.logo || undefined }))
    } catch {}
  }, [location.pathname])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const isActive = (p: string) => location.pathname === p

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ── iOS-style nav bar ── */}
      <header className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled ? "ios-glass" : "bg-background/90 backdrop-blur-md border-b border-border/30"
      )}>
        <div className="flex h-14 items-center justify-between px-4 md:px-8 max-w-7xl mx-auto w-full">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center shadow-[0_2px_8px_hsl(var(--primary)/0.35)]">
              <Sprout className="h-[18px] w-[18px] text-white" />
            </div>
            <span className="font-bold text-[16px] text-foreground tracking-tight truncate max-w-[160px] sm:max-w-none">{biz.name}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(item => (
              <Link key={item.name} to={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[14px] font-medium transition-all",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}>
                {t(item.name)}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link to="/admin/login"
              className="hidden md:flex items-center gap-2 h-9 px-4 rounded-xl bg-primary text-primary-foreground text-[13px] font-semibold hover:bg-primary/90 transition-colors shadow-[0_2px_8px_hsl(var(--primary)/0.25)]">
              <LogIn className="h-[14px] w-[14px]" />
              {t('admin_login')}
            </Link>

            {/* Mobile menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <button className="h-9 w-9 rounded-xl bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0 bg-background border-l border-border/50">
                <div className="p-5 border-b border-border/30">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
                      <Sprout className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-bold text-[15px] text-foreground">{biz.name}</span>
                  </div>
                </div>
                <nav className="p-3 space-y-0.5">
                  {NAV.map(item => (
                    <Link key={item.name} to={item.href} onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium transition-all",
                        isActive(item.href) ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted/60"
                      )}>
                      <item.icon className="h-5 w-5 opacity-60" />
                      {t(item.name)}
                    </Link>
                  ))}
                  <div className="pt-2 mt-2 border-t border-border/30">
                    <Link to="/admin/login" onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium text-primary bg-primary/8 hover:bg-primary/12 transition-colors">
                      <LogIn className="h-5 w-5" />
                      {t('admin_login')}
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 relative">
        {biz.logo && (
          <div className="fixed inset-0 pointer-events-none flex items-center justify-center opacity-[0.025] z-0" aria-hidden>
            <img src={biz.logo} alt="" className="w-1/3 max-w-xs object-contain grayscale" />
          </div>
        )}
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-card border-t border-border/40 mt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                  <Sprout className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold text-[15px]">{biz.name}</span>
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed">Your trusted partner in agriculture. Quality fertilizers, seeds, and tools.</p>
            </div>
            <div>
              <h3 className="font-semibold text-[13px] uppercase tracking-wider text-muted-foreground mb-3">{t('quick_links')}</h3>
              <ul className="space-y-2">
                {['products','about','contact'].map(l => (
                  <li key={l}><Link to={`/${l}`} className="text-[14px] text-muted-foreground hover:text-foreground transition-colors">{t(l)}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-[13px] uppercase tracking-wider text-muted-foreground mb-3">Contact</h3>
              <ul className="space-y-2 text-[13px] text-muted-foreground">
                <li className="flex items-start gap-2"><span>📍</span><span>{biz.address}</span></li>
                <li className="flex items-center gap-2"><span>📞</span><span>{biz.phone}</span></li>
                <li className="flex items-center gap-2"><span>✉️</span><span>{biz.email}</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 mt-8 pt-6 text-center text-[12px] text-muted-foreground">
            © {new Date().getFullYear()} {biz.name}. {t('all_rights_reserved')}.
          </div>
        </div>
      </footer>
    </div>
  )
}
