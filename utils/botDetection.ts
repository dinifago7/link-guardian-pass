
export const detectBot = (): boolean => {
  // Check if running in browser environment
  if (typeof window === 'undefined') return true;
  
  // Check user agent for common bot patterns (only the most obvious ones)
  const userAgent = navigator.userAgent.toLowerCase();
  const strictBotPatterns = [
    'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
    'yandexbot', 'crawler', 'spider', 'scraper', 'wget', 'curl'
  ];
  
  if (strictBotPatterns.some(pattern => userAgent.includes(pattern))) {
    return true;
  }
  
  // Only check for the most obvious automation indicators
  try {
    // Check for webdriver (automation tools)
    if ('webdriver' in navigator && (navigator as any).webdriver === true) {
      return true;
    }
    
    // Check for obvious automation indicators
    if ((window as any).callPhantom || (window as any)._phantom || (window as any).phantom) {
      return true;
    }
    
    // Remove screen size and plugins checks as they can cause false positives
    return false;
  } catch (error) {
    // If any check fails, allow access (less aggressive)
    return false;
  }
};

export const createMouseTrap = (): Promise<boolean> => {
  return new Promise((resolve) => {
    let humanVerified = false;
    
    const mouseHandler = () => {
      humanVerified = true;
      cleanup();
      resolve(true);
    };
    
    const clickHandler = () => {
      humanVerified = true;
      cleanup();
      resolve(true);
    };
    
    const keyHandler = () => {
      humanVerified = true;
      cleanup();
      resolve(true);
    };
    
    const cleanup = () => {
      document.removeEventListener('mousemove', mouseHandler);
      document.removeEventListener('click', clickHandler);
      document.removeEventListener('keydown', keyHandler);
    };
    
    document.addEventListener('mousemove', mouseHandler);
    document.addEventListener('click', clickHandler);
    document.addEventListener('keydown', keyHandler);
    
    // Reduce timeout to 5 seconds and default to allowing access
    setTimeout(() => {
      cleanup();
      resolve(true); // Default to allowing access instead of blocking
    }, 5000);
  });
};
