# AI Setup Guide: Gemini + Hugging Face

## Why Gemini + Hugging Face?

✅ **Free**: Both have generous free tiers  
✅ **No Credit Card**: No payment info required  
✅ **Fast**: Good performance for hackathon  
✅ **Easy**: Simple API integration  

## Step 1: Get Google Gemini API Key (5 minutes)

### Free Tier
- 60 requests per minute
- Unlimited requests per day
- No credit card required

### Steps
1. Go to https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Select "Create API key in new project" (or use existing)
4. Copy the API key (starts with `AIza...`)
5. Add to `.env`:
   ```env
   VITE_GEMINI_API_KEY=AIzaSy...your-key-here
   ```

### Test Gemini
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

## Step 2: Get Hugging Face API Key (3 minutes)

### Free Tier
- Unlimited requests (with rate limiting)
- No credit card required
- Access to 100,000+ models

### Steps
1. Go to https://huggingface.co/join
2. Sign up (free account)
3. Go to https://huggingface.co/settings/tokens
4. Click "New token"
5. Name: `hackathon-embeddings`
6. Role: `read`
7. Copy the token (starts with `hf_...`)
8. Add to `.env`:
   ```env
   VITE_HUGGINGFACE_API_KEY=hf_...your-token-here
   ```

### Test Hugging Face
```bash
curl https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"inputs": "Hello world"}'
```

## Step 3: Update Your .env File

Your `.env` should now have:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-firebase-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Elasticsearch Cloud Configuration
VITE_ELASTICSEARCH_API_KEY=your-elasticsearch-api-key

# AI Configuration
VITE_GEMINI_API_KEY=AIzaSy...your-gemini-key
VITE_HUGGINGFACE_API_KEY=hf_...your-huggingface-token
```

## Step 4: Test AI Service

Create a test file:

```typescript
// test-ai.ts
import { aiService } from './src/services/AIService';

async function test() {
  console.log('Testing AI Service...\n');
  
  // Test Gemini
  console.log('1. Testing Gemini text generation...');
  const text = await aiService.generateText('What is the capital of France?');
  console.log('Response:', text);
  
  // Test Hugging Face embeddings
  console.log('\n2. Testing Hugging Face embeddings...');
  const embedding = await aiService.generateEmbedding('chest pain and shortness of breath');
  console.log('Embedding dimensions:', embedding.length);
  console.log('First 5 values:', embedding.slice(0, 5));
  
  // Test medical analysis
  console.log('\n3. Testing medical symptom analysis...');
  const analysis = await aiService.analyzeMedicalSymptoms(
    'chest pain, shortness of breath, dizziness',
    {
      age: 45,
      gender: 'male',
      medicalHistory: ['hypertension'],
      allergies: [],
      currentMedications: ['lisinopril']
    }
  );
  console.log('Analysis:', analysis);
  
  console.log('\n✅ All tests passed!');
}

test().catch(console.error);
```

Run:
```bash
npx tsx test-ai.ts
```

## What Each Service Does

### Google Gemini (Text Generation)
- **Purpose**: AI reasoning and decision making
- **Used for**:
  - Analyzing patient symptoms
  - Recommending departments
  - Finding optimal appointment slots
  - Checking drug interactions
  - Generating explanations

### Hugging Face (Embeddings)
- **Purpose**: Convert text to vectors for similarity search
- **Used for**:
  - Symptom matching (find similar cases)
  - Medical record search
  - Semantic understanding
- **Model**: sentence-transformers/all-MiniLM-L6-v2
- **Dimensions**: 384 (smaller than OpenAI's 1536, but faster and free!)

## Integration with Agents

### Patient Triage Agent
```typescript
import { aiService } from '../services/AIService';

// Analyze symptoms with Gemini
const analysis = await aiService.analyzeMedicalSymptoms(symptoms, patientContext);

// Generate embedding for vector search
const embedding = await aiService.generateEmbedding(symptoms);

// Search similar cases in Elasticsearch
const similarCases = await elasticsearchService.vectorSearch(embedding);
```

### Appointment Scheduler Agent
```typescript
import { aiService } from '../services/AIService';

// Let Gemini pick the best slot
const result = await aiService.findOptimalSlot(availableSlots, preferences);
```

### Medical Records Analyzer Agent
```typescript
import { aiService } from '../services/AIService';

// Check drug interactions
const interactions = await aiService.checkDrugInteractions(medications);

// Generate embeddings for semantic search
const queryEmbedding = await aiService.generateEmbedding(searchQuery);
```

## Rate Limits & Best Practices

### Gemini
- **Limit**: 60 requests/minute
- **Best Practice**: Cache responses when possible
- **Retry**: Implement exponential backoff

### Hugging Face
- **Limit**: Soft rate limiting (no hard limit)
- **Best Practice**: Batch embeddings when possible
- **Wait**: 100ms between requests to be safe

## Cost Comparison

| Service | OpenAI | Gemini + HF |
|---------|--------|-------------|
| Text Generation | $0.002/1K tokens | FREE |
| Embeddings | $0.0001/1K tokens | FREE |
| Monthly Cost (10K requests) | ~$50 | $0 |

## Troubleshooting

### Gemini API Error
```
Error: 400 Bad Request
```
**Solution**: Check API key is correct and starts with `AIza`

### Hugging Face Model Loading
```
Error: Model is loading
```
**Solution**: Add `wait_for_model: true` in options (already done in AIService)

### Rate Limit Exceeded
```
Error: 429 Too Many Requests
```
**Solution**: Add delays between requests or implement retry logic

## Next Steps

1. ✅ Get Gemini API key
2. ✅ Get Hugging Face token
3. ✅ Update .env file
4. ✅ Test AI service
5. ✅ Update agents to use AIService
6. ✅ Test with real medical scenarios

## Resources

- [Gemini API Docs](https://ai.google.dev/docs)
- [Hugging Face Inference API](https://huggingface.co/docs/api-inference/index)
- [Sentence Transformers](https://www.sbert.net/)

---

**You're ready to build AI-powered healthcare agents with free APIs! 🚀**
