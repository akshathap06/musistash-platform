
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Save, Eye, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { artistProfileService } from '@/services/artistProfileService';
import { useToast } from '@/hooks/use-toast';

interface ArtistProfile {
  name: string;
  bio: string;
  genre: string[];
  location: string;
  profileImage: string;
  bannerImage: string;
  careerHighlights: Array<{
    year: string;
    title: string;
    description: string;
  }>;
  musicalStyle: string;
  influences: string;
  socialLinks: {
    spotify?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    website?: string;
  };
}

const ArtistProfileManager = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<ArtistProfile>({
    name: '',
    bio: '',
    genre: [],
    location: '',
    profileImage: '',
    bannerImage: '',
    careerHighlights: [],
    musicalStyle: '',
    influences: '',
    socialLinks: {}
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [existingProfile, setExistingProfile] = useState<any | null>(null); // Changed type to any as ServiceArtistProfile is removed
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Validation function
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!profile.name.trim()) {
      errors.name = 'Artist name is required';
    }
    
    if (!profile.genre.length) {
      errors.genre = 'Genre is required';
    }
    
    if (!profile.location.trim()) {
      errors.location = 'Location is required';
    }
    
    if (!profile.bio.trim()) {
      errors.bio = 'Biography is required';
    } else if (profile.bio.trim().length < 50) {
      errors.bio = 'Biography must be at least 50 characters long';
    }
    
    if (!profile.musicalStyle.trim()) {
      errors.musicalStyle = 'Musical style is required';
    }
    
    if (!profile.influences.trim()) {
      errors.influences = 'Musical influences are required';
    }
    
    if (!imagePreview) {
      errors.profileImage = 'Profile image is required';
    }
    
    if (!bannerPreview) {
      errors.bannerImage = 'Banner image is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Check if form is complete
  const isFormComplete = () => {
    return profile.name.trim() && 
           profile.genre.length > 0 && 
           profile.location.trim() && 
           profile.bio.trim().length >= 50 && 
           profile.musicalStyle.trim() &&
           profile.influences.trim() &&
           (imagePreview || profile.profileImage) &&
           (bannerPreview || profile.bannerImage);
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    // Load existing profile if user has one
    if (user) {
      const loadExistingProfile = async () => {
        try {
          const existing = await artistProfileService.getProfileByUserId(user.id);
          if (existing) {
            setExistingProfile(existing);
            setProfile({
              name: existing.artist_name,
              bio: existing.bio,
              genre: Array.isArray(existing.genre) ? existing.genre : [],
              location: existing.location,
              profileImage: existing.profile_photo,
              bannerImage: existing.banner_photo,
              careerHighlights: (existing as any).career_highlights || [],
              musicalStyle: (existing as any).musical_style || '',
              influences: (existing as any).influences || '',
              socialLinks: existing.social_links
            });
            setImagePreview(existing.profile_photo);
            setBannerPreview(existing.banner_photo);
          }
        } catch (error) {
          console.error('Error loading existing profile:', error);
        }
      };
      
      loadExistingProfile();
    }
  }, [user, isAuthenticated, isLoading, navigate]);

  const handleInputChange = (field: keyof Omit<ArtistProfile, 'socialLinks'>, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleGenreChange = (value: string) => {
    // Convert comma-separated string to array
    const genres = value.split(',').map(g => g.trim()).filter(g => g);
    setProfile(prev => ({
      ...prev,
      genre: genres
    }));
  };

  const handleSocialLinkChange = (platform: keyof ArtistProfile['socialLinks'], value: string) => {
    setProfile(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        console.log('Image loaded, size:', result.length, 'characters');
        setImagePreview(result);
        setProfile(prev => ({
          ...prev,
          profileImage: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        console.log('Banner image loaded, size:', result.length, 'characters');
        setBannerPreview(result);
        setProfile(prev => ({
          ...prev,
          bannerImage: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to save a profile",
        variant: "destructive"
      });
      return;
    }

    // Validate form before saving
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      console.log('Saving profile data:', profile);
      console.log('User data:', user);
      
      const profileData = {
        artist_name: profile.name,
        email: user.email,
        bio: profile.bio,
        genre: profile.genre,
        location: profile.location,
        profile_photo: profile.profileImage || imagePreview || '/placeholder.svg',
        banner_photo: profile.bannerImage || bannerPreview || '/placeholder.svg',
        career_highlights: profile.careerHighlights,
        musical_style: profile.musicalStyle,
        influences: profile.influences,
        social_links: profile.socialLinks
      };
      console.log('Processed profile data:', profileData);
      console.log('Existing profile:', existingProfile);

      let savedProfile: any;
      
      if (existingProfile) {
        console.log('Updating existing profile with ID:', existingProfile.id);
        const updated = await artistProfileService.updateProfile(existingProfile.id, profileData);
        console.log('Update result:', updated);
        if (!updated) {
          throw new Error('Failed to update profile');
        }
        savedProfile = updated;
      } else {
        console.log('Creating new profile for user ID:', user.id);
        savedProfile = await artistProfileService.createProfile(user.id, profileData);
        console.log('Create result:', savedProfile);
      }

      if (savedProfile) {
        console.log('Profile saved successfully:', savedProfile);
        setExistingProfile(savedProfile);
        
        toast({
          title: "Success",
          description: "Artist profile saved successfully!",
        });

        // Navigate to the view profile page
        navigate('/view-artist-profile');
      } else {
        console.error('Profile save returned null - this indicates a failure in the service layer');
        throw new Error('Profile save returned null - check console for details');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    if (!profile.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please fill in the artist name to preview",
        variant: "destructive"
      });
      return;
    }

    // For preview, we'll save a temporary profile and navigate to it
    if (user) {
      try {
        const tempProfileData = {
          artist_name: profile.name,
          email: user.email,
          bio: profile.bio,
          genre: profile.genre,
          location: profile.location,
          profile_photo: profile.profileImage || '/placeholder.svg',
          banner_photo: profile.bannerImage || '/placeholder.svg',
          career_highlights: profile.careerHighlights,
          musical_style: profile.musicalStyle,
          influences: profile.influences,
          social_links: profile.socialLinks
        };

        let previewProfile: any; // Changed type to any as ServiceArtistProfile is removed
        
        if (existingProfile) {
          const updated = artistProfileService.updateProfile(existingProfile.id, tempProfileData);
          if (!updated) {
            throw new Error('Failed to update profile for preview');
          }
          previewProfile = updated;
        } else {
          previewProfile = artistProfileService.createProfile(user.id, tempProfileData);
        }

        navigate(`/artist/${previewProfile.id}`);
      } catch (error) {
        console.error('Error creating preview:', error);
        toast({
          title: "Error",
          description: "Failed to create preview. Please try again.",
          variant: "destructive"
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Upload className="w-8 h-8 text-white animate-bounce" />
          </div>
          <div className="text-xl font-semibold mb-2 text-white">Loading Profile Manager</div>
          <div className="text-gray-300">Please wait...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-1 pt-20">
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Artist Profile Manager</h1>
              <p className="text-muted-foreground">Create and manage your artist profile</p>
            </div>

            {/* Status Card - Only show if profile exists */}
            {existingProfile && (
              <Card className="mb-8 bg-gray-800/50 border-gray-700/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Profile Status</CardTitle>
                    {existingProfile.status === 'pending' && (
                      <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
                        <Clock className="w-3 h-3 mr-1" />
                        Waiting for Approval
                      </Badge>
                    )}
                    {existingProfile.status === 'approved' && (
                      <Badge variant="default" className="bg-green-500/20 text-green-300 border-green-500/50">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Approved
                      </Badge>
                    )}
                    {existingProfile.status === 'rejected' && (
                      <Badge variant="destructive" className="bg-red-500/20 text-red-300 border-red-500/50">
                        <XCircle className="w-3 h-3 mr-1" />
                        Rejected
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                    <p className="text-gray-300">
                      {existingProfile.status === 'pending' && "Your artist profile is currently under review. Our team will review your submission and get back to you soon."}
                      {existingProfile.status === 'approved' && "Congratulations! Your artist profile has been approved and is now visible to the public."}
                      {existingProfile.status === 'rejected' && "Your artist profile was not approved. You can edit your profile and submit it again for review."}
                    </p>
                  </div>
                  {existingProfile.status === 'approved' && existingProfile.approvedAt && (
                    <div className="mt-4 text-sm text-gray-400">
                      Approved on: {new Date(existingProfile.approvedAt).toLocaleDateString()}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Your essential artist details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name" className={`${validationErrors.name ? 'text-red-500' : ''}`}>
                      Artist Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your artist name"
                    />
                    {validationErrors.name && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="genre" className={`${validationErrors.genre ? 'text-red-500' : ''}`}>
                      Genre <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="genre"
                      value={profile.genre.join(', ')}
                      onChange={(e) => handleGenreChange(e.target.value)}
                      placeholder="e.g., Hip-Hop, Pop, Rock"
                    />
                    {validationErrors.genre && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.genre}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="location" className={`${validationErrors.location ? 'text-red-500' : ''}`}>
                      Location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City, Country"
                    />
                    {validationErrors.location && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.location}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="bio" className={`${validationErrors.bio ? 'text-red-500' : ''}`}>
                      Biography <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell your story..."
                      rows={4}
                    />
                    {validationErrors.bio && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.bio}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Profile Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Image</CardTitle>
                  <CardDescription>Upload your artist photo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      {imagePreview ? (
                        <div className="space-y-4">
                          <img
                            src={imagePreview}
                            alt="Profile preview"
                            className="w-32 h-32 object-cover rounded-full mx-auto"
                          />
                          <p className="text-sm text-muted-foreground">Image uploaded successfully</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                          <p className="text-muted-foreground">
                            Click to upload your profile image <span className="text-red-500">*</span>
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                    />
                    {validationErrors.profileImage && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.profileImage}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Banner Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Banner Image</CardTitle>
                  <CardDescription>Upload your artist banner photo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                      {bannerPreview ? (
                        <div className="space-y-4">
                          <img
                            src={bannerPreview}
                            alt="Banner preview"
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <p className="text-sm text-muted-foreground">Banner image uploaded successfully</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                          <p className="text-muted-foreground">
                            Click to upload your banner image <span className="text-red-500">*</span>
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerUpload}
                      className="cursor-pointer"
                    />
                    {validationErrors.bannerImage && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.bannerImage}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Career Highlights */}
              <Card>
                <CardHeader>
                  <CardTitle>Career Highlights</CardTitle>
                  <CardDescription>Your major achievements and milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {profile.careerHighlights.map((highlight, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        <Input
                          type="text"
                          value={highlight.year}
                          onChange={(e) => {
                            const newHighlights = [...profile.careerHighlights];
                            newHighlights[index] = { ...newHighlights[index], year: e.target.value };
                            setProfile(prev => ({ ...prev, careerHighlights: newHighlights }));
                          }}
                          placeholder="Year"
                        />
                        <Input
                          type="text"
                          value={highlight.title}
                          onChange={(e) => {
                            const newHighlights = [...profile.careerHighlights];
                            newHighlights[index] = { ...newHighlights[index], title: e.target.value };
                            setProfile(prev => ({ ...prev, careerHighlights: newHighlights }));
                          }}
                          placeholder="Title"
                        />
                        <Textarea
                          value={highlight.description}
                          onChange={(e) => {
                            const newHighlights = [...profile.careerHighlights];
                            newHighlights[index] = { ...newHighlights[index], description: e.target.value };
                            setProfile(prev => ({ ...prev, careerHighlights: newHighlights }));
                          }}
                          placeholder="Description"
                          rows={1}
                        />
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => setProfile(prev => ({ ...prev, careerHighlights: [...prev.careerHighlights, { year: '', title: '', description: '' }] }))}
                      className="w-full"
                    >
                      Add Career Highlight
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Musical Style & Influences */}
              <Card>
                <CardHeader>
                  <CardTitle>Musical Style & Influences</CardTitle>
                  <CardDescription>Your musical preferences and influences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="musicalStyle" className={`${validationErrors.musicalStyle ? 'text-red-500' : ''}`}>
                        Musical Style <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="musicalStyle"
                        value={profile.musicalStyle}
                        onChange={(e) => handleInputChange('musicalStyle', e.target.value)}
                        placeholder="e.g., Hip-Hop, Pop, Rock, Electronic"
                      />
                      {validationErrors.musicalStyle && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.musicalStyle}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="influences" className={`${validationErrors.influences ? 'text-red-500' : ''}`}>
                        Influences <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="influences"
                        value={profile.influences}
                        onChange={(e) => handleInputChange('influences', e.target.value)}
                        placeholder="List your musical influences (e.g., artists, genres, styles)"
                        rows={3}
                      />
                      {validationErrors.influences && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.influences}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Social Media Links</CardTitle>
                  <CardDescription>Connect your social media profiles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="spotify">Spotify</Label>
                      <Input
                        id="spotify"
                        value={profile.socialLinks.spotify || ''}
                        onChange={(e) => handleSocialLinkChange('spotify', e.target.value)}
                        placeholder="https://open.spotify.com/artist/..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        value={profile.socialLinks.instagram || ''}
                        onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                        placeholder="https://instagram.com/..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="twitter">Twitter/X</Label>
                      <Input
                        id="twitter"
                        value={profile.socialLinks.twitter || ''}
                        onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                        placeholder="https://twitter.com/..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="youtube">YouTube</Label>
                      <Input
                        id="youtube"
                        value={profile.socialLinks.youtube || ''}
                        onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                        placeholder="https://youtube.com/..."
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={profile.socialLinks.website || ''}
                        onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 justify-end">
              <Button variant="outline" onClick={handlePreview} className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Preview
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isSaving || !isFormComplete()}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
            
            {/* Form Completion Status */}
            {!isFormComplete() && (
              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-yellow-300">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">Complete all required fields to save your profile</span>
                </div>
                <div className="mt-2 text-xs text-yellow-200">
                  Required: Artist Name, Genre, Location, Biography (min 50 characters), Musical Style, Influences, Profile Image, and Banner Image
                </div>
                {/* Debug information */}
                <div className="mt-2 text-xs text-gray-400">
                  Debug: Name: {profile.name ? '✓' : '✗'}, Genre: {profile.genre ? '✓' : '✗'}, Location: {profile.location ? '✓' : '✗'}, 
                  Bio: {profile.bio.length >= 50 ? '✓' : '✗'}, Style: {profile.musicalStyle ? '✓' : '✗'}, 
                  Influences: {profile.influences ? '✓' : '✗'}, ProfileImg: {(imagePreview || profile.profileImage) ? '✓' : '✗'}, BannerImg: {(bannerPreview || profile.bannerImage) ? '✓' : '✗'}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  ImagePreview: {imagePreview ? 'Set' : 'Not set'}, ProfileImage: {profile.profileImage ? 'Set' : 'Not set'}, 
                  BannerPreview: {bannerPreview ? 'Set' : 'Not set'}, BannerImage: {profile.bannerImage ? 'Set' : 'Not set'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ArtistProfileManager;
