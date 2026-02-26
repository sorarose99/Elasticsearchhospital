/**
 * Elasticsearch Agent Builder Integration Service
 * Connects to Elasticsearch Agent Builder API for multi-step AI agent workflows
 */

export interface AgentContext {
  module: 'emergency' | 'laboratory' | 'nursing' | 'diagnostic' | 'pharmacy' | 'radiology' | 'admin';
  patientId?: string;
  patientData?: any;
  currentView?: string;
  userRole?: string;
  urgency?: 'critical' | 'urgent' | 'moderate' | 'low';
}

export interface AgentMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  actions?: AgentAction[];
  context?: any;
}

export interface AgentAction {
  id: string;
  type: 'search' | 'workflow' | 'esql' | 'notification' | 'update';
  label: string;
  description: string;
  parameters?: any;
  status?: 'pending' | 'executing' | 'completed' | 'failed';
}

export interface AgentSuggestion {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  action: () => void;
  icon?: string;
}

class ElasticsearchAgentService {
  private apiEndpoint: string;
  private apiKey: string;
  private conversationHistory: Map<string, AgentMessage[]> = new Map();

  constructor() {
    // TODO: Replace with actual Elasticsearch Agent Builder endpoint
    this.apiEndpoint = import.meta.env.VITE_ELASTICSEARCH_AGENT_ENDPOINT || 'http://localhost:9200';
    this.apiKey = import.meta.env.VITE_ELASTICSEARCH_API_KEY || '';
  }

  /**
   * Initialize agent with context
   */
  async initializeAgent(context: AgentContext): Promise<void> {
    const sessionId = this.getSessionId(context);
    
    // Initialize conversation with system context
    const systemMessage: AgentMessage = {
      id: `sys-${Date.now()}`,
      role: 'system',
      content: this.buildSystemPrompt(context),
      timestamp: new Date()
    };

    this.conversationHistory.set(sessionId, [systemMessage]);
  }

  /**
   * Send message to agent and get response
   */
  async sendMessage(
    message: string,
    context: AgentContext
  ): Promise<AgentMessage> {
    const sessionId = this.getSessionId(context);
    const history = this.conversationHistory.get(sessionId) || [];

    // Add user message
    const userMessage: AgentMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: new Date(),
      context
    };

    history.push(userMessage);

    try {
      // Call Elasticsearch Agent Builder API
      const response = await this.callAgentAPI(message, context, history);
      
      // Add assistant response
      const assistantMessage: AgentMessage = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        actions: response.actions,
        context: response.context
      };

      history.push(assistantMessage);
      this.conversationHistory.set(sessionId, history);

      return assistantMessage;
    } catch (error) {
      console.error('Agent API error:', error);
      
      // Fallback response
      return {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date()
      };
    }
  }

  /**
   * Get contextual suggestions based on current state
   */
  async getContextualSuggestions(context: AgentContext): Promise<AgentSuggestion[]> {
    const suggestions: AgentSuggestion[] = [];

    switch (context.module) {
      case 'emergency':
        suggestions.push(
          {
            id: 'triage-analysis',
            title: 'Analyze Patient Triage',
            description: 'AI-powered triage assessment based on symptoms and vitals',
            priority: 'high',
            action: () => this.triggerTriageAnalysis(context)
          },
          {
            id: 'protocol-recommend',
            title: 'Recommend Protocol',
            description: 'Suggest emergency protocols based on patient condition',
            priority: 'high',
            action: () => this.triggerProtocolRecommendation(context)
          },
          {
            id: 'resource-allocation',
            title: 'Optimize Resource Allocation',
            description: 'Suggest best room and staff assignment',
            priority: 'medium',
            action: () => this.triggerResourceAllocation(context)
          }
        );
        break;

      case 'laboratory':
        suggestions.push(
          {
            id: 'result-interpretation',
            title: 'Interpret Lab Results',
            description: 'AI analysis of lab values and trends',
            priority: 'high',
            action: () => this.triggerResultInterpretation(context)
          },
          {
            id: 'abnormal-detection',
            title: 'Detect Abnormalities',
            description: 'Identify critical or abnormal results',
            priority: 'high',
            action: () => this.triggerAbnormalDetection(context)
          },
          {
            id: 'test-recommendation',
            title: 'Recommend Follow-up Tests',
            description: 'Suggest additional tests based on results',
            priority: 'medium',
            action: () => this.triggerTestRecommendation(context)
          }
        );
        break;

      case 'nursing':
        suggestions.push(
          {
            id: 'task-prioritization',
            title: 'Prioritize Tasks',
            description: 'AI-powered task scheduling based on patient acuity',
            priority: 'high',
            action: () => this.triggerTaskPrioritization(context)
          },
          {
            id: 'medication-check',
            title: 'Medication Safety Check',
            description: 'Verify medication administration and interactions',
            priority: 'high',
            action: () => this.triggerMedicationCheck(context)
          },
          {
            id: 'handoff-report',
            title: 'Generate Handoff Report',
            description: 'Create comprehensive shift handoff documentation',
            priority: 'medium',
            action: () => this.triggerHandoffReport(context)
          }
        );
        break;

      case 'diagnostic':
        suggestions.push(
          {
            id: 'differential-diagnosis',
            title: 'Generate Differential Diagnosis',
            description: 'AI-powered diagnostic reasoning from symptoms',
            priority: 'high',
            action: () => this.triggerDifferentialDiagnosis(context)
          },
          {
            id: 'literature-search',
            title: 'Search Medical Literature',
            description: 'Find relevant research and treatment guidelines',
            priority: 'medium',
            action: () => this.triggerLiteratureSearch(context)
          },
          {
            id: 'drug-interaction',
            title: 'Check Drug Interactions',
            description: 'Analyze potential medication interactions',
            priority: 'high',
            action: () => this.triggerDrugInteractionCheck(context)
          }
        );
        break;

      default:
        suggestions.push({
          id: 'general-help',
          title: 'Ask Agent for Help',
          description: 'Get AI assistance with your current task',
          priority: 'medium',
          action: () => {}
        });
    }

    return suggestions;
  }

  /**
   * Execute agent action
   */
  async executeAction(action: AgentAction, context: AgentContext): Promise<any> {
    try {
      const response = await fetch(`${this.apiEndpoint}/_agent/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `ApiKey ${this.apiKey}`
        },
        body: JSON.stringify({
          action: action.type,
          parameters: action.parameters,
          context
        })
      });

      if (!response.ok) {
        throw new Error(`Agent action failed: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Action execution error:', error);
      throw error;
    }
  }

  /**
   * Get conversation history
   */
  getConversationHistory(context: AgentContext): AgentMessage[] {
    const sessionId = this.getSessionId(context);
    return this.conversationHistory.get(sessionId) || [];
  }

  /**
   * Clear conversation history
   */
  clearConversation(context: AgentContext): void {
    const sessionId = this.getSessionId(context);
    this.conversationHistory.delete(sessionId);
  }

  // Private helper methods

  private getSessionId(context: AgentContext): string {
    return `${context.module}-${context.patientId || 'general'}`;
  }

  private buildSystemPrompt(context: AgentContext): string {
    const basePrompt = `You are an AI medical assistant integrated into a hospital management system.`;
    
    const modulePrompts = {
      emergency: `You are assisting in the Emergency Department. Focus on rapid triage, protocol recommendations, and resource allocation. Prioritize life-threatening conditions.`,
      laboratory: `You are assisting in the Laboratory. Focus on result interpretation, abnormality detection, and test recommendations. Flag critical values immediately.`,
      nursing: `You are assisting nursing staff. Focus on task prioritization, medication safety, and patient care coordination. Help optimize workflow efficiency.`,
      diagnostic: `You are assisting with clinical diagnosis. Focus on differential diagnosis, evidence-based recommendations, and treatment guidelines. Consider patient history and test results.`,
      pharmacy: `You are assisting in the Pharmacy. Focus on medication safety, drug interactions, and prescription verification.`,
      radiology: `You are assisting in Radiology. Focus on imaging interpretation, protocol selection, and report generation.`,
      admin: `You are assisting with administrative tasks. Focus on data analysis, reporting, and operational insights.`
    };

    return `${basePrompt}\n\n${modulePrompts[context.module] || modulePrompts.admin}\n\nCurrent context: ${JSON.stringify(context)}`;
  }

  private async callAgentAPI(
    message: string,
    context: AgentContext,
    history: AgentMessage[]
  ): Promise<any> {
    // TODO: Implement actual Elasticsearch Agent Builder API call
    // For now, return mock response
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      content: this.generateMockResponse(message, context),
      actions: this.generateMockActions(context),
      context: { processed: true }
    };
  }

  private generateMockResponse(message: string, context: AgentContext): string {
    // Mock intelligent responses based on context
    const responses = {
      emergency: `Based on the patient's vitals and symptoms, I recommend immediate assessment. The elevated heart rate and blood pressure suggest potential cardiac involvement. I've searched our protocol database and identified the Cardiac Arrest Protocol as most relevant.`,
      laboratory: `I've analyzed the lab results. The glucose level of 180 mg/dL is elevated (normal range: 70-100 mg/dL). This suggests hyperglycemia. I recommend: 1) HbA1c test to assess long-term glucose control, 2) Lipid panel, 3) Kidney function tests.`,
      nursing: `I've prioritized your tasks based on patient acuity. Critical: Room 301 - medication due in 10 minutes. Urgent: Room 205 - vital signs check. I've also generated a handoff report for the incoming shift.`,
      diagnostic: `Based on the symptoms (chest pain, shortness of breath, elevated troponin), the differential diagnosis includes: 1) Acute Myocardial Infarction (most likely), 2) Unstable Angina, 3) Pulmonary Embolism. I recommend immediate ECG and cardiac catheterization.`
    };

    return responses[context.module] || `I'm analyzing your request in the context of ${context.module}. How can I assist you further?`;
  }

  private generateMockActions(context: AgentContext): AgentAction[] {
    const actions: AgentAction[] = [];

    if (context.module === 'emergency') {
      actions.push({
        id: 'action-1',
        type: 'workflow',
        label: 'Execute Triage Protocol',
        description: 'Run automated triage workflow',
        status: 'pending'
      });
    }

    return actions;
  }

  // Action trigger methods
  private async triggerTriageAnalysis(context: AgentContext) {
    return this.sendMessage('Analyze this patient for triage priority', context);
  }

  private async triggerProtocolRecommendation(context: AgentContext) {
    return this.sendMessage('Recommend appropriate emergency protocol', context);
  }

  private async triggerResourceAllocation(context: AgentContext) {
    return this.sendMessage('Suggest optimal resource allocation', context);
  }

  private async triggerResultInterpretation(context: AgentContext) {
    return this.sendMessage('Interpret these lab results', context);
  }

  private async triggerAbnormalDetection(context: AgentContext) {
    return this.sendMessage('Detect abnormal or critical values', context);
  }

  private async triggerTestRecommendation(context: AgentContext) {
    return this.sendMessage('Recommend follow-up tests', context);
  }

  private async triggerTaskPrioritization(context: AgentContext) {
    return this.sendMessage('Prioritize my nursing tasks', context);
  }

  private async triggerMedicationCheck(context: AgentContext) {
    return this.sendMessage('Check medication safety', context);
  }

  private async triggerHandoffReport(context: AgentContext) {
    return this.sendMessage('Generate shift handoff report', context);
  }

  private async triggerDifferentialDiagnosis(context: AgentContext) {
    return this.sendMessage('Generate differential diagnosis', context);
  }

  private async triggerLiteratureSearch(context: AgentContext) {
    return this.sendMessage('Search medical literature', context);
  }

  private async triggerDrugInteractionCheck(context: AgentContext) {
    return this.sendMessage('Check for drug interactions', context);
  }
}

export const elasticsearchAgentService = new ElasticsearchAgentService();
