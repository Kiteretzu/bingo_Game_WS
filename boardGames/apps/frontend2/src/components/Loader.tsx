import React from 'react';
import { Loader2 } from 'lucide-react';

export function Loader() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-800 to-gray-900 flex flex-col items-center justify-center">
      <div className="relative">
        {/* Outer rotating ring */}
        <div className="absolute inset-0 rounded-full border-8 border-gray-700 animate-[spin_3s_linear_infinite]" />
        
        {/* Middle pulsing ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-500 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]" />
        
        {/* Inner spinning loader */}
        <Loader2 className="w-16 h-16 text-gray-300 animate-spin" />
      </div>
      
      {/* Text with typing animation */}
      <div className="mt-8 text-gray-300 text-center">
        <h2 className="text-2xl font-bold mb-2 animate-pulse">
          Fetching Data
        </h2>
        <div className="flex items-center justify-center gap-1">
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gray-600/20 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${5 + Math.random() * 5}s linear infinite`,
              animationDelay: `${-Math.random() * 5}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}