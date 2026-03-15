import { cn } from "@/lib/utils"
import { Loader2, Lock, Mail, Sprout, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

interface LoginFormProps extends React.ComponentProps<"div"> {
  onLogin: (e: React.FormEvent) => void
  onSwitchToSignup: () => void
  loading: boolean
  email: string
  setEmail: (v: string) => void
  password: string
  setPassword: (v: string) => void
  errors: { email?: string; password?: string }
}

export function LoginForm({ className, onLogin, onSwitchToSignup, loading, email, setEmail, password, setPassword, errors, ...props }: LoginFormProps) {
  const { t } = useTranslation()
  const [showPw, setShowPw] = useState(false)

  return (
    <div className={cn("w-full", className)} {...props}>
      {/* Card */}
      <div className="bg-card rounded-[2rem] overflow-hidden"
           style={{ boxShadow: 'var(--shadow-modal)' }}>
        <div className="grid md:grid-cols-2">

          {/* ── Left: Form ── */}
          <div className="p-8 md:p-10">

            {/* Logo row */}
            <div className="flex items-center gap-3 mb-8">
              <div className="ios-icon ios-icon-lg bg-primary text-primary-foreground shadow-[0_6px_16px_hsl(var(--primary)/0.4)]">
                <Sprout className="h-6 w-6" />
              </div>
              <div>
                <p className="text-[16px] font-bold text-foreground tracking-tight">Krushi Kendra</p>
                <p className="text-[12px] text-muted-foreground">Management Portal</p>
              </div>
            </div>

            <h1 className="text-[28px] font-bold text-foreground tracking-tight mb-1">{t('welcome_back')}</h1>
            <p className="text-[14px] text-muted-foreground mb-6 leading-relaxed">{t('login_subtitle') || 'Sign in to continue to your dashboard'}</p>

            {/* Demo credential hint — iOS grouped row style */}
            <button
              type="button"
              onClick={() => { setEmail('admin@krushi.com'); setPassword('password123') }}
              className="w-full mb-5 ios-group-row rounded-2xl border border-border/50 bg-muted/40 hover:bg-primary/5 hover:border-primary/20 transition-colors group text-left"
            >
              <div className="ios-icon ios-icon-sm bg-primary/10 text-primary flex-shrink-0">
                <span className="text-sm">🔑</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-foreground group-hover:text-primary transition-colors">Use demo credentials</p>
                <p className="text-[11px] text-muted-foreground truncate">admin@krushi.com · password123</p>
              </div>
              <span className="text-[11px] text-primary/60 font-medium">Tap</span>
            </button>

            <form onSubmit={onLogin} className="space-y-3">
              {/* Email */}
              <div>
                <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">{t('email_address')}</label>
                <div className="ios-input-wrap flex items-center px-3.5 gap-2.5">
                  <Mail className="h-[15px] w-[15px] text-muted-foreground flex-shrink-0" />
                  <input
                    type="email"
                    placeholder="name@krushi.com"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-[14px] py-3 text-foreground placeholder:text-muted-foreground/50"
                  />
                </div>
                {errors.email && <p className="text-[11px] text-destructive mt-1 ml-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wider">{t('password')}</label>
                  <a href="#" className="text-[12px] text-primary hover:opacity-70 transition-opacity font-medium">{t('forgot_password')}</a>
                </div>
                <div className="ios-input-wrap flex items-center px-3.5 gap-2.5">
                  <Lock className="h-[15px] w-[15px] text-muted-foreground flex-shrink-0" />
                  <input
                    type={showPw ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="flex-1 bg-transparent border-none outline-none text-[14px] py-3 text-foreground placeholder:text-muted-foreground/50"
                    placeholder="••••••••"
                  />
                  <button type="button" onClick={() => setShowPw(p => !p)} className="text-muted-foreground/60 hover:text-muted-foreground transition-colors flex-shrink-0">
                    {showPw ? <EyeOff className="h-[15px] w-[15px]" /> : <Eye className="h-[15px] w-[15px]" />}
                  </button>
                </div>
                {errors.password && <p className="text-[11px] text-destructive mt-1 ml-1">{errors.password}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 h-12 rounded-2xl bg-primary text-primary-foreground font-semibold text-[15px] flex items-center justify-center gap-2
                           shadow-[0_4px_16px_hsl(var(--primary)/0.35)] hover:shadow-[0_6px_20px_hsl(var(--primary)/0.45)]
                           hover:bg-[hsl(var(--primary)/.9)] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loading ? 'Signing in…' : t('sign_in')}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-border/50" />
              <span className="text-[12px] text-muted-foreground">{t('or_continue_with') || 'or'}</span>
              <div className="flex-1 h-px bg-border/50" />
            </div>

            {/* Social */}
            <div className="grid grid-cols-2 gap-3">
              {['Google', 'Meta'].map(p => (
                <button key={p} type="button"
                  className="h-11 rounded-2xl border border-border/70 bg-muted/30 text-[13px] font-semibold text-foreground hover:bg-muted transition-colors">
                  {p}
                </button>
              ))}
            </div>

            <p className="text-center text-[13px] text-muted-foreground mt-5">
              {t('dont_have_account')}{' '}
              <button type="button" onClick={onSwitchToSignup} className="text-primary font-semibold hover:opacity-70 transition-opacity">
                {t('sign_up')}
              </button>
            </p>
          </div>

          {/* ── Right: iOS-style hero panel ── */}
          <div className="relative hidden md:flex flex-col overflow-hidden bg-gradient-to-br from-[hsl(141_62%_28%)] via-[hsl(141_52%_25%)] to-[hsl(141_45%_18%)]">
            {/* Background texture */}
            <div className="absolute inset-0 opacity-[0.06]"
                 style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

            {/* Glow blobs */}
            <div className="absolute top-1/4 -right-16 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute bottom-1/4 -left-8 w-48 h-48 rounded-full bg-white/5 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center justify-center h-full p-10 text-white text-center">
              {/* App icon */}
              <div className="h-20 w-20 rounded-[28px] bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center mb-7
                              shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
                <Sprout className="h-10 w-10 text-white" />
              </div>

              <h2 className="text-[28px] font-bold tracking-tight leading-tight mb-2">Empowering<br />Farmers</h2>
              <p className="text-[13px] text-white/60 font-medium mb-10 max-w-[180px] leading-relaxed">
                Next-generation agriculture business management
              </p>

              {/* Stats grid — iOS widget style */}
              <div className="grid grid-cols-2 gap-3 w-full max-w-[220px]">
                {[
                  { v: '5000+', l: 'Farmers' },
                  { v: '100%',  l: 'Trusted' },
                  { v: '24/7',  l: 'Support' },
                  { v: '10+',   l: 'Years' },
                ].map((s, i) => (
                  <div key={i} className="bg-white/8 backdrop-blur-sm rounded-2xl p-3.5 border border-white/10 text-left">
                    <p className="text-[22px] font-bold text-white leading-none">{s.v}</p>
                    <p className="text-[11px] text-white/50 font-medium mt-1">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Terms */}
      <p className="text-center text-[11px] text-muted-foreground/50 mt-4">
        By signing in, you agree to our{' '}
        <a href="#" className="underline hover:text-muted-foreground">{t('terms')}</a>{' and '}
        <a href="#" className="underline hover:text-muted-foreground">{t('privacy')}</a>.
      </p>
    </div>
  )
}
