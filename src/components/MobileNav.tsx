
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

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
        className="md:hidden text-white hover:bg-white/10 fixed top-4 right-4 z-[9999] bg-black/20 backdrop-blur-sm"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Mobile navigation overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-[9998] md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={closeNav}
          />
          
          {/* Mobile menu */}
          <div className="absolute top-0 right-0 h-full w-80 bg-black/95 backdrop-blur-md transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col p-6 pt-20 space-y-6">
              <Link 
                to="/how-it-works" 
                className="text-white hover:text-primary transition-colors text-lg"
                onClick={closeNav}
              >
                How It Works
              </Link>
              <Link 
                to="/services" 
                className="text-white hover:text-primary transition-colors text-lg"
                onClick={closeNav}
              >
                Services
              </Link>
              <Link 
                to="/artists" 
                className="text-white hover:text-primary transition-colors text-lg"
                onClick={closeNav}
              >
                Artists
              </Link>
              <Link 
                to="/discover-projects" 
                className="text-white hover:text-primary transition-colors text-lg"
                onClick={closeNav}
              >
                Discover Projects
              </Link>
              <Link 
                to="/about" 
                className="text-white hover:text-primary transition-colors text-lg"
                onClick={closeNav}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-white hover:text-primary transition-colors text-lg"
                onClick={closeNav}
              >
                Contact
              </Link>
              
              <div className="pt-6 border-t border-white/20 space-y-4">
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
