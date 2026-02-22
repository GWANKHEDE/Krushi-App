import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldDescription,
    FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Loader2, Phone } from "lucide-react"
import { useState } from "react"

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
    const [loginMode, setLoginMode] = useState<'email' | 'mobile'>('email')

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (loginMode === 'mobile') {
            // Force mock credentials to the parent
            setPassword('mobile-mock')
        }
        onLogin(e)
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="overflow-hidden p-0 border-none shadow-strong rounded-[2rem]">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-6 md:p-8" onSubmit={handleFormSubmit}>
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-2 text-center mb-2">
                                <h1 className="text-2xl font-bold text-primary uppercase tracking-tight">Welcome back</h1>
                                <p className="text-muted-foreground text-xs font-medium italic text-balance">
                                    Login to your Krushi Kendra account
                                </p>
                            </div>

                            <div className="flex bg-muted/30 p-1 rounded-xl mb-4">
                                <button type="button" onClick={() => setLoginMode('email')} className={cn("flex-1 text-xs font-bold uppercase tracking-widest py-2 rounded-lg transition-colors", loginMode === 'email' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-primary")}>Email</button>
                                <button type="button" onClick={() => setLoginMode('mobile')} className={cn("flex-1 text-xs font-bold uppercase tracking-widest py-2 rounded-lg transition-colors", loginMode === 'mobile' ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-primary")}>Mobile</button>
                            </div>

                            {loginMode === 'email' ? (
                                <>
                                    <Field>
                                        <FieldLabel htmlFor="email" className="font-bold uppercase text-[10px] tracking-widest text-primary/70">Email Address</FieldLabel>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="name@krushi.com"
                                            required={loginMode === 'email'}
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="h-10 rounded-xl border-primary/10 bg-muted/20 focus-visible:ring-primary shadow-inner font-bold text-sm"
                                        />
                                        {errors.email && <p className="text-[10px] font-bold text-destructive uppercase ml-1">{errors.email}</p>}
                                    </Field>
                                    <Field>
                                        <div className="flex items-center">
                                            <FieldLabel htmlFor="password" className="font-bold uppercase text-[10px] tracking-widest text-primary/70">Password</FieldLabel>
                                            <a
                                                href="#"
                                                className="ml-auto text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors underline-offset-2 hover:underline"
                                            >
                                                Forgot?
                                            </a>
                                        </div>
                                        <Input
                                            id="password"
                                            type="password"
                                            required={loginMode === 'email'}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-10 rounded-xl border-primary/10 bg-muted/20 focus-visible:ring-primary shadow-inner font-bold text-sm"
                                        />
                                        {errors.password && <p className="text-[10px] font-bold text-destructive uppercase ml-1">{errors.password}</p>}
                                    </Field>
                                </>
                            ) : (
                                <Field>
                                    <FieldLabel htmlFor="mobile" className="font-bold uppercase text-[10px] tracking-widest text-primary/70">Mobile Number</FieldLabel>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="mobile"
                                            type="tel"
                                            placeholder="9876543210"
                                            required={loginMode === 'mobile'}
                                            value={email} // Re-using state for simplicity
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-9 h-10 rounded-xl border-primary/10 bg-muted/20 focus-visible:ring-primary shadow-inner font-bold text-sm tracking-widest"
                                        />
                                    </div>
                                    <p className="text-[10px] text-muted-foreground mt-1">Mock Login: Enter any 10-digit number to sign in</p>
                                </Field>
                            )}

                            <Field>
                                <Button type="submit" className="w-full h-10 rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg shadow-primary/10 transition-all hover:scale-[1.01] active:scale-[0.99]" disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
                                </Button>
                            </Field>
                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card font-bold uppercase text-[10px] tracking-widest text-muted-foreground/60">
                                Or continue with
                            </FieldSeparator>
                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" type="button" className="h-9 rounded-xl border-primary/10 hover:bg-primary/5 font-bold uppercase text-[10px] tracking-widest">
                                    Google
                                </Button>
                                <Button variant="outline" type="button" className="h-9 rounded-xl border-primary/10 hover:bg-primary/5 font-bold uppercase text-[10px] tracking-widest">
                                    Meta
                                </Button>
                            </div>
                            <FieldDescription className="text-center font-bold uppercase text-[10px] tracking-widest">
                                Don&apos;t have an account?{" "}
                                <button
                                    type="button"
                                    onClick={onSwitchToSignup}
                                    className="text-primary hover:underline cursor-pointer"
                                >
                                    Sign Up
                                </button>
                            </FieldDescription>
                        </FieldGroup>
                    </form>
                    <div className="bg-primary relative hidden md:block overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=2070&auto=format&fit=crop"
                            alt="Agriculture"
                            className="absolute inset-0 h-full w-full object-cover  hover:scale-105 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white text-center">
                            <h2 className="text-2xl font-black uppercase tracking-tighter leading-tight mb-2">Empowering <br /> Farmers</h2>
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-80">Next Gen Krushi Kendra</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center text-[10px] font-bold uppercase tracking-widest opacity-40">
                By clicking continue, you agree to our <a href="#" className="underline">Terms</a>{" "}
                and <a href="#" className="underline">Privacy</a>.
            </FieldDescription>
        </div>
    )
}
