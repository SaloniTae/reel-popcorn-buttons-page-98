
import React from "react";

interface LinkTableHeaderProps {
  showClickStats?: boolean;
}

const LinkTableHeader = ({ showClickStats = false }: LinkTableHeaderProps) => {
  return (
    <thead>
      <tr className="bg-gray-100 text-left">
        <th className="px-4 py-3 font-medium">Title</th>
        <th className="px-4 py-3 font-medium">Total Clicks</th>
        {showClickStats && (
          <>
            <th className="px-4 py-3 font-medium">24h Clicks</th>
            <th className="px-4 py-3 font-medium">7d Clicks</th>
          </>
        )}
        <th className="px-4 py-3 text-right font-medium">Actions</th>
      </tr>
    </thead>
  );
};

export default LinkTableHeader;
