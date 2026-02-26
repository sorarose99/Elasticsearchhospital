/**
 * Floating Agent Button
 * Appears in bottom-right corner of dashboards to open agent panel
 */

import React, { useState, useEffect } from 'react';
import { Bot, Sparkles, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface AgentFloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
  hasNotifications?: boolean;
  notificationCount?: number;
  pulseAnimation?: boolean;
}

export default function AgentFloatingButton({ 
  onClick, 
  isOpen,
  hasNotifications = false,
  notificationCount = 0,
  pulseAnimation = true
}: AgentFloatingButtonProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    // Show tooltip on first load
    const hasSeenTooltip = localStorage.getItem('agent-tooltip-seen');
    if (!hasSeenTooltip) {
      setTimeout(() => {
        setShowTooltip(true);
        setTimeout(() => {
          setShowTooltip(false);
          localStorage.setItem('agent-tooltip-seen', 'true');
        }, 5000);
      }, 2000);
    }
  }, []);

  return (
    <>
      {/* Floating Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-40"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div className="relative">
          {/* Pulse animation */}
          {pulseAnimation && !isOpen && (
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 animate-ping opacity-75" />
          )}
          
          {/* Main button */}
          <Button
            onClick={onClick}
            size="lg"
            className={`relative w-16 h-16 rounded-full shadow-2xl transition-all duration-300 ${
              isOpen 
                ? 'bg-gray-600 hover:bg-gray-700' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
            }`}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="bot"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Bot className="w-6 h-6 text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>

          {/* Notification badge */}
          {hasNotifications && notificationCount > 0 && !isOpen && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1"
            >
              <Badge 
                variant="destructive" 
                className="w-6 h-6 rounded-full flex items-center justify-center p-0 text-xs"
              >
                {notificationCount > 9 ? '9+' : notificationCount}
              </Badge>
            </motion.div>
          )}

          {/* Sparkle indicator */}
          {!isOpen && (
            <motion.div
              className="absolute -top-2 -left-2"
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </motion.div>
          )}
        </div>

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="absolute right-20 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 w-64 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm mb-1">AI Agent Assistant</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Click here to get AI-powered assistance with your tasks!
                  </p>
                </div>
                <button
                  onClick={() => setShowTooltip(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              
              {/* Arrow */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
                <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-white dark:border-l-gray-800" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
