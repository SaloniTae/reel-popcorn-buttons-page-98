
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { recordClick } from "@/services/linkTracking";
import NotFound from "./NotFound";
import LandingPageTemplate from "@/components/landing/LandingPageTemplate";
import "../styles/landing-page.css";

const LandingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [landingPageData, setLandingPageData] = useState<any>(null);
  const [trackingSlugs, setTrackingSlugs] = useState({
    buyNow: "",
    netflix: "",
    prime: "",
    crunchyroll: ""
  });

  // Fetch landing page data and set up tracking links
  useEffect(() => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    
    const fetchLandingPage = async () => {
      try {
        setLoading(true);
        
        // Fetch the landing page data
        const { data: landingPage, error: landingError } = await supabase
          .from('links')
          .select('id, title, slug')
          .eq('slug', slug)
          .eq('button_type', 'landing')
          .single();
          
        if (landingError) {
          console.error("Landing page not found:", landingError);
          setNotFound(true);
          setLoading(false);
          return;
        }
        
        if (!landingPage) {
          console.error("No landing page data returned");
          setNotFound(true);
          setLoading(false);
          return;
        }
        
        setLandingPageData(landingPage);
        
        // Record a visit to this landing page in the background
        // Non-blocking so it won't delay page load
        if (landingPage.slug) {
          recordClick(landingPage.slug, document.referrer, navigator.userAgent);
        }
        
        // Check if tracking links already exist for this landing page
        const { data: existingButtons } = await supabase
          .from('links')
          .select('slug, title, button_type')
          .eq('parent_landing_page', slug);
          
        // If buttons exist, use them
        if (existingButtons && existingButtons.length > 0) {
          const slugMap: Record<string, string> = {};
          
          existingButtons.forEach(button => {
            if (button.title === 'Buy Now Button') slugMap.buyNow = button.slug;
            if (button.title === 'Netflix Button') slugMap.netflix = button.slug;
            if (button.title === 'Prime Video Button') slugMap.prime = button.slug;
            if (button.title === 'Crunchyroll Button') slugMap.crunchyroll = button.slug;
          });
          
          setTrackingSlugs({
            buyNow: slugMap.buyNow || `${slug}-buy`,
            netflix: slugMap.netflix || `${slug}-netflix`,
            prime: slugMap.prime || `${slug}-prime`,
            crunchyroll: slugMap.crunchyroll || `${slug}-crunchyroll`
          });
          
          setLoading(false);
        } else {
          // Generate unique tracking slugs for this landing page
          const exactSlug = landingPage.slug;
          const trackingButtons = [
            { slug: `${exactSlug}-buy`, title: 'Buy Now Button', type: 'primary' },
            { slug: `${exactSlug}-netflix`, title: 'Netflix Button', type: 'streaming' },
            { slug: `${exactSlug}-prime`, title: 'Prime Video Button', type: 'streaming' },
            { slug: `${exactSlug}-crunchyroll`, title: 'Crunchyroll Button', type: 'streaming' }
          ];
          
          // Create tracking links
          try {
            const creationPromises = trackingButtons.map(button => 
              supabase.from('links').insert({
                slug: button.slug,
                title: button.title,
                redirect_url: 'https://telegram.me/ott_on_rent',
                button_type: button.type,
                parent_landing_page: exactSlug
              })
            );
            
            await Promise.all(creationPromises);
            
            setTrackingSlugs({
              buyNow: `${exactSlug}-buy`,
              netflix: `${exactSlug}-netflix`,
              prime: `${exactSlug}-prime`,
              crunchyroll: `${exactSlug}-crunchyroll`
            });
            
            setLoading(false);
          } catch (err) {
            console.error("Error creating tracking buttons:", err);
            // Still set default slugs even if creation fails
            setTrackingSlugs({
              buyNow: `${exactSlug}-buy`,
              netflix: `${exactSlug}-netflix`,
              prime: `${exactSlug}-prime`,
              crunchyroll: `${exactSlug}-crunchyroll`
            });
            setLoading(false);
          }
        }
      } catch (err) {
        console.error("Error loading landing page:", err);
        setNotFound(true);
        setLoading(false);
      }
    };
    
    fetchLandingPage();
  }, [slug]);

  // Show improved loader while content is loading
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white mt-4">Loading OTT ON RENT experience...</p>
      </div>
    );
  }

  if (notFound) {
    return <NotFound />;
  }

  // Only render the template once all data is loaded
  if (!landingPageData) {
    return <NotFound />;
  }

  return (
    <LandingPageTemplate 
      slug={slug || ''} 
      trackingSlugs={trackingSlugs}
    />
  );
};

export default LandingPage;
