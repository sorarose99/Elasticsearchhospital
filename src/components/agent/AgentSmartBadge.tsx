/**
 * Agent Smart Badge - Shows AI-powered status/insights on any element
 * Can be attached to patient cards, test results, etc.
 */

import React from 'react';
import { Sparkles, AlertTriangle, TrendingUp, CheckCircle, Zap } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface AgentSmartBadgeProps {
  type: 'priority' | 'risk' | 'trend' | 'recommendation' | 'status';
  label: string;
  tooltip?: string;
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function AgentSmartBadge({
  type,
  label,
  tooltip,
  pulse = false,
  size = 'md'
}: AgentSmartBadgeProps) {
  const getTypeConfig = () => {
    switch (type) {
      case 'priority':
        return {
          icon: AlertTriangle,
          className: 'bg-red-100 text-red-800 border-red-300',
          iconColor: 'text-red-600'
        };
      case 'risk':
        return {
          icon: AlertTriangle,
          className: 'bg-orange-100 text-orange-800 border-orange-300',
          iconColor: 'text-orange-600'
        };
      case 'trend':
        return {
          icon: TrendingUp,
          className: 'bg-blue-100 text-blue-800 border-blue-300',
          iconColor: 'text-blue-600'
        };
      case 'recommendation':
        return {
          icon: Sparkles,
          className: 'bg-purple-100 text-purple-800 border-purple-300',
          iconColor: 'text-purple-600'
        };
      case 'status':
        return {
          icon: CheckCircle,
          className: 'bg-green-100 text-green-800 border-green-300',
          iconColor: 'text-green-600'
        };
      default:
        return {
          icon: Zap,
          className: 'bg-gray-100 text-gray-800 border-gray-300',
          iconColor: 'text-gray-600'
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  const badge = (
    <Badge 
      variant="outline" 
      className={`${config.className} ${sizeClasses[size]} border-2 font-semibold flex items-center gap-1 ${pulse ? 'animate-pulse' : ''}`}
    >
      <Icon className={`${iconSizes[size]} ${config.iconColor}`} />
      {label}
      <Sparkles className={`${iconSizes[size]} ml-1 opacity-70`} />
    </Badge>
  );

  if (tooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {badge}
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">{tooltip}</p>
            <p className="text-xs text-gray-500 mt-1">AI-powered insight</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return badge;
}
