/**
 * Agent Insight Card - Shows AI insights inline in the dashboard
 * Appears throughout the UI with contextual intelligence
 */

import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle, ArrowRight, Zap } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface AgentInsightCardProps {
  type: 'insight' | 'warning' | 'recommendation' | 'success';
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  metrics?: {
    label: string;
    value: string;
    trend?: 'up' | 'down' | 'neutral';
  }[];
  priority?: 'high' | 'medium' | 'low';
  compact?: boolean;
}

export default function AgentInsightCard({
  type,
  title,
  description,
  action,
  metrics,
  priority = 'medium',
  compact = false
}: AgentInsightCardProps) {
  const getTypeConfig = () => {
    switch (type) {
      case 'warning':
        return {
          icon: AlertTriangle,
          color: 'border-orange-500 bg-orange-50 dark:bg-orange-900/20',
          iconColor: 'text-orange-600',
          badgeColor: 'bg-orange-100 text-orange-800'
        };
      case 'recommendation':
        return {
          icon: Sparkles,
          color: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20',
          iconColor: 'text-purple-600',
          badgeColor: 'bg-purple-100 text-purple-800'
        };
      case 'success':
        return {
          icon: CheckCircle,
          color: 'border-green-500 bg-green-50 dark:bg-green-900/20',
          iconColor: 'text-green-600',
          badgeColor: 'bg-green-100 text-green-800'
        };
      default:
        return {
          icon: TrendingUp,
          color: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
          iconColor: 'text-blue-600',
          badgeColor: 'bg-blue-100 text-blue-800'
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  if (compact) {
    return (
      <div className={`flex items-center gap-3 p-3 rounded-lg border-2 ${config.color} transition-all hover:shadow-md`}>
        <Icon className={`w-5 h-5 ${config.iconColor} flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{title}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{description}</p>
        </div>
        {action && (
          <Button size="sm" variant="ghost" onClick={action.onClick} className="flex-shrink-0">
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <Card className={`border-2 ${config.color} transition-all hover:shadow-lg`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full ${config.badgeColor} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${config.iconColor}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-sm">{title}</h4>
              <Badge variant="outline" className="text-xs">
                <Zap className="w-3 h-3 mr-1" />
                AI
              </Badge>
              {priority === 'high' && (
                <Badge variant="destructive" className="text-xs">Urgent</Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {description}
            </p>

            {metrics && metrics.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-3">
                {metrics.map((metric, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded p-2">
                    <p className="text-xs text-gray-500">{metric.label}</p>
                    <div className="flex items-center gap-1">
                      <p className="text-lg font-bold">{metric.value}</p>
                      {metric.trend === 'up' && (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      )}
                      {metric.trend === 'down' && (
                        <TrendingUp className="w-4 h-4 text-red-600 rotate-180" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {action && (
              <Button 
                size="sm" 
                onClick={action.onClick}
                className="w-full"
              >
                {action.label}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Powered by Elasticsearch Agent Builder
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
