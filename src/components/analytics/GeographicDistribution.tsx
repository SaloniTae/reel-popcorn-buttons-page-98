import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronUp, ChevronDown } from "lucide-react";

interface GeographicProps {
  topRegions: [string, number][];
}

export const GeographicDistribution = ({ topRegions }: GeographicProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const displayRegions = isExpanded ? topRegions : topRegions.slice(0, 5);

  return (
    <div className="mb-6">
      <div className="mb-3">
        <h3 className="text-base font-medium">Geographic Distribution (By Region)</h3>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <ScrollArea className="max-h-[300px]">
          <div className="space-y-4">
            {displayRegions.length > 0 ? (
              <>
                {displayRegions.map(([region, count], index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-32 text-sm truncate" title={region}>{region}</div>
                    <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{
                          width: `${(count / Math.max(...topRegions.map(([_, c]) => c || 1))) * 100}%`,
                        }}
                      />
                    </div>
                    <div className="w-12 text-sm text-right">{count}</div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-4 text-gray-500">No region data available</div>
            )}
          </div>
        </ScrollArea>
        {topRegions.length > 5 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-4 w-full flex items-center justify-center"
          >
            {isExpanded ? (
              <>Show Less <ChevronUp className="ml-2 h-4 w-4" /></>
            ) : (
              <>Show More <ChevronDown className="ml-2 h-4 w-4" /></> 
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
