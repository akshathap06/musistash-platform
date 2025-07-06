
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { AlertCircle, Shield, Zap, Users, Music, Headphones, Briefcase } from 'lucide-react';
import GoogleSignIn from '@/components/ui/GoogleSignIn';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [accountType, setAccountType] = useState('listener');

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
                Select your account type and sign up with Google
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
                  <RadioGroupItem value="service-provider" id="service-provider" />
                  <Label htmlFor="service-provider" className="flex items-center gap-3 cursor-pointer">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Service Provider</div>
                      <div className="text-sm text-muted-foreground">I offer services to artists</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              <div className="w-full pt-4">
                <GoogleSignIn 
                  onSuccess={() => navigate('/dashboard')}
                  onError={(error) => setError(error)}
                  className="w-full"
                />
              </div>
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
              Why Choose Google Sign-In?
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
                  <strong>Secure:</strong> Protected by Google's security
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
