
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, Menu, User, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
  >(({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-800 hover:text-gray-200 focus:bg-gray-800 focus:text-gray-200",
              className
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none text-gray-200">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-gray-400">
              {children}
            </p>
          </a>
        </NavigationMenuLink>
      </li>
    );
  });
  ListItem.displayName = "ListItem";

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-black/90 backdrop-blur-md shadow-lg border-b border-gray-800'
            : 'bg-transparent'
        }`}
      >
        <div className="container max-w-7xl mx-auto px-4">
          <nav className="flex h-16 items-center justify-between">
            {/* Logo and Navigation Menu - Left Side */}
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <Link to="/" className="group flex items-center space-x-2 sm:space-x-3">
                <img 
                  src="/lovable-uploads/f3770010-64bf-4539-b28e-1e6985324bf5.png" 
                  alt="MusiStash Logo" 
                  className="h-7 sm:h-8 w-auto transition-all duration-300 group-hover:opacity-80"
                />
                <span className="text-xl sm:text-2xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text transition-all duration-300 group-hover:opacity-80">
                  Musi$tash
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:block">
                <NavigationMenu>
                  <NavigationMenuList>
                    {/* Platform Menu */}
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Platform</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          <ListItem href="/how-it-works" title="How It Works">
                            Learn about our revolutionary music investment platform
                          </ListItem>
                          <ListItem href="/discover-projects" title="Discover Projects">
                            Browse and invest in upcoming music projects
                          </ListItem>
                          <ListItem href="/browse-artists" title="Browse Artists">
                            Explore our diverse roster of talented artists
                          </ListItem>
                          <ListItem href="/artist-feuds" title="Artist Feuds">
                            Compare artists and analyze investment potential
                          </ListItem>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Services Menu */}
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          <ListItem href="/services" title="Our Services">
                            Comprehensive services for artists and investors
                          </ListItem>
                          <ListItem href="/ai-tools" title="AI Tools">
                            Advanced AI-powered analytics and insights
                          </ListItem>
                          <ListItem href="/investment-tools" title="Investment Tools">
                            Tools to help you make informed investment decisions
                          </ListItem>
                          <ListItem href="/artist-services" title="Artist Services">
                            Resources and support for artists
                          </ListItem>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Company Menu */}
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Company</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4">
                          <ListItem href="/about" title="About Us">
                            Our mission to revolutionize music investment
                          </ListItem>
                          <ListItem href="/careers" title="Careers">
                            Join our team and shape the future of music
                          </ListItem>
                          <ListItem href="/contact" title="Contact">
                            Get in touch with our team
                          </ListItem>
                          <ListItem href="/blog" title="Blog">
                            Latest news and insights
                          </ListItem>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>

                    {/* Legal Menu */}
                    <NavigationMenuItem>
                      <NavigationMenuTrigger>Legal</NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4">
                          <ListItem href="/terms" title="Terms of Service">
                            Platform terms and conditions
                          </ListItem>
                          <ListItem href="/privacy" title="Privacy Policy">
                            How we handle your data
                          </ListItem>
                          <ListItem href="/cookie-policy" title="Cookie Policy">
                            Our cookie usage policy
                          </ListItem>
                          <ListItem href="/security" title="Security">
                            Our commitment to your security
                          </ListItem>
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  </NavigationMenuList>
                </NavigationMenu>
              </div>
            </div>

            {/* Desktop Auth Section - Right Side */}
            <div className="hidden md:flex items-center space-x-2">
              {isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-auto px-3 rounded-full hover:bg-gray-800/50 transition-all duration-200">
                      <div className="flex items-center space-x-3">
                        <img
                          className="h-8 w-8 rounded-full object-cover border-2 border-blue-500/50"
                          src={user.avatar || '/placeholder.svg'}
                          alt={user.name}
                        />
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium text-white">{user.name}</span>
                          <span className="text-xs text-gray-400 capitalize">{user.role}</span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-gray-900 border-gray-700" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-white">{user.name}</p>
                        <p className="text-xs leading-none text-gray-400">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="flex items-center cursor-pointer text-gray-300 hover:text-white hover:bg-gray-800">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>My Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-gray-300 hover:text-white hover:bg-gray-800">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-sm font-medium">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="default" className="text-sm font-medium">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              className="md:hidden p-2 z-[99999]" 
              onClick={toggleMobileMenu}
              style={{ zIndex: 99999 }}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </nav>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-[99998]"
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
            onClick={closeMobileMenu}
          />
          
          {/* Mobile Menu Content */}
          <div 
            className="absolute top-0 left-0 h-full w-full bg-black/95 backdrop-blur-md overflow-y-auto"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100vh',
              width: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              backdropFilter: 'blur(12px)',
              zIndex: 99999
            }}
          >
            <div className="px-4 py-6 space-y-6 pb-20 pt-20">
              {/* Mobile Auth Section */}
              {isAuthenticated && user ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 px-3 py-2 bg-gray-800/50 rounded-lg">
                    <img
                      className="h-10 w-10 rounded-full object-cover border-2 border-blue-500/50"
                      src={user.avatar || '/placeholder.svg'}
                      alt={user.name}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">{user.name}</span>
                      <span className="text-xs text-gray-400">{user.email}</span>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2">
                    <Link to="/dashboard" onClick={closeMobileMenu}>
                      <Button variant="ghost" className="w-full text-left justify-start">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        My Dashboard
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="w-full text-left justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link to="/login" onClick={closeMobileMenu}>
                    <Button variant="ghost" className="w-full text-left justify-start">
                      Log In
                    </Button>
                  </Link>
                  <Link to="/register" onClick={closeMobileMenu}>
                    <Button variant="default" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Navigation Links */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-3">Platform</h3>
                  <div className="space-y-2">
                    <Link to="/how-it-works" className="block py-2 text-gray-300 hover:text-blue-400" onClick={closeMobileMenu}>
                      How It Works
                    </Link>
                    <Link to="/discover-projects" className="block py-2 text-gray-300 hover:text-blue-400" onClick={closeMobileMenu}>
                      Discover Projects
                    </Link>
                    <Link to="/browse-artists" className="block py-2 text-gray-300 hover:text-blue-400" onClick={closeMobileMenu}>
                      Browse Artists
                    </Link>
                    <Link to="/artist-feuds" className="block py-2 text-gray-300 hover:text-blue-400" onClick={closeMobileMenu}>
                      Artist Feuds
                    </Link>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-3">Services</h3>
                  <div className="space-y-2">
                    <Link to="/services" className="block py-2 text-gray-300 hover:text-blue-400" onClick={closeMobileMenu}>
                      Our Services
                    </Link>
                    <Link to="/ai-tools" className="block py-2 text-gray-300 hover:text-blue-400" onClick={closeMobileMenu}>
                      AI Tools
                    </Link>
                    <Link to="/investment-tools" className="block py-2 text-gray-300 hover:text-blue-400" onClick={closeMobileMenu}>
                      Investment Tools
                    </Link>
                    <Link to="/artist-services" className="block py-2 text-gray-300 hover:text-blue-400" onClick={closeMobileMenu}>
                      Artist Services
                    </Link>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-3">Company</h3>
                  <div className="space-y-2">
                    <Link to="/about" className="block py-2 text-gray-300 hover:text-blue-400" onClick={closeMobileMenu}>
                      About Us
                    </Link>
                    <Link to="/careers" className="block py-2 text-gray-300 hover:text-blue-400" onClick={closeMobileMenu}>
                      Careers
                    </Link>
                    <Link to="/contact" className="block py-2 text-gray-300 hover:text-blue-400" onClick={closeMobileMenu}>
                      Contact
                    </Link>
                    <Link to="/blog" className="block py-2 text-gray-300 hover:text-blue-400" onClick={closeMobileMenu}>
                      Blog
                    </Link>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-3">Legal</h3>
                  <div className="space-y-2">
                    <Link to="/terms" className="block py-2 text-gray-300 hover:text-blue-400" onClick={closeMobileMenu}>
                      Terms of Service
                    </Link>
                    <Link to="/privacy" className="block py-2 text-gray-300 hover:text-blue-400" onClick={closeMobileMenu}>
                      Privacy Policy
                    </Link>
                    <Link to="/cookie-policy" className="block py-2 text-gray-300 hover:text-blue-400" onClick={closeMobileMenu}>
                      Cookie Policy
                    </Link>
                    <Link to="/security" className="block py-2 text-gray-300 hover:text-blue-400" onClick={closeMobileMenu}>
                      Security
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
