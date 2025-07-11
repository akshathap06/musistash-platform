
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArtistStats } from '@/services/artistStats';
import { Music, Users, TrendingUp, Eye } from 'lucide-react';

interface ArtistStatsDisplayProps {
  stats: ArtistStats | null | undefined;
  isLoading: boolean;
}

const ArtistStatsDisplay: React.FC<ArtistStatsDisplayProps> = ({ stats, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No artist data available. Please search for an artist.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {/* Main Stats Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            {stats.image?.url && (
              <img 
                src={stats.image.url} 
                alt={stats.image.alt || stats.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            )}
            <div>
              <CardTitle className="text-2xl">{stats.name}</CardTitle>
              <CardDescription>Artist Profile & Statistics</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Monthly Listeners</p>
                <p className="text-lg font-semibold">{stats.monthlyListeners?.toLocaleString() || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Eye className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Followers</p>
                <p className="text-lg font-semibold">{stats.followers?.toLocaleString() || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Popularity</p>
                <p className="text-lg font-semibold">{stats.popularity || 'N/A'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
              <Music className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Top Tracks</p>
                <p className="text-lg font-semibold">{stats.topTracks?.length || 0}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Genres */}
      {stats.genres && stats.genres.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Genres</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {stats.genres.map((genre, index) => (
                <Badge key={index} variant="secondary">{genre}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Tracks */}
      {stats.topTracks && stats.topTracks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Tracks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.topTracks.slice(0, 10).map((track, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="font-medium">{track}</span>
                  <Badge variant="outline">#{index + 1}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Stats */}
      {stats.stats && stats.stats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.stats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">{stat.category}</span>
                    <span className="text-sm text-muted-foreground">{stat.value}</span>
                  </div>
                  {stat.change !== undefined && (
                    <div className="flex items-center gap-2">
                      <Progress value={Math.abs(stat.change)} className="flex-1" />
                      <span className={`text-sm ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change > 0 ? '+' : ''}{stat.change}%
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ArtistStatsDisplay;
