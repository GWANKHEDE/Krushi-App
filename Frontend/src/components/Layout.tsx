import { useState, useEffect } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Menu, Sprout, House, ShoppingCart, User, LogIn } from 'lucide-react'

const NAV = [
  { name: 'Home', href: '/', icon: House },
  { name: 'Products', href: '/products', icon: ShoppingCart },
  { name: 'About', href: '/about', icon: Sprout },
  { name: 'Contact', href: '/contact', icon: User },
]

export function Layout() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const [biz, setBiz] = useState({ name: 'Krushi Seva Kendra', address: 'Penur, Tq Purna, Parbhani, Maharashtra 431511', phone: '+91 9823332198', email: 'info@krushisevakendra.com' })

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem('user') || '{}')
      if (u?.business) setBiz(prev => ({
        name: u.business.name || prev.name,
        address: u.business.address || prev.address,
        phone: u.business.contactNumber || prev.phone,
        email: u.business.email || prev.email,
      }))
    } catch { /* fallback defaults */ }
  }, [])

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between w-full px-4 md:px-8">
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <Sprout className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg sm:text-xl bg-gradient-to-r from-green-600 via-lime-500 to-yellow-600 bg-clip-text text-transparent truncate max-w-[180px] sm:max-w-none">{biz.name}</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="hidden md:flex items-center gap-1">
              {NAV.map(item => (
                <Link key={item.name} to={item.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(item.href) ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}>
                  <item.icon className="h-4 w-4" /><span>{item.name}</span>
                </Link>
              ))}
            </nav>

            <ThemeToggle />

            <Button asChild variant="outline" className="hidden md:flex">
              <Link to="/admin/login"><LogIn className="h-4 w-4 mr-2" />Admin Login</Link>
            </Button>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon"><Menu className="h-5 w-5" /></Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px]">
                <div className="mt-6 space-y-2">
                  {NAV.map(item => (
                    <Link key={item.name} to={item.href} onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-base font-medium transition-colors ${isActive(item.href) ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'}`}>
                      <item.icon className="h-5 w-5" /><span>{item.name}</span>
                    </Link>
                  ))}
                  <Link to="/admin/login" onClick={() => setIsOpen(false)} className="flex items-center gap-2 px-4 py-2.5 mt-4 border-t pt-4 font-medium hover:bg-accent transition-colors rounded-md">
                    <LogIn className="h-5 w-5" /><span>Admin Login</span>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main><Outlet /></main>

      <footer className="bg-muted/50 border-t mt-16">
        <div className="container px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-6 w-6 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                  <Sprout className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-semibold">{biz.name}</span>
              </div>
              <p className="text-sm text-muted-foreground">Your trusted partner in agriculture. Quality fertilizers, seeds, and tools.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Quick Links</h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {['products', 'about', 'contact'].map(l => (
                  <li key={l}><Link to={`/${l}`} className="hover:text-foreground transition-colors capitalize">{l === 'about' ? 'About Us' : l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Contact</h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li>📍 {biz.address}</li>
                <li>📞 {biz.phone}</li>
                <li>✉️ {biz.email}</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} {biz.name}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
