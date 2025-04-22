
import React from "react";

interface GeographicDistributionProps {
  topRegions: [string, number][];
}

export const GeographicDistribution: React.FC<GeographicDistributionProps> = ({
  topRegions,
}) => {
  if (!topRegions || topRegions.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-base font-medium mb-3">Geographic Distribution (By Region)</h3>
        <div className="text-gray-500 text-center py-4">No region data available.</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h3 className="text-base font-medium mb-3">Geographic Distribution (By Region)</h3>
      <ul>
        {topRegions.map(([region, count]) => (
          <li key={region} className="flex justify-between items-center py-1 text-sm border-b last:border-b-0">
            <span className="truncate max-w-[180px] text-gray-700">{region}</span>
            <span className="font-medium">{count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
