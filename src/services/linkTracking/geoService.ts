
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

// Get geolocation from IP
export const getGeoLocation = async (ip: string) => {
  try {
    const { data, error } = await supabase.functions.invoke('geo-lookup', {
      body: { ip }
    });

    if (error) {
      console.error("Error getting geolocation:", error);
      return { country: 'India', region: 'Unknown', city: 'Unknown' };
    }

    return data;
  } catch (error) {
    console.error("Error invoking geo-lookup function:", error);
    return { country: 'India', region: 'Unknown', city: 'Unknown' };
  }
};
