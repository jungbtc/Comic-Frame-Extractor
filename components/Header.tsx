import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center p-4 md:p-6 border-b border-gray-700">
      <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
        Comic Frame Extractor
      </h1>
      <p className="mt-2 text-md md:text-lg text-gray-400 max-w-2xl mx-auto">
        Upload a comic or manga page, and this tool will automatically segment and extract each panel based on the gutters between them.
      </p>
    </header>
  );
};

export default Header;
