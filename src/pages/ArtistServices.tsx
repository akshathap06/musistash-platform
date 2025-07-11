import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Music, DollarSign, Users, TrendingUp, Mic, Radio, Calendar, BarChart3, ArrowRight } from 'lucide-react';

const ArtistServices = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f1216]">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              Services for <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">Artists</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Everything you need to fund your music, grow your fanbase, and build a sustainable career in the music industry.
            </p>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8">
              <Music className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Coming Soon - Artist-First Platform</span>
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-400">1</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Create Profile</h3>
                <p className="text-gray-400">Set up your artist profile and showcase your music</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-400">2</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Submit Project</h3>
                <p className="text-gray-400">Upload your project details and funding requirements</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-400">3</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Get Matched</h3>
                <p className="text-gray-400">Our AI matches you with interested investors</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-yellow-400">4</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Start Creating</h3>
                <p className="text-gray-400">Receive funding and bring your music to life</p>
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">What's Coming</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <DollarSign className="h-6 w-6 text-blue-400" />
                    </div>
                    <CardTitle className="text-xl text-white">Project Funding</CardTitle>
                  </div>
                  <p className="text-gray-300">Connect with investors who believe in your music vision</p>
                </CardHeader>
              </Card>
              
              <Card className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-500/20 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-purple-400" />
                    </div>
                    <CardTitle className="text-xl text-white">AI Analytics</CardTitle>
                  </div>
                  <p className="text-gray-300">Get insights into your music's commercial potential</p>
                </CardHeader>
              </Card>
              
              <Card className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-500/20 rounded-lg">
                      <Users className="h-6 w-6 text-green-400" />
                    </div>
                    <CardTitle className="text-xl text-white">Fan Engagement</CardTitle>
                  </div>
                  <p className="text-gray-300">Build and engage with your fanbase directly</p>
                </CardHeader>
              </Card>
              
              <Card className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-500/20 rounded-lg">
                      <Radio className="h-6 w-6 text-orange-400" />
                    </div>
                    <CardTitle className="text-xl text-white">Distribution</CardTitle>
                  </div>
                  <p className="text-gray-300">Get your music on all major streaming platforms</p>
                </CardHeader>
              </Card>
              
              <Card className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-500/20 rounded-lg">
                      <Mic className="h-6 w-6 text-red-400" />
                    </div>
                    <CardTitle className="text-xl text-white">Professional Services</CardTitle>
                  </div>
                  <p className="text-gray-300">Access to industry professionals for your projects</p>
                </CardHeader>
              </Card>
              
              <Card className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-teal-500/20 rounded-lg">
                      <Calendar className="h-6 w-6 text-teal-400" />
                    </div>
                    <CardTitle className="text-xl text-white">Career Management</CardTitle>
                  </div>
                  <p className="text-gray-300">Professional guidance for your music career</p>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-gray-300 mb-8">Be the first to know when we launch artist services.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3">
                  Join Waitlist
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3">
                  Contact Us
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

export default ArtistServices; 