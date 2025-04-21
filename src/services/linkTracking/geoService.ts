
import { supabase } from "@/integrations/supabase/client";

// Get client IP address
export const getClientIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Error getting IP:", error);
    return "";
  }
};

// Get geolocation from IP with improved error handling
export const getGeoLocation = async (ip: string) => {
  try {
    if (!ip) {
      console.error("No IP provided for geolocation");
      return { 
        country: 'Unknown', 
        region: 'Unknown', 
        city: 'Unknown',
        stateCode: 'UN'
      };
    }

    console.log("Calling geo-lookup function with IP:", ip);
    const { data, error } = await supabase.functions.invoke('geo-lookup', {
      body: { ip }
    });

    if (error) {
      console.error("Error getting geolocation:", error);
      return { 
        country: 'India', 
        region: 'Unknown', 
        city: 'Unknown',
        stateCode: 'UN'
      };
    }

    console.log("Geolocation data received:", data);
    
    // Ensure we have valid data with fallbacks
    return {
      country: data.country || 'India',
      region: data.region || 'Unknown',
      city: data.city || 'Unknown',
      stateCode: data.stateCode || 'UN'
    };
  } catch (error) {
    console.error("Error invoking geo-lookup function:", error);
    return { 
      country: 'India', 
      region: 'Unknown', 
      city: 'Unknown',
      stateCode: 'UN'
    };
  }
};
