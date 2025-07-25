// /agentic-manager
import React, { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, Music, TrendingUp, Users, Zap, Volume2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
// Temporarily removed useAuth import - using UUID generation instead

const TABS = [
  { key: "summary", label: "Weekly Strategy Summary" },
  { key: "audio", label: "MP3 Audio Analysis" },
  { key: "campaign", label: "Funding & Campaign Recommendation" },
  { key: "fan", label: "Fan Analytics" },
  { key: "venues", label: "Target Venues" },
  { key: "email", label: "Email Pitch Assistant" },
];

const AgenticManagerDashboard = () => {
  // Generate a proper UUID for artist_id to fix the database UUID validation error
  const [activeTab, setActiveTab] = useState("summary");
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
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

  // Generate a proper UUID format to fix the database validation error
  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const ARTIST_ID = generateUUID();

  // Check if user has completed onboarding
  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        console.log('Checking onboarding status for artist:', ARTIST_ID);
        const response = await fetch(`http://localhost:8000/api/agent/profile/${ARTIST_ID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('Response status:', response.status);
        const data = await response.json();
        console.log('Response data:', data);
        
        if (data.status === "success" && data.has_profile) {
          setHasCompletedOnboarding(true);
        } else {
          setHasCompletedOnboarding(false);
        }
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setHasCompletedOnboarding(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
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

      const response = await fetch("http://localhost:8000/api/agent/onboarding", {
        method: "POST",
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
    if (!file.type.includes('audio/mpeg') && !file.type.includes('audio/mp3')) {
      setAnalysisError("Please upload an MP3 file.");
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

      const response = await fetch('http://localhost:8000/api/agent/upload-track', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      const result = await response.json();

      if (result.status === 'success') {
        setAnalysisResults(result.metadata);
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

  // Show loading screen while checking onboarding status
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0f1216]">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading Agentic Manager...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Show onboarding screen if not completed
  if (!hasCompletedOnboarding) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0f1216]">
        <Navbar />
        <main className="flex-grow max-w-2xl mx-auto w-full px-4 md:px-8 pt-20 pb-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome to Agentic Manager
            </h1>
            <p className="text-xl text-gray-300">
              Let's get your AI-powered artist management set up with some basic information.
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

            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-lg py-3 disabled:opacity-50"
            >
              {isSubmitting ? "Setting up..." : "Complete Setup & Enter Agentic Manager"}
            </Button>
          </form>
        </main>
        <Footer />
      </div>
    );
  }

  // Main dashboard with updated audio tab
  return (
    <div className="min-h-screen flex flex-col bg-[#0f1216]">
      <Navbar />
      <main className="flex-grow max-w-5xl mx-auto w-full px-2 md:px-8 pt-20 pb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-10 text-center">
          Agentic Manager
        </h1>
        {/* Improved Horizontal Tab Navigation */}
        <div className="relative mb-10">
          <div className="overflow-x-auto scrollbar-hide whitespace-nowrap border-b border-gray-800 shadow-sm rounded-t-xl bg-[#151823]">
            <div className="flex flex-row items-center justify-start md:justify-center min-w-max">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  className={`mx-0.5 px-0.5 py-0.5 md:px-1 md:py-0.5 rounded-t-lg font-semibold text-[11px] md:text-xs transition-all duration-200 focus:outline-none whitespace-nowrap
                    ${activeTab === tab.key
                      ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg"
                      : "bg-[#181c24] text-gray-300 hover:bg-gray-800 hover:text-white"}
                  `}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Tab Content */}
        <div className="bg-[#181c24] rounded-xl shadow-xl p-6 md:p-10 min-h-[500px]">
          {activeTab === "summary" && (
            <div>
              <h2 className="text-2xl font-semibold text-blue-400 mb-4">Weekly Strategy Summary</h2>
              <p className="text-gray-300 mb-6">Fan growth, ROI estimate, and top fan city at a glance.</p>
              <Button className="bg-blue-600 text-white">View Details</Button>
            </div>
          )}
          {activeTab === "audio" && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-purple-400 mb-2">MP3 Audio Analysis</h2>
                <p className="text-gray-300">Upload your latest track and get instant AI-powered insights</p>
              </div>

              {/* File Upload Area */}
              <div 
                className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center bg-[#0f1216] hover:border-purple-500 transition-colors cursor-pointer"
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
                <Upload className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  {uploadedFile ? uploadedFile.name : "Drop your MP3 file here"}
                </h3>
                <p className="text-gray-400">or click to browse (Max 20MB)</p>
              </div>

              {/* Upload Progress */}
              {isAnalyzing && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white">Analyzing audio...</span>
                    <span className="text-purple-400">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}

              {/* Analysis Error */}
              {analysisError && (
                <div className="bg-red-900/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
                  {analysisError}
                </div>
              )}

              {/* Analysis Results */}
              {analysisResults && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* BPM */}
                    <div className="bg-[#0f1216] rounded-lg p-4 border border-purple-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Music className="w-5 h-5 text-purple-400" />
                        <span className="text-sm text-gray-400">BPM</span>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {Math.round(analysisResults.bpm)}
                      </div>
                    </div>

                    {/* Key */}
                    <div className="bg-[#0f1216] rounded-lg p-4 border border-blue-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-5 h-5 text-blue-400" />
                        <span className="text-sm text-gray-400">Key</span>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {analysisResults.key} {analysisResults.mode}
                      </div>
                    </div>

                    {/* Energy */}
                    <div className="bg-[#0f1216] rounded-lg p-4 border border-green-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-green-400" />
                        <span className="text-sm text-gray-400">Energy</span>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {Math.round(analysisResults.energy * 100)}%
                      </div>
                    </div>

                    {/* Loudness */}
                    <div className="bg-[#0f1216] rounded-lg p-4 border border-yellow-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Volume2 className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm text-gray-400">Loudness</span>
                      </div>
                      <div className="text-2xl font-bold text-white">
                        {Math.round(analysisResults.loudness)} dB
                      </div>
                    </div>
                  </div>

                  {/* Duration and Additional Info */}
                  <div className="bg-[#0f1216] rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-4">Track Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Duration:</span>
                        <span className="text-white ml-2">
                          {Math.floor(analysisResults.duration / 60)}:{String(Math.floor(analysisResults.duration % 60)).padStart(2, '0')}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400">Mode:</span>
                        <span className="text-white ml-2 capitalize">{analysisResults.mode}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">File:</span>
                        <span className="text-white ml-2">{uploadedFile?.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* Placeholder for Similar Artists */}
                  <div className="bg-[#0f1216] rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-semibold text-white mb-4">Similar Artists</h3>
                    <p className="text-gray-400 mb-4">Analyzing sound similarity to find matches...</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-[#181c24] rounded-lg p-4 animate-pulse">
                          <div className="w-full h-24 bg-gray-700 rounded mb-2"></div>
                          <div className="h-4 bg-gray-700 rounded mb-1"></div>
                          <div className="h-3 bg-gray-700 rounded w-2/3"></div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <Button className="bg-purple-600 text-white flex-1">
                      Generate Campaign Strategy
                    </Button>
                    <Button variant="outline" className="border-purple-500 text-purple-400 flex-1">
                      Save Analysis
                    </Button>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!uploadedFile && !isAnalyzing && !analysisResults && (
                <div className="text-center py-12">
                  <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-400 mb-2">No audio file uploaded</h3>
                  <p className="text-gray-500">Upload an MP3 file to start the AI analysis</p>
                </div>
              )}
            </div>
          )}
          {activeTab === "campaign" && (
            <div>
              <h2 className="text-2xl font-semibold text-green-400 mb-4">Funding & Campaign Recommendation</h2>
              <p className="text-gray-300 mb-6">AI-powered suggestions for your next release campaign.</p>
              {/* TODO: Integrate campaign recommendation API */}
              <Button className="bg-green-600 text-white">Get Recommendation</Button>
            </div>
          )}
          {activeTab === "fan" && (
            <div>
              <h2 className="text-2xl font-semibold text-pink-400 mb-4">Fan Analytics</h2>
              <p className="text-gray-300 mb-6">Track your follower growth, top cities, and engagement.</p>
              {/* TODO: Integrate fan analytics API */}
              <Button className="bg-pink-600 text-white">View Analytics</Button>
            </div>
          )}
          {activeTab === "venues" && (
            <div>
              <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Target Venues</h2>
              <p className="text-gray-300 mb-6">Get a curated list of venues to pitch in your top cities.</p>
              {/* TODO: Integrate venue recommendations API */}
              <Button className="bg-yellow-500 text-white">Find Venues</Button>
            </div>
          )}
          {activeTab === "email" && (
            <div>
              <h2 className="text-2xl font-semibold text-cyan-400 mb-4">Email Pitch Assistant</h2>
              <p className="text-gray-300 mb-6">AI-generated outreach drafts for venues, curators, and more.</p>
              {/* TODO: Integrate email draft API */}
              <Button className="bg-cyan-600 text-white">Generate Email Drafts</Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AgenticManagerDashboard; 