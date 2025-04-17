
import { createContext, useContext, useState, ReactNode } from 'react';
import { TrackedLink, UtmParameters } from '@/types/linkTracking';
import { mockLinks } from '@/lib/mockData';

interface LinkTrackingContextType {
  links: TrackedLink[];
  addLink: (originalUrl: string, title: string, utmParameters?: UtmParameters) => TrackedLink;
  recordClick: (shortUrl: string, referrer?: string) => void;
  deleteLink: (id: string) => void;
  getLink: (id: string) => TrackedLink | undefined;
}

const LinkTrackingContext = createContext<LinkTrackingContextType | undefined>(undefined);

export const LinkTrackingProvider = ({ children }: { children: ReactNode }) => {
  const [links, setLinks] = useState<TrackedLink[]>(mockLinks);

  const generateShortUrl = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .slice(0, 8);
    const randomChars = Math.random().toString(36).slice(2, 5);
    return `oor.link/${slug}${randomChars}`;
  };
  
  // This would normally be the domain of your server
  // For demo purposes we're using a simulated format
  const getActualShortUrl = (shortUrl: string) => {
    // Extract only the code part after oor.link/
    const shortCode = shortUrl.split('oor.link/')[1];
    return `/r/${shortCode}`;
  };

  const addLink = (originalUrl: string, title: string, utmParameters?: UtmParameters): TrackedLink => {
    const newLink: TrackedLink = {
      id: Math.random().toString(36).substring(2, 15),
      originalUrl,
      shortUrl: generateShortUrl(title),
      title,
      createdAt: new Date().toISOString(),
      utmParameters,
      clicks: 0,
      clickHistory: []
    };
    
    setLinks(prev => [...prev, newLink]);
    return newLink;
  };

  const recordClick = (shortUrl: string, referrer?: string) => {
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
  };

  const deleteLink = (id: string) => {
    setLinks(prev => prev.filter(link => link.id !== id));
  };

  const getLink = (id: string) => {
    return links.find(link => link.id === id);
  };

  return (
    <LinkTrackingContext.Provider value={{ links, addLink, recordClick, deleteLink, getLink }}>
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
