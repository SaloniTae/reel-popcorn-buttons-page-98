
import { supabase } from "@/integrations/supabase/client";
import { TrackedLink, UtmParameters, ClickData } from "@/types/linkTracking";
import { toast } from "sonner";

export type LinkData = {
  id: string;
  original_url: string;
  short_code: string;
  title: string;
  created_at: string;
  utm_campaign?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_content?: string;
  utm_term?: string;
};

export type ClickDataFromDB = {
  id: string;
  link_id: string;
  timestamp: string;
  referrer?: string;
  browser?: string;
  device?: string;
  location?: string;
  ip?: string;
  user_agent?: string;
};

export const createShortUrl = async (
  originalUrl: string,
  title: string,
  utmParameters?: UtmParameters
): Promise<TrackedLink | null> => {
  try {
    // Generate a short code from the title plus some random characters
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 8);
    const randomChars = Math.random().toString(36).slice(2, 5);
    const shortCode = `${slug}${randomChars}`;

    // Insert the new link into Supabase
    const { data, error } = await supabase.from('links').insert({
      original_url: originalUrl,
      short_code: shortCode,
      title: title,
      utm_campaign: utmParameters?.campaign,
      utm_source: utmParameters?.source,
      utm_medium: utmParameters?.medium,
      utm_content: utmParameters?.content,
      utm_term: utmParameters?.term
    }).select().single();

    if (error) {
      console.error("Error creating link:", error);
      toast.error("Failed to create link");
      return null;
    }

    // Format the response to match TrackedLink type
    const trackedLink: TrackedLink = {
      id: data.id,
      originalUrl: data.original_url,
      shortUrl: `oor.link/${data.short_code}`,
      title: data.title,
      createdAt: data.created_at,
      utmParameters: {
        campaign: data.utm_campaign || undefined,
        source: data.utm_source || undefined,
        medium: data.utm_medium || undefined,
        content: data.utm_content || undefined,
        term: data.utm_term || undefined
      },
      clicks: 0,
      clickHistory: []
    };

    return trackedLink;
  } catch (error) {
    console.error("Error creating link:", error);
    toast.error("Failed to create link");
    return null;
  }
};

export const recordClick = async (
  shortCode: string,
  referrer?: string,
  userAgent?: string
): Promise<void> => {
  try {
    // Get the link details
    const { data: linkData, error: linkError } = await supabase
      .from('links')
      .select('id')
      .eq('short_code', shortCode)
      .single();

    if (linkError || !linkData) {
      console.error("Error finding link:", linkError);
      return;
    }

    // Extract browser and device info from user agent
    const browser = detectBrowser(userAgent);
    const device = detectDevice(userAgent);
    
    // Get approximate location from IP (this would normally use a service like ipinfo.io)
    const location = "Unknown"; // In a real app, you'd use a geolocation service

    // Record the click
    const { error: clickError } = await supabase.from('clicks').insert({
      link_id: linkData.id,
      referrer: referrer || 'direct',
      browser,
      device,
      location,
      user_agent: userAgent
    });

    if (clickError) {
      console.error("Error recording click:", clickError);
    }
  } catch (error) {
    console.error("Error recording click:", error);
  }
};

export const getAllLinks = async (): Promise<TrackedLink[]> => {
  try {
    // Get all links
    const { data: links, error: linksError } = await supabase
      .from('links')
      .select('*')
      .order('created_at', { ascending: false });

    if (linksError) {
      console.error("Error fetching links:", linksError);
      return [];
    }

    // Get click count for each link
    const linkIds = links.map(link => link.id);
    
    // Fixed: using countAll() instead of count
    const clickCounts: Record<string, number> = {};
    
    if (linkIds.length > 0) {
      const { data: clicksData, error: clicksCountError } = await supabase
        .from('clicks')
        .select('link_id')
        .in('link_id', linkIds);
        
      if (!clicksCountError && clicksData) {
        // Count clicks manually by grouping
        clicksData.forEach(click => {
          if (click.link_id) {
            clickCounts[click.link_id] = (clickCounts[click.link_id] || 0) + 1;
          }
        });
      }
    }

    // Get all clicks
    const { data: allClicks, error: allClicksError } = await supabase
      .from('clicks')
      .select('*')
      .in('link_id', linkIds);

    if (allClicksError) {
      console.error("Error fetching clicks:", allClicksError);
    }

    // Group clicks by link ID
    const clicksMap: Record<string, ClickDataFromDB[]> = {};
    
    if (allClicks) {
      allClicks.forEach(click => {
        if (!clicksMap[click.link_id]) {
          clicksMap[click.link_id] = [];
        }
        clicksMap[click.link_id].push(click);
      });
    }

    // Format the response to match TrackedLink[] type
    const trackedLinks: TrackedLink[] = links.map(link => {
      const linkClicks = clicksMap[link.id] || [];
      
      return {
        id: link.id,
        originalUrl: link.original_url,
        shortUrl: `oor.link/${link.short_code}`,
        title: link.title,
        createdAt: link.created_at,
        utmParameters: {
          campaign: link.utm_campaign || undefined,
          source: link.utm_source || undefined,
          medium: link.utm_medium || undefined,
          content: link.utm_content || undefined,
          term: link.utm_term || undefined
        },
        clicks: clickCounts[link.id] || 0,
        clickHistory: linkClicks.map(click => ({
          timestamp: click.timestamp,
          referrer: click.referrer,
          browser: click.browser,
          device: click.device,
          location: click.location
        }))
      };
    });

    return trackedLinks;
  } catch (error) {
    console.error("Error fetching links:", error);
    return [];
  }
};

export const deleteLink = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Error deleting link:", error);
      toast.error("Failed to delete link");
      return false;
    }

    toast.success("Link deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting link:", error);
    toast.error("Failed to delete link");
    return false;
  }
};

// Helper functions for browser and device detection
function detectBrowser(userAgent?: string): string {
  if (!userAgent) return "Unknown";
  
  if (userAgent.includes("Firefox")) return "Firefox";
  if (userAgent.includes("Chrome")) return "Chrome";
  if (userAgent.includes("Safari")) return "Safari";
  if (userAgent.includes("Edge")) return "Edge";
  if (userAgent.includes("MSIE") || userAgent.includes("Trident/")) return "Internet Explorer";
  
  return "Unknown";
}

function detectDevice(userAgent?: string): string {
  if (!userAgent) return "Unknown";
  
  if (userAgent.includes("Mobile")) return "Mobile";
  if (userAgent.includes("Tablet")) return "Tablet";
  if (userAgent.includes("iPad")) return "iPad";
  if (userAgent.includes("iPhone")) return "iPhone";
  if (userAgent.includes("Android")) return "Android";
  
  return "Desktop";
}
