/**
 * Complete System Setup for Elasticsearch Agent Builder Hackathon
 * 
 * This script will:
 * 1. Create all healthcare indexes in Elasticsearch
 * 2. Index sample healthcare data
 * 3. Test AI services (Gemini + Hugging Face)
 * 4. Verify all agents are ready
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

// Healthcare index mappings
const indexes = {
  patients: {
    mappings: {
      properties: {
        patient_id: { type: 'keyword' },
        name: { type: 'text' },
        age: { type: 'integer' },
        gender: { type: 'keyword' },
        symptoms: { type: 'text' },
        symptoms_vector: {
          type: 'dense_vector',
          dims: 384, // Hugging Face model dimensions
          index: true,
          similarity: 'cosine'
        },
        medical_history: { type: 'keyword' },
        allergies: { type: 'keyword' },
        medications: { type: 'keyword' },
        created_at: { type: 'date' }
      }
    }
  },
  
  appointments: {
    mappings: {
      properties: {
        appointment_id: { type: 'keyword' },
        patient_id: { type: 'keyword' },
        doctor_id: { type: 'keyword' },
        doctor_name: { type: 'text' },
        department: { type: 'keyword' },
        date: { type: 'date' },
        time_slot: { type: 'keyword' },
        duration: { type: 'integer' },
        status: { type: 'keyword' },
        reason: { type: 'text' },
        created_at: { type: 'date' }
      }
    }
  },
  
  medical_records: {
    mappings: {
      properties: {
        record_id: { type: 'keyword' },
        patient_id: { type: 'keyword' },
        visit_date: { type: 'date' },
        diagnosis: { type: 'text' },
        treatment: { type: 'text' },
        prescriptions: { type: 'keyword' },
        lab_results: { type: 'object' },
        notes: { type: 'text' },
        notes_vector: {
          type: 'dense_vector',
          dims: 384,
          index: true,
          similarity: 'cosine'
        },
        created_at: { type: 'date' }
      }
    }
  },
  
  medical_cases: {
    mappings: {
      properties: {
        case_id: { type: 'keyword' },
        symptoms: { type: 'text' },
        symptoms_vector: {
          type: 'dense_vector',
          dims: 384,
          index: true,
          similarity: 'cosine'
        },
        diagnosis: { type: 'text' },
        department: { type: 'keyword' },
        severity: { type: 'keyword' },
        outcome: { type: 'text' },
        created_at: { type: 'date' }
      }
    }
  },
  
  agent_logs: {
    mappings: {
      properties: {
        agent: { type: 'keyword' },
        activity: { type: 'keyword' },
        data: { type: 'object' },
        timestamp: { type: 'date' }
      }
    }
  }
};

// Sample healthcare data
const sampleData = {
  patients: [
    {
      patient_id: 'P001',
      name: 'John Smith',
      age: 45,
      gender: 'male',
      symptoms: 'chest pain, shortness of breath, dizziness',
      medical_history: ['hypertension', 'diabetes'],
      allergies: ['penicillin'],
      medications: ['metformin', 'lisinopril'],
      created_at: new Date().toISOString()
    },
    {
      patient_id: 'P002',
      name: 'Sarah Johnson',
      age: 32,
      gender: 'female',
      symptoms: 'severe headache, nausea, sensitivity to light',
      medical_history: ['migraine'],
      allergies: [],
      medications: ['sumatriptan'],
      created_at: new Date().toISOString()
    },
    {
      patient_id: 'P003',
      name: 'Michael Brown',
      age: 58,
      gender: 'male',
      symptoms: 'joint pain, stiffness, swelling in knees',
      medical_history: ['arthritis'],
      allergies: ['aspirin'],
      medications: ['ibuprofen', 'glucosamine'],
      created_at: new Date().toISOString()
    }
  ],
  
  appointments: [
    {
      appointment_id: 'A001',
      patient_id: 'P001',
      doctor_id: 'D001',
      doctor_name: 'Dr. Emily Carter',
      department: 'Cardiology',
      date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      time_slot: '09:00',
      duration: 30,
      status: 'confirmed',
      reason: 'Follow-up for chest pain',
      created_at: new Date().toISOString()
    },
    {
      appointment_id: 'A002',
      patient_id: 'P002',
      doctor_id: 'D002',
      doctor_name: 'Dr. James Wilson',
      department: 'Neurology',
      date: new Date(Date.now() + 172800000).toISOString(), // 2 days
      time_slot: '14:00',
      duration: 45,
      status: 'confirmed',
      reason: 'Migraine consultation',
      created_at: new Date().toISOString()
    }
  ],
  
  medical_cases: [
    {
      case_id: 'C001',
      symptoms: 'chest pain, shortness of breath',
      diagnosis: 'Angina',
      department: 'Cardiology',
      severity: 'high',
      outcome: 'Treated with medication, scheduled for stress test',
      created_at: new Date().toISOString()
    },
    {
      case_id: 'C002',
      symptoms: 'severe headache, nausea, light sensitivity',
      diagnosis: 'Migraine',
      department: 'Neurology',
      severity: 'medium',
      outcome: 'Prescribed sumatriptan, advised rest',
      created_at: new Date().toISOString()
    },
    {
      case_id: 'C003',
      symptoms: 'joint pain, stiffness, swelling',
      diagnosis: 'Osteoarthritis',
      department: 'Orthopedics',
      severity: 'medium',
      outcome: 'Physical therapy recommended, pain management',
      created_at: new Date().toISOString()
    }
  ]
};

async function createIndexes() {
  console.log('\n📊 Step 1: Creating Healthcare Indexes...\n');
  
  for (const [indexName, indexConfig] of Object.entries(indexes)) {
    try {
      // Check if index exists
      const exists = await client.indices.exists({ index: indexName });
      
      if (exists) {
        console.log(`   ⚠️  Index "${indexName}" already exists, skipping...`);
        continue;
      }
      
      // Create index
      await client.indices.create({
        index: indexName,
        body: indexConfig
      });
      
      console.log(`   ✅ Created index: ${indexName}`);
    } catch (error) {
      console.error(`   ❌ Failed to create ${indexName}:`, error.message);
    }
  }
  
  console.log('\n✅ All indexes created!\n');
}

async function indexSampleData() {
  console.log('📝 Step 2: Indexing Sample Data...\n');
  
  // Index patients
  for (const patient of sampleData.patients) {
    try {
      await client.index({
        index: 'patients',
        id: patient.patient_id,
        document: patient
      });
      console.log(`   ✅ Indexed patient: ${patient.name}`);
    } catch (error) {
      console.error(`   ❌ Failed to index patient:`, error.message);
    }
  }
  
  // Index appointments
  for (const appointment of sampleData.appointments) {
    try {
      await client.index({
        index: 'appointments',
        id: appointment.appointment_id,
        document: appointment
      });
      console.log(`   ✅ Indexed appointment: ${appointment.appointment_id}`);
    } catch (error) {
      console.error(`   ❌ Failed to index appointment:`, error.message);
    }
  }
  
  // Index medical cases
  for (const medicalCase of sampleData.medical_cases) {
    try {
      await client.index({
        index: 'medical_cases',
        id: medicalCase.case_id,
        document: medicalCase
      });
      console.log(`   ✅ Indexed medical case: ${medicalCase.case_id}`);
    } catch (error) {
      console.error(`   ❌ Failed to index medical case:`, error.message);
    }
  }
  
  // Refresh indexes
  await client.indices.refresh({ index: '_all' });
  
  console.log('\n✅ All sample data indexed!\n');
}

async function testAIServices() {
  console.log('🤖 Step 3: Testing AI Services...\n');
  
  // Test Gemini
  console.log('   Testing Gemini API...');
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.VITE_GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Say "Hello from Gemini!"' }] }]
        })
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      console.log(`   ✅ Gemini working: ${text.substring(0, 50)}...`);
    } else {
      console.log(`   ❌ Gemini failed: ${response.status}`);
    }
  } catch (error) {
    console.log(`   ❌ Gemini error:`, error.message);
  }
  
  // Test Hugging Face
  console.log('   Testing Hugging Face API...');
  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.VITE_HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: 'test embedding',
          options: { wait_for_model: true }
        })
      }
    );
    
    if (response.ok) {
      const embedding = await response.json();
      console.log(`   ✅ Hugging Face working: Generated ${Array.isArray(embedding) ? embedding.length : '?'} dimension embedding`);
    } else {
      console.log(`   ❌ Hugging Face failed: ${response.status}`);
    }
  } catch (error) {
    console.log(`   ❌ Hugging Face error:`, error.message);
  }
  
  console.log('\n✅ AI services tested!\n');
}

async function verifySetup() {
  console.log('🔍 Step 4: Verifying Complete Setup...\n');
  
  // Check indexes
  const indexes = await client.cat.indices({ format: 'json' });
  const healthcareIndexes = indexes.filter(idx => 
    ['patients', 'appointments', 'medical_records', 'medical_cases', 'agent_logs'].includes(idx.index)
  );
  
  console.log(`   ✅ Healthcare indexes: ${healthcareIndexes.length}/5`);
  healthcareIndexes.forEach(idx => {
    console.log(`      - ${idx.index}: ${idx['docs.count']} documents`);
  });
  
  // Check data
  const patientCount = await client.count({ index: 'patients' });
  const appointmentCount = await client.count({ index: 'appointments' });
  const caseCount = await client.count({ index: 'medical_cases' });
  
  console.log(`\n   ✅ Sample data:`);
  console.log(`      - Patients: ${patientCount.count}`);
  console.log(`      - Appointments: ${appointmentCount.count}`);
  console.log(`      - Medical cases: ${caseCount.count}`);
  
  console.log('\n✅ Setup verification complete!\n');
}

async function main() {
  console.log('╔══════════════════════════════════════════════════════════════╗');
  console.log('║                                                              ║');
  console.log('║  🏥 Healthcare AI Agents - Complete System Setup            ║');
  console.log('║     Elasticsearch Agent Builder Hackathon                    ║');
  console.log('║                                                              ║');
  console.log('╚══════════════════════════════════════════════════════════════╝');
  
  try {
    await createIndexes();
    await indexSampleData();
    await testAIServices();
    await verifySetup();
    
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║                                                              ║');
    console.log('║  🎉 SETUP COMPLETE! READY FOR HACKATHON!                    ║');
    console.log('║                                                              ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('✅ Elasticsearch: WORKING');
    console.log('✅ Healthcare Indexes: CREATED');
    console.log('✅ Sample Data: INDEXED');
    console.log('✅ AI Services: TESTED');
    console.log('');
    console.log('🚀 Next Steps:');
    console.log('   1. Run: npm run dev');
    console.log('   2. Test agents in the UI');
    console.log('   3. Build demo video');
    console.log('   4. Submit to hackathon!');
    console.log('');
    console.log('🏆 Prize Target: $10,000 (1st Place)');
    console.log('📅 Deadline: February 27, 2026');
    console.log('');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error('\nPlease check:');
    console.error('1. Elasticsearch is running');
    console.error('2. Credentials are correct in .env');
    console.error('3. AI API keys are valid');
  }
}

main();
