
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProjectCard from '@/components/ui/ProjectCard';
import { projects } from '@/lib/mockData';
import { ArrowRight, TrendingUp, Users, DollarSign, Music } from 'lucide-react';

const Index = () => {
  // Show only first 3 projects for the homepage
  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1216]">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Invest in the Future of{' '}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                Music
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Connect directly with emerging artists, fund their projects, and share in their success. 
              The next big hit could be one click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                <Link to="/discover-projects">Start Investing</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="px-8 py-3">
                <Link to="/how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-8">
              <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-white mb-2">$2.5M+</h3>
              <p className="text-gray-400">Total Funding Raised</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-8">
              <Users className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-white mb-2">500+</h3>
              <p className="text-gray-400">Active Artists</p>
            </div>
            <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-700/50 rounded-xl p-8">
              <Music className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-white mb-2">150+</h3>
              <p className="text-gray-400">Projects Funded</p>
            </div>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Browse current projects seeking investment and be part of their success story
            </h2>
            <p className="text-xl text-gray-400">
              Discover the next generation of musical talent
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProjects.map((project) => (
              <div key={project.id} className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 rounded-xl">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Button asChild variant="outline" size="lg" className="border-blue-500 text-blue-400 hover:bg-blue-500/10">
              <Link to="/discover-projects">
                View All Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-400">
              Simple steps to start your music investment journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">1</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Discover Artists</h3>
              <p className="text-gray-400">
                Browse through curated profiles of emerging artists and their upcoming projects
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">2</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Make Investment</h3>
              <p className="text-gray-400">
                Choose projects that resonate with you and invest directly in their success
              </p>
            </div>
            <div className="text-center">
              <div className="bg-pink-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-xl">3</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Share Success</h3>
              <p className="text-gray-400">
                Earn returns as artists grow their careers and achieve commercial success
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Discover the Next Big Thing?
            </h2>
            <p className="text-xl text-gray-400 mb-8">
              Join thousands of investors already supporting emerging musical talent
            </p>
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3">
              <Link to="/register">Get Started Today</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
