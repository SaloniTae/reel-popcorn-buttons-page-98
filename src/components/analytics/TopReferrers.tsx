
import React from 'react';

interface TopReferrersProps {
  referrers: [string, number][];
  totalClicks: number;
}

export const TopReferrers = ({ referrers, totalClicks }: TopReferrersProps) => {
  if (referrers.length === 0) {
    return <p className="text-gray-500 text-center py-8">No click data available.</p>;
  }

  return (
    <div className="space-y-4">
      {referrers.map(([referrer, count], index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="font-medium">{referrer}</span>
            <span className="text-gray-500">
              {count} clicks ({Math.round((count / totalClicks) * 100)}%)
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{
                width: `${Math.round((count / totalClicks) * 100)}%`,
              }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};
