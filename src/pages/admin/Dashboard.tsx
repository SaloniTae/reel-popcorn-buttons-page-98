
import TopStats from "@/components/dashboard/TopStats";
import LinkTable from "@/components/dashboard/LinkTable";
import LinkStatsVisual from "@/components/dashboard/LinkStatsVisual";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
        <p className="text-gray-500">Monitor your link performance and track user engagement</p>
      </div>
      
      <TopStats />
      
      <LinkStatsVisual />
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Links</h2>
          <Button asChild>
            <Link to="/OOR/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Link
            </Link>
          </Button>
        </div>
        
        <LinkTable />
      </div>
    </div>
  );
};

export default Dashboard;
