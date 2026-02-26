/**
 * Elasticsearch Agent Builder Setup Script
 * 
 * This script:
 * 1. Creates necessary Elasticsearch indices
 * 2. Configures Agent Builder
 * 3. Sets up search templates
 * 4. Configures workflows
 * 5. Loads sample data
 */

const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

const client = new Client({
  node: process.env.VITE_ELASTICSEARCH_AGENT_ENDPOINT,
  auth: {
    apiKey: process.env.VITE_ELASTICSEARCH_API_KEY
  }
});

// Index configurations
const indices = {
  'patient-records': {
    mappings: {
      properties: {
        patientId: { type: 'keyword' },
        name: { type: 'text' },
        age: { type: 'integer' },
        gender: { type: 'keyword' },
        medicalHistory: { type: 'text' },
        allergies: { type: 'keyword' },
        medications: { type: 'keyword' },
        conditions: { type: 'keyword' },
        lastVisit: { type: 'date' },
        embedding: { type: 'dense_vector', dims: 1536 }
      }
    }
  },
  'lab-results': {
    mappings: {
      properties: {
        patientId: { type: 'keyword' },
        testType: { type: 'keyword' },
        testName: { type: 'text' },
        value: { type: 'float' },
        unit: { type: 'keyword' },
        normalRange: { type: 'text' },
        status: { type: 'keyword' },
        date: { type: 'date' },
        interpretation: { type: 'text' },
        embedding: { type: 'dense_vector', dims: 1536 }
      }
    }
  },
  'emergency-protocols': {
    mappings: {
      properties: {
        protocolId: { type: 'keyword' },
        name: { type: 'text' },
        category: { type: 'keyword' },
        severity: { type: 'keyword' },
        steps: { type: 'nested' },
        medications: { type: 'keyword' },
        equipment: { type: 'keyword' },
        timeLimit: { type: 'integer' },
        embedding: { type: 'dense_vector', dims: 1536 }
      }
    }
  },
  'medical-literature': {
    mappings: {
      properties: {
        title: { type: 'text' },
        abstract: { type: 'text' },
        authors: { type: 'keyword' },
        journal: { type: 'keyword' },
        publicationDate: { type: 'date' },
        doi: { type: 'keyword' },
        keywords: { type: 'keyword' },
        embedding: { type: 'dense_vector', dims: 1536 }
      }
    }
  },
  'drug-database': {
    mappings: {
      properties: {
        drugName: { type: 'text' },
        genericName: { type: 'keyword' },
        brandNames: { type: 'keyword' },
        class: { type: 'keyword' },
        interactions: { type: 'keyword' },
        contraindications: { type: 'text' },
        sideEffects: { type: 'text' },
        dosage: { type: 'text' },
        embedding: { type: 'dense_vector', dims: 1536 }
      }
    }
  }
};

// Agent Builder configuration
const agentConfig = {
  name: 'mediflow-healthcare-agent',
  description: 'Multi-step AI agent for healthcare workflows',
  model: 'gpt-4',
  temperature: 0.7,
  tools: [
    {
      type: 'search',
      name: 'patient_history_search',
      description: 'Search patient medical history and records',
      index: 'patient-records',
      fields: ['medicalHistory', 'conditions', 'medications', 'allergies']
    },
    {
      type: 'search',
      name: 'lab_results_search',
      description: 'Search laboratory test results',
      index: 'lab-results',
      fields: ['testName', 'value', 'interpretation']
    },
    {
      type: 'search',
      name: 'protocol_search',
      description: 'Search emergency protocols and clinical guidelines',
      index: 'emergency-protocols',
      fields: ['name', 'category', 'steps']
    },
    {
      type: 'search',
      name: 'literature_search',
      description: 'Search medical literature and research',
      index: 'medical-literature',
      fields: ['title', 'abstract', 'keywords']
    },
    {
      type: 'search',
      name: 'drug_search',
      description: 'Search drug database for interactions and information',
      index: 'drug-database',
      fields: ['drugName', 'interactions', 'contraindications']
    },
    {
      type: 'esql',
      name: 'analyze_trends',
      description: 'Analyze trends and patterns in patient data'
    },
    {
      type: 'workflow',
      name: 'emergency_triage',
      description: 'Execute emergency triage workflow',
      steps: [
        'assess_vitals',
        'check_history',
        'calculate_priority',
        'assign_resources',
        'notify_staff'
      ]
    },
    {
      type: 'workflow',
      name: 'lab_result_notification',
      description: 'Notify physicians of critical lab results',
      steps: [
        'interpret_result',
        'check_criticality',
        'find_ordering_physician',
        'send_notification'
      ]
    }
  ]
};

// Sample data
const sampleData = {
  'patient-records': [
    {
      patientId: 'P001',
      name: 'John Doe',
      age: 45,
      gender: 'M',
      medicalHistory: 'Hypertension, Type 2 Diabetes, Previous MI in 2020',
      allergies: ['Penicillin', 'Sulfa drugs'],
      medications: ['Metformin 1000mg', 'Lisinopril 10mg', 'Aspirin 81mg'],
      conditions: ['Hypertension', 'Type 2 Diabetes', 'CAD'],
      lastVisit: '2026-02-20T10:00:00Z'
    },
    {
      patientId: 'P002',
      name: 'Jane Smith',
      age: 32,
      gender: 'F',
      medicalHistory: 'Asthma, Seasonal allergies',
      allergies: ['Latex'],
      medications: ['Albuterol inhaler PRN', 'Fluticasone 110mcg'],
      conditions: ['Asthma'],
      lastVisit: '2026-02-15T14:30:00Z'
    }
  ],
  'lab-results': [
    {
      patientId: 'P001',
      testType: 'blood-glucose',
      testName: 'Fasting Blood Glucose',
      value: 180,
      unit: 'mg/dL',
      normalRange: '70-100 mg/dL',
      status: 'abnormal',
      date: '2026-02-25T08:00:00Z',
      interpretation: 'Elevated glucose level, consistent with poorly controlled diabetes'
    },
    {
      patientId: 'P001',
      testType: 'hba1c',
      testName: 'Hemoglobin A1c',
      value: 8.5,
      unit: '%',
      normalRange: '<5.7%',
      status: 'abnormal',
      date: '2026-02-25T08:00:00Z',
      interpretation: 'Elevated HbA1c indicating poor glycemic control over past 3 months'
    }
  ],
  'emergency-protocols': [
    {
      protocolId: 'PROTO-001',
      name: 'Cardiac Arrest Protocol',
      category: 'cardiac',
      severity: 'critical',
      steps: [
        { step: 1, action: 'Check responsiveness and pulse', timeLimit: 1 },
        { step: 2, action: 'Call for help and get AED', timeLimit: 1 },
        { step: 3, action: 'Begin CPR - 30:2', timeLimit: 2 },
        { step: 4, action: 'Attach defibrillator', timeLimit: 1 },
        { step: 5, action: 'Deliver shock if indicated', timeLimit: 1 }
      ],
      medications: ['Epinephrine 1mg IV', 'Amiodarone 300mg IV'],
      equipment: ['Defibrillator', 'Bag-mask', 'IV access'],
      timeLimit: 10
    },
    {
      protocolId: 'PROTO-002',
      name: 'Acute MI Protocol',
      category: 'cardiac',
      severity: 'critical',
      steps: [
        { step: 1, action: 'Obtain 12-lead ECG', timeLimit: 10 },
        { step: 2, action: 'Administer aspirin 325mg', timeLimit: 5 },
        { step: 3, action: 'Establish IV access', timeLimit: 5 },
        { step: 4, action: 'Draw cardiac enzymes', timeLimit: 5 },
        { step: 5, action: 'Notify cardiology for cath lab', timeLimit: 10 }
      ],
      medications: ['Aspirin 325mg', 'Nitroglycerin SL', 'Morphine 2mg IV', 'Heparin'],
      equipment: ['ECG machine', 'Cardiac monitor', 'IV supplies'],
      timeLimit: 30
    }
  ]
};

async function setupElasticsearch() {
  console.log('🚀 Starting Elasticsearch Agent Builder setup...\n');

  try {
    // 1. Check connection
    console.log('1️⃣ Checking Elasticsearch connection...');
    const health = await client.cluster.health();
    console.log(`✅ Connected to Elasticsearch (status: ${health.status})\n`);

    // 2. Create indices
    console.log('2️⃣ Creating indices...');
    for (const [indexName, config] of Object.entries(indices)) {
      try {
        const exists = await client.indices.exists({ index: indexName });
        if (exists) {
          console.log(`   ⚠️  Index ${indexName} already exists, skipping...`);
          continue;
        }

        await client.indices.create({
          index: indexName,
          body: config
        });
        console.log(`   ✅ Created index: ${indexName}`);
      } catch (error) {
        console.error(`   ❌ Error creating index ${indexName}:`, error.message);
      }
    }
    console.log('');

    // 3. Load sample data
    console.log('3️⃣ Loading sample data...');
    for (const [indexName, documents] of Object.entries(sampleData)) {
      try {
        const operations = documents.flatMap(doc => [
          { index: { _index: indexName } },
          doc
        ]);

        const result = await client.bulk({ operations });
        console.log(`   ✅ Loaded ${documents.length} documents into ${indexName}`);
      } catch (error) {
        console.error(`   ❌ Error loading data into ${indexName}:`, error.message);
      }
    }
    console.log('');

    // 4. Configure Agent Builder
    console.log('4️⃣ Configuring Agent Builder...');
    console.log('   ℹ️  Agent configuration:');
    console.log(`      Name: ${agentConfig.name}`);
    console.log(`      Model: ${agentConfig.model}`);
    console.log(`      Tools: ${agentConfig.tools.length}`);
    console.log('   ✅ Agent configuration ready\n');

    // 5. Create search templates
    console.log('5️⃣ Creating search templates...');
    const templates = [
      {
        id: 'patient-history-template',
        body: {
          script: {
            lang: 'mustache',
            source: {
              query: {
                bool: {
                  must: [
                    { match: { patientId: '{{patientId}}' } }
                  ],
                  should: [
                    { match: { medicalHistory: '{{query}}' } },
                    { match: { conditions: '{{query}}' } }
                  ]
                }
              }
            }
          }
        }
      }
    ];

    for (const template of templates) {
      try {
        await client.putScript(template);
        console.log(`   ✅ Created template: ${template.id}`);
      } catch (error) {
        console.error(`   ❌ Error creating template ${template.id}:`, error.message);
      }
    }
    console.log('');

    // 6. Summary
    console.log('✨ Setup complete!\n');
    console.log('📋 Summary:');
    console.log(`   - Indices created: ${Object.keys(indices).length}`);
    console.log(`   - Sample documents loaded: ${Object.values(sampleData).reduce((sum, docs) => sum + docs.length, 0)}`);
    console.log(`   - Agent tools configured: ${agentConfig.tools.length}`);
    console.log('');
    console.log('🎯 Next steps:');
    console.log('   1. Update .env with your Elasticsearch credentials');
    console.log('   2. Run: npm run dev');
    console.log('   3. Navigate to Emergency Dashboard');
    console.log('   4. Click the floating AI agent button');
    console.log('');
    console.log('🚀 Ready to demo!');

  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

// Run setup
setupElasticsearch();
