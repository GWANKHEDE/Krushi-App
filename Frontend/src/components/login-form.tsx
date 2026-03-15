import { cn } from "@/lib/utils"
import { Loader2, Lock, Mail, Sprout, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

interface Props extends React.ComponentProps<"div"> {
  onLogin: (e: React.FormEvent) => void; onSwitchToSignup: () => void
  loading: boolean; email: string; setEmail: (v:string)=>void
  password: string; setPassword: (v:string)=>void; errors: { email?:string; password?:string }
}

export function LoginForm({ className, onLogin, onSwitchToSignup, loading, email, setEmail, password, setPassword, errors, ...props }: Props) {
  const { t } = useTranslation()
  const [showPw, setShowPw] = useState(false)

  return (
    <div className={cn("w-full", className)} {...props}>
      {/* Outer glass card */}
      <div className="glass-heavy" style={{ borderRadius:26, overflow:"hidden" }}>
        <div className="grid md:grid-cols-2">

          {/* ── Form ── */}
          <div style={{ padding:"38px 34px", position:"relative", zIndex:2 }}>

            {/* App icon row */}
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
              <div className="icon-xl icon-app"
                style={{ background:"linear-gradient(145deg,#3ab26a,#27854d)", boxShadow:"0 6px 20px rgba(52,199,89,.35), inset 0 1px 0 rgba(255,255,255,.25)" }}>
                <Sprout style={{ width:28, height:28, color:"white" }} />
              </div>
              <div>
                <p className="t-headline" style={{ color:"hsl(var(--foreground))" }}>Krushi Kendra</p>
                <p className="t-caption-1" style={{ color:"hsl(var(--muted-foreground))", marginTop:2 }}>Management Portal</p>
              </div>
            </div>

            <h1 className="t-title-1" style={{ color:"hsl(var(--foreground))", marginBottom:6 }}>{t("welcome_back")}</h1>
            <p className="t-callout" style={{ color:"hsl(var(--muted-foreground))", marginBottom:24, lineHeight:1.6 }}>
              {t("login_subtitle") || "Sign in to your dashboard"}
            </p>

            {/* Demo hint — glass row */}
            <button type="button" onClick={() => { setEmail("admin@krushi.com"); setPassword("password123") }}
              className="glass" style={{ width:"100%", padding:"11px 14px", borderRadius:14, marginBottom:20, display:"flex", alignItems:"center", gap:10, cursor:"pointer", textAlign:"left", border:"1px solid var(--glass-border)" }}>
              <div style={{ position:"relative", zIndex:2, display:"flex", alignItems:"center", gap:10, width:"100%" }}>
                <span style={{ fontSize:20, flexShrink:0 }}>🔑</span>
                <div>
                  <p className="t-footnote" style={{ fontWeight:600, color:"hsl(var(--foreground))" }}>Use demo credentials</p>
                  <p className="t-caption-2" style={{ color:"hsl(var(--muted-foreground))", marginTop:2 }}>admin@krushi.com · password123</p>
                </div>
              </div>
            </button>

            <form onSubmit={onLogin} style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {/* Email */}
              <div>
                <p className="t-label" style={{ color:"hsl(var(--muted-foreground))", marginBottom:7 }}>{t("email_address")}</p>
                <div className="field-wrap">
                  <Mail style={{ width:16,height:16,color:"hsl(var(--muted-foreground))",flexShrink:0 }} />
                  <input type="email" placeholder="name@krushi.com" required value={email} onChange={e=>setEmail(e.target.value)} />
                </div>
                {errors.email && <p className="t-caption-1" style={{ color:"#FF3B30",marginTop:4,marginLeft:2 }}>{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:7 }}>
                  <p className="t-label" style={{ color:"hsl(var(--muted-foreground))" }}>{t("password")}</p>
                  <a href="#" className="t-footnote hover:opacity-70 transition-opacity" style={{ color:"var(--sys-blue)", textDecoration:"none" }}>{t("forgot_password")}</a>
                </div>
                <div className="field-wrap">
                  <Lock style={{ width:16,height:16,color:"hsl(var(--muted-foreground))",flexShrink:0 }} />
                  <input type={showPw?"text":"password"} required value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" />
                  <button type="button" onClick={()=>setShowPw(p=>!p)} style={{ color:"hsl(var(--muted-foreground))",flexShrink:0 }} className="hover:opacity-70 transition-opacity">
                    {showPw ? <EyeOff style={{ width:16,height:16 }} /> : <Eye style={{ width:16,height:16 }} />}
                  </button>
                </div>
                {errors.password && <p className="t-caption-1" style={{ color:"#FF3B30",marginTop:4,marginLeft:2 }}>{errors.password}</p>}
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} className="btn btn-filled btn-pill w-full" style={{ marginTop:2, height:52, fontSize:"1.0625rem" }}>
                {loading && <Loader2 style={{ width:18,height:18 }} className="animate-spin" />}
                {loading ? "Signing in…" : t("sign_in")}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display:"flex",alignItems:"center",gap:12,margin:"22px 0" }}>
              <div style={{ flex:1,height:"0.5px",background:"rgba(60,60,67,.18)" }} />
              <span className="t-footnote" style={{ color:"hsl(var(--muted-foreground))" }}>{t("or_continue_with")||"or"}</span>
              <div style={{ flex:1,height:"0.5px",background:"rgba(60,60,67,.18)" }} />
            </div>

            {/* Social glass buttons */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
              {["Google","Meta"].map(p => (
                <button key={p} type="button" className="btn btn-glass btn-sm" style={{ height:44, fontSize:14 }}>{p}</button>
              ))}
            </div>

            <p className="t-footnote" style={{ textAlign:"center",color:"hsl(var(--muted-foreground))",marginTop:20 }}>
              {t("dont_have_account")}{" "}
              <button type="button" onClick={onSwitchToSignup} className="hover:opacity-70 transition-opacity" style={{ color:"var(--sys-blue)",fontWeight:500,background:"none",border:"none",cursor:"pointer",fontSize:"inherit" }}>
                {t("sign_up")}
              </button>
            </p>
          </div>

          {/* ── Hero panel ── */}
          <div className="relative hidden md:flex flex-col overflow-hidden"
               style={{ background:"linear-gradient(150deg,#1e6b3a 0%,#14502b 50%,#0d3d20 100%)" }}>
            {/* Subtle dot texture */}
            <div style={{ position:"absolute",inset:0,opacity:.04,
              backgroundImage:"radial-gradient(circle at 1.5px 1.5px,white 1.5px,transparent 0)",backgroundSize:"18px 18px" }} />
            {/* Glow orbs */}
            <div style={{ position:"absolute",width:300,height:300,borderRadius:"50%",background:"radial-gradient(circle,rgba(52,199,89,.18) 0%,transparent 70%)",top:"-80px",right:"-60px",filter:"blur(32px)" }} />
            <div style={{ position:"absolute",width:200,height:200,borderRadius:"50%",background:"radial-gradient(circle,rgba(0,122,255,.12) 0%,transparent 70%)",bottom:"-40px",left:"-40px",filter:"blur(24px)" }} />

            <div style={{ position:"relative",zIndex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",padding:"44px 32px",color:"white",textAlign:"center" }}>

              {/* App icon — hero size */}
              <div style={{ width:88,height:88,borderRadius:"22.37%",background:"rgba(255,255,255,.10)",backdropFilter:"blur(16px)",border:"1px solid rgba(255,255,255,.18)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24,boxShadow:"0 12px 40px rgba(0,0,0,.30),inset 0 1px 0 rgba(255,255,255,.20)" }}>
                <Sprout style={{ width:42,height:42,color:"white" }} />
              </div>

              <h2 className="t-title-1" style={{ letterSpacing:"-0.022em",marginBottom:8 }}>Empowering<br />Farmers</h2>
              <p className="t-subhead" style={{ color:"rgba(255,255,255,.55)",lineHeight:1.6,maxWidth:200,marginBottom:36 }}>
                Next-generation agriculture business management
              </p>

              {/* Stats — glass mini-widgets */}
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,width:"100%",maxWidth:230 }}>
                {[{v:"5000+",l:"Farmers"},{v:"100%",l:"Trusted"},{v:"24/7",l:"Support"},{v:"10+",l:"Years"}].map((s,i)=>(
                  <div key={i} style={{ background:"rgba(255,255,255,.07)",backdropFilter:"blur(12px)",borderRadius:16,padding:"14px 16px",border:"1px solid rgba(255,255,255,.10)",textAlign:"left",boxShadow:"inset 0 1px 0 rgba(255,255,255,.08)" }}>
                    <p className="t-title-2" style={{ color:"white",letterSpacing:"-0.02em" }}>{s.v}</p>
                    <p className="t-caption-1" style={{ color:"rgba(255,255,255,.45)",marginTop:3 }}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <p className="t-caption-2" style={{ textAlign:"center",color:"hsl(var(--muted-foreground))",opacity:.5,marginTop:14 }}>
        By signing in, you agree to our <a href="#" style={{ color:"inherit",textDecoration:"underline" }}>{t("terms")}</a> and <a href="#" style={{ color:"inherit",textDecoration:"underline" }}>{t("privacy")}</a>.
      </p>
    </div>
  )
}
