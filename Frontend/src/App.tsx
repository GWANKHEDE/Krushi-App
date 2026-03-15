import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "next-themes"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { AuthProvider } from "@/lib/auth"
import { SearchProvider } from "@/lib/SearchContext"
import { AppRoutes } from "./routes"

const queryClient = new QueryClient()

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <SearchProvider>
            <TooltipProvider>
              <AppRoutes />
              <ToastContainer position="bottom-right" closeOnClick pauseOnHover theme="colored" autoClose={3000} limit={1} />
            </TooltipProvider>
          </SearchProvider>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
)

export default App
