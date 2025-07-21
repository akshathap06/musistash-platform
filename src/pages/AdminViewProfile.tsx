import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { artistProfileService } from '@/services/artistProfileService';
import type { Database } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

type ArtistProfile = Database['public']['Tables']['artist_profiles']['Row'];

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

  const loadProfile = async () => {
    setIsLoadingProfile(true);
    try {
      const profileData = await artistProfileService.getProfileById(profileId!);
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

    if (!confirm(`Are you sure you want to approve the profile for "${profile.artist_name}"?`)) {
      return;
    }

    try {
      const approvedProfile = await artistProfileService.approveProfile(profile.id, user.id);
      
      if (approvedProfile) {
        setProfile(approvedProfile);
        toast({
          title: "Success",
          description: `Profile for "${profile.artist_name}" has been approved`,
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

    if (!confirm(`Are you sure you want to reject the profile for "${profile.artist_name}"?`)) {
      return;
    }

    try {
      const rejectedProfile = await artistProfileService.rejectProfile(profile.id, user.id);
      
      if (rejectedProfile) {
        setProfile(rejectedProfile);
        toast({
          title: "Success",
          description: `Profile for "${profile.artist_name}" has been rejected`,
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
                <div className="flex items-center space-x-4">
                {getStatusBadge(profile.status)}
                  {profile.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        onClick={handleApprove}
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={handleReject}
                        variant="destructive"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Profile Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info */}
                <Card className="bg-gray-800/50 border-gray-700/50">
                <CardHeader>
                    <CardTitle className="flex items-center space-x-4">
                      <img
                        src={profile.profile_photo}
                        alt={profile.artist_name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                  <div>
                        <div className="text-2xl font-bold">{profile.artist_name}</div>
                        <div className="text-gray-400">{profile.email}</div>
                  </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                  <div>
                      <h3 className="font-semibold mb-3 text-white text-lg">Bio</h3>
                      <p className="text-white leading-relaxed break-words overflow-hidden">{profile.bio || 'No bio provided'}</p>
                  </div>
                  
                  <div>
                      <h3 className="font-semibold mb-3 text-white text-lg">Genre</h3>
                      <div className="flex flex-wrap gap-2">
                      {profile.genre.map((g, index) => (
                          <Badge key={index} variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/50">
                          {g}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                      <h3 className="font-semibold mb-3 text-white text-lg">Location</h3>
                      <p className="text-white">{profile.location || 'No location provided'}</p>
                  </div>
                  
                    {profile.musical_style && (
                      <div>
                        <h3 className="font-semibold mb-3 text-white text-lg">Musical Style</h3>
                        <p className="text-white">{profile.musical_style}</p>
                      </div>
                    )}
                    
                    {profile.influences && (
                      <div>
                        <h3 className="font-semibold mb-3 text-white text-lg">Influences</h3>
                        <p className="text-white">{profile.influences}</p>
                      </div>
                    )}
                    
                    {profile.social_links && Object.keys(profile.social_links).length > 0 && (
                      <div>
                        <h3 className="font-semibold mb-3 text-white text-lg">Social Links</h3>
                        <div className="space-y-3">
                          {Object.entries(profile.social_links).map(([platform, url]) => (
                            <div key={platform} className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg">
                              <span className="text-blue-300 capitalize font-medium min-w-[80px]">{platform}:</span>
                              <a 
                                href={url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 underline break-all"
                              >
                                {url}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Profile Stats */}
                <Card className="bg-gray-800/50 border-gray-700/50">
                                     <CardHeader>
                     <CardTitle className="text-white">Profile Information</CardTitle>
                   </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <div className="text-sm text-blue-300 font-medium mb-1">Created</div>
                      <div className="font-medium text-white text-lg">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-blue-300 font-medium mb-1">Last Updated</div>
                      <div className="font-medium text-white text-lg">
                        {new Date(profile.updated_at).toLocaleDateString()}
                      </div>
                    </div>

                    {profile.approved_at && (
                      <div>
                        <div className="text-sm text-blue-300 font-medium mb-1">Approved</div>
                        <div className="font-medium text-white text-lg">
                          {new Date(profile.approved_at).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                    
                    {profile.approved_by && (
                      <div>
                        <div className="text-sm text-blue-300 font-medium mb-1">Approved By</div>
                        <div className="font-medium text-white text-lg">{profile.approved_by}</div>
                      </div>
                    )}
                </CardContent>
              </Card>

                                 {/* Career Highlights */}
                 {profile.career_highlights && profile.career_highlights.length > 0 && (
                   <Card className="bg-gray-800/50 border-gray-700/50">
              <CardHeader>
                       <CardTitle className="text-white">Career Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                       <div className="space-y-3">
                         {profile.career_highlights.map((highlight, index) => (
                           <div key={index} className="text-white p-3 bg-gray-700/30 rounded-lg">
                             <span className="text-blue-400 mr-2">•</span>
                             {highlight}
                  </div>
                         ))}
                </div>
              </CardContent>
            </Card>
                 )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminViewProfile; 