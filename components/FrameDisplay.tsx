
import React from 'react';

interface FrameDisplayProps {
  frames: string[];
}

const FrameDisplay: React.FC<FrameDisplayProps> = ({ frames }) => {
  if (frames.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">Extracted Frames ({frames.length})</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {frames.map((frame, index) => (
          <div key={index} className="bg-gray-800 p-2 rounded-lg shadow-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl">
            <img 
              src={frame} 
              alt={`Frame ${index + 1}`} 
              className="w-full h-auto object-contain rounded-md"
            />
             <a
              href={frame}
              download={`frame-${index + 1}.png`}
              className="block text-center mt-2 w-full bg-accent text-white text-sm py-1 px-3 rounded hover:bg-blue-500 transition-colors"
            >
              Download
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FrameDisplay;
