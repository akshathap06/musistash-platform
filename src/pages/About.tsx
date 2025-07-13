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
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">
              Meet Our Founder
            </h2>
            <p className="text-xl text-gray-400">
              The visionary behind Musi$tash's revolutionary approach to music investment
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Profile Image */}
            <div className="lg:col-span-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative rounded-xl overflow-hidden">
                  <img 
                    src="/assets/founder-image.jpg"
                    alt="Akshat Thapliyal" 
                    className="w-full aspect-[3/4] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1216] via-transparent to-transparent"></div>
                </div>
              </div>
              <div className="text-center mt-6">
                <h3 className="text-2xl font-bold text-white">Akshat Thapliyal</h3>
                <p className="text-blue-400 font-semibold">Founder & CEO</p>
                <p className="text-gray-400">CS & Applied Math @ FSU | AI Engineer</p>
              </div>
            </div>

            {/* Bio */}
            <div className="lg:col-span-8 space-y-6">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-25"></div>
                <div className="relative bg-[#151823] rounded-xl p-8 border border-gray-800/50">
                  <p className="text-gray-300 text-lg leading-relaxed mb-6">
                    Akshat Thapliyal is an AI engineer and music-tech builder focused on creating a fairer financial system for artists and fans. After developing LLM-powered platforms for Fortune 500s and generating $2M+ in impact at Sorba.AI, he turned his focus to the music industry—where artists are underpaid and fans have no stake.
                  </p>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    He founded MusiStash to flip that model. With a deep background in data and a passion for equity-driven design, Akshat is building a platform where fans invest in music they believe in—and artists keep creative control.
                  </p>
                </div>
              </div>

              {/* Platform Goals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                  <div className="relative bg-[#151823] p-6 rounded-lg border border-gray-800/50">
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">🎨</span>
                      <p className="text-gray-300">Empower Artists with Direct Funding</p>
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                  <div className="relative bg-[#151823] p-6 rounded-lg border border-gray-800/50">
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">🤝</span>
                      <p className="text-gray-300">Connect Fans Through Equity Investment</p>
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-blue-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                  <div className="relative bg-[#151823] p-6 rounded-lg border border-gray-800/50">
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">🧠</span>
                      <p className="text-gray-300">AI-Driven Investment Insights</p>
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-pink-500 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-300"></div>
                  <div className="relative bg-[#151823] p-6 rounded-lg border border-gray-800/50">
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">⚖️</span>
                      <p className="text-gray-300">Transform Music Industry Equity</p>
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