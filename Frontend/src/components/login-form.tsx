import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Lock, Mail, Sprout } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

interface LoginFormProps extends React.ComponentProps<"div"> {
  onLogin: (e: React.FormEvent) => void
  onSwitchToSignup: () => void
  loading: boolean
  email: string
  setEmail: (email: string) => void
  password: string
  setPassword: (password: string) => void
  errors: { email?: string; password?: string }
}

export function LoginForm({
  className,
  onLogin,
  onSwitchToSignup,
  loading,
  email,
  setEmail,
  password,
  setPassword,
  errors,
  ...props
}: LoginFormProps) {
  const { t } = useTranslation()

  return (
    <div className={cn("w-full", className)} {...props}>
      {/* Card */}
      <div className="bg-card rounded-3xl shadow-strong border border-border/50 overflow-hidden">
        <div className="grid md:grid-cols-2">

          {/* Left: Form */}
          <div className="p-8 md:p-10">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25">
                <Sprout className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-sm font-extrabold text-foreground">Krushi Kendra</p>
                <p className="text-xs text-muted-foreground font-medium">Management Portal</p>
              </div>
            </div>

            <h1 className="text-2xl font-extrabold text-foreground mb-1 tracking-tight">{t('welcome_back')}</h1>
            <p className="text-sm text-muted-foreground mb-7">{t('login_subtitle') || 'Sign in to your account'}</p>

            {/* Demo hint */}
            <button
              type="button"
              onClick={() => { setEmail('admin@krushi.com'); setPassword('password123'); }}
              className="w-full mb-6 p-3.5 bg-primary/5 border border-primary/15 rounded-2xl text-left hover:bg-primary/10 transition-colors group"
            >
              <p className="text-xs font-semibold text-primary">{t('login_hint') || '🔑 Click to use demo credentials'}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">admin@krushi.com · password123</p>
            </button>

            <form onSubmit={onLogin} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('email_address')}</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@krushi.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 rounded-xl bg-muted/50 border-transparent focus-visible:ring-primary/20 focus-visible:border-primary/30 focus-visible:bg-background transition-all text-sm"
                  />
                </div>
                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{t('password')}</Label>
                  <a href="#" className="text-xs text-primary hover:underline font-medium">{t('forgot_password')}</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 rounded-xl bg-muted/50 border-transparent focus-visible:ring-primary/20 focus-visible:border-primary/30 focus-visible:bg-background transition-all text-sm"
                  />
                </div>
                {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-xl font-semibold text-sm shadow-lg shadow-primary/20 transition-all hover:shadow-primary/30 hover:scale-[1.01] active:scale-[0.99] mt-2"
                disabled={loading}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loading ? 'Signing in...' : t('sign_in')}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border/50"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-card px-3 text-xs text-muted-foreground font-medium">{t('or_continue_with') || 'or'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" type="button" className="h-10 rounded-xl border-border/60 text-sm font-medium hover:bg-muted">
                Google
              </Button>
              <Button variant="outline" type="button" className="h-10 rounded-xl border-border/60 text-sm font-medium hover:bg-muted">
                Meta
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
              {t('dont_have_account')}{' '}
              <button type="button" onClick={onSwitchToSignup} className="text-primary font-semibold hover:underline">
                {t('sign_up')}
              </button>
            </p>
          </div>

          {/* Right: Hero Image */}
          <div className="relative hidden md:block bg-primary overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2070&auto=format&fit=crop"
              alt="Agriculture"
              className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-luminosity"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-emerald-900/80" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-10 text-white text-center">
              <div className="h-16 w-16 rounded-3xl bg-white/15 backdrop-blur-sm flex items-center justify-center mb-6 border border-white/20">
                <Sprout className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight leading-tight mb-3">
                Empowering<br />Farmers
              </h2>
              <p className="text-sm text-white/70 font-medium max-w-48">
                Next-generation Krushi Kendra management system
              </p>

              {/* Stats */}
              <div className="mt-10 grid grid-cols-2 gap-3 w-full max-w-48">
                {[{ v: '5000+', l: 'Farmers' }, { v: '100%', l: 'Trusted' }, { v: '24/7', l: 'Support' }, { v: '10+', l: 'Years' }].map((s, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
                    <p className="text-xl font-extrabold text-white">{s.v}</p>
                    <p className="text-xs text-white/60 font-medium">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground/60 mt-5">
        By signing in, you agree to our{' '}
        <a href="#" className="underline hover:text-muted-foreground">{t('terms')}</a>{' '}
        and <a href="#" className="underline hover:text-muted-foreground">{t('privacy')}</a>.
      </p>
    </div>
  )
}
