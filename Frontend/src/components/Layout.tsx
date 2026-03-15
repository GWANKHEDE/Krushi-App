/*
  Layout — public pages (Home, Products, About, Contact)
  Admin Login button: REMOVED from desktop navbar and mobile sheet.
  It lives only on the login page itself — farmers don't need to see it.
  Language switcher + theme toggle remain in navbar.
*/
import { useState, useEffect } from "react"
import { Outlet, Link, useLocation } from "react-router-dom"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Menu, Sprout, House, ShoppingCart, User, X, ChevronRight, Phone } from "lucide-react"
import { useTranslation } from "react-i18next"
import { LanguageSwitcher } from "./LanguageSwitcher"

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
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location              = useLocation()
  const { t }                 = useTranslation()
  const [biz, setBiz]         = useState(defaultBiz)

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
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "hsl(var(--background))" }}>

      {/* ── Nav bar — glass-thin, 44px ── */}
      <header
        className="glass-thin sticky top-0 z-50"
        style={{
          height: 44,
          transition: "box-shadow 0.3s ease",
          boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
        }}
      >
        <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "space-between", padding: "0 16px", maxWidth: 1200, margin: "0 auto", width: "100%" }}>

          {/* Logo */}
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", flexShrink: 0 }}>
            <div
              className="hig-app-icon"
              style={{ width: 28, height: 28, background: "linear-gradient(145deg,#3ab26a,#27854d)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(52,199,89,.28)" }}
            >
              <Sprout style={{ width: 14, height: 14, color: "white" }} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 600, color: "hsl(var(--foreground))", letterSpacing: "-0.01em", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {biz.name}
            </span>
          </Link>

          {/* Desktop nav — centered */}
          <nav className="hidden md:flex items-center" style={{ gap: 2 }}>
            {NAV.map(item => (
              <Link
                key={item.name}
                to={item.href}
                style={{
                  padding: "5px 12px", borderRadius: 8, fontSize: 14,
                  fontWeight: isActive(item.href) ? 600 : 400,
                  letterSpacing: "-0.005em",
                  color: isActive(item.href) ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))",
                  background: isActive(item.href) ? "hsl(var(--primary)/.08)" : "transparent",
                  textDecoration: "none",
                  transition: "all .12s",
                }}
                className="hover:text-foreground transition-colors"
              >
                {t(item.name)}
              </Link>
            ))}
          </nav>

          {/* Right actions — NO admin login button here */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <LanguageSwitcher />
            <ThemeToggle />

            {/* Mobile hamburger */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <button
                  style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(120,120,128,.12)", color: "hsl(var(--muted-foreground))", border: "none", cursor: "pointer" }}
                >
                  {open ? <X style={{ width: 17, height: 17 }} /> : <Menu style={{ width: 17, height: 17 }} />}
                </button>
              </SheetTrigger>
              <SheetContent
                side="right"
                style={{ width: 280, padding: 0, background: "hsl(var(--card))", border: "none", boxShadow: "0 0 40px rgba(0,0,0,0.15)" }}
              >
                {/* Sheet header */}
                <div style={{ padding: "16px", borderBottom: "0.5px solid rgba(60,60,67,.14)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div className="hig-app-icon" style={{ width: 32, height: 32, background: "linear-gradient(145deg,#3ab26a,#27854d)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Sprout style={{ width: 16, height: 16, color: "white" }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "hsl(var(--foreground))" }}>{biz.name}</p>
                      <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>{biz.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Nav links */}
                <div style={{ padding: "8px" }}>
                  {NAV.map(item => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setOpen(false)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "11px 14px", borderRadius: 10, marginBottom: 2,
                        fontSize: 16, fontWeight: isActive(item.href) ? 600 : 400,
                        color: isActive(item.href) ? "hsl(var(--primary))" : "hsl(var(--foreground))",
                        background: isActive(item.href) ? "hsl(var(--primary)/.08)" : "transparent",
                        textDecoration: "none",
                      }}
                      className="hover:bg-black/4 dark:hover:bg-white/5 transition-colors"
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <item.icon style={{ width: 18, height: 18, opacity: 0.6 }} />
                        {t(item.name)}
                      </div>
                      {isActive(item.href) && <ChevronRight style={{ width: 14, height: 14, opacity: .4 }} />}
                    </Link>
                  ))}

                  {/* Call button in sheet — useful for farmers */}
                  <div style={{ height: "0.5px", background: "rgba(60,60,67,.12)", margin: "8px 0" }} />
                  <a
                    href={`tel:${biz.phone}`}
                    onClick={() => setOpen(false)}
                    style={{
                      display: "flex", alignItems: "center", gap: 10,
                      padding: "11px 14px", borderRadius: 10,
                      fontSize: 15, fontWeight: 600,
                      color: "#34C759", background: "rgba(52,199,89,0.08)",
                      textDecoration: "none",
                    }}
                  >
                    <Phone style={{ width: 18, height: 18 }} />
                    {biz.phone}
                  </a>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main style={{ flex: 1, position: "relative" }}>
        {biz.logo && (
          <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-0" aria-hidden>
            <img src={biz.logo} alt="" style={{ width: "28%", maxWidth: 260, objectFit: "contain", filter: "grayscale(1)", opacity: .02 }} />
          </div>
        )}
        <div style={{ position: "relative", zIndex: 1 }}>
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer style={{ background: "hsl(var(--card))", borderTop: "0.5px solid rgba(60,60,67,.15)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px" }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <div className="hig-app-icon" style={{ width: 26, height: 26, background: "hsl(var(--primary))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Sprout style={{ width: 13, height: 13, color: "white" }} />
                </div>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{biz.name}</span>
              </div>
              <p style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", lineHeight: 1.6 }}>{t("pub_footer_tagline")}</p>
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "hsl(var(--muted-foreground))", marginBottom: 10 }}>{t("quick_links")}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {["products", "about", "contact"].map(l => (
                  <Link key={l} to={`/${l}`} style={{ fontSize: 14, color: "hsl(var(--muted-foreground))", textDecoration: "none" }} className="hover:text-foreground transition-colors">
                    {t(l)}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "hsl(var(--muted-foreground))", marginBottom: 10 }}>{t("contact")}</p>
              {[["📍", biz.address], ["📞", biz.phone], ["✉️", biz.email], ["🕐", t("pub_timings")]].map(([i, v], k) => (
                <p key={k} style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", display: "flex", gap: 6, marginBottom: 5, lineHeight: 1.5 }}>
                  <span style={{ flexShrink: 0 }}>{i}</span><span>{v}</span>
                </p>
              ))}
            </div>
          </div>
          <div style={{ borderTop: "0.5px solid rgba(60,60,67,.12)", marginTop: 24, paddingTop: 18, textAlign: "center" }}>
            <p style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", opacity: .55 }}>
              © {new Date().getFullYear()} {biz.name}. {t("all_rights_reserved")}.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
