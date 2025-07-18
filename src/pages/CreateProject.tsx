
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Upload, DollarSign, Calendar, Target, Music, Mic, Album, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

interface ArtistProject {
  id: string;
  title: string;
  description: string;
  fundingGoal: number;
  deadline: string;
  projectType: string;
  genre: string[];
}

export default function CreateProject() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  // Mock function to simulate project creation
  const createArtistProject = async (data: FormData): Promise<ArtistProject> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      id: Math.random().toString(36).substr(2, 9),
      title: data.title,
      description: data.description,
      fundingGoal: parseInt(data.fundingGoal),
      deadline: data.deadline,
      projectType: data.projectType as string,
      genre: data.genre,
    };
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

    setIsSubmitting(true);
    try {
      const project = await createArtistProject(formData);
      
      toast({
        title: "Project Created Successfully!",
        description: `Your ${formData.projectType} project "${formData.title}" has been created.`,
      });

      navigate('/artist-dashboard');
    } catch (error) {
      console.error('Error creating project:', error);
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
              <Label htmlFor="title">Project Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter your project title"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Short Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Brief description of your project"
                className="mt-1"
                rows={3}
              />
            </div>

            <div>
              <Label>Project Type *</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {(['album', 'single', 'ep', 'mixtape'] as const).map((type) => {
                  const Icon = projectIcons[type];
                  return (
                    <Button
                      key={type}
                      type="button"
                      variant={formData.projectType === type ? "default" : "outline"}
                      className="h-20 flex flex-col items-center justify-center space-y-2"
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
              <Label htmlFor="detailedDescription">Detailed Description *</Label>
              <Textarea
                id="detailedDescription"
                value={formData.detailedDescription}
                onChange={(e) => handleInputChange('detailedDescription', e.target.value)}
                placeholder="Provide detailed information about your project, your vision, and what makes it unique"
                className="mt-1"
                rows={6}
              />
            </div>

            <div>
              <Label>Genres * (Select all that apply)</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {genres.map((genre) => (
                  <Badge
                    key={genre}
                    variant={formData.genre.includes(genre) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/80"
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
              <Label htmlFor="bannerImage">Project Banner Image</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  id="bannerImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label htmlFor="bannerImage" className="cursor-pointer">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
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
                <Label htmlFor="fundingGoal">Funding Goal ($) *</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="fundingGoal"
                    type="number"
                    value={formData.fundingGoal}
                    onChange={(e) => handleInputChange('fundingGoal', e.target.value)}
                    placeholder="50000"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="expectedROI">Expected ROI (%) *</Label>
                <div className="relative mt-1">
                  <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="expectedROI"
                    type="number"
                    value={formData.expectedROI}
                    onChange={(e) => handleInputChange('expectedROI', e.target.value)}
                    placeholder="15"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minInvestment">Minimum Investment ($) *</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="minInvestment"
                    type="number"
                    value={formData.minInvestment}
                    onChange={(e) => handleInputChange('minInvestment', e.target.value)}
                    placeholder="100"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="maxInvestment">Maximum Investment ($) *</Label>
                <div className="relative mt-1">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="maxInvestment"
                    type="number"
                    value={formData.maxInvestment}
                    onChange={(e) => handleInputChange('maxInvestment', e.target.value)}
                    placeholder="10000"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="projectDuration">Project Duration *</Label>
                <div className="relative mt-1">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Select value={formData.projectDuration} onValueChange={(value) => handleInputChange('projectDuration', value)}>
                    <SelectTrigger className="pl-10">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
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
                <Label htmlFor="deadline">Funding Deadline *</Label>
                <div className="relative mt-1">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    className="pl-10"
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
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Review Your Project</h3>
              <p className="text-gray-600">Please review all details before submitting</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {formData.projectType && React.createElement(projectIcons[formData.projectType as keyof typeof projectIcons], { className: "h-5 w-5" })}
                  {formData.title}
                </CardTitle>
                <CardDescription>{formData.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Project Details</h4>
                  <p className="text-sm text-gray-600">{formData.detailedDescription}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Genres</h4>
                  <div className="flex flex-wrap gap-1">
                    {formData.genre.map(g => (
                      <Badge key={g} variant="secondary">{g}</Badge>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Funding Goal:</span> ${parseInt(formData.fundingGoal || '0').toLocaleString()}
                  </div>
                  <div>
                    <span className="font-semibold">Expected ROI:</span> {formData.expectedROI}%
                  </div>
                  <div>
                    <span className="font-semibold">Investment Range:</span> ${parseInt(formData.minInvestment || '0').toLocaleString()} - ${parseInt(formData.maxInvestment || '0').toLocaleString()}
                  </div>
                  <div>
                    <span className="font-semibold">Duration:</span> {formData.projectDuration}
                  </div>
                  <div>
                    <span className="font-semibold">Deadline:</span> {new Date(formData.deadline).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
          <p className="mt-2 text-gray-600">Launch your music project and connect with investors</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center">
            {[1, 2, 3, 4].map((step, index) => (
              <div key={step} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                    currentStep >= step
                      ? 'bg-primary border-primary text-white'
                      : 'border-gray-300 text-gray-300'
                  }`}
                >
                  {step}
                </div>
                {index < 3 && (
                  <div
                    className={`w-12 h-0.5 ${
                      currentStep > step ? 'bg-primary' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Basic Info</span>
            <span>Details</span>
            <span>Funding</span>
            <span>Review</span>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          {currentStep < 4 ? (
            <Button
              type="button"
              onClick={nextStep}
              disabled={!validateStep(currentStep)}
            >
              Next
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Project...' : 'Create Project'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
