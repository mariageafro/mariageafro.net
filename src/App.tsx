import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth-context";
import { LanguageProvider } from "@/contexts/language-context";
import { ScrollToTop } from "@/components/ScrollToTop";
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
import TrouverParPays from "./pages/TrouverParPays";
import PreatairesPremium from "./pages/PreatairesPremium";
import OutilsMaries from "./pages/OutilsMaries";
import PlanningPage from "./pages/tools/PlanningPage";
import ChecklistPage from "./pages/tools/ChecklistPage";
import BudgetPage from "./pages/tools/BudgetPage";
import WishlistPage from "./pages/tools/WishlistPage";
import RemindersPage from "./pages/tools/RemindersPage";
import CategoryPage from "./pages/CategoryPage";
import CityPage from "./pages/CityPage";
import DevenirPrestataire from "./pages/DevenirPrestataire";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AdminLayout } from "./components/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminVendors from "./pages/admin/AdminVendors";
import AdminMediaPage from "./pages/admin/AdminMediaPage";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminCountries from "./pages/admin/AdminCountries";
import AdminImport from "./pages/admin/AdminImport";
import AdminPages from "./pages/admin/AdminPages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <LanguageProvider>
      <TooltipProvider>
        <BrowserRouter>
          <ScrollToTop />
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
            <Route path="/prestataires/ville/:city" element={<CityPage />} />
            <Route path="/prestataires/:id" element={<ProfilPrestataire />} />
            <Route path="/categories/:slug" element={<CategoryPage />} />
            <Route path="/trouver-par-pays" element={<TrouverParPays />} />
            <Route path="/prestataires-premium" element={<PreatairesPremium />} />
            <Route path="/outils-maries" element={<OutilsMaries />} />
            <Route path="/outils-maries/planning" element={<PlanningPage />} />
            <Route path="/outils-maries/checklist" element={<ChecklistPage />} />
            <Route path="/outils-maries/budget" element={<BudgetPage />} />
            <Route path="/outils-maries/liste-de-souhaits" element={<WishlistPage />} />
            <Route path="/outils-maries/rappels" element={<RemindersPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/inspiration" element={<Inspiration />} />
            <Route path="/a-propos" element={<APropos />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/devenir-prestataire" element={<DevenirPrestataire />} />
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminOverview />} />
              <Route path="vendors" element={<AdminVendors />} />
              <Route path="media" element={<AdminMediaPage />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="countries" element={<AdminCountries />} />
              <Route path="import" element={<AdminImport />} />
              <Route path="pages" element={<AdminPages />} />
            </Route>
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </LanguageProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
