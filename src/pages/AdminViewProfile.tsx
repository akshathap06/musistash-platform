import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { artistProfileService, ArtistProfile } from '@/services/artistProfileService';
import { useToast } from '@/hooks/use-toast';

const AdminViewProfile = () => {
  const { profileId } = useParams<{ profileId: string }>();
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

    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    if (profileId) {
      loadProfile();
    }
  }, [profileId, user, isAuthenticated, isLoading, navigate]);

  const loadProfile = () => {
    setIsLoadingProfile(true);
    try {
      const profileData = artistProfileService.getProfileById(profileId!);
      setProfile(profileData);
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

  const handleApprove = async () => {
    if (!profile || !user) return;

    if (!confirm(`Are you sure you want to approve the profile for "${profile.artistName}"?`)) {
      return;
    }

    try {
      const approvedProfile = artistProfileService.approveProfile(profile.id, user.id);
      
      if (approvedProfile) {
        setProfile(approvedProfile);
        toast({
          title: "Success",
          description: `Profile for "${profile.artistName}" has been approved`,
        });
      } else {
        throw new Error('Profile not found');
      }
    } catch (error) {
      console.error('Error approving profile:', error);
      toast({
        title: "Error",
        description: "Failed to approve profile",
        variant: "destructive"
      });
    }
  };

  const handleReject = async () => {
    if (!profile || !user) return;

    if (!confirm(`Are you sure you want to reject the profile for "${profile.artistName}"?`)) {
      return;
    }

    try {
      const rejectedProfile = artistProfileService.rejectProfile(profile.id, user.id);
      
      if (rejectedProfile) {
        setProfile(rejectedProfile);
        toast({
          title: "Success",
          description: `Profile for "${profile.artistName}" has been rejected`,
        });
      } else {
        throw new Error('Profile not found');
      }
    } catch (error) {
      console.error('Error rejecting profile:', error);
      toast({
        title: "Error",
        description: "Failed to reject profile",
        variant: "destructive"
      });
    }
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

  if (isLoading || isLoadingProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-purple-600 rounded-full flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-white animate-bounce" />
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
              <CardTitle>Profile Not Found</CardTitle>
              <CardDescription>
                The requested artist profile could not be found.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={() => navigate('/admin')} className="w-full">
                Back to Admin Dashboard
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
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/admin')}
                    className="flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Admin
                  </Button>
                  <div>
                    <h1 className="text-3xl font-bold mb-2">Review Artist Profile</h1>
                    <p className="text-muted-foreground">Review and approve/reject artist profile submission</p>
                  </div>
                </div>
                {getStatusBadge(profile.status)}
              </div>
            </div>

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
                    <label className="text-sm font-medium text-gray-300">Email</label>
                    <p className="text-white">{profile.email}</p>
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
                    <p className="text-white">{profile.bio || 'No biography provided'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Image */}
              <Card>
                <CardHeader>
                  <CardTitle>Profile Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <img
                      src={profile.profilePhoto}
                      alt={profile.artistName}
                      className="w-32 h-32 object-cover rounded-full mx-auto"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Social Media Links */}
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
            {profile.status === 'pending' && (
              <div className="flex gap-4 mt-8 justify-center">
                <Button 
                  onClick={handleReject}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Profile
                </Button>
                <Button 
                  onClick={handleApprove}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve Profile
                </Button>
              </div>
            )}

            {/* Profile Metadata */}
            <Card className="mt-8 bg-white/10 border-gray-600/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Profile Metadata</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3 text-sm">
                  <div>
                    <label className="text-gray-300 font-medium">Created</label>
                    <p className="text-white mt-1">{new Date(profile.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-gray-300 font-medium">Last Updated</label>
                    <p className="text-white mt-1">{new Date(profile.updatedAt).toLocaleDateString()}</p>
                  </div>
                  {profile.approvedAt && (
                    <div>
                      <label className="text-gray-300 font-medium">Approved</label>
                      <p className="text-white mt-1">{new Date(profile.approvedAt).toLocaleDateString()}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminViewProfile; 