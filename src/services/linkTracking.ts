
import { supabase } from "@/integrations/supabase/client";
import { detectBrowser, detectDevice } from "./linkTracking/deviceDetection";
import { createShortUrl, getAllLinks, deleteLink } from "./linkTracking/linkService";
import { recordClick as recordClickService } from "./linkTracking/clickService";

// Re-export functions from linkService
export { createShortUrl, getAllLinks, deleteLink };

// Forward to the new implementation
export const recordClick = async (
  slug: string,
  referrer: string,
  userAgent: string
): Promise<void> => {
  return recordClickService(slug, referrer, userAgent);
};
