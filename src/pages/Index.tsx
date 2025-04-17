
import "../styles/landing-page.css";
import { useEffect, useState } from "react";
import LandingPageTemplate from "@/components/landing/LandingPageTemplate";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [trackingSlugs, setTrackingSlugs] = useState({
    buyNow: "",
    netflix: "",
    prime: "",
    crunchyroll: ""
  });

  // Set up tracking links
  useEffect(() => {
    const setupTrackingLinks = async () => {
      try {
        // Check if tracking links already exist
        const { data: existingLinks, error } = await supabase
          .from('links')
          .select('slug, title, button_type')
          .in('button_type', ['primary', 'streaming']);
          
        if (error) {
          console.error("Error fetching tracking links:", error);
          return;
        }
        
        const slugMap: Record<string, string> = {};
        
        // Map links to their respective buttons
        if (existingLinks && existingLinks.length > 0) {
          existingLinks.forEach(link => {
            if (link.title === 'Buy Now Button' || link.button_type === 'primary') 
              slugMap.buyNow = link.slug;
            if (link.title === 'Netflix Button') 
              slugMap.netflix = link.slug;
            if (link.title === 'Prime Video Button') 
              slugMap.prime = link.slug;
            if (link.title === 'Crunchyroll Button') 
              slugMap.crunchyroll = link.slug;
          });
        }
        
        // Use default slugs if not found
        setTrackingSlugs({
          buyNow: slugMap.buyNow || "buynow",
          netflix: slugMap.netflix || "netflix",
          prime: slugMap.prime || "prime",
          crunchyroll: slugMap.crunchyroll || "crunchyroll"
        });
      } catch (err) {
        console.error("Error setting up tracking links:", err);
      }
    };
    
    setupTrackingLinks();
  }, []);

  return (
    <LandingPageTemplate 
      slug="home" 
      trackingSlugs={trackingSlugs}
    />
  );
};

export default Index;
