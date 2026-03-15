import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/auth"
import { toast } from "@/lib/toast"
import { LoginForm } from "@/components/login-form"
import { SignupForm } from "@/components/signup-form"

export default function AdminLogin() {
  const [isLogin, setIsLogin]   = useState(true)
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [name, setName]         = useState("")
  const [loading, setLoading]   = useState(false)
  const [errors, setErrors]     = useState<Record<string, string>>({})
  const navigate                = useNavigate()
  const { login, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) navigate("/admin/dashboard", { replace: true })
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setErrors({})
    const errs: Record<string, string> = {}
    if (!email.trim()) errs.email = "Email required"
    if (!password)     errs.password = "Password required"
    if (!isLogin && !name.trim()) errs.name = "Name required"
    if (Object.keys(errs).length) { setErrors(errs); return }
    setLoading(true)
    try {
      const u = login(email, password)
      if (u) {
        toast.success(`Welcome back, ${u.name}!`)
        navigate("/admin/dashboard", { replace: true })
      } else {
        toast.error("Invalid credentials — please try again")
        setErrors({ general: "Invalid credentials" })
      }
    } finally { setLoading(false) }
  }

  return (
    /*
      Full-screen, scrollable.
      bg-muted gives the iOS systemGroupedBackground feel in both modes.
      No ThemeToggle (removed per request).
    */
    <div className="min-h-screen bg-muted/50 dark:bg-background overflow-y-auto flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-sm md:max-w-2xl">
        {isLogin ? (
          <LoginForm
            email={email}       setEmail={setEmail}
            password={password} setPassword={setPassword}
            loading={loading}   onLogin={handleSubmit}
            onSwitchToSignup={() => { setIsLogin(false); setErrors({}) }}
            errors={errors}
          />
        ) : (
          <SignupForm
            name={name}         setName={setName}
            email={email}       setEmail={setEmail}
            password={password} setPassword={setPassword}
            loading={loading}   onSignup={handleSubmit}
            onSwitchToLogin={() => { setIsLogin(true); setErrors({}) }}
            errors={errors}
          />
        )}
      </div>
    </div>
  )
}
