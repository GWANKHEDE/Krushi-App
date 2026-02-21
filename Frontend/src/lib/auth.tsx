import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { authenticateUser, initStore, type User, type Role } from './store'

interface AuthCtx {
    user: User | null
    isAuthenticated: boolean
    login: (email: string, password: string) => User | null
    logout: () => void
    hasRole: (roles: Role[]) => boolean
}

const AuthContext = createContext<AuthCtx>({
    user: null, isAuthenticated: false,
    login: () => null, logout: () => { },
    hasRole: () => false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(() => {
        try { return JSON.parse(localStorage.getItem('user') || 'null') } catch { return null }
    })

    useEffect(() => { initStore() }, [])

    const isAuthenticated = !!user && localStorage.getItem('isAuthenticated') === 'true'

    const login = (email: string, password: string): User | null => {
        const u = authenticateUser(email, password)
        if (u) {
            setUser(u)
            localStorage.setItem('user', JSON.stringify(u))
            localStorage.setItem('isAuthenticated', 'true')
            localStorage.setItem('token', `demo-token-${u.id}`)
        }
        return u
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('user')
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('token')
    }

    const hasRole = (roles: Role[]) => !!user && roles.includes(user.role)

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, hasRole }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)
