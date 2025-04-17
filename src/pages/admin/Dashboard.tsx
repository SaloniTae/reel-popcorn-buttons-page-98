
import TopStats from "@/components/dashboard/TopStats";
import LinkTable from "@/components/dashboard/LinkTable";
import LinkStatsVisual from "@/components/dashboard/LinkStatsVisual";

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
          <h2 className="text-xl font-semibold">Recent Links</h2>
        </div>
        
        <LinkTable />
      </div>
    </div>
  );
};

export default Dashboard;
