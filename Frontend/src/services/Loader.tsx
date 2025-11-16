import React from "react";

interface LoaderProps {
  message?: string;
  size?: number; // height & width in Tailwind units
  color?: string; // Tailwind color class
}

const Loader: React.FC<LoaderProps> = ({
  message = "Loading...",
  size = 12,
  color = "green-600",
}) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div
          className={`animate-spin rounded-full h-${size} w-${size} border-b-2 border-${color} mx-auto mb-4`}
        ></div>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Loader;
