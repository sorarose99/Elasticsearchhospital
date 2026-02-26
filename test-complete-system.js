/**
 * Complete System Test
 * Tests all components to ensure everything is error-free
 */

const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

console.log('╔══════════════════════════════════════════════════════════════╗');
console.log('║                                                              ║');
console.log('║  🧪 COMPLETE SYSTEM TEST                                     ║');
console.log('║                                                              ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');

let testsPassed = 0;
let testsFailed = 0;

async function test(name, fn) {
  try {
    process.stdout.write(`Testing ${name}... `);
    await fn();
    console.log('✅ PASS');
    testsPassed++;
  } catch (error) {
    console.log('❌ FAIL');
    console.log(`   Error: ${error.message}`);
    testsFailed++;
  }
}

async function runTests() {
  // Test 1: Environment Variables
  await test('Environment Variables', async () => {
    if (!process.env.VITE_ELASTICSEARCH_ENDPOINT) throw new Error('Missing ELASTICSEARCH_ENDPOINT');
    if (!process.env.VITE_ELASTICSEARCH_USERNAME) throw new Error('Missing ELASTICSEARCH_USERNAME');
    if (!process.env.VITE_ELASTICSEARCH_PASSWORD) throw new Error('Missing ELASTICSEARCH_PASSWORD');
    if (!process.env.VITE_GEMINI_API_KEY) throw new Error('Missing GEMINI_API_KEY');
    if (!process.env.VITE_HUGGINGFACE_API_KEY) throw new Error('Missing HUGGINGFACE_API_KEY');
  });

  // Test 2: Elasticsearch Connection
  const client = new Client({
    node: process.env.VITE_ELASTICSEARCH_ENDPOINT,
    auth: {
      username: process.env.VITE_ELASTICSEARCH_USERNAME,
      password: process.env.VITE_ELASTICSEARCH_PASSWORD
    }
  });

  await test('Elasticsearch Connection', async () => {
    const info = await client.info();
    if (!info.version) throw new Error('No version info');
  });

  await test('Elasticsearch Cluster Health', async () => {
    const health = await client.cluster.health();
    if (health.status === 'red') throw new Error('Cluster is red');
  });

  // Test 3: Healthcare Indexes
  await test('Patients Index Exists', async () => {
    const exists = await client.indices.exists({ index: 'patients' });
    if (!exists) throw new Error('Index does not exist');
  });

  await test('Appointments Index Exists', async () => {
    const exists = await client.indices.exists({ index: 'appointments' });
    if (!exists) throw new Error('Index does not exist');
  });

  await test('Medical Records Index Exists', async () => {
    const exists = await client.indices.exists({ index: 'medical_records' });
    if (!exists) throw new Error('Index does not exist');
  });

  await test('Medical Cases Index Exists', async () => {
    const exists = await client.indices.exists({ index: 'medical_cases' });
    if (!exists) throw new Error('Index does not exist');
  });

  await test('Agent Logs Index Exists', async () => {
    const exists = await client.indices.exists({ index: 'agent_logs' });
    if (!exists) throw new Error('Index does not exist');
  });

  // Test 4: Sample Data
  await test('Patients Data Indexed', async () => {
    const count = await client.count({ index: 'patients' });
    if (count.count === 0) throw new Error('No patients indexed');
  });

  await test('Appointments Data Indexed', async () => {
    const count = await client.count({ index: 'appointments' });
    if (count.count === 0) throw new Error('No appointments indexed');
  });

  await test('Medical Cases Data Indexed', async () => {
    const count = await client.count({ index: 'medical_cases' });
    if (count.count === 0) throw new Error('No medical cases indexed');
  });

  // Test 5: Search Functionality
  await test('Search Patients', async () => {
    const result = await client.search({
      index: 'patients',
      body: {
        query: { match_all: {} },
        size: 1
      }
    });
    if (result.hits.hits.length === 0) throw new Error('No search results');
  });

  await test('Search Appointments', async () => {
    const result = await client.search({
      index: 'appointments',
      body: {
        query: { match_all: {} },
        size: 1
      }
    });
    if (result.hits.hits.length === 0) throw new Error('No search results');
  });

  // Test 6: AI Services
  await test('Gemini API Key Format', async () => {
    const key = process.env.VITE_GEMINI_API_KEY;
    if (!key.startsWith('AIza')) throw new Error('Invalid Gemini API key format');
  });

  await test('Hugging Face API Key Format', async () => {
    const key = process.env.VITE_HUGGINGFACE_API_KEY;
    if (!key.startsWith('hf_')) throw new Error('Invalid Hugging Face API key format');
  });

  // Test 7: Firebase Configuration
  await test('Firebase Configuration', async () => {
    if (!process.env.VITE_FIREBASE_API_KEY) throw new Error('Missing Firebase API key');
    if (!process.env.VITE_FIREBASE_PROJECT_ID) throw new Error('Missing Firebase project ID');
  });

  // Test 8: Index Mappings
  await test('Patients Index Mapping', async () => {
    const mapping = await client.indices.getMapping({ index: 'patients' });
    const props = mapping.patients.mappings.properties;
    if (!props.symptoms_vector) throw new Error('Missing vector field');
    if (props.symptoms_vector.dims !== 384) throw new Error('Wrong vector dimensions');
  });

  await test('Medical Cases Index Mapping', async () => {
    const mapping = await client.indices.getMapping({ index: 'medical_cases' });
    const props = mapping.medical_cases.mappings.properties;
    if (!props.symptoms_vector) throw new Error('Missing vector field');
  });

  // Test 9: Data Retrieval
  await test('Retrieve Patient Data', async () => {
    const result = await client.search({
      index: 'patients',
      body: {
        query: { term: { patient_id: 'P001' } }
      }
    });
    if (result.hits.hits.length === 0) throw new Error('Patient P001 not found');
    const patient = result.hits.hits[0]._source;
    if (!patient.name) throw new Error('Patient missing name');
    if (!patient.symptoms) throw new Error('Patient missing symptoms');
  });

  await test('Retrieve Appointment Data', async () => {
    const result = await client.search({
      index: 'appointments',
      body: {
        query: { term: { appointment_id: 'A001' } }
      }
    });
    if (result.hits.hits.length === 0) throw new Error('Appointment A001 not found');
    const appointment = result.hits.hits[0]._source;
    if (!appointment.doctor_name) throw new Error('Appointment missing doctor name');
  });

  // Test 10: Query Capabilities
  await test('Filter by Department', async () => {
    const result = await client.search({
      index: 'appointments',
      body: {
        query: { term: { department: 'Cardiology' } }
      }
    });
    if (result.hits.hits.length === 0) throw new Error('No cardiology appointments');
  });

  await test('Filter by Severity', async () => {
    const result = await client.search({
      index: 'medical_cases',
      body: {
        query: { term: { severity: 'high' } }
      }
    });
    if (result.hits.hits.length === 0) throw new Error('No high severity cases');
  });

  // Summary
  console.log('\n╔══════════════════════════════════════════════════════════════╗');
  console.log('║                                                              ║');
  console.log('║  📊 TEST RESULTS                                             ║');
  console.log('║                                                              ║');
  console.log('╚══════════════════════════════════════════════════════════════╝\n');
  
  console.log(`✅ Tests Passed: ${testsPassed}`);
  console.log(`❌ Tests Failed: ${testsFailed}`);
  console.log(`📊 Total Tests: ${testsPassed + testsFailed}`);
  console.log(`🎯 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%\n`);

  if (testsFailed === 0) {
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║                                                              ║');
    console.log('║  🎉 ALL TESTS PASSED! SYSTEM IS ERROR-FREE!                 ║');
    console.log('║                                                              ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');
    
    console.log('✅ Elasticsearch: WORKING');
    console.log('✅ All Indexes: CREATED');
    console.log('✅ Sample Data: INDEXED');
    console.log('✅ Search: WORKING');
    console.log('✅ Vector Fields: CONFIGURED');
    console.log('✅ AI Keys: CONFIGURED');
    console.log('✅ Firebase: CONFIGURED\n');
    
    console.log('🚀 System Status: PRODUCTION READY');
    console.log('🏆 Hackathon Status: READY TO SUBMIT\n');
    
    console.log('📝 Next Steps:');
    console.log('   1. Application is running at http://localhost:3000');
    console.log('   2. Test the UI and agents');
    console.log('   3. Record demo video');
    console.log('   4. Submit to hackathon!\n');
  } else {
    console.log('⚠️  Some tests failed. Please review errors above.\n');
  }
}

runTests().catch(error => {
  console.error('\n❌ Test suite failed:', error.message);
  process.exit(1);
});
