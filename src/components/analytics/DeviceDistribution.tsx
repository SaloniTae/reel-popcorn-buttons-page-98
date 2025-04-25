
import React from 'react';
import { Smartphone, Monitor } from "lucide-react";

interface DeviceProps {
  deviceDistribution: [string, number][];
  totalClicks: number;
}

export const DeviceDistribution = ({
  deviceDistribution,
  totalClicks
}: DeviceProps) => {
  if (deviceDistribution.length === 0) {
    return <p className="text-apple-light text-center py-8">No device data available.</p>;
  }
  
  return (
    <div className="mb-6">
      <h3 className="text-base font-medium mb-3">Device Distribution</h3>
      <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
        {deviceDistribution.map(([device, count], index) => {
          const percentage = Math.round((count / totalClicks) * 100);
          const isDesktop = device.toLowerCase().includes('desktop') || 
                          device.toLowerCase().includes('laptop') || 
                          device.toLowerCase().includes('pc');
          
          return (
            <div key={index} className="rounded-xl bg-apple-card border border-apple-border p-3">
              <div className="flex justify-between items-center mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-purple-600/20">
                    {isDesktop ? (
                      <Monitor className="text-purple-500 h-3.5 w-3.5" />
                    ) : (
                      <Smartphone className="text-purple-500 h-3.5 w-3.5" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-apple-light">{device}</span>
                </div>
                <span className="text-xs text-apple-gray">
                  {count} ({percentage}%)
                </span>
              </div>
              
              <div className="relative h-2 w-full bg-apple-muted rounded-full overflow-hidden">
                <div 
                  className="absolute h-full bg-purple-600 rounded-full"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
