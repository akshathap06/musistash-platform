import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { TrendingUp, Shield, Search, BarChart3, Users, DollarSign, Target, Zap } from 'lucide-react';

const InvestorServices = () => {
  const services = [
    {
      icon: Search,
      title: "AI-Powered Discovery",
      description: "Find promising artists before they hit mainstream success",
      features: ["Machine learning algorithms", "Market trend analysis", "Talent scoring system", "Early opportunity alerts"],
      price: "Included in premium"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track your investments and portfolio performance",
      features: ["Real-time performance metrics", "ROI calculations", "Risk assessment", "Market comparisons"],
      price: "Free with investments"
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Comprehensive tools to manage investment risk",
      features: ["Diversification recommendations", "Risk scoring", "Market volatility alerts", "Portfolio optimization"],
      price: "Starting at $49/month"
    },
    {
      icon: Users,
      title: "Artist Vetting",
      description: "Thorough background checks and talent verification",
      features: ["Background verification", "Talent assessment", "Market potential analysis", "Social media audit"],
      price: "Included in platform"
    },
    {
      icon: Target,
      title: "Deal Flow",
      description: "Access to exclusive investment opportunities",
      features: ["Curated opportunities", "Early access to deals", "Exclusive partnerships", "Priority placement"],
      price: "Premium membership"
    },
    {
      icon: Zap,
      title: "Quick Execution",
      description: "Fast and secure investment processing",
      features: ["Instant transactions", "Secure payments", "Legal documentation", "Automated contracts"],
      price: "2% transaction fee"
    }
  ];

  const investmentTiers = [
    {
      name: "Starter",
      minInvestment: "$1,000",
      features: ["Basic analytics", "Standard support", "Monthly reports", "Access to public deals"],
      price: "Free"
    },
    {
      name: "Professional",
      minInvestment: "$10,000",
      features: ["Advanced analytics", "Priority support", "Weekly reports", "Early access to deals", "Risk management tools"],
      price: "$49/month"
    },
    {
      name: "Elite",
      minInvestment: "$100,000",
      features: ["Full analytics suite", "Dedicated account manager", "Daily reports", "Exclusive deals", "Custom portfolio management"],
      price: "$199/month"
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
              Services for <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">Investors</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Discover, analyze, and invest in the next generation of musical talent with our comprehensive investment platform.
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

          {/* Investment Tiers */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">Investment Tiers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {investmentTiers.map((tier, index) => (
                <Card key={index} className={`bg-gray-900/80 backdrop-blur-xl border transition-all duration-300 ${
                  index === 1 ? 'border-blue-500/50 scale-105' : 'border-gray-700/50 hover:border-blue-500/50'
                }`}>
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl text-white">{tier.name}</CardTitle>
                    <div className="text-3xl font-bold text-blue-400 mt-2">{tier.price}</div>
                    <div className="text-gray-400">Min. Investment: {tier.minInvestment}</div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-300">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-3"></div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link to="/register">
                      <Button className={`w-full mt-6 ${
                        index === 1 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                          : 'bg-gray-700/50 hover:bg-gray-600/50 text-white'
                      }`}>
                        {index === 1 ? 'Most Popular' : 'Get Started'}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Performance Stats */}
          <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 rounded-xl p-8 border border-gray-700/50 backdrop-blur-sm mb-16">
            <h2 className="text-3xl font-bold text-white mb-6 text-center">Platform Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">23%</div>
                <div className="text-gray-300">Average ROI</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-400 mb-2">$12M</div>
                <div className="text-gray-300">Total invested</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">500+</div>
                <div className="text-gray-300">Active investors</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-400 mb-2">78%</div>
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
                <h3 className="text-xl font-semibold text-white mb-2">Browse Opportunities</h3>
                <p className="text-gray-400">Explore AI-curated investment opportunities</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-400">2</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Analyze & Research</h3>
                <p className="text-gray-400">Use our analytics tools to evaluate potential</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-400">3</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Invest Securely</h3>
                <p className="text-gray-400">Make investments with secure, automated processes</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-yellow-400">4</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Track Returns</h3>
                <p className="text-gray-400">Monitor your portfolio and collect returns</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Investing?</h2>
            <p className="text-xl text-gray-400 mb-8">Join our community of smart investors discovering the next big thing in music.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg">
                  Start Investing
                </Button>
              </Link>
              <Link to="/discover-projects">
                <Button variant="outline" className="border-white/20 text-gray-300 hover:bg-white/10 px-8 py-6 text-lg">
                  Browse Opportunities
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

export default InvestorServices; 