import React, { useRef } from 'react';
import { ArrowRight, Search, Users, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AIRecommendationTool from '@/components/ui/AIRecommendationTool';
import RotatingArtistShowcase from '@/components/ui/RotatingArtistShowcase';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

const Index = () => {
  const aiToolRef = useRef<HTMLDivElement>(null);

  const scrollToAITool = () => {
    aiToolRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1216]">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-28 pb-12 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-6 space-y-4">
              {/* Terminal Badge */}
              <div className="inline-block bg-[#1a1b26] rounded-lg p-2">
                <code className="text-green-400 font-mono text-sm">$ revolutionizing_music_investment.exe_</code>
              </div>
              
              {/* Main Message */}
              <div className="space-y-2">
                <h1 className="text-5xl font-bold tracking-tight text-white leading-[1.1]">
                  LET
                  <br />
                  ARTISTS
                  <br />
                  OWN THEIR
                  <br />
                  FUTURE
                </h1>
                
                <h2 className="text-3xl font-semibold text-blue-400">
                  LET FANS PROFIT FROM IT
                </h2>
              </div>

              {/* Value Props */}
              <div className="space-y-3 text-base border-l-2 border-gray-800 pl-4">
                <p className="text-gray-300">Breaking the traditional music industry model.</p>
                <p className="text-gray-300">Direct artist-fan connection through equity.</p>
                <p className="text-gray-300">Everyone shares in the success.</p>
              </div>

              {/* Status Box */}
              <div className="font-mono space-y-1">
                <p className="text-gray-500">[STATUS] <span className="text-white">This isn't crowdfunding.</span></p>
                <p className="text-blue-500">[SYSTEM] <span>This is equity for the culture.</span></p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  size="lg"
                  onClick={scrollToAITool}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 text-base transition-all duration-300 transform hover:scale-105"
                >
                  Try Our AI Tool
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Link to="/how-it-works">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 px-6 py-4 text-base transition-all duration-300 transform hover:scale-105"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-[#1a1b26]/50 backdrop-blur-sm rounded-lg p-3 border border-gray-800/50">
                  <div className="text-xl font-bold text-blue-400">9+</div>
                  <div className="text-xs text-gray-400">AI Models</div>
                </div>
                <div className="bg-[#1a1b26]/50 backdrop-blur-sm rounded-lg p-3 border border-gray-800/50">
                  <div className="text-xl font-bold text-purple-400">100K+</div>
                  <div className="text-xs text-gray-400">Artists Analyzed</div>
                </div>
              </div>

              {/* Live Demo Indicator */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 text-xs font-medium">Live Demo Available</span>
                </div>
                <div className="text-gray-500">→</div>
                <span className="text-gray-400 text-xs">Try analyzing Drake vs The Weeknd</span>
              </div>
            </div>

            {/* Right Column - AI Tool */}
            <div className="lg:col-span-6 flex items-start">
              <div className="w-full mt-2 lg:mt-4" ref={aiToolRef}>
                {/* Vibrant container with glow effects */}
                <div className="relative">
                  {/* Animated background glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl animate-pulse"></div>
                  <div className="absolute inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-75 animate-pulse"></div>
                  
                  {/* Main container */}
                  <div className="relative bg-gradient-to-br from-[#1a1b26] via-[#1e2030] to-[#1a1b26] rounded-2xl p-6 border border-blue-500/30 shadow-2xl backdrop-blur-sm">
                    {/* Header with enhanced styling */}
                    <div className="mb-6 text-center">
                      <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30">
                        <Sparkles className="h-4 w-4 text-blue-400 animate-pulse" />
                        <span className="text-blue-400 font-medium text-sm">AI-Powered Analysis</span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
                        AI Recommendation Tool
                      </h3>
                      <p className="text-gray-300 text-sm">Analyze artist compatibility and market potential with AI-driven insights</p>
                    </div>
                    
                    {/* Enhanced AI Tool component */}
                    <div className="relative">
                      <AIRecommendationTool />
                    </div>
                    
                    {/* Bottom accent */}
                    <div className="mt-4 pt-4 border-t border-gray-700/50">
                      <div className="flex items-center justify-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          Live Data
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                          AI Analysis
                        </span>
                        <span className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                          Real-time Results
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Rotating Artist Showcase */}
        <RotatingArtistShowcase />

        {/* How It Works Section */}
        <section className="py-24 px-4 md:px-6 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1.5s'}}></div>
          </div>

          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                How It Works
              </h2>
              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
                Start investing in music with our AI-powered platform in just four simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Step 1 */}
              <div className="group relative">
                <div className="absolute inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-[#151823] rounded-xl p-8 h-full border border-gray-800/50 hover:border-blue-500/50 transition-all duration-300 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">Discover</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Use our AI tools to discover emerging artists and analyze their commercial potential with data-driven insights
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="group relative">
                <div className="absolute inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-[#151823] rounded-xl p-8 h-full border border-gray-800/50 hover:border-purple-500/50 transition-all duration-300 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">Analyze</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Leverage our professional investment tools to assess risk, predict returns, and make informed decisions
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="group relative">
                <div className="absolute inset-0.5 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-[#151823] rounded-xl p-8 h-full border border-gray-800/50 hover:border-green-500/50 transition-all duration-300 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">Invest</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Connect directly with artists, fund their projects, and acquire equity stakes in their musical ventures
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="group relative">
                <div className="absolute inset-0.5 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-[#151823] rounded-xl p-8 h-full border border-gray-800/50 hover:border-yellow-500/50 transition-all duration-300 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-white">4</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-4">Track</h3>
                  <p className="text-gray-400 leading-relaxed">
                    Monitor your portfolio performance, track artist progress, and watch your investments grow over time
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link to="/how-it-works">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:opacity-90 px-8 py-6 text-lg transition-all duration-300 transform hover:scale-105"
                >
                  Learn More About Our Process
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Live Investment Opportunities */}
        <section className="py-24 px-4 md:px-6 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>

          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                Live Investment Opportunities
              </h2>
              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
                Browse current projects seeking investment and be part of their success story
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
              {/* Project Card 1 */}
              <div className="group relative">
                <div className="absolute inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-[#151823] rounded-xl overflow-hidden border border-gray-800/50 hover:border-blue-500/50 transition-all duration-300">
                  <div className="relative h-32 md:h-48">
                    <img 
                      src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f" 
                      alt="Studio Setup" 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151823] to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                        Active
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-3 md:p-6">
                    <h3 className="text-sm md:text-xl font-bold text-white mb-1 md:mb-2">Lunar Echoes - Debut Album</h3>
                    <p className="text-gray-400 text-xs md:text-sm mb-2 md:mb-4 line-clamp-2 md:line-clamp-none">My first full-length album exploring themes of technology and human connection</p>
                    
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 md:mb-3 gap-1 md:gap-2">
                      <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">$32,500</span>
                      <span className="text-sm md:text-lg font-semibold text-blue-400">7.5% ROI</span>
                    </div>
                    
                    <div className="relative w-full h-1.5 md:h-2 bg-gray-800/50 rounded-full mb-2 md:mb-3 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    
                    <div className="flex justify-between text-xs md:text-sm mb-2 md:mb-4">
                      <span className="text-gray-400">65% Funded</span>
                      <span className="text-gray-400">0 days left</span>
                    </div>
                    
                    <div className="hidden md:flex gap-2 mb-4 flex-wrap">
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-800/50 text-gray-300 border border-gray-700/50">producer</span>
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-800/50 text-gray-300 border border-gray-700/50">studio</span>
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-800/50 text-gray-300 border border-gray-700/50">marketing</span>
                    </div>
                    
                    <Link to="/project/lunar-echoes">
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 transition-all duration-300 text-xs md:text-sm py-2 md:py-3">
                        View Project
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Project Card 2 */}
              <div className="group relative">
                <div className="absolute inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-[#151823] rounded-xl overflow-hidden border border-gray-800/50 hover:border-purple-500/50 transition-all duration-300">
                  <div className="relative h-32 md:h-48">
                    <img 
                      src="https://images.unsplash.com/photo-1501612780327-45045538702b" 
                      alt="Live Performance" 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151823] to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        Active
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-3 md:p-6">
                    <h3 className="text-sm md:text-xl font-bold text-white mb-1 md:mb-2">Urban Perspectives - Mixtape</h3>
                    <p className="text-gray-400 text-xs md:text-sm mb-2 md:mb-4 line-clamp-2 md:line-clamp-none">A collaborative mixtape featuring emerging artists from across the city</p>
                    
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 md:mb-3 gap-1 md:gap-2">
                      <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">$58,000</span>
                      <span className="text-sm md:text-lg font-semibold text-purple-400">10% ROI</span>
                    </div>
                    
                    <div className="relative w-full h-1.5 md:h-2 bg-gray-800/50 rounded-full mb-2 md:mb-3 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" style={{ width: '77%' }}></div>
                    </div>
                    
                    <div className="flex justify-between text-xs md:text-sm mb-2 md:mb-4">
                      <span className="text-gray-400">77% Funded</span>
                      <span className="text-gray-400">0 days left</span>
                    </div>
                    
                    <div className="hidden md:flex gap-2 mb-4 flex-wrap">
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-800/50 text-gray-300 border border-gray-700/50">producer</span>
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-800/50 text-gray-300 border border-gray-700/50">studio</span>
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-800/50 text-gray-300 border border-gray-700/50">marketing</span>
                    </div>
                    
                    <Link to="/project/urban-perspectives">
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-all duration-300 text-xs md:text-sm py-2 md:py-3">
                        View Project
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Project Card 3 */}
              <div className="group relative">
                <div className="absolute inset-0.5 bg-gradient-to-r from-pink-500 to-blue-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-[#151823] rounded-xl overflow-hidden border border-gray-800/50 hover:border-pink-500/50 transition-all duration-300">
                  <div className="relative h-32 md:h-48">
                    <img 
                      src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae" 
                      alt="Neon Sign" 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151823] to-transparent"></div>
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-pink-500 to-blue-500 text-white">
                        Active
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-3 md:p-6">
                    <h3 className="text-sm md:text-xl font-bold text-white mb-1 md:mb-2">Endless Horizons - EP</h3>
                    <p className="text-gray-400 text-xs md:text-sm mb-2 md:mb-4 line-clamp-2 md:line-clamp-none">A 5-track EP exploring atmospheric soundscapes and emotional narratives</p>
                    
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2 md:mb-3 gap-1 md:gap-2">
                      <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-pink-500 to-blue-500 text-transparent bg-clip-text">$21,000</span>
                      <span className="text-sm md:text-lg font-semibold text-pink-400">6% ROI</span>
                    </div>
                    
                    <div className="relative w-full h-1.5 md:h-2 bg-gray-800/50 rounded-full mb-2 md:mb-3 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                    
                    <div className="flex justify-between text-xs md:text-sm mb-2 md:mb-4">
                      <span className="text-gray-400">60% Funded</span>
                      <span className="text-gray-400">0 days left</span>
                    </div>
                    
                    <div className="hidden md:flex gap-2 mb-4 flex-wrap">
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-800/50 text-gray-300 border border-gray-700/50">producer</span>
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-800/50 text-gray-300 border border-gray-700/50">studio</span>
                      <span className="px-2 py-1 rounded-md text-xs font-medium bg-gray-800/50 text-gray-300 border border-gray-700/50">marketing</span>
                    </div>
                    
                    <Link to="/project/endless-horizons">
                      <Button className="w-full bg-gradient-to-r from-pink-500 to-blue-500 text-white hover:opacity-90 transition-all duration-300 text-xs md:text-sm py-2 md:py-3">
                        View Project
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link to="/discover-projects">
                <Button 
                  size="lg"
                  className="bg-transparent border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 px-8 py-6 text-lg transition-all duration-300 transform hover:scale-105"
                >
                  View All Projects
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Why Our AI Predictions Matter Section */}
        <section className="py-24 px-4 md:px-6 relative overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>

          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                Why Our AI Predictions Matter
              </h2>
              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                Data-driven insights that help you invest smarter in the next generation of artists
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              {/* Smart Analysis Card */}
              <div className="group relative">
                <div className="absolute inset-0.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-[#151823] rounded-xl p-4 md:p-8 h-full border border-gray-800/50 hover:border-purple-500/50 transition-all duration-300">
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Search className="w-5 h-5 md:w-6 md:h-6 text-purple-400" />
                    </div>
                    <h3 className="text-lg md:text-2xl font-bold text-white">Smart Analysis</h3>
                  </div>
                  <p className="text-gray-300 text-sm md:text-lg leading-relaxed">
                    Our AI analyzes audio features, market trends, and commercial patterns to predict an artist's potential for mainstream success.
                  </p>
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      <span>Audio feature analysis</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      <span>Market trend tracking</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                      <span>Success pattern matching</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Resonance Score Card */}
              <div className="group relative">
                <div className="absolute inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-[#151823] rounded-xl p-4 md:p-8 h-full border border-gray-800/50 hover:border-pink-500/50 transition-all duration-300">
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-pink-500/20 flex items-center justify-center">
                      <Star className="w-5 h-5 md:w-6 md:h-6 text-pink-400" />
                    </div>
                    <h3 className="text-lg md:text-2xl font-bold text-white">Resonance Score</h3>
                  </div>
                  <p className="text-gray-300 text-sm md:text-lg leading-relaxed">
                    Get a clear percentage score showing how similar an artist's sound is to proven commercially successful artists.
                  </p>
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                      <span>Sound similarity analysis</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                      <span>Commercial success metrics</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                      <span>Genre-specific benchmarks</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Investment Edge Card */}
              <div className="group relative">
                <div className="absolute inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-[#151823] rounded-xl p-4 md:p-8 h-full border border-gray-800/50 hover:border-blue-500/50 transition-all duration-300">
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-blue-400" />
                    </div>
                    <h3 className="text-lg md:text-2xl font-bold text-white">Investment Edge</h3>
                  </div>
                  <p className="text-gray-300 text-sm md:text-lg leading-relaxed">
                    Make informed investment decisions based on data, not just gut feeling. Reduce risk and maximize potential returns.
                  </p>
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>Risk assessment</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>Return potential analysis</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-400">
                      <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                      <span>Market opportunity insights</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link to="/how-it-works">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white hover:opacity-90 px-8 py-6 text-lg transition-all duration-300 transform hover:scale-105"
                >
                  Learn More About Our AI
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Artists */}
        <section className="py-24 px-4 md:px-6 relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>

          <div className="max-w-7xl mx-auto relative">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
                Featured Artists
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Discover trending artists already using Musi$tash to connect with fans and fund their projects
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              {/* Artist Card 1 */}
              <div className="group relative">
                <div className="absolute inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-[#151823] rounded-xl p-4 md:p-6 h-full border border-gray-800/50 hover:border-blue-500/50 transition-all duration-300">
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                    <div className="relative">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                          alt="Aria Luna"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                        <svg className="w-2 h-2 md:w-3 md:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-white">Aria Luna</h3>
                      <p className="text-gray-400 text-sm md:text-base">Electro-Pop, Alternative</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 md:space-y-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
                      <span className="text-gray-300 text-sm md:text-base">Resonance Score: 92%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                      <span className="text-gray-300 text-sm md:text-base">15.2K Monthly Listeners</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
                      <span className="text-gray-300 text-sm md:text-base">Trending: +127% this month</span>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-6">
                    <Link to="/artist/aria-luna">
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 transition-opacity text-xs md:text-sm py-2 md:py-3">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Artist Card 2 */}
              <div className="group relative">
                <div className="absolute inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-[#151823] rounded-xl p-4 md:p-6 h-full border border-gray-800/50 hover:border-blue-500/50 transition-all duration-300">
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                    <div className="relative">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
                          alt="Nexus Rhythm"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                        <svg className="w-2 h-2 md:w-3 md:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-white">Nexus Rhythm</h3>
                      <p className="text-gray-400 text-sm md:text-base">Hip-Hop, R&B</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 md:space-y-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
                      <span className="text-gray-300 text-sm md:text-base">Resonance Score: 88%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                      <span className="text-gray-300 text-sm md:text-base">22.8K Monthly Listeners</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
                      <span className="text-gray-300 text-sm md:text-base">Trending: +95% this month</span>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-6">
                    <Link to="/artist/nexus-rhythm">
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 transition-opacity text-xs md:text-sm py-2 md:py-3">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Artist Card 3 */}
              <div className="group relative">
                <div className="absolute inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-[#151823] rounded-xl p-4 md:p-6 h-full border border-gray-800/50 hover:border-blue-500/50 transition-all duration-300">
                  <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                    <div className="relative">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden">
                        <img 
                          src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6"
                          alt="Echo Horizon"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                        <svg className="w-2 h-2 md:w-3 md:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-semibold text-white">Echo Horizon</h3>
                      <p className="text-gray-400 text-sm md:text-base">Indie Rock, Shoegaze</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 md:space-y-4">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
                      <span className="text-gray-300 text-sm md:text-base">Resonance Score: 85%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 md:w-5 md:h-5 text-blue-500" />
                      <span className="text-gray-300 text-sm md:text-base">18.5K Monthly Listeners</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
                      <span className="text-gray-300 text-sm md:text-base">Trending: +82% this month</span>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-6">
                    <Link to="/artist/echo-horizon">
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 transition-opacity text-xs md:text-sm py-2 md:py-3">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link to="/artists">
                <Button 
                  size="lg"
                  className="bg-transparent border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 px-8 py-6 text-lg transition-all duration-300 transform hover:scale-105"
                >
                  Explore All Artists
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
