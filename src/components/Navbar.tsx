
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

  const toggleMobileNav = () => {
    console.log("Mobile nav toggle clicked from navbar, current state:", isMobileNavOpen);
    const newState = !isMobileNavOpen;
    setIsMobileNavOpen(newState);
    console.log("Mobile nav new state from navbar:", newState);
    
    // Prevent body scroll when menu is open
    if (newState) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const closeMobileNav = () => {
    console.log("Mobile nav closing from navbar");
    setIsMobileNavOpen(false);
    document.body.style.overflow = 'unset';
  };

  return (
    <>
      <nav className={`fixed top-0 w-full z-30 transition-all duration-300 ${
        isScrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"
      }`}>
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
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMobileNav}
                className="text-white hover:bg-white/10"
              >
                {isMobileNavOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile navigation overlay - rendered at root level */}
      {isMobileNavOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeMobileNav}
          />
          
          {/* Mobile menu panel */}
          <div className="fixed top-0 right-0 h-screen w-80 bg-black/95 backdrop-blur-md border-l border-white/10">
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
        </div>
      )}
    </>
  );
};

export default Navbar;
