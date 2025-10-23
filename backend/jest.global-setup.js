// Global setup for Jest tests
module.exports = async () => {
  // Set test environment variables
  process.env.NODE_ENV = 'test';
  process.env.PORT = '3001';
  process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/content_studio_test';
  
  console.log('🧪 Test environment configured');
};

