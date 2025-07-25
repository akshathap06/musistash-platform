import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projects } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';
import { Search, Star, TrendingUp, Users, ArrowRight } from 'lucide-react';
import ArtistProfileCard from './ArtistProfileCard';
import { artistProfileService } from '@/services/artistProfileService';
import type { Database } from '@/lib/supabase';

type ArtistProfile = Database['public']['Tables']['artist_profiles']['Row'];

const FeaturedSection = () => {
  const [featuredArtists, setFeaturedArtists] = useState<ArtistProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get active projects
  const activeProjects = projects.filter(project => project.status === 'active');

  useEffect(() => {
    const loadFeaturedArtists = async () => {
      try {
        setIsLoading(true);
        const allProfiles = await artistProfileService.getAllProfiles();
        // Get first 3 approved artists
        const approvedArtists = allProfiles.filter(profile => profile.status === 'approved').slice(0, 3);
        setFeaturedArtists(approvedArtists);
      } catch (error) {
        console.error('Error loading featured artists:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedArtists();
  }, []);

  return (
    <div className="space-y-32">
      {/* Live Investment Opportunities Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4 text-white">Live Investment Opportunities</h2>
          <p className="text-gray-400 text-lg">
            Browse current projects seeking investment and be part of their success story
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {activeProjects.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="overflow-hidden bg-[#1a1b26]/50 backdrop-blur-sm border-[#2a2b36] hover:border-blue-500/50 transition-all duration-300">
                <div className="relative h-48">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <Badge className="absolute top-3 right-3 bg-blue-500 text-white">
                    Active
                  </Badge>
                </div>
                
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{project.description}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white">${project.currentFunding.toLocaleString()}</span>
                      <span className="text-blue-400">{project.roi}% ROI</span>
                    </div>
                    <Progress 
                      value={(project.currentFunding / project.fundingGoal) * 100}
                      className="h-1 [&>div]:bg-blue-500 bg-gray-700"
                    />
                    <div className="flex justify-between text-xs mt-2">
                      <span className="text-gray-400">{Math.round((project.currentFunding / project.fundingGoal) * 100)}% Funded</span>
                      <span className="text-gray-400">0 days left</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    {project.packages.slice(0, 3).map((pkg) => (
                      <Badge 
                        key={pkg.id} 
                        variant="outline" 
                        className="bg-transparent border-gray-700 text-gray-400"
                      >
                        {pkg.type}
                      </Badge>
                    ))}
                  </div>

                  <Link to={`/project/${project.id}`} className="block">
                    <Button 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600"
                    >
                      View Project
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link to="/discover-projects">
            <Button variant="outline" size="lg" className="border-blue-500/20 text-blue-400 hover:bg-blue-500/10">
              View All Projects →
            </Button>
          </Link>
        </div>
      </section>

      {/* Why Our AI Predictions Matter Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-white">Why Our AI Predictions Matter</h2>
          <p className="text-gray-400 text-lg">
            Data-driven insights that help you invest smarter in the next generation of artists
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-[#1a1b26]/50 backdrop-blur-sm border-[#2a2b36] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Search className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Smart Analysis</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Our AI analyzes audio features, market trends, and commercial patterns to predict an artist's potential for mainstream success.
            </p>
            <ul className="space-y-2">
              <li className="text-sm text-purple-400">• Audio feature analysis</li>
              <li className="text-sm text-purple-400">• Market trend tracking</li>
              <li className="text-sm text-purple-400">• Success pattern matching</li>
            </ul>
          </Card>

          <Card className="bg-[#1a1b26]/50 backdrop-blur-sm border-[#2a2b36] p-6">
            <div className="flex items-center gap-2 mb-4">
              <Star className="h-5 w-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Resonance Score</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Get a clear percentage score showing how similar an artist's sound is to proven commercially successful artists.
            </p>
            <ul className="space-y-2">
              <li className="text-sm text-purple-400">• Sound similarity analysis</li>
              <li className="text-sm text-purple-400">• Commercial success metrics</li>
              <li className="text-sm text-purple-400">• Genre-specific benchmarks</li>
            </ul>
          </Card>

          <Card className="bg-[#1a1b26]/50 backdrop-blur-sm border-[#2a2b36] p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Investment Edge</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              Make informed investment decisions based on data, not just gut feeling. Reduce risk and maximize potential returns.
            </p>
            <ul className="space-y-2">
              <li className="text-sm text-purple-400">• Risk assessment</li>
              <li className="text-sm text-purple-400">• Return potential analysis</li>
              <li className="text-sm text-purple-400">• Market opportunity insights</li>
            </ul>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            className="bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600"
          >
            Learn More About Our AI →
          </Button>
        </div>
      </section>

      {/* Featured Artists Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-white">Featured Artists</h2>
          <p className="text-gray-400 text-lg">
            Discover trending artists already using Musi$tash to connect with fans and fund their projects
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-800/50 rounded-2xl h-96"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {featuredArtists.map((artist) => (
              <motion.div
                key={artist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ArtistProfileCard 
                  artist={artist}
                  showFollowButton={true}
                  className="w-full"
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Explore All Artists Button */}
        <div className="flex justify-center mb-32">
          <Link to="/artists" className="inline-flex items-center px-6 py-3 text-sm font-medium text-white transition-colors bg-gradient-to-r from-blue-600 to-purple-600 rounded-full hover:from-blue-700 hover:to-purple-700">
            Explore All Artists
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FeaturedSection; 