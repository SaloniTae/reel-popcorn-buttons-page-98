
import React from "react";

const LoadingState = () => {
  return (
    <div className="w-full overflow-auto rounded-lg border">
      <div className="p-8 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingState;
