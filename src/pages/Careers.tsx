import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Code, Users, TrendingUp, ArrowRight, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Careers = () => {
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
              Join Our Team
            </h1>
            <p className="text-xl md:text-2xl text-blue-400 max-w-3xl mx-auto">
              Help us revolutionize the music industry with AI-driven innovation
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
              <h2 className="text-3xl font-bold mb-6 text-white">Why Work at Musi$tash?</h2>
              <p className="text-lg leading-relaxed text-gray-300">
                We're building the future of music investment, where artists maintain creative control while accessing 
                fair funding, and fans can profit from supporting the music they love. Join us in disrupting an industry 
                that's been controlled by gatekeepers for too long.
              </p>
              <p className="text-lg leading-relaxed text-gray-300">
                At Musi$tash, you'll work with cutting-edge AI technology, collaborate with passionate music enthusiasts, 
                and directly impact the lives of artists and investors worldwide. We're looking for talented individuals 
                who share our vision of democratizing music investment.
              </p>
              <p className="text-lg leading-relaxed text-gray-300">
                As a growing startup, every team member plays a crucial role in shaping our product, culture, and success. 
                You'll have the opportunity to grow with us and make a lasting impact on the music industry.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-sm border border-gray-700/50"
            >
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80" 
                alt="Team collaboration" 
                className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
              />
            </motion.div>
          </div>

          {/* Current Openings */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-white">Current Openings</h2>
              <p className="text-lg max-w-3xl mx-auto text-gray-400">
                We're always looking for talented individuals to join our mission
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Code className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white">AI/ML Engineer</CardTitle>
                      <p className="text-gray-400">Full-time • Remote/Hybrid</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Work on our core AI algorithms that analyze music and predict commercial success. 
                    Experience with machine learning, audio processing, and Python required.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">Python</span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">TensorFlow</span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">Audio Processing</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Code className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white">Full Stack Developer</CardTitle>
                      <p className="text-gray-400">Full-time • Remote/Hybrid</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Build and maintain our platform's frontend and backend systems. 
                    Experience with React, TypeScript, and modern web technologies required.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">React</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">TypeScript</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm">Node.js</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 border-gray-700/50 hover:border-green-500/50 transition-all duration-300 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-green-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white">Business Development</CardTitle>
                      <p className="text-gray-400">Full-time • Remote/Hybrid</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Drive partnerships with artists, labels, and investors. 
                    Experience in music industry, business development, or sales preferred.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Sales</span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Music Industry</span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">Partnerships</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 border-gray-700/50 hover:border-pink-500/50 transition-all duration-300 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-pink-400" />
                    </div>
                    <div>
                      <CardTitle className="text-xl text-white">Marketing Manager</CardTitle>
                      <p className="text-gray-400">Full-time • Remote/Hybrid</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">
                    Lead our marketing efforts across social media, content creation, and community building. 
                    Experience with digital marketing and music industry knowledge preferred.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm">Digital Marketing</span>
                    <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm">Social Media</span>
                    <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm">Content</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Company Culture */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-white">Our Culture & Values</h2>
              <p className="text-lg max-w-3xl mx-auto text-gray-400">
                What makes Musi$tash a great place to work
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-xl border border-gray-700/30 backdrop-blur-sm">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Code className="h-8 w-8 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Innovation First</h3>
                <p className="text-gray-300">
                  We push the boundaries of what's possible with AI and music technology, always staying ahead of the curve.
                </p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-xl border border-gray-700/30 backdrop-blur-sm">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Collaborative Spirit</h3>
                <p className="text-gray-300">
                  We believe the best ideas come from diverse perspectives and open collaboration across all teams.
                </p>
              </div>
              
              <div className="text-center p-6 bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-xl border border-gray-700/30 backdrop-blur-sm">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Growth Mindset</h3>
                <p className="text-gray-300">
                  We encourage continuous learning and provide opportunities for professional and personal growth.
                </p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-white">What We Offer</h2>
              <p className="text-lg max-w-3xl mx-auto text-gray-400">
                Competitive benefits and perks for our team members
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 rounded-xl p-8 md:p-12 border border-gray-700/50 backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">💰 Compensation & Equity</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Competitive salary based on experience</li>
                    <li>• Equity package with growth potential</li>
                    <li>• Performance-based bonuses</li>
                    <li>• Annual salary reviews</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">🏥 Health & Wellness</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Comprehensive health insurance</li>
                    <li>• Mental health support</li>
                    <li>• Flexible work arrangements</li>
                    <li>• Wellness stipend</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">📚 Growth & Learning</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Professional development budget</li>
                    <li>• Conference attendance support</li>
                    <li>• Online learning platforms</li>
                    <li>• Mentorship opportunities</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">🎵 Music Perks</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Music streaming subscriptions</li>
                    <li>• Concert tickets and events</li>
                    <li>• Early access to platform features</li>
                    <li>• Artist collaboration opportunities</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Application Process */}
          <div className="text-center">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Ready to Join Our Mission?
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
                Don't see a role that fits? We're always open to hearing from talented individuals who share our vision.
              </p>
              
              <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-8 border border-blue-700/30 backdrop-blur-sm max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold text-white mb-4">How to Apply</h3>
                <p className="text-gray-300 mb-6">
                  Send us your resume, portfolio, and a brief note about why you want to join Musi$tash. 
                  We'll get back to you within 48 hours.
                </p>
                <a 
                  href="mailto:Akshathapliyal27@gmail.com?subject=Career%20Opportunity%20at%20Musi$tash"
                  className="inline-flex"
                >
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-12 py-4 text-lg transition-all duration-200 shadow-lg hover:shadow-xl">
                    <Mail className="mr-2 h-5 w-5" />
                    Apply Now
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Careers; 