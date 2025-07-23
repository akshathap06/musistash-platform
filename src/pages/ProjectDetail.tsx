import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Share2, Clock, Music, Calendar, MapPin, Ticket, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { supabaseService } from '@/services/supabaseService';


const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowArtist = async () => {
    if (!project?.artist_id) return;
    
    try {
      // TODO: Implement follow functionality
      console.log('Following artist:', project.artist_id);
      setIsFollowing(!isFollowing);
      // You can add toast notification here
    } catch (error) {
      console.error('Error following artist:', error);
    }
  };

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) {
        console.log('ProjectDetail: No project ID provided');
        return;
      }
      console.log('ProjectDetail: Fetching project with ID:', id);
      setLoading(true);
      try {
        const data = await supabaseService.getProjectById(id);
        console.log('ProjectDetail: Received project data:', data);
        if (data) {
                  console.log('ProjectDetail: Setting project with data:', {
          id: data.id,
          title: data.title,
          artist_name: (data as any).artist_name,
          artist_avatar: (data as any).artist_avatar,
          banner_image: data.banner_image ? data.banner_image.substring(0, 50) + '...' : 'null'
        });
          setProject(data);
        } else {
          console.log('ProjectDetail: No project data returned');
        }
      } catch (error) {
        console.error('ProjectDetail: Error fetching project:', error);
      } finally {
        console.log('ProjectDetail: Setting loading to false');
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0f1216]">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-white text-xl animate-pulse">Loading project...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0f1216]">
        <Navbar />
        <main className="flex-grow p-8">
          <div className="text-center mb-8">
            <div className="text-white text-xl mb-4">Project not found</div>
            <Link to="/discover-projects" className="text-blue-400 hover:text-blue-300">
              Back to Projects
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Helper: extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const match = url.match(/(?:youtu.be\/|youtube.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
    return match ? match[1] : null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0f1216]">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="relative h-[400px]">
          <img 
            src={project.banner_image || '/placeholder.svg'}
            alt={project.title}
            className="w-full h-full object-cover brightness-50"
            onError={(e) => {
              console.error('ProjectDetail: Banner image failed to load:', project.banner_image);
              e.currentTarget.src = '/placeholder.svg';
            }}
            onLoad={() => {
              console.log('ProjectDetail: Banner image loaded successfully:', project.banner_image);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f1216] to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="flex items-center gap-4 mb-4 md:mb-0">
                <img 
                  src={project.artist_avatar || '/assets/logo-cricle.png'}
                  alt={project.artist_name || 'Artist'}
                  className="w-16 h-16 rounded-full border-4 border-white shadow-lg"
                />
                <div>
                  <h1 className="text-4xl font-bold text-white mb-1">{project.title}</h1>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium text-lg">{project.artist_name || 'Unknown Artist'}</span>
                    {Array.isArray(project.genre) && project.genre.map((g: string) => (
                      <Badge key={g} className="bg-blue-600 text-white ml-2">{g}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="text-white border-white/30 hover:bg-white/10">
                  <Share2 className="w-5 h-5 mr-2" /> Share
                </Button>
                <Button 
                  className={`${isFollowing ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                  onClick={handleFollowArtist}
                >
                  <UserPlus className="w-5 h-5 mr-2" /> 
                  {isFollowing ? 'Following' : 'Follow Artist'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Bio/Description */}
            <div className="bg-[#181b2a] rounded-xl p-8 border border-gray-800/50 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-4">About this Project</h2>
              <p className="text-lg text-gray-300 mb-2">{project.description}</p>
              {project.detailed_description && <p className="text-gray-400 mb-2">{project.detailed_description}</p>}
              {project.bio && <p className="text-gray-400 italic">{project.bio}</p>}
            </div>

            {/* Media Section */}
            <div className="space-y-8">
              {/* YouTube Videos */}
              {Array.isArray(project.youtube_links) && project.youtube_links.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Watch on YouTube</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {project.youtube_links.map((url: string, idx: number) => {
                      const vid = getYouTubeId(url);
                      return vid ? (
                        <div key={idx} className="aspect-video rounded-lg overflow-hidden shadow-lg">
                          <iframe
                            src={`https://www.youtube.com/embed/${vid}`}
                            title={`YouTube Video ${idx + 1}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="w-full h-full border-0"
                          />
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
              {/* Spotify Embed */}
              {project.spotify_link && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Listen on Spotify</h3>
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <iframe
                      src={`https://open.spotify.com/embed/track/${project.spotify_link.split('/').pop()?.split('?')[0]}`}
                      width="100%"
                      height="152"
                      frameBorder="0"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      className="w-full"
                    />
                  </div>
                </div>
              )}
              {/* MP3 Audio Players */}
              {Array.isArray(project.mp3_files) && project.mp3_files.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Listen to Tracks</h3>
                  <div className="space-y-4">
                    {project.mp3_files.map((fileName: string, idx: number) => (
                      <div key={idx} className="bg-gray-900/60 rounded-lg p-4 flex items-center gap-4 shadow">
                        <Music className="w-6 h-6 text-blue-400" />
                        <div className="flex-1">
                          <div className="text-white font-medium mb-2">{fileName}</div>
                          <div className="text-gray-400 text-sm">
                            MP3 file uploaded - Audio player will be available once files are processed
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Project Details Sidebar */}
          <div className="space-y-8">
            <div className="bg-[#181b2a] rounded-xl p-6 border border-gray-800/50 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4">Project Details</h3>
              <div className="space-y-3 text-gray-300">
                {project.project_type && (
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-600 text-white capitalize">{project.project_type.replace('_', ' ')}</Badge>
                  </div>
                )}
                {project.number_of_songs && (
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-blue-400" />
                    <span>{project.number_of_songs} songs</span>
                  </div>
                )}
                {project.total_duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span>{project.total_duration} min</span>
                  </div>
                )}
                {project.show_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-400" />
                    <span>{new Date(project.show_date).toLocaleDateString()}</span>
                  </div>
                )}
                {project.show_location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span>{project.show_location}</span>
                  </div>
                )}
                {project.ticket_sale_link && (
                  <div className="mt-4">
                    <a 
                      href={project.ticket_sale_link} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <Ticket className="w-5 h-5" />
                      Buy Tickets Now
                    </a>
                  </div>
                )}
              </div>
            </div>
            {/* Artist Info */}
            <div className="bg-[#181b2a] rounded-xl p-6 border border-gray-800/50 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4">About the Artist</h3>
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={project.artist_avatar || '/assets/logo-cricle.png'}
                  alt={project.artist_name || 'Artist'}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <p className="text-white font-medium text-lg">{project.artist_name || 'Unknown Artist'}</p>
                  {project.artist_bio && <p className="text-sm text-gray-400">{project.artist_bio}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Button 
                  className={`w-full ${isFollowing ? 'bg-gray-600 hover:bg-gray-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                  onClick={handleFollowArtist}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  {isFollowing ? 'Following' : 'Follow Artist'}
                </Button>
                <Link to={`/artist-profile/${project.artist_id}`}>
                  <Button variant="outline" className="w-full">
                    View Profile
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProjectDetail;
