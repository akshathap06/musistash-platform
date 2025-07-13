
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { X, Menu } from 'lucide-react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#0f1216]/90 backdrop-blur-md shadow-lg border-b border-gray-800'
          : 'bg-transparent'
      }`}
    >
      <div className="container max-w-7xl mx-auto px-4">
        <nav className="flex h-16 items-center justify-between">
          {/* Logo and Navigation Menu - Left Side */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link to="/" className="group flex items-center space-x-3">
              <img 
                src="/lovable-uploads/f3770010-64bf-4539-b28e-1e6985324bf5.png" 
                alt="MusiStash Logo" 
                className="h-8 w-auto transition-all duration-300 group-hover:opacity-80"
              />
              <span className="text-2xl font-extrabold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text transition-all duration-300 group-hover:opacity-80">
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

          {/* Desktop Auth Buttons - Right Side */}
          <div className="hidden md:flex items-center space-x-2">
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
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            className="md:hidden p-2" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </Button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 bg-[#0f1216]/95 backdrop-blur-md">
            <div className="px-4 py-6 space-y-6">
              {/* Mobile Auth Buttons */}
              <div className="flex flex-col space-y-3">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" className="w-full text-left justify-start">
                    Log In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="default" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-3">Platform</h3>
                  <div className="space-y-2">
                    <Link to="/how-it-works" className="block py-2 text-gray-300 hover:text-blue-400" onClick={() => setIsMobileMenuOpen(false)}>
                      How It Works
                    </Link>
                    <Link to="/discover-projects" className="block py-2 text-gray-300 hover:text-blue-400" onClick={() => setIsMobileMenuOpen(false)}>
                      Discover Projects
                    </Link>
                    <Link to="/browse-artists" className="block py-2 text-gray-300 hover:text-blue-400" onClick={() => setIsMobileMenuOpen(false)}>
                      Browse Artists
                    </Link>
                    <Link to="/artist-feuds" className="block py-2 text-gray-300 hover:text-blue-400" onClick={() => setIsMobileMenuOpen(false)}>
                      Artist Feuds
                    </Link>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-3">Services</h3>
                  <div className="space-y-2">
                    <Link to="/services" className="block py-2 text-gray-300 hover:text-blue-400" onClick={() => setIsMobileMenuOpen(false)}>
                      Our Services
                    </Link>
                    <Link to="/ai-tools" className="block py-2 text-gray-300 hover:text-blue-400" onClick={() => setIsMobileMenuOpen(false)}>
                      AI Tools
                    </Link>
                    <Link to="/investment-tools" className="block py-2 text-gray-300 hover:text-blue-400" onClick={() => setIsMobileMenuOpen(false)}>
                      Investment Tools
                    </Link>
                    <Link to="/artist-services" className="block py-2 text-gray-300 hover:text-blue-400" onClick={() => setIsMobileMenuOpen(false)}>
                      Artist Services
                    </Link>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-3">Company</h3>
                  <div className="space-y-2">
                    <Link to="/about" className="block py-2 text-gray-300 hover:text-blue-400" onClick={() => setIsMobileMenuOpen(false)}>
                      About Us
                    </Link>
                    <Link to="/careers" className="block py-2 text-gray-300 hover:text-blue-400" onClick={() => setIsMobileMenuOpen(false)}>
                      Careers
                    </Link>
                    <Link to="/contact" className="block py-2 text-gray-300 hover:text-blue-400" onClick={() => setIsMobileMenuOpen(false)}>
                      Contact
                    </Link>
                    <Link to="/blog" className="block py-2 text-gray-300 hover:text-blue-400" onClick={() => setIsMobileMenuOpen(false)}>
                      Blog
                    </Link>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-3">Legal</h3>
                  <div className="space-y-2">
                    <Link to="/terms" className="block py-2 text-gray-300 hover:text-blue-400" onClick={() => setIsMobileMenuOpen(false)}>
                      Terms of Service
                    </Link>
                    <Link to="/privacy" className="block py-2 text-gray-300 hover:text-blue-400" onClick={() => setIsMobileMenuOpen(false)}>
                      Privacy Policy
                    </Link>
                    <Link to="/cookie-policy" className="block py-2 text-gray-300 hover:text-blue-400" onClick={() => setIsMobileMenuOpen(false)}>
                      Cookie Policy
                    </Link>
                    <Link to="/security" className="block py-2 text-gray-300 hover:text-blue-400" onClick={() => setIsMobileMenuOpen(false)}>
                      Security
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
