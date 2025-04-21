
import { supabase } from "@/integrations/supabase/client";
import { getClientIP, getGeoLocation } from "./geoService";
import { detectBrowser, detectDevice } from "./deviceDetection";

export const recordClick = async (
  slug: string,
  referrer: string = "direct",
  userAgent?: string
): Promise<void> => {
  try {
    // Get the link details
    const { data: linkData, error: linkError } = await supabase
      .from('links')
      .select('id, title, button_type')
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
    const geoData = await getGeoLocation(ip);
    const { country, region, city, stateCode } = geoData;

    console.log("Geo data for click:", { country, region, city, stateCode });

    // Ensure referrer is correctly set to 'button' for button clicks
    // This is critical for properly tracking button interactions
    let effectiveReferrer = referrer || 'direct';
    if (referrer === 'button' || (linkData.button_type && ['primary', 'streaming'].includes(linkData.button_type))) {
      effectiveReferrer = 'button';
    }

    // Record the click with improved location data
    const { error: clickError } = await supabase.from('click_events').insert({
      link_id: linkData.id,
      ip,
      country: country || 'Unknown',
      region: region || 'Unknown',
      city: city || 'Unknown',
      referrer: effectiveReferrer,
      browser,
      device,
      button_name: linkData.title
    });

    if (clickError) {
      console.error("Error recording click:", clickError);
    }
  } catch (error) {
    console.error("Error recording click:", error);
  }
};
