
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart2, Music, Sparkles, Star } from 'lucide-react';
import AIRecommendationTool from '../components/ui/AIRecommendationTool';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <section className="py-16 px-4 md:px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
              Musi$tash AI Technology
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Discover how our AI helps artists and investors make data-driven decisions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col justify-center"
            >
              <h2 className="text-3xl font-bold mb-6">What is Musi$tash AI?</h2>
              <p className="text-lg leading-relaxed mb-6">
                Musi$tash's unique artificial intelligence creates a new way to compare and gauge 
                upcoming musical talent by utilizing distinctive audio features embedded within 
                each artist's discography.
              </p>
              <p className="text-lg leading-relaxed mb-6">
                These features are extracted and used in our algorithm, resulting in a 
                <span className="font-bold text-primary"> Musi$tash Resonance Score</span> that 
                reflects how similar any given artist is to their closest mainstream comparison.
              </p>
              <p className="text-lg leading-relaxed">
                Our artificial intelligence aims to give newer artists an edge by providing 
                insight into their music. It enables them to pinpoint the audio elements they can 
                refine to increase their commercial appeal by comparing their unique sound with 
                that of mainstream artists.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-xl overflow-hidden shadow-xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600&q=80" 
                alt="Music studio equipment" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <Card className="bg-gradient-to-br from-background to-muted/50 border">
              <CardHeader className="pb-2">
                <BarChart2 className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Audio Analysis</CardTitle>
                <CardDescription>Extracts key audio metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  Our AI analyzes key metrics like danceability, energy, acousticness,
                  and speechiness to create a comprehensive profile of an artist's unique sound.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-background to-muted/50 border">
              <CardHeader className="pb-2">
                <Sparkles className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Comparative Analysis</CardTitle>
                <CardDescription>Matches with similar artists</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  The AI compares emerging artists with established mainstream artists,
                  identifying similarities and differences in their musical profiles.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-background to-muted/50 border">
              <CardHeader className="pb-2">
                <Star className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Resonance Score</CardTitle>
                <CardDescription>Similarity and market potential</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  The resulting Resonance Score indicates how similar an artist's sound is 
                  to successful mainstream artists, helping gauge commercial potential.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Understanding the Resonance Score</h2>
              <p className="text-lg max-w-3xl mx-auto text-muted-foreground">
                See how our algorithm calculates similarity between artists
              </p>
            </div>
            
            <div className="bg-muted rounded-xl p-6 md:p-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h3 className="text-2xl font-semibold mb-6">How the Score Works</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start space-x-3">
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white text-sm flex-shrink-0">1</div>
                      <div>
                        <p className="font-medium">Audio Feature Extraction</p>
                        <p className="text-muted-foreground">The AI analyzes tracks to extract key audio elements</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white text-sm flex-shrink-0">2</div>
                      <div>
                        <p className="font-medium">Genre Weighting</p>
                        <p className="text-muted-foreground">Different elements are weighted based on genre importance</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white text-sm flex-shrink-0">3</div>
                      <div>
                        <p className="font-medium">Mainstream Comparison</p>
                        <p className="text-muted-foreground">Artists are compared to a database of successful acts</p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white text-sm flex-shrink-0">4</div>
                      <div>
                        <p className="font-medium">Score Calculation</p>
                        <p className="text-muted-foreground">A percentage score indicates similarity to mainstream success</p>
                      </div>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <div className="bg-background rounded-lg p-6 shadow-lg">
                    <h4 className="text-xl font-semibold mb-4">Resonance Score Interpretation</h4>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>90% - 100%</span>
                          <span className="font-medium text-green-500">Exceptional Match</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: '95%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>70% - 89%</span>
                          <span className="font-medium text-blue-500">Strong Match</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '80%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>50% - 69%</span>
                          <span className="font-medium text-amber-500">Moderate Match</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-amber-500 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1 text-sm">
                          <span>0% - 49%</span>
                          <span className="font-medium text-red-500">Unique Sound</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-red-500 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-4">Try the MusiStash AI</h2>
              <p className="text-lg max-w-3xl mx-auto text-muted-foreground">
                Search for any artist and our AI will analyze their sound and compare it
                to successful mainstream artists
              </p>
            </div>
            
            <AIRecommendationTool />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HowItWorks;
