
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import { LinkTrackingProvider } from "@/context/LinkTrackingContext";
import { Menu, X } from "lucide-react";
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
          <div className="fixed top-4 left-0 right-0 z-40 mx-4"> 
            <div className="bg-apple-glass backdrop-blur-md rounded-xl flex items-center justify-between px-4 h-14 border border-apple-border/20">
              <div className="flex items-center">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleSidebar}
                  className="text-apple-light hover:text-white hover:bg-apple-hover/50 transition-colors"
                >
                  <Menu className="h-6 w-6" />
                </Button>
                
                <div className="flex items-center ml-3">
                  <img 
                    src="https://res.cloudinary.com/djzfoukhz/image/upload/v1745595290/oskspw1vm2hyk8qn0yjo.png" 
                    alt="OTT ON RENT" 
                    className="h-8 w-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="flex h-screen">
          {!isMobile && (
            <div className="w-64 min-h-screen">
              <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />
            </div>
          )}
          
          {isMobile && (
            <div 
              className={`fixed inset-0 z-50 transition-all duration-300 ${
                isSidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
            >
              <div 
                className="absolute inset-0 bg-apple-glass-darker/80 backdrop-blur-sm"
                onClick={() => setIsSidebarOpen(false)}
              />
              
              <div 
                className={`absolute left-0 top-0 h-full w-64 transform transition-transform duration-300 ${
                  isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                }`}
              >
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsSidebarOpen(false)}
                    className="absolute right-2 top-2 text-apple-light hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                  <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />
                </div>
              </div>
            </div>
          )}
          
          <main className={`flex-1 p-4 md:p-6 overflow-auto bg-apple-darker ${isMobile ? "pt-20" : ""}`}>
            <Outlet />
          </main>
        </div>
      </div>
    </LinkTrackingProvider>
  );
};

export default AdminLayout;
