
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import StreamingButton from "@/components/StreamingButton";
import { useIsMobile } from "@/hooks/use-mobile";
import { ShoppingCart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { recordClick } from "@/services/linkTracking";
import NotFound from "./NotFound";
import "../styles/landing-page.css";

const LandingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [landingPageData, setLandingPageData] = useState<{
    id: string;
    title: string;
  } | null>(null);
  
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
        
        setLandingPageData(landingPage);
        
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
            { slug: `${baseName}-buy`, title: 'Buy Now Button', type: 'primary' },
            { slug: `${baseName}-netflix`, title: 'Netflix Button', type: 'streaming' },
            { slug: `${baseName}-prime`, title: 'Prime Video Button', type: 'streaming' },
            { slug: `${baseName}-crunchyroll`, title: 'Crunchyroll Button', type: 'streaming' }
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
                button_type: button.type
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

  // Video lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (videoRef.current) {
            videoRef.current.src = "https://res.cloudinary.com/djzfoukhz/video/upload/v1744838090/lv_0_20250417022904_sigks8.mp4";
            videoRef.current.load();
          }
        }
      },
      { threshold: 0.1 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  const handleVideoLoaded = () => {
    setIsVideoLoaded(true);
  };

  // Track clicks on buttons
  const trackButtonClick = (buttonType: string, slug: string) => {
    if (slug) {
      recordClick(slug, document.referrer, navigator.userAgent);
    }
  };

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
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
      <div className="video-container absolute inset-0 w-full h-full overflow-hidden z-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          className={`absolute object-cover w-full h-full transition-opacity duration-700 ${isVideoLoaded ? 'opacity-70' : 'opacity-0'}`}
          onLoadedData={handleVideoLoaded}
        ></video>
      </div>

      <div className="flex flex-col items-center w-full pt-4 pb-20 sm:pb-20 pb-small-screen relative z-10 overflow-auto">
        <div className="flex flex-col items-center mb-4 small-screen:mb-3">
          <div className="mb-4 small-screen:mb-2 relative">
            <div className="absolute inset-0 rounded-full bg-white/20 blur-md"></div>
            <img 
              src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/OOR-CIRCLE.jpg" 
              alt="OTT ON RENT" 
              className="w-24 h-24 small-screen:w-16 small-screen:h-16 rounded-full object-cover relative z-10"
            />
          </div>
          <h1 className="text-base small-screen:text-sm font-light tracking-wider text-gray-300">
            OTT ON RENT
          </h1>
          {landingPageData && (
            <p className="text-xs text-gray-400 mt-1">{landingPageData.title}</p>
          )}
        </div>

        <a 
          href={`/r/${trackingSlugs.buyNow}`}
          onClick={() => trackButtonClick('buyNow', trackingSlugs.buyNow)}
          className="w-full max-w-xs small-screen:max-w-[75%] py-3 small-screen:py-2 px-4 bg-[#007bff] text-white text-xl small-screen:text-base font-medium rounded-full flex items-center mb-4 small-screen:mb-3"
        >
          <div className="bg-white rounded-full p-2 small-screen:p-1.5 mr-6">
            <ShoppingCart className="h-5 w-5 small-screen:h-4 small-screen:w-4 text-[#007bff]" />
          </div>
          <span className="text-center flex-1 pl-2">BUY NOW</span>
        </a>

        <div className="mb-4 small-screen:mb-2 text-sm small-screen:text-xs font-light text-gray-300">
          OR
        </div>

        <div className="w-full max-w-xs small-screen:max-w-[75%] space-y-4 small-screen:space-y-2 mb-8 small-screen:mb-3">
          <StreamingButton 
            imageUrl="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/netflix-button.png"
            alt="Netflix" 
            link={`/r/${trackingSlugs.netflix}`}
            onClick={() => trackButtonClick('netflix', trackingSlugs.netflix)}
            className="small-screen:py-2"
          />
          
          <StreamingButton 
            imageUrl="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/prime-button.png"
            alt="Prime Video" 
            link={`/r/${trackingSlugs.prime}`}
            onClick={() => trackButtonClick('prime', trackingSlugs.prime)}
            className="small-screen:py-2"
          />
          
          <StreamingButton 
            imageUrl="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/crunchy-button.png"
            alt="Crunchyroll" 
            link={`/r/${trackingSlugs.crunchyroll}`}
            onClick={() => trackButtonClick('crunchyroll', trackingSlugs.crunchyroll)}
            className="small-screen:py-2"
          />
        </div>

        <div className="text-center mb-4 small-screen:mb-2 px-4">
          <p className="text-xs small-screen:text-[10px] text-gray-300 tracking-wider mb-1 small-screen:mb-0.5">
            START THE BOT • CHOOSE SLOT • PAY
          </p>
          <p className="text-xs small-screen:text-[10px] text-gray-300 tracking-wider">
            GET YOUR NETFLIX OR CRUNCHYROLL ACCOUNT!
          </p>
        </div>
      </div>

      {isMobile && (
        <>
          <div className="absolute bottom-4 left-0 w-[195px] max-w-[195px] small-screen:w-[150px] small-screen:max-w-[150px] small-screen:bottom-2 opacity-90 pointer-events-none overflow-hidden">
            <img 
              src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/film.png" 
              alt="Film Reel" 
              className="w-full object-contain transform -translate-x-2"
            />
          </div>
          
          <div className="absolute bottom-4 right-0 w-[195px] max-w-[195px] small-screen:w-[150px] small-screen:max-w-[150px] small-screen:bottom-2 opacity-90 pointer-events-none overflow-hidden">
            <img 
              src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/popcorn.png" 
              alt="Popcorn" 
              className="w-full object-contain transform translate-x-2"
            />
          </div>
        </>
      )}
    </div>
  );
};

export default LandingPage;
