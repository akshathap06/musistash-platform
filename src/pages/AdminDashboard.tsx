import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Eye, User, Music, CheckCircle, XCircle } from "lucide-react";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/hooks/useAuth';
import { artistProfileService, ArtistProfile } from '@/services/artistProfileService';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<ArtistProfile[]>([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user && user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    loadProfiles();
  }, [user, isAuthenticated, isLoading, navigate]);

  const loadProfiles = () => {
    setIsLoadingProfiles(true);
    try {
      const allProfiles = artistProfileService.getAllProfiles();
      const profilesArray = Object.values(allProfiles);
      setProfiles(profilesArray);
    } catch (error) {
      console.error('Error loading profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load artist profiles",
        variant: "destructive"
      });
    } finally {
      setIsLoadingProfiles(false);
    }
  };

  const handleDeleteProfile = async (profileId: string, artistName: string) => {
    if (!confirm(`Are you sure you want to delete the profile for "${artistName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const success = artistProfileService.deleteProfile(profileId);
      
      if (success) {
        // Reload profiles
        loadProfiles();
        
        toast({
          title: "Success",
          description: `Profile for "${artistName}" has been deleted`,
        });
      } else {
        throw new Error('Profile not found');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast({
        title: "Error",
        description: "Failed to delete profile",
        variant: "destructive"
      });
    }
  };

  const handleApproveProfile = async (profileId: string, artistName: string) => {
    if (!confirm(`Are you sure you want to approve the profile for "${artistName}"?`)) {
      return;
    }

    try {
      const approvedProfile = artistProfileService.approveProfile(profileId, user!.id);
      
      if (approvedProfile) {
        // Reload profiles
        loadProfiles();
        
        toast({
          title: "Success",
          description: `Profile for "${artistName}" has been approved`,
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

  const handleRejectProfile = async (profileId: string, artistName: string) => {
    if (!confirm(`Are you sure you want to reject the profile for "${artistName}"?`)) {
      return;
    }

    try {
      const rejectedProfile = artistProfileService.rejectProfile(profileId, user!.id);
      
      if (rejectedProfile) {
        // Reload profiles
        loadProfiles();
        
        toast({
          title: "Success",
          description: `Profile for "${artistName}" has been rejected`,
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

  const handleViewProfile = (profileId: string) => {
    navigate(`/admin/profile/${profileId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white animate-bounce" />
          </div>
          <div className="text-xl font-semibold mb-2 text-white">Loading Admin Dashboard</div>
          <div className="text-gray-300">Please wait...</div>
        </div>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-500 to-purple-600 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="text-xl font-semibold mb-2 text-white">Access Denied</div>
          <div className="text-gray-300">You don't have permission to access this page.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-1 pt-20">
        <div className="container mx-auto py-8 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage artist profiles and platform content</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-300">
                      Total Artist Profiles
                    </CardTitle>
                    <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Music className="w-4 h-4 text-blue-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{profiles.length}</div>
                  <p className="text-xs text-gray-400 mt-1">Active profiles on platform</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-300">
                      Verified Artists
                    </CardTitle>
                    <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-green-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {profiles.filter(p => p.isVerified).length}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Verified artist accounts</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 border-gray-700/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-gray-300">
                      Recent Activity
                    </CardTitle>
                    <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <Eye className="w-4 h-4 text-purple-400" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">
                    {profiles.filter(p => {
                      const createdAt = new Date(p.createdAt);
                      const weekAgo = new Date();
                      weekAgo.setDate(weekAgo.getDate() - 7);
                      return createdAt > weekAgo;
                    }).length}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">New profiles this week</p>
                </CardContent>
              </Card>
            </div>

            {/* Artist Profiles Table */}
            <Card className="bg-gray-800/50 border-gray-700/50">
              <CardHeader>
                <CardTitle>Artist Profiles</CardTitle>
                <CardDescription>Manage all artist profiles on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingProfiles ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : profiles.length === 0 ? (
                  <div className="text-center py-8">
                    <Music className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-400">No artist profiles found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Artist</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Genre</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Location</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Created</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-300">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {profiles.map((profile) => (
                          <tr key={profile.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                            <td className="py-3 px-4">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={profile.profilePhoto}
                                  alt={profile.artistName}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                                <div>
                                  <div className="font-medium text-white">{profile.artistName}</div>
                                  <div className="text-sm text-gray-400">{profile.email}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex flex-wrap gap-1">
                                {profile.genre.map((g, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {g}
                                  </Badge>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-300">{profile.location}</td>
                            <td className="py-3 px-4">
                              <Badge 
                                variant={
                                  profile.status === 'approved' ? "default" : 
                                  profile.status === 'pending' ? "secondary" : "destructive"
                                }
                                className={
                                  profile.status === 'approved' ? "bg-green-500/20 text-green-300" :
                                  profile.status === 'pending' ? "bg-yellow-500/20 text-yellow-300" :
                                  "bg-red-500/20 text-red-300"
                                }
                              >
                                {profile.status === 'approved' ? "Approved" : 
                                 profile.status === 'pending' ? "Pending" : "Rejected"}
                              </Badge>
                            </td>
                            <td className="py-3 px-4 text-gray-300">
                              {new Date(profile.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleViewProfile(profile.id)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                
                                {profile.status === 'pending' && (
                                  <>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleApproveProfile(profile.id, profile.artistName)}
                                      className="h-8 w-8 p-0 text-green-400 hover:text-green-300 hover:bg-green-500/20"
                                    >
                                      <CheckCircle className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleRejectProfile(profile.id, profile.artistName)}
                                      className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteProfile(profile.id, profile.artistName)}
                                  className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-500/20"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard; 