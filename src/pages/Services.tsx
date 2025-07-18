import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { TrendingUp, BarChart3, Users, Music, DollarSign, ArrowRight, Sparkles, Brain, Target, Shield } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "AI-Powered Investment Analysis",
      description: "Advanced machine learning algorithms analyze artist potential, market trends, and investment opportunities in real-time.",
      features: ["Artist potential scoring", "Market trend analysis", "Risk assessment", "ROI predictions"],
      status: "Live",
      color: "from-blue-500 to-purple-600",
      link: "/ai-tools"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Professional Investment Tools",
      description: "Comprehensive suite of tools designed specifically for music industry investments and portfolio management.",
      features: ["Portfolio optimization", "Risk management", "Performance tracking", "Investment calculator"],
      status: "Live",
      color: "from-green-500 to-blue-600",
      link: "/investment-tools"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Artist Services",
      description: "Complete platform for artists to connect with investors, manage projects, and build sustainable music careers.",
      features: ["Project funding", "Investor matching", "Career management", "Analytics dashboard"],
      status: "Coming Soon",
      color: "from-purple-500 to-pink-600",
      link: "/artist-services"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Market Intelligence",
      description: "Deep market insights and trend analysis to help you make informed investment decisions in the music industry.",
      features: ["Genre trend analysis", "Emerging artist identification", "Market timing insights", "Industry reports"],
      status: "Live",
      color: "from-orange-500 to-red-600",
      link: "/ai-tools"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Risk Management",
      description: "Comprehensive risk assessment and management tools to protect your music investment portfolio.",
      features: ["Risk scoring", "Portfolio diversification", "Stress testing", "Market correlation analysis"],
      status: "Live",
      color: "from-red-500 to-pink-600",
      link: "/investment-tools"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Investment Advisory",
      description: "Personalized investment recommendations and strategic guidance from music industry experts.",
      features: ["Portfolio review", "Strategy consultation", "Market opportunities", "Expert insights"],
      status: "Beta",
      color: "from-teal-500 to-cyan-600",
      link: "/contact"
    }
  ];

  const stats = [
    { label: "AI Models Active", value: "12+", icon: <Brain className="h-5 w-5" /> },
    { label: "Data Sources", value: "50+", icon: <BarChart3 className="h-5 w-5" /> },
    { label: "Analysis Parameters", value: "200+", icon: <Target className="h-5 w-5" /> },
    { label: "Prediction Accuracy", value: "94%", icon: <TrendingUp className="h-5 w-5" /> }
  ];

  return (
    <div className="min-h-screen bg-[rgb(15,18,22)] text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6"
            >
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span className="text-sm font-medium text-purple-300">Complete Music Investment Platform</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-blue-400 to-green-400 text-transparent bg-clip-text"
            >
              Our Features
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed"
            >
              Comprehensive suite of AI-powered tools and features designed specifically for music investment. 
              From intelligent analysis to professional portfolio management.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-8 py-3">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3">
                  Schedule Demo
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Platform Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg mb-3">
                  <div className="text-purple-400">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 px-4">
        <div className="container max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Complete Service Suite</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to succeed in music investment, powered by cutting-edge AI
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${service.color}`}>
                        <div className="text-white">
                          {service.icon}
                        </div>
                      </div>
                      <Badge 
                        variant={service.status === 'Live' ? 'default' : service.status === 'Beta' ? 'secondary' : 'outline'}
                        className={
                          service.status === 'Live' 
                            ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                            : service.status === 'Beta'
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                            : 'bg-gray-500/20 text-gray-400 border-gray-500/50'
                        }
                      >
                        {service.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mb-2 text-white">{service.title}</CardTitle>
                    <CardDescription className="text-gray-300 leading-relaxed">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-300">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link to={service.link} className="w-full">
                      <Button variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="container max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">How It Works</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get started with our platform in just a few simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Sign Up",
                description: "Create your account and complete your investor profile to get personalized recommendations."
              },
              {
                step: "02", 
                title: "Explore & Analyze",
                description: "Use our AI-powered tools to analyze artists, market trends, and investment opportunities."
              },
              {
                step: "03",
                title: "Invest & Track",
                description: "Make informed investment decisions and track your portfolio performance in real-time."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-600 rounded-full text-white font-bold text-xl mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">{step.title}</h3>
                <p className="text-gray-300 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-8 md:p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Start Your Music Investment Journey?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join the future of music investment with our comprehensive AI-powered platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white px-8 py-3">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3">
                  Talk to an Expert
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
