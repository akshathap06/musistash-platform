// API Configuration
export const BACKEND_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 
  (import.meta.env.MODE === 'production' ? 'https://musistash-platform-production-3168.up.railway.app' : 'http://localhost:8000');

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
  "763571700636-o25hjvv8fmqkrdbse471e82g02q4f1t2.apps.googleusercontent.com";

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