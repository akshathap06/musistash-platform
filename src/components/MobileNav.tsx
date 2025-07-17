
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when mobile nav is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const closeNav = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile menu button - Always visible on mobile */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleNav}
        className="md:hidden text-white hover:bg-white/10 p-2"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Mobile navigation overlay - Full screen */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeNav}
          />
          
          {/* Mobile menu panel */}
          <div className="absolute top-0 right-0 h-full w-80 max-w-[90vw] bg-gradient-to-b from-black via-black/98 to-black/95 backdrop-blur-md shadow-2xl border-l border-white/20">
            
            {/* Header with prominent X close button */}
            <div className="flex items-center justify-between p-6 border-b border-white/20 bg-black/90">
              <span className="text-white font-bold text-xl">ArtistFlow</span>
              <button
                onClick={closeNav}
                className="text-white bg-red-600/20 hover:bg-red-600/40 p-4 rounded-full transition-all duration-200 border-2 border-red-500/30 hover:border-red-500/60 shadow-lg hover:shadow-red-500/20"
                aria-label="Close navigation menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation content */}
            <div className="flex flex-col h-full overflow-y-auto">
              {/* Auth buttons */}
              <div className="p-6 border-b border-white/20 space-y-4">
                <Link to="/login" onClick={closeNav}>
                  <Button variant="outline" className="w-full text-white border-white/30 hover:bg-white/10 justify-start text-lg py-3">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={closeNav}>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-lg py-3">
                    Get Started
                  </Button>
                </Link>
              </div>

              {/* Platform Section */}
              <div className="p-6 border-b border-white/10">
                <h3 className="text-white font-semibold mb-4 text-lg">Platform</h3>
                <div className="space-y-3">
                  <Link 
                    to="/how-it-works" 
                    className="block text-white/90 hover:text-white hover:bg-white/10 transition-all py-3 px-3 rounded-lg"
                    onClick={closeNav}
                  >
                    How It Works
                  </Link>
                  <Link 
                    to="/discover-projects" 
                    className="block text-white/90 hover:text-white hover:bg-white/10 transition-all py-3 px-3 rounded-lg"
                    onClick={closeNav}
                  >
                    Discover Projects
                  </Link>
                  <Link 
                    to="/artists" 
                    className="block text-white/90 hover:text-white hover:bg-white/10 transition-all py-3 px-3 rounded-lg"
                    onClick={closeNav}
                  >
                    Browse Artists
                  </Link>
                  <Link 
                    to="/artist-feuds" 
                    className="block text-white/90 hover:text-white hover:bg-white/10 transition-all py-3 px-3 rounded-lg"
                    onClick={closeNav}
                  >
                    Artist Feuds
                  </Link>
                </div>
              </div>

              {/* Services Section */}
              <div className="p-6 border-b border-white/10">
                <h3 className="text-white font-semibold mb-4 text-lg">Services</h3>
                <div className="space-y-3">
                  <Link 
                    to="/services" 
                    className="block text-white/90 hover:text-white hover:bg-white/10 transition-all py-3 px-3 rounded-lg"
                    onClick={closeNav}
                  >
                    Our Services
                  </Link>
                  <Link 
                    to="/ai-tools" 
                    className="block text-white/90 hover:text-white hover:bg-white/10 transition-all py-3 px-3 rounded-lg"
                    onClick={closeNav}
                  >
                    AI Tools
                  </Link>
                  <Link 
                    to="/investment-tools" 
                    className="block text-white/90 hover:text-white hover:bg-white/10 transition-all py-3 px-3 rounded-lg"
                    onClick={closeNav}
                  >
                    Investment Tools
                  </Link>
                  <Link 
                    to="/artist-services" 
                    className="block text-white/90 hover:text-white hover:bg-white/10 transition-all py-3 px-3 rounded-lg"
                    onClick={closeNav}
                  >
                    Artist Services
                  </Link>
                </div>
              </div>

              {/* Company Section */}
              <div className="p-6">
                <h3 className="text-white font-semibold mb-4 text-lg">Company</h3>
                <div className="space-y-3">
                  <Link 
                    to="/about" 
                    className="block text-white/90 hover:text-white hover:bg-white/10 transition-all py-3 px-3 rounded-lg"
                    onClick={closeNav}
                  >
                    About Us
                  </Link>
                  <Link 
                    to="/careers" 
                    className="block text-white/90 hover:text-white hover:bg-white/10 transition-all py-3 px-3 rounded-lg"
                    onClick={closeNav}
                  >
                    Careers
                  </Link>
                  <Link 
                    to="/contact" 
                    className="block text-white/90 hover:text-white hover:bg-white/10 transition-all py-3 px-3 rounded-lg"
                    onClick={closeNav}
                  >
                    Contact
                  </Link>
                  <Link 
                    to="/blog" 
                    className="block text-white/90 hover:text-white hover:bg-white/10 transition-all py-3 px-3 rounded-lg"
                    onClick={closeNav}
                  >
                    Blog
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;
