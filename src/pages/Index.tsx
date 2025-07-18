
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProjectCard from '@/components/ui/ProjectCard';
import { projects } from '@/lib/mockData';
import { ArrowRight, Music, TrendingUp, Users, DollarSign } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-[#0f1216]">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white">
            Fund the Future of <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">Music</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto">
            Connect with emerging artists, invest in their projects, and be part of their journey to success. 
            Discover the next generation of musical talent on MusiStash.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/browse-artists">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                Browse Artists
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/discover-projects">
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg">
                Discover Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 md:px-6 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-8 border border-gray-700/50">
              <Music className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-white mb-2">500+</h3>
              <p className="text-gray-400">Active Artists</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-8 border border-gray-700/50">
              <DollarSign className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-white mb-2">$2.5M+</h3>
              <p className="text-gray-400">Funds Raised</p>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl p-8 border border-gray-700/50">
              <TrendingUp className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-white mb-2">85%</h3>
              <p className="text-gray-400">Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Current <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">Projects</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Browse current projects seeking investment and be part of their success story
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 rounded-xl">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/discover-projects">
              <Button variant="outline" className="border-blue-500 text-blue-300 hover:bg-blue-500/20 px-8 py-3">
                View All Projects
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 md:px-6 bg-gray-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              How It <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">Works</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Simple steps to start investing in the next generation of music
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-400">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Browse Artists</h3>
              <p className="text-gray-400">Discover talented artists and explore their projects looking for funding</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-400">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Invest & Support</h3>
              <p className="text-gray-400">Choose projects you believe in and invest to help bring them to life</p>
            </div>
            <div className="text-center">
              <div className="bg-green-500/20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-400">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Share Success</h3>
              <p className="text-gray-400">Enjoy returns on your investment as artists achieve their goals</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to Get <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">Started?</span>
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of investors supporting the future of music
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4">
                Sign Up Now
              </Button>
            </Link>
            <Link to="/how-it-works">
              <Button variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10 px-8 py-4">
                Learn More
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
