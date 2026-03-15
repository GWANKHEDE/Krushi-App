import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useAuth } from '@/lib/auth'
import { toast } from '@/lib/toast'
import { LoginForm } from '@/components/login-form'
import { SignupForm } from '@/components/signup-form'

export default function AdminLogin() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()

  useEffect(() => {
    if (isAuthenticated) navigate('/admin/dashboard', { replace: true })
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setErrors({})

    const errs: Record<string, string> = {}
    if (!email.trim()) errs.email = 'Email required'
    if (!password) errs.password = 'Password required'
    if (!isLogin && !name.trim()) errs.name = 'Full name required'
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    try {
      const u = login(email, password)
      if (u) {
        toast.success(`Welcome back, ${u.name}!`)
        navigate('/admin/dashboard', { replace: true })
      } else {
        toast.error('Invalid credentials — please try again.')
        setErrors({ general: 'Invalid credentials' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    /* iOS-like off-white background */
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex justify-end p-4">
        <ThemeToggle />
      </div>
      <div className="flex-1 flex items-center justify-center px-4 pb-10">
        <div className="w-full max-w-[340px] md:max-w-[780px] ios-page">
          {isLogin ? (
            <LoginForm
              email={email} setEmail={setEmail}
              password={password} setPassword={setPassword}
              loading={loading} onLogin={handleSubmit}
              onSwitchToSignup={() => { setIsLogin(false); setErrors({}) }}
              errors={errors}
            />
          ) : (
            <SignupForm
              name={name} setName={setName}
              email={email} setEmail={setEmail}
              password={password} setPassword={setPassword}
              loading={loading} onSignup={handleSubmit}
              onSwitchToLogin={() => { setIsLogin(true); setErrors({}) }}
              errors={errors}
            />
          )}
        </div>
      </div>
    </div>
  )
}
