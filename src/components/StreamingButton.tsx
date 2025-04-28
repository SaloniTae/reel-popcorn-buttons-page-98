
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
        "w-full rounded-full flex justify-center items-center transition-all duration-300 transform hover:scale-105",
        "[&:not(:first-of-type)]:mt-3",
        "max-[400px]:w-[340px] max-[400px]:h-[52px] max-[400px]:bg-white",
        "min-[401px]:max-w-[400px] min-[401px]:py-3 min-[401px]:mb-4 min-[401px]:bg-white min-[401px]:hover:shadow-lg",
        className
      )}
    >
      <img 
        src={imageUrl} 
        alt={alt} 
        className={cn(
          "object-contain",
          "max-[400px]:h-6",
          "min-[401px]:h-7"
        )}
      />
    </a>
  );
};

export default StreamingButton;
