
import "../styles/landing-page.css";
import { ShoppingCart } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Logo and title */}
      <div className="flex flex-col items-center mb-20">
        <div className="mb-4 relative">
          <div className="absolute inset-0 rounded-full bg-white/20 blur-md"></div>
          <img 
            src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/OOR-CIRCLE.jpg" 
            alt="OTT ON RENT" 
            className="w-28 h-28 rounded-full object-cover relative z-10"
          />
        </div>
        <h1 className="text-3xl font-bold mt-4">
          OTT ON RENT
        </h1>
      </div>

      {/* Buy Now Button */}
      <a 
        href="https://telegram.me/ott_on_rent" 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full max-w-xs py-3 px-4 bg-[#007bff] text-white text-xl font-medium rounded-full flex items-center justify-center mb-6"
      >
        <div className="bg-white rounded-full p-2 mr-3">
          <ShoppingCart className="h-5 w-5 text-[#007bff]" />
        </div>
        <span>BUY NOW</span>
      </a>

      {/* OR divider */}
      <div className="my-4 text-lg">
        OR
      </div>

      {/* Streaming options */}
      <div className="w-full max-w-xs space-y-4 mb-16">
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

      {/* Instructions text */}
      <div className="text-center mb-8">
        <p className="text-sm text-gray-300">
          START THE BOT • CHOOSE SLOT • PAY
        </p>
        <p className="text-sm text-gray-300">
          GET YOUR NETFLIX OR CRUNCHYROLL ACCOUNT!
        </p>
      </div>

      {/* Film reel and popcorn images */}
      <div className="absolute bottom-0 left-0 w-1/3 max-w-[180px] opacity-90 pointer-events-none">
        <img 
          src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/film.png" 
          alt="Film Reel" 
          className="w-full object-contain"
        />
      </div>
      
      <div className="absolute bottom-0 right-0 w-1/3 max-w-[180px] opacity-90 pointer-events-none">
        <img 
          src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/popcorn.png" 
          alt="Popcorn" 
          className="w-full object-contain"
        />
      </div>
    </div>
  );
};

export default Index;
