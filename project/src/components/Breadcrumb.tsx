import React from 'react';

const Breadcrumb = () => {
  return (
    <div className="flex items-center text-sm text-gray-600 mb-4">
      <span className="hover:text-blue-600 cursor-pointer transition-colors duration-200">
        Home
      </span>
      <span className="mx-2">&gt;</span>
      <span className="text-blue-600">Simulateur dénomination</span>
    </div>
  );
};

export default Breadcrumb;