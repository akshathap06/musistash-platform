import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { artistProfileService } from '@/services/artistProfileService';
import type { Database } from '@/lib/supabase';

type ArtistProfile = Database['public']['Tables']['artist_profiles']['Row'];
import { useToast } from '@/hooks/use-toast';

const ViewArtistProfile = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ArtistProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user) {
      loadProfile();
    }
  }, [user, isAuthenticated, isLoading, navigate]);

  const loadProfile = async () => {
    setIsLoadingProfile(true);
    try {
      const userProfile = await artistProfileService.getProfileByUserId(user!.id);
      console.log('Loaded profile data:', userProfile);
      if (userProfile) {
        // Ensure genre is always an array
        const safeProfile = {
          ...userProfile,
          genre: Array.isArray(userProfile.genre) ? userProfile.genre : []
        };
        setProfile(safeProfile);
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive"
      });
      setProfile(null);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleEditProfile = () => {
    navigate('/artist-profile');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50">
            <Clock className="w-3 h-3 mr-1" />
            Waiting for Approval
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="default" className="bg-green-500/20 text-green-300 border-green-500/50">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive" className="bg-red-500/20 text-red-300 border-red-500/50">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return null;
    }
  };

  const getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return "Your artist profile is currently under review. Our team will review your submission and get back to you soon.";
      case 'approved':
        return "Congratulations! Your artist profile has been approved and is now visible to the public.";
      case 'rejected':
        return "Your artist profile was not approved. You can edit your profile and submit it again for review.";
      default:
        return "";
    }
  };

  if (isLoading || isLoadingProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Edit className="w-8 h-8 text-white animate-bounce" />
          </div>
          <div className="text-xl font-semibold mb-2 text-white">Loading Profile</div>
          <div className="text-gray-300">Please wait...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-900">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="max-w-md w-full bg-gray-800 border-gray-700">
            <CardHeader className="text-center">
              <CardTitle className="text-white">No Artist Profile Found</CardTitle>
              <CardDescription className="text-gray-400">
                You haven't created an artist profile yet.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={() => navigate('/artist-profile')} className="w-full">
                Create Artist Profile
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Navbar />
      
      <div className="flex-1 pt-20">
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-2 text-white">My Artist Profile</h1>
                  <p className="text-gray-400">Manage your artist profile and track approval status</p>
                </div>
                <Button onClick={handleEditProfile} variant="outline" className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>

            {/* Status Card */}
            <Card className="mb-8 bg-gray-800/50 border-gray-700/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Profile Status</CardTitle>
                  {getStatusBadge(profile.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                  <p className="text-gray-300">{getStatusMessage(profile.status)}</p>
                </div>
                {profile.status === 'approved' && profile.approved_at && (
                  <div className="mt-4 text-sm text-gray-400">
                    Approved on: {new Date(profile.approved_at).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Profile Details */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Basic Information */}
              <Card className="bg-gray-800 border-gray-700 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300">Artist Name</label>
                      <p className="text-white">{profile.artist_name || 'Not specified'}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-300">Location</label>
                      <p className="text-white">{profile.location || 'Not specified'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300">Genre</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Array.isArray(profile.genre) && profile.genre.length > 0 ? profile.genre.map((g, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-blue-600/20 text-blue-300 border-blue-600/50">
                          {g}
                        </Badge>
                      )) : (
                        <span className="text-gray-400">Not specified</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300">Biography</label>
                    <p className="text-white mt-1">{profile.bio || 'Not specified'}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-300">Detailed Biography</label>
                    <p className="text-white mt-1">{profile.biography || 'Not specified'}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300">Musical Style</label>
                      <p className="text-white">{profile.musical_style || 'Not specified'}</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-300">Influences</label>
                      <p className="text-white">{profile.influences || 'Not specified'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Image & Quick Stats */}
              <div className="space-y-6">
                {/* Profile Image */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Profile Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      <img
                        src={profile.profile_photo}
                        alt={profile.artist_name}
                        className="w-24 h-24 object-cover rounded-full"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Monthly Listeners</span>
                      <span className="text-white font-medium">{profile.monthly_listeners?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Total Streams</span>
                      <span className="text-white font-medium">{profile.total_streams?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Success Rate</span>
                      <span className="text-white font-medium">{profile.success_rate ? `${profile.success_rate}%` : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-300">Status</span>
                      <span className={`text-sm font-medium ${
                        profile.status === 'approved' ? 'text-green-400' : 
                        profile.status === 'pending' ? 'text-yellow-400' : 'text-red-400'
                      }`}>
                        {profile.status === 'approved' ? 'Approved' : 
                         profile.status === 'pending' ? 'Pending' : 'Rejected'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Artist Statistics */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Artist Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Spotify Artist ID</label>
                    <p className="text-white">{profile.spotify_artist_id || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300">Verification Status</label>
                    <p className="text-white">{profile.is_verified ? 'Verified' : 'Not verified'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media Links */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Social Media Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.social_links.spotify && (
                      <div>
                        <label className="text-sm font-medium text-gray-300">Spotify</label>
                        <p className="text-blue-400 break-all text-sm">{profile.social_links.spotify}</p>
                      </div>
                    )}
                    
                    {profile.social_links.instagram && (
                      <div>
                        <label className="text-sm font-medium text-gray-300">Instagram</label>
                        <p className="text-blue-400 break-all text-sm">{profile.social_links.instagram}</p>
                      </div>
                    )}
                    
                    {profile.social_links.twitter && (
                      <div>
                        <label className="text-sm font-medium text-gray-300">Twitter/X</label>
                        <p className="text-blue-400 break-all text-sm">{profile.social_links.twitter}</p>
                      </div>
                    )}
                    
                    {profile.social_links.youtube && (
                      <div>
                        <label className="text-sm font-medium text-gray-300">YouTube</label>
                        <p className="text-blue-400 break-all text-sm">{profile.social_links.youtube}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.social_links.website && (
                      <div>
                        <label className="text-sm font-medium text-gray-300">Website</label>
                        <p className="text-blue-400 break-all text-sm">{profile.social_links.website}</p>
                      </div>
                    )}

                    {profile.website_url && (
                      <div>
                        <label className="text-sm font-medium text-gray-300">Website URL</label>
                        <p className="text-blue-400 break-all text-sm">{profile.website_url}</p>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {profile.instagram_handle && (
                      <div>
                        <label className="text-sm font-medium text-gray-300">Instagram Handle</label>
                        <p className="text-white text-sm">@{profile.instagram_handle}</p>
                      </div>
                    )}

                    {profile.twitter_handle && (
                      <div>
                        <label className="text-sm font-medium text-gray-300">Twitter Handle</label>
                        <p className="text-white text-sm">@{profile.twitter_handle}</p>
                      </div>
                    )}

                    {profile.youtube_channel_id && (
                      <div>
                        <label className="text-sm font-medium text-gray-300">YouTube Channel ID</label>
                        <p className="text-white text-sm">{profile.youtube_channel_id}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Spotify Integration */}
              {profile.spotify_profile_url && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Spotify Integration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-300">Spotify Profile URL</label>
                      <p className="text-blue-400 break-all">{profile.spotify_profile_url}</p>
                    </div>
                    
                    {profile.spotify_data && (
                      <div>
                        <label className="text-sm font-medium text-gray-300">Imported Spotify Data</label>
                        <div className="mt-2 p-3 bg-gray-700/50 rounded-lg">
                          <p className="text-sm text-gray-300">
                            Followers: {profile.spotify_data.followers?.toLocaleString() || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-300">
                            Popularity: {profile.spotify_data.popularity || 'N/A'}%
                          </p>
                          <p className="text-sm text-gray-300">
                            Genres: {profile.spotify_data.genres?.slice(0, 3).join(', ') || 'N/A'}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Future Releases */}
              {profile.future_releases && profile.future_releases.length > 0 && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Future Releases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {profile.future_releases.map((release: any, index: number) => (
                        <div key={index} className="p-3 bg-gray-700/50 rounded-lg">
                          <h4 className="font-medium text-white">{release.title}</h4>
                          <p className="text-sm text-gray-300">{release.type} • {release.releaseDate}</p>
                          <p className="text-sm text-gray-400 mt-1">{release.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Career Highlights */}
              {profile.career_highlights && profile.career_highlights.length > 0 && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Career Highlights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {profile.career_highlights.map((highlight: any, index: number) => (
                        <div key={index} className="p-3 bg-gray-700/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-orange-300 bg-orange-900/50 px-2 py-1 rounded">
                              {highlight.year || highlight.date || 'N/A'}
                            </span>
                            <h4 className="font-medium text-white">{highlight.title || highlight.achievement || 'Achievement'}</h4>
                          </div>
                          <p className="text-sm text-gray-300">{highlight.description || highlight.details || 'No description available'}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Spotify Embed URLs */}
              {profile.spotify_embed_urls && profile.spotify_embed_urls.length > 0 && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Spotify Embeds</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {profile.spotify_embed_urls.map((url: string, index: number) => (
                        <div key={index} className="p-3 bg-gray-700/50 rounded-lg">
                          <p className="text-sm text-blue-400 break-all">{url}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Banner Image */}
              {profile.banner_photo && (
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Banner Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-center">
                      <img
                        src={profile.banner_photo}
                        alt="Banner"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 justify-center">
              <Button onClick={handleEditProfile} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
              
              {profile.status === 'approved' && (
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/artist/${profile.id}`)}
                  className="flex items-center gap-2 bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                >
                  View Public Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ViewArtistProfile; 