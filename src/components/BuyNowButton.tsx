
import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { recordClick } from "@/services/linkTracking/clickService";

interface BuyNowButtonProps {
  link: string;
  trackingSlug?: string;
}

const BuyNowButton = ({ link, trackingSlug }: BuyNowButtonProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Always explicitly use 'button' as the referrer
    if (trackingSlug) {
      console.log("BuyNowButton click - tracking with slug:", trackingSlug);
      await recordClick(trackingSlug, 'button', navigator.userAgent);
    }
    
    // Open link in new tab
    window.open(link, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <div className="relative w-full max-w-[400px] max-[400px]:max-w-[80%]">
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={handleClick}
        className="w-full py-3 max-[400px]:py-2.5 px-6 bg-[#007bff] text-white rounded-full flex items-center hover:bg-[#0073e0] transition-all duration-300 transform hover:scale-105"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="bg-white rounded-full p-2 max-[400px]:p-1.5">
          <ShoppingCart className="h-5 w-5 max-[400px]:h-4 max-[400px]:w-4 text-[#007bff]" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-xl max-[400px]:text-base font-bold">BUY NOW</span>
        </div>
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
