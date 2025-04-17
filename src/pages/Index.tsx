
import "../styles/landing-page.css";
import { ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import StreamingButton from "@/components/StreamingButton";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const isMobile = useIsMobile();

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

      <div className="flex flex-col items-center w-full pt-4 pb-14 sm:pb-16 pb-small-screen relative z-10">
        <div className="flex flex-col items-center mb-3 small-screen:mb-2">
          <div className="mb-3 small-screen:mb-2 relative">
            <div className="absolute inset-0 rounded-full bg-white/20 blur-md"></div>
            <img 
              src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/OOR-CIRCLE.jpg" 
              alt="OTT ON RENT" 
              className="w-20 h-20 small-screen:w-16 small-screen:h-16 rounded-full object-cover relative z-10"
            />
          </div>
          <h1 className="text-base small-screen:text-sm font-light tracking-wider text-gray-300">
            OTT ON RENT
          </h1>
        </div>

        <a 
          href="https://telegram.me/ott_on_rent" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full max-w-xs small-screen:max-w-[75%] py-3 small-screen:py-2 px-4 bg-[#007bff] text-white text-xl small-screen:text-base font-medium rounded-full flex items-center mb-3 small-screen:mb-2"
        >
          <div className="bg-white rounded-full p-2 small-screen:p-1.5 mr-6">
            <ShoppingCart className="h-5 w-5 small-screen:h-4 small-screen:w-4 text-[#007bff]" />
          </div>
          <span className="text-center flex-1 pl-2">BUY NOW</span>
        </a>

        <div className="mb-3 small-screen:mb-2 text-sm small-screen:text-xs font-light text-gray-300">
          OR
        </div>

        <div className="w-full max-w-xs small-screen:max-w-[75%] space-y-3 small-screen:space-y-2 mb-6 small-screen:mb-3">
          <StreamingButton 
            imageUrl="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/netflix-button.png"
            alt="Netflix" 
            link="https://telegram.me/ott_on_rent"
            className="small-screen:py-2"
          />
          
          <StreamingButton 
            imageUrl="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/prime-button.png"
            alt="Prime Video" 
            link="https://telegram.me/ott_on_rent"
            className="small-screen:py-2"
          />
          
          <StreamingButton 
            imageUrl="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/crunchy-button.png"
            alt="Crunchyroll" 
            link="https://telegram.me/ott_on_rent"
            className="small-screen:py-2"
          />
        </div>

        <div className="text-center mb-6 small-screen:mb-4 px-4">
          <p className="text-xs small-screen:text-[10px] text-gray-300 tracking-wider mb-1 small-screen:mb-0.5">
            START THE BOT • CHOOSE SLOT • PAY
          </p>
          <p className="text-xs small-screen:text-[10px] text-gray-300 tracking-wider">
            GET YOUR NETFLIX OR CRUNCHYROLL ACCOUNT!
          </p>
        </div>
      </div>

      {isMobile && (
        <div className="w-full flex justify-between items-center absolute bottom-0 left-0 right-0 opacity-90 pointer-events-none">
          <div className="md:w-[195px] md:max-w-[195px] w-[120px] max-w-[120px] overflow-hidden">
            <img 
              src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/film.png" 
              alt="Film Reel" 
              className="w-full object-contain transform md:-translate-x-2 -translate-x-1"
            />
          </div>
          
          <div className="md:w-[195px] md:max-w-[195px] w-[120px] max-w-[120px] overflow-hidden">
            <img 
              src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/popcorn.png" 
              alt="Popcorn" 
              className="w-full object-contain transform md:translate-x-2 translate-x-1"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
