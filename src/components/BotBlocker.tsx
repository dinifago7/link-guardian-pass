
import React, { useState, useEffect } from 'react';
import { detectBot, createMouseTrap } from '../utils/botDetection';
import { Shield, AlertTriangle } from 'lucide-react';

interface BotBlockerProps {
  children: React.ReactNode;
}

const BotBlocker: React.FC<BotBlockerProps> = ({ children }) => {
  const [isBot, setIsBot] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkForBot = async () => {
      // Initial bot detection
      const initialBotCheck = detectBot();
      
      if (initialBotCheck) {
        setIsBot(true);
        setIsLoading(false);
        return;
      }
      
      // Create mouse trap for additional verification
      const humanVerified = await createMouseTrap();
      
      setIsBot(!humanVerified);
      setIsLoading(false);
    };
    
    checkForBot();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  if (isBot) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Restricted</h1>
          <p className="text-gray-600 mb-6">
            This service is only available to human users. Automated access is not permitted.
          </p>
          <div className="text-sm text-gray-500">
            <p>If you believe this is an error, please:</p>
            <ul className="mt-2 space-y-1">
              <li>• Enable JavaScript if disabled</li>
              <li>• Try refreshing the page</li>
              <li>• Contact support if the issue persists</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default BotBlocker;
