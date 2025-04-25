
import { Link, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Link as LinkIcon, 
  PlusCircle, 
  Settings, 
  Home,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  closeSidebar?: () => void;
}

const sidebarItems = [
  { 
    icon: BarChart3, 
    label: "Dashboard", 
    path: "/OOR" 
  },
  { 
    icon: LinkIcon, 
    label: "Links", 
    path: "/OOR/links" 
  },
  { 
    icon: PlusCircle, 
    label: "Create Link", 
    path: "/OOR/create" 
  },
  { 
    icon: Settings, 
    label: "Settings", 
    path: "/OOR/settings" 
  }
];

const Sidebar = ({ closeSidebar }: SidebarProps) => {
  const location = useLocation();
  const isMobile = typeof closeSidebar === 'function';
  
  return (
    <aside className="min-h-screen w-full glass-morphism-light">
      <div className="p-4 border-b border-apple-border flex justify-between items-center">
        <Link to="/OOR" className="flex items-center gap-3" onClick={closeSidebar}>
          <img 
            src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/OOR-CIRCLE.jpg" 
            alt="OTT ON RENT" 
            className="w-10 h-10 rounded-full border border-apple-border shadow-md"
          />
          <div>
            <h1 className="font-semibold text-white">OTT ON RENT</h1>
            <p className="text-xs text-apple-light/80">Admin Dashboard</p>
          </div>
        </Link>
      </div>
      
      <nav className="flex-1 pt-6">
        <ul className="space-y-1 px-2">
          {sidebarItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path 
                    ? "bg-apple-accent/20 text-apple-accent font-medium" 
                    : "text-apple-light hover:bg-apple-hover hover:text-white"
                }`}
                onClick={closeSidebar}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-apple-border">
        <Link
          to="/"
          className="flex items-center gap-3 text-apple-light hover:text-white transition-colors"
          onClick={closeSidebar}
        >
          <Home size={18} />
          <span>Back to Website</span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
