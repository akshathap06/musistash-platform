
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

// Mock Artists
export const artists: Artist[] = [
  {
    id: '1',
    name: 'Aria Luna',
    avatar: '/placeholder.svg',
    bio: 'Electro-pop artist pushing boundaries with innovative sound design and heartfelt lyrics.',
    genres: ['Electro-Pop', 'Alternative'],
    followers: 45000,
    verified: true,
    successRate: 85
  },
  {
    id: '2',
    name: 'Nexus Rhythm',
    avatar: '/placeholder.svg',
    bio: 'Hip-hop collective bringing fresh perspectives through collaborative storytelling.',
    genres: ['Hip-Hop', 'R&B'],
    followers: 78000,
    verified: true,
    successRate: 92
  },
  {
    id: '3',
    name: 'Echo Horizon',
    avatar: '/placeholder.svg',
    bio: 'Indie rock band blending nostalgic sounds with futuristic production techniques.',
    genres: ['Indie Rock', 'Shoegaze'],
    followers: 32000,
    verified: false,
    successRate: 78
  }
];

// Mock Projects
export const projects: Project[] = [
  {
    id: '1',
    artistId: '1',
    title: 'Lunar Echoes - Debut Album',
    description: 'My first full-length album exploring themes of technology and human connection through electro-pop.',
    image: '/placeholder.svg',
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
    image: '/placeholder.svg',
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
    image: '/placeholder.svg',
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

// Mock similarity data for AI recommendations
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

// Mock Investments
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

// Mock Users
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
