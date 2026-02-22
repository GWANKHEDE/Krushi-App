import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { authenticateUser, initStore, type User, type Role } from './store'

interface AuthCtx {
    user: User | null
    isAuthenticated: boolean
    login: (email: string, password: string) => User | null
    logout: () => void
    hasRole: (roles: Role[]) => boolean
    refreshUser: () => void
}

const AuthContext = createContext<AuthCtx>({
    user: null, isAuthenticated: false,
    login: () => null, logout: () => { },
    hasRole: () => false,
    refreshUser: () => { },
})

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        try {
            const saved = localStorage.getItem('user') || sessionStorage.getItem('user')
            return JSON.parse(saved || 'null')
        } catch { return null }
    })

    useEffect(() => { initStore() }, [])

    const isAuthStored = localStorage.getItem('isAuthenticated') === 'true' || sessionStorage.getItem('isAuthenticated') === 'true'
    const isAuthenticated = !!user && isAuthStored

    const login = (email: string, password: string): User | null => {
        let u = authenticateUser(email, password)

        // Mock mobile login bypass
        if (!u && password === 'mobile-mock' && email.length >= 10) {
            u = {
                id: "mobile-user-1",
                name: "Mobile Admin",
                email: email, // Treating this as phone number for mobile logins
                role: "ADMIN" as Role,
                business: { id: "1", name: "Krushi Kendra" },
                isActive: true
            } as any
        }

        if (u) {
            setUser(u)
            // Save to both for maximum mobile compatibility
            localStorage.setItem('user', JSON.stringify(u))
            localStorage.setItem('isAuthenticated', 'true')
            localStorage.setItem('token', `demo-token-${u.id}`)

            sessionStorage.setItem('user', JSON.stringify(u))
            sessionStorage.setItem('isAuthenticated', 'true')
            sessionStorage.setItem('token', `demo-token-${u.id}`)
        }
        return u
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('token')

        sessionStorage.removeItem('user')
        sessionStorage.removeItem('isAuthenticated')
        sessionStorage.removeItem('token')
    }

    const refreshUser = () => {
        try {
            const u = JSON.parse(localStorage.getItem('user') || 'null')
            setUser(u)
        } catch { }
    }

    const hasRole = (roles: Role[]) => !!user && roles.includes(user.role)

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, hasRole, refreshUser }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
