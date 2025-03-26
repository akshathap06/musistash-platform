
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Search, Bell, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/f3770010-64bf-4539-b28e-1e6985324bf5.png" 
                alt="MusiStash Logo" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-semibold tracking-tight">MusiStash</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/how-it-works" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/how-it-works' ? 'text-primary' : ''
              }`}
            >
              How It Works
            </Link>
            <Link 
              to="/artists" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/artists' ? 'text-primary' : ''
              }`}
            >
              Artists
            </Link>
            <Link 
              to="/artist-feuds" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/artist-feuds' ? 'text-primary' : ''
              }`}
            >
              Artist Feuds
            </Link>
            <Link 
              to="/services" 
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === '/services' ? 'text-primary' : ''
              }`}
            >
              Services
            </Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Link to="/login">
              <Button variant="outline">Log in</Button>
            </Link>
            <Link to="/register">
              <Button>Sign up</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden flex items-center" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="px-4 py-6 space-y-4 bg-background/95 backdrop-blur-lg border-b">
            <Link 
              to="/how-it-works" 
              className={`block text-sm font-medium p-2 hover:bg-muted rounded-md ${
                location.pathname === '/how-it-works' ? 'bg-muted' : ''
              }`}
            >
              How It Works
            </Link>
            <Link 
              to="/artists" 
              className={`block text-sm font-medium p-2 hover:bg-muted rounded-md ${
                location.pathname === '/artists' ? 'bg-muted' : ''
              }`}
            >
              Artists
            </Link>
            <Link 
              to="/artist-feuds" 
              className={`block text-sm font-medium p-2 hover:bg-muted rounded-md ${
                location.pathname === '/artist-feuds' ? 'bg-muted' : ''
              }`}
            >
              Artist Feuds
            </Link>
            <Link 
              to="/services" 
              className={`block text-sm font-medium p-2 hover:bg-muted rounded-md ${
                location.pathname === '/services' ? 'bg-muted' : ''
              }`}
            >
              Services
            </Link>
            <div className="flex space-x-2 pt-4 border-t">
              <Link to="/login" className="w-full">
                <Button variant="outline" className="w-full">Log in</Button>
              </Link>
              <Link to="/register" className="w-full">
                <Button className="w-full">Sign up</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
