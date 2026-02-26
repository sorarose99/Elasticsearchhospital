/**
 * Elasticsearch Agent Assistant Panel
 * Reusable agent interface that embeds into any dashboard
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { 
  elasticsearchAgentService, 
  AgentContext, 
  AgentMessage,
  AgentSuggestion 
} from '../../services/ElasticsearchAgentService';

interface AgentAssistantPanelProps {
  context: AgentContext;
  isOpen: boolean;
  onClose: () => void;
  language?: 'en' | 'ar';
}

export default function AgentAssistantPanel({ 
  context, 
  isOpen, 
  onClose,
  language = 'en' 
}: AgentAssistantPanelProps) {
  const [messages, setMessages] = useState<AgentMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<AgentSuggestion[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      initializeAgent();
      loadSuggestions();
    }
  }, [isOpen, context]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeAgent = async () => {
    await elasticsearchAgentService.initializeAgent(context);
    const history = elasticsearchAgentService.getConversationHistory(context);
    setMessages(history.filter(m => m.role !== 'system'));
  };

  const loadSuggestions = async () => {
    const contextSuggestions = await elasticsearchAgentService.getContextualSuggestions(context);
    setSuggestions(contextSuggestions);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await elasticsearchAgentService.sendMessage(userMessage, context);
      const history = elasticsearchAgentService.getConversationHistory(context);
      setMessages(history.filter(m => m.role !== 'system'));
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = async (suggestion: AgentSuggestion) => {
    setIsLoading(true);
    try {
      await suggestion.action();
      const history = elasticsearchAgentService.getConversationHistory(context);
      setMessages(history.filter(m => m.role !== 'system'));
    } catch (error) {
      console.error('Error executing suggestion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'low': return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      default: return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const getModuleTitle = () => {
    const titles = {
      emergency: 'Emergency Agent',
      laboratory: 'Lab Agent',
      nursing: 'Nursing Agent',
      diagnostic: 'Diagnostic Agent',
      pharmacy: 'Pharmacy Agent',
      radiology: 'Radiology Agent',
      admin: 'Admin Agent'
    };
    return titles[context.module] || 'AI Agent';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-6 bottom-6 w-96 h-[600px] z-50 shadow-2xl rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">{getModuleTitle()}</h3>
            <p className="text-white/80 text-xs">Powered by Elasticsearch</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="text-white hover:bg-white/20"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && messages.length === 0 && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span className="text-sm font-medium">Quick Actions</span>
          </div>
          <div className="space-y-2">
            {suggestions.slice(0, 3).map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full text-left p-3 rounded-lg border-2 transition-all hover:shadow-md ${getPriorityColor(suggestion.priority)}`}
                disabled={isLoading}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{suggestion.title}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {suggestion.description}
                    </p>
                  </div>
                  <Zap className="w-4 h-4 text-purple-600 flex-shrink-0 ml-2" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 h-[calc(100%-200px)]">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {language === 'ar' 
                  ? 'مرحباً! كيف يمكنني مساعدتك اليوم؟'
                  : 'Hello! How can I assist you today?'}
              </p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                
                {/* Action buttons */}
                {message.actions && message.actions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {message.actions.map((action) => (
                      <Button
                        key={action.id}
                        size="sm"
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => elasticsearchAgentService.executeAction(action, context)}
                      >
                        {action.status === 'executing' && (
                          <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                        )}
                        {action.status === 'completed' && (
                          <CheckCircle className="w-3 h-3 mr-2 text-green-600" />
                        )}
                        {action.status === 'failed' && (
                          <AlertCircle className="w-3 h-3 mr-2 text-red-600" />
                        )}
                        {action.status === 'pending' && (
                          <Clock className="w-3 h-3 mr-2" />
                        )}
                        <span className="text-xs">{action.label}</span>
                      </Button>
                    ))}
                  </div>
                )}
                
                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Agent is thinking...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={language === 'ar' ? 'اكتب رسالتك...' : 'Type your message...'}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !inputMessage.trim()}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          Powered by Elasticsearch Agent Builder
        </p>
      </div>
    </div>
  );
}
