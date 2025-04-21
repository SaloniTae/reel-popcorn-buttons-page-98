
import React from "react";
import { cn } from "@/lib/utils";
import { recordClick } from "@/services/linkTracking";

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
    
    // Record the tracking click if a slug is provided, explicitly noting it's a button
    if (trackingSlug) {
      await recordClick(trackingSlug, 'button', navigator.userAgent);
    }
    
    // Call the onClick callback if provided
    if (onClick) {
      onClick();
    }
    
    // Open link directly in new tab without any redirecting page
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
        className="h-7 small-screen:h-5 object-contain" 
      />
    </a>
  );
};

export default StreamingButton;
