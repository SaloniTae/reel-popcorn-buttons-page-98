
import { supabase } from "@/integrations/supabase/client";
import { getBrowserInfo, getDeviceInfo } from "./linkTracking/deviceDetection";

export const recordClick = async (
  slug: string,
  referrer: string,
  userAgent: string
): Promise<void> => {
  try {
    // Get the link from the database
    const { data: linkData, error: linkError } = await supabase
      .from('links')
      .select('id, title')
      .eq('slug', slug)
      .maybeSingle();

    if (linkError || !linkData) {
      console.error("Error finding link:", linkError);
      return;
    }

    // Extract device and browser information
    const device = getDeviceInfo(userAgent);
    const browser = getBrowserInfo(userAgent);
    
    // Record the click in the database
    const { error: clickError } = await supabase.from('click_events').insert({
      link_id: linkData.id,
      button_name: linkData.title,
      referrer: referrer || null,
      device: device || null,
      browser: browser || null
    });

    if (clickError) {
      console.error("Error recording click:", clickError);
    }
  } catch (err) {
    console.error("Error in recordClick:", err);
  }
};
