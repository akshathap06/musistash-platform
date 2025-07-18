import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProjectCard from '@/components/ui/ProjectCard';
import { supabaseService } from '@/services/supabaseService';
import { projects as mockProjects } from '@/lib/mockData';
import { Search, Filter, TrendingUp, Loader2 } from 'lucide-react';

const DiscoverProjects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(false);

  // Load projects from Supabase
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setIsLoading(true);
        console.log('DiscoverProjects: Loading projects from Supabase...');
        
        // Try to load from Supabase first
        const supabaseProjects = await supabaseService.getAllProjects();
        console.log('DiscoverProjects: Supabase projects result:', supabaseProjects);
        console.log('DiscoverProjects: Number of projects found:', supabaseProjects?.length || 0);
        
        if (supabaseProjects && supabaseProjects.length > 0) {
          console.log('DiscoverProjects: Found Supabase projects, loading artist profiles...');
          
          // Get all artist profiles to map artist names
          const artistProfiles = await supabaseService.getAllArtistProfiles();
          console.log('DiscoverProjects: Artist profiles:', artistProfiles);
          
          const artistMap = new Map();
          artistProfiles.forEach(profile => {
            artistMap.set(profile.id, profile.artist_name);
          });
          console.log('DiscoverProjects: Artist map:', Object.fromEntries(artistMap));
          
          // Convert Supabase projects to the format expected by ProjectCard
          const formattedProjects = supabaseProjects.map(project => {
            // Add null checks and default values to prevent crashes
            return {
              id: project.id || 'unknown-id',
              artistId: project.artist_id || 'unknown-artist',
              title: project.title || 'Untitled Project',
              description: project.description || 'No description available',
              image: project.banner_image || '/placeholder.svg', // ProjectCard expects 'image', not 'bannerImage'
              fundingGoal: Number(project.funding_goal) || 0,
              currentFunding: 0, // TODO: Calculate from investments
              roi: Number(project.expected_roi) || 0, // ProjectCard expects 'roi', not 'expectedROI'
              deadline: project.deadline || new Date().toISOString(),
              packages: [ // ProjectCard expects 'packages' array
                {
                  id: 'default-package',
                  title: 'Basic Investment',
                  description: 'Standard investment package',
                  cost: Number(project.min_investment) || 100,
                  provider: 'MusiStash',
                  type: 'other' as const
                }
              ],
              status: (project.status as 'active' | 'funded' | 'completed') || 'active',
              createdAt: project.created_at || new Date().toISOString()
            };
          });
          
          console.log('DiscoverProjects: Formatted projects:', formattedProjects);
          setProjects(formattedProjects);
          setUseMockData(false);
        } else {
          // Fallback to mock data if no Supabase projects
          console.log('DiscoverProjects: No Supabase projects found, using mock data');
          setProjects(mockProjects);
          setUseMockData(true);
        }
      } catch (error) {
        console.error('DiscoverProjects: Error loading projects from Supabase, falling back to mock data:', error);
        // Fallback to mock data on error
        setProjects(mockProjects);
        setUseMockData(true);
      } finally {
        setIsLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Filter projects based on search and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedStatus === 'all') return matchesSearch;
    
    return matchesSearch && project.status === selectedStatus;
  });

  const statuses = ['all', 'active', 'funded', 'completed'];

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1216]">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Discover <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">Projects</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Explore and invest in the next generation of musical talent. Connect with artists, review their projects, and be part of their journey to success.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex gap-2">
              {statuses.map((status) => (
                <Button
                  key={status}
                  variant={selectedStatus === status ? "default" : "outline"}
                  onClick={() => setSelectedStatus(status)}
                  className={selectedStatus === status 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "border-white/20 text-gray-300 hover:bg-white/10"
                  }
                >
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              <div className="col-span-full text-center py-16">
                <Loader2 className="h-16 w-16 text-gray-400 mx-auto mb-4 animate-spin" />
                <p className="text-gray-400">Loading projects...</p>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
                <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
                {useMockData && (
                  <p className="text-sm text-yellow-400 mt-2">Using demo data - no projects found in database</p>
                )}
              </div>
            ) : (
              <>
                {useMockData && (
                  <div className="col-span-full mb-4">
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-center">
                      <p className="text-yellow-400 text-sm">
                        📊 Using demo data - Projects from Supabase will appear here once created
                      </p>
                    </div>
                  </div>
                )}
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 rounded-xl">
                <ProjectCard project={project} />
              </div>
            ))}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DiscoverProjects; 