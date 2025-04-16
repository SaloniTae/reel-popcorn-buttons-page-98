
import { useEffect } from "react";
import BuyNowButton from "@/components/BuyNowButton";
import StreamingButton from "@/components/StreamingButton";
import "../styles/landing-page.css";

const Index = () => {
  useEffect(() => {
    // Add slight fade-in animation to elements
    const elements = document.querySelectorAll(".fade-in");
    elements.forEach((element, index) => {
      setTimeout(() => {
        (element as HTMLElement).style.opacity = "1";
        (element as HTMLElement).style.transform = "translateY(0)";
      }, 200 * index);
    });
  }, []);

  useEffect(() => {
    // Preload images for better user experience
    const imagesToPreload = [
      "https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/OOR-CIRCLE.jpg",
      "https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/netflix-button.png",
      "https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/prime-button.png",
      "https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/crunchy-button.png",
      "https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/film.png",
      "https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/popcorn.png"
    ];
    
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-between py-10 px-4 overflow-hidden relative">
      {/* Gradient overlay for background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-black/80 z-0"></div>
      {/* Logo and Title Section */}
      <div className="w-full flex flex-col items-center mb-8 fade-in" style={{ opacity: 0, transform: "translateY(-20px)", transition: "all 0.5s ease" }}>
        <a 
          href="https://www.instagram.com/ott.on.rent?igsh=MWd5cHh5aHk3NGgxbQ==" 
          target="_blank" 
          rel="noopener noreferrer"
          className="relative group"
        >
          <div className="absolute inset-0 rounded-full bg-white/10 blur-md group-hover:bg-white/20 transition-all duration-300"></div>
          <img 
            src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/OOR-CIRCLE.jpg" 
            alt="OTT ON RENT" 
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover relative z-10 logo-pulse"
          />
        </a>
        <h1 className="text-3xl md:text-4xl font-bold mt-6">OTT ON RENT</h1>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md flex flex-col items-center space-y-8 z-10 fade-in" style={{ opacity: 0, transform: "translateY(20px)", transition: "all 0.5s ease" }}>
        {/* Buy Now Button */}
        <BuyNowButton link="https://t.me/ott_on_rent" />

        {/* OR Separator */}
        <div className="w-full flex items-center justify-center my-2">
          <span className="text-xl md:text-2xl text-gray-400">OR</span>
        </div>

        {/* Streaming Buttons */}
        <div className="w-full flex flex-col items-center">
          <StreamingButton 
            imageUrl="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/netflix-button.png" 
            alt="Netflix" 
            link="https://t.me/ott_on_rent" 
          />
          <StreamingButton 
            imageUrl="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/prime-button.png" 
            alt="Prime Video" 
            link="https://t.me/ott_on_rent" 
          />
          <StreamingButton 
            imageUrl="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/crunchy-button.png" 
            alt="Crunchyroll" 
            link="https://t.me/ott_on_rent" 
          />
        </div>

        {/* Instructions */}
        <div className="text-center mt-4 fade-in" style={{ opacity: 0, transform: "translateY(20px)", transition: "all 0.5s ease" }}>
          <p className="text-sm md:text-base text-gray-300">
            START THE BOT • CHOOSE SLOT • PAY
          </p>
          <p className="text-sm md:text-base text-gray-300 mt-1">
            GET YOUR NETFLIX OR CRUNCHYROLL ACCOUNT!
          </p>
        </div>
      </div>

      {/* Bottom Images */}
      <div className="w-full flex justify-between items-end absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden">
        {/* Film Reel */}
        <div className="w-1/2 max-w-[280px] fade-in" style={{ opacity: 0, transform: "translateY(50px)", transition: "all 0.7s ease" }}>
          <img 
            src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/film.png" 
            alt="Film Reel" 
            className="w-full object-contain float-animation"
            style={{ animationDelay: "0.5s" }}
          />
        </div>

        {/* Popcorn */}
        <div className="w-1/2 max-w-[280px] fade-in" style={{ opacity: 0, transform: "translateY(50px)", transition: "all 0.7s ease" }}>
          <img 
            src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/popcorn.png" 
            alt="Popcorn" 
            className="w-full object-contain float-animation"
            style={{ animationDelay: "1.5s" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
