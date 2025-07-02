
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Search, Bell, Menu, X, User, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

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
    // Close search when route changes
    setIsSearchOpen(false);
  }, [location]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/artist-search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

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
            {isSearchOpen ? (
              <form onSubmit={handleSearchSubmit} className="relative">
                <Input
                  type="text"
                  placeholder="Search artists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-64 pr-8"
                />
                <button 
                  type="submit" 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                </button>
              </form>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || undefined} alt={user.name} />
                      <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/login">
                  <Button className="bg-white text-black hover:bg-green-600 hover:text-white" variant="outline">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button>Sign up</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Link to="/artist-search">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
            </Link>
            <button 
              className="flex items-center" 
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
            <div className="pt-4 border-t">
              {isAuthenticated && user ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || undefined} alt={user.name} />
                      <AvatarFallback>
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <Link to="/dashboard" className="w-full">
                    <Button variant="outline" className="w-full justify-start text-foreground">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-foreground" 
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              ) : (
                <div className="flex space-x-2">
                  <Link to="/login" className="w-full">
                    <Button variant="outline" className="w-full text-foreground">Log in</Button>
                  </Link>
                  <Link to="/register" className="w-full">
                    <Button className="w-full">Sign up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
