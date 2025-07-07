import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AIRecommendationTool from '@/components/ui/AIRecommendationTool';
import ProjectCard from '@/components/ui/ProjectCard';
import ArtistInfo from '@/components/ui/ArtistInfo';
import { artists, projects } from '@/lib/mockData';
import { Music, ArrowRight, ArrowDown, DollarSign, Users, BarChart2, Sparkles, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';

const Index = () => {
  const [isAITheme, setIsAITheme] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const aiSection = document.getElementById('ai-section');
      if (aiSection) {
        const rect = aiSection.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight * 0.5 && rect.bottom >= 0;
        setIsAITheme(isVisible);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className={`flex flex-col min-h-screen text-white theme-transition ${isAITheme ? 'ai-theme' : 'bg-[#0f1216]'}`}>
      <Navbar isAITheme={isAITheme} />
      
      {/* Hero Section - Full Screen */}
      <section className="relative overflow-hidden bg-[#0f1216] text-white min-h-screen flex items-center pt-16">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="container max-w-8xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column - Content */}
            <div className="lg:col-span-4">
              <div className="space-y-8">
                {/* Terminal-style Badge */}
                <div className="inline-flex items-center bg-gray-900/80 backdrop-blur-sm border border-green-500/30 rounded-lg px-4 py-2 font-mono text-sm opacity-0 animate-fade-in-scale">
                  <span className="text-green-400 mr-2">$</span>
                  <span className="text-green-400 typewriter-text" data-text="revolutionizing_music_investment.exe">
                    revolutionizing_music_investment.exe
                  </span>
                  <span className="text-green-400 animate-pulse ml-1">_</span>
                </div>
                
                {/* Main Title with Typewriter Effect */}
                <div className="space-y-4">
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight font-mono">
                    <div className="overflow-hidden">
                      <span className="text-white typewriter-line block" data-text="LET ARTISTS">
                        LET ARTISTS
                      </span>
                    </div>
                    <div className="overflow-hidden">
                      <span className="text-white typewriter-line block" data-text="OWN THEIR FUTURE" style={{animationDelay: '1.5s'}}>
                        OWN THEIR FUTURE
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl mt-3 overflow-hidden">
                      <span className="text-blue-400 typewriter-line block" data-text="LET FANS PROFIT FROM IT" style={{animationDelay: '3s'}}>
                        LET FANS PROFIT FROM IT
                      </span>
                    </div>
                  </h1>
                </div>
                
                {/* Tech-style Description Blocks */}
                <div className="grid grid-cols-1 gap-3 opacity-0 animate-fade-in-scale" style={{animationDelay: '4.5s'}}>
                  {/* Block 1 */}
                  <div className="bg-gray-800/80 rounded-lg p-4 flex items-center text-left">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                    <div>
                      <span className="font-mono text-base font-bold text-white flex items-center gap-2">
                        Breaking System
                      </span>
                      <div className="text-sm text-gray-300 mt-1">No more industry middlemen.</div>
                    </div>
                  </div>
                  {/* Block 2 */}
                  <div className="bg-gray-800/80 rounded-lg p-4 flex items-center text-left">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    <div>
                      <span className="font-mono text-base font-bold text-white flex items-center gap-2">
                        Direct Connection
                      </span>
                      <div className="text-sm text-gray-300 mt-1">Artists funded by fans, not corporations.</div>
                    </div>
                  </div>
                  {/* Block 3 */}
                  <div className="bg-gray-800/80 rounded-lg p-4 flex items-center text-left">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    <div>
                      <span className="font-mono text-base font-bold text-white flex items-center gap-2">
                        Shared Profits
                      </span>
                      <div className="text-sm text-gray-300 mt-1">Fans share in the upside.</div>
                    </div>
                  </div>
                </div>

                {/* Tech Declaration */}
                <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-600 rounded-lg p-4 opacity-0 animate-fade-in-scale" style={{animationDelay: '5.5s'}}>
                  <p className="text-lg md:text-xl font-mono font-bold text-white">
                    <span className="text-gray-400">[STATUS]:</span> This isn't crowdfunding.
                    <br />
                    <span className="text-blue-400">[SYSTEM]:</span> This is <span className="text-blue-400">equity for the culture</span>.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - AI Search Tool */}
            <div className="lg:col-span-8">
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 rounded-2xl p-6 border border-blue-500/30 backdrop-blur-sm">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2 font-mono flex items-center gap-2">
                    <span className="text-blue-400">{">"}</span> TEST_MUSI$TASH_AI.exe
                  </h2>
                  <p className="text-blue-300">Search any artist and discover their commercial potential instantly</p>
                </div>
                <AIRecommendationTool />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Musi$tash AI Works */}
      <section id="ai-section" className="bg-[#0f1216] py-20 text-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
              Why Our AI Predictions Matter
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
              Data-driven insights that help you invest smarter in the next generation of artists
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <BarChart2 className="h-10 w-10 text-blue-400 mb-2" />
                <CardTitle className="text-white">Smart Analysis</CardTitle>
                <CardDescription className="text-gray-400">AI-powered insights</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Our AI analyzes audio features, market trends, and commercial patterns to predict an artist's potential for mainstream success.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <Sparkles className="h-10 w-10 text-purple-400 mb-2" />
                <CardTitle className="text-white">Resonance Score</CardTitle>
                <CardDescription className="text-gray-400">Predictive metric</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Get a clear percentage score showing how similar an artist's sound is to proven commercially successful artists.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 border-gray-700/50 hover:border-green-500/50 transition-all duration-300 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <Star className="h-10 w-10 text-green-400 mb-2" />
                <CardTitle className="text-white">Investment Edge</CardTitle>
                <CardDescription className="text-gray-400">Smart decisions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Make informed investment decisions based on data, not just gut feeling. Reduce risk and maximize potential returns.
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Learn More CTA */}
          <div className="text-center">
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-xl p-8 border border-gray-700/30 backdrop-blur-sm max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-4">
                Want to understand how our AI works?
              </h3>
              <p className="text-gray-300 mb-6">
                Learn about our advanced AI technology and how it helps identify the next generation of successful artists
              </p>
              <Link to="/how-it-works">
                <Button size="lg" variant="outline" className="border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 font-semibold px-8 py-3 text-lg transition-all duration-200">
                  Learn More About Our AI
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artists Section */}
      <section className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 py-20 text-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Featured Artists
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Discover trending artists already using Musi$tash to connect with fans and fund their projects
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {artists.slice(0, 3).map((artist, index) => (
              <ArtistInfo key={index} artist={artist} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/artists">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 text-lg transition-all duration-200">
                Explore All Artists
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="bg-[#0f1216] py-20 text-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Live Investment Opportunities
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Browse current projects seeking investment and be part of their success story
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.slice(0, 3).map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link to="/projects">
              <Button size="lg" variant="outline" className="border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 font-semibold px-8 py-3 text-lg transition-all duration-200">
                View All Projects
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
