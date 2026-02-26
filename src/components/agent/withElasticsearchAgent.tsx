/**
 * Higher-Order Component to inject Elasticsearch Agent into any dashboard
 * Usage: export default withElasticsearchAgent(YourDashboard, 'laboratory');
 */

import React from 'react';
import { useElasticsearchAgent } from '../../hooks/useElasticsearchAgent';
import AgentFloatingButton from './AgentFloatingButton';
import AgentAssistantPanel from './AgentAssistantPanel';
import { AgentContext } from '../../services/ElasticsearchAgentService';

interface WithAgentOptions {
  module: AgentContext['module'];
  language?: 'en' | 'ar';
  showNotifications?: boolean;
}

export function withElasticsearchAgent<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithAgentOptions | AgentContext['module']
) {
  const config: WithAgentOptions = typeof options === 'string' 
    ? { module: options, language: 'en', showNotifications: true }
    : options;

  return function WithAgentComponent(props: P) {
    const { isAgentOpen, agentContext, toggleAgent } = useElasticsearchAgent(config.module);

    return (
      <div className="relative">
        <WrappedComponent {...props} />
        
        {/* Elasticsearch Agent Integration */}
        <AgentFloatingButton 
          onClick={toggleAgent}
          isOpen={isAgentOpen}
          hasNotifications={config.showNotifications}
          pulseAnimation={true}
        />
        
        <AgentAssistantPanel
          context={agentContext}
          isOpen={isAgentOpen}
          onClose={toggleAgent}
          language={config.language}
        />
      </div>
    );
  };
}

/**
 * Hook-based alternative for functional components
 */
export function useAgentWrapper(module: AgentContext['module'], language: 'en' | 'ar' = 'en') {
  const { isAgentOpen, agentContext, toggleAgent, updateContext } = useElasticsearchAgent(module);

  const AgentComponents = () => (
    <>
      <AgentFloatingButton 
        onClick={toggleAgent}
        isOpen={isAgentOpen}
        pulseAnimation={true}
      />
      
      <AgentAssistantPanel
        context={agentContext}
        isOpen={isAgentOpen}
        onClose={toggleAgent}
        language={language}
      />
    </>
  );

  return {
    AgentComponents,
    isAgentOpen,
    agentContext,
    toggleAgent,
    updateContext
  };
}
