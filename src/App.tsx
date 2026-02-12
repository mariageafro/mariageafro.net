import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth-context";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Prestataires from "./pages/Prestataires";
import ProfilPrestataire from "./pages/ProfilPrestataire";
import Blog from "./pages/Blog";
import Inspiration from "./pages/Inspiration";
import APropos from "./pages/APropos";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import DashboardPrestataire from "./pages/DashboardPrestataire";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={
              <ProtectedRoute requiredRole="prestataire">
                <DashboardPrestataire />
              </ProtectedRoute>
            } />
            <Route path="/prestataires" element={<Prestataires />} />
            <Route path="/prestataires/:id" element={<ProfilPrestataire />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/inspiration" element={<Inspiration />} />
            <Route path="/a-propos" element={<APropos />} />
            <Route path="/contact" element={<Contact />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
