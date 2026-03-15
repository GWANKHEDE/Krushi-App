import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    FileText,
    BarChart3,
    Settings,
    LogOut,
    Sprout,
    BookOpen,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator,
} from "@/components/ui/sidebar"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "@/lib/auth"
import { toast } from '@/lib/toast'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

const items = [
    { title: "dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
    { title: "products", url: "/admin/products", icon: Package },
    { title: "billing", url: "/admin/billing", icon: ShoppingCart },
    { title: "khatabook", url: "/admin/khatabook", icon: BookOpen },
    { title: "purchase", url: "/admin/purchases", icon: FileText },
    { title: "reports", url: "/admin/reports", icon: BarChart3 },
    { title: "settings", url: "/admin/settings", icon: Settings },
]

export function AppSidebar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuth()
    const { t } = useTranslation()

    const handleLogout = () => {
        logout()
        toast.success('Signed out successfully')
        navigate('/admin/login')
    }

    const initial = user?.name?.charAt(0).toUpperCase() || 'A'

    return (
        <Sidebar collapsible="icon" className="border-r border-border/60 bg-card">
            {/* Header */}
            <SidebarHeader className="p-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 flex-shrink-0">
                        <Sprout className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
                        <span className="text-sm font-800 text-foreground font-extrabold">Krushi Kendra</span>
                        <span className="text-[11px] text-muted-foreground font-medium">{user?.business?.name || 'Management'}</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarSeparator className="bg-border/50 mx-4" />

            {/* Nav */}
            <SidebarContent className="px-3 py-2">
                <SidebarGroup>
                    <SidebarGroupLabel className="px-2 text-[10px] font-700 uppercase tracking-widest text-muted-foreground/60 h-auto py-3 font-bold">
                        {t('navigation')}
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-1">
                            {items.map((item) => {
                                const isActive = location.pathname === item.url
                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={t(item.title)}
                                            className={cn(
                                                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 h-auto font-semibold text-sm",
                                                isActive
                                                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            )}
                                        >
                                            <Link to={item.url}>
                                                <item.icon className="h-4 w-4 flex-shrink-0" />
                                                <span className="font-semibold">{t(item.title)}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter className="p-3 border-t border-border/50">
                <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-muted transition-colors cursor-pointer group group-data-[collapsible=icon]:justify-center" onClick={handleLogout}>
                    <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                            {initial}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col leading-tight flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                        <span className="text-xs font-semibold text-foreground truncate">{user?.name}</span>
                        <span className="text-[10px] text-muted-foreground font-medium">{t('sign_out')}</span>
                    </div>
                    <LogOut className="h-4 w-4 text-muted-foreground group-hover:text-destructive transition-colors ml-auto group-data-[collapsible=icon]:hidden" />
                </div>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
