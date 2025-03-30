"use client";

import { useState, useEffect } from "react";

export default function LoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState("Loading...");
    
    useEffect(() => {
      const handleStart = () => {
        setLoadingMessage("Navigating...");
        setLoading(true);
      };
      const handleRefresh = () => {
        setLoadingMessage("Refreshing...");
        setLoading(true);
      };
      const handleComplete = () => setLoading(false);
    
      window.addEventListener("routeChangeStart", handleStart);
      window.addEventListener("routeChangeComplete", handleComplete);
      window.addEventListener("routeChangeError", handleComplete);
      window.addEventListener("beforeunload", handleRefresh);
    
      return () => {
        window.removeEventListener("routeChangeStart", handleStart);
        window.removeEventListener("routeChangeComplete", handleComplete);
        window.removeEventListener("routeChangeError", handleComplete);
        window.removeEventListener("beforeunload", handleRefresh);
      };
    }, []);
    
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-4 border-[#4eb7f0] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl font-medium text-gray-700">{loadingMessage}</p>
          </div>
        </div>
      );
    }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-[#4eb7f0] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xl font-medium text-gray-700">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}