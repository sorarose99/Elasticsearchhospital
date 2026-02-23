import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  ShieldCheck, 
  ShieldX, 
  User, 
  LogOut,
  AlertTriangle
} from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface AuthStatus {
  isAuthenticated: boolean;
  hasValidToken: boolean;
  user?: {
    id: string;
    email: string;
    role: string;
  };
  tokenExpiry?: string;
  lastChecked: number;
}

interface AuthStatusIndicatorProps {
  onReauth?: () => void;
  className?: string;
}

export const AuthStatusIndicator: React.FC<AuthStatusIndicatorProps> = ({ 
  onReauth, 
  className = '' 
}) => {
  const [authStatus, setAuthStatus] = useState<AuthStatus | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    checkAuthStatus();
    
    // Check auth status periodically
    const interval = setInterval(checkAuthStatus, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('sb-access-token');
      const currentUser = localStorage.getItem('currentUser');
      
      let status: AuthStatus = {
        isAuthenticated: false,
        hasValidToken: false,
        lastChecked: Date.now()
      };
      
      if (token && currentUser) {
        try {
          const userData = JSON.parse(currentUser);
          
          // Try to decode token to check expiry (basic check)
          const tokenParts = token.split('.');
          if (tokenParts.length === 3) {
            const payload = JSON.parse(atob(tokenParts[1]));
            const expiry = payload.exp * 1000; // Convert to milliseconds
            const isExpired = Date.now() > expiry;
            
            status = {
              isAuthenticated: !isExpired,
              hasValidToken: !isExpired,
              user: userData,
              tokenExpiry: new Date(expiry).toISOString(),
              lastChecked: Date.now()
            };
          } else {
            // Invalid token format
            status.hasValidToken = false;
          }
        } catch (parseError) {
          console.error('Error parsing auth data:', parseError);
          status.hasValidToken = false;
        }
      }
      
      setAuthStatus(status);
      
      // Show indicator if there are auth issues
      setIsVisible(!status.isAuthenticated || !status.hasValidToken);
      
    } catch (error) {
      console.error('Auth status check failed:', error);
      setAuthStatus({
        isAuthenticated: false,
        hasValidToken: false,
        lastChecked: Date.now()
      });
      setIsVisible(true);
    }
  };

  const handleReauth = () => {
    // Clear stored auth data
    localStorage.removeItem('sb-access-token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('authType');
    
    if (onReauth) {
      onReauth();
    } else {
      window.location.reload();
    }
  };

  const getStatusIcon = () => {
    if (!authStatus) return <Shield className="h-4 w-4 text-gray-500" />;
    
    if (authStatus.isAuthenticated && authStatus.hasValidToken) {
      return <ShieldCheck className="h-4 w-4 text-green-500" />;
    } else {
      return <ShieldX className="h-4 w-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    if (!authStatus) return 'Checking authentication...';
    
    if (authStatus.isAuthenticated && authStatus.hasValidToken) {
      return `Authenticated as ${authStatus.user?.email || 'User'}`;
    } else if (!authStatus.hasValidToken) {
      return 'Session expired - please log in';
    } else {
      return 'Authentication required';
    }
  };

  const getStatusColor = () => {
    if (!authStatus) return 'bg-gray-100 border-gray-200';
    
    if (authStatus.isAuthenticated && authStatus.hasValidToken) {
      return 'bg-green-100 border-green-200';
    } else {
      return 'bg-red-100 border-red-200';
    }
  };

  const isTokenExpiringSoon = () => {
    if (!authStatus?.tokenExpiry) return false;
    
    const expiry = new Date(authStatus.tokenExpiry).getTime();
    const now = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    
    return (expiry - now) < fiveMinutes && (expiry - now) > 0;
  };

  if (!isVisible && !isTokenExpiringSoon()) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`${className}`}
    >
      <Alert className={`${getStatusColor()}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <AlertDescription className="font-medium">
              {getStatusText()}
            </AlertDescription>
          </div>
          
          <div className="flex items-center gap-2">
            {authStatus?.user && (
              <Badge variant="outline" className="text-xs">
                {authStatus.user.role}
              </Badge>
            )}
            
            {!authStatus?.isAuthenticated && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReauth}
                className="h-6 text-xs"
              >
                <LogOut className="h-3 w-3 mr-1" />
                Re-login
              </Button>
            )}
          </div>
        </div>
        
        {authStatus?.tokenExpiry && isTokenExpiringSoon() && (
          <div className="mt-2 text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
            <AlertTriangle className="h-3 w-3 inline mr-1" />
            Session expires soon - please save your work
          </div>
        )}
      </Alert>
    </motion.div>
  );
};

export default AuthStatusIndicator;