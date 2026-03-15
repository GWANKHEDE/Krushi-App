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

      {/* Outer card — exactly same structure as SignupForm */}
      <div
        className="w-full rounded-3xl hig-sheet-enter"
        style={{
          boxShadow: "0 24px 64px rgba(0,0,0,0.16),0 8px 24px rgba(0,0,0,0.10),inset 0 1px 0 rgba(255,255,255,0.80)",
          border: "0.5px solid rgba(255,255,255,0.70)",
          outline: "0.5px solid rgba(0,0,0,0.07)",
          overflow: "hidden",
        }}
      >
        {/* grid md:grid-cols-2 — exactly same as SignupForm, NOT flex flex-col */}
        <div className="grid md:grid-cols-2">

          {/* ── Form panel — same padding as SignupForm ── */}
          <div
            className="p-7 sm:p-9"
            style={{
              background: "rgba(255,255,255,0.82)",
              backdropFilter: "saturate(180%) blur(28px)",
              WebkitBackdropFilter: "saturate(180%) blur(28px)",
            }}
          >
            {/* Brand — identical to SignupForm */}
            <div className="flex items-center gap-3 mb-7">
              <div
                className="hig-app-icon flex items-center justify-center flex-shrink-0"
                style={{ width: 52, height: 52, background: "hsl(var(--primary))", boxShadow: "0 4px 14px hsl(var(--primary)/.35),inset 0 1px 0 rgba(255,255,255,0.28)" }}
              >
                <Sprout style={{ width: 26, height: 26, color: "white" }} />
              </div>
              <div>
                <p style={{ fontSize: 17, fontWeight: 600, color: "hsl(var(--foreground))", letterSpacing: "-0.01em" }}>Krushi Kendra</p>
                <p style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", marginTop: 1 }}>Management Portal</p>
              </div>
            </div>

            <h1 style={{ fontSize: 28, fontWeight: 700, color: "hsl(var(--foreground))", letterSpacing: "-0.022em", lineHeight: 1.2, marginBottom: 6 }}>
              {t("welcome_back")}
            </h1>
            <p style={{ fontSize: 15, color: "hsl(var(--muted-foreground))", marginBottom: 20, lineHeight: 1.5 }}>
              {t("login_subtitle") || "Sign in to your dashboard"}
            </p>

            {/* Demo hint */}
            <button
              type="button"
              onClick={() => { setEmail("admin@krushi.com"); setPassword("password123") }}
              style={{
                display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
                padding: "10px 14px", background: "rgba(52,199,89,0.08)", borderRadius: 12,
                border: "0.5px solid rgba(52,199,89,0.20)", cursor: "pointer", marginBottom: 18, transition: "background 0.12s",
              }}
              className="hover:bg-[rgba(52,199,89,0.13)] active:scale-[.98]"
            >
              <span style={{ fontSize: 18, flexShrink: 0 }}>🔑</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#34C759" }}>Use demo credentials</p>
                <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", marginTop: 1 }}>admin@krushi.com · password123</p>
              </div>
            </button>

            {/* Form — same gap as SignupForm */}
            <form onSubmit={onLogin} style={{ display: "flex", flexDirection: "column", gap: 14 }}>

              {/* Email */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 7 }}>
                  {t("email_address")}
                </p>
                <div className="hig-field-wrap">
                  <Mail style={{ width: 16, height: 16, color: "hsl(var(--muted-foreground))", flexShrink: 0 }} />
                  <input type="email" placeholder="name@krushi.com" required value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                {errors.email && <p style={{ fontSize: 12, color: "#FF3B30", marginTop: 4, marginLeft: 2 }}>{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
                  <p style={{ fontSize: 11, fontWeight: 600, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {t("password")}
                  </p>
                  <a href="#" style={{ fontSize: 13, color: "#007AFF", textDecoration: "none" }} className="hover:opacity-70 dark:[color:#0A84FF]">
                    {t("forgot_password")}
                  </a>
                </div>
                <div className="hig-field-wrap">
                  <Lock style={{ width: 16, height: 16, color: "hsl(var(--muted-foreground))", flexShrink: 0 }} />
                  <input
                    type={showPw ? "text" : "password"}
                    required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                  />
                  <button
                    type="button" onClick={() => setShowPw(p => !p)}
                    style={{ color: "hsl(var(--muted-foreground))", background: "none", border: "none", cursor: "pointer", display: "flex", flexShrink: 0, padding: 0 }}
                    className="hover:opacity-70"
                  >
                    {showPw ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                  </button>
                </div>
                {errors.password && <p style={{ fontSize: 12, color: "#FF3B30", marginTop: 4, marginLeft: 2 }}>{errors.password}</p>}
              </div>

              {/* Submit — same as SignupForm */}
              <button
                type="submit" disabled={loading}
                className="hig-btn hig-btn-filled w-full"
                style={{ marginTop: 2, borderRadius: 14 }}
              >
                {loading && <Loader2 style={{ width: 18, height: 18 }} className="animate-spin" />}
                {loading ? "Signing in…" : t("sign_in")}
              </button>
            </form>

            {/* Switch to signup — same position as SignupForm's switch link */}
            <p style={{ textAlign: "center", fontSize: 14, color: "hsl(var(--muted-foreground))", marginTop: 20 }}>
              {t("dont_have_account")}{" "}
              <button
                type="button" onClick={onSwitchToSignup}
                style={{ color: "#007AFF", fontWeight: 500, background: "none", border: "none", cursor: "pointer", fontSize: 14 }}
                className="hover:opacity-70 dark:[color:#0A84FF]"
              >
                {t("sign_up")}
              </button>
            </p>
          </div>

          {/* ── Hero panel — desktop only, identical structure to SignupForm ── */}
          <div
            className="hidden md:flex flex-col overflow-hidden relative"
            style={{
              background: "linear-gradient(155deg, hsl(141,62%,22%) 0%, hsl(141,50%,15%) 60%, hsl(200,60%,14%) 100%)",
              minHeight: 400,
            }}
          >
            <div style={{ position: "absolute", top: "12%", right: "-8%", width: 240, height: 240, borderRadius: "50%", background: "rgba(52,199,89,0.18)", filter: "blur(60px)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: "18%", left: "-4%", width: 180, height: 180, borderRadius: "50%", background: "rgba(0,122,255,0.12)", filter: "blur(50px)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", inset: 0, opacity: .04, backgroundImage: "radial-gradient(circle at 1.5px 1.5px, white 1.5px, transparent 0)", backgroundSize: "20px 20px", pointerEvents: "none" }} />

            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "40px 28px", color: "white", textAlign: "center" }}>
              <div
                className="hig-app-icon flex items-center justify-center"
                style={{ width: 84, height: 84, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.20)", boxShadow: "0 12px 40px rgba(0,0,0,0.30),inset 0 1px 0 rgba(255,255,255,0.28)", marginBottom: 22 }}
              >
                <Sprout style={{ width: 40, height: 40, color: "white" }} />
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.022em", lineHeight: 1.2, marginBottom: 10 }}>
                Empowering<br />Farmers
              </h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.52)", lineHeight: 1.6, maxWidth: 190, marginBottom: 28 }}>
                Next-generation agriculture business management
              </p>
              {/* Same 2×2 stat grid as signup hero */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, width: "100%", maxWidth: 220 }}>
                {[{ v: "5000+", l: "Farmers" }, { v: "100%", l: "Trusted" }, { v: "24/7", l: "Support" }, { v: "10+", l: "Years" }].map((s, i) => (
                  <div key={i} style={{ background: "rgba(255,255,255,0.09)", borderRadius: 14, padding: "12px 13px", border: "0.5px solid rgba(255,255,255,0.12)", backdropFilter: "blur(12px)", textAlign: "left", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.16)" }}>
                    <p style={{ fontSize: 21, fontWeight: 700, letterSpacing: "-0.022em", lineHeight: 1 }}>{s.v}</p>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.48)", marginTop: 4 }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <p style={{ textAlign: "center", fontSize: 11, color: "hsl(var(--muted-foreground))", opacity: .45, marginTop: 14 }}>
        By signing in you agree to our{" "}
        <a href="#" style={{ textDecoration: "underline", color: "inherit" }}>{t("terms")}</a>
        {" "}and{" "}
        <a href="#" style={{ textDecoration: "underline", color: "inherit" }}>{t("privacy")}</a>.
      </p>
    </div>
  )
}
