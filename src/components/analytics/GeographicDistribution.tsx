
import React from 'react';

interface GeographicProps {
  topRegions: [string, number][];
  totalClicks: number;
}

export const GeographicDistribution = ({ topRegions, totalClicks }: GeographicProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-base font-medium mb-3">Geographic Distribution (By Region)</h3>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="space-y-3">
          {topRegions.length > 0 ? (
            topRegions.map(([region, count], index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{region}</span>
                  <span className="text-gray-500">
                    {count} clicks ({Math.round((count / totalClicks) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(count / totalClicks) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">No region data available</div>
          )}
        </div>
      </div>
    </div>
  );
};
