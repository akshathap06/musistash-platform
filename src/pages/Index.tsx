import React from 'react';
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
  return (
    <div className="flex flex-col min-h-screen bg-[#0f1216] text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="mt-16 relative overflow-hidden bg-[#0f1216] text-white">
        <div className="container max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="flex flex-col items-center justify-center text-center max-w-5xl mx-auto">
            <div className="space-y-8">
              <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-900/20 px-4 py-2 text-sm font-semibold transition-colors focus:outline-none mb-6 opacity-0 animate-fade-in-scale">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Revolutionizing Music Investment</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent opacity-0 animate-slide-in-left animate-delay-300 block">
                  Let Artists Own Their Future.
                </span>
                <br />
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent opacity-0 animate-slide-in-right animate-delay-600 block">
                  Let Fans Profit From It.
                </span>
              </h1>
              
              <div className="max-w-4xl mx-auto space-y-4">
                <p className="text-xl md:text-2xl font-medium text-white leading-relaxed opacity-0 animate-fade-in-scale animate-delay-900">
                  We're breaking the <span className="bg-gradient-to-r from-gray-400 to-gray-500 bg-clip-text text-transparent font-bold">industry model</span>. 
                  No more <span className="bg-gradient-to-r from-red-400 to-red-500 bg-clip-text text-transparent font-bold">middlemen</span>. 
                  No more labels taking the <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-bold">lion's share</span>.
                </p>
                
                <p className="text-lg md:text-xl text-white leading-relaxed opacity-0 animate-fade-in-scale animate-delay-1200">
                  Artists raise capital <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-bold">directly from fans</span>. 
                  Fans invest in the talent they believe in, and share in the <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent font-bold">upside</span> when that artist wins.
                </p>
                
                <p className="text-xl md:text-2xl font-bold text-white opacity-0 animate-fade-in-scale" style={{animationDelay: '1.5s'}}>
                  <span className="text-gray-400">This isn't crowdfunding.</span>{" "}
                  This is <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">equity for the culture</span>.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-6 pt-8 justify-center opacity-0 animate-fade-in-scale" style={{animationDelay: '1.8s'}}>
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-4 text-lg shadow-lg transform transition-all duration-200 hover:scale-105">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-black font-semibold px-8 py-4 text-lg transition-all duration-200">
                    How It Works
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
            <ArrowDown className="h-6 w-6 text-gray-400" />
          </div>
        </div>
      </section>
      
      {/* AI Recommendation Section */}
      <section className="bg-[#0f1216] py-20 border-y text-white">
        <div className="container max-w-7xl mx-auto px-4">
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
