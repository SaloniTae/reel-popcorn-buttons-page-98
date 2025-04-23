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

    handleResize();
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
      <div className="min-h-screen bg-apple-darker">
        {isMobile && (
          <div className="sticky top-0 z-40 flex items-center px-4 h-14 bg-apple-glass backdrop-blur-xl border-b border-apple-border">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar}
              className="md:hidden text-apple-gray hover:text-white transition-colors"
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
                <p className="text-xs text-apple-gray">Admin Dashboard</p>
              </div>
            </div>
          </div>
        )}
        
        <div 
          className={`${
            isMobile 
              ? `fixed inset-0 z-50 transform transition-transform duration-300 ease-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
              : 'relative'
          }`}
        >
          {isMobile && isSidebarOpen && (
            <div 
              className="absolute inset-0 bg-apple-glass-darker backdrop-blur-sm"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          
          <div className={`${isMobile ? 'w-64 h-full' : 'w-64 min-h-screen'} relative z-10`}>
            <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />
          </div>
        </div>
        
        <main className="flex-1 p-4 md:p-6 overflow-auto bg-apple-darker">
          <Outlet />
        </main>
      </div>
    </LinkTrackingProvider>
  );
};

export default AdminLayout;
