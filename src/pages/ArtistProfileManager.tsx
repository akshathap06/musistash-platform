
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Save, Eye, Clock, CheckCircle, XCircle, AlertCircle, Music } from "lucide-react";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { artistProfileService } from '@/services/artistProfileService';
import { EfficientArtistProfileService } from '@/services/efficientArtistProfileService';
import { CareerHighlightsService } from '@/services/careerHighlightsService';
import { useToast } from '@/hooks/use-toast';
import { BACKEND_URL } from '@/config/api';

interface ArtistProfile {
  name: string;
  bio: string;
  biography: string;
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
  // New stats fields
  monthlyListeners?: number;
  totalStreams?: number;
  futureReleases?: Array<{
    title: string;
    releaseDate: string;
    description: string;
    type: 'single' | 'ep' | 'album' | 'mixtape';
  }>;
  spotifyArtistId?: string;
  spotifyEmbedUrls?: string[];
  youtubeChannelId?: string;
  instagramHandle?: string;
  twitterHandle?: string;
  websiteUrl?: string;
  successRate?: number;
  verifiedStatus?: boolean;
  // Spotify integration
  spotifyProfileUrl?: string;
  spotifyData?: {
    followers?: number;
    popularity?: number;
    genres?: string[];
    topTracks?: Array<{
      id: string;
      name: string;
      url: string;
    }>;
  };
}

const ArtistProfileManager = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<ArtistProfile>({
    name: '',
    bio: '',
    biography: '',
    genre: [],
    location: '',
    profileImage: '',
    bannerImage: '',
    careerHighlights: [],
    musicalStyle: '',
    influences: '',
    socialLinks: {},
    // New stats fields
    monthlyListeners: 0,
    totalStreams: 0,
    futureReleases: [],
    spotifyArtistId: '',
    spotifyEmbedUrls: [],
    youtubeChannelId: '',
    instagramHandle: '',
    twitterHandle: '',
    websiteUrl: '',
    successRate: 0,
    verifiedStatus: false
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
          console.log('Loaded existing profile:', existing);
          if (existing) {
            setExistingProfile(existing);
            
            // Load career highlights from the separate table
            let careerHighlights = [];
            try {
              const careerHighlightsService = new CareerHighlightsService();
              careerHighlights = await careerHighlightsService.getCareerHighlights(existing.id);
              console.log('Loaded career highlights:', careerHighlights);
            } catch (error) {
              console.error('Error loading career highlights:', error);
              careerHighlights = [];
            }
            
            setProfile({
              name: existing.artist_name,
              bio: existing.bio,
              biography: (existing as any).biography || existing.bio || '',
              genre: Array.isArray(existing.genre) ? existing.genre : [],
              location: existing.location,
              profileImage: existing.profile_photo,
              bannerImage: existing.banner_photo,
              careerHighlights: careerHighlights,
              musicalStyle: (existing as any).musical_style || '',
              influences: (existing as any).influences || '',
              socialLinks: existing.social_links,
              // Load all the new fields
              monthlyListeners: (existing as any).monthly_listeners || 0,
              totalStreams: (existing as any).total_streams || 0,
              successRate: (existing as any).success_rate || 0,
              futureReleases: (existing as any).future_releases || [],
              spotifyArtistId: (existing as any).spotify_artist_id || '',
              spotifyEmbedUrls: (existing as any).spotify_embed_urls || [],
              spotifyProfileUrl: (existing as any).spotify_profile_url || '',
              spotifyData: (existing as any).spotify_data || {},
              youtubeChannelId: (existing as any).youtube_channel_id || '',
              instagramHandle: (existing as any).instagram_handle || '',
              twitterHandle: (existing as any).twitter_handle || '',
              websiteUrl: (existing as any).website_url || '',
              verifiedStatus: (existing as any).verified_status || false
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

  // Helper function to get only changed fields
  const getChangedFields = (existingProfile: any, newData: any) => {
    const changedFields: any = {};
    
    for (const [key, newValue] of Object.entries(newData)) {
      const existingValue = existingProfile[key];
      
      // Deep comparison for objects and arrays
      if (JSON.stringify(existingValue) !== JSON.stringify(newValue)) {
        changedFields[key] = newValue;
      }
    }
    
    return changedFields;
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
      
      // Clean and prepare the profile data, removing undefined/null values
      const profileData = {
        artist_name: profile.name || '',
        email: user.email,
        bio: profile.bio || '',
        biography: profile.biography || '',
        genre: profile.genre || [],
        location: profile.location || '',
        profile_photo: profile.profileImage || imagePreview || '/placeholder.svg',
        banner_photo: profile.bannerImage || bannerPreview || '/placeholder.svg',
        career_highlights: profile.careerHighlights || [],
        musical_style: profile.musicalStyle || '',
        influences: profile.influences || '',
        social_links: profile.socialLinks || {},
        // Stats fields - match exact database column names
        monthly_listeners: profile.monthlyListeners || 0,
        total_streams: profile.totalStreams || 0,
        success_rate: profile.successRate || 0,
        future_releases: profile.futureReleases || [],
        spotify_artist_id: profile.spotifyArtistId || '',
        spotify_embed_urls: profile.spotifyEmbedUrls || [],
        spotify_profile_url: profile.spotifyProfileUrl || '',
        spotify_data: profile.spotifyData || {},
        youtube_channel_id: profile.youtubeChannelId || '',
        instagram_handle: profile.instagramHandle || '',
        twitter_handle: profile.twitterHandle || '',
        website_url: profile.websiteUrl || '',
        verified_status: profile.verifiedStatus || false
      };

      // Remove any undefined or null values
      const cleanProfileData = Object.fromEntries(
        Object.entries(profileData).filter(([_, value]) => {
          if (value === undefined || value === null) return false;
          if (Array.isArray(value) && value.length === 0) return true; // Keep empty arrays
          if (typeof value === 'object' && Object.keys(value).length === 0) return true; // Keep empty objects
          return true;
        })
      );
      console.log('Processed profile data:', cleanProfileData);
      console.log('Existing profile:', existingProfile);

      let savedProfile: any;
      
      if (existingProfile) {
        console.log('Updating existing profile with ID:', existingProfile.id);
        
        const efficientService = new EfficientArtistProfileService();
        
        // Single efficient update with all data
        const updateData = {
          // Basic profile info
          artist_name: profile.name || '',
          bio: profile.bio || '',
          biography: profile.biography || '',
          genre: profile.genre || [],
          location: profile.location || '',
          musical_style: profile.musicalStyle || '',
          influences: profile.influences || '',
          
          // Images
          profile_photo: profile.profileImage || imagePreview || '/placeholder.svg',
          banner_photo: profile.bannerImage || bannerPreview || '/placeholder.svg',
          
          // Social media
          social_links: profile.socialLinks || {},
          spotify_profile_url: profile.spotifyProfileUrl || '',
          spotify_artist_id: profile.spotifyArtistId || '',
          instagram_handle: profile.instagramHandle || '',
          twitter_handle: profile.twitterHandle || '',
          youtube_channel_id: profile.youtubeChannelId || '',
          website_url: profile.websiteUrl || '',
          
          // Stats and career
          monthly_listeners: profile.monthlyListeners || 0,
          total_streams: profile.totalStreams || 0,
          success_rate: profile.successRate || 0,
          career_highlights: profile.careerHighlights || [],
          future_releases: profile.futureReleases || [],
          spotify_embed_urls: profile.spotifyEmbedUrls || [],
          spotify_data: profile.spotifyData || {},
          
          // Verification
          verified_status: profile.verifiedStatus || false
        };

        console.log('Efficient update: Single database call with all data');
        savedProfile = await efficientService.updateProfile(existingProfile.id, updateData);
      } else {
        console.log('Creating new profile for user ID:', user.id);
        const efficientService = new EfficientArtistProfileService();
        // Single efficient create with all data
        const createData = {
          artist_name: profile.name || '',
          email: user.email,
          ...cleanProfileData
        };
        savedProfile = await efficientService.createProfile(user.id, createData);
        console.log('Create result:', savedProfile);
      }

      if (savedProfile) {
        console.log('Profile saved successfully:', savedProfile);
        setExistingProfile(savedProfile);
        
        toast({
          title: "Success",
          description: "Artist profile saved successfully! All data updated efficiently.",
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

  const handleImportSpotify = async () => {
    if (!profile.spotifyProfileUrl) {
      toast({
        title: "Error",
        description: "Please enter your Spotify profile URL first",
        variant: "destructive"
      });
      return;
    }

    try {
      // Extract artist ID from URL
      const urlMatch = profile.spotifyProfileUrl.match(/artist\/([a-zA-Z0-9]+)/);
      if (!urlMatch) {
        toast({
          title: "Invalid URL",
          description: "Please enter a valid Spotify artist profile URL",
          variant: "destructive"
        });
        return;
      }

      const artistId = urlMatch[1];
      
      // Call backend to fetch Spotify data
      const response = await fetch(`${BACKEND_URL}/spotify-artist/${artistId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch Spotify data');
      }

      const spotifyData = await response.json();
      
      // Update profile with Spotify data
      const updatedProfile = {
        ...profile,
        spotifyArtistId: artistId,
        spotifyData: {
          followers: spotifyData.followers?.total || 0,
          popularity: spotifyData.popularity || 0,
          genres: spotifyData.genres || [],
          topTracks: spotifyData.topTracks || []
        },
        // Auto-fill some fields if they're empty
        name: profile.name || spotifyData.name || '',
        bio: profile.bio || `Listen to ${spotifyData.name} on Spotify`,
        genre: profile.genre.length === 0 ? spotifyData.genres || [] : profile.genre,
        spotifyEmbedUrls: spotifyData.topTracks?.slice(0, 3).map((track: any) => track.external_urls?.spotify) || []
      };

      setProfile(updatedProfile);

      // If we have an existing profile, save the Spotify data immediately
      if (existingProfile) {
        const efficientService = new EfficientArtistProfileService();
        
        // Single efficient update with Spotify data
        await efficientService.updateProfile(existingProfile.id, {
          artist_name: updatedProfile.name,
          bio: updatedProfile.bio,
          genre: updatedProfile.genre,
          spotify_artist_id: artistId,
          spotify_profile_url: profile.spotifyProfileUrl,
          monthly_listeners: spotifyData.followers?.total || 0,
          total_streams: profile.totalStreams || 0,
          success_rate: profile.successRate || 0,
          spotify_embed_urls: updatedProfile.spotifyEmbedUrls,
        });

        // Update the existing profile state
        const finalProfile = await efficientService.getProfileById(existingProfile.id);
        setExistingProfile(finalProfile);
      }

      toast({
        title: "Success!",
        description: "Spotify data imported and saved successfully",
        variant: "default"
      });

    } catch (error) {
      console.error('Error importing Spotify data:', error);
      toast({
        title: "Import Failed",
        description: "Could not import Spotify data. Please check your URL and try again.",
        variant: "destructive"
      });
    }
  };

  const handlePreview = async () => {
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
          biography: profile.biography,
          genre: profile.genre,
          location: profile.location,
          profile_photo: profile.profileImage || '/placeholder.svg',
          banner_photo: profile.bannerImage || '/placeholder.svg',
          career_highlights: profile.careerHighlights,
          musical_style: profile.musicalStyle,
          influences: profile.influences,
          social_links: profile.socialLinks
        };

        let previewProfile: any;
        const efficientService = new EfficientArtistProfileService();
        if (existingProfile) {
          const updated = await efficientService.updateProfile(existingProfile.id, tempProfileData);
          if (!updated) {
            throw new Error('Failed to update profile for preview');
          }
          previewProfile = updated;
        } else {
          // Ensure user_id is included for preview
          const createData = {
            artist_name: profile.name || '',
            email: user.email,
            ...tempProfileData
          };
          previewProfile = await efficientService.createProfile(user.id, createData);
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
    <div className="flex flex-col min-h-screen bg-[#0f1216]">
      <Navbar />
      
      <div className="flex-1 pt-20">
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2 text-white">My Artist Profile</h1>
              <p className="text-gray-400">Manage your artist profile and track approval status</p>
            </div>

            {/* Status Card - Only show if profile exists */}
            {existingProfile && (
              <Card className="mb-8 bg-[#181b2a] border-gray-700/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Profile Status</CardTitle>
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
              <Card className="bg-[#181b2a] border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Basic Information</CardTitle>
                  <CardDescription className="text-gray-400">Your essential artist details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name" className={`${validationErrors.name ? 'text-red-500' : 'text-gray-300'}`}>
                      Artist Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your artist name"
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                    {validationErrors.name && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="genre" className={`${validationErrors.genre ? 'text-red-500' : 'text-gray-300'}`}>
                      Genre <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="genre"
                      value={profile.genre.join(', ')}
                      onChange={(e) => handleGenreChange(e.target.value)}
                      placeholder="e.g., Hip-Hop, Pop, Rock"
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                    {validationErrors.genre && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.genre}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="location" className={`${validationErrors.location ? 'text-red-500' : 'text-gray-300'}`}>
                      Location <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City, Country"
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                    {validationErrors.location && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.location}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="bio" className={`${validationErrors.bio ? 'text-red-500' : 'text-gray-300'}`}>
                      Short Bio <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="A brief introduction (50+ characters)..."
                      rows={3}
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                    {validationErrors.bio && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.bio}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="biography" className="text-gray-300">
                      Detailed Biography
                    </Label>
                    <Textarea
                      id="biography"
                      value={profile.biography}
                      onChange={(e) => handleInputChange('biography', e.target.value)}
                      placeholder="Tell your complete story, musical journey, and background..."
                      rows={6}
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      This will be displayed in the "About" section of your profile
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Image */}
              <Card className="bg-[#181b2a] border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Profile Image</CardTitle>
                  <CardDescription className="text-gray-400">Upload your artist photo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                      {imagePreview ? (
                        <div className="space-y-4">
                          <img
                            src={imagePreview}
                            alt="Profile preview"
                            className="w-32 h-32 object-cover rounded-full mx-auto"
                          />
                          <p className="text-sm text-gray-400">Image uploaded successfully</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="w-12 h-12 mx-auto text-gray-400" />
                          <p className="text-gray-400">
                            Click to upload your profile image <span className="text-red-500">*</span>
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="cursor-pointer bg-gray-800 border-gray-600 text-white"
                    />
                    {validationErrors.profileImage && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.profileImage}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Spotify Integration */}
            <div className="mt-8">
              <Card className="bg-[#181b2a] border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Connect Your Spotify</CardTitle>
                  <CardDescription className="text-gray-400">Automatically import your music and stats from Spotify</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="spotifyProfileUrl" className="text-gray-300">
                        Spotify Artist Profile URL
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="spotifyProfileUrl"
                          value={profile.spotifyProfileUrl || ''}
                          onChange={(e) => handleInputChange('spotifyProfileUrl', e.target.value)}
                          placeholder="https://open.spotify.com/artist/..."
                          className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                        />
                        <Button
                          onClick={handleImportSpotify}
                          disabled={!profile.spotifyProfileUrl}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Import
                        </Button>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Paste your Spotify artist profile URL and we'll automatically fetch your music, stats, and top tracks
                      </p>
                    </div>

                    {/* Auto-imported data preview */}
                    {profile.spotifyData && (
                      <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                        <h4 className="text-white font-medium mb-3">Imported Data Preview</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Followers:</span>
                            <div className="text-white font-medium">
                              {profile.spotifyData.followers?.toLocaleString() || 'N/A'}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">Popularity:</span>
                            <div className="text-white font-medium">
                              {profile.spotifyData.popularity || 'N/A'}%
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">Genres:</span>
                            <div className="text-white font-medium">
                              {profile.spotifyData.genres?.slice(0, 2).join(', ') || 'N/A'}
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-400">Top Tracks:</span>
                            <div className="text-white font-medium">
                              {profile.spotifyData.topTracks?.length || 0} tracks
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Manual override section */}
                    <div className="border-t border-gray-700 pt-4">
                      <h4 className="text-white font-medium mb-3">Manual Stats (Optional)</h4>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <Label htmlFor="monthlyListeners" className="text-gray-300 text-sm">
                            Monthly Listeners
                          </Label>
                          <Input
                            id="monthlyListeners"
                            type="number"
                            value={profile.monthlyListeners || 0}
                            onChange={(e) => handleInputChange('monthlyListeners', e.target.value)}
                            placeholder="0"
                            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="totalStreams" className="text-gray-300 text-sm">
                            Total Streams
                          </Label>
                          <Input
                            id="totalStreams"
                            type="number"
                            value={profile.totalStreams || 0}
                            onChange={(e) => handleInputChange('totalStreams', e.target.value)}
                            placeholder="0"
                            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="successRate" className="text-gray-300 text-sm">
                            Success Rate (%)
                          </Label>
                          <Input
                            id="successRate"
                            type="number"
                            min="0"
                            max="100"
                            step="0.1"
                            value={profile.successRate || 0}
                            onChange={(e) => handleInputChange('successRate', e.target.value)}
                            placeholder="0"
                            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Social Media & Future Releases */}
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {/* Social Media Links */}
              <Card className="bg-[#181b2a] border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Social Media Links</CardTitle>
                  <CardDescription className="text-gray-400">Connect your social media accounts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="instagramHandle" className="text-gray-300">
                      Instagram Handle
                    </Label>
                    <Input
                      id="instagramHandle"
                      value={profile.instagramHandle || ''}
                      onChange={(e) => handleInputChange('instagramHandle', e.target.value)}
                      placeholder="username (without @)"
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="twitterHandle" className="text-gray-300">
                      Twitter Handle
                    </Label>
                    <Input
                      id="twitterHandle"
                      value={profile.twitterHandle || ''}
                      onChange={(e) => handleInputChange('twitterHandle', e.target.value)}
                      placeholder="username (without @)"
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="youtubeChannelId" className="text-gray-300">
                      YouTube Channel ID
                    </Label>
                    <Input
                      id="youtubeChannelId"
                      value={profile.youtubeChannelId || ''}
                      onChange={(e) => handleInputChange('youtubeChannelId', e.target.value)}
                      placeholder="e.g., UC..."
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="websiteUrl" className="text-gray-300">
                      Website URL
                    </Label>
                    <Input
                      id="websiteUrl"
                      value={profile.websiteUrl || ''}
                      onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Future Releases */}
              <Card className="bg-[#181b2a] border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Future Releases</CardTitle>
                  <CardDescription className="text-gray-400">Share your upcoming music plans</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {profile.futureReleases && profile.futureReleases.length > 0 ? (
                      <div className="space-y-4">
                        {profile.futureReleases.map((release, index) => (
                          <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label className="text-gray-300 text-sm">Release Title</Label>
                                <Input
                                  value={release.title}
                                  onChange={(e) => {
                                    const newReleases = [...profile.futureReleases];
                                    newReleases[index] = { ...newReleases[index], title: e.target.value };
                                    setProfile(prev => ({ ...prev, futureReleases: newReleases }));
                                  }}
                                  placeholder="e.g., New Single"
                                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                />
                              </div>
                              <div>
                                <Label className="text-gray-300 text-sm">Release Type</Label>
                                <select
                                  value={release.type}
                                  onChange={(e) => {
                                    const newReleases = [...profile.futureReleases];
                                    newReleases[index] = { ...newReleases[index], type: e.target.value as any };
                                    setProfile(prev => ({ ...prev, futureReleases: newReleases }));
                                  }}
                                  className="w-full bg-gray-700 border-gray-600 text-white rounded-md px-3 py-2"
                                >
                                  <option value="single">Single</option>
                                  <option value="ep">EP</option>
                                  <option value="album">Album</option>
                                  <option value="mixtape">Mixtape</option>
                                </select>
                              </div>
                              <div>
                                <Label className="text-gray-300 text-sm">Release Date</Label>
                                <Input
                                  type="date"
                                  value={release.releaseDate}
                                  onChange={(e) => {
                                    const newReleases = [...profile.futureReleases];
                                    newReleases[index] = { ...newReleases[index], releaseDate: e.target.value };
                                    setProfile(prev => ({ ...prev, futureReleases: newReleases }));
                                  }}
                                  className="bg-gray-700 border-gray-600 text-white"
                                />
                              </div>
                              <div className="md:col-span-2">
                                <Label className="text-gray-300 text-sm">Description</Label>
                                <Textarea
                                  value={release.description}
                                  onChange={(e) => {
                                    const newReleases = [...profile.futureReleases];
                                    newReleases[index] = { ...newReleases[index], description: e.target.value };
                                    setProfile(prev => ({ ...prev, futureReleases: newReleases }));
                                  }}
                                  placeholder="Tell us about this release..."
                                  rows={2}
                                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                                />
                              </div>
                            </div>
                            <div className="mt-3 flex justify-end">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newReleases = profile.futureReleases.filter((_, i) => i !== index);
                                  setProfile(prev => ({ ...prev, futureReleases: newReleases }));
                                }}
                                className="bg-red-600/20 border-red-600 text-red-300 hover:bg-red-600/30"
                              >
                                Remove
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>No future releases added yet</p>
                        <p className="text-sm">Click "Add Release" to get started</p>
                      </div>
                    )}
                    
                    <Button
                      variant="outline"
                      onClick={() => {
                        const newRelease = {
                          title: '',
                          releaseDate: '',
                          description: '',
                          type: 'single' as const
                        };
                        setProfile(prev => ({
                          ...prev,
                          futureReleases: [...(prev.futureReleases || []), newRelease]
                        }));
                      }}
                      className="w-full bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                    >
                      <Music className="w-4 h-4 mr-2" />
                      Add Release
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Banner Image */}
            <div className="mt-8">
              <Card className="bg-[#181b2a] border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Banner Image</CardTitle>
                  <CardDescription className="text-gray-400">Upload your artist banner photo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
                      {bannerPreview ? (
                        <div className="space-y-4">
                          <img
                            src={bannerPreview}
                            alt="Banner preview"
                            className="w-full h-32 object-cover rounded-md"
                          />
                          <p className="text-sm text-gray-400">Banner image uploaded successfully</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <Upload className="w-12 h-12 mx-auto text-gray-400" />
                          <p className="text-gray-400">
                            Click to upload your banner image <span className="text-red-500">*</span>
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleBannerUpload}
                      className="cursor-pointer bg-gray-800 border-gray-600 text-white"
                    />
                    {validationErrors.bannerImage && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.bannerImage}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Career Highlights */}
            <div className="mt-8">
              <Card className="bg-[#181b2a] border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Career Highlights</CardTitle>
                  <CardDescription className="text-gray-400">Your major achievements and milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {profile.careerHighlights.map((highlight, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-start">
                        <Input
                          type="text"
                          value={highlight.year}
                          onChange={(e) => {
                            const newHighlights = [...profile.careerHighlights];
                            newHighlights[index] = { ...newHighlights[index], year: e.target.value };
                            setProfile(prev => ({ ...prev, careerHighlights: newHighlights }));
                          }}
                          placeholder="Year"
                          className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
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
                          className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                        />
                        <div className="flex gap-2">
                          <Textarea
                            value={highlight.description}
                            onChange={(e) => {
                              const newHighlights = [...profile.careerHighlights];
                              newHighlights[index] = { ...newHighlights[index], description: e.target.value };
                              setProfile(prev => ({ ...prev, careerHighlights: newHighlights }));
                            }}
                            placeholder="Description"
                            rows={1}
                            className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 flex-1"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newHighlights = profile.careerHighlights.filter((_, i) => i !== index);
                              setProfile(prev => ({ ...prev, careerHighlights: newHighlights }));
                            }}
                            className="bg-red-600/20 border-red-600 text-red-300 hover:bg-red-600/30 px-3 py-2"
                            title="Remove this career highlight"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => setProfile(prev => ({ ...prev, careerHighlights: [...prev.careerHighlights, { year: '', title: '', description: '' }] }))}
                      className="w-full bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                    >
                      Add Career Highlight
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Musical Style & Influences */}
              <Card className="bg-[#181b2a] border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Musical Style & Influences</CardTitle>
                  <CardDescription className="text-gray-400">Your musical preferences and influences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div>
                      <Label htmlFor="musicalStyle" className={`${validationErrors.musicalStyle ? 'text-red-500' : 'text-gray-300'}`}>
                        Musical Style <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="musicalStyle"
                        value={profile.musicalStyle}
                        onChange={(e) => handleInputChange('musicalStyle', e.target.value)}
                        placeholder="e.g., Hip-Hop, Pop, Rock, Electronic"
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                      />
                      {validationErrors.musicalStyle && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.musicalStyle}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="influences" className={`${validationErrors.influences ? 'text-red-500' : 'text-gray-300'}`}>
                        Influences <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        id="influences"
                        value={profile.influences}
                        onChange={(e) => handleInputChange('influences', e.target.value)}
                        placeholder="List your musical influences (e.g., artists, genres, styles)"
                        rows={3}
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                      />
                      {validationErrors.influences && (
                        <p className="text-red-500 text-xs mt-1">{validationErrors.influences}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card className="md:col-span-2 bg-[#181b2a] border-gray-700/50">
                <CardHeader>
                  <CardTitle className="text-white">Social Media Links</CardTitle>
                  <CardDescription className="text-gray-400">Connect your social media profiles</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="spotify" className="text-gray-300">Spotify</Label>
                      <Input
                        id="spotify"
                        value={profile.socialLinks.spotify || ''}
                        onChange={(e) => handleSocialLinkChange('spotify', e.target.value)}
                        placeholder="https://open.spotify.com/artist/..."
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="instagram" className="text-gray-300">Instagram</Label>
                      <Input
                        id="instagram"
                        value={profile.socialLinks.instagram || ''}
                        onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                        placeholder="https://instagram.com/..."
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="twitter" className="text-gray-300">Twitter/X</Label>
                      <Input
                        id="twitter"
                        value={profile.socialLinks.twitter || ''}
                        onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                        placeholder="https://twitter.com/..."
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="youtube" className="text-gray-300">YouTube</Label>
                      <Input
                        id="youtube"
                        value={profile.socialLinks.youtube || ''}
                        onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                        placeholder="https://youtube.com/..."
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <Label htmlFor="website" className="text-gray-300">Website</Label>
                      <Input
                        id="website"
                        value={profile.socialLinks.website || ''}
                        onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                        placeholder="https://yourwebsite.com"
                        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 justify-end">
              <Button variant="outline" onClick={handlePreview} className="flex items-center gap-2 bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
                <Eye className="w-4 h-4" />
                Preview
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={isSaving || !isFormComplete()}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
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
