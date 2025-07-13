export interface Artist {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  genres: string[];
  followers: number;
  verified: boolean;
  successRate: number;
}

export interface Project {
  id: string;
  artistId: string;
  title: string;
  description: string;
  image: string;
  fundingGoal: number;
  currentFunding: number;
  roi: number;
  deadline: string;
  packages: Package[];
  status: 'active' | 'funded' | 'completed';
  createdAt: string;
}

export interface Package {
  id: string;
  title: string;
  description: string;
  cost: number;
  provider: string;
  type: 'producer' | 'studio' | 'marketing' | 'other';
}

export interface Investment {
  id: string;
  userId: string;
  projectId: string;
  amount: number;
  date: string;
  status: 'pending' | 'completed' | 'canceled';
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'artist' | 'listener' | 'developer';
  bio?: string;
  createdAt: string;
}

export interface ServiceProvider {
  id: string;
  name: string;
  avatar: string;
  title: string;
  bio: string;
  services: Service[];
  rating: number;
  completedProjects: number;
  location: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  category: 'production' | 'mixing' | 'mastering' | 'recording' | 'marketing' | 'other';
  features: string[];
  contractUrl: string;
}

export const artists: Artist[] = [
  {
    id: '1',
    name: 'Aria Luna',
    avatar: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=300&h=300',
    bio: 'Electro-pop artist pushing boundaries with innovative sound design and heartfelt lyrics.',
    genres: ['Electro-Pop', 'Alternative'],
    followers: 45000,
    verified: true,
    successRate: 85
  },
  {
    id: '2',
    name: 'Nexus Rhythm',
    avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=300&h=300',
    bio: 'Hip-hop collective bringing fresh perspectives through collaborative storytelling.',
    genres: ['Hip-Hop', 'R&B'],
    followers: 78000,
    verified: true,
    successRate: 92
  },
  {
    id: '3',
    name: 'Echo Horizon',
    avatar: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=300&h=300',
    bio: 'Indie rock band blending nostalgic sounds with futuristic production techniques.',
    genres: ['Indie Rock', 'Shoegaze'],
    followers: 32000,
    verified: false,
    successRate: 78
  }
];

export const projects: Project[] = [
  {
    id: '1',
    artistId: '1',
    title: 'Lunar Echoes - Debut Album',
    description: 'My first full-length album exploring themes of technology and human connection through electro-pop.',
    image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&h=500',
    fundingGoal: 50000,
    currentFunding: 32500,
    roi: 7.5,
    deadline: '2023-12-31',
    packages: [
      {
        id: '1a',
        title: 'Production Package',
        description: 'Professional studio production with award-winning producer Sam Richards.',
        cost: 20000,
        provider: 'Skyline Studios',
        type: 'producer'
      },
      {
        id: '1b',
        title: 'Studio Recording',
        description: 'Two weeks in a premium recording studio with top-tier equipment.',
        cost: 15000,
        provider: 'Resonance Studios',
        type: 'studio'
      },
      {
        id: '1c',
        title: 'Digital Marketing Campaign',
        description: 'Comprehensive online marketing including social media and playlist placement.',
        cost: 15000,
        provider: 'Pulse Marketing',
        type: 'marketing'
      }
    ],
    status: 'active',
    createdAt: '2023-06-15'
  },
  {
    id: '2',
    artistId: '2',
    title: 'Urban Perspectives - Mixtape',
    description: 'A collaborative mixtape featuring emerging artists from across the city.',
    image: 'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?auto=format&fit=crop&w=800&h=500',
    fundingGoal: 75000,
    currentFunding: 58000,
    roi: 10,
    deadline: '2023-11-30',
    packages: [
      {
        id: '2a',
        title: 'Beat Production',
        description: 'Original beats from top producers in the industry.',
        cost: 30000,
        provider: 'Beat Labs',
        type: 'producer'
      },
      {
        id: '2b',
        title: 'Studio Sessions',
        description: 'Recording sessions at premium urban studio.',
        cost: 25000,
        provider: 'Flow Studios',
        type: 'studio'
      },
      {
        id: '2c',
        title: 'Street Marketing',
        description: 'Grassroots marketing campaign across major urban centers.',
        cost: 20000,
        provider: 'Urban Reach',
        type: 'marketing'
      }
    ],
    status: 'active',
    createdAt: '2023-07-20'
  },
  {
    id: '3',
    artistId: '3',
    title: 'Endless Horizons - EP',
    description: 'A 5-track EP exploring atmospheric soundscapes and emotional narratives.',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&h=500',
    fundingGoal: 35000,
    currentFunding: 21000,
    roi: 6,
    deadline: '2024-01-15',
    packages: [
      {
        id: '3a',
        title: 'Production & Mixing',
        description: 'Full production and professional mixing services.',
        cost: 18000,
        provider: 'Ambient Productions',
        type: 'producer'
      },
      {
        id: '3b',
        title: 'Studio Time',
        description: 'One week in an atmospheric recording space.',
        cost: 10000,
        provider: 'Echo Chamber Studios',
        type: 'studio'
      },
      {
        id: '3c',
        title: 'Digital Release Strategy',
        description: 'Strategic digital release across streaming platforms.',
        cost: 7000,
        provider: 'Indie Promotions',
        type: 'marketing'
      }
    ],
    status: 'active',
    createdAt: '2023-08-05'
  }
];

export const similarityData = [
  {
    artist: "Aria Luna",
    similarTo: "Billie Eilish",
    similarity: 85,
    reasons: [
      "Electronic production with organic elements",
      "Introspective and emotional lyrics",
      "Innovative vocal techniques and layering",
      "Strong visual aesthetic and branding"
    ],
    commercialPotential: 92
  },
  {
    artist: "Nexus Rhythm",
    similarTo: "Kendrick Lamar",
    similarity: 78,
    reasons: [
      "Socially conscious storytelling",
      "Complex rhythmic patterns",
      "Jazz and soul influences",
      "Diverse collaborative approach"
    ],
    commercialPotential: 88
  },
  {
    artist: "Echo Horizon",
    similarTo: "The 1975",
    similarity: 82,
    reasons: [
      "Blend of indie rock with electronic elements",
      "Nostalgic 80s influences",
      "Emotional, narrative-driven songwriting",
      "Atmospheric production techniques"
    ],
    commercialPotential: 85
  }
];

export const investments: Investment[] = [
  {
    id: '1',
    userId: 'user1',
    projectId: '1',
    amount: 5000,
    date: '2023-06-20',
    status: 'completed'
  },
  {
    id: '2',
    userId: 'user2',
    projectId: '1',
    amount: 3500,
    date: '2023-06-25',
    status: 'completed'
  },
  {
    id: '3',
    userId: 'user3',
    projectId: '2',
    amount: 10000,
    date: '2023-07-30',
    status: 'completed'
  }
];

export const users: User[] = [
  {
    id: 'user1',
    name: 'Alex Morgan',
    email: 'alex@example.com',
    avatar: '/placeholder.svg',
    role: 'listener',
    createdAt: '2023-01-15'
  },
  {
    id: 'user2',
    name: 'Jordan Smith',
    email: 'jordan@example.com',
    avatar: '/placeholder.svg',
    role: 'listener',
    createdAt: '2023-02-22'
  },
  {
    id: 'user3',
    name: 'Taylor Produce',
    email: 'taylor@example.com',
    avatar: '/placeholder.svg',
    role: 'developer',
    bio: 'Award-winning producer with 15+ years of experience across multiple genres.',
    createdAt: '2023-03-10'
  }
];

export const serviceProviders: ServiceProvider[] = [
  {
    id: 'sp1',
    name: 'Alex Thompson',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300',
    title: 'Grammy-Winning Producer',
    bio: 'With over 15 years of experience in the music industry, I specialize in pop and R&B production. My work has been featured on multiple platinum records.',
    services: [
      {
        id: 'serv1',
        title: 'Premium Production Package',
        description: 'Full-service production including beat creation, arrangement, and vocal production. Includes 4 weeks of dedicated service with unlimited revisions.',
        price: 30000,
        duration: '4 weeks',
        category: 'production',
        features: [
          'Custom beat production',
          'Vocal arrangement and production',
          'Access to premium sound library',
          'Mixing included',
          'Two rounds of mastering',
          'Commercial release rights'
        ],
        contractUrl: '/contracts/premium-production-contract.pdf'
      },
      {
        id: 'serv2',
        title: 'Standard Mixing Package',
        description: 'Professional mixing for your already recorded tracks. Includes 3 rounds of revisions.',
        price: 5000,
        duration: '1 week',
        category: 'mixing',
        features: [
          'Up to 24 tracks',
          'Vocal processing',
          'EQ and compression',
          '3 rounds of revisions',
          'Stems delivery'
        ],
        contractUrl: '/contracts/standard-mixing-contract.pdf'
      }
    ],
    rating: 4.9,
    completedProjects: 87,
    location: 'Los Angeles, CA'
  },
  {
    id: 'sp2',
    name: 'Samantha Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&h=300',
    title: 'Marketing Specialist',
    bio: 'Former Sony Music marketing executive with a passion for helping independent artists reach their audience. Specialized in digital marketing and brand development.',
    services: [
      {
        id: 'serv3',
        title: 'Complete Marketing Campaign',
        description: 'End-to-end marketing strategy and execution for your music release. Includes social media, PR, and playlist placement.',
        price: 15000,
        duration: '8 weeks',
        category: 'marketing',
        features: [
          'Release strategy development',
          'Social media campaign management',
          'Press release and media outreach',
          'Playlist pitching',
          'Advertising campaign setup and management',
          'Performance analytics and reporting'
        ],
        contractUrl: '/contracts/marketing-campaign-contract.pdf'
      },
      {
        id: 'serv4',
        title: 'Social Media Growth Package',
        description: 'Focused campaign to grow your social media presence and engagement across platforms.',
        price: 7500,
        duration: '6 weeks',
        category: 'marketing',
        features: [
          'Content strategy development',
          'Content calendar creation',
          'Daily posting and community management',
          'Follower growth tactics',
          'Analytics and optimization',
          'Training for self-management'
        ],
        contractUrl: '/contracts/social-media-contract.pdf'
      }
    ],
    rating: 4.7,
    completedProjects: 62,
    location: 'New York, NY'
  },
  {
    id: 'sp3',
    name: 'Marcus Williams',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300',
    title: 'Mastering Engineer',
    bio: 'Specialized in bringing out the best in your mixes with a focus on maintaining dynamics while achieving competitive loudness. My credits include work with major artists across multiple genres.',
    services: [
      {
        id: 'serv5',
        title: 'Premium Mastering',
        description: 'High-end mastering for your project with a focus on detail and sonic excellence.',
        price: 3500,
        duration: '1 week',
        category: 'mastering',
        features: [
          'Up to 12 tracks',
          'Analog and digital processing',
          'Multiple format delivery (CD, Streaming, Vinyl)',
          '3 revisions included',
          'Stem mastering option',
          'Reference matching'
        ],
        contractUrl: '/contracts/premium-mastering-contract.pdf'
      },
      {
        id: 'serv6',
        title: 'Single Track Mastering',
        description: 'Professional mastering for a single track with quick turnaround.',
        price: 400,
        duration: '48 hours',
        category: 'mastering',
        features: [
          'One track',
          'Digital processing',
          'Streaming and CD masters',
          '1 revision included',
          'Quick turnaround'
        ],
        contractUrl: '/contracts/single-track-mastering-contract.pdf'
      }
    ],
    rating: 4.8,
    completedProjects: 215,
    location: 'Nashville, TN'
  }
];
