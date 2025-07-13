
import axios from 'axios';
import { ArtistStats } from './artistStats';

// This interface defines the structure of the insights we'll get from OpenAI
export interface ArtistInsights {
  investmentPotential: string;
  marketTrends: string;
  audienceGrowth: string;
  riskAssessment: string;
}

/**
 * Get AI-powered insights about an artist based on their statistics
 */
export const getArtistInsights = async (
  artistStats: ArtistStats,
  apiKey: string
): Promise<ArtistInsights | null> => {
  if (!apiKey) {
    console.error('OpenAI API key is missing');
    return null;
  }

  try {
    // Create a concise prompt with the most relevant artist data
    const prompt = `
      Analyze this musician's data and provide brief investment insights:
      
      Artist: ${artistStats.name}
      Monthly Listeners: ${artistStats.monthlyListeners?.toLocaleString() || 'Unknown'}
      Total Plays: ${artistStats.playcount?.toLocaleString() || 'Unknown'}
      Followers: ${artistStats.followers?.total.toLocaleString() || 'Unknown'}
      
      Albums: ${artistStats.albums?.length || 0}
      Top Tracks: ${artistStats.trackStats?.length || 0}
      
      Additional Stats: ${artistStats.stats?.map(s => `${s.category}: ${s.value} (${s.change || 0}% change)`).join(', ') || 'None'}
      
      Provide 4 brief insights about:
      1. Investment potential (1-2 sentences)
      2. Market trend analysis (1-2 sentences)
      3. Audience growth projection (1-2 sentences)
      4. Risk assessment (1-2 sentences)
    `;

    // Call OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a music industry analyst specializing in investment opportunities. Provide concise, data-driven insights without any preamble or explanations. Focus on actionable intelligence for investors.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        }
      }
    );

    // Extract insights from response
    const aiResponse = response.data.choices[0].message.content;
    
    // Parse the AI response into structured insights
    const insights: ArtistInsights = {
      investmentPotential: extractInsight(aiResponse, 'Investment potential'),
      marketTrends: extractInsight(aiResponse, 'Market trend'),
      audienceGrowth: extractInsight(aiResponse, 'Audience growth'),
      riskAssessment: extractInsight(aiResponse, 'Risk assessment')
    };

    return insights;
  } catch (error) {
    console.error('Error getting AI insights:', error);
    return null;
  }
};

// Helper function to extract insights from the AI response
const extractInsight = (text: string, category: string): string => {
  // Try to find the section that matches the category
  const regex = new RegExp(`${category}[^:]*:(.+?)(?=\\d+\\.|\n\n|$)`, 'i');
  const match = text.match(regex);
  
  if (match && match[1]) {
    return match[1].trim();
  }
  
  // If no match found, try to extract based on numbering
  const numberedRegex = new RegExp(`\\d+\\.[^:]*${category}[^:]*:(.+?)(?=\\d+\\.|\n\n|$)`, 'i');
  const numberedMatch = text.match(numberedRegex);
  
  if (numberedMatch && numberedMatch[1]) {
    return numberedMatch[1].trim();
  }
  
  return "No insight available";
};

// Simulated insights for when API key is not available
export const getSimulatedInsights = (artistStats: ArtistStats): ArtistInsights => {
  const popularity = artistStats.followers?.total || 0;
  const isPopular = popularity > 1000000;
  
  return {
    investmentPotential: isPopular
      ? `${artistStats.name} shows strong commercial viability with potential for 12-15% ROI based on current growth metrics.`
      : `${artistStats.name} demonstrates modest investment potential with projected 5-8% ROI in the next fiscal year.`,
    marketTrends: isPopular
      ? `Gaining significant traction in the ${artistStats.trackStats?.length || 0} major markets, with streaming numbers exceeding industry averages by 22%.`
      : `Currently showing growth in niche markets, with opportunity to expand further into mainstream segments.`,
    audienceGrowth: isPopular
      ? `Expected to increase follower base by 25-30% annually, particularly strong among 18-34 demographic.`
      : `Steady audience growth of 10-15% projected, with opportunities to leverage emerging platforms.`,
    riskAssessment: isPopular
      ? `Low risk investment with established market presence and diverse revenue streams.`
      : `Moderate risk profile with potential for higher returns; recommend diversified investment approach.`
  };
};
