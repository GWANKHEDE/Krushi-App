/*
  Public Layout — Apple HIG Navigation Bar
  ─────────────────────────────────────────
  • 44pt navbar, translucent material
  • systemBackground + 0.5px separator
  • Links use tintColor (systemGreen) for active
  • Mobile: sheet navigation, 44pt rows
*/
import { useState, useEffect } from "react"
import { Outlet, Link, useLocation } from "react-router-dom"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Menu, Sprout, House, ShoppingCart, User, LogIn, X, ChevronRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { cn } from "@/lib/utils"

const NAV = [
  { name: "home",     href: "/",         icon: House },
  { name: "products", href: "/products", icon: ShoppingCart },
  { name: "about",    href: "/about",    icon: Sprout },
  { name: "contact",  href: "/contact",  icon: User },
]

const defaultBiz = { name: "Krushi Seva Kendra", address: "Penur, Tq Purna, Parbhani, MH 431511", phone: "+91 9823332198", email: "info@krushisevakendra.com", logo: undefined as string|undefined }

export function Layout() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const { t } = useTranslation()
  const [biz, setBiz] = useState(defaultBiz)

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "{}")
      if (u?.business) setBiz(p => ({ ...p, name: u.business.name||p.name, address: u.business.address||p.address, phone: u.business.contactNumber||p.phone, email: u.business.email||p.email, logo: u.business.logo||undefined }))
    } catch {}
  }, [location.pathname])

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  const isActive = (p: string) => location.pathname === p

  return (
    <div style={{ minHeight: "100vh", background: "hsl(var(--background))", display: "flex", flexDirection: "column" }}>

      {/* iOS-style nav bar */}
      <header
        style={{
          position: "sticky", top: 0, zIndex: 50,
          height: 44,
          background: scrolled ? "rgba(242,242,247,0.92)" : "rgba(242,242,247,0.98)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
          borderBottom: "0.5px solid rgba(60,60,67,0.29)",
          transition: "background 0.25s",
        }}
        className="dark:[background:rgba(0,0,0,0.88)!important] dark:[border-bottom-color:rgba(84,84,88,0.65)!important]"
      >
        <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "space-between", padding: "0 16px", maxWidth: 1280, margin: "0 auto", width: "100%" }}>

          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <div style={{ width: 28, height: 28, borderRadius: "22.37%", background: "hsl(var(--primary))", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px hsl(var(--primary)/.3)" }}>
              <Sprout style={{ width: 15, height: 15, color: "white" }} />
            </div>
            <span style={{ fontSize: 16, fontWeight: 600, color: "hsl(var(--foreground))", letterSpacing: "-0.01em" }} className="truncate max-w-[160px] sm:max-w-none">{biz.name}</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center" style={{ gap: 2 }}>
            {NAV.map(item => (
              <Link key={item.name} to={item.href}
                style={{
                  padding: "6px 12px", borderRadius: 8,
                  fontSize: 14, fontWeight: isActive(item.href) ? 600 : 400,
                  color: isActive(item.href) ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                  background: isActive(item.href) ? "hsl(var(--primary)/.08)" : "transparent",
                  textDecoration: "none",
                  transition: "background 0.12s, color 0.12s",
                  letterSpacing: "-0.005em"
                }}
                className="hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
              >
                {t(item.name)}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <LanguageSwitcher />
            <ThemeToggle />
            {/* Admin CTA — filled pill, systemGreen */}
            <Link to="/admin/login"
              style={{
                display: "flex", alignItems: "center", gap: 5,
                height: 30, padding: "0 12px", borderRadius: 99,
                background: "hsl(var(--primary))", color: "white",
                fontSize: 13, fontWeight: 600, textDecoration: "none",
                boxShadow: "0 1px 4px hsl(var(--primary)/.3)",
                letterSpacing: "-0.005em"
              }}
              className="hidden md:flex hover:opacity-90 transition-opacity active:scale-95"
            >
              <LogIn style={{ width: 13, height: 13 }} />
              {t("admin_login")}
            </Link>

            {/* Mobile hamburger */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <button style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "hsl(var(--muted))", color: "hsl(var(--muted-foreground))" }}>
                  {open ? <X style={{ width: 17, height: 17 }} /> : <Menu style={{ width: 17, height: 17 }} />}
                </button>
              </SheetTrigger>
              <SheetContent side="right" style={{ width: 280, padding: 0, background: "hsl(var(--background))", border: "none", boxShadow: "-4px 0 32px rgba(0,0,0,0.12)" }}>
                {/* Sheet header */}
                <div style={{ padding: "16px", borderBottom: "0.5px solid rgba(60,60,67,0.18)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 32, height: 32, borderRadius: "22.37%", background: "hsl(var(--primary))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Sprout style={{ width: 16, height: 16, color: "white" }} />
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 600, color: "hsl(var(--foreground))" }}>{biz.name}</span>
                  </div>
                </div>
                {/* Nav rows — HIG grouped list */}
                <div style={{ padding: "8px" }}>
                  {NAV.map(item => (
                    <Link key={item.name} to={item.href} onClick={() => setOpen(false)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "11px 14px", borderRadius: 10, marginBottom: 1,
                        fontSize: 16, fontWeight: isActive(item.href) ? 600 : 400,
                        color: isActive(item.href) ? "hsl(var(--primary))" : "hsl(var(--foreground))",
                        background: isActive(item.href) ? "hsl(var(--primary)/.08)" : "transparent",
                        textDecoration: "none", letterSpacing: "-0.008em"
                      }}
                      className="hover:bg-black/4 dark:hover:bg-white/5 transition-colors"
                    >
                      <span>{t(item.name)}</span>
                      {isActive(item.href) && <ChevronRight style={{ width: 14, height: 14, opacity: 0.4 }} />}
                    </Link>
                  ))}
                  <div style={{ height: "0.5px", background: "rgba(60,60,67,0.12)", margin: "8px 0" }} />
                  <Link to="/admin/login" onClick={() => setOpen(false)}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 14px", borderRadius: 10, fontSize: 15, fontWeight: 500, color: "hsl(var(--primary))", background: "hsl(var(--primary)/.07)", textDecoration: "none" }}>
                    <LogIn style={{ width: 16, height: 16 }} />
                    {t("admin_login")}
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main style={{ flex: 1, position: "relative" }}>
        {biz.logo && (
          <div style={{ position: "fixed", inset: 0, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 0, opacity: 0.025 }} aria-hidden>
            <img src={biz.logo} alt="" style={{ width: "28%", maxWidth: 260, objectFit: "contain", filter: "grayscale(1)" }} />
          </div>
        )}
        <div style={{ position: "relative", zIndex: 1 }}><Outlet /></div>
      </main>

      {/* Footer */}
      <footer style={{ background: "hsl(var(--card))", borderTop: "0.5px solid rgba(60,60,67,0.18)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 20px" }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div style={{ width: 26, height: 26, borderRadius: "22.37%", background: "hsl(var(--primary))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Sprout style={{ width: 13, height: 13, color: "white" }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{biz.name}</span>
              </div>
              <p style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", lineHeight: 1.6 }}>Your trusted partner in agriculture. Quality fertilizers, seeds, and tools.</p>
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "hsl(var(--muted-foreground))", marginBottom: 10 }}>{t("quick_links")}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {["products","about","contact"].map(l => (
                  <Link key={l} to={`/${l}`} style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", textDecoration: "none" }}
                    className="hover:text-foreground transition-colors">{t(l)}</Link>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "hsl(var(--muted-foreground))", marginBottom: 10 }}>Contact</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {[["📍", biz.address],["📞", biz.phone],["✉️", biz.email]].map(([i, v], k) => (
                  <p key={k} style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", display: "flex", gap: 6 }}><span>{i}</span><span>{v}</span></p>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: "0.5px solid rgba(60,60,67,0.12)", marginTop: 24, paddingTop: 20, textAlign: "center" }}>
            <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", opacity: 0.6 }}>© {new Date().getFullYear()} {biz.name}. {t("all_rights_reserved")}.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
