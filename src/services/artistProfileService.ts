import { supabaseService } from './supabaseService';
import type { Database } from '@/lib/supabase';

type ArtistProfile = Database['public']['Tables']['artist_profiles']['Row'];
type Project = Database['public']['Tables']['projects']['Row'];

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
  // Artist Profile Management
  async createProfile(userId: string, profileData: Partial<ArtistProfile>): Promise<ArtistProfile | null> {
    try {
      console.log('Creating profile with data:', profileData);
      const profile = await supabaseService.createArtistProfile({
        user_id: userId,
        artist_name: profileData.artist_name || '',
        email: profileData.email || '',
        profile_photo: profileData.profile_photo || '/placeholder.svg',
        banner_photo: profileData.banner_photo || '/placeholder.svg',
        bio: profileData.bio || '',
        genre: profileData.genre || [],
        location: profileData.location || '',
        social_links: profileData.social_links || {},
        career_highlights: (profileData as any).career_highlights || [],
        musical_style: (profileData as any).musical_style || '',
        influences: (profileData as any).influences || '',
      });
      console.log('Profile created successfully:', profile);
      return profile;
    } catch (error) {
      console.error('Error creating artist profile:', error);
      return null;
    }
  }

  async updateProfile(profileId: string, updates: Partial<ArtistProfile>): Promise<ArtistProfile | null> {
    try {
      const profile = await supabaseService.updateArtistProfile(profileId, updates);
      return profile;
    } catch (error) {
      console.error('Error updating artist profile:', error);
      return null;
    }
  }

  async getProfileByUserId(userId: string): Promise<ArtistProfile | null> {
    try {
      const profile = await supabaseService.getArtistProfileByUserId(userId);
      return profile;
    } catch (error) {
      console.error('Error getting artist profile by user ID:', error);
      return null;
    }
  }

  async getProfileById(profileId: string): Promise<ArtistProfile | null> {
    try {
      const profile = await supabaseService.getArtistProfileById(profileId);
      return profile;
    } catch (error) {
      console.error('Error getting artist profile by ID:', error);
      return null;
    }
  }

  async getAllProfiles(): Promise<ArtistProfile[]> {
    try {
      const profiles = await supabaseService.getAllArtistProfiles();
      return profiles;
    } catch (error) {
      console.error('Error getting all artist profiles:', error);
      return [];
    }
  }

  async deleteProfile(profileId: string): Promise<boolean> {
    try {
      const result = await supabaseService.deleteArtistProfile(profileId);
      return result;
    } catch (error) {
      console.error('Error deleting artist profile:', error);
      return false;
    }
  }

  async approveProfile(profileId: string, approvedBy: string): Promise<ArtistProfile | null> {
    try {
      const profile = await supabaseService.approveArtistProfile(profileId, approvedBy);
      return profile;
    } catch (error) {
      console.error('Error approving artist profile:', error);
      return null;
    }
  }

  async rejectProfile(profileId: string, rejectedBy: string): Promise<ArtistProfile | null> {
    try {
      const profile = await supabaseService.rejectArtistProfile(profileId, rejectedBy);
      return profile;
    } catch (error) {
      console.error('Error rejecting artist profile:', error);
      return null;
    }
  }

  async getApprovedProfiles(): Promise<ArtistProfile[]> {
    try {
      const profiles = await supabaseService.getApprovedArtistProfiles();
      return profiles;
    } catch (error) {
      console.error('Error getting approved artist profiles:', error);
      return [];
    }
  }

  async getPendingProfiles(): Promise<ArtistProfile[]> {
    try {
      const allProfiles = await supabaseService.getAllArtistProfiles();
      return allProfiles.filter(profile => profile.status === 'pending');
    } catch (error) {
      console.error('Error getting pending artist profiles:', error);
      return [];
    }
  }

  // Project Management
  async createProject(artistId: string, projectData: Partial<ArtistProject>): Promise<ArtistProject | null> {
    try {
      const project = await supabaseService.createProject({
        artist_id: artistId,
        title: projectData.title || '',
        description: projectData.description || '',
        detailed_description: projectData.detailedDescription || '',
        banner_image: projectData.bannerImage || '/placeholder.svg',
        project_type: (projectData.projectType as any) || 'album',
        genre: projectData.genre || [],
        funding_goal: projectData.fundingGoal || 0,
        min_investment: projectData.minInvestment || 0,
        max_investment: projectData.maxInvestment || 0,
        expected_roi: projectData.expectedROI || 0,
        project_duration: projectData.projectDuration || '',
        deadline: projectData.deadline || '',
      });

      if (project) {
        // Convert to ArtistProject format for backward compatibility
        return {
          id: project.id,
          artistId: project.artist_id,
          artistName: '', // Will need to be fetched separately
          title: project.title,
          description: project.description,
          detailedDescription: project.detailed_description,
          bannerImage: project.banner_image,
          genre: project.genre,
          projectType: project.project_type as any,
          fundingGoal: project.funding_goal,
          currentFunding: 0,
          minInvestment: project.min_investment,
          maxInvestment: project.max_investment,
          expectedROI: project.expected_roi,
          projectDuration: project.project_duration,
          deadline: project.deadline,
          status: project.status as any,
          contractTerms: this.createBasicContract(project.id),
          fundingBreakdown: this.generateFundingBreakdown(project.funding_goal),
          rewards: this.generateBasicRewards(project.project_type),
          createdAt: project.created_at,
          updatedAt: project.updated_at,
        };
      }
      return null;
    } catch (error) {
      console.error('Error creating project:', error);
      return null;
    }
  }

  async updateProject(projectId: string, updates: Partial<ArtistProject>): Promise<ArtistProject | null> {
    try {
      // Note: We'll need to add an update method to supabaseService
      // For now, return null
      console.warn('Project update not yet implemented in Supabase service');
      return null;
    } catch (error) {
      console.error('Error updating project:', error);
      return null;
    }
  }

  async getProjectsByArtistId(artistId: string): Promise<ArtistProject[]> {
    try {
      const projects = await supabaseService.getProjectsByArtist(artistId);
      return projects.map(project => ({
        id: project.id,
        artistId: project.artist_id,
        artistName: '', // Will need to be fetched separately
        title: project.title,
        description: project.description,
        detailedDescription: project.detailed_description,
        bannerImage: project.banner_image,
        genre: project.genre,
        projectType: project.project_type as any,
        fundingGoal: project.funding_goal,
        currentFunding: 0,
        minInvestment: project.min_investment,
        maxInvestment: project.max_investment,
        expectedROI: project.expected_roi,
        projectDuration: project.project_duration,
        deadline: project.deadline,
        status: project.status as any,
        contractTerms: this.createBasicContract(project.id),
        fundingBreakdown: this.generateFundingBreakdown(project.funding_goal),
        rewards: this.generateBasicRewards(project.project_type),
        createdAt: project.created_at,
        updatedAt: project.updated_at,
      }));
    } catch (error) {
      console.error('Error getting projects by artist ID:', error);
      return [];
    }
  }

  async getProjectById(projectId: string): Promise<ArtistProject | null> {
    try {
      const project = await supabaseService.getProjectById(projectId);
      if (!project) return null;

      return {
        id: project.id,
        artistId: project.artist_id,
        artistName: '', // Will need to be fetched separately
        title: project.title,
        description: project.description,
        detailedDescription: project.detailed_description,
        bannerImage: project.banner_image,
        genre: project.genre,
        projectType: project.project_type as any,
        fundingGoal: project.funding_goal,
        currentFunding: 0, // Will need to be calculated from investments
        minInvestment: project.min_investment,
        maxInvestment: project.max_investment,
        expectedROI: project.expected_roi,
        projectDuration: project.project_duration,
        deadline: project.deadline,
        status: project.status as any,
        contractTerms: this.createBasicContract(project.id),
        fundingBreakdown: this.generateFundingBreakdown(project.funding_goal),
        rewards: this.generateBasicRewards(project.project_type),
        createdAt: project.created_at,
        updatedAt: project.updated_at,
      };
    } catch (error) {
      console.error('Error getting project by ID:', error);
      return null;
    }
  }

  async getAllProjects(): Promise<ArtistProject[]> {
    try {
      const projects = await supabaseService.getAllProjects();
      return projects.map(project => ({
        id: project.id,
        artistId: project.artist_id,
        artistName: '', // Will need to be fetched separately
        title: project.title,
        description: project.description,
        detailedDescription: project.detailed_description,
        bannerImage: project.banner_image,
        genre: project.genre,
        projectType: project.project_type as any,
        fundingGoal: project.funding_goal,
        currentFunding: 0,
        minInvestment: project.min_investment,
        maxInvestment: project.max_investment,
        expectedROI: project.expected_roi,
        projectDuration: project.project_duration,
        deadline: project.deadline,
        status: project.status as any,
        contractTerms: this.createBasicContract(project.id),
        fundingBreakdown: this.generateFundingBreakdown(project.funding_goal),
        rewards: this.generateBasicRewards(project.project_type),
        createdAt: project.created_at,
        updatedAt: project.updated_at,
      }));
    } catch (error) {
      console.error('Error getting all projects:', error);
      return [];
    }
  }

  async publishProject(projectId: string): Promise<ArtistProject | null> {
    try {
      // Note: We'll need to add a publish method to supabaseService
      // For now, return null
      console.warn('Project publish not yet implemented in Supabase service');
      return null;
    } catch (error) {
      console.error('Error publishing project:', error);
      return null;
    }
  }

  // Contract Management (keeping these as local for now)
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
        intellectualPropertyRights: 'Artist retains full IP rights',
        revenueSharing: 'Standard revenue sharing terms apply',
        disputeResolution: 'Arbitration in accordance with industry standards'
      },
      customTerms: '',
      artistTerms: '',
      legalDisclaimer: 'This is a legally binding contract. Please review all terms carefully.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  updateContract(contractId: string, updates: Partial<ProjectContract>): ProjectContract | null {
    // Keeping this local for now
    console.warn('Contract update not yet implemented in Supabase service');
    return null;
  }

  getContractByProjectId(projectId: string): ProjectContract | null {
    // Keeping this local for now
    return this.createBasicContract(projectId);
  }

  getAllContracts(): Record<string, ProjectContract> {
    // Keeping this local for now
    return {};
  }

  // Helper methods (keeping these as local for now)
  generateFundingBreakdown(totalAmount: number): FundingBreakdown[] {
    return [
      {
        id: `breakdown_${Date.now()}_1`,
        category: 'Production',
        description: 'Studio recording, mixing, and mastering',
        amount: totalAmount * 0.4,
        percentage: 40
      },
      {
        id: `breakdown_${Date.now()}_2`,
        category: 'Marketing',
        description: 'Promotion, advertising, and PR',
        amount: totalAmount * 0.3,
        percentage: 30
      },
      {
        id: `breakdown_${Date.now()}_3`,
        category: 'Distribution',
        description: 'Digital and physical distribution',
        amount: totalAmount * 0.2,
        percentage: 20
      },
      {
        id: `breakdown_${Date.now()}_4`,
        category: 'Miscellaneous',
        description: 'Contingency and other expenses',
        amount: totalAmount * 0.1,
        percentage: 10
      }
    ];
  }

  generateBasicRewards(projectType: string): InvestmentReward[] {
    return [
      {
        id: `reward_${Date.now()}_1`,
        minInvestment: 50,
        title: 'Early Access',
        description: 'Get early access to the finished project',
        deliveryDate: 'Upon completion'
      },
      {
        id: `reward_${Date.now()}_2`,
        minInvestment: 100,
        title: 'Digital Download',
        description: 'Free digital download of the project',
        deliveryDate: 'Upon release'
      },
      {
        id: `reward_${Date.now()}_3`,
        minInvestment: 250,
        title: 'Physical Copy',
        description: 'Signed physical copy of the project',
        deliveryDate: 'Upon release'
      }
    ];
  }
}

export const artistProfileService = new ArtistProfileService(); 