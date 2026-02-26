/**
 * Hook for using Elasticsearch Agent in any component
 * Provides easy integration of agent functionality
 */

import { useState, useCallback } from 'react';
import { AgentContext } from '../services/ElasticsearchAgentService';

export function useElasticsearchAgent(
  module: AgentContext['module'],
  additionalContext?: Partial<AgentContext>
) {
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [agentContext, setAgentContext] = useState<AgentContext>({
    module,
    ...additionalContext
  });

  const openAgent = useCallback((contextOverride?: Partial<AgentContext>) => {
    if (contextOverride) {
      setAgentContext(prev => ({ ...prev, ...contextOverride }));
    }
    setIsAgentOpen(true);
  }, []);

  const closeAgent = useCallback(() => {
    setIsAgentOpen(false);
  }, []);

  const toggleAgent = useCallback(() => {
    setIsAgentOpen(prev => !prev);
  }, []);

  const updateContext = useCallback((updates: Partial<AgentContext>) => {
    setAgentContext(prev => ({ ...prev, ...updates }));
  }, []);

  return {
    isAgentOpen,
    agentContext,
    openAgent,
    closeAgent,
    toggleAgent,
    updateContext
  };
}
