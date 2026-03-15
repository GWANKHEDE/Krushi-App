import { cn } from "@/lib/utils"
import { Loader2, Lock, Mail, Sprout, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface Props extends React.ComponentProps<"div"> {
  onLogin: (e: React.FormEvent) => void
  onSwitchToSignup: () => void
  loading: boolean
  email: string; setEmail: (v: string) => void
  password: string; setPassword: (v: string) => void
  errors: { email?: string; password?: string }
}

export function LoginForm({
  className, onLogin, onSwitchToSignup, loading,
  email, setEmail, password, setPassword, errors, ...props
}: Props) {
  const { t }     = useTranslation()
  const [showPw, setShowPw] = useState(false)

  return (
    /*
      Container: inline-block so card fits content width.
      w-full inside so it expands to parent on small screens.
      max-w-sm caps on mobile; md:max-w-2xl for two-column layout.
    */
    <div className={cn("w-full", className)} {...props}>
      <Card className="w-full overflow-hidden shadow-2xl border border-border">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2">

            {/* ── Form panel ── */}
            <div className="p-7 bg-card">

              {/* Brand */}
              <div className="flex items-center gap-3 mb-6">
                <div className="hig-app-icon flex items-center justify-center shrink-0"
                  style={{ width: 44, height: 44, background: "hsl(var(--primary))", boxShadow: "0 3px 12px hsl(var(--primary)/.28)" }}>
                  <Sprout className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold tracking-tight text-foreground">Krushi Kendra</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Management Portal</p>
                </div>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">{t("welcome_back")}</h1>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                {t("login_subtitle") || "Sign in to your dashboard"}
              </p>

              {/* Demo hint */}
              <button
                type="button"
                onClick={() => { setEmail("admin@krushi.com"); setPassword("password123") }}
                className="w-full text-left mb-5 px-3 py-2.5 rounded-xl bg-primary/5 border border-primary/20 hover:bg-primary/10 dark:bg-primary/10 dark:border-primary/30 dark:hover:bg-primary/15 transition-colors"
              >
                <p className="text-[12px] font-semibold text-primary">🔑 Use demo credentials</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">admin@krushi.com · password123</p>
              </button>

              <form onSubmit={onLogin} className="space-y-4">

                {/* Email */}
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {t("email_address")}
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      type="email" placeholder="name@krushi.com" required
                      value={email} onChange={e => setEmail(e.target.value)}
                      className="pl-9 h-11 rounded-xl bg-muted/60 border-transparent focus-visible:bg-background focus-visible:border-primary/40 focus-visible:ring-primary/20 dark:bg-muted dark:focus-visible:bg-card"
                    />
                  </div>
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {t("password")}
                    </Label>
                    <a href="#" className="text-xs text-primary hover:opacity-70 transition-opacity">
                      {t("forgot_password")}
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input
                      type={showPw ? "text" : "password"} required placeholder="••••••••"
                      value={password} onChange={e => setPassword(e.target.value)}
                      className="pl-9 pr-9 h-11 rounded-xl bg-muted/60 border-transparent focus-visible:bg-background focus-visible:border-primary/40 focus-visible:ring-primary/20 dark:bg-muted dark:focus-visible:bg-card"
                    />
                    <button type="button" onClick={() => setShowPw(p => !p)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0 bg-transparent border-none cursor-pointer">
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                </div>

                <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl font-semibold text-[15px] mt-1">
                  {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  {loading ? "Signing in…" : t("sign_in")}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-5">
                {t("dont_have_account")}{" "}
                <button type="button" onClick={onSwitchToSignup}
                  className="text-primary font-semibold hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer">
                  {t("sign_up")}
                </button>
              </p>
            </div>

            {/* ── Hero panel — desktop only ── */}
            <div className="hidden md:flex flex-col relative overflow-hidden"
              style={{ background: "linear-gradient(155deg,hsl(141,62%,22%) 0%,hsl(141,50%,15%) 60%,hsl(200,60%,14%) 100%)", minHeight: 380 }}>
              {/* Glows */}
              <div className="absolute top-[10%] right-[-8%] w-52 h-52 rounded-full blur-[60px] pointer-events-none"
                style={{ background: "rgba(52,199,89,0.18)" }} />
              <div className="absolute bottom-[18%] left-[-4%] w-40 h-40 rounded-full blur-[48px] pointer-events-none"
                style={{ background: "rgba(0,122,255,0.12)" }} />
              {/* Dot grid */}
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{ backgroundImage: "radial-gradient(circle at 1.5px 1.5px,white 1.5px,transparent 0)", backgroundSize: "20px 20px" }} />
              {/* Content */}
              <div className="relative z-10 flex flex-col items-center justify-center h-full p-9 text-white text-center">
                <div className="hig-app-icon flex items-center justify-center mb-5"
                  style={{ width: 76, height: 76, background: "rgba(255,255,255,.12)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,.20)", boxShadow: "0 12px 40px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.28)" }}>
                  <Sprout className="h-9 w-9 text-white" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight leading-tight mb-2">Empowering<br />Farmers</h2>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(255,255,255,0.55)", maxWidth: 180 }}>
                  Next-generation agriculture business management
                </p>
                <div className="grid grid-cols-2 gap-2.5 w-full max-w-[200px]">
                  {[{ v:"5000+",l:"Farmers" },{ v:"100%",l:"Trusted" },{ v:"24/7",l:"Support" },{ v:"10+",l:"Years" }].map((s,i) => (
                    <div key={i} className="rounded-2xl p-3 text-left"
                      style={{ background:"rgba(255,255,255,.09)", border:"0.5px solid rgba(255,255,255,.12)", backdropFilter:"blur(12px)", boxShadow:"inset 0 1px 0 rgba(255,255,255,.16)" }}>
                      <p className="text-xl font-bold tracking-tight leading-none">{s.v}</p>
                      <p className="text-[11px] mt-1" style={{ color:"rgba(255,255,255,0.45)" }}>{s.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      <p className="text-center text-[11px] text-muted-foreground/40 mt-3">
        By signing in you agree to our{" "}
        <a href="#" className="underline hover:text-muted-foreground">{t("terms")}</a>{" "}and{" "}
        <a href="#" className="underline hover:text-muted-foreground">{t("privacy")}</a>.
      </p>
    </div>
  )
}
