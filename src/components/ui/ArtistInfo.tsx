
import React from 'react';
import { Link } from 'react-router-dom';
import { Artist } from '@/lib/mockData';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

interface ArtistInfoProps {
  artist: Artist;
  expanded?: boolean;
}

const ArtistInfo: React.FC<ArtistInfoProps> = ({ 
  artist, 
  expanded = false 
}) => {
  const initials = artist.name
    .split(' ')
    .map(n => n[0])
    .join('');

  return (
    <div className={`flex ${expanded ? 'flex-col items-center text-center' : 'items-center'} animate-fade-in`}>
      <Avatar className={expanded ? 'h-24 w-24 mb-4' : 'h-10 w-10 mr-3'}>
        <AvatarImage src={artist.avatar} alt={artist.name} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      
      <div className={expanded ? 'space-y-4 max-w-md text-center w-full' : 'text-center flex-1'}>
        <div className={`flex items-center ${expanded ? 'justify-center' : 'justify-center'}`}>
          <Link to={`/artist/${artist.id}`}>
            <h3 className={`font-medium hover:text-primary transition-colors ${expanded ? 'text-2xl' : ''}`}>
              {artist.name}
            </h3>
          </Link>
          {artist.verified && (
            <CheckCircle className={`text-primary ml-1 ${expanded ? 'h-5 w-5' : 'h-4 w-4'}`} />
          )}
        </div>
        
        {expanded && (
          <>
            <p className="text-muted-foreground">{artist.bio}</p>
            
            <div className="flex flex-wrap gap-2 justify-center">
              {artist.genres.map((genre, index) => (
                <Badge key={index} variant="secondary">{genre}</Badge>
              ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="text-2xl font-semibold">{artist.followers.toLocaleString()}</div>
                <div className="text-muted-foreground">Followers</div>
              </div>
              <div className="bg-secondary/50 rounded-lg p-3">
                <div className="text-2xl font-semibold">{artist.successRate}%</div>
                <div className="text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </>
        )}
        
        {!expanded && (
          <div className="text-sm text-muted-foreground text-center">
            {artist.genres.slice(0, 2).join(', ')}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtistInfo;
