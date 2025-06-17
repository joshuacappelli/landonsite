'use client';

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative w-16 h-16">
        {/* Main spinner */}
        <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-transparent border-t-slate-600 rounded-full animate-spin"></div>
        
        {/* Pulsing circle */}
        <div className="absolute inset-2 border-2 border-slate-200 rounded-full animate-ping"></div>
        
        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-slate-600 rounded-full"></div>
      </div>
    </div>
  );
}