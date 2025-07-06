
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AlertCircle } from 'lucide-react';
import GoogleSignIn from '@/components/ui/GoogleSignIn';

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-10 animate-scale-in">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Welcome to MusiStash</h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Sign in with Google to continue your music investment journey
            </p>
          </div>
          
          <Card className="border-2 shadow-lg">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription className="text-base">
                Quick and secure authentication with your Google account
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 pt-6">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-start">
                  <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="w-full">
                <GoogleSignIn 
                  onSuccess={() => navigate('/dashboard')}
                  onError={(error) => setError(error)}
                  className="w-full"
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col pt-2">
              <p className="text-center text-sm text-muted-foreground">
                New to MusiStash?{' '}
                <Link to="/register" className="font-medium text-primary hover:underline">
                  Create an account
                </Link>
              </p>
            </CardFooter>
          </Card>
          
          <div className="text-center text-xs text-muted-foreground bg-muted/30 p-4 rounded-lg">
            <p><strong>Secure & Fast:</strong> We use Google's trusted authentication system to keep your account safe and sign you in quickly.</p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
