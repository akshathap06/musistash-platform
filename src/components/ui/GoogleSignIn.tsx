import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './button';
import { API_ENDPOINTS, GOOGLE_CLIENT_ID } from '@/config/api';

interface GoogleSignInProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
}

declare global {
  interface Window {
    google: any;
  }
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({ 
  onSuccess, 
  onError, 
  className = "" 
}) => {
  const googleButtonRef = useRef<HTMLDivElement>(null);
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    if (window.google) {
      initializeGoogleSignIn();
    } else {
      // Wait for Google Identity Services to load
      const checkGoogleLoaded = setInterval(() => {
        if (window.google) {
          initializeGoogleSignIn();
          clearInterval(checkGoogleLoaded);
        }
      }, 100);

      return () => clearInterval(checkGoogleLoaded);
    }
  }, []);

  const initializeGoogleSignIn = () => {
    console.log('🔍 Google Sign In Debug:', {
      clientId: GOOGLE_CLIENT_ID,
      hasGoogleScript: !!window.google,
      environment: import.meta.env.MODE,
      allEnvVars: import.meta.env
    });
    
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    if (googleButtonRef.current) {
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        type: "standard",
        shape: "rectangular",
        theme: "outline",
        text: "signin_with",
        size: "large",
        width: "100%",
      });
    }
  };

  const handleCredentialResponse = async (response: any) => {
    try {
      console.log("Google credential response:", response);
      
      // For local development, create a mock user instead of calling backend
      if (import.meta.env.MODE === 'development') {
        console.log('🔧 Development mode: Using mock authentication');
        
        // Decode the JWT token to get user info
        const payload = JSON.parse(atob(response.credential.split('.')[1]));
        console.log('Decoded JWT payload:', payload);
        
        const mockUser = {
          id: `user_${Date.now()}`,
          name: payload.name || 'Demo User',
          email: payload.email || 'demo@example.com',
          avatar: payload.picture || '/placeholder.svg',
          role: 'listener' as const,
          createdAt: new Date().toISOString()
        };
        
        // Update the auth context with the mock user data
        await loginWithGoogle(mockUser, 'mock_access_token');
        
        if (onSuccess) {
          onSuccess();
        }
        return;
      }
      
      // Production flow - send the credential to your backend
      const backendResponse = await fetch(API_ENDPOINTS.googleAuth(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: response.credential
        }),
      });

      if (!backendResponse.ok) {
        throw new Error('Authentication failed');
      }

      const authData = await backendResponse.json();
      console.log("Backend auth response:", authData);

      // Update the auth context with the user data
      await loginWithGoogle(authData.user, authData.access_token);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Google Sign-In error:', error);
      if (onError) {
        onError(error instanceof Error ? error.message : 'Sign-in failed');
      }
    }
  };

  return (
    <div className={`google-signin-container ${className}`}>
      <div ref={googleButtonRef} className="w-full"></div>
    </div>
  );
};

export default GoogleSignIn; 