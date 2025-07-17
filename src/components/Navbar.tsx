
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openMobileMenu = () => {
    setIsMobileMenuOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = '';
  };

  // Close mobile menu on window resize to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        closeMobileMenu();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {/* Main Navbar */}
      <nav 
        className={`fixed top-0 w-full transition-all duration-300 z-40 ${
          isScrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 z-50">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                MusiStash
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/how-it-works" className="text-white hover:text-primary transition-colors">
                How It Works
              </Link>
              <Link to="/services" className="text-white hover:text-primary transition-colors">
                Services
              </Link>
              <Link to="/artists" className="text-white hover:text-primary transition-colors">
                Artists
              </Link>
              <Link to="/discover-projects" className="text-white hover:text-primary transition-colors">
                Discover Projects
              </Link>
              <Link to="/about" className="text-white hover:text-primary transition-colors">
                About
              </Link>
              <Link to="/contact" className="text-white hover:text-primary transition-colors">
                Contact
              </Link>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-white hover:bg-white/10">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  Get Started
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={openMobileMenu}
              className="md:hidden text-white p-2 z-50 relative"
              aria-label="Open mobile menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeMobileMenu}
          />
          
          {/* Mobile Menu Panel */}
          <div className="absolute top-0 right-0 h-full w-80 max-w-[85vw] bg-black/95 backdrop-blur-md">
            {/* Close Button */}
            <div className="flex justify-end p-4">
              <button
                onClick={closeMobileMenu}
                className="text-white p-2"
                aria-label="Close mobile menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Menu Content */}
            <div className="px-6 py-4 space-y-6">
              <Link 
                to="/how-it-works" 
                className="block text-white hover:text-blue-400 transition-colors text-lg font-medium py-2"
                onClick={closeMobileMenu}
              >
                How It Works
              </Link>
              <Link 
                to="/services" 
                className="block text-white hover:text-blue-400 transition-colors text-lg font-medium py-2"
                onClick={closeMobileMenu}
              >
                Services
              </Link>
              <Link 
                to="/artists" 
                className="block text-white hover:text-blue-400 transition-colors text-lg font-medium py-2"
                onClick={closeMobileMenu}
              >
                Artists
              </Link>
              <Link 
                to="/discover-projects" 
                className="block text-white hover:text-blue-400 transition-colors text-lg font-medium py-2"
                onClick={closeMobileMenu}
              >
                Discover Projects
              </Link>
              <Link 
                to="/about" 
                className="block text-white hover:text-blue-400 transition-colors text-lg font-medium py-2"
                onClick={closeMobileMenu}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="block text-white hover:text-blue-400 transition-colors text-lg font-medium py-2"
                onClick={closeMobileMenu}
              >
                Contact
              </Link>
              
              {/* Auth Buttons */}
              <div className="pt-6 border-t border-white/20 space-y-4">
                <Link to="/login" onClick={closeMobileMenu}>
                  <Button variant="ghost" className="w-full text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={closeMobileMenu}>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
