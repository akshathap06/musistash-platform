import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { artistProfileService, ArtistProfile } from '@/services/artistProfileService';
import { Upload, Save, Eye, MapPin, Link as LinkIcon, User, Camera, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const musicGenres = [
  'Pop', 'Rock', 'Hip-Hop', 'R&B', 'Country', 'Electronic', 'Jazz', 'Classical',
  'Folk', 'Blues', 'Reggae', 'Alternative', 'Indie', 'Metal', 'Punk', 'Funk',
  'Soul', 'Gospel', 'Latin', 'World', 'Experimental', 'Ambient', 'Other'
];

const ArtistProfileManager = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [formData, setFormData] = useState({
    artistName: '',
    email: '',
    profilePhoto: '/placeholder.svg',
    bannerPhoto: '/placeholder.svg',
    bio: '',
    genre: [] as string[],
    location: '',
    socialLinks: {
      spotify: '',
      instagram: '',
      twitter: '',
      youtube: '',
      website: '',
    },
  });
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      // Load existing profile or set defaults
      const existingProfile = artistProfileService.getProfileByUserId(user.id);
      if (existingProfile) {
        setProfile(existingProfile);
        setFormData({
          artistName: existingProfile.artistName,
          email: existingProfile.email,
          profilePhoto: existingProfile.profilePhoto,
          bannerPhoto: existingProfile.bannerPhoto,
          bio: existingProfile.bio,
          genre: existingProfile.genre,
          location: existingProfile.location,
          socialLinks: existingProfile.socialLinks,
        });
        setSelectedGenres(existingProfile.genre);
      } else {
        // Set default values for new profile
        setFormData(prev => ({
          ...prev,
          email: user.email,
        }));
        setIsEditing(true);
      }
    }
  }, [user, isLoading, isAuthenticated, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => {
      const newGenres = prev.includes(genre)
        ? prev.filter(g => g !== genre)
        : [...prev, genre];
      
      setFormData(prevForm => ({
        ...prevForm,
        genre: newGenres,
      }));
      
      return newGenres;
    });
  };

  const handleImageUpload = (field: 'profilePhoto' | 'bannerPhoto') => {
    // In a real app, this would handle file upload
    // For demo, we'll use a placeholder URL
    const mockImageUrl = `https://images.unsplash.com/photo-${Date.now()}?auto=format&fit=crop&w=800&h=400`;
    handleInputChange(field, mockImageUrl);
  };

  const handleSave = async () => {
    if (!user) return;

    setIsSaving(true);
    setSaveStatus('idle');

    try {
      if (profile) {
        // Update existing profile
        const updatedProfile = artistProfileService.updateProfile(profile.id, formData);
        if (updatedProfile) {
          setProfile(updatedProfile);
          setSaveStatus('success');
          setIsEditing(false);
        }
      } else {
        // Create new profile
        const newProfile = artistProfileService.createProfile(user.id, formData);
        setProfile(newProfile);
        setSaveStatus('success');
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
        <div className="animate-pulse text-center">
          <div className="text-xl font-semibold mb-2 text-white">Loading Profile</div>
          <div className="text-gray-300">Please wait...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <Navbar />
      
      <div className="flex-1 pt-20">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Artist Profile</h1>
            <p className="text-gray-300">Manage your artist profile and showcase your musical journey</p>
          </div>

          {/* Status Messages */}
          {saveStatus === 'success' && (
            <Alert className="mb-6 bg-green-500/20 border-green-500/50 text-green-300">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Profile saved successfully!
              </AlertDescription>
            </Alert>
          )}

          {saveStatus === 'error' && (
            <Alert className="mb-6 bg-red-500/20 border-red-500/50 text-red-300">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to save profile. Please try again.
              </AlertDescription>
            </Alert>
          )}

          {/* Banner Image */}
          <Card className="mb-6 bg-gray-800/50 border-gray-700/50 backdrop-blur-sm overflow-hidden">
            <div className="relative h-48 md:h-64">
              <img
                src={formData.bannerPhoto}
                alt="Banner"
                className="w-full h-full object-cover"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleImageUpload('bannerPhoto')}
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Change Banner
                  </Button>
                </div>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Profile Image and Quick Info */}
            <div className="space-y-6">
              {/* Profile Image */}
              <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="relative inline-block mb-4">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-600">
                      <img
                        src={formData.profilePhoto}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full p-0 bg-blue-600 border-blue-500 hover:bg-blue-700"
                        onClick={() => handleImageUpload('profilePhoto')}
                      >
                        <Camera className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  
                  {profile?.isVerified && (
                    <Badge className="mb-2 bg-blue-500/20 text-blue-300 border-blue-500/50">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Verified Artist
                    </Badge>
                  )}
                  
                  <h2 className="text-xl font-semibold text-white">
                    {formData.artistName || 'Your Artist Name'}
                  </h2>
                  <p className="text-gray-400 text-sm">{formData.location}</p>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {!isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                        onClick={() => setIsEditing(true)}
                      >
                        <User className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                        onClick={() => navigate('/create-project')}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Create Project
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={handleSave}
                        disabled={isSaving}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Profile Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Basic Information</CardTitle>
                  <CardDescription className="text-gray-400">
                    Your primary artist details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="artistName" className="text-gray-300">Artist Name</Label>
                      <Input
                        id="artistName"
                        value={formData.artistName}
                        onChange={(e) => handleInputChange('artistName', e.target.value)}
                        placeholder="Your stage name or band name"
                        disabled={!isEditing}
                        className="bg-gray-700/50 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-gray-300">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                        disabled={!isEditing}
                        className="bg-gray-700/50 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location" className="text-gray-300">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City, State/Country"
                      disabled={!isEditing}
                      className="bg-gray-700/50 border-gray-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio" className="text-gray-300">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell your story, describe your musical style, influences, and what makes you unique..."
                      disabled={!isEditing}
                      className="bg-gray-700/50 border-gray-600 text-white min-h-[120px]"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Music Genres */}
              <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Music Genres</CardTitle>
                  <CardDescription className="text-gray-400">
                    Select up to 5 genres that best describe your music
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {musicGenres.map((genre) => (
                      <Badge
                        key={genre}
                        variant={selectedGenres.includes(genre) ? "default" : "outline"}
                        className={`cursor-pointer transition-all ${
                          selectedGenres.includes(genre)
                            ? 'bg-blue-600 text-white border-blue-500'
                            : 'border-gray-600 text-gray-300 hover:bg-gray-700'
                        } ${!isEditing ? 'pointer-events-none' : ''}`}
                        onClick={() => isEditing && selectedGenres.length < 5 || selectedGenres.includes(genre) ? handleGenreToggle(genre) : null}
                      >
                        {genre}
                      </Badge>
                    ))}
                  </div>
                  {selectedGenres.length >= 5 && isEditing && (
                    <p className="text-xs text-yellow-400 mt-2">
                      Maximum 5 genres selected. Remove one to add another.
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card className="bg-gray-800/50 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Social Links</CardTitle>
                  <CardDescription className="text-gray-400">
                    Connect your social media and streaming profiles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="spotify" className="text-gray-300">Spotify</Label>
                      <Input
                        id="spotify"
                        value={formData.socialLinks.spotify}
                        onChange={(e) => handleSocialLinkChange('spotify', e.target.value)}
                        placeholder="https://open.spotify.com/artist/..."
                        disabled={!isEditing}
                        className="bg-gray-700/50 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagram" className="text-gray-300">Instagram</Label>
                      <Input
                        id="instagram"
                        value={formData.socialLinks.instagram}
                        onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                        placeholder="https://instagram.com/your_handle"
                        disabled={!isEditing}
                        className="bg-gray-700/50 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="twitter" className="text-gray-300">Twitter</Label>
                      <Input
                        id="twitter"
                        value={formData.socialLinks.twitter}
                        onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                        placeholder="https://twitter.com/your_handle"
                        disabled={!isEditing}
                        className="bg-gray-700/50 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="youtube" className="text-gray-300">YouTube</Label>
                      <Input
                        id="youtube"
                        value={formData.socialLinks.youtube}
                        onChange={(e) => handleSocialLinkChange('youtube', e.target.value)}
                        placeholder="https://youtube.com/c/your_channel"
                        disabled={!isEditing}
                        className="bg-gray-700/50 border-gray-600 text-white"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-gray-300">Official Website</Label>
                    <Input
                      id="website"
                      value={formData.socialLinks.website}
                      onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                      placeholder="https://your-official-website.com"
                      disabled={!isEditing}
                      className="bg-gray-700/50 border-gray-600 text-white"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ArtistProfileManager; 