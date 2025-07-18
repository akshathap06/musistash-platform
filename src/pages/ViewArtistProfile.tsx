import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { artistProfileService, ArtistProfile } from '@/services/artistProfileService';
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

  const loadProfile = () => {
    setIsLoadingProfile(true);
    try {
      const userProfile = artistProfileService.getProfileByUserId(user!.id);
      setProfile(userProfile);
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive"
      });
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
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-12 px-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <CardTitle>No Artist Profile Found</CardTitle>
              <CardDescription>
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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-1 pt-20">
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-2">My Artist Profile</h1>
                  <p className="text-muted-foreground">Manage your artist profile and track approval status</p>
                </div>
                <Button onClick={handleEditProfile} variant="outline">
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
                {profile.status === 'approved' && profile.approvedAt && (
                  <div className="mt-4 text-sm text-gray-400">
                    Approved on: {new Date(profile.approvedAt).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Profile Details */}
            <div className="grid gap-6 md:grid-cols-2">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-300">Artist Name</label>
                    <p className="text-white">{profile.artistName}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300">Genre</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profile.genre.map((g, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {g}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300">Location</label>
                    <p className="text-white">{profile.location}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-300">Biography</label>
                    <p className="text-white mt-1">{profile.bio}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <img
                      src={profile.profilePhoto}
                      alt={profile.artistName}
                      className="w-32 h-32 object-cover rounded-full"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Social Media Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {profile.socialLinks.spotify && (
                      <div>
                        <label className="text-sm font-medium text-gray-300">Spotify</label>
                        <p className="text-blue-400 break-all">{profile.socialLinks.spotify}</p>
                      </div>
                    )}
                    
                    {profile.socialLinks.instagram && (
                      <div>
                        <label className="text-sm font-medium text-gray-300">Instagram</label>
                        <p className="text-blue-400 break-all">{profile.socialLinks.instagram}</p>
                      </div>
                    )}
                    
                    {profile.socialLinks.twitter && (
                      <div>
                        <label className="text-sm font-medium text-gray-300">Twitter/X</label>
                        <p className="text-blue-400 break-all">{profile.socialLinks.twitter}</p>
                      </div>
                    )}
                    
                    {profile.socialLinks.youtube && (
                      <div>
                        <label className="text-sm font-medium text-gray-300">YouTube</label>
                        <p className="text-blue-400 break-all">{profile.socialLinks.youtube}</p>
                      </div>
                    )}
                    
                    {profile.socialLinks.website && (
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-300">Website</label>
                        <p className="text-blue-400 break-all">{profile.socialLinks.website}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8 justify-center">
              <Button onClick={handleEditProfile} className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
              
              {profile.status === 'approved' && (
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/artist/${profile.id}`)}
                  className="flex items-center gap-2"
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