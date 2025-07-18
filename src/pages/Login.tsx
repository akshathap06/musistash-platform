
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AlertCircle } from 'lucide-react';
import GoogleSignIn from '@/components/ui/GoogleSignIn';
import { useAuth } from '@/hooks/useAuth';

const Login = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  
  // Email form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = () => {
    navigate('/dashboard');
  };

  const handleGoogleError = (error: string) => {
    setError(error);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-10 animate-scale-in">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Welcome to MusiStash</h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Sign in to continue your music investment journey
            </p>
          </div>
          
          <Card className="border-2 shadow-lg">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">Sign In</CardTitle>
              <CardDescription className="text-base">
                Quick and secure authentication
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 pt-6">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-start">
                  <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {!showEmailForm ? (
                <div className="space-y-4">
                  <div className="w-full">
                    <GoogleSignIn
                      onSuccess={async (user) => {
                        console.log('Google Sign-In successful:', user);
                        try {
                          console.log('🔍 Updating auth state...');
                          // Update the auth context with the user data
                          await loginWithGoogle(user, 'google_auth_token');
                          console.log('🔍 Auth state updated, waiting a moment...');
                          
                          // Add a small delay to ensure state is properly updated
                          await new Promise(resolve => setTimeout(resolve, 100));
                          
                          console.log('🔍 Navigating to dashboard...');
                          navigate('/dashboard');
                          console.log('🔍 Navigation triggered');
                        } catch (error) {
                          console.error('Error updating auth state:', error);
                          setError('Failed to complete sign-in. Please try again.');
                        }
                      }}
                      onError={(error) => {
                        setError(error);
                        console.error('Google Sign-In error:', error);
                      }}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or</span>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setShowEmailForm(true)}
                    className="w-full"
                  >
                    Sign in with Email
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => setShowEmailForm(false)}
                      className="flex-1"
                    >
                      Back to Google
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </div>
                </form>
              )}
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
            <p><strong>Secure & Fast:</strong> We use trusted authentication systems to keep your account safe and sign you in quickly.</p>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Login;
