
import { supabase } from "@/integrations/supabase/client";
import { getClientIP, getGeoLocation } from "./geoService";
import { detectBrowser, detectDevice } from "./deviceDetection";

export const recordClick = async (
  slug: string,
  referrer: string = "direct",
  userAgent?: string
): Promise<void> => {
  try {
    console.log(`Recording click for slug: ${slug}, referrer: ${referrer}`);
    
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
    console.log("Client IP:", ip);
    
    // Extract browser and device info from user agent
    const browser = detectBrowser(userAgent);
    const device = detectDevice(userAgent);
    
    // Get geolocation data with better error handling
    const geoData = await getGeoLocation(ip);
    console.log("Geo data received:", geoData);
    
    // Ensure we have valid location data or use fallbacks
    const country = geoData.country && geoData.country !== 'Unknown' ? geoData.country : 'India';
    const region = geoData.region && geoData.region !== 'Unknown' ? geoData.region : '';
    const city = geoData.city && geoData.city !== 'Unknown' ? geoData.city : '';

    // Handle button clicks correctly - this is critical!
    let finalReferrer = referrer;
    
    // Explicitly set referrer to 'button' for buttons
    if (referrer === 'button' || (linkData.button_type && ['primary', 'streaming'].includes(linkData.button_type))) {
      finalReferrer = 'button';
      console.log("Setting referrer to 'button' for button click");
    }

    console.log("Final values for click record:", {
      link_id: linkData.id,
      ip,
      country,
      region,
      city,
      referrer: finalReferrer,
      browser,
      device,
      button_name: linkData.title
    });

    // Record the click with improved location data
    const { error: clickError } = await supabase.from('click_events').insert({
      link_id: linkData.id,
      ip,
      country,
      region,
      city,
      referrer: finalReferrer,
      browser,
      device,
      button_name: linkData.title
    });

    if (clickError) {
      console.error("Error recording click:", clickError);
    } else {
      console.log("Click successfully recorded");
    }
  } catch (error) {
    console.error("Error recording click:", error);
  }
};
