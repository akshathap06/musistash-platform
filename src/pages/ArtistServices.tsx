import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Music, DollarSign, Users, TrendingUp, Mic, Radio, Calendar, BarChart3 } from 'lucide-react';

const ArtistServices = () => {
  const services = [
    {
      icon: DollarSign,
      title: "Project Funding",
      description: "Raise capital for your music projects through our investor network",
      features: ["Equity-based funding", "Transparent terms", "Investor matching", "Campaign management"],
      price: "5% platform fee"
    },
    {
      icon: BarChart3,
      title: "AI Analytics",
      description: "Get detailed insights into your music's commercial potential",
      features: ["Market analysis", "Trend predictions", "Audience insights", "Performance metrics"],
      price: "Free with funding"
    },
    {
      icon: Users,
      title: "Fan Engagement",
      description: "Build and engage with your fanbase through exclusive content",
      features: ["Exclusive releases", "Behind-the-scenes content", "Fan voting", "Community building"],
      price: "Starting at $29/month"
    },
    {
      icon: Radio,
      title: "Distribution",
      description: "Get your music on all major streaming platforms",
      features: ["Spotify, Apple Music, etc.", "Radio promotion", "Playlist placement", "Release strategy"],
      price: "Starting at $19/month"
    },
    {
      icon: Mic,
      title: "Professional Services",
      description: "Access to industry professionals for your projects",
      features: ["Producers", "Sound engineers", "Music video directors", "Marketing specialists"],
      price: "Varies by service"
    },
    {
      icon: Calendar,
      title: "Career Management",
      description: "Professional guidance for your music career",
      features: ["Career planning", "Industry connections", "Brand development", "Performance opportunities"],
      price: "Starting at $99/month"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1216]">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Services for <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">Artists</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Everything you need to fund your music, grow your fanbase, and build a sustainable career in the music industry.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {services.map((service, index) => (
              <Card key={index} className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <service.icon className="h-6 w-6 text-blue-400" />
                    </div>
                    <CardTitle className="text-xl text-white">{service.title}</CardTitle>
                  </div>
                  <p className="text-gray-300">{service.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-300">
                        <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="border-blue-500/50 text-blue-400 bg-blue-500/10">
                      {service.price}
                    </Badge>
                    <Link to="/contact">
                      <Button variant="outline" className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10">
                        Learn More
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Success Stories */}
          <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 rounded-xl p-8 border border-gray-700/50 backdrop-blur-sm mb-16">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Success Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">$2.5M</div>
                <div className="text-gray-300">Total funding raised</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">150+</div>
                <div className="text-gray-300">Artists funded</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">85%</div>
                <div className="text-gray-300">Success rate</div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">How It Works</h2>
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

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-gray-400 mb-8">Join thousands of artists who have funded their dreams through MusiStash.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg">
                  Get Started Today
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/10 px-8 py-6 text-lg">
                  Schedule a Demo
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