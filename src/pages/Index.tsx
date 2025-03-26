
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import AIRecommendationTool from '@/components/ui/AIRecommendationTool';
import ProjectCard from '@/components/ui/ProjectCard';
import ArtistInfo from '@/components/ui/ArtistInfo';
import { artists, projects } from '@/lib/mockData';
import { Music, ArrowRight, ArrowDown, DollarSign, Users } from 'lucide-react';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="mt-16 relative overflow-hidden bg-gradient-to-b from-background to-secondary/20">
        <div className="container max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-6 animate-fade-in">
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-sm font-semibold transition-colors focus:outline-none mb-4">
                <span className="text-muted-foreground">Revolutionizing Music Investment</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                <span className="gradient-text">Invest in Artists.</span>
                <br /> Share Their Success.
              </h1>
              
              <p className="text-lg text-muted-foreground max-w-xl">
                MusiStash connects artists with fans who want to invest in their future. 
                Support the music you love and potentially earn returns when artists succeed.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto">
                    How It Works
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="md:w-1/2 animate-scale-in">
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&h=675" 
                  alt="MusiStash Platform" 
                  className="w-full h-auto aspect-video object-cover"
                />
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
            <ArrowDown className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="bg-background py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="section-heading">How MusiStash Works</h2>
            <p className="section-subheading max-w-3xl mx-auto">
              Our platform connects artists seeking funding with listeners who want to support and invest in music projects
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-secondary/30 rounded-xl p-6 text-center animate-slide-up">
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Music className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Artists List Projects</h3>
              <p className="text-muted-foreground">
                Musicians create project listings with transparent funding goals, 
                package breakdowns, and potential return on investment.
              </p>
            </div>
            
            <div className="bg-secondary/30 rounded-xl p-6 text-center animate-slide-up" style={{ animationDelay: '100ms' }}>
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Listeners Invest</h3>
              <p className="text-muted-foreground">
                Music fans browse projects, choose those they believe in, 
                and invest to help artists achieve their funding goals.
              </p>
            </div>
            
            <div className="bg-secondary/30 rounded-xl p-6 text-center animate-slide-up" style={{ animationDelay: '200ms' }}>
              <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Everyone Benefits</h3>
              <p className="text-muted-foreground">
                When projects succeed, artists achieve their goals, investors 
                earn returns, and music gets created. It's a win for everyone.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/how-it-works">
              <Button variant="outline">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* AI Recommendation Section */}
      <section className="bg-primary/5 py-20 border-y">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="section-heading">AI-Powered Investment Insights</h2>
            <p className="section-subheading max-w-3xl mx-auto">
              Our AI analyzes musical similarity and provides investment recommendations based on 
              comparable successful artists
            </p>
          </div>
          
          <AIRecommendationTool />
        </div>
      </section>
      
      {/* Featured Projects Section */}
      <section className="bg-background py-20">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="section-heading">Featured Projects</h2>
              <p className="text-muted-foreground max-w-2xl">
                Discover exciting music projects seeking funding and investment
              </p>
            </div>
            <Link to="/projects">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Artists Section */}
      <section className="bg-secondary/30 py-20 border-y">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="section-heading">Featured Artists</h2>
              <p className="text-muted-foreground max-w-2xl">
                Meet the musicians raising funds and sharing their success with investors
              </p>
            </div>
            <Link to="/artists">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {artists.map((artist) => (
              <div key={artist.id} className="bg-background p-6 rounded-xl shadow-sm">
                <ArtistInfo artist={artist} expanded={true} />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-primary/10 py-20">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Invest in the Future of Music?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Join thousands of music lovers who are funding their favorite artists and sharing in their success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg">
                Create an Account
              </Button>
            </Link>
            <Link to="/projects">
              <Button size="lg" variant="outline">
                Browse Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
