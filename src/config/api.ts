// Centralized API Configuration
// This file manages all backend URLs for the application

const isDevelopment = import.meta.env.MODE === 'development';

// Main API base URL - uses environment variable with Railway as fallback
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://musistash-production.up.railway.app';

// Development fallback for local testing (if needed)
export const DEV_API_URL = 'http://localhost:8000';

// Use Railway in production, localhost in development (if Railway env var not set)
export const BACKEND_URL = import.meta.env.VITE_API_URL || 
  (isDevelopment ? DEV_API_URL : 'https://musistash-production.up.railway.app');

// API endpoints
export const API_ENDPOINTS = {
  // Artist analysis
  analyzeArtist: (artistName: string, comparableArtist?: string) => {
    const baseUrl = `${BACKEND_URL}/analyze-artist/${encodeURIComponent(artistName)}`;
    return comparableArtist ? 
      `${baseUrl}?comparable_artist=${encodeURIComponent(comparableArtist)}` : 
      baseUrl;
  },
  
  // Artist stats
  artistStats: (artistName: string) => 
    `${BACKEND_URL}/artist-stats/${encodeURIComponent(artistName)}`,
  
  // SoundCharts data
  soundchartsData: (artistName: string) => 
    `${BACKEND_URL}/soundcharts-data/${encodeURIComponent(artistName)}`,
  
  // Authentication
  googleAuth: () => `${BACKEND_URL}/auth/google`,
  authMe: () => `${BACKEND_URL}/auth/me`,
  logout: () => `${BACKEND_URL}/auth/logout`,
  
  // Health check
  health: () => `${BACKEND_URL}/health`,
};

// Google OAuth configuration
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 
  "700682656483-ovptamritkbqnbrj7hosfkk00m6ad8ik.apps.googleusercontent.com";

// Debug logging for development
if (isDevelopment) {
  console.log('🔧 API Configuration:', {
    isDevelopment,
    API_BASE_URL,
    BACKEND_URL,
    GOOGLE_CLIENT_ID,
    mode: import.meta.env.MODE,
    envVars: {
      VITE_API_URL: import.meta.env.VITE_API_URL,
      VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    }
  });
} 