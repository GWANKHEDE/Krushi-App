import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useAuth } from "@/lib/auth"
import { toast } from "@/lib/toast"
import { LoginForm } from "@/components/login-form"
import { SignupForm } from "@/components/signup-form"

export default function AdminLogin() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string,string>>({})
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()

  useEffect(() => { if (isAuthenticated) navigate("/admin/dashboard", { replace:true }) }, [isAuthenticated])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (loading) return
    setErrors({})
    const errs: Record<string,string> = {}
    if (!email.trim()) errs.email = "Email required"
    if (!password) errs.password = "Password required"
    if (!isLogin && !name.trim()) errs.name = "Full name required"
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const u = login(email, password)
      if (u) { toast.success(`Welcome back, ${u.name}!`); navigate("/admin/dashboard", { replace:true }) }
      else { toast.error("Invalid credentials"); setErrors({ general:"Invalid credentials" }) }
    } finally { setLoading(false) }
  }

  return (
    /* Full-page gradient — same iOS wallpaper approach */
    <div style={{ minHeight:"100vh", display:"flex", flexDirection:"column",
      background:`
        radial-gradient(ellipse 100% 70% at 0% 0%,   rgba(52,199,89,0.14) 0%, transparent 55%),
        radial-gradient(ellipse 70%  70% at 100% 0%,  rgba(0,122,255,0.10) 0%, transparent 50%),
        radial-gradient(ellipse 90%  50% at 50% 100%, rgba(175,82,222,0.07) 0%, transparent 55%),
        hsl(var(--background))` }}>
      <div style={{ display:"flex", justifyContent:"flex-end", padding:"12px 16px" }}>
        <ThemeToggle />
      </div>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"0 16px 48px" }}>
        <div className="page-in" style={{ width:"100%", maxWidth:360 }} id="loginWrap">
          <style>{`@media(min-width:768px){#loginWrap{max-width:780px}}`}</style>
          {isLogin ? (
            <LoginForm email={email} setEmail={setEmail} password={password} setPassword={setPassword}
              loading={loading} onLogin={handleSubmit}
              onSwitchToSignup={() => { setIsLogin(false); setErrors({}) }} errors={errors} />
          ) : (
            <SignupForm name={name} setName={setName} email={email} setEmail={setEmail}
              password={password} setPassword={setPassword} loading={loading} onSignup={handleSubmit}
              onSwitchToLogin={() => { setIsLogin(true); setErrors({}) }} errors={errors} />
          )}
        </div>
      </div>
    </div>
  )
}
