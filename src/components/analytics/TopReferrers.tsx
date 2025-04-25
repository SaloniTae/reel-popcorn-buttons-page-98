
import React from 'react';
import { ExternalLink } from "lucide-react";

interface TopReferrersProps {
  referrers: [string, number][];
  totalClicks: number;
}

export const TopReferrers = ({ referrers, totalClicks }: TopReferrersProps) => {
  if (referrers.length === 0) {
    return <p className="text-apple-light text-center py-8">No click data available.</p>;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-base font-medium mb-2">Top Traffic Sources</h3>
      {referrers.map(([referrer, count], index) => {
        const percentage = Math.round((count / totalClicks) * 100);
        
        return (
          <div key={index} className="rounded-xl bg-apple-card border border-apple-border p-3">
            <div className="flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-blue-600/20">
                  <ExternalLink className="text-blue-500 h-3.5 w-3.5" />
                </div>
                <span className="text-sm font-medium text-apple-light">{referrer}</span>
              </div>
              <span className="text-xs text-apple-gray">
                {count} ({percentage}%)
              </span>
            </div>
            
            <div className="relative h-2 w-full bg-apple-muted rounded-full overflow-hidden">
              <div 
                className="absolute h-full bg-blue-600 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
