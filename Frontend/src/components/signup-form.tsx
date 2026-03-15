import { cn } from "@/lib/utils"
import { Loader2, Mail, Lock, User, Sprout } from "lucide-react"
import { useTranslation } from "react-i18next"

interface Props extends React.ComponentProps<"div"> {
  onSignup: (e: React.FormEvent) => void
  onSwitchToLogin: () => void
  loading: boolean
  name: string; setName: (v: string) => void
  email: string; setEmail: (v: string) => void
  password: string; setPassword: (v: string) => void
  errors: { name?: string; email?: string; password?: string }
}

export function SignupForm({ className, onSignup, onSwitchToLogin, loading, name, setName, email, setEmail, password, setPassword, errors, ...props }: Props) {
  const { t } = useTranslation()
  return (
    <div className={cn("w-full", className)} {...props}>
      <div className="w-full rounded-3xl hig-sheet-enter"
        style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.16),0 8px 24px rgba(0,0,0,0.10),inset 0 1px 0 rgba(255,255,255,0.80)", border: "0.5px solid rgba(255,255,255,0.70)", outline: "0.5px solid rgba(0,0,0,0.07)", overflow: "hidden" }}>
        <div className="grid md:grid-cols-2">

          {/* Form */}
          <div style={{ background: "rgba(255,255,255,0.82)", backdropFilter: "saturate(180%) blur(28px)", WebkitBackdropFilter: "saturate(180%) blur(28px)" }} className="p-7 sm:p-9">
            <div className="flex items-center gap-3 mb-7">
              <div className="hig-app-icon flex items-center justify-center flex-shrink-0"
                style={{ width: 52, height: 52, background: "hsl(var(--primary))", boxShadow: "0 4px 14px hsl(var(--primary)/.35),inset 0 1px 0 rgba(255,255,255,0.28)" }}>
                <Sprout style={{ width: 26, height: 26, color: "white" }} />
              </div>
              <div>
                <p style={{ fontSize: 17, fontWeight: 600, color: "hsl(var(--foreground))", letterSpacing: "-0.01em" }}>Krushi Kendra</p>
                <p style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", marginTop: 1 }}>Create Account</p>
              </div>
            </div>

            <h1 style={{ fontSize: 28, fontWeight: 700, color: "hsl(var(--foreground))", letterSpacing: "-0.022em", lineHeight: 1.2, marginBottom: 6 }}>{t("join_us") || "Create Account"}</h1>
            <p style={{ fontSize: 15, color: "hsl(var(--muted-foreground))", marginBottom: 24, lineHeight: 1.5 }}>{t("signup_subtitle") || "Join thousands of farmers"}</p>

            <form onSubmit={onSignup} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {/* Name */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 7 }}>{t("full_name")}</p>
                <div className="hig-field-wrap">
                  <User style={{ width: 16, height: 16, color: "hsl(var(--muted-foreground))", flexShrink: 0 }} />
                  <input type="text" placeholder="Ganesh Wankhede" required value={name} onChange={e => setName(e.target.value)} />
                </div>
                {errors.name && <p style={{ fontSize: 12, color: "#FF3B30", marginTop: 4, marginLeft: 2 }}>{errors.name}</p>}
              </div>
              {/* Email */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 7 }}>{t("email_address")}</p>
                <div className="hig-field-wrap">
                  <Mail style={{ width: 16, height: 16, color: "hsl(var(--muted-foreground))", flexShrink: 0 }} />
                  <input type="email" placeholder="name@krushi.com" required value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                {errors.email && <p style={{ fontSize: 12, color: "#FF3B30", marginTop: 4, marginLeft: 2 }}>{errors.email}</p>}
              </div>
              {/* Password */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 7 }}>{t("password")}</p>
                <div className="hig-field-wrap">
                  <Lock style={{ width: 16, height: 16, color: "hsl(var(--muted-foreground))", flexShrink: 0 }} />
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Create password" />
                </div>
                {errors.password && <p style={{ fontSize: 12, color: "#FF3B30", marginTop: 4, marginLeft: 2 }}>{errors.password}</p>}
              </div>

              <button type="submit" disabled={loading} className="hig-btn hig-btn-filled w-full" style={{ marginTop: 2, borderRadius: 14 }}>
                {loading && <Loader2 style={{ width: 18, height: 18 }} className="animate-spin" />}
                {loading ? "Creating account…" : t("sign_up") || "Create Account"}
              </button>
            </form>

            <p style={{ textAlign: "center", fontSize: 14, color: "hsl(var(--muted-foreground))", marginTop: 20 }}>
              {t("already_have_account") || "Already have an account?"}{" "}
              <button type="button" onClick={onSwitchToLogin} style={{ color: "#007AFF", fontWeight: 500, background: "none", border: "none", cursor: "pointer", fontSize: 14 }} className="hover:opacity-70 dark:[color:#0A84FF]">
                {t("sign_in")}
              </button>
            </p>
          </div>

          {/* Hero */}
          <div className="hidden md:flex flex-col overflow-hidden relative"
            style={{ background: "linear-gradient(155deg, hsl(141,62%,22%) 0%, hsl(141,50%,15%) 60%, hsl(200,60%,14%) 100%)", minHeight: 400 }}>
            <div style={{ position: "absolute", top: "12%", right: "-8%", width: 240, height: 240, borderRadius: "50%", background: "rgba(52,199,89,0.18)", filter: "blur(60px)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", inset: 0, opacity: .04, backgroundImage: "radial-gradient(circle at 1.5px 1.5px, white 1.5px, transparent 0)", backgroundSize: "20px 20px", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "40px 28px", color: "white", textAlign: "center" }}>
              <div className="hig-app-icon flex items-center justify-center" style={{ width: 84, height: 84, background: "rgba(255,255,255,0.12)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.20)", boxShadow: "0 12px 40px rgba(0,0,0,0.30),inset 0 1px 0 rgba(255,255,255,0.28)", marginBottom: 22 }}>
                <Sprout style={{ width: 40, height: 40, color: "white" }} />
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.022em", lineHeight: 1.2, marginBottom: 10 }}>Join the<br />Community</h2>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.52)", lineHeight: 1.6, maxWidth: 190 }}>
                Trusted by 5000+ farmers across Maharashtra
              </p>
            </div>
          </div>
        </div>
      </div>
      <p style={{ textAlign: "center", fontSize: 11, color: "hsl(var(--muted-foreground))", opacity: .45, marginTop: 14 }}>
        By signing up you agree to our <a href="#" style={{ textDecoration: "underline", color: "inherit" }}>{t("terms")}</a>{" "}and{" "}<a href="#" style={{ textDecoration: "underline", color: "inherit" }}>{t("privacy")}</a>.
      </p>
    </div>
  )
}
