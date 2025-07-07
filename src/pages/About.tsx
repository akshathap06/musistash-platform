import React from 'react';
import { motion } from 'framer-motion';
import { Music, Code, TrendingUp, Users, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const About = () => {
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
              About Musi$tash
            </h1>
            <p className="text-xl md:text-2xl text-blue-400 max-w-3xl mx-auto">
              Revolutionizing the music industry through AI-driven investment insights
            </p>
          </div>

          {/* Mission Statement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col justify-center space-y-6"
            >
              <h2 className="text-3xl font-bold mb-6 text-white">Our Mission</h2>
              <p className="text-lg leading-relaxed text-gray-300">
                Musi$tash was founded with a clear vision: to democratize music investment and empower both artists and fans 
                through cutting-edge AI technology. We believe that the traditional music industry has failed both creators 
                and supporters, leaving artists without proper funding and fans without the ability to share in the success 
                of the music they love.
              </p>
              <p className="text-lg leading-relaxed text-gray-300">
                Our platform breaks down these barriers by creating direct connections between artists and investors, 
                powered by sophisticated AI algorithms that analyze commercial potential and guide investment decisions. 
                This isn't just crowdfunding—it's true equity participation in the future of music.
              </p>
              <p className="text-lg leading-relaxed text-gray-300">
                We're building a world where artists maintain creative control while accessing the funding they need, 
                and where fans can profit from supporting the music they believe in. Together, we're creating the 
                future of music investment.
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
                alt="Musicians collaborating in studio" 
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
            </motion.div>
          </div>

          {/* Founder Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-white">Meet Our Founder</h2>
              <p className="text-lg max-w-3xl mx-auto text-gray-400">
                The visionary behind Musi$tash's revolutionary approach to music investment
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 rounded-xl p-8 md:p-12 border border-gray-700/50 backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                      <span className="text-2xl font-bold text-white">AT</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Akshat Thapliyal</h3>
                      <p className="text-blue-400 font-semibold">Founder & CEO</p>
                      <p className="text-gray-400">CS & Applied Math @ FSU | AI Engineer</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4">
                    Akshat is a quant & AI engineering enthusiast who builds intelligent systems at the intersection of AI, finance, and creative technology. 
                    Currently serving as an AI Data Science Intern at Sorba.AI, he has co-developed and fine-tuned custom transformer-based LLMs for major clients 
                    including Coca-Cola and Johnson & Johnson.
                  </p>
                  
                  <p className="text-gray-300 mb-4">
                    His work has delivered tangible results: improving predictive maintenance accuracy by 35%, reducing unplanned equipment failures by 22%, 
                    and integrating LLMs into IoT platforms that generated $2.1M in estimated annual savings.
                  </p>
                  
                  <p className="text-gray-300">
                    Through his experience in fintech research at MicroSave Consulting, where he conducted extensive AgriTech market research and facilitated 
                    over 25 key partnership meetings, Akshat recognized the need for a more equitable music industry ecosystem—leading to the creation of Musi$tash.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-xl font-semibold mb-4 text-white">Key Achievements</h4>
                  <ul className="space-y-3 text-gray-300">
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-400 mt-1">🤖</span>
                      <span>Co-developed custom LLMs for Fortune 500 companies</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-400 mt-1">📊</span>
                      <span>35% improvement in predictive maintenance accuracy</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-400 mt-1">💰</span>
                      <span>$2.1M in estimated annual savings through AI integration</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-400 mt-1">🌱</span>
                      <span>Secured 10+ government and private sector partnerships</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <span className="text-blue-400 mt-1">🎵</span>
                      <span>Founded Musi$tash to democratize music investment</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Our Values */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-white">Our Core Values</h2>
              <p className="text-lg max-w-3xl mx-auto text-gray-400">
                The principles that guide everything we do at Musi$tash
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <Music className="h-10 w-10 text-blue-400 mb-2" />
                  <CardTitle className="text-white">Artist First</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    We believe artists should maintain creative control while accessing fair funding opportunities.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <Code className="h-10 w-10 text-purple-400 mb-2" />
                  <CardTitle className="text-white">AI-Powered</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    Cutting-edge AI technology drives our investment insights and commercial potential analysis.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 border-gray-700/50 hover:border-green-500/50 transition-all duration-300 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <TrendingUp className="h-10 w-10 text-green-400 mb-2" />
                  <CardTitle className="text-white">Transparent</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    All transactions and investment terms are transparent, fair, and clearly communicated.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 border-gray-700/50 hover:border-pink-500/50 transition-all duration-300 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <Users className="h-10 w-10 text-pink-400 mb-2" />
                  <CardTitle className="text-white">Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">
                    We're building a community where artists and fans succeed together through shared ownership.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to Join the Music Revolution?
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Be part of the future where artists and fans prosper together through fair, AI-driven music investment.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-12 py-4 text-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                  Get Started Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 font-semibold px-12 py-4 text-lg transition-all duration-200">
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

export default About; 