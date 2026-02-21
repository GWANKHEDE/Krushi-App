import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    FileText,
    BarChart3,
    Settings,
    LogOut,
    Sprout,
    Search,
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
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const items = [
    {
        title: "Dashboard",
        url: "/admin/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Products",
        url: "/admin/products",
        icon: Package,
    },
    {
        title: "Billing",
        url: "/admin/billing",
        icon: ShoppingCart,
    },
    {
        title: "Purchase",
        url: "/admin/purchases",
        icon: FileText,
    },
    {
        title: "Reports",
        url: "/admin/reports",
        icon: BarChart3,
    },
    {
        title: "Settings",
        url: "/admin/settings",
        icon: Settings,
    },
]

export function AppSidebar() {
    const location = useLocation()
    const navigate = useNavigate()
    const { user, logout } = useAuth()

    const handleLogout = () => {
        logout()
        toast.success('Logged out successfully', {
            style: { background: '#10b981', color: '#fff' }
        })
        navigate('/admin/login')
    }

    const initial = user?.name?.charAt(0).toUpperCase() || 'A'

    return (
        <Sidebar collapsible="icon" className="border-r border-primary/5">
            <SidebarHeader className="p-4">
                <div className="flex items-center gap-3 px-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Sprout className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                        <span className="text-sm font-black uppercase tracking-tighter">Krushi Kendra</span>
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{user?.business?.name}</span>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarSeparator className="bg-primary/5" />

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={location.pathname === item.url}
                                        tooltip={item.title}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-6 rounded-xl transition-all duration-300",
                                            location.pathname === item.url
                                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
                                                : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                                        )}
                                    >
                                        <Link to={item.url}>
                                            <item.icon className="h-4 w-4" />
                                            <span className="font-bold text-xs uppercase tracking-widest leading-none">{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="flex items-center gap-3 px-2 rounded-xl hover:bg-primary/5 group-data-[collapsible=icon]:p-0"
                            onClick={handleLogout}
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <Avatar className="h-8 w-8 transition-transform group-hover:scale-105">
                                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-black">{initial}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                                <span className="text-xs font-bold leading-none">{user?.name}</span>
                                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Sign Out</span>
                            </div>
                            <LogOut className="ml-auto h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden" />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
