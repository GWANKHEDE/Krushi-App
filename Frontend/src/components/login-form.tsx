import { cn } from "@/lib/utils"
import { Loader2, Lock, Mail, Sprout, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

interface Props extends React.ComponentProps<"div"> {
  onLogin:(e:React.FormEvent)=>void; onSwitchToSignup:()=>void
  loading:boolean; email:string; setEmail:(v:string)=>void
  password:string; setPassword:(v:string)=>void
  errors:{email?:string;password?:string}
}

export function LoginForm({className,onLogin,onSwitchToSignup,loading,email,setEmail,password,setPassword,errors,...props}:Props){
  const {t}=useTranslation()
  const [showPw,setShowPw]=useState(false)

  return (
    <div className={cn("w-full",className)} {...props}>
      {/* Outer glass card */}
      <div className="glass hig-sheet-enter" style={{borderRadius:28,overflow:"hidden",boxShadow:"0 32px 80px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.85)"}}>
        <div className="grid md:grid-cols-2">

          {/* ── Form ── */}
          <div style={{padding:"40px 36px",background:"rgba(255,255,255,0.72)",backdropFilter:"saturate(180%) blur(28px)",WebkitBackdropFilter:"saturate(180%) blur(28px)"}}>

            {/* App icon + brand */}
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:32}}>
              <div style={{width:64,height:64,borderRadius:"22.37%",background:"hsl(var(--primary))",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,
                boxShadow:"0 6px 20px hsl(var(--primary)/.35), inset 0 1px 0 rgba(255,255,255,0.30)"}}>
                <Sprout style={{width:30,height:30,color:"white"}}/>
              </div>
              <div>
                <p style={{fontSize:17,fontWeight:600,color:"hsl(var(--foreground))",letterSpacing:"-0.01em"}}>Krushi Kendra</p>
                <p style={{fontSize:13,color:"hsl(var(--muted-foreground))",marginTop:1}}>Management Portal</p>
              </div>
            </div>

            <h1 style={{fontSize:28,fontWeight:700,color:"hsl(var(--foreground))",letterSpacing:"-0.022em",lineHeight:1.2,marginBottom:6}}>
              {t("welcome_back")}
            </h1>
            <p style={{fontSize:15,color:"hsl(var(--muted-foreground))",marginBottom:24,lineHeight:1.5}}>
              {t("login_subtitle")||"Sign in to your dashboard"}
            </p>

            {/* Demo hint — glass tinted row */}
            <button type="button" onClick={()=>{setEmail("admin@krushi.com");setPassword("password123")}}
              style={{display:"flex",alignItems:"center",gap:10,width:"100%",padding:"10px 14px",background:"rgba(52,199,89,0.08)",borderRadius:12,border:"1px solid rgba(52,199,89,0.15)",cursor:"pointer",marginBottom:20,textAlign:"left",transition:"all 0.12s"}}
              className="hover:bg-[rgba(52,199,89,0.13)] active:scale-[.98]">
              <span style={{fontSize:20,flexShrink:0}}>🔑</span>
              <div>
                <p style={{fontSize:13,fontWeight:600,color:"#34C759"}}>Use demo credentials</p>
                <p style={{fontSize:11,color:"hsl(var(--muted-foreground))",marginTop:1}}>admin@krushi.com · password123</p>
              </div>
            </button>

            <form onSubmit={onLogin} style={{display:"flex",flexDirection:"column",gap:14}}>
              {/* Email */}
              <div>
                <p style={{fontSize:11,fontWeight:600,color:"hsl(var(--muted-foreground))",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:7}}>
                  {t("email_address")}
                </p>
                <div className="hig-field-wrap">
                  <Mail style={{width:16,height:16,color:"hsl(var(--muted-foreground))",flexShrink:0}}/>
                  <input type="email" placeholder="name@krushi.com" required value={email} onChange={e=>setEmail(e.target.value)}/>
                </div>
                {errors.email&&<p style={{fontSize:12,color:"#FF3B30",marginTop:4,marginLeft:2}}>{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7}}>
                  <p style={{fontSize:11,fontWeight:600,color:"hsl(var(--muted-foreground))",textTransform:"uppercase",letterSpacing:"0.06em"}}>{t("password")}</p>
                  <a href="#" style={{fontSize:13,color:"#007AFF",textDecoration:"none"}} className="hover:opacity-70 transition-opacity dark:[color:#0A84FF]">{t("forgot_password")}</a>
                </div>
                <div className="hig-field-wrap">
                  <Lock style={{width:16,height:16,color:"hsl(var(--muted-foreground))",flexShrink:0}}/>
                  <input type={showPw?"text":"password"} required value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"/>
                  <button type="button" onClick={()=>setShowPw(p=>!p)} style={{color:"hsl(var(--muted-foreground))",flexShrink:0,background:"none",border:"none",cursor:"pointer",display:"flex"}} className="hover:opacity-70">
                    {showPw?<EyeOff style={{width:16,height:16}}/>:<Eye style={{width:16,height:16}}/>}
                  </button>
                </div>
                {errors.password&&<p style={{fontSize:12,color:"#FF3B30",marginTop:4,marginLeft:2}}>{errors.password}</p>}
              </div>

              {/* CTA button — filled glass */}
              <button type="submit" disabled={loading} className="hig-btn hig-btn-filled w-full" style={{marginTop:2,borderRadius:14}}>
                {loading&&<Loader2 style={{width:18,height:18}} className="animate-spin"/>}
                {loading?"Signing in…":t("sign_in")}
              </button>
            </form>

            {/* Divider */}
            <div style={{display:"flex",alignItems:"center",gap:12,margin:"22px 0"}}>
              <div style={{flex:1,height:"0.5px",background:"rgba(60,60,67,0.18)"}}/><span style={{fontSize:13,color:"hsl(var(--muted-foreground))"}}>{t("or_continue_with")||"or"}</span><div style={{flex:1,height:"0.5px",background:"rgba(60,60,67,0.18)"}}/></div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {["Google","Meta"].map(p=>(
                <button key={p} type="button" className="hig-btn hig-btn-glass hig-btn-sm" style={{borderRadius:12,height:42,fontSize:14}}>{p}</button>
              ))}
            </div>

            <p style={{textAlign:"center",fontSize:14,color:"hsl(var(--muted-foreground))",marginTop:20}}>
              {t("dont_have_account")}{" "}
              <button type="button" onClick={onSwitchToSignup} style={{color:"#007AFF",fontWeight:500,background:"none",border:"none",cursor:"pointer",fontSize:14}} className="hover:opacity-70 dark:[color:#0A84FF]">
                {t("sign_up")}
              </button>
            </p>
          </div>

          {/* ── Hero panel ── */}
          <div className="relative hidden md:flex flex-col overflow-hidden"
            style={{background:"linear-gradient(155deg, hsl(141,62%,24%) 0%, hsl(141,50%,16%) 60%, hsl(200,60%,15%) 100%)"}}>
            {/* Mesh glow blobs */}
            <div style={{position:"absolute",top:"15%",right:"-10%",width:260,height:260,borderRadius:"50%",background:"rgba(52,199,89,0.18)",filter:"blur(60px)",pointerEvents:"none"}}/>
            <div style={{position:"absolute",bottom:"20%",left:"-5%",width:200,height:200,borderRadius:"50%",background:"rgba(0,122,255,0.12)",filter:"blur(50px)",pointerEvents:"none"}}/>
            {/* Dot grid texture */}
            <div style={{position:"absolute",inset:0,opacity:.04,backgroundImage:"radial-gradient(circle at 1.5px 1.5px, white 1.5px, transparent 0)",backgroundSize:"20px 20px",pointerEvents:"none"}}/>

            <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",padding:"40px 32px",color:"white",textAlign:"center"}}>
              {/* Big app icon */}
              <div className="glass" style={{width:88,height:88,borderRadius:"22.37%",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:24,
                background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.20)",
                boxShadow:"0 12px 40px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.30)"}}>
                <Sprout style={{width:42,height:42,color:"white",position:"relative",zIndex:1}}/>
              </div>
              <h2 style={{fontSize:30,fontWeight:700,letterSpacing:"-0.022em",lineHeight:1.18,marginBottom:10}}>Empowering<br/>Farmers</h2>
              <p style={{fontSize:15,color:"rgba(255,255,255,0.52)",lineHeight:1.6,maxWidth:200,marginBottom:32}}>
                Next-generation agriculture business management
              </p>
              {/* Glass stat widgets */}
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,width:"100%",maxWidth:230}}>
                {[{v:"5000+",l:"Farmers"},{v:"100%",l:"Trusted"},{v:"24/7",l:"Support"},{v:"10+",l:"Years"}].map((s,i)=>(
                  <div key={i} style={{background:"rgba(255,255,255,0.09)",borderRadius:16,padding:"13px 14px",border:"1px solid rgba(255,255,255,0.12)",textAlign:"left",
                    backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",
                    boxShadow:"inset 0 1px 0 rgba(255,255,255,0.18)"}}>
                    <p style={{fontSize:24,fontWeight:700,letterSpacing:"-0.022em",lineHeight:1}}>{s.v}</p>
                    <p style={{fontSize:11,color:"rgba(255,255,255,0.48)",marginTop:4}}>{s.l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <p style={{textAlign:"center",fontSize:11,color:"hsl(var(--muted-foreground))",opacity:.45,marginTop:14}}>
        By signing in, you agree to our <a href="#" style={{textDecoration:"underline",color:"inherit"}}>{t("terms")}</a> and <a href="#" style={{textDecoration:"underline",color:"inherit"}}>{t("privacy")}</a>.
      </p>
    </div>
  )
}
