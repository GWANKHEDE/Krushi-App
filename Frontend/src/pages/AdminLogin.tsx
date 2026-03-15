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

    const newErrors: Record<string, string> = {}
    if (!email.trim()) newErrors.email = 'Email is required'
    if (!password) newErrors.password = 'Password is required'
    if (!isLogin && !name.trim()) newErrors.name = 'Full name is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const loggedInUser = login(email, password)
      if (loggedInUser) {
        toast.success(`Welcome back, ${loggedInUser.name}!`)
        navigate('/admin/dashboard', { replace: true })
      } else {
        toast.error('Invalid credentials. Please try again.')
        setErrors({ general: 'Invalid credentials' })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-primary/5 flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-end p-4 md:p-6">
        <ThemeToggle />
      </div>

      {/* Center content */}
      <div className="flex-1 flex items-center justify-center px-4 pb-12">
        <div className="w-full max-w-sm md:max-w-3xl animate-fade-up">
          {isLogin ? (
            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              loading={loading}
              onLogin={handleSubmit}
              onSwitchToSignup={() => { setIsLogin(false); setErrors({}) }}
              errors={errors}
            />
          ) : (
            <SignupForm
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              loading={loading}
              onSignup={handleSubmit}
              onSwitchToLogin={() => { setIsLogin(true); setErrors({}) }}
              errors={errors}
            />
          )}
        </div>
      </div>
    </div>
  )
}
