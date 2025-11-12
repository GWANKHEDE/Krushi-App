import { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Sprout, House, ShoppingCart, User, LogIn } from "lucide-react";

export function Layout() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/", icon: House },
    { name: "Products", href: "/products", icon: ShoppingCart },
    { name: "About", href: "/about", icon: Sprout },
    { name: "Contact", href: "/contact", icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between w-full px-4 md:px-8">
          {/* Logo on the left */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <Sprout className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-green-600 via-lime-500 to-yellow-600 bg-clip-text text-transparent">
              Krushi Seva Kendra
            </span>
          </Link>

          {/* Right-side nav and login */}
          <div className="flex items-center space-x-6">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Login Button */}
            <div className="hidden md:flex items-center space-x-2">
              <Button asChild variant="outline">
                <Link to="/admin/login">
                  <LogIn className="h-4 w-4 mr-2" />
                  Admin Login
                </Link>
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="mt-6 space-y-4">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md text-base font-medium transition-colors ${
                          isActive(item.href)
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}

                  <Link
                    to="/admin/login"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center space-x-2 px-4 py-2 mt-4 border-t pt-4 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <LogIn className="h-5 w-5" />
                    <span>Admin Login</span>
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-muted/50 border-t mt-16">
        <div className="container px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="h-6 w-6 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                  <Sprout className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-semibold">Krushi Seva Kendra</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your trusted partner in agriculture. Providing quality
                fertilizers, seeds, and tools for better farming.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    to="/products"
                    className="hover:text-foreground transition-colors"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="hover:text-foreground transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact Info</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>📍 Penur, Tq Purna, Parbhani, Maharashtra 431511</li>
                <li>📞 +91 9823332198</li>
                <li>✉️ info@krushisevakendra.com</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Wankhede Krushi Seva Kendra. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
