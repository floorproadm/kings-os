import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteConfigProvider } from "@/contexts/SiteConfigContext";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Gallery from "./pages/Gallery";
import Services from "./pages/Services";
import B2B from "./pages/B2B";
import ReferralLanding from "./pages/ReferralLanding";
import Diagnostic from "./pages/Diagnostic";
import Referral from "./pages/Referral";
import Quiz from "./pages/Quiz";
import ThankYou from "./pages/ThankYou";
import Builders from "./pages/Builders";
import Realtors from "./pages/Realtors";
import SandingService from "./pages/services/Sanding";
import HardwoodService from "./pages/services/Hardwood";
import VinylService from "./pages/services/Vinyl";
import StaircaseService from "./pages/services/Staircase";
import DeckService from "./pages/services/Deck";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminLeads = lazy(() => import("./pages/admin/Leads"));
const AdminReferrals = lazy(() => import("./pages/admin/Referrals"));
const AdminSettings = lazy(() => import("./pages/admin/Settings"));
const AdminGallery = lazy(() => import("./pages/admin/Gallery"));
const AdminPartners = lazy(() => import("./pages/admin/Partners"));
const AdminServices = lazy(() => import("./pages/admin/Services"));

const queryClient = new QueryClient();

const AdminFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <Loader2 className="w-8 h-8 text-gold animate-spin" />
  </div>
);

const AdminRoute = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>
    <Suspense fallback={<AdminFallback />}>
      <AdminLayout>{children}</AdminLayout>
    </Suspense>
  </ProtectedRoute>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SiteConfigProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/b2b" element={<B2B />} />
            <Route path="/referral/:code" element={<ReferralLanding />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/diagnostic" element={<Diagnostic />} />
            <Route path="/referral" element={<Referral />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/thank-you" element={<ThankYou />} />
            <Route path="/builders" element={<Builders />} />
            <Route path="/realtors" element={<Realtors />} />
            <Route path="/services/sanding" element={<SandingService />} />
            <Route path="/services/hardwood" element={<HardwoodService />} />
            <Route path="/services/vinyl" element={<VinylService />} />
            <Route path="/services/staircase" element={<StaircaseService />} />
            <Route path="/services/demolition" element={<DemolitionService />} />
            <Route path="/services/deck" element={<DeckService />} />
            <Route path="/services/wash" element={<WashService />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminRoute><Suspense fallback={<AdminFallback />}><Dashboard /></Suspense></AdminRoute>} />
            <Route path="/admin/leads" element={<AdminRoute><Suspense fallback={<AdminFallback />}><AdminLeads /></Suspense></AdminRoute>} />
            <Route path="/admin/referrals" element={<AdminRoute><Suspense fallback={<AdminFallback />}><AdminReferrals /></Suspense></AdminRoute>} />
            <Route path="/admin/gallery" element={<AdminRoute><Suspense fallback={<AdminFallback />}><AdminGallery /></Suspense></AdminRoute>} />
            <Route path="/admin/partners" element={<AdminRoute><Suspense fallback={<AdminFallback />}><AdminPartners /></Suspense></AdminRoute>} />
            <Route path="/admin/services" element={<AdminRoute><Suspense fallback={<AdminFallback />}><AdminServices /></Suspense></AdminRoute>} />
            <Route path="/admin/settings" element={<AdminRoute><Suspense fallback={<AdminFallback />}><AdminSettings /></Suspense></AdminRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SiteConfigProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
