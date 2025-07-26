import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Textarea } from './textarea';
import { MapPin, Phone, Mail, Globe, Star, Users, Music, Calendar, Search, Loader2, ExternalLink, Heart } from 'lucide-react';
import { BACKEND_URL } from '@/config/api';
import { favoriteVenuesService, type VenueData } from '@/services/favoriteVenuesService';
import { useAuth } from '@/hooks/useAuth';

interface Venue {
  id: string;
  name: string;
  address: string;
  phone: string;
  website: string;
  rating: number;
  total_ratings: number;
  types: string[];
  opening_hours?: any;
  photos?: any[];
  location: string;
  estimated_capacity: string;
  booking_difficulty: 'easy' | 'medium' | 'hard';
  genre_suitability?: number;
  booking_approach?: string;
  description?: string;
  booking_requirements?: string[];
  amenities?: string[];
}

interface TargetVenuesDisplayProps {
  artistProfile?: any;
  onVenueEmailClick?: (venue: Venue) => void;
  venues: Venue[];
  favoriteVenues: Venue[];
  loading: boolean;
  error: string | null;
  searchParams: {
    location: string;
    venueTypes: string;
    artistGenre: string;
    capacityRange: string;
  };
  onSearchParamsChange: (params: any) => void;
  onDiscoverVenues: () => void;
  onToggleFavorite: (venue: Venue) => void;
}

const TargetVenuesDisplay: React.FC<TargetVenuesDisplayProps> = ({ 
  artistProfile, 
  onVenueEmailClick,
  venues,
  favoriteVenues,
  loading,
  error,
  searchParams,
  onSearchParamsChange,
  onDiscoverVenues,
  onToggleFavorite
}) => {
  const { user } = useAuth();
  const [componentError, setComponentError] = useState<string | null>(null);
  const [showFavorites, setShowFavorites] = useState(false);

  // Wrap the component in error boundary
  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('TargetVenuesDisplay error:', event.error);
      setComponentError(event.error?.message || 'An error occurred');
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const isVenueFavorited = (venueId: string) => {
    return favoriteVenues.some(v => v.id === venueId);
  };

  const venueTypeOptions = [
    { value: 'all', label: 'All Venue Types' },
    { value: 'music venues', label: 'Music Venues' },
    { value: 'concert halls', label: 'Concert Halls' },
    { value: 'clubs', label: 'Clubs' },
    { value: 'bars', label: 'Bars' },
    { value: 'restaurants', label: 'Restaurants' },
    { value: 'outdoor venues', label: 'Outdoor Venues' },
    { value: 'theaters', label: 'Theaters' }
  ];

  const capacityOptions = [
    { value: 'any', label: 'Any Capacity' },
    { value: 'small', label: 'Small (Under 100)' },
    { value: 'medium', label: 'Medium (100-500)' },
    { value: 'large', label: 'Large (500+)' }
  ];

  // Sample venues for when Google Maps API is not available
  const getSampleVenues = (location: string): Venue[] => {
    return [
      {
        id: 'sample-1',
        name: 'The Blue Note',
        address: '123 Jazz Street, Downtown',
        phone: '(555) 123-4567',
        website: 'https://bluenote.com',
        rating: 4.5,
        total_ratings: 150,
        types: ['music_venue', 'bar'],
        location: location,
        estimated_capacity: '200-300',
        booking_difficulty: 'medium' as const,
        genre_suitability: 8,
        booking_approach: 'Contact via email or phone',
        description: 'Iconic jazz venue with excellent acoustics and intimate atmosphere',
        booking_requirements: ['Demo', 'Social media presence', 'Technical rider'],
        amenities: ['Professional sound system', 'Lighting rig', 'Green room', 'Bar']
      },
      {
        id: 'sample-2',
        name: 'Rock Arena',
        address: '456 Rock Boulevard, Midtown',
        phone: '(555) 987-6543',
        website: 'https://rockarena.com',
        rating: 4.2,
        total_ratings: 89,
        types: ['concert_hall', 'establishment'],
        location: location,
        estimated_capacity: '500-800',
        booking_difficulty: 'hard' as const,
        genre_suitability: 7,
        booking_approach: 'Submit booking request through website',
        description: 'Large concert venue perfect for rock and electronic music',
        booking_requirements: ['Professional demo', 'Insurance', 'Technical specifications'],
        amenities: ['Large stage', 'Professional lighting', 'Multiple dressing rooms', 'Merchandise area']
      },
      {
        id: 'sample-3',
        name: 'Acoustic Lounge',
        address: '789 Folk Lane, Arts District',
        phone: '(555) 456-7890',
        website: 'https://acousticlounge.com',
        rating: 4.7,
        total_ratings: 234,
        types: ['bar', 'restaurant'],
        location: location,
        estimated_capacity: '50-100',
        booking_difficulty: 'easy' as const,
        genre_suitability: 9,
        booking_approach: 'Direct contact with venue manager',
        description: 'Intimate venue perfect for acoustic and folk music',
        booking_requirements: ['Demo', 'Social media links'],
        amenities: ['Acoustic-friendly space', 'Small PA system', 'Food service', 'Intimate seating']
      }
    ];
  };

  const handleSearchParamsChange = (field: string, value: string) => {
    onSearchParamsChange({ ...searchParams, [field]: value });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-400 border-green-400';
      case 'medium': return 'text-yellow-400 border-yellow-400';
      case 'hard': return 'text-red-400 border-red-400';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Easy to Book';
      case 'medium': return 'Moderate';
      case 'hard': return 'Hard to Book';
      default: return 'Unknown';
    }
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    // Remove all non-digit characters and format
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 10) {
      return `(${cleaned.slice(0,3)}) ${cleaned.slice(3,6)}-${cleaned.slice(6)}`;
    }
    return phone;
  };

  const generateEmail = (venue: Venue) => {
    const venueName = venue.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com'];
    
    // Try to extract domain from website
    if (venue.website) {
      try {
        const url = new URL(venue.website);
        const domain = url.hostname.replace('www.', '');
        return `booking@${domain}`;
      } catch {
        // If website parsing fails, use common patterns
        return `booking@${venueName}.com`;
      }
    }
    
    // Fallback patterns
    const patterns = [
      `booking@${venueName}.com`,
      `info@${venueName}.com`,
      `events@${venueName}.com`,
      `contact@${venueName}.com`
    ];
    
    return patterns[0];
  };

  // Add a loading state to prevent dark screen
  const [isInitialized, setIsInitialized] = useState(false);

  React.useEffect(() => {
    // Set initialized after a short delay to ensure all components are ready
    const timer = setTimeout(() => setIsInitialized(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isInitialized) {
    return (
      <div className="space-y-6">
        <Card className="bg-[#0f1216] border border-gray-700">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Loading venue discovery...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (componentError) {
    return (
      <div className="space-y-6">
        <Card className="bg-[#0f1216] border border-red-500">
          <CardContent className="p-6">
            <div className="text-red-400">
              <h3 className="text-lg font-semibold mb-2">Component Error</h3>
              <p>{componentError}</p>
              <Button 
                onClick={() => setComponentError(null)}
                className="mt-4 bg-red-600 hover:bg-red-700"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card className="bg-[#0f1216] border border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Search className="w-5 h-5" />
            Discover Venues
          </CardTitle>
          <p className="text-gray-400 text-sm">
            Search for real venues using Google Maps and get AI-powered insights
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <Label htmlFor="location" className="text-gray-300">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., Los Angeles, CA or New York, NY"
                value={searchParams.location}
                onChange={(e) => handleSearchParamsChange('location', e.target.value)}
                className="bg-[#181c24] border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="venueTypes" className="text-gray-300">Venue Types</Label>
              <Select onValueChange={(value) => handleSearchParamsChange('venueTypes', value)}>
                <SelectTrigger className="bg-[#181c24] border-gray-700 text-white">
                  <SelectValue placeholder="All venue types" />
                </SelectTrigger>
                <SelectContent>
                  {venueTypeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="artistGenre" className="text-gray-300">Artist Genre</Label>
              <Input
                id="artistGenre"
                placeholder="e.g., hip-hop, rock, electronic"
                value={searchParams.artistGenre}
                onChange={(e) => handleSearchParamsChange('artistGenre', e.target.value)}
                className="bg-[#181c24] border-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="capacityRange" className="text-gray-300">Capacity Range</Label>
              <Select onValueChange={(value) => handleSearchParamsChange('capacityRange', value)}>
                <SelectTrigger className="bg-[#181c24] border-gray-700 text-white">
                  <SelectValue placeholder="Any capacity" />
                </SelectTrigger>
                <SelectContent>
                  {capacityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button
            onClick={onDiscoverVenues}
            disabled={loading || !searchParams.location.trim()}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Discovering Venues...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Discover Venues
              </>
            )}
          </Button>

          {error && (
            <div className="mt-4 p-3 bg-red-900/20 border border-red-500 text-red-400 rounded-lg">
              {error}
            </div>
          )}
        </CardContent>
      </Card>



      {/* Favorite Venues Section */}
      {favoriteVenues.length > 0 && (
        <Card className="bg-[#0f1216] border border-purple-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-400 fill-current" />
                Favorite Venues ({favoriteVenues.length})
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="border-purple-600 text-purple-400 hover:bg-purple-600/20"
                onClick={() => setShowFavorites(!showFavorites)}
              >
                {showFavorites ? 'Hide' : 'Show'} Favorites
              </Button>
            </div>
          </CardHeader>
          {showFavorites && (
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {favoriteVenues.map((venue) => (
                  <Card key={venue.id} className="bg-[#181c24] border border-purple-500 hover:border-purple-400 transition-colors">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-white text-lg">{venue.name}</CardTitle>
                          <p className="text-gray-400 text-sm">{venue.address}</p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-white text-sm">{venue.rating.toFixed(1)}</span>
                          <span className="text-gray-400 text-xs">({venue.total_ratings})</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Venue Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Users className="w-4 h-4" />
                          <span>{venue.estimated_capacity} capacity</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-300">
                          <MapPin className="w-4 h-4" />
                          <span>{venue.location}</span>
                        </div>
                      </div>

                      {/* Genre Suitability */}
                      {venue.genre_suitability && (
                        <div className="flex items-center gap-2">
                          <Music className="w-4 h-4 text-purple-400" />
                          <span className="text-gray-300 text-sm">
                            Genre Suitability: {venue.genre_suitability}/10
                          </span>
                        </div>
                      )}

                      {/* Description */}
                      {venue.description && (
                        <p className="text-gray-300 text-sm">{venue.description}</p>
                      )}

                      {/* Booking Difficulty */}
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline" 
                          className={getDifficultyColor(venue.booking_difficulty)}
                        >
                          {getDifficultyText(venue.booking_difficulty)}
                        </Badge>
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-2">
                        {venue.phone && (
                          <div className="flex items-center gap-2 text-gray-300 text-sm">
                            <Phone className="w-4 h-4" />
                            <span>{formatPhoneNumber(venue.phone)}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center gap-2 text-gray-300 text-sm">
                          <Mail className="w-4 h-4" />
                          <span>{generateEmail(venue)}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-red-600 text-red-400 hover:bg-red-600/20"
                          onClick={() => onToggleFavorite(venue)}
                        >
                          <Heart className="w-4 h-4 mr-2 fill-current" />
                          Remove
                        </Button>
                        
                        {venue.website && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                            onClick={() => window.open(venue.website, '_blank')}
                          >
                            <Globe className="w-4 h-4 mr-2" />
                            Website
                          </Button>
                        )}
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                          onClick={() => onVenueEmailClick?.(venue)}
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Email Assistant
                        </Button>
                        
                        {venue.phone && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                            onClick={() => window.open(`tel:${venue.phone.replace(/\D/g, '')}`, '_blank')}
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Call
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Venues List */}
      {venues.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-white">
              Found {venues.length} Venues
            </h3>
            <Badge variant="outline" className="text-purple-400 border-purple-400">
              AI Enhanced
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {venues.map((venue) => (
              <Card key={venue.id} className="bg-[#181c24] border border-gray-700 hover:border-purple-500 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-white text-lg">{venue.name}</CardTitle>
                      <p className="text-gray-400 text-sm">{venue.address}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-white text-sm">{venue.rating.toFixed(1)}</span>
                      <span className="text-gray-400 text-xs">({venue.total_ratings})</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Venue Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Users className="w-4 h-4" />
                      <span>{venue.estimated_capacity} capacity</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <MapPin className="w-4 h-4" />
                      <span>{venue.location}</span>
                    </div>
                  </div>

                  {/* Genre Suitability */}
                  {venue.genre_suitability && (
                    <div className="flex items-center gap-2">
                      <Music className="w-4 h-4 text-purple-400" />
                      <span className="text-gray-300 text-sm">
                        Genre Suitability: {venue.genre_suitability}/10
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  {venue.description && (
                    <p className="text-gray-300 text-sm">{venue.description}</p>
                  )}

                  {/* Booking Difficulty */}
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={getDifficultyColor(venue.booking_difficulty)}
                    >
                      {getDifficultyText(venue.booking_difficulty)}
                    </Badge>
                  </div>

                  {/* Contact Information */}
                  <div className="space-y-2">
                    {venue.phone && (
                      <div className="flex items-center gap-2 text-gray-300 text-sm">
                        <Phone className="w-4 h-4" />
                        <span>{formatPhoneNumber(venue.phone)}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-gray-300 text-sm">
                      <Mail className="w-4 h-4" />
                      <span>{generateEmail(venue)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {/* Favorite Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className={`border-gray-600 text-gray-300 hover:bg-gray-700 ${
                        isVenueFavorited(venue.id) ? 'bg-red-600/20 border-red-500 text-red-400' : ''
                      }`}
                      onClick={() => {
                        console.log('🖱️ Favorite button clicked for venue:', venue.name);
                        onToggleFavorite(venue);
                      }}
                    >
                      <Heart className={`w-4 h-4 mr-2 ${isVenueFavorited(venue.id) ? 'fill-current' : ''}`} />
                      {isVenueFavorited(venue.id) ? 'Favorited' : 'Favorite'}
                    </Button>
                    
                    {venue.website && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                        onClick={() => window.open(venue.website, '_blank')}
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        Website
                      </Button>
                    )}
                    
                    {/* Email Assistant Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                      onClick={() => onVenueEmailClick?.(venue)}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email Assistant
                    </Button>
                    
                    {venue.phone && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
                        onClick={() => window.open(`tel:${venue.phone.replace(/\D/g, '')}`, '_blank')}
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                    )}
                  </div>

                  {/* Booking Requirements */}
                  {venue.booking_requirements && venue.booking_requirements.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-white mb-2">Booking Requirements:</h4>
                      <div className="flex flex-wrap gap-1">
                        {venue.booking_requirements.map((req, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Amenities */}
                  {venue.amenities && venue.amenities.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-white mb-2">Likely Amenities:</h4>
                      <div className="flex flex-wrap gap-1">
                        {venue.amenities.map((amenity, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs text-gray-400 border-gray-600">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {!loading && venues.length === 0 && !error && (
        <Card className="bg-[#0f1216] border border-gray-700">
          <CardContent className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Ready to discover venues</h3>
            <p className="text-gray-400">
              Enter a location above to find real venues with contact information and AI-powered insights.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TargetVenuesDisplay; 