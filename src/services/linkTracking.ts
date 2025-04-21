
import { supabase } from '@/integrations/supabase/client';
import { TrackedLink, ClickData, UtmParameters } from '@/types/linkTracking';
import { nanoid } from 'nanoid';

// Record a click on a link
export const recordClick = async (
  slug: string, 
  referrer: string = 'direct', 
  userAgent: string = '', 
  buttonName: string = ''
) => {
  try {
    const timestamp = new Date().toISOString();
    const browser = detectBrowser(userAgent);
    const device = detectDevice(userAgent);
    
    // Simulate location data for now
    const locationData = await fetchLocation();
    
    // Insert click data into the database
    const { data, error } = await supabase
      .from('clicks')
      .insert({
        slug,
        timestamp,
        referrer,
        user_agent: userAgent,
        browser,
        device,
        button_name: buttonName,
        city: locationData.city,
        region: locationData.region,
        country: locationData.country,
        ip: locationData.ip
      });
      
    if (error) {
      console.error('Error recording click:', error);
      return false;
    }
    
    // Update the link's click count
    const { error: updateError } = await supabase
      .from('links')
      .update({ 
        clicks: supabase.rpc('increment', { row_id: slug, table_name: 'links' }) 
      })
      .eq('slug', slug);
    
    if (updateError) {
      console.error('Error updating click count:', updateError);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error recording click:', error);
    return false;
  }
};

// Create a new short URL
export const createShortUrl = async (
  originalUrl: string,
  title: string,
  utmParameters?: UtmParameters,
  customSlug?: string,
  linkType: string = 'redirect',
  parentLandingPage?: string
) => {
  try {
    // Generate short code or use custom slug
    const slug = customSlug || generateShortCode();
    
    // Create link object
    const newLink = {
      slug,
      title,
      redirect_url: originalUrl,
      created_at: new Date().toISOString(),
      clicks: 0,
      utm_source: utmParameters?.source || null,
      utm_medium: utmParameters?.medium || null,
      utm_campaign: utmParameters?.campaign || null,
      utm_content: utmParameters?.content || null,
      utm_term: utmParameters?.term || null,
      button_type: linkType,
      parent_landing_page: parentLandingPage || null
    };
    
    // Insert into database
    const { data, error } = await supabase
      .from('links')
      .insert(newLink)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating short URL:', error);
      return null;
    }
    
    // Transform to TrackedLink format
    const trackedLink: TrackedLink = {
      id: data.id,
      originalUrl: data.redirect_url,
      shortUrl: `${window.location.origin}/${data.slug}`,
      title: data.title,
      createdAt: data.created_at,
      clicks: data.clicks,
      clickHistory: [],
      linkType: data.button_type,
      parentLandingPage: data.parent_landing_page,
      utmParameters: data.utm_source ? {
        source: data.utm_source,
        medium: data.utm_medium,
        campaign: data.utm_campaign,
        content: data.utm_content,
        term: data.utm_term
      } : undefined
    };
    
    return trackedLink;
  } catch (error) {
    console.error('Error creating short URL:', error);
    return null;
  }
};

// Get all links
export const getAllLinks = async (): Promise<TrackedLink[]> => {
  try {
    // Fetch all links
    const { data: links, error } = await supabase
      .from('links')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      console.error('Error fetching links:', error);
      return [];
    }
    
    // Fetch all clicks
    const { data: clicks, error: clicksError } = await supabase
      .from('clicks')
      .select('*');
      
    if (clicksError) {
      console.error('Error fetching clicks:', clicksError);
      return [];
    }
    
    // Transform to TrackedLink format
    return links.map(link => {
      // Get clicks for this link
      const linkClicks = clicks.filter(click => click.slug === link.slug);
      
      // Transform clicks to ClickData format
      const clickHistory: ClickData[] = linkClicks.map(click => ({
        timestamp: click.timestamp,
        referrer: click.referrer,
        browser: click.browser,
        device: click.device,
        location: click.location,
        city: click.city,
        region: click.region,
        country: click.country,
        buttonName: click.button_name
      }));
      
      // Create TrackedLink object
      return {
        id: link.id,
        originalUrl: link.redirect_url,
        shortUrl: `${window.location.origin}/${link.slug}`,
        title: link.title,
        createdAt: link.created_at,
        clicks: link.clicks,
        clickHistory,
        linkType: link.button_type,
        parentLandingPage: link.parent_landing_page,
        utmParameters: link.utm_source ? {
          source: link.utm_source,
          medium: link.utm_medium,
          campaign: link.utm_campaign,
          content: link.utm_content,
          term: link.utm_term
        } : undefined
      };
    });
  } catch (error) {
    console.error('Error fetching links:', error);
    return [];
  }
};

// Delete a link
export const deleteLink = async (id: string): Promise<boolean> => {
  try {
    // First get the link to find its slug
    const { data: link, error: linkError } = await supabase
      .from('links')
      .select('slug')
      .eq('id', id)
      .single();
      
    if (linkError) {
      console.error('Error finding link to delete:', linkError);
      return false;
    }
    
    // Delete clicks for this link
    const { error: clicksError } = await supabase
      .from('clicks')
      .delete()
      .eq('slug', link.slug);
      
    if (clicksError) {
      console.error('Error deleting clicks:', clicksError);
      // Continue anyway
    }
    
    // Delete the link
    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('Error deleting link:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting link:', error);
    return false;
  }
};

// Generate a short code
const generateShortCode = (): string => {
  return nanoid(6);
};

// Detect browser from user agent
const detectBrowser = (userAgent: string): string => {
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('firefox')) return 'Firefox';
  if (ua.includes('edg')) return 'Edge';
  if (ua.includes('chrome')) return 'Chrome';
  if (ua.includes('safari')) return 'Safari';
  if (ua.includes('opera') || ua.includes('opr')) return 'Opera';
  
  return 'Unknown';
};

// Detect device from user agent
const detectDevice = (userAgent: string): string => {
  const ua = userAgent.toLowerCase();
  
  if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) return 'iOS';
  if (ua.includes('android')) return 'Android';
  if (ua.includes('windows phone')) return 'Windows Phone';
  
  if (
    ua.includes('mobile') || 
    ua.includes('android') || 
    ua.includes('iphone') || 
    ua.includes('ipad') || 
    ua.includes('ipod')
  ) {
    return 'Mobile';
  }
  
  if (ua.includes('tablet') || ua.includes('ipad')) {
    return 'Tablet';
  }
  
  return 'Desktop';
};

// Fetch location from IP (using IP geolocation API)
const fetchLocation = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    return {
      city: data.city || 'Unknown',
      region: data.region || 'Unknown',
      country: data.country_name || 'Unknown',
      ip: data.ip || 'Unknown'
    };
  } catch (error) {
    console.error('Error fetching location:', error);
    return {
      city: 'Unknown',
      region: 'Unknown',
      country: 'Unknown',
      ip: 'Unknown'
    };
  }
};
