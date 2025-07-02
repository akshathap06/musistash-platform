import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AIRecommendationTool from '@/components/ui/AIRecommendationTool';
import ProjectCard from '@/components/ui/ProjectCard';
import ArtistInfo from '@/components/ui/ArtistInfo';
import { artists, projects } from '@/lib/mockData';
import { Music, ArrowRight, ArrowDown, DollarSign, Users } from 'lucide-react';

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
      <section className="relative overflow-hidden bg-[#0f1216] text-white min-h-screen flex items-center justify-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col items-center justify-center text-center max-w-6xl mx-auto">
            
            {/* Terminal-style Badge */}
            <div className="inline-flex items-center bg-gray-900/80 backdrop-blur-sm border border-green-500/30 rounded-lg px-4 py-2 mb-8 font-mono text-sm opacity-0 animate-fade-in-scale">
              <span className="text-green-400 mr-2">$</span>
              <span className="text-green-400 typewriter-text" data-text="revolutionizing_music_investment.exe">
                revolutionizing_music_investment.exe
              </span>
              <span className="text-green-400 animate-pulse ml-1">_</span>
            </div>
            
            {/* Main Title with Typewriter Effect */}
            <div className="space-y-6 mb-12">
              <h1 className="text-4xl md:text-8xl font-black tracking-tight leading-tight font-mono">
                <div className="overflow-hidden">
                  <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent typewriter-line block" data-text="LET ARTISTS">
                    LET ARTISTS
                  </span>
                </div>
                <div className="overflow-hidden">
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent typewriter-line block" data-text="OWN THEIR FUTURE" style={{animationDelay: '1.5s'}}>
                    OWN THEIR FUTURE
                  </span>
                </div>
                <div className="text-2xl md:text-4xl mt-4 overflow-hidden">
                  <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent typewriter-line block" data-text="LET FANS PROFIT FROM IT" style={{animationDelay: '3s'}}>
                    LET FANS PROFIT FROM IT
                  </span>
                </div>
              </h1>
            </div>
            
            {/* Tech-style Description Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
              
              {/* Block 1 */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-red-500/30 rounded-lg p-6 opacity-0 animate-fade-in-scale" style={{animationDelay: '4.5s'}}>
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="font-mono text-sm text-red-400">BREAKING_SYSTEM</span>
                </div>
                <p className="text-white text-left">
                  Destroying the <span className="bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent font-bold">industry model</span>.
                  <br />Eliminating <span className="bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent font-bold">middlemen</span>.
                  <br />No more <span className="bg-gradient-to-r from-gray-400 to-gray-500 bg-clip-text text-transparent font-bold">lion's share</span> theft.
                </p>
              </div>

              {/* Block 2 */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-blue-500/30 rounded-lg p-6 opacity-0 animate-fade-in-scale" style={{animationDelay: '5s'}}>
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="font-mono text-sm text-blue-400">DIRECT_CONNECTION</span>
                </div>
                <p className="text-white text-left">
                  Artists raise capital <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-bold">directly from fans</span>.
                  <br />No intermediaries.
                  <br />Pure connection.
                </p>
              </div>

              {/* Block 3 */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 opacity-0 animate-fade-in-scale" style={{animationDelay: '5.5s'}}>
                <div className="flex items-center mb-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="font-mono text-sm text-green-400">SHARED_PROFITS</span>
                </div>
                <p className="text-white text-left">
                  Fans invest in talent.
                  <br />Share in the <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent font-bold">upside</span>.
                  <br />Win together.
                </p>
              </div>
            </div>

            {/* Tech Declaration */}
            <div className="bg-gray-900/80 backdrop-blur-sm border border-purple-500/30 rounded-lg p-6 mb-12 opacity-0 animate-fade-in-scale" style={{animationDelay: '6s'}}>
              <p className="text-2xl md:text-3xl font-mono font-bold text-white">
                <span className="text-gray-400">[STATUS]:</span> This isn't crowdfunding.
                <br />
                <span className="text-purple-400">[SYSTEM]:</span> This is <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">equity for the culture</span>.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center opacity-0 animate-fade-in-scale" style={{animationDelay: '6.5s'}}>
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-4 text-lg shadow-lg transform transition-all duration-200 hover:scale-105 font-mono">
                  {">"} INITIALIZE_ACCOUNT
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-green-400 text-green-400 hover:bg-green-400 hover:text-black font-bold px-8 py-4 text-lg transition-all duration-200 font-mono">
                  {">"} LEARN_PROTOCOL
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Scroll Indicator - Moved to bottom corner */}
          <div className="absolute bottom-6 right-6 animate-bounce">
            <div className="flex flex-col items-center text-gray-400/60 hover:text-gray-300 transition-colors cursor-pointer">
              <span className="font-mono text-xs mb-1">SCROLL_TO_ANALYZE</span>
              <ArrowDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      </section>
      
      {/* AI Recommendation Section */}
      <section id="ai-section" className="theme-transition bg-gradient-to-br from-[#1a1a2e] via-[#16213e] to-[#0f4c75] py-20 border-y text-white relative overflow-hidden">
        {/* Tech Grid Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
        
        {/* Floating Tech Elements */}
        <div className="absolute top-10 left-10 w-4 h-4 border border-blue-400 rotate-45 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-6 h-6 border border-purple-400 rotate-12 animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-20 left-20 w-5 h-5 border border-green-400 rotate-45 animate-pulse" style={{animationDelay: '2s'}}></div>
        
        <div className="container max-w-7xl mx-auto px-4 relative z-10">
          <AIRecommendationTool />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-[#181c23] py-20 text-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="section-heading">How MusiStash Works</h2>
            <p className="section-subheading max-w-3xl mx-auto text-gray-300">
              Our platform connects artists seeking funding with listeners who want to support and invest in music projects
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#232834] rounded-xl p-6 text-center animate-slide-up">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center">
                <Music className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Artists List Projects</h3>
              <p className="text-gray-300">
                Musicians create project listings with transparent funding goals, 
                package breakdowns, and potential return on investment.
              </p>
            </div>
            
            <div className="bg-[#232834] rounded-xl p-6 text-center animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Listeners Invest</h3>
              <p className="text-gray-300">
                Music fans browse projects, choose those they believe in, 
                and invest to help artists achieve their funding goals.
              </p>
            </div>
            
            <div className="bg-[#232834] rounded-xl p-6 text-center animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-gray-700 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Everyone Benefits</h3>
              <p className="text-gray-300">
                When projects succeed, artists achieve their goals, investors 
                earn returns, and music gets created. It's a win for everyone.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/how-it-works">
              <Button variant="outline" className="border-gray-500 text-black hover:bg-green-600 hover:text-white">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Featured Projects Section */}
      <section className="bg-[#232834] py-20 text-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="section-heading">Featured Projects</h2>
              <p className="text-gray-300 max-w-2xl">
                Discover exciting music projects seeking funding and investment
              </p>
            </div>
            <Link to="/projects">
              <Button variant="outline" className="border-gray-500 text-black">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Artists Section */}
      <section className="bg-[#0f1216] py-20 border-y text-white">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="section-heading">Featured Artists</h2>
              <p className="text-gray-300 max-w-2xl">
                Meet the musicians raising funds and sharing their success with investors
              </p>
            </div>
            <Link to="/artists">
              <Button variant="outline" className="border-gray-500 text-black">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {artists.map((artist) => (
              <div key={artist.id} className="bg-[#232834] p-6 rounded-xl shadow-sm">
                <ArtistInfo artist={artist} expanded={true} />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-[#232834] py-20 text-white">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Invest in the Future of Music?</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
            Join thousands of music lovers who are funding their favorite artists and sharing in their success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-gray-700 text-white hover:bg-gray-600">
                Create an Account
              </Button>
            </Link>
            <Link to="/projects">
              <Button size="lg" variant="outline" className="border-gray-500 text-black hover:bg-green-600 hover:text-white">
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
