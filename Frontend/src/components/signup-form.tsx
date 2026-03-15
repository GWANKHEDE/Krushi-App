import { cn } from "@/lib/utils"
import { Loader2, Mail, Lock, User, Sprout } from "lucide-react"
import { useTranslation } from "react-i18next"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface Props extends React.ComponentProps<"div"> {
  onSignup: (e: React.FormEvent) => void
  onSwitchToLogin: () => void
  loading: boolean
  name: string; setName: (v: string) => void
  email: string; setEmail: (v: string) => void
  password: string; setPassword: (v: string) => void
  errors: { name?: string; email?: string; password?: string }
}

export function SignupForm({
  className, onSignup, onSwitchToLogin, loading,
  name, setName, email, setEmail, password, setPassword, errors, ...props
}: Props) {
  const { t } = useTranslation()

  return (
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
                  <p className="text-xs text-muted-foreground mt-0.5">Create Account</p>
                </div>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-foreground mb-1">{t("join_us") || "Create Account"}</h1>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                {t("signup_subtitle") || "Join thousands of farmers"}
              </p>

              <form onSubmit={onSignup} className="space-y-4">

                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t("full_name")}</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input type="text" placeholder="Ganesh Wankhede" required
                      value={name} onChange={e => setName(e.target.value)}
                      className="pl-9 h-11 rounded-xl bg-muted/60 border-transparent focus-visible:bg-background focus-visible:border-primary/40 focus-visible:ring-primary/20 dark:bg-muted dark:focus-visible:bg-card" />
                  </div>
                  {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t("email_address")}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input type="email" placeholder="name@krushi.com" required
                      value={email} onChange={e => setEmail(e.target.value)}
                      className="pl-9 h-11 rounded-xl bg-muted/60 border-transparent focus-visible:bg-background focus-visible:border-primary/40 focus-visible:ring-primary/20 dark:bg-muted dark:focus-visible:bg-card" />
                  </div>
                  {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t("password")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <Input type="password" placeholder="Create password" required
                      value={password} onChange={e => setPassword(e.target.value)}
                      className="pl-9 h-11 rounded-xl bg-muted/60 border-transparent focus-visible:bg-background focus-visible:border-primary/40 focus-visible:ring-primary/20 dark:bg-muted dark:focus-visible:bg-card" />
                  </div>
                  {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                </div>

                <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl font-semibold text-[15px] mt-1">
                  {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                  {loading ? "Creating account…" : t("sign_up") || "Create Account"}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-5">
                {t("already_have_account") || "Already have an account?"}{" "}
                <button type="button" onClick={onSwitchToLogin}
                  className="text-primary font-semibold hover:opacity-70 transition-opacity bg-transparent border-none cursor-pointer">
                  {t("sign_in")}
                </button>
              </p>
            </div>

            {/* ── Hero panel — desktop only ── */}
            <div className="hidden md:flex flex-col relative overflow-hidden"
              style={{ background: "linear-gradient(155deg,hsl(141,62%,22%) 0%,hsl(141,50%,15%) 60%,hsl(200,60%,14%) 100%)", minHeight: 380 }}>
              <div className="absolute top-[12%] right-[-8%] w-52 h-52 rounded-full blur-[60px] pointer-events-none"
                style={{ background: "rgba(52,199,89,0.18)" }} />
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
                style={{ backgroundImage: "radial-gradient(circle at 1.5px 1.5px,white 1.5px,transparent 0)", backgroundSize: "20px 20px" }} />
              <div className="relative z-10 flex flex-col items-center justify-center h-full p-9 text-white text-center">
                <div className="hig-app-icon flex items-center justify-center mb-5"
                  style={{ width: 76, height: 76, background: "rgba(255,255,255,.12)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,.20)", boxShadow: "0 12px 40px rgba(0,0,0,.28),inset 0 1px 0 rgba(255,255,255,.28)" }}>
                  <Sprout className="h-9 w-9 text-white" />
                </div>
                <h2 className="text-2xl font-bold tracking-tight leading-tight mb-2">Join the<br />Community</h2>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)", maxWidth: 190 }}>
                  Trusted by 5000+ farmers across Maharashtra
                </p>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

      <p className="text-center text-[11px] text-muted-foreground/40 mt-3">
        By signing up you agree to our{" "}
        <a href="#" className="underline hover:text-muted-foreground">{t("terms")}</a>{" "}and{" "}
        <a href="#" className="underline hover:text-muted-foreground">{t("privacy")}</a>.
      </p>
    </div>
  )
}
