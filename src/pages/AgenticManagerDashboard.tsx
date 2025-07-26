// /agentic-manager
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, Music, TrendingUp, Users, Zap, Volume2, ArrowLeft, Home, Target, MessageSquare, MapPin, Mail } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";

import { CircularProgress } from "@/components/ui/AIRecommendationTool";
import { MetricBar } from "@/components/ui/AIRecommendationTool";
import { BACKEND_URL } from "@/config/api";
import { createClient } from '@supabase/supabase-js';
import { supabase } from "@/lib/supabase";
import PyAudioAnalysisDisplay from "@/components/ui/PyAudioAnalysisDisplay";
import { favoriteVenuesService } from "@/services/favoriteVenuesService";
import GeminiInsightsDisplay from "@/components/ui/GeminiInsightsDisplay";
import CompleteAnalysisDisplay from "@/components/ui/CompleteAnalysisDisplay";
import SimilarArtistsDisplay from "@/components/ui/SimilarArtistsDisplay";
import TargetVenuesDisplay from "@/components/ui/TargetVenuesDisplay";
import EmailPitchAssistant from "@/components/ui/EmailPitchAssistant";
// Temporarily removed useAuth import - using UUID generation instead

const TABS = [
  { key: "summary", label: "Weekly Strategy Summary" },
  { key: "audio", label: "MP3 Audio Analysis" },
  { key: "campaign", label: "Funding & Campaign Recommendation" },
  { key: "fan", label: "Fan Analytics" },
  { key: "venues", label: "Target Venues" },
  { key: "email", label: "Email Pitch Assistant" },
];

// Utility to round and beautify numbers
const formatNumber = (num, decimals = 2) => {
  if (typeof num !== 'number' || isNaN(num)) return 'N/A';
  return Number(num).toFixed(decimals);
};

// Generate detailed actionable insights (stub for Gemini, can be replaced with API call)
const generateActionableInsights = (analysis, similarArtist) => {
  const insights = [];
  if (!analysis) return insights;
  if (analysis.energy < 0.5) {
    insights.push('Increase the energy of your track to match top commercial songs in your genre.');
  } else {
    insights.push('Your track has good energy for commercial appeal.');
  }
  if (analysis.loudness && analysis.loudness < -10) {
    insights.push('Consider mastering your track to increase loudness for streaming platforms.');
  }
  if (analysis.valence < 0.3) {
    insights.push('Try to add more positive or uplifting elements to increase valence.');
  }
  if (similarArtist) {
    insights.push(`Compare your track to ${similarArtist.artist.name} for arrangement and mixing ideas.`);
  }
  return insights;
};

const AgenticManagerDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  // Generate a proper UUID for artist_id to fix the database UUID validation error
  const [activeTab, setActiveTab] = useState("audio");
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  
  // Email Assistant state for venue integration
  const [emailAssistantData, setEmailAssistantData] = useState<any>(null);
  
  // Venue search state - moved from TargetVenuesDisplay for persistence
  const [venues, setVenues] = useState<any[]>([]);
  const [favoriteVenues, setFavoriteVenues] = useState<any[]>([]);
  const [venuesLoading, setVenuesLoading] = useState(false);
  const [venuesError, setVenuesError] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState({
    location: '',
    venueTypes: 'all',
    artistGenre: '',
    capacityRange: 'any'
  });
  
  // MP3 Analysis State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [analysisError, setAnalysisError] = useState("");
  
  const [onboardingData, setOnboardingData] = useState({
    location: "",
    instagram_handle: "",
    twitter_handle: "",
    youtube_channel: "",
    genre: "",
    career_stage: "",
    goals: ""
  });

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedReports, setSavedReports] = useState<any[]>([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [fetchReportsLoading, setFetchReportsLoading] = useState(false);
  const [fetchReportsError, setFetchReportsError] = useState<string | null>(null);
  const [artistProfile, setArtistProfile] = useState<any>(null);

  // Generate a consistent UUID that persists across page loads
  const getArtistId = () => {
    if (user && user.id) {
      // Optionally, store in localStorage for consistency
      localStorage.setItem('musistash_artist_id', user.id);
      return user.id;
    }
    // Fallback to UUID for anonymous/legacy users
    let artistId = localStorage.getItem('musistash_artist_id');
    if (!artistId) {
      artistId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
      localStorage.setItem('musistash_artist_id', artistId);
    }
    return artistId;
  };
  const ARTIST_ID = getArtistId();

  // Use only the imported supabase from @/lib/supabase

  // Fetch saved reports for the user
  const fetchSavedReports = async () => {
    setFetchReportsLoading(true);
    setFetchReportsError(null);
    try {
      const artistId = getArtistId();
      const { data, error } = await supabase
        .from("uploaded_tracks")
        .select("*")
        .eq("artist_id", artistId)
        .eq("is_saved", true)  // Only get saved reports
        .order("updated_at", { ascending: false });
      if (error) throw error;
      setSavedReports(data || []);
      setFetchReportsLoading(false);
    } catch (err: any) {
      setFetchReportsError(err.message || "Failed to fetch reports");
      setFetchReportsLoading(false);
    }
  };

  // Check if user has completed onboarding
  const checkOnboardingStatus = async () => {
    try {
      const artistId = getArtistId();
      const response = await fetch(`${BACKEND_URL}/api/agent/profile/${artistId}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result.status === "success" && result.has_profile) {
          setHasCompletedOnboarding(true);
          // Also populate the form with existing data if needed
          if (result.data) {
            setOnboardingData({
              location: result.data.location || "",
              instagram_handle: result.data.instagram_handle || "",
              twitter_handle: result.data.twitter_handle || "",
              youtube_channel: result.data.youtube_channel || "",
              genre: result.data.genre || "",
              career_stage: result.data.career_stage || "",
              goals: result.data.goals || ""
            });
          }
        }
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      // If there's an error, we'll assume onboarding is not completed
      setHasCompletedOnboarding(false);
    }
  };

  // Load last analysis and fetch saved reports on mount
  const loadLastAnalysis = async () => {
    try {
      const artistId = getArtistId();
      const response = await fetch(`${BACKEND_URL}/api/agent/last-analysis/${artistId}`);
      const result = await response.json();
      
      if (result.status === 'success' && result.has_analysis) {
        // Set the analysis results to display
        const analysisData = result.analysis;
        const flattenedResults = {
          ...analysisData.complete_analysis.basic_info,
          ...analysisData.complete_analysis.commercial_analysis,
          ...analysisData.complete_analysis.similarity_analysis,
          ...analysisData.complete_analysis.resonance_prediction,
          ...analysisData.complete_analysis.enhanced_features,
          gemini_insights: analysisData.gemini_insights || {},
          is_saved: analysisData.is_saved,
          analysis_id: analysisData.id
        };
        setAnalysisResults(flattenedResults);
      }
    } catch (error) {
      console.error('Error loading last analysis:', error);
    }
  };

  // Call fetchSavedReports, check onboarding status, and load last analysis on mount
  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchSavedReports(),
        checkOnboardingStatus(),
        loadLastAnalysis()
      ]);
      setIsLoading(false);
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleOnboardingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const dataToSend = {
        ...onboardingData,
        artist_id: ARTIST_ID
      };

      console.log('Sending onboarding data:', dataToSend);

      // Use PUT for updates, POST for new submissions
      const method = isEditingProfile ? "PUT" : "POST";
      const url = isEditingProfile 
        ? `http://localhost:8000/api/agent/profile/${ARTIST_ID}`
        : "http://localhost:8000/api/agent/onboarding";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      console.log('Onboarding response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Onboarding error response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('Onboarding result:', result);

      if (result.status === "success") {
        setHasCompletedOnboarding(true);
        setIsEditingProfile(false);
        // Show success message briefly
        setError(""); // Clear any previous errors
        // You could add a toast notification here if you have a toast system
      } else {
        setError(result.detail || "Failed to save onboarding data. Please try again.");
      }
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      setError(`An error occurred: ${error.message}. Please check if the backend server is running on port 8000.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setOnboardingData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (file: File) => {
    // More flexible file type checking
    const isAudioFile = file.type.includes('audio/') || 
                       file.name.toLowerCase().endsWith('.mp3') || 
                       file.name.toLowerCase().endsWith('.wav') || 
                       file.name.toLowerCase().endsWith('.m4a');
    
    if (!isAudioFile) {
      setAnalysisError("Please upload an audio file (MP3, WAV, or M4A).");
      return;
    }

    if (file.size > 20 * 1024 * 1024) { // 20MB limit
      setAnalysisError("File size must be under 20MB.");
      return;
    }

    setUploadedFile(file);
    setAnalysisError("");
    setIsAnalyzing(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('artist_id', ARTIST_ID);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch(`${BACKEND_URL}/api/agent/upload-track`, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();
      console.log('Backend response:', result);

      if (result.status === 'success') {
        // Flatten the nested metadata structure for easier access
        const flattenedResults = {
          ...result.metadata.basic_info,
          ...result.metadata.commercial_analysis,
          ...result.metadata.similarity_analysis,
          ...result.metadata.resonance_prediction,
          ...result.metadata.enhanced_features,
          gemini_insights: result.analysis?.ai_insights || {}
        };
        console.log('Flattened results:', flattenedResults);
        setAnalysisResults(flattenedResults);
      } else {
        setAnalysisError('Failed to analyze the audio file.');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setAnalysisError('An error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleSaveAnalysis = async () => {
    if (!analysisResults) return;
    setSaveLoading(true);
    setSaveError(null);
    try {
      const artistId = getArtistId();
      
      // Use the new save analysis endpoint
      const response = await fetch(`${BACKEND_URL}/api/agent/save-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `artist_id=${encodeURIComponent(artistId)}`,
      });
      
      const result = await response.json();
      
      if (result.status === 'success') {
        // Update the local state to reflect that it's now saved
        setAnalysisResults(prev => prev ? { ...prev, is_saved: true } : null);
        // Refetch reports after save
        fetchSavedReports();
      } else {
        throw new Error(result.message || 'Failed to save analysis');
      }
    } catch (err: any) {
      setSaveError(err.message || 'Failed to save analysis.');
    } finally {
      setSaveLoading(false);
    }
  };

  // Function to switch to email assistant with venue data
  const handleVenueEmailClick = (venue: any) => {
    setEmailAssistantData({
      template: 'venue-booking',
      venueData: venue
    });
    setActiveTab('email');
  };

  // Venue management functions
  const handleSearchParamsChange = (params: any) => {
    setSearchParams(params);
  };

  const handleDiscoverVenues = async () => {
    if (!searchParams.location.trim()) {
      setVenuesError('Please enter a location to search for venues');
      return;
    }

    setVenuesLoading(true);
    setVenuesError(null);

    try {
      console.log('🔍 Discovering venues for:', searchParams.location);
      
      const formData = new FormData();
      formData.append('location', searchParams.location);
      formData.append('venue_types', searchParams.venueTypes === 'all' ? '' : searchParams.venueTypes);
      formData.append('artist_genre', searchParams.artistGenre);
      formData.append('capacity_range', searchParams.capacityRange === 'any' ? '' : searchParams.capacityRange);

      const response = await fetch(`${BACKEND_URL}/api/agent/discover-venues`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', errorText);
        throw new Error(`Failed to discover venues: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.status === 'success') {
        setVenues(data.venues || []);
        if (data.venues?.length === 0) {
          setVenuesError('No venues found for the specified location and criteria');
        }
      } else {
        throw new Error(data.detail || 'Failed to discover venues');
      }
    } catch (err) {
      console.error('❌ Error discovering venues:', err);
      setVenuesError(err instanceof Error ? err.message : 'Failed to discover venues');
    } finally {
      setVenuesLoading(false);
    }
  };

  const handleToggleFavorite = async (venue: any) => {
    console.log('🎯 handleToggleFavorite called with venue:', venue.name);
    console.log('👤 Current user:', user);
    
    if (!user?.id) {
      console.log('❌ No user ID found, cannot favorite venue');
      return;
    }

    try {
      console.log('✅ User authenticated, proceeding with favorite toggle');
      
      const venueData = {
        id: venue.id,
        name: venue.name,
        address: venue.address,
        phone: venue.phone,
        website: venue.website,
        rating: venue.rating,
        total_ratings: venue.total_ratings,
        types: venue.types,
        location: venue.location,
        estimated_capacity: venue.estimated_capacity,
        booking_difficulty: venue.booking_difficulty,
        genre_suitability: venue.genre_suitability,
        booking_approach: venue.booking_approach,
        description: venue.description,
        booking_requirements: venue.booking_requirements,
        amenities: venue.amenities
      };

      console.log('📦 Venue data prepared:', venueData);
      const isFavorited = await favoriteVenuesService.toggleFavoriteVenue(user.id, venueData);
      console.log('🔄 Favorite toggle result:', isFavorited);
      
      if (isFavorited) {
        // Add to favorites list
        setFavoriteVenues(prev => [venue, ...prev]);
        console.log('❤️ Added to favorites list');
      } else {
        // Remove from favorites list
        setFavoriteVenues(prev => prev.filter(v => v.id !== venue.id));
        console.log('🗑️ Removed from favorites list');
      }
    } catch (error) {
      console.error('❌ Error toggling favorite:', error);
    }
  };

  // Load favorite venues on component mount
  React.useEffect(() => {
    console.log('🔍 Checking user authentication for favorites...');
    console.log('👤 User object:', user);
    console.log('🆔 User ID:', user?.id);
    
    if (user?.id) {
      console.log('✅ User authenticated, loading favorite venues...');
      loadFavoriteVenues();
    } else {
      console.log('❌ No user ID found, cannot load favorites');
    }
  }, [user?.id]);

  const loadFavoriteVenues = async () => {
    if (!user?.id) return;
    
    try {
      const favorites = await favoriteVenuesService.getFavoriteVenues(user.id);
      const favoriteVenuesList = favorites.map(fav => ({
        id: fav.venue_id,
        name: fav.venue_name,
        address: fav.venue_address || '',
        phone: fav.venue_phone || '',
        website: fav.venue_website || '',
        rating: fav.venue_rating || 0,
        total_ratings: fav.venue_total_ratings || 0,
        types: fav.venue_types || [],
        location: fav.venue_location || '',
        estimated_capacity: fav.venue_estimated_capacity || '',
        booking_difficulty: fav.venue_booking_difficulty as 'easy' | 'medium' | 'hard' || 'medium',
        genre_suitability: fav.venue_genre_suitability,
        booking_approach: fav.venue_booking_approach,
        description: fav.venue_description,
        booking_requirements: fav.venue_booking_requirements || [],
        amenities: fav.venue_amenities || []
      }));
      setFavoriteVenues(favoriteVenuesList);
    } catch (error) {
      console.error('Error loading favorite venues:', error);
    }
  };

  // Show loading screen while checking onboarding status
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0f1216] pt-16">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading your profile...</p>
          </div>
        </main>
      </div>
    );
  }

  // Show onboarding screen if not completed
  if (!hasCompletedOnboarding) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0f1216] pt-16">
        <Navbar />
        <main className="flex-grow max-w-2xl mx-auto w-full px-4 md:px-8 pt-6 pb-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {isEditingProfile ? "Edit Your Profile" : "Welcome to Agentic Manager"}
            </h1>
            <p className="text-xl text-gray-300">
              {isEditingProfile 
                ? "Update your artist management profile information."
                : "Let's get your AI-powered artist management set up with some basic information."
              }
            </p>
          </div>

          <form onSubmit={handleOnboardingSubmit} className="bg-[#181c24] rounded-xl shadow-xl p-6 md:p-8 space-y-6">
            {error && (
              <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="location" className="text-white">Location / Top City</Label>
                <Input
                  id="location"
                  value={onboardingData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="e.g., Los Angeles, CA"
                  className="bg-[#0f1216] border-gray-700 text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="instagram" className="text-white">Instagram Handle</Label>
                  <Input
                    id="instagram"
                    value={onboardingData.instagram_handle}
                    onChange={(e) => handleInputChange("instagram_handle", e.target.value)}
                    placeholder="@yourusername"
                    className="bg-[#0f1216] border-gray-700 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="twitter" className="text-white">Twitter Handle</Label>
                  <Input
                    id="twitter"
                    value={onboardingData.twitter_handle}
                    onChange={(e) => handleInputChange("twitter_handle", e.target.value)}
                    placeholder="@yourusername"
                    className="bg-[#0f1216] border-gray-700 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="youtube" className="text-white">YouTube Channel</Label>
                <Input
                  id="youtube"
                  value={onboardingData.youtube_channel}
                  onChange={(e) => handleInputChange("youtube_channel", e.target.value)}
                  placeholder="Channel name or URL"
                  className="bg-[#0f1216] border-gray-700 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="genre" className="text-white">Primary Genre</Label>
                  <Select onValueChange={(value) => handleInputChange("genre", value)}>
                    <SelectTrigger className="bg-[#0f1216] border-gray-700 text-white">
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hip-hop">Hip-Hop</SelectItem>
                      <SelectItem value="pop">Pop</SelectItem>
                      <SelectItem value="rock">Rock</SelectItem>
                      <SelectItem value="r&b">R&B</SelectItem>
                      <SelectItem value="electronic">Electronic</SelectItem>
                      <SelectItem value="indie">Indie</SelectItem>
                      <SelectItem value="country">Country</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="career_stage" className="text-white">Career Stage</Label>
                  <Select onValueChange={(value) => handleInputChange("career_stage", value)}>
                    <SelectTrigger className="bg-[#0f1216] border-gray-700 text-white">
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="emerging">Emerging (0-1K followers)</SelectItem>
                      <SelectItem value="developing">Developing (1K-10K followers)</SelectItem>
                      <SelectItem value="established">Established (10K-100K followers)</SelectItem>
                      <SelectItem value="mainstream">Mainstream (100K+ followers)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="goals" className="text-white">Primary Goals</Label>
                <Textarea
                  id="goals"
                  value={onboardingData.goals}
                  onChange={(e) => handleInputChange("goals", e.target.value)}
                  placeholder="e.g., Increase streaming numbers, book more venues, grow social media following..."
                  className="bg-[#0f1216] border-gray-700 text-white"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-4">
              {isEditingProfile && (
                <Button 
                  type="button"
                  onClick={() => {
                    setIsEditingProfile(false);
                    setHasCompletedOnboarding(true);
                  }}
                  variant="outline"
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
              )}
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className={`${isEditingProfile ? 'flex-1' : 'w-full'} bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-lg py-3 disabled:opacity-50`}
              >
                {isSubmitting 
                  ? (isEditingProfile ? "Updating..." : "Setting up...") 
                  : (isEditingProfile ? "Update Profile" : "Complete Setup & Enter Agentic Manager")
                }
              </Button>
            </div>
          </form>
        </main>
        <Footer />
      </div>
    );
  }

  // Main dashboard with improved styling and tabs
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#0f1216] via-[#1a1d26] to-[#0f1216] pt-16">
      <Navbar />
      
      {/* Header with Back Button */}
      <div className="bg-[#181c24] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/dashboard')}
                variant="ghost"
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-gray-700"></div>
              <div>
                <h1 className="text-2xl font-bold text-white">Agentic Manager</h1>
                <p className="text-gray-400 text-sm">AI-Powered Artist Management</p>
              </div>
            </div>
            <Button
              onClick={() => {
                setIsEditingProfile(true);
                setHasCompletedOnboarding(false);
              }}
              variant="outline"
              className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-6">
        {/* Enhanced Tabs */}
        <div className="mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[#0f1216] border border-gray-800">
              <TabsTrigger 
                value="audio" 
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Music className="w-4 h-4" />
                MP3 Analysis
              </TabsTrigger>
              <TabsTrigger 
                value="venues" 
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <Target className="w-4 h-4" />
                Target Venues
              </TabsTrigger>
              <TabsTrigger 
                value="email" 
                className="flex items-center gap-2 data-[state=active]:bg-purple-600 data-[state=active]:text-white"
              >
                <MessageSquare className="w-4 h-4" />
                Email Assistant
              </TabsTrigger>
            </TabsList>

            {/* MP3 Analysis Tab */}
            <TabsContent value="audio" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">MP3 Audio Analysis</h2>
                <p className="text-lg text-gray-300">
                  Upload your latest track and get instant AI-powered insights
                </p>
              </div>

              {/* File Upload Area */}
              <Card className="bg-[#0f1216] border-2 border-dashed border-gray-600 hover:border-purple-500 transition-colors">
                <CardContent className="p-8">
                  <div 
                    className="text-center cursor-pointer"
                    onDrop={handleFileDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    <input
                      id="file-input"
                      type="file"
                      accept=".mp3,audio/mpeg"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Upload className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {uploadedFile ? uploadedFile.name : "Drop your MP3 file here"}
                    </h3>
                    <p className="text-gray-400">or click to browse (Max 20MB)</p>
                  </div>
                </CardContent>
              </Card>

              {/* Upload Progress */}
              {isAnalyzing && (
                <Card className="bg-[#0f1216] border border-gray-700">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">Analyzing audio...</span>
                        <span className="text-purple-400 font-semibold">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="w-full" />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Analysis Error */}
              {analysisError && (
                <Card className="bg-red-900/20 border border-red-500">
                  <CardContent className="p-4">
                    <div className="text-red-400">{analysisError}</div>
                  </CardContent>
                </Card>
              )}

              {/* Complete Analysis Display */}
              {analysisResults && (
                <div className="space-y-6">
                  <CompleteAnalysisDisplay 
                    analysis={analysisResults} 
                    isSaved={analysisResults.is_saved}
                  />
                  
                  {/* Save Analysis Button - only show if not saved */}
                  {!analysisResults.is_saved && (
                    <div className="flex justify-end">
                      <Button
                        onClick={handleSaveAnalysis}
                        disabled={saveLoading}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
                      >
                        {saveLoading ? 'Saving...' : 'Save Analysis'}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Saved Reports Section */}
              <Card className="bg-[#181c24] border border-purple-700">
                <CardHeader>
                  <CardTitle className="text-purple-300">Saved Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  {fetchReportsLoading ? (
                    <div className="text-gray-400">Loading reports...</div>
                  ) : fetchReportsError ? (
                    <div className="text-red-500">{fetchReportsError}</div>
                  ) : savedReports.length === 0 ? (
                    <div className="text-gray-400">No saved reports yet.</div>
                  ) : (
                    <ul className="divide-y divide-purple-900/40">
                      {savedReports.map((report, idx) => (
                        <li key={report.id || idx} className="py-4">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                            <div>
                              <span className="font-semibold text-white">
                                {report.complete_analysis_json?.basic_info?.filename || `Track Analysis #${report.id?.slice(-8)}`}
                              </span>
                              <span className="text-gray-400 ml-2">
                                {report.updated_at ? new Date(report.updated_at).toLocaleString() : 
                                 report.created_at ? new Date(report.created_at).toLocaleString() : 
                                 'Recent'}
                              </span>
                            </div>
                            <div className="flex gap-4 mt-2 md:mt-0">
                              <Badge variant="outline" className="text-blue-400 border-blue-400">BPM: {report.pyaudio_bpm ?? report.bpm ?? 'N/A'}</Badge>
                              <Badge variant="outline" className="text-green-400 border-green-400">Energy: {report.pyaudio_energy_mean ?? report.energy ?? 'N/A'}</Badge>
                              <Badge variant="outline" className="text-yellow-400 border-yellow-400">Loudness: {report.pyaudio_loudness ?? report.loudness ?? 'N/A'}</Badge>
                              <Badge variant="outline" className="text-purple-400 border-purple-400">Key: {report.pyaudio_key ?? report.key ?? 'N/A'}</Badge>
                            </div>
                          </div>
                          
                          {/* Show commercial potential if available */}
                          {report.gemini_insights_json?.track_summary?.commercial_potential && (
                            <div className="mt-2">
                              <span className="text-gray-400">Commercial Potential: </span>
                              <span className={`font-semibold ${
                                report.gemini_insights_json.track_summary.commercial_potential.toLowerCase() === 'high' ? 'text-green-400' :
                                report.gemini_insights_json.track_summary.commercial_potential.toLowerCase() === 'medium' ? 'text-yellow-400' :
                                'text-red-400'
                              }`}>
                                {report.gemini_insights_json.track_summary.commercial_potential.toUpperCase()}
                              </span>
                            </div>
                          )}
                          
                          {/* Show top strength if available */}
                          {report.gemini_insights_json?.track_summary?.strengths?.[0] && (
                            <div className="mt-1 text-sm text-gray-300">
                              <span className="text-green-400">✓ </span>
                              {report.gemini_insights_json.track_summary.strengths[0]}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              {/* Similar Artists Section */}
              <SimilarArtistsDisplay 
                geminiInsights={analysisResults?.gemini_insights}
                isLoading={isAnalyzing}
              />
            </TabsContent>

            {/* Target Venues Tab */}
            <TabsContent value="venues" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Target Venues</h2>
                <p className="text-lg text-gray-300">
                  Discover the best venues for your music and get booking recommendations
                </p>
              </div>

              <TargetVenuesDisplay 
                artistProfile={artistProfile} 
                onVenueEmailClick={handleVenueEmailClick}
                venues={venues}
                favoriteVenues={favoriteVenues}
                loading={venuesLoading}
                error={venuesError}
                searchParams={searchParams}
                onSearchParamsChange={handleSearchParamsChange}
                onDiscoverVenues={handleDiscoverVenues}
                onToggleFavorite={handleToggleFavorite}
              />
            </TabsContent>

            {/* Email Pitch Assistant Tab */}
            <TabsContent value="email" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Email Pitch Assistant</h2>
                <p className="text-lg text-gray-300">
                  Generate professional email pitches for venues, promoters, and industry contacts
                </p>
              </div>

              <EmailPitchAssistant 
                artistProfile={artistProfile} 
                initialData={emailAssistantData}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AgenticManagerDashboard; 