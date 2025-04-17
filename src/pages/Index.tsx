
import "../styles/landing-page.css";
import { ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import StreamingButton from "@/components/StreamingButton";
import { useIsMobile } from "@/hooks/use-mobile";
import { recordClick } from "@/services/LinkTrackingService";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const isMobile = useIsMobile();
  const [shortLinks, setShortLinks] = useState({
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
          .select('short_code, title')
          .in('title', ['Buy Now Button', 'Netflix Button', 'Prime Video Button', 'Crunchyroll Button']);
          
        if (error) {
          console.error("Error fetching tracking links:", error);
          return;
        }
        
        const linkMap: Record<string, string> = {};
        
        // If links exist, use them
        if (existingLinks && existingLinks.length > 0) {
          existingLinks.forEach(link => {
            if (link.title === 'Buy Now Button') linkMap.buyNow = link.short_code;
            if (link.title === 'Netflix Button') linkMap.netflix = link.short_code;
            if (link.title === 'Prime Video Button') linkMap.prime = link.short_code;
            if (link.title === 'Crunchyroll Button') linkMap.crunchyroll = link.short_code;
          });
        }
        
        // Create any missing links
        if (!linkMap.buyNow) {
          const { data: buyNowLink } = await supabase.from('links').insert({
            original_url: 'https://telegram.me/ott_on_rent',
            short_code: 'buynowoor' + Math.random().toString(36).slice(2, 5),
            title: 'Buy Now Button'
          }).select().single();
          
          if (buyNowLink) linkMap.buyNow = buyNowLink.short_code;
        }
        
        if (!linkMap.netflix) {
          const { data: netflixLink } = await supabase.from('links').insert({
            original_url: 'https://telegram.me/ott_on_rent',
            short_code: 'netflixoor' + Math.random().toString(36).slice(2, 5),
            title: 'Netflix Button'
          }).select().single();
          
          if (netflixLink) linkMap.netflix = netflixLink.short_code;
        }
        
        if (!linkMap.prime) {
          const { data: primeLink } = await supabase.from('links').insert({
            original_url: 'https://telegram.me/ott_on_rent',
            short_code: 'primeoor' + Math.random().toString(36).slice(2, 5),
            title: 'Prime Video Button'
          }).select().single();
          
          if (primeLink) linkMap.prime = primeLink.short_code;
        }
        
        if (!linkMap.crunchyroll) {
          const { data: crunchyLink } = await supabase.from('links').insert({
            original_url: 'https://telegram.me/ott_on_rent',
            short_code: 'crunchyoor' + Math.random().toString(36).slice(2, 5),
            title: 'Crunchyroll Button'
          }).select().single();
          
          if (crunchyLink) linkMap.crunchyroll = crunchyLink.short_code;
        }
        
        setShortLinks({
          buyNow: linkMap.buyNow || "",
          netflix: linkMap.netflix || "",
          prime: linkMap.prime || "",
          crunchyroll: linkMap.crunchyroll || ""
        });
      } catch (err) {
        console.error("Error setting up tracking links:", err);
      }
    };
    
    setupTrackingLinks();
  }, []);

  // Track clicks on buttons
  const trackButtonClick = (buttonType: string, shortCode: string) => {
    if (shortCode) {
      recordClick(shortCode, document.referrer, navigator.userAgent);
    }
  };

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
        </div>

        <a 
          href={`/r/${shortLinks.buyNow}`}
          onClick={() => trackButtonClick('buyNow', shortLinks.buyNow)}
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
            link={`/r/${shortLinks.netflix}`}
            onClick={() => trackButtonClick('netflix', shortLinks.netflix)}
            className="small-screen:py-2"
          />
          
          <StreamingButton 
            imageUrl="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/prime-button.png"
            alt="Prime Video" 
            link={`/r/${shortLinks.prime}`}
            onClick={() => trackButtonClick('prime', shortLinks.prime)}
            className="small-screen:py-2"
          />
          
          <StreamingButton 
            imageUrl="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/crunchy-button.png"
            alt="Crunchyroll" 
            link={`/r/${shortLinks.crunchyroll}`}
            onClick={() => trackButtonClick('crunchyroll', shortLinks.crunchyroll)}
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

export default Index;
