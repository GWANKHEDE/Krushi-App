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
import { Loader2 } from "lucide-react"
import { useTranslation } from "react-i18next"

interface SignupFormProps extends React.ComponentProps<"div"> {
    onSignup: (e: React.FormEvent) => void
    onSwitchToLogin: () => void
    loading: boolean
    name: string
    setName: (name: string) => void
    email: string
    setEmail: (email: string) => void
    password: string
    setPassword: (password: string) => void
    errors: { name?: string; email?: string; password?: string }
}

export function SignupForm({
    className,
    onSignup,
    onSwitchToLogin,
    loading,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    errors,
    ...props
}: SignupFormProps) {
    const { t } = useTranslation()
    return (
        <div className={cn("flex flex-col gap-4", className)} {...props}>
            <Card className="overflow-hidden p-0 border-none shadow-strong rounded-[2rem]">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <form className="p-4" onSubmit={onSignup}>
                        <FieldGroup>
                            <div className="flex flex-col items-center gap-1 text-center mb-2">
                                <h1 className="text-2xl font-bold tracking-tight text-primary uppercase">{t('join_us')}</h1>
                                <p className="text-muted-foreground text-[10px] font-medium italic text-balance">
                                    {t('signup_subtitle')}
                                </p>
                            </div>
                            <Field>
                                <FieldLabel htmlFor="name" className="font-bold uppercase text-[10px] tracking-widest text-primary/70">{t('full_name')}</FieldLabel>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Ganesh Wankhede"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="h-10 rounded-xl border-primary/10 bg-muted/20 focus-visible:ring-primary shadow-inner font-bold text-sm"
                                />
                                {errors.name && <p className="text-[10px] font-bold text-destructive uppercase ml-1">{errors.name}</p>}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="email" className="font-bold uppercase text-[10px] tracking-widest text-primary/70">{t('email_address')}</FieldLabel>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@krushi.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-10 rounded-xl border-primary/10 bg-muted/20 focus-visible:ring-primary shadow-inner font-bold text-sm"
                                />
                                {errors.email && <p className="text-[10px] font-bold text-destructive uppercase ml-1">{errors.email}</p>}
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="password" className="font-bold uppercase text-[10px] tracking-widest text-primary/70">{t('secure_password')}</FieldLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="h-10 rounded-xl border-primary/10 bg-muted/20 focus-visible:ring-primary shadow-inner font-bold text-sm"
                                />
                                {errors.password && <p className="text-[10px] font-bold text-destructive uppercase ml-1">{errors.password}</p>}
                                <FieldDescription className="text-[9px] font-bold uppercase tracking-tight opacity-50 px-1 mt-0.5">
                                    {t('min_chars')}
                                </FieldDescription>
                            </Field>
                            <Field>
                                <Button type="submit" className="w-full h-10 rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg shadow-primary/10 transition-all hover:scale-[1.01] active:scale-[0.99]" disabled={loading}>
                                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : t('create_account')}
                                </Button>
                            </Field>
                            <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card font-bold uppercase text-[10px] tracking-widest text-muted-foreground/60">
                                {t('or_join_with')}
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
                                {t('already_have_account')}{" "}
                                <button
                                    type="button"
                                    onClick={onSwitchToLogin}
                                    className="text-primary hover:underline cursor-pointer"
                                >
                                    {t('sign_in')}
                                </button>
                            </FieldDescription>
                        </FieldGroup>
                    </form>
                    <div className="bg-primary relative hidden md:block overflow-hidden">
                        <img
                            src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=2069&auto=format&fit=crop"
                            alt="Harvest"
                            className="absolute inset-0 h-full w-full object-cover hover:scale-105 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white text-center">
                            <h2 className="text-2xl font-black uppercase tracking-tighter leading-tight mb-2">Scalable <br /> Farming</h2>
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-80">Grow your business today</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <FieldDescription className="px-6 text-center text-[10px] font-bold uppercase tracking-widest opacity-40">
                By clicking continue, you agree to our <a href="#" className="underline">{t('terms')}</a>{" "}
                and <a href="#" className="underline">{t('privacy')}</a>.
            </FieldDescription>
        </div>
    )
}
