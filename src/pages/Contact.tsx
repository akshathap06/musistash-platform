import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Instagram, MessageCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Contact = () => {
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
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-blue-400 max-w-3xl mx-auto">
              Connect with the Musi$tash team and join our growing community
            </p>
          </div>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-700/30 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-sm h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-white">Email Us</CardTitle>
                      <p className="text-blue-400">For business inquiries and support</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-6">
                    Get in touch with our team for partnerships, investor relations, artist onboarding, 
                    or any questions about the Musi$tash platform.
                  </p>
                  <a 
                    href="mailto:Akshathapliyal27@gmail.com" 
                    className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200"
                  >
                    <Mail className="mr-2 h-5 w-5" />
                    Akshathapliyal27@gmail.com
                  </a>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 border-purple-700/30 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-sm h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <Instagram className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-white">Follow Us</CardTitle>
                      <p className="text-purple-400">Stay updated with our latest news</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-6">
                    Follow @musistash on Instagram for behind-the-scenes content, artist spotlights, 
                    platform updates, and the latest from the music investment world.
                  </p>
                  <a 
                    href="https://instagram.com/musistash" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200"
                  >
                    <Instagram className="mr-2 h-5 w-5" />
                    @musistash
                  </a>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Contact Information */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-white">We'd Love to Hear From You</h2>
              <p className="text-lg max-w-3xl mx-auto text-gray-400">
                Whether you're an artist looking to get funded, an investor seeking opportunities, 
                or just curious about our platform, we're here to help.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 rounded-xl p-8 md:p-12 border border-gray-700/50 backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-8 w-8 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">General Inquiries</h3>
                  <p className="text-gray-300">Questions about the platform, how it works, or getting started</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Business Partnerships</h3>
                  <p className="text-gray-300">Interested in partnering with us or exploring business opportunities</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Instagram className="h-8 w-8 text-pink-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Community Updates</h3>
                  <p className="text-gray-300">Follow our journey and connect with other artists and investors</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-white">Quick Answers</h2>
              <p className="text-lg max-w-3xl mx-auto text-gray-400">
                Common questions we get about Musi$tash
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-xl p-6 border border-gray-700/30 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-3">How do I get started as an artist?</h3>
                <p className="text-gray-300">
                  Simply create an account, submit your project proposal, and our AI will analyze your commercial potential. 
                  We'll guide you through the entire process.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-xl p-6 border border-gray-700/30 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-3">How can I invest in artists?</h3>
                <p className="text-gray-300">
                  Browse our artist profiles, review their AI-generated insights, and invest directly in projects you believe in. 
                  It's equity participation, not crowdfunding.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-xl p-6 border border-gray-700/30 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-3">What makes your AI special?</h3>
                <p className="text-gray-300">
                  Our AI analyzes audio features, market trends, and commercial potential to generate a Resonance Score 
                  that predicts similarity to successful mainstream artists.
                </p>
              </div>
              
              <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-xl p-6 border border-gray-700/30 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-white mb-3">Is my investment protected?</h3>
                <p className="text-gray-300">
                  All investments are handled through transparent, legally binding contracts with clear terms and conditions. 
                  We prioritize investor protection and fair returns.
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to Connect?
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Join thousands of artists and investors who are already part of the Musi$tash community.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:Akshathapliyal27@gmail.com"
                className="inline-flex"
              >
                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-12 py-4 text-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                  <Mail className="mr-2 h-5 w-5" />
                  Send Us an Email
                </Button>
              </a>
              <a 
                href="https://instagram.com/musistash"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 font-semibold px-12 py-4 text-lg transition-all duration-200">
                  <Instagram className="mr-2 h-5 w-5" />
                  Follow on Instagram
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact; 