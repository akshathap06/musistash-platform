
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
      {/* Mobile menu button - highest z-index to ensure it's always clickable */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleNav}
        className="md:hidden text-white hover:bg-white/10 fixed top-4 right-4 z-[99999] bg-black/20 backdrop-blur-sm border border-white/10"
        style={{ zIndex: 99999 }}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile navigation overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[99998] md:hidden"
          style={{ 
            zIndex: 99998,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)'
            }}
            onClick={closeNav}
          />
          
          {/* Mobile menu */}
          <div 
            className="absolute top-0 right-0 h-full w-80 bg-black/95 backdrop-blur-md transform transition-transform duration-300 ease-in-out shadow-2xl"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              height: '100vh',
              width: '320px',
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 0 40px rgba(0, 0, 0, 0.5)',
              zIndex: 99999
            }}
          >
            <div className="flex flex-col p-6 pt-20 space-y-6 h-full">
              <Link 
                to="/how-it-works" 
                className="text-white hover:text-primary transition-colors text-lg font-medium"
                onClick={closeNav}
              >
                How It Works
              </Link>
              <Link 
                to="/services" 
                className="text-white hover:text-primary transition-colors text-lg font-medium"
                onClick={closeNav}
              >
                Services
              </Link>
              <Link 
                to="/artists" 
                className="text-white hover:text-primary transition-colors text-lg font-medium"
                onClick={closeNav}
              >
                Artists
              </Link>
              <Link 
                to="/discover-projects" 
                className="text-white hover:text-primary transition-colors text-lg font-medium"
                onClick={closeNav}
              >
                Discover Projects
              </Link>
              <Link 
                to="/about" 
                className="text-white hover:text-primary transition-colors text-lg font-medium"
                onClick={closeNav}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-white hover:text-primary transition-colors text-lg font-medium"
                onClick={closeNav}
              >
                Contact
              </Link>
              
              <div className="pt-6 border-t border-white/20 space-y-4 mt-auto">
                <Link to="/login" onClick={closeNav}>
                  <Button variant="ghost" className="w-full text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={closeNav}>
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

export default MobileNav;
