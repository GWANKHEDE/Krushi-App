import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sprout } from 'lucide-react'
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
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true })
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return

    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!email.trim()) newErrors.email = 'Email is required';

    if (isLogin && !password) {
      newErrors.password = 'Password is required';
    }

    if (!isLogin && !name.trim()) newErrors.name = 'Full name is required';
    if (!isLogin && !password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Invalid Login Attempt', {
        description: 'Please enter both your email and password to proceed.'
      });
      return;
    }

    setLoading(true)
    try {
      if (isLogin) {
        const loggedInUser = login(email, password)
        if (loggedInUser) {
          toast.success(`Welcome back, ${loggedInUser.name}!`, {
            duration: 3000,
            className: "bg-green-600 text-white border-none shadow-lg font-bold"
          })
          navigate('/admin/dashboard', { replace: true })
        } else {
          toast.error('Invalid credentials. Please check and try again.')
          setErrors({ general: 'Invalid credentials' });
        }
      } else {
        toast.success('Account created successfully! You can now login.', {
          className: "bg-green-600 text-white border-none shadow-lg font-bold"
        })
        setIsLogin(true)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        {isLogin ? (
          <LoginForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            loading={loading}
            onLogin={handleSubmit}
            onSwitchToSignup={() => { setIsLogin(false); setErrors({}); }}
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
            onSwitchToLogin={() => { setIsLogin(true); setErrors({}); }}
            errors={errors}
          />
        )}
      </div>
    </div>
  )
}
