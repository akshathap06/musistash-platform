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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
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
            <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-600 rounded-lg p-4 opacity-0 animate-fade-in-scale" style={{animationDelay: '6s'}}>
              <p className="text-xl md:text-2xl font-mono font-bold text-white">
                <span className="text-gray-400">[STATUS]:</span> This isn't crowdfunding.
                <br />
                <span className="text-blue-400">[SYSTEM]:</span> This is <span className="text-blue-400">equity for the culture</span>.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in-scale" style={{animationDelay: '6.5s'}}>
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 text-lg transition-all duration-200 font-mono">
                  {">"} INITIALIZE_ACCOUNT
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/how-it-works">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white font-semibold px-8 py-4 text-lg transition-all duration-200 font-mono">
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
      <section id="ai-section" className="bg-[#0f1216] py-16 text-white">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              Welcome to MusiStash AI
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <AIRecommendationTool />
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
