
import { useEffect, useState, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import StreamingButton from "@/components/StreamingButton";
import { ShoppingCart } from "lucide-react";
import { recordClick } from "@/services/linkTracking";
import { supabase } from "@/integrations/supabase/client";

interface LandingPageTemplateProps {
  slug: string;
  trackingSlugs: {
    buyNow: string;
    netflix: string;
    prime: string;
    crunchyroll: string;
  };
}

interface Settings {
  business_profile_image: string;
  background_video: string;
  telegram_link: string;
  show_footer_images: boolean;
}

const LandingPageTemplate = ({ slug, trackingSlugs }: LandingPageTemplateProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const isMobile = useIsMobile();
  const [settings, setSettings] = useState<Settings>({
    business_profile_image: "https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/OOR-CIRCLE.jpg",
    background_video: "https://res.cloudinary.com/djzfoukhz/video/upload/v1744838090/lv_0_20250417022904_sigks8.mp4",
    telegram_link: "https://telegram.me/ott_on_rent",
    show_footer_images: true
  });

  // Fetch settings from Supabase
  useEffect(() => {
    const fetchSettings = async () => {
      const { data: settingsData, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 1)
        .single();
        
      if (error) {
        console.error('Error fetching settings:', error);
        return;
      }
      
      if (settingsData) {
        setSettings({
          business_profile_image: settingsData.business_profile_image,
          background_video: settingsData.background_video,
          telegram_link: settingsData.telegram_link,
          show_footer_images: settingsData.show_footer_images
        });
      }
    };
    
    fetchSettings();
  }, []);

  // Video lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (videoRef.current) {
            videoRef.current.src = settings.background_video;
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
  }, [settings.background_video]);

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
              src={settings.business_profile_image} 
              alt="OTT ON RENT" 
              className="w-24 h-24 small-screen:w-16 small-screen:h-16 rounded-full object-cover relative z-10"
            />
          </div>
          <h1 className="text-base small-screen:text-sm font-light tracking-wider text-gray-300">
            OTT ON RENT
          </h1>
        </div>

        <a 
          href={settings.telegram_link}
          onClick={() => recordClick(trackingSlugs.buyNow, document.referrer, navigator.userAgent)}
          target="_blank"
          rel="noopener noreferrer"
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
            link={settings.telegram_link}
            trackingSlug={trackingSlugs.netflix}
            className="small-screen:py-2"
          />
          
          <StreamingButton 
            imageUrl="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/prime-button.png"
            alt="Prime Video" 
            link={settings.telegram_link}
            trackingSlug={trackingSlugs.prime}
            className="small-screen:py-2"
          />
          
          <StreamingButton 
            imageUrl="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/crunchy-button.png"
            alt="Crunchyroll" 
            link={settings.telegram_link}
            trackingSlug={trackingSlugs.crunchyroll}
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

      {isMobile && settings.show_footer_images && (
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

export default LandingPageTemplate;
