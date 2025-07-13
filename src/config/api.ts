// API Configuration
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  analyzeArtist: (name: string, compareArtist?: string) => {
    const baseUrl = `${BACKEND_URL}/analyze-artist/${encodeURIComponent(name)}`;
    return compareArtist ? `${baseUrl}?comparable_artist=${encodeURIComponent(compareArtist)}` : baseUrl;
  },
  googleAuth: () => `${BACKEND_URL}/auth/google`,
  artistStats: (name: string) => `${BACKEND_URL}/artist-stats/${encodeURIComponent(name)}`
} as const;

// Google OAuth configuration
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 
  "700682656483-ovptamritkbqnbrj7hosfkk00m6ad8ik.apps.googleusercontent.com";

// Debug logging for development
if (import.meta.env.MODE === 'development') {
  console.log('🔧 API Configuration:', {
    isDevelopment: true,
    BACKEND_URL,
    GOOGLE_CLIENT_ID,
    mode: import.meta.env.MODE,
    envVars: {
      VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
      VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    }
  });
} 