
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
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleNav}
        className="md:hidden text-white hover:bg-white/10"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Mobile navigation overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeNav}
          />
          
          {/* Mobile menu */}
          <div className="absolute top-0 right-0 h-full w-80 bg-black/95 backdrop-blur-md shadow-2xl">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <span className="text-white font-semibold">Menu</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={closeNav}
                className="text-white hover:bg-white/10"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Auth buttons */}
            <div className="p-4 border-b border-white/20 space-y-3">
              <Link to="/login" onClick={closeNav}>
                <Button variant="ghost" className="w-full text-white hover:bg-white/10 justify-start">
                  Log In
                </Button>
              </Link>
              <Link to="/register" onClick={closeNav}>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  Sign Up
                </Button>
              </Link>
            </div>

            {/* Platform Section */}
            <div className="p-4 border-b border-white/10">
              <h3 className="text-white font-semibold mb-3">Platform</h3>
              <div className="space-y-2">
                <Link 
                  to="/how-it-works" 
                  className="block text-white hover:text-primary transition-colors py-2"
                  onClick={closeNav}
                >
                  How It Works
                </Link>
                <Link 
                  to="/discover-projects" 
                  className="block text-white hover:text-primary transition-colors py-2"
                  onClick={closeNav}
                >
                  Discover Projects
                </Link>
                <Link 
                  to="/browse-artists" 
                  className="block text-white hover:text-primary transition-colors py-2"
                  onClick={closeNav}
                >
                  Browse Artists
                </Link>
                <Link 
                  to="/artist-feuds" 
                  className="block text-white hover:text-primary transition-colors py-2"
                  onClick={closeNav}
                >
                  Artist Feuds
                </Link>
              </div>
            </div>

            {/* Services Section */}
            <div className="p-4 border-b border-white/10">
              <h3 className="text-white font-semibold mb-3">Services</h3>
              <div className="space-y-2">
                <Link 
                  to="/services" 
                  className="block text-white hover:text-primary transition-colors py-2"
                  onClick={closeNav}
                >
                  Our Services
                </Link>
                <Link 
                  to="/ai-tools" 
                  className="block text-white hover:text-primary transition-colors py-2"
                  onClick={closeNav}
                >
                  AI Tools
                </Link>
                <Link 
                  to="/investment-tools" 
                  className="block text-white hover:text-primary transition-colors py-2"
                  onClick={closeNav}
                >
                  Investment Tools
                </Link>
                <Link 
                  to="/artist-services" 
                  className="block text-white hover:text-primary transition-colors py-2"
                  onClick={closeNav}
                >
                  Artist Services
                </Link>
              </div>
            </div>

            {/* Company Section */}
            <div className="p-4">
              <h3 className="text-white font-semibold mb-3">Company</h3>
              <div className="space-y-2">
                <Link 
                  to="/about" 
                  className="block text-white hover:text-primary transition-colors py-2"
                  onClick={closeNav}
                >
                  About Us
                </Link>
                <Link 
                  to="/careers" 
                  className="block text-white hover:text-primary transition-colors py-2"
                  onClick={closeNav}
                >
                  Careers
                </Link>
                <Link 
                  to="/contact" 
                  className="block text-white hover:text-primary transition-colors py-2"
                  onClick={closeNav}
                >
                  Contact
                </Link>
                <Link 
                  to="/blog" 
                  className="block text-white hover:text-primary transition-colors py-2"
                  onClick={closeNav}
                >
                  Blog
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNav;
