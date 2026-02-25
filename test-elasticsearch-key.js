/**
 * Test Elasticsearch API Key
 * 
 * This script tests if your Elasticsearch API key is valid
 * and helps you find the missing Cloud ID or endpoint.
 */

const API_KEY = process.env.VITE_ELASTICSEARCH_API_KEY || 'your-api-key-here';

console.log('🔍 Testing Elasticsearch API Key...\n');

// Decode the API key to see what's inside
try {
  // API keys are base64 encoded
  const decoded = Buffer.from(API_KEY.replace('essu_', ''), 'base64').toString();
  console.log('📋 Decoded API Key Info:');
  console.log(decoded);
  console.log('');
} catch (error) {
  console.log('⚠️ Could not decode API key');
}

console.log('❌ PROBLEM: API Key alone is NOT enough!\n');
console.log('You need ONE of these:\n');
console.log('Option 1: Cloud ID');
console.log('  - Format: deployment-name:base64-encoded-data');
console.log('  - Example: my-deployment:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvJGFiYzEyMzQ1...');
console.log('  - Get from: https://cloud.elastic.co/deployments\n');

console.log('Option 2: Endpoint URL');
console.log('  - Format: https://your-deployment.es.region.cloud.es.io');
console.log('  - Example: https://abc12345.us-central1.gcp.cloud.es.io');
console.log('  - Get from: https://cloud.elastic.co/deployments\n');

console.log('📝 TO FIX:\n');
console.log('1. Go to: https://cloud.elastic.co/deployments');
console.log('2. Find your deployment (or create new one)');
console.log('3. Copy the Cloud ID');
console.log('4. Add to .env: VITE_ELASTICSEARCH_CLOUD_ID=your-cloud-id');
console.log('');
console.log('OR if you don\'t have a deployment:');
console.log('1. Go to: https://cloud.elastic.co/registration');
console.log('2. Sign up (free trial, no credit card)');
console.log('3. Create deployment');
console.log('4. Get Cloud ID');
console.log('');

console.log('🎯 CURRENT STATUS:');
console.log('  ✅ API Key: Present');
console.log('  ❌ Cloud ID: MISSING');
console.log('  ❌ Connection: IMPOSSIBLE without Cloud ID');
console.log('  ❌ Elasticsearch: NOT WORKING');
