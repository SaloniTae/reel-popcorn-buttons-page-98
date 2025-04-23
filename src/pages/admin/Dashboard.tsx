
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
        <h1 className="text-2xl font-bold mb-1 text-gradient">
          Dashboard
        </h1>
        <p className="text-muted-contrast">Monitor your link performance and track user engagement</p>
      </div>
      
      <TopStats />
      
      <div className="glass-morphism-light rounded-2xl p-6 shadow-lg border border-apple-border">
        <LinkStatsVisual />
      </div>
      
      <div className="glass-morphism-light rounded-2xl p-6 shadow-lg border border-apple-border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gradient">
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
          <TabsList className="mb-4 bg-apple-dark">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-apple-hover data-[state=active]:text-apple-accent text-apple-light"
            >
              All Links
            </TabsTrigger>
            <TabsTrigger 
              value="landing" 
              className="data-[state=active]:bg-apple-hover data-[state=active]:text-apple-accent text-apple-light"
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
