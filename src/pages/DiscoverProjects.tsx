import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProjectCard from '@/components/ui/ProjectCard';
import { projects } from '@/lib/mockData';
import { Search, Filter, TrendingUp } from 'lucide-react';

const DiscoverProjects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

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
            {filteredProjects.map((project) => (
              <div key={project.id} className="bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 rounded-xl">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-16">
              <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DiscoverProjects; 