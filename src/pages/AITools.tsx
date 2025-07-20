import React from 'react';
import { motion } from 'framer-motion';
import { Brain, BarChart3, TrendingUp, Music, Sparkles, Zap, Target, Users, DollarSign, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MLModelDashboard from '@/components/ui/MLModelDashboard';
import { Link } from 'react-router-dom';

const AITools = () => {
  const tools = [
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Artist Analysis Engine",
      description: "Deep learning algorithms analyze artist potential, market trends, and growth trajectories",
      features: ["Predictive modeling", "Market sentiment analysis", "Growth trajectory forecasting"],
      status: "Live",
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Investment Scoring System",
      description: "AI-powered scoring system that evaluates investment opportunities across multiple metrics",
      features: ["Risk assessment", "ROI predictions", "Portfolio optimization"],
      status: "Live",
      color: "from-green-500 to-blue-600"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Market Trend Predictor",
      description: "Advanced analytics to predict music industry trends and emerging opportunities",
      features: ["Genre trend analysis", "Viral content prediction", "Market timing insights"],
      status: "Live",
      color: "from-purple-500 to-pink-600"
    },
    {
      icon: <Music className="h-8 w-8" />,
      title: "Audio Feature Analyzer",
      description: "Sophisticated audio analysis to identify hit potential and commercial viability",
      features: ["Audio fingerprinting", "Hit prediction", "Commercial appeal scoring"],
      status: "Beta",
      color: "from-orange-500 to-red-600"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Audience Insights Engine",
      description: "Deep dive into audience demographics, behavior patterns, and engagement metrics",
      features: ["Demographic analysis", "Engagement prediction", "Fan base growth modeling"],
      status: "Coming Soon",
      color: "from-teal-500 to-cyan-600"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "Strategic Recommendation System",
      description: "Personalized investment recommendations based on your portfolio and risk profile",
      features: ["Portfolio analysis", "Risk-adjusted recommendations", "Diversification insights"],
      status: "Coming Soon",
      color: "from-indigo-500 to-purple-600"
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "XGBoost ML Engine",
      description: "Advanced gradient boosting machine learning model for enhanced prediction accuracy",
      features: ["Feature importance analysis", "Real-time predictions", "Model performance monitoring"],
      status: "Live",
      color: "from-purple-500 to-pink-600"
    }
  ];

  const metrics = [
    { label: "Data Points Analyzed", value: "1.25M+", icon: <BarChart3 className="h-5 w-5" /> },
    { label: "AI Models Running", value: "13", icon: <Brain className="h-5 w-5" /> },
    { label: "Prediction Accuracy", value: "94.2%", icon: <Target className="h-5 w-5" /> },
    { label: "Artists Analyzed", value: "100K+", icon: <Music className="h-5 w-5" /> }
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
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6"
            >
              <Sparkles className="h-4 w-4 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">AI-Powered Music Intelligence</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-transparent bg-clip-text"
            >
              Advanced AI Tools
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed"
            >
              Harness the power of artificial intelligence to make smarter music investment decisions. 
              Our cutting-edge AI tools analyze millions of data points to provide unprecedented insights.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3">
                  Request Demo
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg mb-3">
                  <div className="text-blue-400">
                    {metric.icon}
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
                <div className="text-sm text-gray-400">{metric.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ML Model Dashboard */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="container max-w-7xl mx-auto">
          <MLModelDashboard />
        </div>
      </section>

      {/* AI Tools Grid */}
      <section className="py-16 px-4">
        <div className="container max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our AI Arsenal</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover the powerful AI tools that give you the edge in music investment
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
                    <CardTitle className="text-xl mb-2 text-white">{tool.title}</CardTitle>
                    <CardDescription className="text-gray-300 leading-relaxed">
                      {tool.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {tool.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-2 text-sm text-gray-300">
                          <Zap className="h-3 w-3 text-blue-400 flex-shrink-0" />
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

      {/* How It Works */}
      <section className="py-16 px-4 bg-gray-900/30">
        <div className="container max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How Our AI Works</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Behind the scenes of our intelligent music investment platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Data Ingestion",
                description: "We collect and process millions of data points from streaming platforms, social media, and industry sources in real-time."
              },
              {
                step: "02", 
                title: "AI Analysis",
                description: "Our machine learning models analyze patterns, trends, and correlations to generate actionable insights and predictions."
              },
              {
                step: "03",
                title: "Smart Recommendations",
                description: "You receive personalized investment recommendations based on your portfolio, risk tolerance, and market opportunities."
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-bold text-xl mb-6">
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
            className="text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8 md:p-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Leverage AI?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of investors who are already using our AI tools to make smarter music investment decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3">
                  Start Using AI Tools
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 px-8 py-3">
                  Schedule Demo
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

export default AITools; 