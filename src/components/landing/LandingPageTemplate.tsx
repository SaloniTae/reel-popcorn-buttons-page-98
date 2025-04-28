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

  return <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
      <div className="video-container absolute inset-0 w-full h-full overflow-hidden z-0">
        <video ref={videoRef} autoPlay muted loop playsInline className={`absolute object-cover w-full h-full transition-opacity duration-700 ${isVideoLoaded ? 'opacity-70' : 'opacity-0'}`} onLoadedData={handleVideoLoaded}></video>
      </div>

      <div className="flex flex-col items-center w-full pt-4 pb-20 relative z-10 overflow-auto">
        <div className="flex flex-col items-center mb-4 max-[400px]:mb-2">
          <div className="mb-4 max-[400px]:mb-2 relative">
            <div className="absolute inset-0 rounded-full bg-white/20 blur-md"></div>
            <img 
              src={settings.business_profile_image} 
              alt="OTT ON RENT" 
              className="w-24 h-24 max-[400px]:w-14 max-[400px]:h-14 rounded-full object-cover relative z-10" 
            />
          </div>
          <h1 className="text-base max-[400px]:text-xs font-light tracking-wider text-gray-300">
            {settings.business_name}
          </h1>
        </div>

        <a 
          href={settings.buy_now_button_link} 
          onClick={() => recordClick(trackingSlugs.buyNow, document.referrer, navigator.userAgent)} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="w-full max-w-xs max-[400px]:max-w-[85%] py-3 max-[400px]:py-2 px-4 bg-[#007bff] text-white text-xl max-[400px]:text-sm font-medium rounded-full flex items-center mb-4 max-[400px]:mb-2"
        >
          <div className="bg-white rounded-full p-2 max-[400px]:p-1.5">
            <ShoppingCart className="h-5 w-5 max-[400px]:h-3 max-[400px]:w-3 text-[#007bff]" />
          </div>
          <div className="flex-1 text-center">
            <span className="flex-1 text-center -ml-7">BUY NOW</span>
          </div>
        </a>

        <div className="mb-4 max-[400px]:mb-2 text-sm max-[400px]:text-[10px] font-light text-gray-300">
          OR
        </div>

        <div className="w-full max-w-xs max-[400px]:max-w-[85%] space-y-4 max-[400px]:space-y-2 mb-8 max-[400px]:mb-3">
          <StreamingButton 
            imageUrl="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/netflix-button.png" 
            alt="Netflix" 
            link={settings.netflix_button_link} 
            trackingSlug={trackingSlugs.netflix} 
            className="max-[400px]:py-1.5" 
          />
          
          <StreamingButton 
            imageUrl="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/prime-button.png" 
            alt="Prime Video" 
            link={settings.prime_button_link} 
            trackingSlug={trackingSlugs.prime} 
            className="max-[400px]:py-1.5" 
          />
          
          <StreamingButton 
            imageUrl="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/crunchy-button.png" 
            alt="Crunchyroll" 
            link={settings.crunchyroll_button_link} 
            trackingSlug={trackingSlugs.crunchyroll} 
            className="max-[400px]:py-1.5" 
          />
        </div>

        <div className="text-center mb-4 max-[400px]:mb-2 px-4">
          <p className="text-xs max-[400px]:text-[8px] text-gray-300 tracking-wider mb-1 max-[400px]:mb-0.5">
            START THE BOT • CHOOSE SLOT • PAY
          </p>
          <p className="text-xs max-[400px]:text-[8px] text-gray-300 tracking-wider">
            GET YOUR NETFLIX PRIME OR CRUNCHYROLL ACCOUNT!
          </p>
        </div>
      </div>

      {isMobile && settings.show_footer_images && (
        <>
          <div className="absolute bottom-[-40px] left-[-20px] w-[235px] max-w-[233px] max-[400px]:hidden opacity-90 pointer-events-none overflow-hidden">
            <img 
              src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/film.png" 
              alt="Film Reel" 
              className="w-full object-contain transform -translate-x-2" 
            />
          </div>
          
          <div className="absolute bottom-[-20px] right-[-20px] w-[228px] max-w-[228px] max-[400px]:hidden opacity-90 pointer-events-none overflow-hidden">
            <img 
              src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/popcorn.png" 
              alt="Popcorn" 
              className="w-full object-contain transform translate-x-2" 
            />
          </div>
        </>
      )}
    </div>;
};

export default LandingPageTemplate;
