import { useState, useEffect } from "react"
import { Outlet, Link, useLocation } from "react-router-dom"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Menu, Sprout, House, ShoppingCart, User, X, ChevronRight, Phone, LogIn } from "lucide-react"
import { useTranslation } from "react-i18next"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { cn } from "@/lib/utils"

const NAV = [
  { name: "home",     href: "/",         icon: House },
  { name: "products", href: "/products", icon: ShoppingCart },
  { name: "about",    href: "/about",    icon: Sprout },
  { name: "contact",  href: "/contact",  icon: User },
]

const defaultBiz = {
  name:    "Krushi Seva Kendra",
  address: "Penur, Tq Purna, Parbhani, MH 431511",
  phone:   "+91 9823332198",
  email:   "info@krushisevakendra.com",
  logo:    undefined as string | undefined,
}

export function Layout() {
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location                = useLocation()
  const { t }                   = useTranslation()
  const [biz, setBiz]           = useState(defaultBiz)

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}")
      if (u?.business) setBiz(p => ({
        ...p,
        name:    u.business.name            || p.name,
        address: u.business.address         || p.address,
        phone:   u.business.contactNumber   || p.phone,
        email:   u.business.email           || p.email,
        logo:    u.business.logo            || undefined,
      }))
    } catch {}
  }, [location.pathname])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const isActive = (p: string) => location.pathname === p

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* ── Navbar ── */}
      <header className={cn(
        "sticky top-0 z-50 h-[44px] border-b bg-background/80 backdrop-blur-md transition-shadow",
        scrolled && "shadow-sm"
      )}>
        <div className="flex h-full items-center justify-between px-4 md:px-6 max-w-7xl mx-auto w-full gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 text-foreground no-underline">
            <div className="hig-app-icon layout-brand-icon flex items-center justify-center">
              <Sprout className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight truncate max-w-[180px] sm:max-w-none">
              {biz.name}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(item => (
              <Link key={item.name} to={item.href}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm transition-colors",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}>
                {t(item.name)}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <LanguageSwitcher />
            <ThemeToggle />
            {/* Admin Login — desktop */}
            <Link to="/admin/login"
              className="layout-admin-btn hidden md:flex items-center gap-1.5 h-8 px-3 rounded-full bg-primary text-primary-foreground text-[13px] font-semibold hover:bg-primary/90 active:scale-95 transition-all no-underline"
              <LogIn className="h-3.5 w-3.5" />
              {t("admin_login")}
            </Link>

            {/* Mobile hamburger */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <button className="h-8 w-8 rounded-lg flex items-center justify-center bg-muted text-muted-foreground hover:text-foreground transition-colors border-none cursor-pointer">
                  {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72 p-0 bg-background border-border">
                {/* Sheet header */}
                <div className="flex items-center gap-2.5 px-4 py-4 border-b border-border">
                  <div className="hig-app-icon layout-brand-icon-sheet flex items-center justify-center">
                    <Sprout className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{biz.name}</p>
                    <p className="text-[11px] text-muted-foreground">{biz.phone}</p>
                  </div>
                </div>
                {/* Nav links */}
                <div className="p-2 space-y-0.5">
                  {NAV.map(item => (
                    <Link key={item.name} to={item.href} onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center justify-between px-3 py-2.5 rounded-xl text-[15px] transition-colors no-underline",
                        isActive(item.href)
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-foreground hover:bg-accent"
                      )}>
                      <div className="flex items-center gap-2.5">
                        <item.icon className="h-[18px] w-[18px] opacity-60" />
                        {t(item.name)}
                      </div>
                      {isActive(item.href) && <ChevronRight className="h-3.5 w-3.5 opacity-40" />}
                    </Link>
                  ))}
                  <div className="h-px bg-border mx-1 my-2" />
                  {/* Call us */}
                  <a href={`tel:${biz.phone}`} onClick={() => setOpen(false)}
                    className="layout-call-link flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[15px] font-semibold no-underline transition-colors"
                    <Phone className="h-[18px] w-[18px]" />
                    {biz.phone}
                  </a>
                  {/* Admin Login — mobile sheet */}
                  <Link to="/admin/login" onClick={() => setOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[15px] font-medium text-muted-foreground hover:bg-accent transition-colors no-underline mt-0.5">
                    <LogIn className="h-[18px] w-[18px] opacity-60" />
                    {t("admin_login")}
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 relative">
        {biz.logo && (
          <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-0" aria-hidden>
            <img src={biz.logo} alt="" className="w-[28%] max-w-[260px] object-contain grayscale opacity-[0.02]" />
          </div>
        )}
        <div className="relative z-10"><Outlet /></div>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="hig-app-icon layout-brand-icon-footer flex items-center justify-center">
                  <Sprout className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm font-semibold text-foreground">{biz.name}</span>
              </div>
              <p className="text-[13px] text-muted-foreground leading-relaxed">{t("pub_footer_tagline")}</p>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">{t("quick_links")}</p>
              <div className="flex flex-col gap-1.5">
                {["products","about","contact"].map(l => (
                  <Link key={l} to={`/${l}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors no-underline">
                    {t(l)}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">{t("contact")}</p>
              {[["📍", biz.address], ["📞", biz.phone], ["✉️", biz.email], ["🕐", t("pub_timings")]].map(([icon, val], i) => (
                <p key={i} className="flex gap-2 text-[13px] text-muted-foreground mb-1.5 leading-relaxed">
                  <span className="shrink-0">{icon}</span><span>{val}</span>
                </p>
              ))}
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-5 text-center">
            <p className="text-xs text-muted-foreground/50">
              © {new Date().getFullYear()} {biz.name}. {t("all_rights_reserved")}.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
