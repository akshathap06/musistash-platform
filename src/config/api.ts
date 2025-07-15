// API Configuration
export const BACKEND_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 
  (import.meta.env.MODE === 'production' ? 'https://musistash-production.up.railway.app' : 'http://localhost:8000');

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
  "767080964358-cknd1jasah1f30ahivbm43mc7ch1pu5c.apps.googleusercontent.com";

// Debug logging for development
if (import.meta.env.MODE === 'development') {
  console.log('🔧 API Configuration:', {
    isDevelopment: true,
    BACKEND_URL,
    GOOGLE_CLIENT_ID,
    mode: import.meta.env.MODE,
    envVars: {
      VITE_API_URL: import.meta.env.VITE_API_URL,
      VITE_BACKEND_URL: import.meta.env.VITE_BACKEND_URL,
      VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    }
  });
} else {
  // Production logging
  console.log('🚀 Production API Configuration:', {
    BACKEND_URL,
    isProduction: true,
    mode: import.meta.env.MODE
  });
} 