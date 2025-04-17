
import React from "react";
import { cn } from "@/lib/utils";

interface StreamingButtonProps {
  imageUrl: string;
  alt: string;
  link: string;
  className?: string;
  onClick?: () => void;
}

const StreamingButton = ({ imageUrl, alt, link, className, onClick }: StreamingButtonProps) => {
  return (
    <a 
      href={link} 
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (onClick) {
          onClick();
        }
      }}
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
