
import React from "react";
import { cn } from "@/lib/utils";

interface StreamingButtonProps {
  imageUrl: string;
  alt: string;
  link: string;
  className?: string;
  imageClassName?: string;
}

const StreamingButton = ({ 
  imageUrl, 
  alt, 
  link, 
  className, 
  imageClassName 
}: StreamingButtonProps) => {
  return (
    <a 
      href={link} 
      target="_blank" 
      rel="noopener noreferrer"
      className={cn(
        "w-full max-w-[400px] py-2 px-4 bg-white rounded-full flex justify-center items-center mb-4 hover:shadow-lg transition-all duration-300 transform hover:scale-105",
        className
      )}
    >
      <img 
        src={imageUrl} 
        alt={alt} 
        className={cn(
          "object-contain", 
          alt === "Prime Video" ? "h-10" : "h-8", 
          imageClassName
        )} 
      />
    </a>
  );
};

export default StreamingButton;
