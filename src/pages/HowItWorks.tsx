
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Music, Sparkles, Star, ArrowRight, DollarSign, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f1216] text-white">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
              How Musi$tash Works
            </h1>
            <p className="text-xl md:text-2xl text-blue-400 max-w-3xl mx-auto">
              Revolutionizing music investment through direct artist-fan connections
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col justify-center space-y-6"
            >
              <h2 className="text-3xl font-bold mb-6 text-white">Breaking the Traditional Music Industry</h2>
              <p className="text-lg leading-relaxed text-gray-300">
                For decades, the music industry has been controlled by major labels and intermediaries who take the largest share of profits while artists and fans get the least. Musi$tash changes this dynamic completely.
              </p>
              <p className="text-lg leading-relaxed text-gray-300">
                Our platform creates a direct connection between artists seeking funding and fans who want to support their favorite musicians while sharing in their success. This isn't crowdfunding - it's true equity participation in the music you love.
              </p>
              <p className="text-lg leading-relaxed text-gray-300">
                By leveraging AI technology to assess commercial potential and blockchain for transparent transactions, we're building the future of music investment where everyone benefits from artistic success.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50"
            >
              <img 
                src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80" 
                alt="Musicians collaborating" 
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <Card className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <Music className="h-10 w-10 text-blue-400 mb-2" />
                <CardTitle className="text-white">Artists Submit Projects</CardTitle>
                <CardDescription className="text-gray-400">Transparent funding goals</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Musicians create detailed project proposals with clear funding goals, timelines, and potential returns. Our AI analyzes their commercial potential to help set realistic expectations.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <DollarSign className="h-10 w-10 text-blue-400 mb-2" />
                <CardTitle className="text-white">Fans Invest</CardTitle>
                <CardDescription className="text-gray-400">Direct equity participation</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Supporters choose projects they believe in and invest directly in the artist's success. Unlike crowdfunding, investors receive actual equity shares in the music's future earnings.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <Users className="h-10 w-10 text-blue-400 mb-2" />
                <CardTitle className="text-white">Shared Success</CardTitle>
                <CardDescription className="text-gray-400">Everyone profits together</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  When artists succeed, everyone benefits. Investors earn returns on their investments while artists keep creative control and build lasting relationships with their supporters.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-20">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold mb-4 text-white">The Investment Process</h3>
              <p className="text-lg max-w-3xl mx-auto text-gray-400">
                Step-by-step guide to investing in music through Musi$tash
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 rounded-xl p-6 md:p-10 border border-gray-700/50 backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h4 className="text-2xl font-semibold mb-6 text-white">For Investors</h4>
                  <ul className="space-y-4">
                    <li className="flex items-start space-x-3">
                      <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm flex-shrink-0">1</div>
                      <div>
                        <p className="font-medium text-white">Create Your Account</p>
                        <p className="text-gray-400">Sign up and complete identity verification</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm flex-shrink-0">2</div>
                      <div>
                        <p className="font-medium text-white">Browse Projects</p>
                        <p className="text-gray-400">Explore artist projects and AI-generated insights</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm flex-shrink-0">3</div>
                      <div>
                        <p className="font-medium text-white">Make Investments</p>
                        <p className="text-gray-400">Choose investment amounts and secure your equity</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm flex-shrink-0">4</div>
                      <div>
                        <p className="font-medium text-white">Track Performance</p>
                        <p className="text-gray-400">Monitor your investments and receive returns</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-2xl font-semibold mb-6 text-white">For Artists</h4>
                  <ul className="space-y-4">
                    <li className="flex items-start space-x-3">
                      <div className="h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm flex-shrink-0">1</div>
                      <div>
                        <p className="font-medium text-white">Submit Your Project</p>
                        <p className="text-gray-400">Create a detailed project proposal with funding goals</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm flex-shrink-0">2</div>
                      <div>
                        <p className="font-medium text-white">AI Analysis</p>
                        <p className="text-gray-400">Get your Resonance Score and commercial potential assessment</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm flex-shrink-0">3</div>
                      <div>
                        <p className="font-medium text-white">Raise Funds</p>
                        <p className="text-gray-400">Connect with investors and secure project funding</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="h-6 w-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm flex-shrink-0">4</div>
                      <div>
                        <p className="font-medium text-white">Create & Share</p>
                        <p className="text-gray-400">Make your music and share success with your investors</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-20">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold mb-4 text-white">Why Musi$tash is Different</h3>
              <p className="text-lg max-w-3xl mx-auto text-gray-400">
                Comparing traditional music funding vs. the Musi$tash model
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 rounded-xl p-6 border border-red-700/30 backdrop-blur-sm">
                <h4 className="text-2xl font-semibold mb-4 text-red-400">Traditional Model</h4>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-red-400">✗</span>
                    <span>Labels take 80-90% of profits</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-400">✗</span>
                    <span>Artists lose creative control</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-400">✗</span>
                    <span>Fans have no financial upside</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-400">✗</span>
                    <span>Opaque contracts and accounting</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-red-400">✗</span>
                    <span>High barriers to entry</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 rounded-xl p-6 border border-green-700/30 backdrop-blur-sm">
                <h4 className="text-2xl font-semibold mb-4 text-green-400">Musi$tash Model</h4>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start space-x-2">
                    <span className="text-green-400">✓</span>
                    <span>Artists keep majority ownership</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-400">✓</span>
                    <span>Full creative control maintained</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-400">✓</span>
                    <span>Fans earn returns on investments</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-400">✓</span>
                    <span>Transparent blockchain transactions</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-green-400">✓</span>
                    <span>Open to all artists and investors</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="mb-8">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to be part of the music revolution?
              </h3>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Join thousands of artists and investors building the future of music together
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-12 py-4 text-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 font-semibold px-12 py-4 text-lg transition-all duration-200">
                  Try Our AI Tool
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer className="bg-[#0f1216] relative z-10" />
    </div>
  );
};

export default HowItWorks;
