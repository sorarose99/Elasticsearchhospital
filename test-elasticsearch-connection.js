/**
 * Test Elasticsearch Connection
 * 
 * This script tests the connection to your Elasticsearch deployment
 */

const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

const client = new Client({
  node: process.env.VITE_ELASTICSEARCH_ENDPOINT,
  auth: {
    username: process.env.VITE_ELASTICSEARCH_USERNAME,
    password: process.env.VITE_ELASTICSEARCH_PASSWORD
  }
});

async function testConnection() {
  console.log('🔍 Testing Elasticsearch Connection...\n');
  console.log('📍 Endpoint:', process.env.VITE_ELASTICSEARCH_ENDPOINT);
  console.log('👤 Username:', process.env.VITE_ELASTICSEARCH_USERNAME);
  console.log('');

  try {
    // Test 1: Get cluster info
    console.log('Test 1: Getting cluster info...');
    const info = await client.info();
    console.log('✅ Connected successfully!');
    console.log('   Version:', info.version.number);
    console.log('   Cluster:', info.cluster_name);
    console.log('   Tagline:', info.tagline);
    console.log('');

    // Test 2: Check cluster health
    console.log('Test 2: Checking cluster health...');
    const health = await client.cluster.health();
    console.log('✅ Cluster health:', health.status);
    console.log('   Nodes:', health.number_of_nodes);
    console.log('   Data nodes:', health.number_of_data_nodes);
    console.log('');

    // Test 3: List existing indexes
    console.log('Test 3: Listing indexes...');
    const indexes = await client.cat.indices({ format: 'json' });
    if (indexes.length > 0) {
      console.log('✅ Found', indexes.length, 'indexes:');
      indexes.forEach(idx => {
        console.log(`   - ${idx.index} (${idx['docs.count']} docs)`);
      });
    } else {
      console.log('ℹ️  No indexes yet (this is normal for new deployment)');
    }
    console.log('');

    console.log('🎉 All tests passed!');
    console.log('');
    console.log('✅ Elasticsearch is fully configured and working!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Create healthcare indexes');
    console.log('2. Index sample data');
    console.log('3. Test vector search');
    console.log('4. Build AI agents');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('');
    console.error('Troubleshooting:');
    console.error('1. Check if deployment is fully started (wait 5 minutes)');
    console.error('2. Verify endpoint URL is correct');
    console.error('3. Verify username/password are correct');
    console.error('4. Check if firewall is blocking connection');
  }
}

testConnection();
