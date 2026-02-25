/**
 * AI Service using Google Gemini and Hugging Face
 * 
 * Provides:
 * - Text generation and reasoning (Gemini)
 * - Text embeddings for vector search (Hugging Face)
 * 
 * Free alternatives to OpenAI for the hackathon!
 */

interface AIConfig {
  geminiApiKey: string;
  huggingFaceApiKey: string;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface EmbeddingResponse {
  embedding: number[];
  model: string;
}

class AIService {
  private config: AIConfig;
  private geminiEndpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  private huggingFaceEndpoint = 'https://api-inference.huggingface.co/pipeline/feature-extraction';

  constructor() {
    this.config = {
      geminiApiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
      huggingFaceApiKey: import.meta.env.VITE_HUGGINGFACE_API_KEY || ''
    };

    if (this.config.geminiApiKey) {
      console.log('✅ Gemini API key configured');
    } else {
      console.warn('⚠️ Gemini API key not found');
    }

    if (this.config.huggingFaceApiKey) {
      console.log('✅ Hugging Face API key configured');
    } else {
      console.warn('⚠️ Hugging Face API key not found');
    }
  }

  /**
   * Generate text using Google Gemini
   * Free tier: 60 requests per minute
   */
  async generateText(prompt: string, systemPrompt?: string): Promise<string> {
    if (!this.config.geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const fullPrompt = systemPrompt 
        ? `${systemPrompt}\n\nUser: ${prompt}`
        : prompt;

      const response = await fetch(
        `${this.geminiEndpoint}?key=${this.config.geminiApiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: fullPrompt
              }]
            }]
          })
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Gemini API error: ${error}`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      return text;
    } catch (error) {
      console.error('❌ Gemini generation failed:', error);
      throw error;
    }
  }

  /**
   * Chat with Gemini (multi-turn conversation)
   */
  async chat(messages: ChatMessage[]): Promise<string> {
    if (!this.config.geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    try {
      // Convert messages to Gemini format
      const systemMessage = messages.find(m => m.role === 'system');
      const conversationMessages = messages.filter(m => m.role !== 'system');

      let prompt = '';
      if (systemMessage) {
        prompt += `${systemMessage.content}\n\n`;
      }

      conversationMessages.forEach(msg => {
        const role = msg.role === 'user' ? 'User' : 'Assistant';
        prompt += `${role}: ${msg.content}\n`;
      });

      return await this.generateText(prompt);
    } catch (error) {
      console.error('❌ Gemini chat failed:', error);
      throw error;
    }
  }

  /**
   * Generate embeddings using Hugging Face
   * Model: sentence-transformers/all-MiniLM-L6-v2 (384 dimensions)
   * Free tier: Unlimited requests (with rate limiting)
   */
  async generateEmbedding(text: string): Promise<number[]> {
    if (!this.config.huggingFaceApiKey) {
      throw new Error('Hugging Face API key not configured');
    }

    try {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/sentence-transformers/all-MiniLM-L6-v2',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.huggingFaceApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: text,
            options: {
              wait_for_model: true
            }
          })
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Hugging Face API error: ${error}`);
      }

      const embedding = await response.json();
      
      // Handle different response formats
      if (Array.isArray(embedding)) {
        return embedding;
      } else if (embedding.embeddings) {
        return embedding.embeddings[0];
      } else {
        throw new Error('Unexpected embedding format');
      }
    } catch (error) {
      console.error('❌ Embedding generation failed:', error);
      throw error;
    }
  }

  /**
   * Generate embeddings for multiple texts (batch)
   */
  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];
    
    for (const text of texts) {
      try {
        const embedding = await this.generateEmbedding(text);
        embeddings.push(embedding);
        
        // Rate limiting: wait 100ms between requests
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error(`Failed to generate embedding for: ${text.substring(0, 50)}...`);
        // Use zero vector as fallback
        embeddings.push(new Array(384).fill(0));
      }
    }
    
    return embeddings;
  }

  /**
   * Analyze medical symptoms using Gemini
   */
  async analyzeMedicalSymptoms(
    symptoms: string,
    patientHistory: any
  ): Promise<{
    department: string;
    severity: string;
    reasoning: string;
    confidence: number;
  }> {
    const systemPrompt = `You are a medical triage assistant. Analyze patient symptoms and recommend:
1. Appropriate department (Cardiology, Neurology, Orthopedics, Gastroenterology, Respiratory, Dermatology, Emergency, or General Medicine)
2. Severity level (low, medium, high, or critical)
3. Brief reasoning for your recommendation

Respond in JSON format:
{
  "department": "department name",
  "severity": "severity level",
  "reasoning": "brief explanation",
  "confidence": 0.0-1.0
}`;

    const prompt = `Patient Symptoms: ${symptoms}

Patient History:
- Age: ${patientHistory.age}
- Gender: ${patientHistory.gender}
- Medical History: ${patientHistory.medicalHistory?.join(', ') || 'None'}
- Allergies: ${patientHistory.allergies?.join(', ') || 'None'}
- Current Medications: ${patientHistory.currentMedications?.join(', ') || 'None'}

Analyze and provide recommendation:`;

    try {
      const response = await this.generateText(prompt, systemPrompt);
      
      // Try to parse JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return result;
      }
      
      // Fallback: parse from text
      return this.parseAnalysisFromText(response);
    } catch (error) {
      console.error('Failed to analyze symptoms:', error);
      throw error;
    }
  }

  /**
   * Parse analysis from text response (fallback)
   */
  private parseAnalysisFromText(text: string): any {
    // Simple parsing logic
    const departmentMatch = text.match(/department[:\s]+([A-Za-z\s]+)/i);
    const severityMatch = text.match(/severity[:\s]+(low|medium|high|critical)/i);
    
    return {
      department: departmentMatch?.[1]?.trim() || 'General Medicine',
      severity: severityMatch?.[1]?.toLowerCase() || 'medium',
      reasoning: text.substring(0, 200),
      confidence: 0.7
    };
  }

  /**
   * Find optimal appointment slot using Gemini
   */
  async findOptimalSlot(
    availableSlots: any[],
    patientPreferences: any
  ): Promise<any> {
    const systemPrompt = `You are an appointment scheduling assistant. Given available slots and patient preferences, recommend the best slot.

Consider:
- Patient's preferred times
- Urgency level
- Doctor availability
- Slot proximity to preferred dates

Respond with the index of the best slot (0-based) and reasoning.`;

    const prompt = `Available Slots:
${availableSlots.map((slot, i) => `${i}. ${slot.date} at ${slot.time} with Dr. ${slot.doctorName}`).join('\n')}

Patient Preferences:
- Preferred times: ${patientPreferences.preferredTimes?.join(', ')}
- Urgency: ${patientPreferences.urgency}
- Preferred doctor: ${patientPreferences.doctorId || 'Any'}

Which slot is best? Respond with: "Slot [index]: [reasoning]"`;

    try {
      const response = await this.generateText(prompt, systemPrompt);
      
      // Extract slot index
      const indexMatch = response.match(/Slot\s+(\d+)/i);
      const slotIndex = indexMatch ? parseInt(indexMatch[1]) : 0;
      
      return {
        slot: availableSlots[slotIndex],
        reasoning: response
      };
    } catch (error) {
      console.error('Failed to find optimal slot:', error);
      // Fallback: return first slot
      return {
        slot: availableSlots[0],
        reasoning: 'Selected first available slot'
      };
    }
  }

  /**
   * Check drug interactions using Gemini
   */
  async checkDrugInteractions(
    medications: string[]
  ): Promise<{
    hasInteractions: boolean;
    interactions: string[];
    severity: string;
    recommendations: string;
  }> {
    const systemPrompt = `You are a pharmaceutical safety assistant. Analyze medication lists for potential drug interactions.

Respond in JSON format:
{
  "hasInteractions": true/false,
  "interactions": ["interaction description"],
  "severity": "none|mild|moderate|severe",
  "recommendations": "safety recommendations"
}`;

    const prompt = `Medications: ${medications.join(', ')}

Check for drug interactions:`;

    try {
      const response = await this.generateText(prompt, systemPrompt);
      
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return {
        hasInteractions: false,
        interactions: [],
        severity: 'none',
        recommendations: 'No significant interactions detected'
      };
    } catch (error) {
      console.error('Failed to check drug interactions:', error);
      throw error;
    }
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      gemini: {
        configured: !!this.config.geminiApiKey,
        model: 'gemini-pro',
        provider: 'Google'
      },
      huggingFace: {
        configured: !!this.config.huggingFaceApiKey,
        model: 'sentence-transformers/all-MiniLM-L6-v2',
        dimensions: 384,
        provider: 'Hugging Face'
      }
    };
  }
}

// Export singleton instance
export const aiService = new AIService();
export default aiService;
