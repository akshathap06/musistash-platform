export interface ArtistProfile {
  id: string;
  userId: string;
  artistName: string;
  email: string;
  profilePhoto: string;
  bannerPhoto: string;
  bio: string;
  genre: string[];
  location: string;
  socialLinks: {
    spotify?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    website?: string;
  };
  isVerified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ArtistProject {
  id: string;
  artistId: string;
  artistName: string;
  title: string;
  description: string;
  detailedDescription: string;
  bannerImage: string;
  genre: string[];
  projectType: 'album' | 'ep' | 'single' | 'tour' | 'merchandise' | 'other';
  fundingGoal: number;
  currentFunding: number;
  minInvestment: number;
  maxInvestment: number;
  expectedROI: number;
  projectDuration: string; // e.g., "6 months"
  deadline: string;
  status: 'draft' | 'active' | 'funded' | 'completed' | 'cancelled';
  contractTerms: ProjectContract;
  fundingBreakdown: FundingBreakdown[];
  rewards: InvestmentReward[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectContract {
  id: string;
  projectId: string;
  templateType: 'basic' | 'advanced' | 'custom';
  terms: {
    roiPercentage: number;
    paymentSchedule: 'monthly' | 'quarterly' | 'annually' | 'on_completion';
    contractDuration: string;
    earlyTermination: boolean;
    intellectualPropertyRights: string;
    revenueSharing: string;
    disputeResolution: string;
  };
  customTerms: string;
  artistTerms: string; // Artist-added terms and conditions
  legalDisclaimer: string;
  createdAt: string;
  updatedAt: string;
}

export interface FundingBreakdown {
  id: string;
  category: string;
  description: string;
  amount: number;
  percentage: number;
}

export interface InvestmentReward {
  id: string;
  minInvestment: number;
  title: string;
  description: string;
  deliveryDate?: string;
}

class ArtistProfileService {
  private storageKey = 'artist_profiles';
  private projectsKey = 'artist_projects';
  private contractsKey = 'project_contracts';

  // Artist Profile Management
  createProfile(userId: string, profileData: Partial<ArtistProfile>): ArtistProfile {
    const profiles = this.getAllProfiles();
    const newProfile: ArtistProfile = {
      id: `profile_${Date.now()}`,
      userId,
      artistName: profileData.artistName || '',
      email: profileData.email || '',
      profilePhoto: profileData.profilePhoto || '/placeholder.svg',
      bannerPhoto: profileData.bannerPhoto || '/placeholder.svg',
      bio: profileData.bio || '',
      genre: profileData.genre || [],
      location: profileData.location || '',
      socialLinks: profileData.socialLinks || {},
      isVerified: false,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    profiles[newProfile.id] = newProfile;
    localStorage.setItem(this.storageKey, JSON.stringify(profiles));
    return newProfile;
  }

  updateProfile(profileId: string, updates: Partial<ArtistProfile>): ArtistProfile | null {
    const profiles = this.getAllProfiles();
    const profile = profiles[profileId];
    
    if (!profile) return null;

    const updatedProfile = {
      ...profile,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    profiles[profileId] = updatedProfile;
    localStorage.setItem(this.storageKey, JSON.stringify(profiles));
    return updatedProfile;
  }

  getProfileByUserId(userId: string): ArtistProfile | null {
    const profiles = this.getAllProfiles();
    return Object.values(profiles).find(profile => profile.userId === userId) || null;
  }

  getProfileById(profileId: string): ArtistProfile | null {
    const profiles = this.getAllProfiles();
    return profiles[profileId] || null;
  }

  getAllProfiles(): Record<string, ArtistProfile> {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : {};
  }

  deleteProfile(profileId: string): boolean {
    const profiles = this.getAllProfiles();
    if (!profiles[profileId]) {
      return false;
    }
    
    delete profiles[profileId];
    localStorage.setItem(this.storageKey, JSON.stringify(profiles));
    return true;
  }

  approveProfile(profileId: string, approvedBy: string): ArtistProfile | null {
    const profiles = this.getAllProfiles();
    const profile = profiles[profileId];
    
    if (!profile) return null;

    const updatedProfile = {
      ...profile,
      status: 'approved' as const,
      isVerified: true,
      approvedAt: new Date().toISOString(),
      approvedBy,
      updatedAt: new Date().toISOString(),
    };

    profiles[profileId] = updatedProfile;
    localStorage.setItem(this.storageKey, JSON.stringify(profiles));
    return updatedProfile;
  }

  rejectProfile(profileId: string, rejectedBy: string): ArtistProfile | null {
    const profiles = this.getAllProfiles();
    const profile = profiles[profileId];
    
    if (!profile) return null;

    const updatedProfile = {
      ...profile,
      status: 'rejected' as const,
      updatedAt: new Date().toISOString(),
    };

    profiles[profileId] = updatedProfile;
    localStorage.setItem(this.storageKey, JSON.stringify(profiles));
    return updatedProfile;
  }

  getApprovedProfiles(): ArtistProfile[] {
    const profiles = this.getAllProfiles();
    return Object.values(profiles).filter(profile => profile.status === 'approved');
  }

  getPendingProfiles(): ArtistProfile[] {
    const profiles = this.getAllProfiles();
    return Object.values(profiles).filter(profile => profile.status === 'pending');
  }

  // Project Management
  createProject(artistId: string, projectData: Partial<ArtistProject>): ArtistProject {
    const projects = this.getAllProjects();
    const artist = this.getProfileById(artistId);
    
    if (!artist) throw new Error('Artist profile not found');

    const newProject: ArtistProject = {
      id: `project_${Date.now()}`,
      artistId,
      artistName: artist.artistName,
      title: projectData.title || '',
      description: projectData.description || '',
      detailedDescription: projectData.detailedDescription || '',
      bannerImage: projectData.bannerImage || '/placeholder.svg',
      genre: projectData.genre || [],
      projectType: projectData.projectType || 'other',
      fundingGoal: projectData.fundingGoal || 0,
      currentFunding: 0,
      minInvestment: projectData.minInvestment || 50,
      maxInvestment: projectData.maxInvestment || 10000,
      expectedROI: projectData.expectedROI || 0,
      projectDuration: projectData.projectDuration || '',
      deadline: projectData.deadline || '',
      status: 'draft',
      contractTerms: this.createBasicContract(''),
      fundingBreakdown: projectData.fundingBreakdown || [],
      rewards: projectData.rewards || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Create contract for this project
    newProject.contractTerms = this.createBasicContract(newProject.id);

    projects[newProject.id] = newProject;
    localStorage.setItem(this.projectsKey, JSON.stringify(projects));
    return newProject;
  }

  updateProject(projectId: string, updates: Partial<ArtistProject>): ArtistProject | null {
    const projects = this.getAllProjects();
    const project = projects[projectId];
    
    if (!project) return null;

    const updatedProject = {
      ...project,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    projects[projectId] = updatedProject;
    localStorage.setItem(this.projectsKey, JSON.stringify(projects));
    return updatedProject;
  }

  getProjectsByArtistId(artistId: string): ArtistProject[] {
    const projects = this.getAllProjects();
    return Object.values(projects).filter(project => project.artistId === artistId);
  }

  getProjectById(projectId: string): ArtistProject | null {
    const projects = this.getAllProjects();
    return projects[projectId] || null;
  }

  getAllProjects(): Record<string, ArtistProject> {
    const stored = localStorage.getItem(this.projectsKey);
    return stored ? JSON.parse(stored) : {};
  }

  publishProject(projectId: string): ArtistProject | null {
    const project = this.getProjectById(projectId);
    if (!project) return null;

    return this.updateProject(projectId, { status: 'active' });
  }

  // Contract Management
  createBasicContract(projectId: string): ProjectContract {
    return {
      id: `contract_${Date.now()}`,
      projectId,
      templateType: 'basic',
      terms: {
        roiPercentage: 7.5,
        paymentSchedule: 'quarterly',
        contractDuration: '2 years',
        earlyTermination: true,
        intellectualPropertyRights: 'Artist retains all intellectual property rights. Investors receive revenue sharing rights only.',
        revenueSharing: 'Revenue will be shared based on investment percentage after platform fees and artist expenses.',
        disputeResolution: 'Any disputes will be resolved through binding arbitration.',
      },
      customTerms: '',
      artistTerms: '',
      legalDisclaimer: 'This is not a guarantee of returns. All investments carry risk. Please consult with a financial advisor before investing.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  updateContract(contractId: string, updates: Partial<ProjectContract>): ProjectContract | null {
    const contracts = this.getAllContracts();
    const contract = contracts[contractId];
    
    if (!contract) return null;

    const updatedContract = {
      ...contract,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    contracts[contractId] = updatedContract;
    localStorage.setItem(this.contractsKey, JSON.stringify(contracts));
    return updatedContract;
  }

  getContractByProjectId(projectId: string): ProjectContract | null {
    const contracts = this.getAllContracts();
    return Object.values(contracts).find(contract => contract.projectId === projectId) || null;
  }

  getAllContracts(): Record<string, ProjectContract> {
    const stored = localStorage.getItem(this.contractsKey);
    return stored ? JSON.parse(stored) : {};
  }

  // Utility methods
  generateFundingBreakdown(totalAmount: number): FundingBreakdown[] {
    return [
      {
        id: `breakdown_${Date.now()}_1`,
        category: 'Production',
        description: 'Studio time, equipment, and technical resources',
        amount: Math.round(totalAmount * 0.4),
        percentage: 40,
      },
      {
        id: `breakdown_${Date.now()}_2`,
        category: 'Marketing & Promotion',
        description: 'Digital marketing, PR, and promotional campaigns',
        amount: Math.round(totalAmount * 0.3),
        percentage: 30,
      },
      {
        id: `breakdown_${Date.now()}_3`,
        category: 'Distribution',
        description: 'Streaming platforms, physical distribution, and licensing',
        amount: Math.round(totalAmount * 0.2),
        percentage: 20,
      },
      {
        id: `breakdown_${Date.now()}_4`,
        category: 'Platform & Legal',
        description: 'Platform fees, legal documentation, and administrative costs',
        amount: Math.round(totalAmount * 0.1),
        percentage: 10,
      },
    ];
  }

  generateBasicRewards(projectType: string): InvestmentReward[] {
    const baseRewards = [
      {
        id: `reward_${Date.now()}_1`,
        minInvestment: 50,
        title: 'Digital Download',
        description: 'Early access to the completed project and digital download',
        deliveryDate: 'Upon project completion',
      },
      {
        id: `reward_${Date.now()}_2`,
        minInvestment: 200,
        title: 'Exclusive Merchandise',
        description: 'Limited edition merchandise + all previous rewards',
        deliveryDate: 'Upon project completion',
      },
      {
        id: `reward_${Date.now()}_3`,
        minInvestment: 500,
        title: 'Producer Credit',
        description: 'Executive producer credit + all previous rewards',
        deliveryDate: 'Upon project completion',
      },
    ];

    if (projectType === 'tour') {
      baseRewards.push({
        id: `reward_${Date.now()}_4`,
        minInvestment: 1000,
        title: 'VIP Concert Experience',
        description: 'VIP tickets to tour dates + meet and greet + all previous rewards',
        deliveryDate: 'During tour dates',
      });
    }

    return baseRewards;
  }
}

export const artistProfileService = new ArtistProfileService();
export default artistProfileService; 