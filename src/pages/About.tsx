import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f1216]">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="py-24 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-5xl md:text-6xl font-bold mb-6"
            >
              About <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">Musi</span>
              <span className="text-blue-500">$tash</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-blue-400 max-w-3xl mx-auto"
            >
              Revolutionizing the music industry through AI-driven investment insights
            </motion.p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 text-white">Our Mission</h2>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-4xl mx-auto space-y-6"
          >
            <p className="text-lg leading-relaxed text-gray-300">
              MusiStash was founded with a clear vision: to democratize music investment and empower both artists and fans through cutting-edge AI technology. We believe that the traditional music industry has failed both creators and supporters, leaving artists without proper funding and fans without the ability to share in the success of the music they love.
            </p>
            <p className="text-lg leading-relaxed text-gray-300">
              Our platform breaks down these barriers by creating direct connections between artists and investors, powered by sophisticated AI algorithms that analyze commercial potential and guide investment decisions. This isn't just crowdfunding—it's true equity participation in the future of music.
            </p>
            <p className="text-lg leading-relaxed text-gray-300">
              We're building a world where artists maintain creative control while accessing the funding they need, and where fans can profit from supporting the music they believe in. Together, we're creating the future of music investment.
            </p>
            <div className="text-center pt-8">
              <Link to="/how-it-works">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3">
                  Learn How It Works →
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Founder Section */}
        <section className="py-24 px-4 md:px-6 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 text-white">Meet Our Founder</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              The visionary behind MusiStash's revolutionary approach to music investment
            </p>
          </motion.div>

          <div className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 rounded-xl p-8 md:p-12 border border-gray-700/50 backdrop-blur-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex items-center mb-6"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden mr-6 border-2 border-blue-500/50">
                    <img
                      src="/lovable-uploads/f3770010-64bf-4539-b28e-1e6985324bf5.png"
                      alt="Akshat Thapliyal - Founder & CEO"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">Akshat Thapliyal</h3>
                    <p className="text-blue-400 font-semibold">Founder & CEO</p>
                    <p className="text-gray-400">CS & Applied Math @ PSU | AI Engineer</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="space-y-4"
                >
                  <p className="text-gray-300">
                    Akshat is a quant & AI engineering enthusiast who builds intelligent systems at the intersection of AI, finance, and creative technology. Currently serving as an AI Data Science Intern at Sorba.AI, he has co-developed and fine-tuned custom transformer-based LLMs for major clients including Coca-Cola and Johnson & Johnson.
                  </p>
                  
                  <p className="text-gray-300">
                    His work has delivered tangible results: improving predictive maintenance accuracy by 35%, reducing unplanned equipment failures by 22%, and integrating LLMs into IoT platforms that generated $2.1M in estimated annual savings.
                  </p>
                  
                  <p className="text-gray-300">
                    Through his experience in fintech research at MicroSave Consulting, where he conducted extensive AgriTech market research and facilitated over 25 key partnership meetings, Akshat recognized the need for a more equitable music industry ecosystem—leading to the creation of MusiStash.
                  </p>
                </motion.div>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
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
                    <span>Facilitated 25+ key partnership meetings</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-400 mt-1">🎵</span>
                    <span>Founded MusiStash to democratize music investment</span>
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 px-4 md:px-6 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 text-white">Our Core Values</h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              The principles that guide everything we do at MusiStash
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: "🎵",
                title: "Artist First",
                description: "We believe artists should maintain creative control while accessing fair funding opportunities."
              },
              {
                icon: "🤖",
                title: "AI-Powered",
                description: "Cutting-edge AI technology drives our investment insights and commercial potential analysis."
              },
              {
                icon: "📊",
                title: "Transparent",
                description: "All transactions and investment terms are transparent, fair, and clearly communicated."
              },
              {
                icon: "👥",
                title: "Community",
                description: "We're building a community where artists and fans succeed together through shared ownership."
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="bg-gradient-to-br from-gray-900/70 to-gray-800/30 rounded-xl p-6 border border-gray-700/50 backdrop-blur-sm hover:border-blue-500/50 transition-all duration-300"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-white">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 md:px-6 max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Join the Music Revolution?
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Be part of the future where artists and fans prosper together through fair, AI-driven music investment.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/register">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold px-12 py-4 text-lg">
                Get Started Today →
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="w-full sm:w-auto border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 hover:text-blue-300 font-semibold px-12 py-4 text-lg">
                Contact Us
              </Button>
            </Link>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About; 