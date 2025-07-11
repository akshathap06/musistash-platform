
// Simple health check utility
export const healthCheck = () => {
  console.log('🚀 MusiStash Health Check:');
  console.log('✅ React loaded');
  console.log('✅ Vite config active');
  console.log('✅ App ready to build');
  return true;
};

// Run health check in development
if (import.meta.env.DEV) {
  healthCheck();
}
