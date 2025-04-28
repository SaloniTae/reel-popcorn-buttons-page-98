
import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
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
    <div className="relative w-full max-[400px]:w-[340px] min-[401px]:max-w-[400px]">
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer"
        onClick={handleClick}
        className={cn(
          "w-full flex items-center transition-all duration-300 transform hover:scale-105",
          "max-[400px]:h-[52px] max-[400px]:px-4 max-[400px]:bg-[#007bff] max-[400px]:rounded-full",
          "min-[401px]:py-4 min-[401px]:px-6 min-[401px]:bg-[#0086ff] min-[401px]:rounded-full min-[401px]:hover:bg-[#0073e0]"
        )}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className={cn(
          "bg-white rounded-full flex items-center justify-center",
          "max-[400px]:p-1.5",
          "min-[401px]:p-2"
        )}>
          <ShoppingCart className={cn(
            "text-black",
            "max-[400px]:h-4 max-[400px]:w-4",
            "min-[401px]:h-5 min-[401px]:w-5"
          )} />
        </div>
        <div className="flex-1 text-center">
          <span className={cn(
            "font-bold text-white",
            "max-[400px]:text-lg",
            "min-[401px]:text-xl"
          )}>
            BUY NOW
          </span>
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
