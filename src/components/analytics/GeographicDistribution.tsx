
import React, { useState } from "react";

interface GeographicDistributionProps {
  topRegions: [string, number][];
}

export const GeographicDistribution: React.FC<GeographicDistributionProps> = ({
  topRegions,
}) => {
  const [expanded, setExpanded] = useState(false);
  const visibleCount = 6;

  if (!topRegions || topRegions.length === 0) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="text-base font-medium mb-3">Geographic Distribution (By Region)</h3>
        <div className="text-gray-500 text-center py-4">No region data available.</div>
      </div>
    );
  }

  const regionsToShow = expanded ? topRegions : topRegions.slice(0, visibleCount);

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-6">
      <h3 className="text-base font-medium mb-3">Geographic Distribution (By Region)</h3>
      <ul>
        {regionsToShow.map(([region, count]) => (
          <li key={region} className="flex justify-between items-center py-1 text-sm border-b last:border-b-0">
            <span className="truncate max-w-[180px] text-gray-700">{region}</span>
            <span className="font-medium">{count}</span>
          </li>
        ))}
      </ul>
      {topRegions.length > visibleCount && (
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="text-blue-600 mt-2 text-xs font-medium focus:outline-none hover:underline"
        >
          {expanded ? "Show less" : `Show ${topRegions.length - visibleCount} more`}
        </button>
      )}
    </div>
  );
};
