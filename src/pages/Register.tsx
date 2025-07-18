
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AlertCircle, Shield, Zap, Users, Music, Headphones, Briefcase } from 'lucide-react';
import GoogleSignIn from '@/components/ui/GoogleSignIn';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from '@/hooks/useAuth';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [error, setError] = useState('');
  const [accountType, setAccountType] = useState('listener');
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  
  // Email form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      await register(formData.name, formData.email, formData.password, accountType as any);
      navigate('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed');
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
            <h1 className="text-3xl font-bold">Join MusiStash</h1>
            <p className="mt-3 text-lg text-muted-foreground">
              Choose your role and start your music investment journey
            </p>
          </div>
          
          <Card className="border-2 shadow-lg">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl">Create Account</CardTitle>
              <CardDescription className="text-base">
                Select your account type and sign up
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8 pt-6">
              {error && (
                <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md flex items-start">
                  <AlertCircle className="h-4 w-4 mr-2 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <RadioGroup
                value={accountType}
                onValueChange={setAccountType}
                className="grid gap-4"
              >
                <div className="flex items-center space-x-4 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="listener" id="listener" />
                  <Label htmlFor="listener" className="flex items-center gap-3 cursor-pointer">
                    <Headphones className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Listener</div>
                      <div className="text-sm text-muted-foreground">I want to invest in artists</div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-4 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="artist" id="artist" />
                  <Label htmlFor="artist" className="flex items-center gap-3 cursor-pointer">
                    <Music className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Artist</div>
                      <div className="text-sm text-muted-foreground">I want to raise funds for my projects</div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-4 rounded-lg border p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                  <RadioGroupItem value="developer" id="developer" />
                  <Label htmlFor="developer" className="flex items-center gap-3 cursor-pointer">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Service Provider</div>
                      <div className="text-sm text-muted-foreground">I offer services to artists</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {!showEmailForm ? (
                <div className="space-y-4">
                  <div className="w-full">
                    <GoogleSignIn 
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
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
                    Sign up with Email
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
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
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm your password"
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
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
            
            <CardFooter className="flex flex-col pt-2">
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>

          {/* Benefits Section */}
          <div className="space-y-4">
            <h3 className="text-center text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Why Join MusiStash?
            </h3>
            <div className="grid gap-3">
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Zap className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="text-sm">
                  <strong>Lightning Fast:</strong> Get started in seconds
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Shield className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="text-sm">
                  <strong>Secure:</strong> Protected by industry-standard security
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
                <Users className="h-5 w-5 text-primary flex-shrink-0" />
                <div className="text-sm">
                  <strong>Join the Community:</strong> Artists, listeners, and service providers
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Register;
