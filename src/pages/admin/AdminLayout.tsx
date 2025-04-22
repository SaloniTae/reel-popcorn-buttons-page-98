
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import { LinkTrackingProvider } from "@/context/LinkTrackingContext";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <LinkTrackingProvider>
      <div className="min-h-screen bg-background flex flex-col md:flex-row">
        {/* Mobile sidebar toggle */}
        {isMobile && (
          <div className="sticky top-0 z-40 flex items-center px-4 h-14 bg-secondary border-b border-white/5 shadow-md">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="md:hidden text-gray-400 hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3 ml-3">
              <img 
                src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/OOR-CIRCLE.jpg" 
                alt="OTT ON RENT" 
                className="w-8 h-8 rounded-full"
              />
              <div>
                <h1 className="font-semibold text-sm text-white">OTT ON RENT</h1>
                <p className="text-xs text-gray-400">Admin Dashboard</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Sidebar for larger screens */}
        <div 
          className={`${
            isMobile 
              ? `fixed inset-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out`
              : 'relative'
          }`}
        >
          {/* Backdrop for mobile */}
          {isMobile && isSidebarOpen && (
            <div 
              className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          
          <div className={`${isMobile ? 'w-64 h-full' : 'w-64 min-h-screen'} bg-sidebar z-10 relative`}>
            <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />
          </div>
        </div>
        
        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </LinkTrackingProvider>
  );
};

export default AdminLayout;
