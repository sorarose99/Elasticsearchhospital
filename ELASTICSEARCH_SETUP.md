# Elasticsearch Setup Guide for Hackathon

## Step 1: Create Elasticsearch Cloud Account

1. Go to https://cloud.elastic.co/registration
2. Sign up for free trial (14 days, no credit card required)
3. Create a new deployment:
   - Name: `healthcare-ai-agents`
   - Version: Latest (8.x)
   - Cloud provider: AWS/GCP/Azure (your choice)
   - Region: Closest to you
   - Size: Start with smallest (can scale up)

## Step 2: Get Your Credentials

After deployment is created:

1. **Cloud ID**: Copy from deployment overview
2. **API Key**: 
   - Go to Management → Stack Management → API Keys
   - Create new API key
   - Name: `hackathon-agent-builder`
   - Copy the key (you won't see it again!)

3. **Endpoint**: 
   - Format: `https://[deployment-id].es.[region].cloud.es.io`
   - Copy from deployment page

## Step 3: Configure Environment Variables

Add to your `.env` file:

```env
# Elasticsearch Cloud
VITE_ELASTICSEARCH_CLOUD_ID=healthcare-ai-agents:dXMtY2VudHJhbDEuZ2NwLmNsb3VkLmVzLmlvJGFiYzEyMzQ1...
VITE_ELASTICSEARCH_API_KEY=VnVhQ2ZHY0JDZGJrUW0tZTVoT3k6dWkybHAyYXhUTm1zeWFrdzl0dk5udw==
VITE_ELASTICSEARCH_ENDPOINT=https://abc12345.us-central1.gcp.cloud.es.io

# Agent Builder (same as Elasticsearch for now)
VITE_AGENT_BUILDER_API_KEY=VnVhQ2ZHY0JDZGJrUW0tZTVoT3k6dWkybHAyYXhUTm1zeWFrdzl0dk5udw==
```

## Step 4: Install Elasticsearch Dependencies

```bash
npm install @elastic/elasticsearch@^8.12.0
npm install @elastic/search-ui@^1.20.0
npm install @elastic/react-search-ui@^1.20.0
```

## Step 5: Test Connection

Create a test file to verify connection:

```typescript
// test-elasticsearch.ts
import { Client } from '@elastic/elasticsearch';

const client = new Client({
  cloud: {
    id: process.env.VITE_ELASTICSEARCH_CLOUD_ID!
  },
  auth: {
    apiKey: process.env.VITE_ELASTICSEARCH_API_KEY!
  }
});

async function testConnection() {
  try {
    const info = await client.info();
    console.log('✅ Connected to Elasticsearch:', info);
    
    const health = await client.cluster.health();
    console.log('✅ Cluster health:', health);
    
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error);
    return false;
  }
}

testConnection();
```

Run test:
```bash
npx tsx test-elasticsearch.ts
```

## Step 6: Create Healthcare Indexes

### Patients Index
```json
{
  "mappings": {
    "properties": {
      "patient_id": { "type": "keyword" },
      "name": { "type": "text" },
      "age": { "type": "integer" },
      "gender": { "type": "keyword" },
      "symptoms": { 
        "type": "text",
        "fields": {
          "vector": {
            "type": "dense_vector",
            "dims": 1536,
            "index": true,
            "similarity": "cosine"
          }
        }
      },
      "medical_history": { "type": "text" },
      "allergies": { "type": "keyword" },
      "medications": { "type": "keyword" },
      "created_at": { "type": "date" }
    }
  }
}
```

### Appointments Index
```json
{
  "mappings": {
    "properties": {
      "appointment_id": { "type": "keyword" },
      "patient_id": { "type": "keyword" },
      "doctor_id": { "type": "keyword" },
      "department": { "type": "keyword" },
      "date": { "type": "date" },
      "time_slot": { "type": "keyword" },
      "duration": { "type": "integer" },
      "status": { "type": "keyword" },
      "reason": { "type": "text" },
      "created_at": { "type": "date" }
    }
  }
}
```

### Medical Records Index
```json
{
  "mappings": {
    "properties": {
      "record_id": { "type": "keyword" },
      "patient_id": { "type": "keyword" },
      "visit_date": { "type": "date" },
      "diagnosis": { "type": "text" },
      "treatment": { "type": "text" },
      "prescriptions": { "type": "keyword" },
      "lab_results": { "type": "object" },
      "notes": { 
        "type": "text",
        "fields": {
          "vector": {
            "type": "dense_vector",
            "dims": 1536,
            "index": true,
            "similarity": "cosine"
          }
        }
      },
      "created_at": { "type": "date" }
    }
  }
}
```

## Step 7: Enable Agent Builder

1. Go to Kibana (from your deployment page)
2. Navigate to: Management → Stack Management → Machine Learning
3. Enable "Agent Builder" feature
4. Create your first agent:
   - Name: `patient-triage-agent`
   - Type: Multi-step reasoning
   - Tools: Search, ES|QL, Workflows

## Step 8: Configure OpenAI (for LLM)

Agent Builder needs an LLM for reasoning:

1. Get OpenAI API key: https://platform.openai.com/api-keys
2. Add to `.env`:
```env
VITE_OPENAI_API_KEY=sk-proj-...
```

3. Configure in Elasticsearch:
   - Go to Kibana → Stack Management → Connectors
   - Add OpenAI connector
   - Use your API key

## Troubleshooting

### Connection Issues
- Verify Cloud ID format is correct
- Check API key hasn't expired
- Ensure deployment is running (green status)
- Check firewall/network settings

### Index Creation Fails
- Verify you have write permissions
- Check index name doesn't already exist
- Ensure mapping is valid JSON

### Agent Builder Not Available
- Verify you're on Elasticsearch 8.x+
- Check your subscription includes ML features
- Try refreshing Kibana

## Resources

- [Elasticsearch Cloud Docs](https://www.elastic.co/guide/en/cloud/current/index.html)
- [Agent Builder Guide](https://www.elastic.co/docs/explore-analyze/ai-features/elastic-agent-builder)
- [JavaScript Client Docs](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html)
- [Vector Search Guide](https://www.elastic.co/guide/en/elasticsearch/reference/current/knn-search.html)

## Next Steps

Once setup is complete:
1. ✅ Run `./setup-hackathon-repo.sh` to create new repository
2. ✅ Follow `HACKATHON_PLAN.md` for implementation
3. ✅ Build the three healthcare agents
4. ✅ Create demo video
5. ✅ Submit to hackathon!

Good luck! 🚀
