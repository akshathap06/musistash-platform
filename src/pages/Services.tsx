import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { serviceProviders, Service, ServiceProvider } from '@/lib/mockData';
import { Star, Search, Filter, Clock, DollarSign, CheckCircle2, FileText, Package, Calendar } from 'lucide-react';

const Services = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Filter service providers based on search and category
  const filteredProviders = serviceProviders.filter(provider => {
    const matchesSearch = provider.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         provider.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         provider.services.some(service => 
                           service.title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (selectedCategory === 'all') return matchesSearch;
    
    return matchesSearch && provider.services.some(service => service.category === selectedCategory);
  });

  // Get all unique categories
  const categories: string[] = ['all', ...new Set(serviceProviders.flatMap(
    provider => provider.services.map(service => service.category)
  ))];
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <div className="flex-1 pt-20">
        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="flex flex-col space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Music Services Marketplace</h1>
              <p className="text-muted-foreground max-w-3xl">
                Connect with top industry professionals offering services to help bring your music projects to life. From production to marketing, find the perfect partner for your next release.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for services or providers..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select 
                  className="bg-background border rounded-md px-3 py-2 text-sm"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <Tabs defaultValue="services" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="providers">Service Providers</TabsTrigger>
                <TabsTrigger value="featured">Featured Deals</TabsTrigger>
              </TabsList>
              
              <TabsContent value="services" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProviders.flatMap(provider => 
                    provider.services.map(service => (
                      <ServiceCard 
                        key={service.id} 
                        service={service} 
                        provider={provider} 
                      />
                    ))
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="providers" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProviders.map(provider => (
                    <ProviderCard key={provider.id} provider={provider} />
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="featured" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredProviders.slice(0, 2).flatMap(provider => 
                    provider.services.slice(0, 1).map(service => (
                      <FeaturedServiceCard 
                        key={service.id} 
                        service={service} 
                        provider={provider} 
                      />
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

const ServiceCard = ({ service, provider }: { service: Service, provider: ServiceProvider }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{service.title}</CardTitle>
            <CardDescription className="line-clamp-2 mt-1">
              {service.description}
            </CardDescription>
          </div>
          <Badge variant={
            service.category === 'production' ? 'default' :
            service.category === 'mixing' ? 'secondary' :
            service.category === 'mastering' ? 'destructive' :
            service.category === 'marketing' ? 'outline' : 'default'
          }>
            {service.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2 flex-1">
        <div className="flex items-center text-sm mb-3">
          <img 
            src={provider.avatar} 
            alt={provider.name} 
            className="w-6 h-6 rounded-full mr-2" 
          />
          <span>{provider.name}</span>
          <div className="flex items-center ml-auto">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 mr-1" />
            <span>{provider.rating}</span>
          </div>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>Price</span>
            </div>
            <span className="font-medium">${service.price.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
              <span>Duration</span>
            </div>
            <span>{service.duration}</span>
          </div>
          
          <Separator className="my-2" />
          
          <div className="space-y-1">
            {service.features.slice(0, 3).map((feature, i) => (
              <div key={i} className="flex items-start">
                <CheckCircle2 className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm">{feature}</span>
              </div>
            ))}
            {service.features.length > 3 && (
              <div className="text-sm text-muted-foreground pl-6">
                +{service.features.length - 3} more features
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex flex-col sm:flex-row gap-2 mt-auto">
        <ContractDialog service={service} provider={provider} />
        <Button className="w-full">Contact Provider</Button>
      </CardFooter>
    </Card>
  );
};

const ProviderCard = ({ provider }: { provider: ServiceProvider }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex gap-4 items-center">
          <img 
            src={provider.avatar} 
            alt={provider.name} 
            className="w-16 h-16 rounded-full object-cover" 
          />
          <div>
            <CardTitle className="text-lg">{provider.name}</CardTitle>
            <CardDescription className="mt-1">
              {provider.title}
            </CardDescription>
            <div className="flex items-center mt-1 text-sm">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 mr-1" />
              <span>{provider.rating}</span>
              <span className="mx-2">•</span>
              <span>{provider.completedProjects} projects</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4 flex-1">
        <p className="text-sm text-muted-foreground mb-4">{provider.bio}</p>
        
        <div className="space-y-2">
          <div className="text-sm font-medium">Services offered:</div>
          <div className="flex flex-wrap gap-2">
            {Array.from(new Set(provider.services.map(s => s.category))).map(category => (
              <Badge variant="outline" key={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button className="w-full">View Profile</Button>
      </CardFooter>
    </Card>
  );
};

const FeaturedServiceCard = ({ service, provider }: { service: Service, provider: ServiceProvider }) => {
  return (
    <Card className="overflow-hidden">
      <div className="bg-primary/10 p-2 text-center text-sm font-medium text-primary">
        Featured Service
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{service.title}</CardTitle>
            <CardDescription className="mt-2">
              By {provider.name} - {provider.title}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">${service.price.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">{service.duration}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-0">
        <p className="mb-4">{service.description}</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="space-y-3">
            <div className="font-medium flex items-center">
              <Package className="h-4 w-4 mr-2" />
              Key Features
            </div>
            <div className="space-y-1">
              {service.features.slice(0, 5).map((feature, i) => (
                <div key={i} className="flex items-start">
                  <CheckCircle2 className="h-4 w-4 mr-2 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Provider Details
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <img 
                  src={provider.avatar} 
                  alt={provider.name} 
                  className="w-8 h-8 rounded-full mr-2" 
                />
                <div>
                  <div>{provider.name}</div>
                  <div className="text-muted-foreground">{provider.location}</div>
                </div>
              </div>
              <div className="flex items-center">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 mr-1" />
                <span>{provider.rating} rating</span>
                <span className="mx-2">•</span>
                <span>{provider.completedProjects} completed projects</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <ContractDialog service={service} provider={provider} />
        <Button className="w-full sm:flex-1">Book This Service</Button>
      </CardFooter>
    </Card>
  );
};

const ContractDialog = ({ service, provider }: { service: Service, provider: ServiceProvider }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full sm:flex-1 text-foreground">
          <FileText className="mr-2 h-4 w-4" />
          View Contract
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Service Contract - {service.title}</DialogTitle>
          <DialogDescription>
            Provided by {provider.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="max-h-[60vh] overflow-y-auto pr-2">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Service Agreement</h3>
              <p className="text-sm text-muted-foreground">
                This agreement is made between {provider.name} ("Provider") and the undersigned client ("Client")
                for the provision of {service.title} as detailed below.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">1. Services to be Provided</h4>
              <p className="text-sm">{service.description}</p>
              <div className="ml-4 mt-2 space-y-1">
                {service.features.map((feature, i) => (
                  <div key={i} className="text-sm flex items-start">
                    <span className="mr-2">•</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">2. Duration and Timeline</h4>
              <p className="text-sm">
                The services will be provided over a period of {service.duration} from the commencement date
                as agreed upon by both parties. Provider will adhere to the following timeline:
              </p>
              <div className="ml-4 mt-2 space-y-1 text-sm">
                <div>• Project kickoff and initial consultation: Within 3 business days of payment</div>
                <div>• First deliverable: 1 week after kickoff</div>
                <div>• Revision period: 1-2 weeks</div>
                <div>• Final deliverable: By end of contract period</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">3. Compensation</h4>
              <p className="text-sm">
                The total fee for the services described herein is ${service.price.toLocaleString()} USD, 
                payable as follows:
              </p>
              <div className="ml-4 mt-2 space-y-1 text-sm">
                <div>• 50% non-refundable deposit due upon signing of this agreement</div>
                <div>• 25% due upon delivery of first draft</div>
                <div>• 25% due upon completion of the project</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">4. Intellectual Property Rights</h4>
              <p className="text-sm">
                Upon receipt of full payment, Client will own the rights to the final deliverables, subject to 
                the following limitations: Provider retains the right to showcase the work in their portfolio. 
                Any third-party licenses (e.g., sample clearances, stock media) must be separately obtained by the Client.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">5. Revisions and Additional Services</h4>
              <p className="text-sm">
                This agreement includes {service.category === 'production' ? 'three (3)' : 'two (2)'} rounds of revisions. 
                Additional revisions or services will be billed at Provider's standard hourly rate of $200/hour, 
                subject to Client's prior approval.
              </p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">6. Cancellation Policy</h4>
              <p className="text-sm">
                If Client cancels the project after work has commenced, the following fees apply:
              </p>
              <div className="ml-4 mt-2 space-y-1 text-sm">
                <div>• Within 48 hours of signing: 25% of total fee</div>
                <div>• After first deliverable: 50% of total fee</div>
                <div>• After revision phase begins: 75% of total fee</div>
                <div>• Within final week of project: 100% of total fee</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">7. Confidentiality</h4>
              <p className="text-sm">
                Provider agrees to keep confidential all proprietary information shared by Client during the course of this project.
              </p>
            </div>
            
            <div className="pt-4 pb-2">
              <p className="text-sm text-muted-foreground italic">
                This is a sample contract for demonstration purposes only. Actual contracts would be customized 
                for each service and client. Legal consultation is recommended before signing any service agreement.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <Button variant="outline" className="text-foreground">Download PDF</Button>
          <Button>Request Customization</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Services;
