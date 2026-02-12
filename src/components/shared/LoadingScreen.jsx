import React, { useEffect, useState } from "react";
import { Activity } from "lucide-react";

export default function LoadingScreen() {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setFade(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center z-50">
      <div className={`transition-all duration-1000 ${fade ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        <div className="relative">
          {/* Pulsing rings */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 rounded-full border-4 border-white/20 animate-ping" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border-4 border-white/30 animate-pulse" />
          </div>
          
          {/* Logo */}
          <div className="relative w-20 h-20 mx-auto mb-6 rounded-2xl bg-white shadow-2xl flex items-center justify-center">
            <Activity className="w-10 h-10 text-indigo-600 animate-pulse" />
          </div>
        </div>
        
        <div className="text-center text-white space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">CareFlow</h1>
          <p className="text-sm text-white/80 uppercase tracking-widest font-medium">Clinical Hub</p>
          <div className="flex items-center justify-center gap-1.5 mt-4">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}