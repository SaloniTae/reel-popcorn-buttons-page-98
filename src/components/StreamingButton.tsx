
import React from "react";
import { cn } from "@/lib/utils";
import { recordClick } from "@/services/linkTracking/clickService";

interface StreamingButtonProps {
  imageUrl: string;
  alt: string;
  link: string;
  className?: string;
  onClick?: () => void;
  trackingSlug?: string;
}

const StreamingButton = ({ 
  imageUrl, 
  alt, 
  link, 
  className, 
  onClick, 
  trackingSlug 
}: StreamingButtonProps) => {
  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (trackingSlug) {
      console.log("StreamingButton click - tracking with slug:", trackingSlug);
      await recordClick(trackingSlug, 'button', navigator.userAgent);
    }
    
    if (onClick) {
      onClick();
    }
    
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <a 
      href={link}
      onClick={handleClick}
      className={cn(
        "w-full max-w-[400px] py-3 rounded-full flex justify-center items-center mb-4 bg-white hover:shadow-lg transition-all duration-300 transform hover:scale-105",
        className
      )}
    >
      <img 
        src={imageUrl} 
        alt={alt} 
        className="h-7 max-[400px]:h-4 object-contain" 
      />
    </a>
  );
};

export default StreamingButton;
