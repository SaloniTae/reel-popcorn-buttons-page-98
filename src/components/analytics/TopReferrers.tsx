
import React from 'react';

interface TopReferrersProps {
  referrers: [string, number][];
  totalClicks: number;
}

export const TopReferrers = ({ referrers, totalClicks }: TopReferrersProps) => {
  if (referrers.length === 0) {
    return <p className="text-apple-light text-center py-8">No click data available.</p>;
  }

  return (
    <div className="space-y-4">
      {referrers.map(([referrer, count], index) => (
        <div key={index} className="bg-apple-card p-4 rounded-lg border border-apple-border">
          <div className="flex justify-between items-center text-apple-light">
            <span className="font-medium">{referrer}</span>
            <span className="text-apple-gray">
              {count} clicks ({Math.round((count / totalClicks) * 100)}%)
            </span>
          </div>
          <div className="mt-2 w-full bg-apple-muted rounded-full h-2.5">
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
