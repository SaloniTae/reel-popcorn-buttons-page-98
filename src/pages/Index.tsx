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

      <div className="flex flex-col items-center w-full pt-4 pb-20 relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4 relative">
            <div className="absolute inset-0 rounded-full bg-white/20 blur-md"></div>
            <img 
              src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/OOR-CIRCLE.jpg" 
              alt="OTT ON RENT" 
              className="w-24 h-24 rounded-full object-cover relative z-10"
            />
          </div>
          <h1 className="text-base font-light tracking-wider text-gray-300">
            OTT ON RENT
          </h1>
        </div>

        <a 
          href="https://telegram.me/ott_on_rent" 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full max-w-xs py-3 px-4 bg-[#007bff] text-white text-xl font-medium rounded-full flex items-center mb-4"
        >
          <div className="bg-white rounded-full p-2 mr-6">
            <ShoppingCart className="h-5 w-5 text-[#007bff]" />
          </div>
          <span className="text-center flex-1 pl-2">BUY NOW</span>
        </a>

        <div className="mb-4 text-sm font-light text-gray-300">
          OR
        </div>

        <div className="w-full max-w-xs space-y-4 mb-8">
          <StreamingButton 
            imageUrl="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/netflix-button.png"
            alt="Netflix" 
            link="https://telegram.me/ott_on_rent"
          />
          
          <StreamingButton 
            imageUrl="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/prime-button.png"
            alt="Prime Video" 
            link="https://telegram.me/ott_on_rent"
          />
          
          <StreamingButton 
            imageUrl="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/crunchy-button.png"
            alt="Crunchyroll" 
            link="https://telegram.me/ott_on_rent"
          />
        </div>

        <div className="text-center mb-4 px-4">
          <p className="text-xs text-gray-300 tracking-wider mb-1">
            START THE BOT • CHOOSE SLOT • PAY
          </p>
          <p className="text-xs text-gray-300 tracking-wider">
            GET YOUR NETFLIX OR CRUNCHYROLL ACCOUNT!
          </p>
        </div>
      </div>

      {isMobile && (
        <>
          <div className="absolute bottom-4 left-0 w-[195px] max-w-[195px] opacity-90 pointer-events-none overflow-hidden">
            <img 
              src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/film.png" 
              alt="Film Reel" 
              className="w-full object-contain transform -translate-x-2"
            />
          </div>
          
          <div className="absolute bottom-4 right-0 w-[195px] max-w-[195px] opacity-90 pointer-events-none overflow-hidden">
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
