/**
 * Agent Quick Actions Bar - Shows AI-powered quick actions at the top of dashboard
 * Contextual actions that change based on what's happening
 */

import React from 'react';
import { Sparkles, Zap, TrendingUp, AlertCircle, Clock, Users } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  onClick: () => void;
  badge?: string;
  urgent?: boolean;
}

interface AgentQuickActionsProps {
  actions: QuickAction[];
  title?: string;
}

export default function AgentQuickActions({ actions, title = 'AI Recommendations' }: AgentQuickActionsProps) {
  if (actions.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">{title}</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Powered by Elasticsearch Agent Builder
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          <Zap className="w-3 h-3 mr-1" />
          {actions.length} actions
        </Badge>
      </div>

      <div className="flex flex-wrap gap-2">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.id}
              onClick={action.onClick}
              variant={action.urgent ? 'default' : 'outline'}
              size="sm"
              className={`${action.urgent ? 'bg-red-600 hover:bg-red-700 animate-pulse' : ''}`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {action.label}
              {action.badge && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {action.badge}
                </Badge>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
