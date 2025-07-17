import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider, useTheme } from "@/contexts/ThemeContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProjectDetail from "./pages/ProjectDetail";
import ArtistProfile from "./pages/ArtistProfile";
import ArtistFeud from "./pages/ArtistFeud";
import HowItWorks from "./pages/HowItWorks";
import Services from "./pages/Services";
import Artists from "./pages/Artists";
import ArtistSearch from "./pages/ArtistSearch";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Cookies from "./pages/Cookies";
import Security from "./pages/Security";
import Blog from "./pages/Blog";
import DiscoverProjects from "./pages/DiscoverProjects";
import BrowseArtists from "./pages/BrowseArtists";
import ArtistServices from "./pages/ArtistServices";
import InvestorServices from "./pages/InvestorServices";
import AITools from "./pages/AITools";
import InvestmentTools from "./pages/InvestmentTools";
import Legal from "./pages/Legal";
import NotFound from "./pages/NotFound";
import ArtistProfileManager from "./pages/ArtistProfileManager";
import CreateProject from "./pages/CreateProject";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const AppContent = () => {
  const { backgroundStyle } = useTheme();
  
  return (
    <div className="min-h-screen text-white" style={backgroundStyle}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/project/:id" element={<ProjectDetail />} />
              <Route path="/artist/:id" element={<ArtistProfile />} />
              <Route path="/artists" element={<Artists />} />
              <Route path="/artist-search" element={<ArtistSearch />} />
              <Route path="/artist-feuds" element={<ArtistFeud />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/services" element={<Services />} />
              <Route path="/ai-tools" element={<AITools />} />
              <Route path="/investment-tools" element={<InvestmentTools />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cookies" element={<Cookies />} />
              <Route path="/cookie-policy" element={<Cookies />} />
              <Route path="/security" element={<Security />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/discover-projects" element={<DiscoverProjects />} />
              <Route path="/browse-artists" element={<BrowseArtists />} />
              <Route path="/artist-services" element={<ArtistServices />} />
              <Route path="/investor-services" element={<InvestorServices />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/artist-profile" element={<ArtistProfileManager />} />
              <Route path="/create-project" element={<CreateProject />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </div>
  );
};

const App = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;
