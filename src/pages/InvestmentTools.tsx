import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, PieChart, TrendingUp, Shield, Target, BarChart3, DollarSign, ArrowRight, Zap, Users, Brain, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';

const InvestmentTools = () => {
  const tools = [
    {
      icon: <Calculator className="h-8 w-8" />,
      title: "ROI Calculator",
      description: "Calculate potential returns on music investments with our advanced modeling tools",
      features: ["Revenue projections", "Risk assessment", "Timeline analysis", "Scenario modeling"],
      status: "Live",
      color: "from-green-500 to-emerald-600",
      category: "Analysis"
    },
    {
      icon: <PieChart className="h-8 w-8" />,
      title: "Portfolio Optimizer",
      description: "Optimize your music investment portfolio for maximum returns and risk management",
      features: ["Asset allocation", "Risk balancing", "Diversification analysis", "Performance tracking"],
      status: "Live",
      color: "from-blue-500 to-cyan-600",
      category: "Management"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Market Analyzer",
      description: "Deep market analysis to identify trends and opportunities in the music industry",
      features: ["Market trends", "Genre analysis", "Competitive landscape", "Growth predictions"],
      status: "Live",
      color: "from-purple-500 to-pink-600",
      category: "Research"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Risk Assessment Tool",
      description: "Comprehensive risk analysis for music investments and artist partnerships",
      features: ["Risk scoring", "Volatility analysis", "Market correlation", "Stress testing"],
      status: "Live",
      color: "from-red-500 to-orange-600",
      category: "Risk Management"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Goal Tracker",
      description: "Set and track your investment goals with personalized milestone tracking",
      features: ["Goal setting", "Progress tracking", "Performance alerts", "Achievement insights"],
      status: "Beta",
      color: "from-indigo-500 to-purple-600",
      category: "Planning"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Performance Dashboard",
      description: "Real-time dashboard showing your investment performance and market insights",
      features: ["Real-time data", "Custom metrics", "Comparative analysis", "Export reports"],
      status: "Coming Soon",
      color: "from-teal-500 to-cyan-600",
      category: "Monitoring"
    }
  ];

  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI-Powered Insights",
      description: "Machine learning algorithms analyze market data to provide intelligent recommendations"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Risk Management",
      description: "Advanced risk assessment tools help you make informed investment decisions"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Real-Time Analytics",
      description: "Live market data and performance metrics updated in real-time"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Expert Support",
      description: "Access to investment advisors and music industry experts"
    }
  ];

  const stats = [
    { label: "AI Models Trained", value: "12+", change: "Active" },
    { label: "Data Sources Integrated", value: "50+", change: "Real-time" },
    { label: "Analysis Parameters", value: "200+", change: "Advanced" },
    { label: "Prediction Accuracy", value: "94%", change: "Validated" }
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
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-full px-4 py-2 mb-6"
            >
              <DollarSign className="h-4 w-4 text-green-400" />
              <span className="text-sm font-medium text-green-300">Professional Investment Tools</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 text-transparent bg-clip-text"
            >
              Investment Tools
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed"
            >
              Professional-grade investment tools designed specifically for music industry investments. 
              Make data-driven decisions with our comprehensive suite of analysis and management tools.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-3">
                  Start Investing
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

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-gray-900/50 rounded-lg p-6 border border-gray-700">
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400 mb-2">{stat.label}</div>
                <div className="text-xs text-green-400 font-medium">{stat.change}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16 px-4">
        <div className="container max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Investment Toolkit</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to make informed music investment decisions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <Card className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-all duration-300 h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${tool.color}`}>
                        <div className="text-white">
                          {tool.icon}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge variant="secondary" className="bg-gray-700 text-gray-300 text-xs">
                          {tool.category}
                        </Badge>
                        <Badge 
                          variant={tool.status === 'Live' ? 'default' : tool.status === 'Beta' ? 'secondary' : 'outline'}
                          className={
                            tool.status === 'Live' 
                              ? 'bg-green-500/20 text-green-400 border-green-500/50' 
                              : tool.status === 'Beta'
                              ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50'
                              : 'bg-gray-500/20 text-gray-400 border-gray-500/50'
                          }
                        >
                          {tool.status}
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className="text-xl mb-2 text-white">{tool.title}</CardTitle>
                    <CardDescription className="text-gray-300 leading-relaxed">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tool.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-300">
                          <Zap className="h-3 w-3 text-green-400 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="container max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Our Tools?</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Built specifically for music industry investments with professional-grade features
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-lg mb-4">
                  <div className="text-green-400">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2 text-white">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Tool Demo */}
      <section className="py-16 px-4">
        <div className="container max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">ROI Calculator Preview</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Get a glimpse of our professional investment tools in action
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-4xl mx-auto"
          >
            <Card className="bg-gray-900/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calculator className="h-5 w-5 text-green-400" />
                  Investment ROI Calculator
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Sample calculation for a $10,000 investment in emerging artist
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Initial Investment</span>
                      <span className="font-semibold text-green-400">$10,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Projected 12-Month ROI</span>
                      <span className="font-semibold text-green-400">+35%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Risk Score</span>
                      <span className="font-semibold text-yellow-400">Medium</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Success Probability</span>
                        <span className="font-semibold text-white">78%</span>
                      </div>
                      <Progress value={78} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-400">Market Confidence</span>
                        <span className="font-semibold text-white">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-yellow-400 mb-1">Investment Insight</div>
                      <div className="text-sm text-gray-300">
                        Based on current market trends and artist metrics, this investment shows strong potential 
                        with moderate risk. Consider diversifying with 2-3 similar investments.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-2xl p-8 md:p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Investing?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of investors using our professional tools to make smarter music investments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white px-8 py-3">
                  Access Investment Tools
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3">
                  Book Consultation
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

export default InvestmentTools; 