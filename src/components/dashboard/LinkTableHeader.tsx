
import React from "react";

const LinkTableHeader = () => {
  return (
    <thead>
      <tr className="bg-gray-100 text-left">
        <th className="px-4 py-3 font-medium text-gray-600">Title</th>
        <th className="px-4 py-3 font-medium text-gray-600">Clicks</th>
        <th className="px-4 py-3 font-medium text-gray-600 text-right">Actions</th>
      </tr>
    </thead>
  );
};

export default LinkTableHeader;
