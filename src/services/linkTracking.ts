
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
    
    // Find the link_id from slug
    const { data: linkData, error: linkError } = await supabase
      .from('links')
      .select('id')
      .eq('slug', slug)
      .single();
      
    if (linkError) {
      console.error('Error finding link:', linkError);
      return false;
    }
    
    // Insert click data into the database using click_events table
    const { data, error } = await supabase
      .from('click_events')
      .insert({
        link_id: linkData.id,
        timestamp,
        referrer,
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
      clicks: 0, // We don't have clicks in the links table, initialize to 0
      clickHistory: [],
      linkType: data.button_type,
      parentLandingPage: data.parent_landing_page,
      utmParameters: utmParameters // Use passed utm parameters
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
      .from('click_events')
      .select('*');
      
    if (clicksError) {
      console.error('Error fetching clicks:', clicksError);
      return [];
    }
    
    // Transform to TrackedLink format
    return links.map(link => {
      // Get clicks for this link
      const linkClicks = clicks.filter(click => click.link_id === link.id);
      
      // Transform clicks to ClickData format
      const clickHistory: ClickData[] = linkClicks.map(click => ({
        timestamp: click.timestamp,
        referrer: click.referrer || 'direct',
        browser: click.browser,
        device: click.device,
        location: `${click.city || ''}, ${click.region || ''}, ${click.country || 'India'}`,
        city: click.city,
        region: click.region,
        country: click.country,
        buttonName: click.button_name,
        ip: click.ip
      }));
      
      // Create TrackedLink object
      return {
        id: link.id,
        originalUrl: link.redirect_url,
        shortUrl: `${window.location.origin}/${link.slug}`,
        title: link.title,
        createdAt: link.created_at,
        clicks: linkClicks.length,
        clickHistory,
        linkType: link.button_type,
        parentLandingPage: link.parent_landing_page,
        utmParameters: {}  // Initialize empty utmParameters since they're not in the DB table
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
    // First delete all click_events for this link
    const { error: clicksError } = await supabase
      .from('click_events')
      .delete()
      .eq('link_id', id);
      
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
