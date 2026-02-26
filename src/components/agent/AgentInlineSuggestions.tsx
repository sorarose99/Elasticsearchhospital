/**
 * Inline Agent Suggestions
 * Shows contextual AI suggestions directly in the workflow
 */

import React from 'react';
import { Sparkles, ArrowRight, Zap, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { AgentSuggestion } from '../services/ElasticsearchAgentService';

interface AgentInlineSuggestionsProps {
  suggestions: AgentSuggestion[];
  onSuggestionClick: (suggestion: AgentSuggestion) => void;
  title?: string;
  maxVisible?: number;
  compact?: boolean;
}

export default function AgentInlineSuggestions({
  suggestions,
  onSuggestionClick,
  title = 'AI Suggestions',
  maxVisible = 3,
  compact = false
}: AgentInlineSuggestionsProps) {
  if (suggestions.length === 0) return null;

  const visibleSuggestions = suggestions.slice(0, maxVisible);

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <Zap className="w-4 h-4 text-red-500" />;
      case 'medium': return <TrendingUp className="w-4 h-4 text-yellow-500" />;
      case 'low': return <Sparkles className="w-4 h-4 text-blue-500" />;
      default: return <Sparkles className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50 dark:bg-red-900/10';
      case 'medium': return 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10';
      case 'low': return 'border-blue-200 bg-blue-50 dark:bg-blue-900/10';
      default: return 'border-gray-200 bg-gray-50 dark:bg-gray-900/10';
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
            {visibleSuggestions[0].title}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
            {visibleSuggestions[0].description}
          </p>
        </div>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onSuggestionClick(visibleSuggestions[0])}
          className="flex-shrink-0"
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-white to-purple-50 dark:from-gray-900 dark:to-purple-900/20">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm">{title}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Powered by Elasticsearch Agent
            </p>
          </div>
          <Badge variant="secondary" className="text-xs">
            {suggestions.length} available
          </Badge>
        </div>

        <div className="space-y-2">
          {visibleSuggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => onSuggestionClick(suggestion)}
              className={`w-full text-left p-3 rounded-lg border-2 transition-all hover:shadow-md hover:scale-[1.02] ${getPriorityColor(suggestion.priority)}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getPriorityIcon(suggestion.priority)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm">{suggestion.title}</p>
                    {suggestion.priority === 'high' && (
                      <Badge variant="destructive" className="text-xs px-1.5 py-0">
                        Urgent
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {suggestion.description}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
              </div>
            </button>
          ))}
        </div>

        {suggestions.length > maxVisible && (
          <div className="mt-3 text-center">
            <Button variant="ghost" size="sm" className="text-xs">
              View {suggestions.length - maxVisible} more suggestions
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
