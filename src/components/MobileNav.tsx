
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const MobileNav = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNav = () => {
    console.log("Mobile nav toggle clicked, current state:", isOpen);
    const newState = !isOpen;
    setIsOpen(newState);
    console.log("Mobile nav new state:", newState);
    
    // Prevent body scroll when menu is open
    if (newState) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const closeNav = () => {
    console.log("Mobile nav closing");
    setIsOpen(false);
    document.body.style.overflow = 'unset';
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  console.log("MobileNav render - isOpen:", isOpen);

  return (
    <>
      {/* Mobile menu button - positioned independently */}
      <div className="md:hidden fixed top-4 right-4 z-[100]">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleNav}
          className="text-white hover:bg-white/10 bg-black/20 backdrop-blur-sm"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile navigation overlay */}
      {isOpen && (
        <div className="md:hidden">
          {/* Fixed overlay that covers entire viewport */}
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[99]"
            onClick={closeNav}
          />
          
          {/* Mobile menu panel */}
          <div className="fixed top-0 right-0 h-screen w-80 bg-black/95 backdrop-blur-md border-l border-white/10 z-[99]">
            <div className="flex flex-col p-6 pt-20 space-y-6 h-full overflow-y-auto">
              <Link 
                to="/how-it-works" 
                className="text-white hover:text-blue-400 transition-colors text-lg font-medium"
                onClick={closeNav}
              >
                How It Works
              </Link>
              <Link 
                to="/services" 
                className="text-white hover:text-blue-400 transition-colors text-lg font-medium"
                onClick={closeNav}
              >
                Services
              </Link>
              <Link 
                to="/artists" 
                className="text-white hover:text-blue-400 transition-colors text-lg font-medium"
                onClick={closeNav}
              >
                Artists
              </Link>
              <Link 
                to="/discover-projects" 
                className="text-white hover:text-blue-400 transition-colors text-lg font-medium"
                onClick={closeNav}
              >
                Discover Projects
              </Link>
              <Link 
                to="/about" 
                className="text-white hover:text-blue-400 transition-colors text-lg font-medium"
                onClick={closeNav}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-white hover:text-blue-400 transition-colors text-lg font-medium"
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
