/*
  LoginForm — Apple HIG Authentication pattern
  ──────────────────────────────────────────────
  • System font, no decorative elements
  • systemGroupedBackground page, white card
  • 44pt text fields (hig-field-wrap)
  • 50pt filled primary button (hig-btn hig-btn-filled)
  • Semantic color usage — blue for links, red for errors
  • Minimal, content-forward layout
  • App icon: 60×60, 22.37% border-radius at top
*/
import { cn } from "@/lib/utils"
import { Loader2, Lock, Mail, Sprout, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

interface Props extends React.ComponentProps<"div"> {
  onLogin: (e: React.FormEvent) => void
  onSwitchToSignup: () => void
  loading: boolean
  email: string; setEmail: (v: string) => void
  password: string; setPassword: (v: string) => void
  errors: { email?: string; password?: string }
}

export function LoginForm({ className, onLogin, onSwitchToSignup, loading, email, setEmail, password, setPassword, errors, ...props }: Props) {
  const { t } = useTranslation()
  const [showPw, setShowPw] = useState(false)

  return (
    <div className={cn("w-full", className)} {...props}>
      <div style={{ background: "hsl(var(--card))", borderRadius: 22, overflow: "hidden", boxShadow: "0 20px 48px rgba(0,0,0,0.14), 0 8px 16px rgba(0,0,0,0.08)" }}>
        <div className="grid md:grid-cols-2">

          {/* ── Form side ── */}
          <div style={{ padding: "36px 32px" }}>

            {/* App icon — HIG 60×60, 22.37% radius */}
            <div className="flex items-center gap-3 mb-8">
              <div
                style={{
                  width: 60, height: 60, borderRadius: "22.37%",
                  background: "hsl(var(--primary))",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 4px 16px hsl(var(--primary)/.35)",
                  flexShrink: 0
                }}
              >
                <Sprout style={{ width: 28, height: 28, color: "white" }} />
              </div>
              <div>
                <p style={{ fontSize: 17, fontWeight: 600, color: "hsl(var(--foreground))", letterSpacing: "-0.01em" }}>Krushi Kendra</p>
                <p style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", marginTop: 1 }}>Management Portal</p>
              </div>
            </div>

            {/* Large Title */}
            <h1 style={{ fontSize: 28, fontWeight: 700, color: "hsl(var(--foreground))", letterSpacing: "-0.022em", marginBottom: 6 }}>
              {t("welcome_back")}
            </h1>
            <p style={{ fontSize: 15, color: "hsl(var(--muted-foreground))", marginBottom: 24, lineHeight: 1.5 }}>
              {t("login_subtitle") || "Sign in to your dashboard"}
            </p>

            {/* Demo hint — HIG grouped row */}
            <button
              type="button"
              onClick={() => { setEmail("admin@krushi.com"); setPassword("password123") }}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                width: "100%", padding: "10px 14px",
                background: "hsl(var(--muted))", borderRadius: 12,
                border: "none", cursor: "pointer",
                marginBottom: 20, textAlign: "left",
                transition: "background 0.12s"
              }}
              className="hover:bg-[hsl(var(--muted)/.7)]"
            >
              <span style={{ fontSize: 20, flexShrink: 0 }}>🔑</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--foreground))" }}>Use demo credentials</p>
                <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", marginTop: 1 }}>admin@krushi.com · password123</p>
              </div>
            </button>

            <form onSubmit={onLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>

              {/* Email field */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                  {t("email_address")}
                </p>
                <div className="hig-field-wrap">
                  <Mail style={{ width: 16, height: 16, color: "hsl(var(--muted-foreground))", flexShrink: 0 }} />
                  <input type="email" placeholder="name@krushi.com" required value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                {errors.email && <p style={{ fontSize: 12, color: "#FF3B30", marginTop: 4, marginLeft: 2 }}>{errors.email}</p>}
              </div>

              {/* Password field */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {t("password")}
                  </p>
                  {/* Forgot password — systemBlue link */}
                  <a href="#" style={{ fontSize: 13, color: "#007AFF", textDecoration: "none" }}
                     className="hover:opacity-70 transition-opacity">
                    {t("forgot_password")}
                  </a>
                </div>
                <div className="hig-field-wrap">
                  <Lock style={{ width: 16, height: 16, color: "hsl(var(--muted-foreground))", flexShrink: 0 }} />
                  <input type={showPw ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPw(p => !p)} style={{ color: "hsl(var(--muted-foreground))", flexShrink: 0 }}
                    className="hover:opacity-70 transition-opacity">
                    {showPw ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                  </button>
                </div>
                {errors.password && <p style={{ fontSize: 12, color: "#FF3B30", marginTop: 4, marginLeft: 2 }}>{errors.password}</p>}
              </div>

              {/* Primary filled button — 50pt, full width */}
              <button
                type="submit"
                disabled={loading}
                className="hig-btn hig-btn-filled w-full mt-1"
                style={{ borderRadius: 14 }}
              >
                {loading && <Loader2 style={{ width: 18, height: 18 }} className="animate-spin" />}
                {loading ? "Signing in…" : t("sign_in")}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
              <div style={{ flex: 1, height: "0.5px", background: "rgba(60,60,67,0.2)" }} />
              <span style={{ fontSize: 13, color: "hsl(var(--muted-foreground))" }}>{t("or_continue_with") || "or"}</span>
              <div style={{ flex: 1, height: "0.5px", background: "rgba(60,60,67,0.2)" }} />
            </div>

            {/* Social — gray buttons */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {["Google", "Meta"].map(p => (
                <button
                  key={p} type="button"
                  className="hig-btn hig-btn-gray hig-btn-sm"
                  style={{ borderRadius: 12, height: 42, fontSize: 14 }}
                >{p}</button>
              ))}
            </div>

            <p style={{ textAlign: "center", fontSize: 14, color: "hsl(var(--muted-foreground))", marginTop: 20 }}>
              {t("dont_have_account")}{" "}
              {/* Tinted link — systemBlue */}
              <button type="button" onClick={onSwitchToSignup}
                style={{ color: "#007AFF", fontWeight: 500, background: "none", border: "none", cursor: "pointer", fontSize: 14 }}
                className="hover:opacity-70 transition-opacity">
                {t("sign_up")}
              </button>
            </p>
          </div>

          {/* ── Hero / Brand side ── */}
          <div className="relative hidden md:flex flex-col overflow-hidden"
               style={{ background: "linear-gradient(160deg, hsl(141,58%,25%) 0%, hsl(141,45%,18%) 100%)" }}>
            {/* Dot grid — very subtle */}
            <div style={{
              position: "absolute", inset: 0, opacity: 0.04,
              backgroundImage: "radial-gradient(circle at 1.5px 1.5px, white 1.5px, transparent 0)",
              backgroundSize: "20px 20px"
            }} />

            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "40px 32px", color: "white", textAlign: "center" }}>

              {/* Large app icon */}
              <div style={{
                width: 80, height: 80,
                borderRadius: "22.37%",
                background: "rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 24,
                boxShadow: "0 8px 32px rgba(0,0,0,0.25)"
              }}>
                <Sprout style={{ width: 38, height: 38, color: "white" }} />
              </div>

              {/* Title 1 — 28pt */}
              <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.022em", lineHeight: 1.2, marginBottom: 8 }}>
                Empowering<br />Farmers
              </h2>
              <p style={{ fontSize: 15, color: "rgba(255,255,255,0.55)", lineHeight: 1.5, maxWidth: 200, marginBottom: 32 }}>
                Next-generation agriculture business management
              </p>

              {/* Stats — iOS widget mini grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%", maxWidth: 220 }}>
                {[
                  { v: "5000+", l: "Farmers" },
                  { v: "100%",  l: "Trusted" },
                  { v: "24/7",  l: "Support" },
                  { v: "10+",   l: "Years" },
                ].map((s, i) => (
                  <div key={i} style={{
                    background: "rgba(255,255,255,0.08)",
                    borderRadius: 14,
                    padding: "12px 14px",
                    border: "0.5px solid rgba(255,255,255,0.1)",
                    textAlign: "left"
                  }}>
                    <p style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, letterSpacing: "-0.02em" }}>{s.v}</p>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terms — Caption 2 size */}
      <p style={{ textAlign: "center", fontSize: 11, color: "hsl(var(--muted-foreground))", opacity: 0.5, marginTop: 14 }}>
        By signing in, you agree to our{" "}
        <a href="#" style={{ color: "inherit", textDecoration: "underline" }}>{t("terms")}</a>
        {" "}and{" "}
        <a href="#" style={{ color: "inherit", textDecoration: "underline" }}>{t("privacy")}</a>.
      </p>
    </div>
  )
}
