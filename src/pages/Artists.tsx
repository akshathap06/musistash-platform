
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const Artists = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#0f1216] text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
              Discover Emerging Artists
            </h1>
            <p className="text-xl text-blue-400 max-w-3xl mx-auto">
              Explore and invest in the next generation of musical talent. Connect with artists, review their projects, and be part of their journey to success.
            </p>
          </div>

          {/* Search Section */}
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-14 pl-12 pr-4 bg-[#151823] border-gray-800 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <Button 
                className="absolute right-2 top-2 bg-blue-500 hover:bg-blue-600"
              >
                Filter
              </Button>
            </div>

            {/* Filter Tags */}
            <div className="flex flex-wrap gap-2 mt-4 justify-center">
              <Button variant="ghost" className="text-white bg-[#151823] hover:bg-[#1c2231] border border-gray-800">
                Trending Artists
              </Button>
              <Button variant="ghost" className="text-white bg-[#151823] hover:bg-[#1c2231] border border-gray-800">
                New Artists
              </Button>
              <Button variant="ghost" className="text-white bg-[#151823] hover:bg-[#1c2231] border border-gray-800">
                Recommended
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Artists Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Artist Card 1 */}
            <div className="group relative bg-[#151823] rounded-xl overflow-hidden border border-gray-800/50 transition-all duration-300 hover:border-blue-500/50">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f1216]/90"></div>
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img 
                        src="https://images.unsplash.com/photo-1535223289827-42f1e9919769" 
                        alt="Aria Luna"
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                      />
                      <CheckCircle2 className="absolute -bottom-1 -right-1 h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold">Aria Luna</h3>
                        <Badge className="bg-blue-500/20 text-blue-400 border border-blue-500/50">
                          85% Match
                        </Badge>
                      </div>
                      <p className="text-gray-400">45,000 followers</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-300">
                    Electro-pop artist pushing boundaries with innovative sound design and heartfelt lyrics.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                      Electro-Pop
                    </Badge>
                    <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                      Alternative
                    </Badge>
                  </div>
                  <div className="pt-4">
                    <Link to="/artist/aria-luna">
                      <Button className="w-full bg-blue-500 hover:bg-blue-600 transition-colors duration-300">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Artist Card 2 */}
            <div className="group relative bg-[#151823] rounded-xl overflow-hidden border border-gray-800/50 transition-all duration-300 hover:border-purple-500/50">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f1216]/90"></div>
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img 
                        src="https://images.unsplash.com/photo-1516280440614-37939bbacd81" 
                        alt="Nexus Rhythm"
                        className="w-16 h-16 rounded-full object-cover border-2 border-purple-500"
                      />
                      <CheckCircle2 className="absolute -bottom-1 -right-1 h-5 w-5 text-purple-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold">Nexus Rhythm</h3>
                        <Badge className="bg-purple-500/20 text-purple-400 border border-purple-500/50">
                          78% Match
                        </Badge>
                      </div>
                      <p className="text-gray-400">78,000 followers</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-300">
                    Hip-hop collective bringing fresh perspectives through collaborative storytelling.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-purple-500/50 text-purple-400">
                      Hip-Hop
                    </Badge>
                    <Badge variant="outline" className="border-pink-500/50 text-pink-400">
                      R&B
                    </Badge>
                  </div>
                  <div className="pt-4">
                    <Link to="/artist/nexus-rhythm">
                      <Button className="w-full bg-purple-500 hover:bg-purple-600 transition-colors duration-300">
                        View Profile
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Artist Card 3 */}
            <div className="group relative bg-[#151823] rounded-xl overflow-hidden border border-gray-800/50 transition-all duration-300 hover:border-pink-500/50">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0f1216]/90"></div>
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img 
                        src="https://images.unsplash.com/photo-1501612780327-45045538702b" 
                        alt="Echo Horizon"
                        className="w-16 h-16 rounded-full object-cover border-2 border-pink-500"
                      />
                      <CheckCircle2 className="absolute -bottom-1 -right-1 h-5 w-5 text-pink-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-semibold">Echo Horizon</h3>
                        <Badge className="bg-pink-500/20 text-pink-400 border border-pink-500/50">
                          82% Match
                        </Badge>
                      </div>
                      <p className="text-gray-400">32,000 followers</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-300">
                    Indie rock band blending nostalgic sounds with futuristic production techniques.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-pink-500/50 text-pink-400">
                      Indie Rock
                    </Badge>
                    <Badge variant="outline" className="border-blue-500/50 text-blue-400">
                      Shoegaze
                    </Badge>
                  </div>
                  <div className="pt-4">
                    <Link to="/artist/echo-horizon">
                      <Button className="w-full bg-pink-500 hover:bg-pink-600 transition-colors duration-300">
                        View Profile
                      </Button>
                    </Link>
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

export default Artists;
