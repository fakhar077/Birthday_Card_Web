
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 my-8 text-center">
        <div className="w-16 h-16 border-4 border-t-cyan-400 border-r-cyan-400 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <p className="text-lg font-medium text-cyan-300">Creating magic... Please wait.</p>
        <p className="text-sm text-gray-400 max-w-sm">
            Our AI is sketching, painting, and adding birthday sparkle. This can take a moment!
        </p>
    </div>
  );
};
