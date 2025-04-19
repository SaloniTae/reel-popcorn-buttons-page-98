
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TrackedLink, UtmParameters } from '@/types/linkTracking';
import { createShortUrl, getAllLinks as fetchAllLinks, recordClick, deleteLink as removeLink } from '@/services/linkTracking';
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
  getAllLinks: () => Promise<TrackedLink[]>;
}

const LinkTrackingContext = createContext<LinkTrackingContextType | undefined>(undefined);

export const LinkTrackingProvider = ({ children }: { children: ReactNode }) => {
  const [links, setLinks] = useState<TrackedLink[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    setLoading(true);
    try {
      const fetchedLinks = await fetchAllLinks();
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
  
  const getAllLinks = async () => {
    return await fetchAllLinks();
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
        if (parentLandingPage) {
          newLink.parentLandingPage = parentLandingPage;
          newLink.isButton = true;
        }
        
        setLinks(prev => [newLink, ...prev]);
        toast.success(`${linkType === "landing" ? "Landing page" : "Link"} created successfully`);
        
        if (linkType === "landing" && customSlug) {
          // Ensure we're using the exact custom slug for button creation
          const exactSlug = customSlug;
          
          const trackingButtons = [
            { slug: `${exactSlug}-buy`, title: 'Buy Now Button', type: 'primary' },
            { slug: `${exactSlug}-netflix`, title: 'Netflix Button', type: 'streaming' },
            { slug: `${exactSlug}-prime`, title: 'Prime Video Button', type: 'streaming' },
            { slug: `${exactSlug}-crunchyroll`, title: 'Crunchyroll Button', type: 'streaming' }
          ];
          
          for (const button of trackingButtons) {
            await createShortUrl(
              'https://telegram.me/ott_on_rent',
              button.title,
              undefined,
              button.slug,
              button.type
            );
          }
          
          await refreshLinks();
        }
        
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
      const shortCode = shortUrl.split('oor.link/')[1];
      
      if (!shortCode) {
        console.error("Invalid short URL:", shortUrl);
        return;
      }
      
      await recordClick(shortCode, referrer, navigator.userAgent);
      
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
      // First, let's check if this is a landing page
      const linkToDelete = links.find(link => link.id === id);
      
      if (linkToDelete && linkToDelete.linkType === 'landing') {
        // If it's a landing page, get its associated buttons
        const landingPageSlug = linkToDelete.shortUrl.split('/').pop() || '';
        const associatedButtons = links.filter(link => {
          return link.shortUrl.includes(`${landingPageSlug}-`) || 
                 (link.parentLandingPage === landingPageSlug);
        });
        
        // Delete all associated buttons first
        for (const button of associatedButtons) {
          await removeLink(button.id);
          console.log(`Deleted associated button: ${button.title}`);
        }
        
        // Update local state to remove the buttons
        setLinks(prev => prev.filter(link => 
          !associatedButtons.some(button => button.id === link.id)
        ));
        
        toast.success("Deleted all associated buttons");
      }
      
      // Now delete the main link
      const success = await removeLink(id);
      
      if (success) {
        setLinks(prev => prev.filter(link => link.id !== id));
        toast.success(linkToDelete?.linkType === 'landing' 
          ? "Landing page and all associated buttons deleted" 
          : "Link deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting link:", error);
      toast.error("Failed to delete link");
    }
  };

  const getLink = (id: string) => {
    return links.find(link => link.id === id);
  };

  const getLandingPages = () => {
    return links.filter(link => link.linkType === 'landing');
  };

  const getButtonsForLandingPage = (landingPageSlug: string) => {
    return links.filter(link => {
      // Match links that have the landing page slug in their shortUrl or as parentLandingPage
      const isAssociated = link.shortUrl.includes(`${landingPageSlug}-`) || 
                         (link.parentLandingPage === landingPageSlug);
      
      // Filter out the landing page itself
      const isNotLandingPage = link.linkType !== 'landing';
      
      return isAssociated && isNotLandingPage;
    });
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
        getButtonsForLandingPage,
        getAllLinks
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
