import { useState, useEffect } from "react"
import { Outlet, Link, useLocation } from "react-router-dom"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ThemeToggle } from "@/components/ThemeToggle"
import { Menu, Sprout, House, ShoppingCart, User, LogIn, X, ChevronRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import { LanguageSwitcher } from "./LanguageSwitcher"
import { cn } from "@/lib/utils"

const NAV = [
  { name:"home",     href:"/",         icon:House },
  { name:"products", href:"/products", icon:ShoppingCart },
  { name:"about",    href:"/about",    icon:Sprout },
  { name:"contact",  href:"/contact",  icon:User },
]
const defaultBiz = { name:"Krushi Seva Kendra", address:"Penur, Tq Purna, Parbhani, MH 431511", phone:"+91 9823332198", email:"info@krushisevakendra.com", logo:undefined as string|undefined }

export function Layout() {
  const [open,setOpen] = useState(false)
  const [scrolled,setScrolled] = useState(false)
  const location = useLocation()
  const { t } = useTranslation()
  const [biz,setBiz] = useState(defaultBiz)

  useEffect(() => {
    try { const u=JSON.parse(localStorage.getItem("user")||"{}"); if(u?.business) setBiz(p=>({...p,name:u.business.name||p.name,address:u.business.address||p.address,phone:u.business.contactNumber||p.phone,email:u.business.email||p.email,logo:u.business.logo||undefined})) } catch {}
  },[location.pathname])

  useEffect(() => { const fn=()=>setScrolled(window.scrollY>8); window.addEventListener("scroll",fn,{passive:true}); return()=>window.removeEventListener("scroll",fn) },[])

  const isActive = (p:string) => location.pathname===p

  return (
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column", background:"hsl(var(--background))" }}>

      {/* Glass nav bar */}
      <header className={`glass-navbar sticky top-0 z-50 transition-all duration-300 ${scrolled?"shadow-[0_2px_20px_rgba(0,0,0,0.08)]":""}`}
        style={{ height:44 }}>
        <div style={{ display:"flex",height:"100%",alignItems:"center",justifyContent:"space-between",padding:"0 16px",maxWidth:1280,margin:"0 auto",width:"100%" }}>

          <Link to="/" style={{ display:"flex",alignItems:"center",gap:8,textDecoration:"none" }}>
            <div className="icon-sm icon-app" style={{ background:"linear-gradient(145deg,#3ab26a,#27854d)",boxShadow:"0 2px 8px rgba(52,199,89,.30)" }}>
              <Sprout style={{ width:15,height:15,color:"white" }} />
            </div>
            <span className="t-headline truncate" style={{ color:"hsl(var(--foreground))",maxWidth:200 }}>{biz.name}</span>
          </Link>

          <nav className="hidden md:flex items-center" style={{ gap:2 }}>
            {NAV.map(item=>(
              <Link key={item.name} to={item.href}
                className="hover:text-foreground transition-colors"
                style={{ padding:"5px 12px",borderRadius:8,fontSize:14,fontWeight:isActive(item.href)?600:400,letterSpacing:"-0.005em",color:isActive(item.href)?"hsl(var(--primary))":"hsl(var(--muted-foreground))",background:isActive(item.href)?"hsl(var(--primary)/.08)":"transparent",textDecoration:"none",transition:"all .12s" }}>
                {t(item.name)}
              </Link>
            ))}
          </nav>

          <div style={{ display:"flex",alignItems:"center",gap:6 }}>
            <LanguageSwitcher /><ThemeToggle />
            <Link to="/admin/login" className="hidden md:flex hover:opacity-90 transition-opacity active:scale-95"
              style={{ display:"flex",alignItems:"center",gap:5,height:30,padding:"0 14px",borderRadius:999,background:"hsl(var(--primary))",color:"white",fontSize:13,fontWeight:600,textDecoration:"none",boxShadow:"0 2px 10px hsl(var(--primary)/.30)" }}>
              <LogIn style={{ width:13,height:13 }} />{t("admin_login")}
            </Link>

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <button style={{ width:32,height:32,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(120,120,128,.12)",color:"hsl(var(--muted-foreground))" }}>
                  {open?<X style={{ width:17,height:17 }} />:<Menu style={{ width:17,height:17 }} />}
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="glass-heavy border-none" style={{ width:280,padding:0,boxShadow:"var(--glass-shadow-lg)" }}>
                <div style={{ padding:"16px",borderBottom:"0.5px solid rgba(60,60,67,.14)" }}>
                  <div style={{ display:"flex",alignItems:"center",gap:8 }}>
                    <div className="icon-sm icon-app" style={{ background:"linear-gradient(145deg,#3ab26a,#27854d)" }}><Sprout style={{ width:16,height:16,color:"white" }} /></div>
                    <span className="t-headline" style={{ color:"hsl(var(--foreground))" }}>{biz.name}</span>
                  </div>
                </div>
                <div style={{ padding:"8px",position:"relative",zIndex:2 }}>
                  {NAV.map(item=>(
                    <Link key={item.name} to={item.href} onClick={()=>setOpen(false)}
                      style={{ display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 14px",borderRadius:10,marginBottom:2,fontSize:16,fontWeight:isActive(item.href)?600:400,color:isActive(item.href)?"hsl(var(--primary))":"hsl(var(--foreground))",background:isActive(item.href)?"hsl(var(--primary)/.08)":"transparent",textDecoration:"none" }}
                      className="hover:bg-black/4 dark:hover:bg-white/5 transition-colors">
                      <span>{t(item.name)}</span>
                      {isActive(item.href)&&<ChevronRight style={{ width:14,height:14,opacity:.4 }} />}
                    </Link>
                  ))}
                  <div style={{ height:"0.5px",background:"rgba(60,60,67,.12)",margin:"8px 0" }} />
                  <Link to="/admin/login" onClick={()=>setOpen(false)} style={{ display:"flex",alignItems:"center",gap:8,padding:"11px 14px",borderRadius:10,fontSize:15,fontWeight:500,color:"hsl(var(--primary))",background:"hsl(var(--primary)/.08)",textDecoration:"none" }}>
                    <LogIn style={{ width:16,height:16 }} />{t("admin_login")}
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main style={{ flex:1,position:"relative" }}>
        {biz.logo&&<div className="fixed inset-0 pointer-events-none flex items-center justify-center z-0" aria-hidden><img src={biz.logo} alt="" style={{ width:"28%",maxWidth:260,objectFit:"contain",filter:"grayscale(1)",opacity:.02 }} /></div>}
        <div style={{ position:"relative",zIndex:1 }}><Outlet /></div>
      </main>

      <footer style={{ background:"var(--glass-bg)",backdropFilter:"var(--glass-blur)",WebkitBackdropFilter:"var(--glass-blur)",borderTop:"0.5px solid rgba(60,60,67,.15)" }}>
        <div style={{ maxWidth:1280,margin:"0 auto",padding:"32px 20px" }}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div>
              <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
                <div className="icon-xs icon-app" style={{ background:"hsl(var(--primary))" }}><Sprout style={{ width:13,height:13,color:"white" }} /></div>
                <span className="t-callout" style={{ fontWeight:600 }}>{biz.name}</span>
              </div>
              <p className="t-footnote" style={{ color:"hsl(var(--muted-foreground))",lineHeight:1.6 }}>Your trusted partner in agriculture.</p>
            </div>
            <div>
              <p className="t-label" style={{ color:"hsl(var(--muted-foreground))",marginBottom:10 }}>{t("quick_links")}</p>
              <div style={{ display:"flex",flexDirection:"column",gap:7 }}>
                {["products","about","contact"].map(l=>(
                  <Link key={l} to={`/${l}`} className="t-footnote hover:text-foreground transition-colors" style={{ color:"hsl(var(--muted-foreground))",textDecoration:"none" }}>{t(l)}</Link>
                ))}
              </div>
            </div>
            <div>
              <p className="t-label" style={{ color:"hsl(var(--muted-foreground))",marginBottom:10 }}>Contact</p>
              {[["📍",biz.address],["📞",biz.phone],["✉️",biz.email]].map(([i,v],k)=>(
                <p key={k} className="t-footnote" style={{ color:"hsl(var(--muted-foreground))",display:"flex",gap:6,marginBottom:5 }}><span>{i}</span><span>{v}</span></p>
              ))}
            </div>
          </div>
          <div style={{ borderTop:"0.5px solid rgba(60,60,67,.12)",marginTop:24,paddingTop:18,textAlign:"center" }}>
            <p className="t-caption-1" style={{ color:"hsl(var(--muted-foreground))",opacity:.55 }}>© {new Date().getFullYear()} {biz.name}. {t("all_rights_reserved")}.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
