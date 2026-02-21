import { Routes, Route } from "react-router-dom"
import { Layout } from "../components/Layout"
import { AdminLayout } from "../components/AdminLayout"
import { ProtectedRoute } from "../components/ProtectedRoute"
import Home from "../pages/Home"
import Products from "../pages/Products"
import Contact from "../pages/Contact"
import About from "../pages/About"
import AdminLogin from "../pages/AdminLogin"
import AdminDashboard from "../pages/AdminDashboard"
import Billing from "../pages/Billing"
import Purchase from "../pages/Purchase"
import Report from "../pages/Report"
import Settings from "../pages/Settings"
import NotFound from "../pages/NotFound"

export const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="products" element={<Products />} />
      <Route path="about" element={<About />} />
      <Route path="contact" element={<Contact />} />
    </Route>

    {/* Auth */}
    <Route path="/admin/login" element={<AdminLogin />} />

    {/* Protected Admin Routes */}
    <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="billing" element={<Billing />} />
      <Route path="products" element={<Products />} />
      <Route path="purchases" element={<Purchase />} />
      <Route path="reports" element={<Report />} />
      <Route path="settings" element={<Settings />} />
    </Route>

    <Route path="*" element={<NotFound />} />
  </Routes>
)