
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
import { artistProfileService, ArtistProfile as ServiceArtistProfile } from '@/services/artistProfileService';
import { useToast } from '@/hooks/use-toast';

interface ArtistProfile {
  name: string;
  bio: string;
  genre: string;
  location: string;
  profileImage: string;
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
    genre: '',
    location: '',
    profileImage: '',
    socialLinks: {}
  });

  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [existingProfile, setExistingProfile] = useState<ServiceArtistProfile | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    // Load existing profile if user has one
    if (user) {
      const existing = artistProfileService.getProfileByUserId(user.id);
      if (existing) {
        setExistingProfile(existing);
        setProfile({
          name: existing.artistName,
          bio: existing.bio,
          genre: existing.genre.join(', '),
          location: existing.location,
          profileImage: existing.profilePhoto,
          socialLinks: existing.socialLinks
        });
        setImagePreview(existing.profilePhoto);
      }
    }
  }, [user, isAuthenticated, isLoading, navigate]);

  const handleInputChange = (field: keyof Omit<ArtistProfile, 'socialLinks'>, value: string) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
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
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setProfile(prev => ({
          ...prev,
          profileImage: result
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

    if (!profile.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Artist name is required",
        variant: "destructive"
      });
      return;
    }

    setIsSaving(true);
    try {
      const profileData = {
        artistName: profile.name,
        email: user.email,
        bio: profile.bio,
        genre: profile.genre.split(',').map(g => g.trim()).filter(g => g),
        location: profile.location,
        profilePhoto: profile.profileImage || '/placeholder.svg',
        socialLinks: profile.socialLinks
      };

      let savedProfile: ServiceArtistProfile;
      
      if (existingProfile) {
        const updated = artistProfileService.updateProfile(existingProfile.id, profileData);
        if (!updated) {
          throw new Error('Failed to update profile');
        }
        savedProfile = updated;
      } else {
        savedProfile = artistProfileService.createProfile(user.id, profileData);
      }

      setExistingProfile(savedProfile);
      
      toast({
        title: "Success",
        description: "Artist profile saved successfully!",
      });

      // Navigate to the view profile page
      navigate('/view-artist-profile');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
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
          artistName: profile.name,
          email: user.email,
          bio: profile.bio,
          genre: profile.genre.split(',').map(g => g.trim()).filter(g => g),
          location: profile.location,
          profilePhoto: profile.profileImage || '/placeholder.svg',
          socialLinks: profile.socialLinks
        };

        let previewProfile: ServiceArtistProfile;
        
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
                    <Label htmlFor="name">Artist Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter your artist name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="genre">Genre</Label>
                    <Input
                      id="genre"
                      value={profile.genre}
                      onChange={(e) => handleInputChange('genre', e.target.value)}
                      placeholder="e.g., Hip-Hop, Pop, Rock"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profile.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City, Country"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="bio">Biography</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell your story..."
                      rows={4}
                    />
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
                          <p className="text-muted-foreground">Click to upload your profile image</p>
                        </div>
                      )}
                    </div>
                    
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="cursor-pointer"
                    />
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
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ArtistProfileManager;
