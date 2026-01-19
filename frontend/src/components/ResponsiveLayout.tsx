"use client";

import { ReactNode } from "react";
import MobileNavbar from "./MobileNavbar";
import Sidebar from "./Sidebar";

interface ResponsiveLayoutProps {
  children: ReactNode;
  showNavItems?: boolean;
  showSidebar?: boolean;
}

export default function ResponsiveLayout({ 
  children, 
  showNavItems = false, 
  showSidebar = false 
}: ResponsiveLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Mobile-first navbar */}
      <MobileNavbar showNavItems={showNavItems} />
      
      <div className="flex">
        {/* Desktop sidebar - hidden on mobile */}
        {showSidebar && (
          <div className="hidden lg:block">
            <Sidebar />
          </div>
        )}
        
        {/* Main content */}
        <main className={`flex-1 ${showSidebar ? 'lg:ml-72' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
}