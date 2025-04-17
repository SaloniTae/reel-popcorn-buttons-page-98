
import TopStats from "@/components/dashboard/TopStats";
import LinkTable from "@/components/dashboard/LinkTable";
import LinkStatsVisual from "@/components/dashboard/LinkStatsVisual";
import { Button } from "@/components/ui/button";
import { PlusCircle, Layout } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
          <div className="flex space-x-2">
            <Button asChild variant="outline">
              <Link to="/OOR/create?type=landing">
                <Layout className="mr-2 h-4 w-4" />
                Create Landing Page
              </Link>
            </Button>
            <Button asChild>
              <Link to="/OOR/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Redirect Link
              </Link>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Links</TabsTrigger>
            <TabsTrigger value="landing">Landing Pages</TabsTrigger>
            <TabsTrigger value="redirect">Redirect Links</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <LinkTable filter="all" />
          </TabsContent>
          
          <TabsContent value="landing">
            <LinkTable filter="landing" />
          </TabsContent>
          
          <TabsContent value="redirect">
            <LinkTable filter="redirect" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
