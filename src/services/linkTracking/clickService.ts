
import { supabase } from "@/integrations/supabase/client";
import { getClientIP, getGeoLocation } from "./geoService";
import { detectBrowser, detectDevice } from "./deviceDetection";

export const recordClick = async (
  slug: string,
  referrer?: string,
  userAgent?: string
): Promise<void> => {
  try {
    // Get the link details
    const { data: linkData, error: linkError } = await supabase
      .from('links')
      .select('id, button_type')
      .eq('slug', slug)
      .single();

    if (linkError || !linkData) {
      console.error("Error finding link:", linkError);
      return;
    }

    // Get the client IP address
    const ip = await getClientIP();
    
    // Extract browser and device info from user agent
    const browser = detectBrowser(userAgent);
    const device = detectDevice(userAgent);
    
    // Get geolocation data
    const { country, region, city, stateCode } = await getGeoLocation(ip);

    // Record the click
    const { error: clickError } = await supabase.from('click_events').insert({
      link_id: linkData.id,
      ip,
      country,
      region,
      city,
      referrer: referrer || 'direct',
      browser,
      device,
      button_name: linkData.button_type
    });

    if (clickError) {
      console.error("Error recording click:", clickError);
    }
  } catch (error) {
    console.error("Error recording click:", error);
  }
};
