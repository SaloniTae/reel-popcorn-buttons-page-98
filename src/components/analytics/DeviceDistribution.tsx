import React from 'react';
import { Badge } from "@/components/ui/badge";
interface DeviceProps {
  deviceDistribution: [string, number][];
  totalClicks: number;
}
export const DeviceDistribution = ({
  deviceDistribution,
  totalClicks
}: DeviceProps) => {
  return <div className="mb-6">
      <h3 className="text-base font-medium mb-3">Device Distribution</h3>
      <div className="p-4 rounded-lg bg-white/[0.09]">
        <div className="flex flex-wrap gap-2">
          {deviceDistribution.map(([device, count], index) => <Badge key={index} variant="outline" className="text-sm px-3 py-1 bg-zinc-50">
              {device}: {count} ({Math.round(count / totalClicks * 100)}%)
            </Badge>)}
        </div>
      </div>
    </div>;
};