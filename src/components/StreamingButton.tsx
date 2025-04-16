
import React from "react";
import { cn } from "@/lib/utils";

interface StreamingButtonProps {
  imageUrl: string;
  alt: string;
  link: string;
  className?: string;
}

const StreamingButton = ({ imageUrl, alt, link, className }: StreamingButtonProps) => {
  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer"
      className={cn(
        "w-full max-w-[400px] py-3 rounded-full flex justify-center items-center mb-4 bg-white hover:shadow-lg transition-all duration-300 transform hover:scale-105",
        className
      )}
    >
      <img 
        src={imageUrl} 
        alt={alt} 
        className="h-7 object-contain" 
      />
    </a>
  );
};

export default StreamingButton;
