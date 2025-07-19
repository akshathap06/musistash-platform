
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Upload, DollarSign, Calendar, Target, Music, Mic, Album, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { supabaseService } from '@/services/supabaseService';
import { artistProfileService } from '@/services/artistProfileService';

interface FormData {
  title: string;
  description: string;
  detailedDescription: string;
  projectType: 'album' | 'single' | 'ep' | 'mixtape' | '';
  genre: string[];
  fundingGoal: string;
  minInvestment: string;
  maxInvestment: string;
  expectedROI: string;
  projectDuration: string;
  deadline: string;
  bannerImage: File | null;
}

export default function CreateProject() {
  const navigate = useNavigate();
  const { id: projectId } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    detailedDescription: '',
    projectType: '',
    genre: [],
    fundingGoal: '',
    minInvestment: '',
    maxInvestment: '',
    expectedROI: '',
    projectDuration: '',
    deadline: '',
    bannerImage: null,
  });
  const [saveAsDraft, setSaveAsDraft] = useState(false);
  const isEditing = !!projectId;

  // Load existing project data when editing
  useEffect(() => {
    const loadProjectData = async () => {
      if (!projectId) return;
      
      setIsLoading(true);
      try {
        const project = await supabaseService.getProjectById(projectId);
        if (project) {
          setFormData({
            title: project.title || '',
            description: project.description || '',
            detailedDescription: project.detailed_description || '',
            projectType: project.project_type || '',
            genre: project.genre || [],
            fundingGoal: project.funding_goal?.toString() || '',
            minInvestment: project.min_investment?.toString() || '',
            maxInvestment: project.max_investment?.toString() || '',
            expectedROI: project.expected_roi?.toString() || '',
            projectDuration: project.project_duration || '',
            deadline: project.deadline || '',
            bannerImage: null, // We'll handle image separately
          });
          setSaveAsDraft(project.status === 'draft');
        } else {
          toast({
            title: "Project Not Found",
            description: "The project you're trying to edit could not be found.",
            variant: "destructive",
          });
          navigate('/artist-project-dashboard');
        }
      } catch (error) {
        console.error('Error loading project:', error);
        toast({
          title: "Error",
          description: "Failed to load project data. Please try again.",
          variant: "destructive",
        });
        navigate('/artist-project-dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectData();
  }, [projectId, navigate, toast]);

  const genres = [
    'Hip Hop', 'R&B', 'Pop', 'Rock', 'Jazz', 'Electronic', 'Country', 
    'Folk', 'Classical', 'Reggae', 'Blues', 'Alternative', 'Indie'
  ];

  const projectIcons = {
    album: Album,
    single: Music,
    ep: Play,
    mixtape: Mic,
  };

  const handleInputChange = (field: keyof FormData, value: string | string[] | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGenreToggle = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genre: prev.genre.includes(genre)
        ? prev.genre.filter(g => g !== genre)
        : [...prev.genre, genre]
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleInputChange('bannerImage', file);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.title && formData.description && formData.projectType);
      case 2:
        return !!(formData.detailedDescription && formData.genre.length > 0);
      case 3:
        return !!(formData.fundingGoal && formData.minInvestment && formData.maxInvestment && 
                 formData.expectedROI && formData.projectDuration && formData.deadline);
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    } else {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields before continuing.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a project.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('CreateProject: Starting project creation for user:', user.id);
      console.log('CreateProject: Form data:', formData);
      
      // Get the artist profile for the current user
      const artistProfile = await artistProfileService.getProfileByUserId(user.id);
      console.log('CreateProject: Artist profile result:', artistProfile);
      
      if (!artistProfile) {
        console.log('CreateProject: No artist profile found for user:', user.id);
      toast({
          title: "Artist Profile Required",
          description: "You need to create an artist profile before creating projects. Please go to your profile settings to set up your artist profile.",
          variant: "destructive",
        });
        // Navigate to profile page or show a modal to create artist profile
        navigate('/artist-profile');
        return;
      }

      console.log('CreateProject: Creating project with artist_id:', artistProfile.id);
      
      if (isEditing && projectId) {
        // Update existing project
        const updatedProject = await supabaseService.updateProject(projectId, {
          title: formData.title,
          description: formData.description,
          detailed_description: formData.detailedDescription,
          banner_image: formData.bannerImage ? URL.createObjectURL(formData.bannerImage) : '/placeholder.svg',
          project_type: formData.projectType as 'album' | 'single' | 'ep' | 'mixtape',
          genre: formData.genre,
          funding_goal: parseFloat(formData.fundingGoal),
          min_investment: parseFloat(formData.minInvestment),
          max_investment: parseFloat(formData.maxInvestment),
          expected_roi: parseFloat(formData.expectedROI),
          project_duration: formData.projectDuration,
          deadline: formData.deadline,
          status: saveAsDraft ? 'draft' : 'pending' // 'draft' for saving, 'pending' for admin approval
        });
        
        if (updatedProject) {
          toast({
            title: saveAsDraft ? "Project Updated!" : "Project Submitted for Approval!",
            description: saveAsDraft 
              ? `Your ${formData.projectType} project "${formData.title}" has been updated and saved as a draft.`
              : `Your ${formData.projectType} project "${formData.title}" has been updated and submitted for admin approval.`,
          });
          navigate('/artist-project-dashboard');
        } else {
          throw new Error('Failed to update project - no project returned');
        }
      } else {
        // Create new project
        const project = await supabaseService.createProject({
          artist_id: artistProfile.id,
          title: formData.title,
          description: formData.description,
          detailed_description: formData.detailedDescription,
          banner_image: formData.bannerImage ? URL.createObjectURL(formData.bannerImage) : '/placeholder.svg',
          project_type: formData.projectType as 'album' | 'single' | 'ep' | 'mixtape',
          genre: formData.genre,
          funding_goal: parseFloat(formData.fundingGoal),
          min_investment: parseFloat(formData.minInvestment),
          max_investment: parseFloat(formData.maxInvestment),
          expected_roi: parseFloat(formData.expectedROI),
          project_duration: formData.projectDuration,
          deadline: formData.deadline,
          status: saveAsDraft ? 'draft' : 'pending' // 'draft' for saving, 'pending' for admin approval
        });

        if (project) {
          toast({
            title: saveAsDraft ? "Project Saved as Draft!" : "Project Submitted for Approval!",
            description: saveAsDraft 
              ? `Your ${formData.projectType} project "${formData.title}" has been saved as a draft. You can edit it later.`
              : `Your ${formData.projectType} project "${formData.title}" has been submitted and is pending admin approval.`,
          });
          navigate('/artist-project-dashboard');
        } else {
          throw new Error('Failed to create project - no project returned');
        }
      }

      console.log('CreateProject: Project operation completed');
    } catch (error) {
      console.error('CreateProject: Error creating project:', error);
      console.error('CreateProject: Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-white">Project Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter your project title"
                className="mt-2 bg-white/5 border-white/10 text-white placeholder-gray-400"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-white">Short Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of your project"
                className="mt-2 bg-white/5 border-white/10 text-white placeholder-gray-400"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-white">Project Type *</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {(['album', 'single', 'ep', 'mixtape'] as const).map((type) => {
                  const Icon = projectIcons[type];
                  return (
                    <Button
                      key={type}
                      type="button"
                      variant={formData.projectType === type ? "default" : "outline"}
                      className={`h-20 flex flex-col items-center justify-center space-y-2 ${
                        formData.projectType === type 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'border-white/20 text-gray-300 hover:bg-white/10'
                      }`}
                      onClick={() => handleInputChange('projectType', type)}
                    >
                      <Icon className="h-6 w-6" />
                      <span className="capitalize">{type}</span>
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="detailedDescription" className="text-white">Detailed Description *</Label>
              <Textarea
                id="detailedDescription"
                value={formData.detailedDescription}
                onChange={(e) => handleInputChange('detailedDescription', e.target.value)}
                placeholder="Provide detailed information about your project, your vision, and what makes it unique"
                className="mt-2 bg-white/5 border-white/10 text-white placeholder-gray-400"
                rows={6}
              />
            </div>

            <div>
              <Label className="text-white">Genres * (Select all that apply)</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {genres.map((genre) => (
                  <Badge
                    key={genre}
                    variant={formData.genre.includes(genre) ? "default" : "outline"}
                    className={`cursor-pointer ${
                      formData.genre.includes(genre) 
                        ? 'bg-blue-600 hover:bg-blue-700' 
                        : 'border-white/20 text-gray-300 hover:bg-white/10'
                    }`}
                    onClick={() => handleGenreToggle(genre)}
                  >
                    {genre}
                    {formData.genre.includes(genre) && (
                      <X className="ml-1 h-3 w-3" />
                    )}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="bannerImage" className="text-white">Project Banner Image</Label>
              <div className="mt-2 border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-500 transition-colors bg-white/5">
                <input
                  id="bannerImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label htmlFor="bannerImage" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-400">
                    {formData.bannerImage ? formData.bannerImage.name : 'Click to upload banner image'}
                  </p>
                </label>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fundingGoal" className="text-white">Funding Goal ($) *</Label>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="fundingGoal"
                    type="number"
                    value={formData.fundingGoal}
                    onChange={(e) => handleInputChange('fundingGoal', e.target.value)}
                    placeholder="50000"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="expectedROI" className="text-white">Expected ROI (%) *</Label>
                <div className="relative mt-2">
                  <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="expectedROI"
                    type="number"
                    value={formData.expectedROI}
                    onChange={(e) => handleInputChange('expectedROI', e.target.value)}
                    placeholder="15"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minInvestment" className="text-white">Minimum Investment ($) *</Label>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="minInvestment"
                    type="number"
                    value={formData.minInvestment}
                    onChange={(e) => handleInputChange('minInvestment', e.target.value)}
                    placeholder="100"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="maxInvestment" className="text-white">Maximum Investment ($) *</Label>
                <div className="relative mt-2">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="maxInvestment"
                    type="number"
                    value={formData.maxInvestment}
                    onChange={(e) => handleInputChange('maxInvestment', e.target.value)}
                    placeholder="10000"
                    className="pl-10 bg-white/5 border-white/10 text-white placeholder-gray-400"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="projectDuration" className="text-white">Project Duration *</Label>
                <div className="relative mt-2">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Select value={formData.projectDuration} onValueChange={(value) => handleInputChange('projectDuration', value)}>
                    <SelectTrigger className="pl-10 bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-700">
                      <SelectItem value="3-months">3 Months</SelectItem>
                      <SelectItem value="6-months">6 Months</SelectItem>
                      <SelectItem value="9-months">9 Months</SelectItem>
                      <SelectItem value="12-months">12 Months</SelectItem>
                      <SelectItem value="18-months">18 Months</SelectItem>
                      <SelectItem value="24-months">24 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="deadline" className="text-white">Funding Deadline *</Label>
                <div className="relative mt-2">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    className="pl-10 bg-white/5 border-white/10 text-white"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Review Your Project</h3>
              <p className="text-gray-400">Please review all details before submitting for approval</p>
            </div>

            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  {formData.projectType && React.createElement(projectIcons[formData.projectType as keyof typeof projectIcons], { className: "h-5 w-5" })}
                  {formData.title}
                </CardTitle>
                <CardDescription className="text-gray-400">{formData.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-white">Project Details</h4>
                  <p className="text-sm text-gray-400">{formData.detailedDescription}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-white">Genres</h4>
                  <div className="flex flex-wrap gap-1">
                    {formData.genre.map(g => (
                      <Badge key={g} variant="secondary" className="bg-blue-600/20 text-blue-300 border-blue-600/30">{g}</Badge>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="text-gray-300">
                    <span className="font-semibold text-white">Funding Goal:</span> ${parseInt(formData.fundingGoal || '0').toLocaleString()}
                  </div>
                  <div className="text-gray-300">
                    <span className="font-semibold text-white">Expected ROI:</span> {formData.expectedROI}%
                  </div>
                  <div className="text-gray-300">
                    <span className="font-semibold text-white">Investment Range:</span> ${parseInt(formData.minInvestment || '0').toLocaleString()} - ${parseInt(formData.maxInvestment || '0').toLocaleString()}
                  </div>
                  <div className="text-gray-300">
                    <span className="font-semibold text-white">Duration:</span> {formData.projectDuration}
                  </div>
                  <div className="text-gray-300">
                    <span className="font-semibold text-white">Deadline:</span> {new Date(formData.deadline).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Draft Option */}
            <div className="flex items-center space-x-2 p-4 bg-gray-800/30 rounded-lg">
              <input
                type="checkbox"
                id="saveAsDraft"
                checked={saveAsDraft}
                onChange={(e) => setSaveAsDraft(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
              />
              <Label htmlFor="saveAsDraft" className="text-white cursor-pointer">
                Save as draft (you can edit and submit for approval later)
              </Label>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0f1216]">
        <Navbar />
        <main className="flex-grow pt-24">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-center items-center min-h-[60vh]">
              <div className="animate-pulse text-center">
                <div className="text-xl font-semibold mb-2">Loading Project Data</div>
                <div className="text-muted-foreground">Please wait...</div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1216]">
      <Navbar />
      
      <main className="flex-grow pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              {isEditing ? 'Edit' : 'Create'} <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">Project</span>
            </h1>
            <p className="text-xl text-gray-400">
              {isEditing ? 'Update your music project details' : 'Launch your music project and connect with investors'}
            </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
            <div className="flex items-center justify-center">
            {[1, 2, 3, 4].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'border-gray-600 text-gray-400'
                  }`}
                >
                  {step}
                </div>
                {index < 3 && (
                  <div
                      className={`w-16 h-0.5 ${
                        currentStep > step ? 'bg-blue-600' : 'bg-gray-600'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
            <div className="flex justify-between mt-4 text-sm text-gray-400 max-w-md mx-auto">
              <span className={currentStep >= 1 ? 'text-blue-400' : ''}>Basic Info</span>
              <span className={currentStep >= 2 ? 'text-blue-400' : ''}>Details</span>
              <span className={currentStep >= 3 ? 'text-blue-400' : ''}>Funding</span>
              <span className={currentStep >= 4 ? 'text-blue-400' : ''}>Review</span>
          </div>
        </div>

          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
              className="border-white/20 text-gray-300 hover:bg-white/10"
          >
            Previous
          </Button>
          
          {currentStep < 4 ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={!validateStep(currentStep)}
                className="bg-blue-600 hover:bg-blue-700"
            >
              Next
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting || isLoading}
                className="bg-blue-600 hover:bg-blue-700"
            >
                {isSubmitting ? (isEditing ? 'Updating Project...' : 'Creating Project...') : 
                 saveAsDraft ? (isEditing ? 'Update Draft' : 'Save as Draft') : 
                 (isEditing ? 'Update & Submit' : 'Submit for Approval')}
            </Button>
          )}
        </div>
      </div>
      </main>
      
      <Footer />
    </div>
  );
}
