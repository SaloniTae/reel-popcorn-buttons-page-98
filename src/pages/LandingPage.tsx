
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
  const [trackingSlugs, setTrackingSlugs] = useState({
    buyNow: "",
    netflix: "",
    prime: "",
    crunchyroll: ""
  });

  // Fetch landing page data and set up tracking links
  useEffect(() => {
    const fetchLandingPage = async () => {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      
      try {
        // First, fetch the landing page data
        const { data: landingPage, error: landingError } = await supabase
          .from('links')
          .select('id, title, slug')
          .eq('slug', slug)
          .eq('button_type', 'landing')
          .single();
          
        if (landingError || !landingPage) {
          console.error("Landing page not found:", landingError);
          setNotFound(true);
          setLoading(false);
          return;
        }
        
        // Record a visit to this landing page
        if (landingPage.slug) {
          recordClick(landingPage.slug, document.referrer, navigator.userAgent);
        }
        
        // Generate unique tracking slugs for this landing page
        const baseName = slug.replace(/[^a-z0-9]/g, '');
        
        setTrackingSlugs({
          buyNow: `${baseName}-buy`,
          netflix: `${baseName}-netflix`,
          prime: `${baseName}-prime`,
          crunchyroll: `${baseName}-crunchyroll`
        });
        
        // Create tracking links if they don't exist
        const createTrackingLinks = async () => {
          // Check if tracking links already exist
          const trackingButtons = [
            { slug: `${baseName}-buy`, title: 'Buy Now Button', type: 'primary', parentSlug: slug },
            { slug: `${baseName}-netflix`, title: 'Netflix Button', type: 'streaming', parentSlug: slug },
            { slug: `${baseName}-prime`, title: 'Prime Video Button', type: 'streaming', parentSlug: slug },
            { slug: `${baseName}-crunchyroll`, title: 'Crunchyroll Button', type: 'streaming', parentSlug: slug }
          ];
          
          for (const button of trackingButtons) {
            // Check if this button already exists
            const { data: existingButton } = await supabase
              .from('links')
              .select('id')
              .eq('slug', button.slug)
              .maybeSingle();
              
            // If it doesn't exist, create it
            if (!existingButton) {
              await supabase.from('links').insert({
                slug: button.slug,
                title: button.title,
                redirect_url: 'https://telegram.me/ott_on_rent',
                button_type: button.type,
                parent_landing_page: button.parentSlug
              });
            }
          }
        };
        
        await createTrackingLinks();
        setLoading(false);
      } catch (err) {
        console.error("Error loading landing page:", err);
        setNotFound(true);
        setLoading(false);
      }
    };
    
    fetchLandingPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (notFound) {
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
