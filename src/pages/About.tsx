import React from 'react';
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const About = () => {
  return (
    <div className="min-h-screen bg-[#0f1216] text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
              About Musi$tash
            </h1>
            <p className="text-xl md:text-2xl text-blue-400 max-w-3xl mx-auto">
              Revolutionizing the music industry through AI-driven investment insights
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 w-full h-full">
              <img 
                src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f" 
                alt="Artist Performance" 
                className="w-full h-full object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0f1216] via-[#0f1216]/95 to-[#0f1216]"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-4xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold mb-12 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
                Our Mission
              </h2>
              
              <div className="space-y-8 text-gray-300 text-xl leading-relaxed">
                <p className="relative pl-6 border-l-2 border-blue-500/50">
                  Musi$tash was founded with a clear vision: to democratize music investment and empower both artists and fans through cutting-edge AI technology. We believe that the traditional music industry has failed both creators and supporters, leaving artists without proper funding and fans without the ability to share in the success of the music they love.
                </p>
                
                <p className="relative pl-6 border-l-2 border-purple-500/50">
                  Our platform breaks down these barriers by creating direct connections between artists and investors, powered by sophisticated AI algorithms that analyze commercial potential and guide investment decisions. This isn't just crowdfunding—it's true equity participation in the future of music.
                </p>
                
                <p className="relative pl-6 border-l-2 border-pink-500/50">
                  We're building a world where artists maintain creative control while accessing the funding they need, and where fans can profit from supporting the music they believe in. Together, we're creating the future of music investment.
                </p>
              </div>

              <div className="mt-12">
                <Link to="/how-it-works">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 transition-all duration-300 transform hover:scale-105 px-8 py-6 text-lg"
                  >
                    Learn How It Works
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Enhanced Background Effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gradient-to-r from-blue-500/15 to-purple-500/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-pink-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-transparent bg-clip-text">
              Meet Our Founder
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              A passionate advocate for artists who's building the future of music investment
            </p>
          </div>

          {/* Founder Header */}
          <div className="flex flex-col items-center mb-16">
            <div className="flex items-center space-x-6 mb-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full blur-lg opacity-60 group-hover:opacity-80 transition duration-500"></div>
                <div className="relative rounded-full overflow-hidden shadow-2xl">
                  <img 
                    src="/assets/founder-image.jpg"
                    alt="Akshat Thapliyal" 
                    className="w-24 h-24 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-3xl font-bold text-white mb-1">Akshat Thapliyal</h3>
                <p className="text-xl text-blue-400 font-semibold mb-1">Founder & CEO</p>
                <p className="text-gray-400 text-lg">CS & Applied Math @ FSU | AI Engineer</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-5xl mx-auto space-y-12">
            {/* Enhanced Bio */}
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 rounded-2xl blur-xl"></div>
              <div className="relative bg-gradient-to-br from-[#151823] to-[#1a1f2e] rounded-2xl p-12 border border-gray-800/50 shadow-2xl">
                <div className="space-y-8">
                  <p className="text-gray-200 text-xl leading-relaxed">
                    My journey with MusiStash isn't just about building another tech platform—it's deeply personal. I've seen firsthand how the music industry has systematically undervalued and underpaid artists, leaving them struggling to make ends meet while their music generates millions for others. This injustice has haunted me for years.
                  </p>
                  
                  <p className="text-gray-200 text-xl leading-relaxed">
                    I care deeply about artists because I understand their struggle. They pour their hearts and souls into creating music that moves us, that becomes the soundtrack to our lives, yet they're often left with scraps while others profit from their creativity. This isn't just a business problem—it's a moral one that I'm determined to solve.
                  </p>
                  
                  <p className="text-gray-200 text-xl leading-relaxed">
                    MusiStash is my answer to this deeply rooted issue. I'm building a platform where artists can access the funding they need while maintaining complete creative control, and where fans can finally share in the success of the music they love. It's about creating a fair, equitable system that honors the value of artistic expression.
                  </p>
                  
                  <p className="text-gray-200 text-xl leading-relaxed">
                    With my background in AI engineering, data science, and building LLM-powered platforms that generated $2M+ in impact at Sorba.AI, I'm applying cutting-edge technology to solve this fundamental problem. But more than the technical expertise, it's my unwavering commitment to artists and belief in their worth that drives every decision we make at MusiStash.
                  </p>
                </div>
              </div>
            </div>

            {/* Enhanced Platform Goals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative bg-gradient-to-br from-[#151823] to-[#1a1f2e] p-8 rounded-xl border border-gray-800/50 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg">🎨</div>
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-1">Empower Artists</h4>
                      <p className="text-gray-300 text-sm">Direct funding with creative control</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-pink-500 to-blue-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative bg-gradient-to-br from-[#151823] to-[#1a1f2e] p-8 rounded-xl border border-gray-800/50 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl bg-gradient-to-r from-pink-500 to-blue-500 p-3 rounded-lg">🤝</div>
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-1">Connect Fans</h4>
                      <p className="text-gray-300 text-sm">Equity investment in music they love</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative bg-gradient-to-br from-[#151823] to-[#1a1f2e] p-8 rounded-xl border border-gray-800/50 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-lg">🧠</div>
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-1">AI Insights</h4>
                      <p className="text-gray-300 text-sm">Data-driven investment guidance</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition duration-300"></div>
                <div className="relative bg-gradient-to-br from-[#151823] to-[#1a1f2e] p-8 rounded-xl border border-gray-800/50 shadow-xl group-hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-lg">⚖️</div>
                    <div>
                      <h4 className="text-white font-semibold text-lg mb-1">Transform Equity</h4>
                      <p className="text-gray-300 text-sm">Fair music industry economics</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About; 