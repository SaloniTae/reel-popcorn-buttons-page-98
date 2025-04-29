
import { useEffect, useState, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import StreamingButton from "@/components/StreamingButton";
import { ShoppingCart } from "lucide-react";
import { recordClick } from "@/services/linkTracking";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import BuyNowButton from "@/components/BuyNowButton";

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
  netflix_button_link: string;
  prime_button_link: string;
  crunchyroll_button_link: string;
  buy_now_button_link: string;
  show_footer_images: boolean;
}

const LandingPageTemplate = ({
  slug,
  trackingSlugs
}: LandingPageTemplateProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const isMobile = useIsMobile();
  const [settings, setSettings] = useState<Settings & {
    business_name: string;
  }>({
    business_profile_image: "https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/OOR-CIRCLE.jpg",
    background_video: "https://res.cloudinary.com/djzfoukhz/video/upload/v1744838090/lv_0_20250417022904_sigks8.mp4",
    telegram_link: "https://telegram.me/ott_on_rent",
    netflix_button_link: "https://telegram.me/ott_on_rent",
    prime_button_link: "https://telegram.me/ott_on_rent",
    crunchyroll_button_link: "https://telegram.me/ott_on_rent",
    buy_now_button_link: "https://telegram.me/ott_on_rent",
    show_footer_images: true,
    business_name: "OTT ON RENT"
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const {
        data: settingsData,
        error
      } = await supabase.from('settings').select('*').eq('id', 1).single();
      if (error) {
        console.error('Error fetching settings:', error);
        return;
      }
      if (settingsData) {
        setSettings({
          business_profile_image: settingsData.business_profile_image,
          background_video: settingsData.background_video,
          telegram_link: settingsData.telegram_link,
          netflix_button_link: settingsData.netflix_button_link || settingsData.telegram_link,
          prime_button_link: settingsData.prime_button_link || settingsData.telegram_link,
          crunchyroll_button_link: settingsData.crunchyroll_button_link || settingsData.telegram_link,
          buy_now_button_link: settingsData.buy_now_button_link || settingsData.telegram_link,
          show_footer_images: settingsData.show_footer_images,
          business_name: settingsData.business_name
        });
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        if (videoRef.current) {
          videoRef.current.src = settings.background_video;
          videoRef.current.load();
        }
      }
    }, {
      threshold: 0.1
    });
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
    <div className={cn(
      "min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden",
      "max-[400px]:min-h-screen max-[400px]:bg-black max-[400px]:text-white max-[400px]:flex max-[400px]:flex-col max-[400px]:items-center max-[400px]:justify-center max-[400px]:relative max-[400px]:overflow-hidden"
    )}>
      <div className={cn(
        "video-container absolute inset-0 w-full h-full overflow-hidden z-0",
        "max-[400px]:video-container max-[400px]:absolute max-[400px]:inset-0 max-[400px]:w-full max-[400px]:h-full max-[400px]:overflow-hidden max-[400px]:z-0"
      )}>
        <video 
          ref={videoRef} 
          autoPlay 
          muted 
          loop 
          playsInline 
          className={`absolute object-cover w-full h-full transition-opacity duration-1000 ${isVideoLoaded ? 'opacity-70' : 'opacity-0'}`} 
          onLoadedData={handleVideoLoaded}>
        </video>
      </div>

      <div className={cn(
        "flex flex-col items-center w-full pt-2 pb-20 overflow-auto relative z-10 -mt-2",
        "max-[400px]:flex max-[400px]:flex-col max-[400px]:items-center max-[400px]:w-full max-[400px]:relative max-[400px]:z-10 max-[400px]:pt-1 max-[400px]:-mt-2"
      )}>
        <div className={cn(
          "flex flex-col items-center mb-4 animate-fade-in",
          "max-[400px]:mt-12 max-[400px]:mb-4"
        )}>
          <div className={cn(
            "mb-4 relative animate-pulse-gentle",
            "max-[400px]:mb-4"
          )}>
            <div className="absolute inset-0 rounded-full bg-white/20 blur-md"></div>
            <img 
              src={settings.business_profile_image} 
              alt="OTT ON RENT" 
              className={cn(
                "w-24 h-24 rounded-full object-cover relative z-10 transition-transform duration-300 hover:scale-105",
                "max-[400px]:w-24 max-[400px]:h-24"
              )}
            />
          </div>
          <h1 className={cn(
            "text-base font-light tracking-wider text-gray-300 transition-all duration-300 hover:text-white",
            "max-[400px]:text-base"
          )}>
            {settings.business_name}
          </h1>
        </div>

        <div className="animate-fade-in-slow">
          <BuyNowButton
            link={settings.buy_now_button_link}
            trackingSlug={trackingSlugs.buyNow}
          />
        </div>

        <div className={cn(
          "text-sm font-light text-gray-300 mb-4 animate-fade-in-slow",
          "max-[400px]:text-sm max-[400px]:mb-4 mx-auto"
        )}>
          OR
        </div>

        <div className={cn(
          "w-full max-w-xs space-y-4 mb-8 stagger-animation",
          "max-[400px]:space-y-4 mb-8"
        )}>
          <StreamingButton 
            imageUrl="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/netflix-button.png" 
            alt="Netflix" 
            link={settings.netflix_button_link} 
            trackingSlug={trackingSlugs.netflix} 
            className="max-[400px]:py-2 max-[400px]:w-[280px] max-[400px]:h-12 px-4 mx-auto transition-transform duration-300 hover:scale-105"
          />
          
          <StreamingButton 
            imageUrl="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/prime-button.png" 
            alt="Prime Video" 
            link={settings.prime_button_link} 
            trackingSlug={trackingSlugs.prime} 
            className="max-[400px]:py-2 max-[400px]:w-[280px] max-[400px]:h-12 px-4 mx-auto transition-transform duration-300 hover:scale-105"
          />
          
          <StreamingButton 
            imageUrl="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/crunchy-button.png" 
            alt="Crunchyroll" 
            link={settings.crunchyroll_button_link} 
            trackingSlug={trackingSlugs.crunchyroll} 
            className="max-[400px]:py-2 max-[400px]:w-[280px] max-[400px]:h-12 px-4 mx-auto transition-transform duration-300 hover:scale-105"
          />
        </div>

        <div className={cn(
          "text-center px-4 mb-4 animate-fade-in",
          "max-[400px]:-mt-3"
        )}>
          <p className={cn(
            "text-xs tracking-wider text-gray-300 mb-1 transition-colors duration-300 hover:text-white",
            "max-[400px]:text-[10px]"
          )}>
            START THE BOT • CHOOSE SLOT • PAY
          </p>
          <p className={cn(
            "text-xs tracking-wider text-gray-300 transition-colors duration-300 hover:text-white",
            "max-[400px]:text-[10px]"
          )}>
            GET YOUR NETFLIX PRIME OR CRUNCHYROLL ACCOUNT!
          </p>
        </div>
      </div>

      {isMobile && settings.show_footer_images && (
        <>
          <div className={cn(
            "absolute bottom-[-40px] left-[-20px] w-[235px] opacity-90 pointer-events-none overflow-hidden animate-float",
            "max-[400px]:bottom-[-30px] max-[400px]:w-[180px]"
          )}>
            <img 
              src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/film.png" 
              alt="Film Reel" 
              className="w-full object-contain transform -translate-x-2" 
            />
          </div>
          
          <div className={cn(
            "absolute bottom-[-20px] right-[-20px] w-[228px] opacity-90 pointer-events-none overflow-hidden animate-float",
            "max-[400px]:bottom-[-15px] max-[400px]:w-[180px]"
          )}>
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
