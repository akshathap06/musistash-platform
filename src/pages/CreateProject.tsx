
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

// Update all usages of project_type to include 'live_show'
type ProjectType = 'album' | 'single' | 'ep' | 'mixtape' | 'live_show';

interface FormData {
  title: string;
  description: string;
  detailedDescription: string;
  projectType: ProjectType | '';
  genre: string[];
  numberOfSongs?: string;
  totalDuration?: string;
  youtubeLinks: string[];
  spotifyLink: string;
  mp3Files: File[];
  ticketSaleLink?: string;
  showDate?: string;
  showLocation?: string;
  bannerImage: File | null;
}

// 1. Add a type for loaded project data that includes new fields
interface LoadedProject {
  id: string;
  artist_id: string;
  title: string;
  description: string;
  detailed_description: string;
  banner_image: string;
  project_type: ProjectType;
  genre: string[];
  number_of_songs?: number;
  total_duration?: number;
  youtube_links?: string[];
  spotify_link?: string;
  mp3_files?: string[];
  ticket_sale_link?: string;
  show_date?: string;
  show_location?: string;
  status: string;
  [key: string]: any;
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
    numberOfSongs: '',
    totalDuration: '',
    youtubeLinks: [''],
    spotifyLink: '',
    mp3Files: [],
    ticketSaleLink: '',
    showDate: '',
    showLocation: '',
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
        const project = await supabaseService.getProjectById(projectId) as LoadedProject;
        if (project) {
          setFormData({
            title: project.title || '',
            description: project.description || '',
            detailedDescription: project.detailed_description || '',
            projectType: project.project_type || '',
            genre: project.genre || [],
            numberOfSongs: project.number_of_songs?.toString() || '',
            totalDuration: project.total_duration?.toString() || '',
            youtubeLinks: Array.isArray(project.youtube_links) ? project.youtube_links : [''],
            spotifyLink: project.spotify_link || '',
            mp3Files: [], // We'll handle uploads separately
            ticketSaleLink: project.ticket_sale_link || '',
            showDate: project.show_date || '',
            showLocation: project.show_location || '',
            bannerImage: null,
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

  // Update projectIcons to Record<string, any> to fix linter error
  const projectIcons: Record<string, any> = {
    album: Album,
    single: Music,
    ep: Play,
    mixtape: Mic,
    live_show: Mic,
  };

  const handleInputChange = (field: keyof FormData, value: string | string[] | File | File[] | null) => {
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

  // 4. Fix File[] assignment for mp3Files
  const handleMp3FilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    handleInputChange('mp3Files', files);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.title && formData.description && formData.projectType);
      case 2:
        return !!(formData.detailedDescription && formData.genre.length > 0);
      case 3:
        return !!(formData.projectType !== 'live_show' ? (formData.numberOfSongs && formData.totalDuration) : (formData.ticketSaleLink && formData.showDate && formData.showLocation));
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
        const updatePayload: any = {
          title: formData.title,
          description: formData.description,
          detailed_description: formData.detailedDescription,
          project_type: formData.projectType as ProjectType,
          genre: formData.genre,
          youtube_links: formData.youtubeLinks.length > 0 ? formData.youtubeLinks : null,
          spotify_link: formData.spotifyLink || null,
          mp3_files: formData.mp3Files.length > 0 ? formData.mp3Files.map(file => file.name) : null,
          status: 'draft' // Temporarily use 'draft' for both until database migration is applied
        };

        // Add project type specific fields
        if (formData.projectType !== 'live_show') {
          updatePayload.number_of_songs = formData.numberOfSongs ? parseInt(formData.numberOfSongs) : null;
          updatePayload.total_duration = formData.totalDuration ? parseInt(formData.totalDuration) : null;
        } else {
          updatePayload.ticket_sale_link = formData.ticketSaleLink || null;
          updatePayload.show_date = formData.showDate || null;
          updatePayload.show_location = formData.showLocation || null;
        }

        const updatedProject = await supabaseService.updateProject(projectId, updatePayload);
        
        if (updatedProject) {
          // Upload banner image if provided
          if (formData.bannerImage) {
            try {
              console.log('CreateProject: Uploading banner image for update...');
              const imageUrl = await supabaseService.uploadProjectImage(formData.bannerImage, projectId);
              if (imageUrl) {
                console.log('CreateProject: Image uploaded successfully:', imageUrl);
                // Update the project with the new image URL
                await supabaseService.updateProject(projectId, { banner_image: imageUrl });
              }
            } catch (imageError) {
              console.error('CreateProject: Error uploading image:', imageError);
              // Don't fail the project update if image upload fails
            }
          }

          toast({
            title: "Project Updated!",
            description: `Your ${formData.projectType} project "${formData.title}" has been updated and saved as a draft.`,
          });
          navigate('/artist-project-dashboard');
        } else {
          throw new Error('Failed to update project - no project returned');
        }
      } else {
        // Create new project
        const projectPayload: any = {
          artist_id: artistProfile.id,
          title: formData.title,
          description: formData.description,
          detailed_description: formData.detailedDescription,
          banner_image: '/placeholder.svg', // We'll update this after project creation if there's an image
          project_type: formData.projectType,
          genre: formData.genre,
          youtube_links: formData.youtubeLinks.length > 0 ? formData.youtubeLinks : null,
          spotify_link: formData.spotifyLink || null,
          // For now, we'll store MP3 file names as strings - actual file upload would need separate handling
          mp3_files: formData.mp3Files.length > 0 ? formData.mp3Files.map(file => file.name) : null,
        };
        
        // Add project type specific fields
        if (formData.projectType !== 'live_show') {
          projectPayload.number_of_songs = formData.numberOfSongs ? parseInt(formData.numberOfSongs) : null;
          projectPayload.total_duration = formData.totalDuration ? parseInt(formData.totalDuration) : null;
        } else {
          projectPayload.ticket_sale_link = formData.ticketSaleLink || null;
          projectPayload.show_date = formData.showDate || null;
          projectPayload.show_location = formData.showLocation || null;
        }
        
        // Add legacy fields with default values for backward compatibility
        projectPayload.funding_goal = 0;
        projectPayload.min_investment = 0;
        projectPayload.max_investment = 0;
        projectPayload.expected_roi = 0;
        projectPayload.project_duration = 'TBD';
        projectPayload.deadline = '2025-12-31';

        const project = await supabaseService.createProject(projectPayload);

        if (project) {
          // Upload banner image if provided
          if (formData.bannerImage) {
            try {
              console.log('CreateProject: Uploading banner image...');
              const imageUrl = await supabaseService.uploadProjectImage(formData.bannerImage, project.id);
              if (imageUrl) {
                console.log('CreateProject: Image uploaded successfully:', imageUrl);
                // Update the project with the new image URL
                await supabaseService.updateProject(project.id, { banner_image: imageUrl });
              }
            } catch (imageError) {
              console.error('CreateProject: Error uploading image:', imageError);
              // Don't fail the project creation if image upload fails
            }
          }

          toast({
            title: "Project Saved as Draft!",
            description: `Your ${formData.projectType} project "${formData.title}" has been saved as a draft. You can edit it later.`,
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
                {(['album', 'single', 'ep', 'mixtape', 'live_show'] as const).map((type) => {
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
                      <span className="capitalize">{type === 'live_show' ? 'Live Show' : type}</span>
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
            {formData.projectType !== 'live_show' && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="numberOfSongs" className="text-white">Number of Songs *</Label>
                  <Input
                    id="numberOfSongs"
                    type="number"
                    value={formData.numberOfSongs}
                    onChange={(e) => handleInputChange('numberOfSongs', e.target.value)}
                    placeholder="10"
                    className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <Label htmlFor="totalDuration" className="text-white">Total Duration (min) *</Label>
                  <Input
                    id="totalDuration"
                    type="text"
                    value={formData.totalDuration}
                    onChange={(e) => handleInputChange('totalDuration', e.target.value)}
                    placeholder="45"
                    className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                  />
                </div>
              </div>
            )}
            {formData.projectType === 'live_show' && (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="ticketSaleLink" className="text-white">Ticket Sale Link *</Label>
                  <Input
                    id="ticketSaleLink"
                    type="text"
                    value={formData.ticketSaleLink}
                    onChange={(e) => handleInputChange('ticketSaleLink', e.target.value)}
                    placeholder="https://tickets.example.com"
                    className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                  />
                </div>
                <div>
                  <Label htmlFor="showDate" className="text-white">Show Date *</Label>
                  <Input
                    id="showDate"
                    type="date"
                    value={formData.showDate}
                    onChange={(e) => handleInputChange('showDate', e.target.value)}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="showLocation" className="text-white">Show Location *</Label>
                  <Input
                    id="showLocation"
                    type="text"
                    value={formData.showLocation}
                    onChange={(e) => handleInputChange('showLocation', e.target.value)}
                    placeholder="Venue, City, Country"
                    className="bg-white/5 border-white/10 text-white placeholder-gray-400"
                  />
                </div>
              </div>
            )}
            <div>
              <Label className="text-white">YouTube Links *</Label>
              {formData.youtubeLinks.map((link, idx) => (
                <div key={idx} className="flex items-center gap-2 mt-2">
                  <Input
                    type="text"
                    value={link}
                    onChange={(e) => {
                      const newLinks = [...formData.youtubeLinks];
                      newLinks[idx] = e.target.value;
                      handleInputChange('youtubeLinks', newLinks);
                    }}
                    placeholder="https://youtube.com/..."
                    className="bg-white/5 border-white/10 text-white placeholder-gray-400 flex-1"
                  />
                  <Button type="button" variant="outline" onClick={() => handleInputChange('youtubeLinks', formData.youtubeLinks.filter((_, i) => i !== idx))} className="border-white/20 text-gray-300 hover:bg-white/10">Remove</Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={() => handleInputChange('youtubeLinks', [...formData.youtubeLinks, ''])} className="mt-2 border-white/20 text-gray-300 hover:bg-white/10">Add Link</Button>
            </div>
            <div>
              <Label htmlFor="spotifyLink" className="text-white">Spotify Link *</Label>
              <Input
                id="spotifyLink"
                type="text"
                value={formData.spotifyLink}
                onChange={(e) => handleInputChange('spotifyLink', e.target.value)}
                placeholder="https://open.spotify.com/album/..."
                className="bg-white/5 border-white/10 text-white placeholder-gray-400"
              />
            </div>
            <div>
              <Label htmlFor="mp3Files" className="text-white">Upload MP3 Files *</Label>
              <Input
                id="mp3Files"
                type="file"
                accept="audio/mp3"
                multiple
                onChange={handleMp3FilesChange}
                className="bg-white/5 border-white/10 text-white"
              />
              {formData.mp3Files.length > 0 && (
                <ul className="mt-2 text-gray-400 text-sm">
                  {formData.mp3Files.map((file, idx) => (
                    <li key={idx}>{file.name}</li>
                  ))}
                </ul>
              )}
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
                  {formData.projectType && projectIcons[formData.projectType as string] &&
                    React.createElement(projectIcons[formData.projectType as string], { className: "h-5 w-5" })}
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
                    <span className="font-semibold text-white">Project Type:</span> {formData.projectType === 'live_show' ? 'Live Show' : formData.projectType}
                  </div>
                  <div className="text-gray-300">
                    <span className="font-semibold text-white">Duration:</span> {formData.projectType === 'live_show' ? 'N/A' : `${formData.numberOfSongs || '0'} songs, ${formData.totalDuration || '0'} min`}
                  </div>
                  <div className="text-gray-300">
                    <span className="font-semibold text-white">Show Date:</span> {formData.projectType === 'live_show' ? new Date(formData.showDate || '').toLocaleDateString() : 'N/A'}
                  </div>
                  <div className="text-gray-300">
                    <span className="font-semibold text-white">Location:</span> {formData.projectType === 'live_show' ? formData.showLocation || 'N/A' : 'N/A'}
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
                 (isEditing ? 'Update Draft' : 'Save as Draft')}
            </Button>
          )}
        </div>
      </div>
      </main>
      
      <Footer />
    </div>
  );
}
