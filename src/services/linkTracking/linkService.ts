
import { supabase } from "@/integrations/supabase/client";
import { TrackedLink, UtmParameters, ClickData } from "@/types/linkTracking";
import { ClickDataFromDB, LinkData } from "./types";
import { toast } from "sonner";

export const createShortUrl = async (
  originalUrl: string,
  title: string,
  utmParameters?: UtmParameters
): Promise<TrackedLink | null> => {
  try {
    // Generate a short slug from the title plus some random characters
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 8);
    const randomChars = Math.random().toString(36).slice(2, 5);
    const shortSlug = `${slug}${randomChars}`;

    // Build the redirect URL with UTM parameters if provided
    let redirectUrl = 'https://telegram.me/ott_on_rent';
    if (utmParameters) {
      const params = new URLSearchParams();
      if (utmParameters.campaign) params.append('utm_campaign', utmParameters.campaign);
      if (utmParameters.source) params.append('utm_source', utmParameters.source);
      if (utmParameters.medium) params.append('utm_medium', utmParameters.medium);
      if (utmParameters.content) params.append('utm_content', utmParameters.content);
      if (utmParameters.term) params.append('utm_term', utmParameters.term);
      
      if (params.toString()) {
        redirectUrl += `?${params.toString()}`;
      }
    }

    // Insert the new link into Supabase
    const { data, error } = await supabase.from('links').insert({
      slug: shortSlug,
      title: title,
      redirect_url: redirectUrl,
      button_type: 'custom'
    }).select().single();

    if (error) {
      console.error("Error creating link:", error);
      toast.error("Failed to create link");
      return null;
    }

    // Format the response to match TrackedLink type
    const trackedLink: TrackedLink = {
      id: data.id,
      originalUrl: originalUrl,
      shortUrl: `oor.link/${data.slug}`,
      title: data.title,
      createdAt: data.created_at,
      utmParameters: utmParameters || {},
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

    // Get all click events
    const linkIds = links.map(link => link.id);
    
    let clickEvents: ClickDataFromDB[] = [];
    let clickCounts: Record<string, number> = {};
    
    if (linkIds.length > 0) {
      // Get click counts for each link
      const { count } = await supabase
        .from('click_events')
        .select('*', { count: 'exact', head: false })
        .in('link_id', linkIds)
        .throwOnError();
        
      // Get aggregated click counts per link_id  
      for (const linkId of linkIds) {
        const { count: linkCount } = await supabase
          .from('click_events')
          .select('*', { count: 'exact', head: false })
          .eq('link_id', linkId)
          .throwOnError();
          
        clickCounts[linkId] = linkCount || 0;
      }
      
      // Get click details
      const { data: clicksData, error: clicksError } = await supabase
        .from('click_events')
        .select('*')
        .in('link_id', linkIds)
        .order('timestamp', { ascending: false });
        
      if (!clicksError && clicksData) {
        clickEvents = clicksData;
      }
    }

    // Group clicks by link ID
    const clicksMap: Record<string, ClickDataFromDB[]> = {};
    
    clickEvents.forEach(click => {
      if (!clicksMap[click.link_id]) {
        clicksMap[click.link_id] = [];
      }
      clicksMap[click.link_id].push(click);
    });

    // Format the response to match TrackedLink[] type
    const trackedLinks: TrackedLink[] = links.map(link => {
      const linkClicks = clicksMap[link.id] || [];
      
      return {
        id: link.id,
        originalUrl: link.redirect_url,
        shortUrl: `oor.link/${link.slug}`,
        title: link.title,
        createdAt: link.created_at,
        utmParameters: {},
        clicks: clickCounts[link.id] || 0,
        clickHistory: linkClicks.map(click => ({
          timestamp: click.timestamp,
          referrer: click.referrer,
          browser: click.browser,
          device: click.device,
          location: `${click.city || ''}, ${click.region || ''}, ${click.country || 'India'}`
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
