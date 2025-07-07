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
      <section className="relative overflow-hidden bg-[#0f1216] text-white min-h-screen flex items-center justify-center pt-16">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="container max-w-7xl mx-auto px-4 relative z-10 py-8">
          <div className="flex flex-col items-center justify-center text-center max-w-6xl mx-auto space-y-8">
            
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
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight font-mono">
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
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl mt-3 overflow-hidden">
                  <span className="text-blue-400 typewriter-line block" data-text="LET FANS PROFIT FROM IT" style={{animationDelay: '3s'}}>
                    LET FANS PROFIT FROM IT
                  </span>
                </div>
              </h1>
            </div>
            
            {/* Tech-style Description Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto opacity-0 animate-fade-in-scale" style={{animationDelay: '4.5s'}}>
              {/* Block 1 */}
              <div className="bg-gray-800/80 rounded-lg p-6 flex flex-col items-center text-center">
                <div className="flex items-center mb-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                  <span className="font-mono text-base font-bold text-white flex items-center gap-2">
                    <span className="mr-1">&#9888;</span> {/* warning icon */}
                    Breaking System
                  </span>
                </div>
                <div className="text-gray-300 text-sm mt-2">No more industry middlemen.</div>
              </div>
              {/* Block 2 */}
              <div className="bg-gray-800/80 rounded-lg p-6 flex flex-col items-center text-center">
                <div className="flex items-center mb-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  <span className="font-mono text-base font-bold text-white flex items-center gap-2">
                    <span className="mr-1">&#128279;</span> {/* link icon */}
                    Direct Connection
                  </span>
                </div>
                <div className="text-gray-300 text-sm mt-2">Artists funded by fans, not corporations.</div>
              </div>
              {/* Block 3 */}
              <div className="bg-gray-800/80 rounded-lg p-6 flex flex-col items-center text-center">
                <div className="flex items-center mb-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  <span className="font-mono text-base font-bold text-white flex items-center gap-2">
                    <span className="mr-1">&#128200;</span> {/* chart icon */}
                    Shared Profits
                  </span>
                </div>
                <div className="text-gray-300 text-sm mt-2">Fans share in the upside.</div>
              </div>
            </div>

            {/* Tech Declaration */}
            <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-600 rounded-lg p-4 opacity-0 animate-fade-in-scale" style={{animationDelay: '5.5s'}}>
              <p className="text-xl md:text-2xl font-mono font-bold text-white">
                <span className="text-gray-400">[STATUS]:</span> This isn't crowdfunding.
                <br />
                <span className="text-blue-400">[SYSTEM]:</span> This is <span className="text-blue-400">equity for the culture</span>.
              </p>
            </div>
            
            {/* CTA to Try AI */}
            <div className="flex flex-col items-center gap-6 opacity-0 animate-fade-in-scale" style={{animationDelay: '6s'}}>
              <div className="bg-gray-900/80 backdrop-blur-sm border border-blue-500/30 rounded-lg px-6 py-3 font-mono text-lg">
                <span className="text-gray-400">[SYSTEM]:</span>
                <span className="text-blue-400 ml-2">Ready to test our AI?</span>
              </div>
              
              <Link to="/how-it-works">
                <Button size="lg" variant="outline" className="border-2 border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white font-semibold px-8 py-4 text-lg transition-all duration-200 font-mono">
                  {">"} LEARN_MORE
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Scroll Indicator - Moved to bottom corner */}
          <div className="absolute bottom-6 right-6 animate-bounce">
            <div className="flex flex-col items-center text-gray-400/60 hover:text-gray-300 transition-colors cursor-pointer">
              <span className="font-mono text-xs mb-1">SCROLL_TO_TEST</span>
              <ArrowDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Immediate AI Test Section */}
      <section className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 py-20 text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="container max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-mono">
              {">"} TEST_MUSI$TASH_AI.exe
            </h2>
            <p className="text-xl text-blue-300 max-w-2xl mx-auto">
              Search any artist and discover their commercial potential instantly
            </p>
          </div>
          
          {/* Concise Sign-Up Section */}
          <div className="text-center mb-8">
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center max-w-md mx-auto">
              <span className="text-gray-400 font-mono text-sm">Ready to invest?</span>
              <div className="flex gap-3">
                <Link to="/register">
                  <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-2 text-sm transition-all duration-200 font-mono">
                    {">"} Sign Up
                  </Button>
                </Link>
                <Link to="/artists">
                  <Button size="sm" variant="outline" className="border border-blue-500/50 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 font-semibold px-6 py-2 text-sm transition-all duration-200 font-mono">
                    {">"} Browse Artists
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* AI Search Tool */}
          <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/60 rounded-2xl p-8 md:p-12 border border-blue-500/30 backdrop-blur-sm">
            <AIRecommendationTool />
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
                Dive deep into our technology, see detailed score breakdowns, and learn about our algorithm.
              </p>
              <Link to="/how-it-works">
                <Button size="lg" variant="outline" className="border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 font-semibold px-8 py-3 text-lg transition-all duration-200">
                  Learn About Our AI Technology
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-[#0f1216] py-20 text-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How MusiStash Works
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Our platform connects artists seeking funding with listeners who want to support and invest in music projects
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center hover:border-gray-500 transition-all duration-300">
              <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-gray-700 flex items-center justify-center">
                <Music className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Artists List Projects</h3>
              <p className="text-gray-300 leading-relaxed">
                Musicians create project listings with transparent funding goals, 
                package breakdowns, and potential return on investment.
              </p>
            </div>
            
            <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center hover:border-gray-500 transition-all duration-300">
              <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-gray-700 flex items-center justify-center">
                <DollarSign className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Listeners Invest</h3>
              <p className="text-gray-300 leading-relaxed">
                Music fans browse projects, choose those they believe in, 
                and invest to help artists achieve their funding goals.
              </p>
            </div>
            
            <div className="bg-gray-900/70 backdrop-blur-sm border border-gray-700 rounded-xl p-8 text-center hover:border-gray-500 transition-all duration-300">
              <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-gray-700 flex items-center justify-center">
                <Users className="h-8 w-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white">Everyone Benefits</h3>
              <p className="text-gray-300 leading-relaxed">
                When projects succeed, artists achieve their goals, investors 
                earn returns, and music gets created. It's a win for everyone.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-16">
            <Link to="/how-it-works">
              <Button variant="outline" className="border-2 border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-8 text-lg font-semibold transition-all duration-200">
                Learn More
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
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Featured Projects
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Discover exciting music projects seeking funding and investment
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/projects">
              <Button variant="outline" className="border-2 border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-8 text-lg font-semibold transition-all duration-200">
                View All Projects
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Artists Section */}
      <section className="bg-[#181c23] py-20 text-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Featured Artists
            </h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Meet the musicians raising funds and sharing their success with investors
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {artists.map((artist) => (
              <div key={artist.id} className="bg-gray-900/70 backdrop-blur-sm border border-gray-700 p-8 rounded-xl hover:border-gray-500 transition-all duration-300">
                <ArtistInfo artist={artist} expanded={true} />
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Link to="/artists">
              <Button variant="outline" className="border-2 border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-8 text-lg font-semibold transition-all duration-200">
                View All Artists
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-[#0f1216] py-24 text-white">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to Invest in the Future of Music?
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Join thousands of music lovers who are funding their favorite artists and sharing in their success.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-10 text-lg transition-all duration-200">
                Create an Account
              </Button>
            </Link>
            <Link to="/projects">
              <Button size="lg" variant="outline" className="border-2 border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white font-semibold py-4 px-10 text-lg transition-all duration-200">
                Browse Projects
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
