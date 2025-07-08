import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AIRecommendationTool from '@/components/ui/AIRecommendationTool';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0f1216]">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-24 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-5 space-y-12">
              {/* Terminal Badge */}
              <div className="inline-block bg-[#1a1b26] rounded-lg p-3">
                <code className="text-green-400 font-mono text-sm">$ revolutionizing_music_investment.exe_</code>
              </div>
              
              {/* Main Message */}
              <div className="space-y-4">
                <h1 className="text-7xl font-bold tracking-tight text-white leading-[1.1]">
                  LET
                  <br />
                  ARTISTS
                  <br />
                  OWN THEIR
                  <br />
                  FUTURE
                </h1>
                
                <h2 className="text-4xl font-semibold text-blue-400">
                  LET FANS PROFIT FROM IT
                </h2>
              </div>

              {/* Value Props */}
              <div className="space-y-6 text-lg border-l-2 border-gray-800 pl-6">
                <p className="text-gray-300">Breaking the traditional music industry model.</p>
                <p className="text-gray-300">Direct artist-fan connection through equity.</p>
                <p className="text-gray-300">Everyone shares in the success.</p>
              </div>

              {/* Status Box */}
              <div className="font-mono space-y-1">
                <p className="text-gray-500">[STATUS] <span className="text-white">This isn't crowdfunding.</span></p>
                <p className="text-blue-500">[SYSTEM] <span>This is equity for the culture.</span></p>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
                >
                  Try Our AI Tool
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="border-2 border-blue-500 text-blue-400 hover:bg-blue-500/10 px-8 py-6 text-lg"
                >
                  Learn More
                </Button>
              </div>
            </div>

            {/* Right Column - AI Tool */}
            <div className="lg:col-span-7">
              <div className="sticky top-24">
                <div className="bg-[#1a1b26] rounded-xl p-8 border border-gray-800 shadow-2xl">
                  <div className="mb-8">
                    <h3 className="text-xl font-mono text-white mb-2 flex items-center gap-2">
                      <span className="text-blue-400">{">"}</span> AI Recommendation Tool
                    </h3>
                    <p className="text-gray-400">Discover any artist's commercial potential instantly</p>
                  </div>
                  <AIRecommendationTool />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
