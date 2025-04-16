
import "../styles/landing-page.css";
import { ShoppingCart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Logo and title */}
      <div className="flex flex-col items-center mb-8">
        <div className="mb-6 relative">
          <div className="absolute inset-0 rounded-full bg-white/20 blur-md"></div>
          <img 
            src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/OOR-CIRCLE.jpg" 
            alt="OTT ON RENT" 
            className="w-24 h-24 rounded-full object-cover relative z-10"
          />
        </div>
        <h1 className="text-2xl font-normal tracking-wider">
          OTT ON RENT
        </h1>
      </div>

      {/* Buy Now Button */}
      <a 
        href="https://telegram.me/ott_on_rent" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full max-w-xs py-3 px-4 bg-[#007bff] text-white text-xl font-medium rounded-full flex items-center mb-10"
      >
        <div className="bg-white rounded-full p-2 ml-3 mr-5">
          <ShoppingCart className="h-5 w-5 text-[#007bff]" />
        </div>
        <span className="flex-grow text-center pr-4">BUY NOW</span>
      </a>

      {/* OR divider */}
      <div className="mb-8 text-xs font-light">
        OR
      </div>

      {/* Streaming options */}
      <div className="w-full max-w-xs space-y-4 mb-8">
        {/* Netflix */}
        <a 
          href="https://telegram.me/ott_on_rent" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full bg-white rounded-full py-3 flex justify-center items-center"
        >
          <img 
            src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/netflix-button.png" 
            alt="Netflix" 
            className="h-8 object-contain" 
          />
        </a>
        
        {/* Prime */}
        <a 
          href="https://telegram.me/ott_on_rent" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full bg-white rounded-full py-3 flex justify-center items-center"
        >
          <img 
            src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/prime-button.png" 
            alt="Prime Video" 
            className="h-8 object-contain" 
          />
        </a>
        
        {/* Crunchyroll */}
        <a 
          href="https://telegram.me/ott_on_rent" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block w-full bg-white rounded-full py-3 flex justify-center items-center"
        >
          <img 
            src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/crunchy-button.png" 
            alt="Crunchyroll" 
            className="h-8 object-contain" 
          />
        </a>
      </div>

      {/* Film reel and popcorn images with instructions overlay */}
      <div className="relative w-full mt-auto">
        {/* Instructions text - positioned above the images */}
        <div className="text-center mb-3 relative z-20">
          <p className="text-xs text-gray-300 tracking-wider">
            START THE BOT • CHOOSE SLOT • PAY
          </p>
          <p className="text-xs text-gray-300 tracking-wider">
            GET YOUR NETFLIX OR CRUNCHYROLL ACCOUNT!
          </p>
        </div>
        
        {/* Film reel - smaller size, positioned at bottom left */}
        <div className="absolute bottom-0 left-0 w-1/3 max-w-[140px] opacity-90 pointer-events-none">
          <img 
            src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/film.png" 
            alt="Film Reel" 
            className="w-full object-contain"
          />
        </div>
        
        {/* Popcorn - smaller size, positioned at bottom right */}
        <div className="absolute bottom-0 right-0 w-1/3 max-w-[140px] opacity-90 pointer-events-none">
          <img 
            src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/popcorn.png" 
            alt="Popcorn" 
            className="w-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
