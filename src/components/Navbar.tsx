
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileNav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Mobile nav toggle clicked, current state:", isMobileNavOpen);
    const newState = !isMobileNavOpen;
    setIsMobileNavOpen(newState);
    console.log("Mobile nav new state:", newState);
    
    // Prevent body scroll when menu is open
    if (newState) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
    } else {
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
  };

  const closeMobileNav = () => {
    console.log("Mobile nav closing");
    const scrollY = document.body.style.top;
    setIsMobileNavOpen(false);
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    if (scrollY) {
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }
  };

  // Close mobile nav when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileNavOpen) {
        closeMobileNav();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileNavOpen]);

  return (
    <>
      <nav 
        className={`fixed top-0 w-full transition-all duration-300 ${
          isScrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"
        }`}
        style={{ zIndex: 9999 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
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
              className="md:hidden text-white hover:bg-white/10 p-2 rounded-md transition-colors"
              onClick={toggleMobileNav}
              style={{ zIndex: 10001 }}
              aria-label="Toggle mobile menu"
            >
              {isMobileNavOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile navigation overlay */}
      {isMobileNavOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm md:hidden"
            onClick={closeMobileNav}
            style={{ zIndex: 10000 }}
          />
          
          {/* Mobile menu panel */}
          <div 
            className="fixed top-0 right-0 h-full w-80 max-w-[80vw] bg-black/95 backdrop-blur-md border-l border-white/10 md:hidden"
            style={{ zIndex: 10001 }}
          >
            <div className="flex flex-col p-6 pt-20 space-y-6 h-full overflow-y-auto">
              <Link 
                to="/how-it-works" 
                className="text-white hover:text-blue-400 transition-colors text-lg font-medium"
                onClick={closeMobileNav}
              >
                How It Works
              </Link>
              <Link 
                to="/services" 
                className="text-white hover:text-blue-400 transition-colors text-lg font-medium"
                onClick={closeMobileNav}
              >
                Services
              </Link>
              <Link 
                to="/artists" 
                className="text-white hover:text-blue-400 transition-colors text-lg font-medium"
                onClick={closeMobileNav}
              >
                Artists
              </Link>
              <Link 
                to="/discover-projects" 
                className="text-white hover:text-blue-400 transition-colors text-lg font-medium"
                onClick={closeMobileNav}
              >
                Discover Projects
              </Link>
              <Link 
                to="/about" 
                className="text-white hover:text-blue-400 transition-colors text-lg font-medium"
                onClick={closeMobileNav}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-white hover:text-blue-400 transition-colors text-lg font-medium"
                onClick={closeMobileNav}
              >
                Contact
              </Link>
              
              <div className="pt-6 border-t border-white/20 space-y-4 mt-auto">
                <Link to="/login" onClick={closeMobileNav}>
                  <Button variant="ghost" className="w-full text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={closeMobileNav}>
                  <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
