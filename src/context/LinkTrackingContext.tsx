
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TrackedLink, UtmParameters } from '@/types/linkTracking';
import { createShortUrl, getAllLinks, recordClick, deleteLink } from '@/services/linkTracking';
import { toast } from "sonner";

interface LinkTrackingContextType {
  links: TrackedLink[];
  loading: boolean;
  addLink: (originalUrl: string, title: string, utmParameters?: UtmParameters, customSlug?: string, linkType?: string, parentLandingPage?: string) => Promise<TrackedLink | null>;
  recordClick: (shortUrl: string, referrer?: string) => void;
  deleteLink: (id: string) => Promise<void>;
  getLink: (id: string) => TrackedLink | undefined;
  refreshLinks: () => Promise<void>;
  getLandingPages: () => TrackedLink[];
  getButtonsForLandingPage: (landingPageSlug: string) => TrackedLink[];
}

const LinkTrackingContext = createContext<LinkTrackingContextType | undefined>(undefined);

export const LinkTrackingProvider = ({ children }: { children: ReactNode }) => {
  const [links, setLinks] = useState<TrackedLink[]>([]);
  const [loading, setLoading] = useState(true);

  // Load links when component mounts
  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    setLoading(true);
    try {
      const fetchedLinks = await getAllLinks();
      setLinks(fetchedLinks);
    } catch (error) {
      console.error("Error loading links:", error);
      toast.error("Failed to load links");
    } finally {
      setLoading(false);
    }
  };

  const refreshLinks = async () => {
    await loadLinks();
  };
  
  const handleAddLink = async (
    originalUrl: string, 
    title: string, 
    utmParameters?: UtmParameters,
    customSlug?: string,
    linkType?: string,
    parentLandingPage?: string
  ): Promise<TrackedLink | null> => {
    try {
      const newLink = await createShortUrl(originalUrl, title, utmParameters, customSlug, linkType);
      
      if (newLink) {
        // Add parent landing page reference if this is a button
        if (parentLandingPage) {
          newLink.parentLandingPage = parentLandingPage;
          newLink.isButton = true;
        }
        
        setLinks(prev => [newLink, ...prev]);
        toast.success(`${linkType === "landing" ? "Landing page" : "Link"} created successfully`);
        return newLink;
      }
      
      return null;
    } catch (error) {
      console.error("Error adding link:", error);
      toast.error("Failed to create link");
      return null;
    }
  };

  const handleRecordClick = async (shortUrl: string, referrer?: string) => {
    try {
      // Extract the short code from the URL
      const shortCode = shortUrl.split('oor.link/')[1];
      
      if (!shortCode) {
        console.error("Invalid short URL:", shortUrl);
        return;
      }
      
      // Record the click in the database
      await recordClick(shortCode, referrer, navigator.userAgent);
      
      // Update the local state
      setLinks(prev => 
        prev.map(link => {
          if (link.shortUrl === shortUrl) {
            const newClick = {
              timestamp: new Date().toISOString(),
              referrer: referrer || 'direct',
              browser: 'Unknown',
              device: 'Unknown',
              location: 'Unknown'
            };
            
            return {
              ...link,
              clicks: link.clicks + 1,
              clickHistory: [...link.clickHistory, newClick]
            };
          }
          return link;
        })
      );
    } catch (error) {
      console.error("Error recording click:", error);
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      const success = await deleteLink(id);
      
      if (success) {
        setLinks(prev => prev.filter(link => link.id !== id));
      }
    } catch (error) {
      console.error("Error deleting link:", error);
      toast.error("Failed to delete link");
    }
  };

  const getLink = (id: string) => {
    return links.find(link => link.id === id);
  };

  // Get all landing pages
  const getLandingPages = () => {
    return links.filter(link => link.linkType === 'landing');
  };

  // Get all buttons for a specific landing page
  const getButtonsForLandingPage = (landingPageSlug: string) => {
    return links.filter(link => 
      link.parentLandingPage === landingPageSlug || 
      (link.originalUrl && link.originalUrl.includes(landingPageSlug))
    );
  };

  return (
    <LinkTrackingContext.Provider 
      value={{ 
        links, 
        loading,
        addLink: handleAddLink, 
        recordClick: handleRecordClick, 
        deleteLink: handleDeleteLink, 
        getLink,
        refreshLinks,
        getLandingPages,
        getButtonsForLandingPage
      }}
    >
      {children}
    </LinkTrackingContext.Provider>
  );
};

export const useLinkTracking = () => {
  const context = useContext(LinkTrackingContext);
  if (context === undefined) {
    throw new Error('useLinkTracking must be used within a LinkTrackingProvider');
  }
  return context;
};
