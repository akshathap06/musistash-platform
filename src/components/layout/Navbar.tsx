
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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

          {/* Auth Buttons - Right Side */}
          <div className="flex items-center space-x-2">
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
          <Button variant="ghost" className="md:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
