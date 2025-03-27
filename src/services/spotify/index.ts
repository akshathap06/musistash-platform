
export * from './spotifyTypes';
export { default as spotifyService } from './spotifyService';

// Re-export the main service as the default
import spotifyService from './spotifyService';
export default spotifyService;
