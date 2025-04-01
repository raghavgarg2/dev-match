import React from "react";

const Loader = () => {
  return (
    <div className="fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex items-center justify-center h-6 w-6">
        <div className="h-6 w-6 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default Loader;
