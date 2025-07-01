import React, { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './button';

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
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "700682656483-ovptamritkbqnbrj7hosfkk00m6ad8ik.apps.googleusercontent.com";
    
    window.google.accounts.id.initialize({
      client_id: clientId,
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
      
      // Use environment variable for backend URL (matching Vercel config)
      const backendUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      
      // Send the credential to your backend
      const backendResponse = await fetch(`${backendUrl}/auth/google`, {
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