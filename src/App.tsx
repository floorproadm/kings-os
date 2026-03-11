import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { SiteConfigProvider } from "@/contexts/SiteConfigContext";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import Contact from "./pages/Contact.tsx";
import About from "./pages/About.tsx";
import Gallery from "./pages/Gallery.tsx";
import Diagnostic from "./pages/Diagnostic.tsx";
import Referral from "./pages/Referral.tsx";
import Quiz from "./pages/Quiz.tsx";
import ThankYou from "./pages/ThankYou.tsx";
import Builders from "./pages/Builders.tsx";
import Realtors from "./pages/Realtors.tsx";
import SandingService from "./pages/services/Sanding.tsx";
import HardwoodService from "./pages/services/Hardwood.tsx";
import VinylService from "./pages/services/Vinyl.tsx";
import StaircaseService from "./pages/services/Staircase.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import Admin from "./pages/Admin.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminAuthProvider>
        <SiteConfigProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
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
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </SiteConfigProvider>
      </AdminAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
