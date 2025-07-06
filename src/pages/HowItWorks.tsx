
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Music, Sparkles, Star, ArrowRight } from 'lucide-react';
import AIRecommendationTool from '../components/ui/AIRecommendationTool';
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
              Musi$tash AI Technology
            </h1>
            <p className="text-xl md:text-2xl text-blue-400 max-w-3xl mx-auto">
              Discover how our AI helps artists and investors make data-driven decisions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col justify-center space-y-6"
            >
              <h2 className="text-3xl font-bold mb-6 text-white">What is Musi$tash AI?</h2>
              <p className="text-lg leading-relaxed text-gray-300">
                Musi$tash's unique artificial intelligence revolutionizes how we evaluate emerging artists by analyzing their 
                commercial potential through a comprehensive analysis of their musical DNA, audience engagement, and market positioning.
              </p>
              <p className="text-lg leading-relaxed text-gray-300">
                Our advanced algorithm processes multiple data points to generate a
                <span className="font-bold text-blue-400"> Musi$tash Resonance Score</span> - a predictive metric that indicates 
                an artist's likelihood of commercial success by comparing their sonic characteristics, audience engagement, and market 
                presence to those of proven, commercially successful artists.
              </p>
              <p className="text-lg leading-relaxed text-gray-300">
                This powerful tool empowers both artists and investors with data-driven insights. For artists, it identifies which elements 
                of their music align with commercial success while maintaining their unique identity. For investors, it serves as a 
                quantitative indicator of an artist's market potential and growth trajectory.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50"
            >
              <img 
                src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80" 
                alt="Music studio equipment" 
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <Card className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <BarChart2 className="h-10 w-10 text-blue-400 mb-2" />
                <CardTitle className="text-white">Audio Analysis</CardTitle>
                <CardDescription className="text-gray-400">Extracts key audio metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Our AI analyzes key metrics like danceability, energy, acousticness,
                  and speechiness to create a comprehensive profile of an artist's unique sound.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <Sparkles className="h-10 w-10 text-blue-400 mb-2" />
                <CardTitle className="text-white">Comparative Analysis</CardTitle>
                <CardDescription className="text-gray-400">Matches with similar artists</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  The AI compares emerging artists with established mainstream artists,
                  identifying similarities and differences in their musical profiles.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <Star className="h-10 w-10 text-blue-400 mb-2" />
                <CardTitle className="text-white">Resonance Score</CardTitle>
                <CardDescription className="text-gray-400">Similarity and market potential</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  The resulting Resonance Score indicates how similar an artist's sound is 
                  to successful mainstream artists, helping gauge commercial potential.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4 text-white">Understanding the Resonance Score</h2>
              <p className="text-lg max-w-3xl mx-auto text-gray-400">
                See how our algorithm calculates similarity between artists
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 rounded-xl p-6 md:p-10 border border-gray-700/50 backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-2xl font-semibold mb-6 text-white">How the Score Works</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start space-x-3">
                      <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm flex-shrink-0">1</div>
                      <div>
                        <p className="font-medium text-white">Audio Feature Extraction</p>
                        <p className="text-gray-400">The AI analyzes tracks to extract key audio elements</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm flex-shrink-0">2</div>
                      <div>
                        <p className="font-medium text-white">Genre Weighting</p>
                        <p className="text-gray-400">Different elements are weighted based on genre importance</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm flex-shrink-0">3</div>
                      <div>
                        <p className="font-medium text-white">Mainstream Comparison</p>
                        <p className="text-gray-400">Artists are compared to a database of successful acts</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm flex-shrink-0">4</div>
                      <div>
                        <p className="font-medium text-white">Score Calculation</p>
                        <p className="text-gray-400">A percentage score indicates similarity to mainstream success</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <div className="bg-gray-900/70 rounded-lg p-6 shadow-lg border border-gray-700/50">
                    <h4 className="text-xl font-semibold mb-4 text-white">Resonance Score Interpretation</h4>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="text-gray-300">90% - 100%</span>
                          <span className="font-medium text-green-400">Exceptional Match</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" style={{ width: '95%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="text-gray-300">70% - 89%</span>
                          <span className="font-medium text-blue-400">Strong Match</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" style={{ width: '80%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="text-gray-300">50% - 69%</span>
                          <span className="font-medium text-amber-400">Moderate Match</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span className="text-gray-300">0% - 49%</span>
                          <span className="font-medium text-red-400">Unique Sound</span>
                        </div>
                        <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <Link to="/register">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 text-lg transition-all duration-200">
                Try Musi$tash AI Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer className="bg-[#0f1216] relative z-10" />
    </div>
  );
};

export default HowItWorks;
