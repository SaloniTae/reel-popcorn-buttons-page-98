
import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { recordClick } from "@/services/linkTracking";

interface BuyNowButtonProps {
  link: string;
  trackingSlug?: string;
}

const BuyNowButton = ({ link, trackingSlug }: BuyNowButtonProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Record click with 'button' as referrer explicitly
    if (trackingSlug) {
      await recordClick(trackingSlug, 'button', navigator.userAgent);
    }
    
    // Open link in new tab
    window.open(link, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <div className="relative w-full max-w-[400px]">
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={handleClick}
        className="w-full py-4 px-6 bg-[#0086ff] text-white rounded-full flex items-center justify-center hover:bg-[#0073e0] transition-all duration-300 transform hover:scale-105"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="bg-white rounded-full p-2 mr-4">
          <ShoppingCart className="h-5 w-5 text-black" />
        </div>
        <span className="text-xl font-bold">BUY NOW</span>
      </a>
      
      {showTooltip && (
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-sm py-1 px-3 rounded-md fade-in whitespace-nowrap">
          Get your account on Telegram!
          <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-black/80 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default BuyNowButton;
