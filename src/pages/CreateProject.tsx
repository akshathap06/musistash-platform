import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { artistProfileService, ArtistProject, FundingBreakdown, InvestmentReward } from '@/services/artistProfileService';
import { 
  Save, 
  Upload, 
  Camera, 
  DollarSign, 
  Target, 
  FileText, 
  Plus, 
  AlertCircle, 
  CheckCircle,
  Music,
  TrendingUp
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const projectTypes = [
  { value: 'album', label: 'Album', description: 'Full-length studio album' },
  { value: 'ep', label: 'EP', description: 'Extended play recording' },
  { value: 'single', label: 'Single', description: 'Single song release' },
  { value: 'tour', label: 'Tour', description: 'Concert tour or live performances' },
  { value: 'merchandise', label: 'Merchandise', description: 'Artist merchandise production' },
  { value: 'other', label: 'Other', description: 'Other music-related project' },
];

const musicGenres = [
  'Pop', 'Rock', 'Hip-Hop', 'R&B', 'Country', 'Electronic', 'Jazz', 'Classical',
  'Folk', 'Blues', 'Reggae', 'Alternative', 'Indie', 'Metal', 'Punk', 'Funk',
  'Soul', 'Gospel', 'Latin', 'World', 'Experimental', 'Ambient', 'Other'
];

const CreateProject = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [currentTab, setCurrentTab] = useState('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [artistProfile, setArtistProfile] = useState(null);

  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    detailedDescription: '',
    bannerImage: '/placeholder.svg',
    projectType: 'album' as ArtistProject['projectType'],
    genre: [] as string[],
    fundingGoal: 10000,
    minInvestment: 50,
    maxInvestment: 5000,
    expectedROI: 7.5,
    projectDuration: '6 months',
    deadline: '',
  });

  const [contractData, setContractData] = useState({
    roiPercentage: 7.5,
    paymentSchedule: 'quarterly' as 'monthly' | 'quarterly' | 'annually' | 'on_completion',
    contractDuration: '2 years',
    earlyTermination: true,
    artistTerms: '',
    customTerms: '',
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      const profile = artistProfileService.getProfileByUserId(user.id);
      if (!profile) {
        navigate('/artist-profile');
        return;
      }
      setArtistProfile(profile);
      
      // Set default deadline to 3 months from now
      const defaultDeadline = new Date();
      defaultDeadline.setMonth(defaultDeadline.getMonth() + 3);
      setProjectData(prev => ({
        ...prev,
        deadline: defaultDeadline.toISOString().split('T')[0],
      }));
    }
  }, [user, isLoading, isAuthenticated, navigate]);

  const handleProjectDataChange = (field: string, value: any) => {
    setProjectData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleContractDataChange = (field: string, value: any) => {
    setContractData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Sync ROI with project data
    if (field === 'roiPercentage') {
      setProjectData(prev => ({
        ...prev,
        expectedROI: value,
      }));
    }
  };

  const handleGenreToggle = (genre: string) => {
    setProjectData(prev => ({
      ...prev,
      genre: prev.genre.includes(genre)
        ? prev.genre.filter(g => g !== genre)
        : [...prev.genre, genre].slice(0, 3), // Max 3 genres
    }));
  };

  const handleImageUpload = () => {
    // In a real app, this would handle file upload
    const mockImageUrl = `https://images.unsplash.com/photo-${Date.now()}?auto=format&fit=crop&w=1200&h=600`;
    handleProjectDataChange('bannerImage', mockImageUrl);
  };

  const handleSaveDraft = async () => {
    if (!artistProfile) return;

    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const fundingBreakdown = artistProfileService.generateFundingBreakdown(projectData.fundingGoal);
      const rewards = artistProfileService.generateBasicRewards(projectData.projectType);

      const newProject = artistProfileService.createProject(artistProfile.id, {
        ...projectData,
        fundingBreakdown,
        rewards,
      });

      // Update contract terms
      if (newProject.contractTerms) {
        artistProfileService.updateContract(newProject.contractTerms.id, {
          terms: {
            ...newProject.contractTerms.terms,
            roiPercentage: contractData.roiPercentage,
            paymentSchedule: contractData.paymentSchedule,
            contractDuration: contractData.contractDuration,
            earlyTermination: contractData.earlyTermination,
          },
          artistTerms: contractData.artistTerms,
          customTerms: contractData.customTerms,
        });
      }

      setSaveStatus('success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error saving project:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!artistProfile) return;

    setIsSaving(true);
    setSaveStatus('idle');

    try {
      const fundingBreakdown = artistProfileService.generateFundingBreakdown(projectData.fundingGoal);
      const rewards = artistProfileService.generateBasicRewards(projectData.projectType);

      const newProject = artistProfileService.createProject(artistProfile.id, {
        ...projectData,
        fundingBreakdown,
        rewards,
        status: 'active',
      });

      // Update contract terms
      if (newProject.contractTerms) {
        artistProfileService.updateContract(newProject.contractTerms.id, {
          terms: {
            ...newProject.contractTerms.terms,
            roiPercentage: contractData.roiPercentage,
            paymentSchedule: contractData.paymentSchedule,
            contractDuration: contractData.contractDuration,
            earlyTermination: contractData.earlyTermination,
          },
          artistTerms: contractData.artistTerms,
          customTerms: contractData.customTerms,
        });
      }

      setSaveStatus('success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error publishing project:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !user || !artistProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="animate-pulse text-center">
          <div className="text-xl font-semibold mb-2 text-white">Loading Project Creator</div>
          <div className="text-gray-300">Please wait...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navbar />
      
      <div className="flex-1 pt-20">
        <div className="container max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Create New Project</h1>
            <p className="text-gray-300">Launch your next musical project and connect with investors</p>
          </div>

          {/* Status Messages */}
          {saveStatus === 'success' && (
            <Alert className="mb-6 bg-green-500/20 border-green-500/50 text-green-300">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Project saved successfully! Redirecting to dashboard...
              </AlertDescription>
            </Alert>
          )}

          {saveStatus === 'error' && (
            <Alert className="mb-6 bg-red-500/20 border-red-500/50 text-red-300">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to save project. Please try again.
              </AlertDescription>
            </Alert>
          )}

          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="basic">Project Details</TabsTrigger>
              <TabsTrigger value="funding">Funding & ROI</TabsTrigger>
              <TabsTrigger value="contract">Contract & Publish</TabsTrigger>
            </TabsList>

            {/* Basic Project Details */}
            <TabsContent value="basic" className="space-y-6">
              {/* Banner Image */}
              <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm overflow-hidden">
                <div className="relative h-48 md:h-64">
                  <img
                    src={projectData.bannerImage}
                    alt="Project Banner"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleImageUpload}
                      className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Upload Banner Image
                    </Button>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Project Information */}
                <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Project Information</CardTitle>
                    <CardDescription className="text-gray-400">
                      Basic details about your project
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-gray-300">Project Title</Label>
                      <Input
                        id="title"
                        value={projectData.title}
                        onChange={(e) => handleProjectDataChange('title', e.target.value)}
                        placeholder="e.g., 'Midnight Dreams - Debut Album'"
                        className="bg-gray-700/50 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projectType" className="text-gray-300">Project Type</Label>
                      <Select
                        value={projectData.projectType}
                        onValueChange={(value) => handleProjectDataChange('projectType', value)}
                      >
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {projectTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div>
                                <div className="font-medium">{type.label}</div>
                                <div className="text-sm text-gray-400">{type.description}</div>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-gray-300">Short Description</Label>
                      <Textarea
                        id="description"
                        value={projectData.description}
                        onChange={(e) => handleProjectDataChange('description', e.target.value)}
                        placeholder="A brief description of your project (max 200 characters)"
                        className="bg-gray-700/50 border-gray-600 text-white"
                        maxLength={200}
                      />
                      <p className="text-xs text-gray-400">
                        {projectData.description.length}/200 characters
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="detailedDescription" className="text-gray-300">Detailed Description</Label>
                      <Textarea
                        id="detailedDescription"
                        value={projectData.detailedDescription}
                        onChange={(e) => handleProjectDataChange('detailedDescription', e.target.value)}
                        placeholder="Provide a comprehensive description of your project, goals, and vision..."
                        className="bg-gray-700/50 border-gray-600 text-white min-h-[120px]"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Project Timeline */}
                <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Timeline & Genre</CardTitle>
                    <CardDescription className="text-gray-400">
                      Project timeline and musical genres
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="projectDuration" className="text-gray-300">Project Duration</Label>
                      <Input
                        id="projectDuration"
                        value={projectData.projectDuration}
                        onChange={(e) => handleProjectDataChange('projectDuration', e.target.value)}
                        placeholder="e.g., '6 months', '1 year'"
                        className="bg-gray-700/50 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deadline" className="text-gray-300">Funding Deadline</Label>
                      <Input
                        id="deadline"
                        type="date"
                        value={projectData.deadline}
                        onChange={(e) => handleProjectDataChange('deadline', e.target.value)}
                        className="bg-gray-700/50 border-gray-600 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-300">Music Genres (max 3)</Label>
                      <div className="flex flex-wrap gap-2">
                        {musicGenres.map((genre) => (
                          <Badge
                            key={genre}
                            variant={projectData.genre.includes(genre) ? "default" : "outline"}
                            className={`cursor-pointer transition-all ${
                              projectData.genre.includes(genre)
                                ? 'bg-blue-600 text-white border-blue-500'
                                : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                            }`}
                            onClick={() => handleGenreToggle(genre)}
                          >
                            {genre}
                          </Badge>
                        ))}
                      </div>
                      {projectData.genre.length >= 3 && (
                        <p className="text-xs text-yellow-400">
                          Maximum 3 genres selected. Remove one to add another.
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Funding & ROI */}
            <TabsContent value="funding" className="space-y-6">
              <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Target className="mr-2 h-5 w-5" />
                    Funding Goals
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Set your funding targets and investment limits
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fundingGoal" className="text-gray-300">Funding Goal</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="fundingGoal"
                          type="number"
                          value={projectData.fundingGoal}
                          onChange={(e) => handleProjectDataChange('fundingGoal', parseInt(e.target.value) || 0)}
                          className="bg-gray-700/50 border-gray-600 text-white pl-10"
                          min="1000"
                          step="1000"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="minInvestment" className="text-gray-300">Min Investment</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="minInvestment"
                          type="number"
                          value={projectData.minInvestment}
                          onChange={(e) => handleProjectDataChange('minInvestment', parseInt(e.target.value) || 0)}
                          className="bg-gray-700/50 border-gray-600 text-white pl-10"
                          min="50"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxInvestment" className="text-gray-300">Max Investment</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="maxInvestment"
                          type="number"
                          value={projectData.maxInvestment}
                          onChange={(e) => handleProjectDataChange('maxInvestment', parseInt(e.target.value) || 0)}
                          className="bg-gray-700/50 border-gray-600 text-white pl-10"
                          min="100"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-300">Expected ROI: {projectData.expectedROI}%</Label>
                    <Slider
                      value={[projectData.expectedROI]}
                      onValueChange={(value) => {
                        handleProjectDataChange('expectedROI', value[0]);
                        handleContractDataChange('roiPercentage', value[0]);
                      }}
                      max={25}
                      min={1}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>1%</span>
                      <span>25%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Contract & Publish */}
            <TabsContent value="contract" className="space-y-6">
              <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <FileText className="mr-2 h-5 w-5" />
                    Contract Terms
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Define the terms and conditions for your project
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="artistTerms" className="text-gray-300">Your Terms & Conditions</Label>
                    <Textarea
                      id="artistTerms"
                      value={contractData.artistTerms}
                      onChange={(e) => handleContractDataChange('artistTerms', e.target.value)}
                      placeholder="Add any specific terms, conditions, or requirements you want included in the contract..."
                      className="bg-gray-700/50 border-gray-600 text-white min-h-[120px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customTerms" className="text-gray-300">Additional Clauses</Label>
                    <Textarea
                      id="customTerms"
                      value={contractData.customTerms}
                      onChange={(e) => handleContractDataChange('customTerms', e.target.value)}
                      placeholder="Any additional custom clauses or special arrangements..."
                      className="bg-gray-700/50 border-gray-600 text-white min-h-[100px]"
                    />
                  </div>

                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                      <div className="text-sm text-yellow-200">
                        <p className="font-medium mb-2">Important Legal Notice:</p>
                        <ul className="space-y-1 list-disc list-inside">
                          <li>All investments carry risk and returns are not guaranteed</li>
                          <li>This platform facilitates connections between artists and investors</li>
                          <li>Both parties should consult legal counsel before finalizing agreements</li>
                          <li>The artist retains all intellectual property rights unless otherwise specified</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-4">
                    <Button
                      onClick={handleSaveDraft}
                      disabled={isSaving}
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:bg-gray-700"
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {isSaving ? 'Saving...' : 'Save as Draft'}
                    </Button>
                    <Button
                      onClick={handlePublish}
                      disabled={isSaving || !projectData.title || !projectData.description}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      {isSaving ? 'Publishing...' : 'Publish Project'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default CreateProject; 