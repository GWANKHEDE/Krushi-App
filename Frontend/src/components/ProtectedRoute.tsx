import { Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/auth'
import type { Role } from '@/lib/store'

interface Props {
    children: React.ReactNode
    allowedRoles?: Role[]
}

export function ProtectedRoute({ children, allowedRoles }: Props) {
    const { isAuthenticated, hasRole } = useAuth()

    if (!isAuthenticated) return <Navigate to="/admin/login" replace />
    if (allowedRoles && !hasRole(allowedRoles)) return <Navigate to="/admin/dashboard" replace />

    return <>{children}</>
}
