
// Helper functions for browser and device detection
export const detectBrowser = (userAgent?: string): string => {
  if (!userAgent) return "Unknown";
  
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Safari")) return "Safari";
  if (userAgent.includes("Edge")) return "Edge";
  if (userAgent.includes("MSIE") || userAgent.includes("Trident/")) return "Internet Explorer";
  
  return "Unknown";
};

export const detectDevice = (userAgent?: string): string => {
  if (!userAgent) return "Unknown";
  
  if (userAgent.includes("Mobile")) return "Mobile";
  if (userAgent.includes("Tablet")) return "Tablet";
  if (userAgent.includes("iPad")) return "iPad";
  if (userAgent.includes("iPhone")) return "iPhone";
  if (userAgent.includes("Android")) return "Android";
  
  return "Desktop";
};
