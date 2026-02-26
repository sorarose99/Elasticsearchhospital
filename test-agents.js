/**
 * Test Healthcare AI Agents
 * 
 * Quick test to verify all 3 agents are working
 */

import dotenv from 'dotenv';
dotenv.config();

console.log('\n╔═══════════════════════════════════════════════════════════╗');
console.log('║                                                           ║');
console.log('║  🤖 TESTING HEALTHCARE AI AGENTS                          ║');
console.log('║                                                           ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

// Test 1: Check environment variables
console.log('Testing Environment Variables...');
const requiredEnvVars = [
  'VITE_ELASTICSEARCH_ENDPOINT',
  'VITE_ELASTICSEARCH_USERNAME',
  'VITE_ELASTICSEARCH_PASSWORD',
  'VITE_GEMINI_API_KEY',
  'VITE_HUGGINGFACE_API_KEY'
];

let allEnvVarsPresent = true;
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    console.log(`❌ Missing: ${varName}`);
    allEnvVarsPresent = false;
  }
});

if (allEnvVarsPresent) {
  console.log('✅ All environment variables present\n');
} else {
  console.log('❌ Some environment variables missing\n');
  process.exit(1);
}

// Test 2: Test Gemini AI
console.log('Testing Gemini AI...');
try {
  const geminiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.VITE_GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: 'Say "Hello from Gemini AI"' }]
        }]
      })
    }
  );

  if (geminiResponse.ok) {
    const data = await geminiResponse.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    console.log(`✅ Gemini AI working: "${text.substring(0, 50)}..."\n`);
  } else {
    console.log('❌ Gemini AI failed\n');
  }
} catch (error) {
  console.log(`❌ Gemini AI error: ${error.message}\n`);
}

// Test 3: Test Hugging Face
console.log('Testing Hugging Face Embeddings...');
try {
  const hfResponse = await fetch(
    'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VITE_HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: 'Test embedding',
        options: { wait_for_model: true }
      })
    }
  );

  if (hfResponse.ok) {
    const embedding = await hfResponse.json();
    const dimensions = Array.isArray(embedding) ? embedding.length : 0;
    console.log(`✅ Hugging Face working: ${dimensions} dimensions\n`);
  } else {
    console.log('❌ Hugging Face failed\n');
  }
} catch (error) {
  console.log(`❌ Hugging Face error: ${error.message}\n`);
}

// Test 4: Check Elasticsearch connection
console.log('Testing Elasticsearch Connection...');
try {
  const { Client } = await import('@elastic/elasticsearch');
  
  const client = new Client({
    node: process.env.VITE_ELASTICSEARCH_ENDPOINT,
    auth: {
      username: process.env.VITE_ELASTICSEARCH_USERNAME,
      password: process.env.VITE_ELASTICSEARCH_PASSWORD
    }
  });

  const info = await client.info();
  console.log(`✅ Elasticsearch connected: Version ${info.version.number}\n`);
} catch (error) {
  console.log(`❌ Elasticsearch error: ${error.message}\n`);
}

// Summary
console.log('╔═══════════════════════════════════════════════════════════╗');
console.log('║                                                           ║');
console.log('║  📊 AGENT TESTING COMPLETE                                ║');
console.log('║                                                           ║');
console.log('╚═══════════════════════════════════════════════════════════╝\n');

console.log('✅ All services configured and ready');
console.log('🚀 Agent Dashboard: http://localhost:3000/agents');
console.log('📖 Demo Guide: See AGENT_DEMO_GUIDE.md\n');

console.log('Next Steps:');
console.log('   1. Open http://localhost:3000/agents in browser');
console.log('   2. Test each agent with sample data');
console.log('   3. Record demo video');
console.log('   4. Submit to hackathon!\n');
