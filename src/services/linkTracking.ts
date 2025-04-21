
import { supabase } from "@/integrations/supabase/client";
import { detectBrowser, detectDevice } from "./linkTracking/deviceDetection";
import { createShortUrl, getAllLinks, deleteLink } from "./linkTracking/linkService";

// Re-export functions from linkService
export { createShortUrl, getAllLinks, deleteLink };

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
    const device = detectDevice(userAgent);
    const browser = detectBrowser(userAgent);
    
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
