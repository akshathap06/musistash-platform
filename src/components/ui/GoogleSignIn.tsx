import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './button';
import { API_ENDPOINTS, GOOGLE_CLIENT_ID } from '@/config/api';
import { supabaseService } from '@/services/supabaseService';

interface GoogleSignInProps {
  onSuccess?: (user: any) => void;
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
      currentOrigin: window.location.origin,
      allEnvVars: import.meta.env
    });
    
    try {
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
          width: "300", // Fixed width instead of 100%
        });
      }
    } catch (error) {
      console.error('🔍 Google Sign-In initialization error:', error);
    }
  };

  const handleCredentialResponse = async (response: any) => {
    try {
      console.log("Google credential response:", response);
      
      // Decode the JWT token to get user info
      const payload = JSON.parse(atob(response.credential.split('.')[1]));
      console.log('Decoded JWT payload:', payload);
      
      // Use the proper authentication flow that ensures UUIDs
      await loginWithGoogle(payload, response.credential);
      
      // Get the user from localStorage (now with proper UUID)
      const savedUser = localStorage.getItem('musistash_user');
      if (savedUser) {
        const user = JSON.parse(savedUser);
        
        // Validate UUID format
        if (user.id && typeof user.id === 'string' && user.id.length > 20) {
          console.log('✅ User authenticated with proper UUID:', user);
          
          // Call the success callback
          if (onSuccess) {
            onSuccess(user);
          }
        } else {
          throw new Error('Invalid user ID format after authentication');
        }
      } else {
        throw new Error('User data not found after authentication');
      }
      
    } catch (error) {
      console.error('Google Sign-In error:', error);
      
      // Check if it's a Supabase connection issue
      if (error instanceof Error && error.message.includes('Failed to create user from Google data')) {
        console.error('🔍 Supabase connection issue detected. Check environment variables:');
        console.error('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
        console.error('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing');
        
        // Provide a more helpful error message
        if (onError) {
          onError('User creation failed. This might be due to a database issue or missing permissions.');
        }
      } else if (error instanceof Error && error.message.includes('origin is not allowed')) {
        console.error('🔍 Google OAuth origin issue detected');
        if (onError) {
          onError('Google Sign-In configuration issue. Please check your Google OAuth settings.');
        }
      } else if (error instanceof Error && error.message.includes('Invalid user ID format')) {
        console.error('🔍 UUID format issue detected');
        if (onError) {
          onError('Authentication failed due to user ID format issue. Please try again.');
        }
      } else {
        if (onError) {
          onError('An unexpected error occurred during Google Sign-In.');
        }
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