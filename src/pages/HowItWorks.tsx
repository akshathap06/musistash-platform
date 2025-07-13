
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AIRecommendationTool from "@/components/ui/AIRecommendationTool";

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-[#0f1216] text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            How Musi$tash Works
          </h1>
          <p className="text-xl text-blue-400 max-w-3xl mx-auto">
            Revolutionizing music investment through direct artist-fan connections
          </p>
        </div>
      </section>

      {/* Process Flow Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative group transition-all duration-300 hover:transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-[#151823] p-8 rounded-xl border border-gray-800/50">
                <div className="text-blue-400 text-4xl mb-4">🎵</div>
                <h3 className="text-xl font-semibold mb-4 text-white">Artists Submit Projects</h3>
                <p className="text-gray-400">Musicians create detailed project proposals with clear funding goals, timelines, and potential returns. Our AI analyzes their market potential.</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group transition-all duration-300 hover:transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-[#151823] p-8 rounded-xl border border-gray-800/50">
                <div className="text-purple-400 text-4xl mb-4">💰</div>
                <h3 className="text-xl font-semibold mb-4 text-white">Fans Invest</h3>
                <p className="text-gray-400">Supporters choose projects they believe in and invest directly in the artist's success. Unlike crowdfunding, investors receive actual equity.</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group transition-all duration-300 hover:transform hover:-translate-y-2">
              <div className="absolute inset-0 bg-gradient-to-b from-pink-500/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative bg-[#151823] p-8 rounded-xl border border-gray-800/50">
                <div className="text-pink-400 text-4xl mb-4">🌟</div>
                <h3 className="text-xl font-semibold mb-4 text-white">Shared Success</h3>
                <p className="text-gray-400">When artists succeed, everyone benefits. Investors earn returns on their investments while artists keep creative control and build their careers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Tool Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 left-1/3 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Try Our AI Recommendation Tool
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Experience how our AI analyzes artist potential and provides investment insights
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <AIRecommendationTool />
          </div>
        </div>
      </section>

      {/* Breaking Traditional Industry Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Breaking the Traditional Music Industry
              </h2>
              <div className="space-y-6 text-gray-300">
                <p>
                  For decades, the music industry has been controlled by major labels and intermediaries who take the largest share of profits while artists and fans get the least. Musi$tash changes this dynamic completely.
                </p>
                <p>
                  Our platform creates a direct connection between artists seeking funding and fans who want to support their favorite musicians while sharing in their success. This isn't crowdfunding - it's true equity participation in the music you love.
                </p>
                <p>
                  By leveraging AI technology to assess commercial potential and blockchain for transparent transactions, we're building the future of music investment where everyone benefits from artistic success.
                </p>
              </div>
              <div className="pt-8">
                <Link to="/register">
                  <Button 
                    size="lg"
                    className="bg-blue-500 hover:bg-blue-600 text-white transition-all duration-300"
                  >
                    Get Started Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative rounded-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f" 
                  alt="Artist Performance" 
                  className="w-full h-[500px] object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f1216] via-transparent to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HowItWorks;
