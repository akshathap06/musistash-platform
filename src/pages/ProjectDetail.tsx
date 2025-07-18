import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import InvestmentModal from '@/components/ui/InvestmentModal';
import { useAuth } from '@/hooks/useAuth';

const ProjectDetail = () => {
  const { projectId } = useParams();
  const { isAuthenticated } = useAuth();
  const [investmentAmount, setInvestmentAmount] = useState(500);
  const [isInvestmentModalOpen, setIsInvestmentModalOpen] = useState(false);

  // Mock data - in real app, fetch this based on projectId
  const projectData = {
    title: "Lunar Echoes - Debut Album",
    artist: "Aria Luna",
    artistImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    genres: ["Electro-Pop", "Alternative"],
    coverImage: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f",
    description: "My first full-length album exploring themes of technology and human connection through electro-pop.",
    extendedDescription: "This project aims to push creative boundaries while establishing a sustainable revenue model. By investing in this project, you're not only supporting the creation of innovative music but also potentially sharing in its financial success.",
    fundingDetails: "The funds will be used to cover production costs, recording sessions, marketing, and distribution. Each aspect of the project has been carefully budgeted to maximize both artistic quality and commercial potential.",
    raised: 32500,
    goal: 50000,
    roi: 7.5,
    daysLeft: 0,
    fundedPercentage: 65,
    minInvestment: 100,
    maxInvestment: 10000,
    status: "Active Project"
  };

  const calculateEstimatedEarnings = (amount: number) => {
    return (amount * projectData.roi / 100).toFixed(2);
  };

  const handleInvestClick = () => {
    if (!isAuthenticated) {
      // Could redirect to login or show login modal
      return;
    }
    setIsInvestmentModalOpen(true);
  };

  const handleInvestmentComplete = () => {
    // Refresh project data or show success message
    console.log('Investment completed successfully!');
  };

  // Create a compatible project object for the investment modal
  const compatibleProject = {
    id: projectId || '1',
    title: projectData.title,
    description: projectData.description,
    image: projectData.coverImage,
    currentFunding: projectData.raised,
    fundingGoal: projectData.goal,
    roi: projectData.roi,
    status: 'active' as 'active' | 'funded' | 'completed',
    deadline: new Date(Date.now() + projectData.daysLeft * 24 * 60 * 60 * 1000).toISOString(),
    packages: [
      {
        id: '1',
        title: 'Basic Investment',
        description: 'Support the project with a basic investment',
        cost: projectData.minInvestment,
        provider: 'Artist',
        type: 'other' as 'producer' | 'studio' | 'marketing' | 'other'
      }
    ],
    artistId: '1',
    createdAt: new Date().toISOString()
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1216]">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative h-[400px]">
          <img 
            src={projectData.coverImage}
            alt={projectData.title}
            className="w-full h-full object-cover brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1216] to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center gap-4 mb-4">
                <Badge className="bg-blue-600 text-white">{projectData.status}</Badge>
                <span className="text-gray-400 flex items-center gap-2">
                  <Clock className="h-4 w-4" /> 0 days left
                </span>
              </div>

              <h1 className="text-4xl font-bold text-white mb-4">{projectData.title}</h1>
              
              <div className="flex items-center gap-4">
                <Link to={`/artists/${projectData.artist.toLowerCase()}`} className="flex items-center gap-3">
                  <img 
                    src={projectData.artistImage}
                    alt={projectData.artist}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="text-white font-medium">{projectData.artist}</p>
                    <p className="text-sm text-gray-400">{projectData.genres.join(", ")}</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Funding Progress */}
            <div className="bg-[#151823] rounded-xl p-6 border border-gray-800/50">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-gray-400 mb-1">Raised</p>
                  <p className="text-2xl font-semibold text-white">${projectData.raised.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Goal</p>
                  <p className="text-2xl font-semibold text-white">${projectData.goal.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">ROI</p>
                  <p className="text-2xl font-semibold text-blue-400">{projectData.roi}%</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="w-full bg-gray-800/50 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${projectData.fundedPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{projectData.fundedPercentage}% Funded</span>
                  <span className="text-gray-400">{projectData.daysLeft} days remaining</span>
                </div>
              </div>
            </div>

            {/* Project Overview */}
            <div className="space-y-6">
              <div className="border-b border-gray-800 pb-4">
                <div className="flex gap-4 mb-4">
                  <Button variant="ghost" className="text-white bg-gray-800/50">Overview</Button>
                  <Button variant="ghost" className="text-gray-400">Funding Packages</Button>
                  <Button variant="ghost" className="text-gray-400">Updates</Button>
                  <Button variant="ghost" className="text-gray-400">Investors</Button>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">Project Overview</h2>
                <p className="text-gray-400">{projectData.description}</p>
                <p className="text-gray-400">{projectData.extendedDescription}</p>
                <p className="text-gray-400">{projectData.fundingDetails}</p>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-white">Project Timeline</h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="text-gray-400 w-24">Dec 2023</div>
                    <div className="text-white">Funding Phase</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-gray-400 w-24">Jan 2024</div>
                    <div className="text-white">Production Begins</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-gray-400 w-24">Mar 2024</div>
                    <div className="text-white">Marketing Campaign</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-gray-400 w-24">Apr 2024</div>
                    <div className="text-white">Album Release</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Investment Panel */}
          <div className="space-y-6">
            <div className="bg-[#151823] rounded-xl p-6 border border-gray-800/50">
              <h3 className="text-xl font-semibold text-white mb-4">Invest in this Project</h3>
              <p className="text-gray-400 text-sm mb-6">
                Support this artist and potentially earn returns on their success
              </p>

              <div className="space-y-6">
                <div>
                  <label className="text-gray-400 text-sm block mb-2">Investment Amount</label>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-400">$</span>
                    <input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-2 text-white"
                      min={projectData.minInvestment}
                      max={projectData.maxInvestment}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Min: ${projectData.minInvestment} | Max: ${projectData.maxInvestment}
                  </p>
                </div>

                <div>
                  <label className="text-gray-400 text-sm block mb-2">Potential Return (ROI)</label>
                  <p className="text-xl font-semibold text-blue-400">{projectData.roi}%</p>
                </div>

                <div>
                  <label className="text-gray-400 text-sm block mb-2">Estimated Earnings</label>
                  <p className="text-xl font-semibold text-blue-400">
                    ${calculateEstimatedEarnings(investmentAmount)}
                  </p>
                </div>

                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleInvestClick}
                  disabled={!isAuthenticated}
                >
                  Invest Now
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  By investing, you agree to our terms of service and acknowledge that returns are not guaranteed. Investment involves risk.
                </p>
              </div>
            </div>

            <div className="bg-[#151823] rounded-xl p-6 border border-gray-800/50">
              <h3 className="text-xl font-semibold text-white mb-4">About the Artist</h3>
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={projectData.artistImage}
                  alt={projectData.artist}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <p className="text-white font-medium">{projectData.artist}</p>
                  <p className="text-sm text-gray-400">{projectData.genres.join(", ")}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                View Profile
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* Investment Modal */}
      <InvestmentModal
        isOpen={isInvestmentModalOpen}
        onClose={() => setIsInvestmentModalOpen(false)}
        project={compatibleProject}
        onInvestmentComplete={handleInvestmentComplete}
      />

      <Footer />
    </div>
  );
};

export default ProjectDetail;
