
import TopStats from "@/components/dashboard/TopStats";
import LinkTable from "@/components/dashboard/LinkTable";
import LinkStatsVisual from "@/components/dashboard/LinkStatsVisual";
import { Button } from "@/components/ui/button";
import { Layout } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1 bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-apple-gray">Monitor your link performance and track user engagement</p>
      </div>
      
      <TopStats />
      
      <LinkStatsVisual />
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
            Links
          </h2>
          <Button 
            asChild
            className="bg-apple-accent hover:bg-apple-accent/90 text-white"
          >
            <Link to="/OOR/create">
              <Layout className="mr-2 h-4 w-4" />
              Create Landing Page
            </Link>
          </Button>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4 bg-apple-dark/50">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-apple-hover data-[state=active]:text-apple-accent text-apple-gray"
            >
              All Links
            </TabsTrigger>
            <TabsTrigger 
              value="landing" 
              className="data-[state=active]:bg-apple-hover data-[state=active]:text-apple-accent text-apple-gray"
            >
              Landing Pages
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <LinkTable filter="all" />
          </TabsContent>
          
          <TabsContent value="landing">
            <LinkTable filter="landing" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
