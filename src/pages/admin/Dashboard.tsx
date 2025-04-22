
import TopStats from "@/components/dashboard/TopStats";
import LinkTable from "@/components/dashboard/LinkTable";
import LinkStatsVisual from "@/components/dashboard/LinkStatsVisual";
import { Button } from "@/components/ui/button";
import { Layout } from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeographicDistribution } from "@/components/analytics/GeographicDistribution";
import { useMemo } from "react";
import { useLinkTracking } from "@/context/LinkTrackingContext";

const Dashboard = () => {
  const { links } = useLinkTracking();
  
  const topRegions = useMemo(() => {
    // Aggregate regions from all clicks across all links
    const regions: Record<string, number> = {};
    
    links.forEach(link => {
      link.clickHistory.forEach(click => {
        const regionName = click.region || 'Unknown Region';
        regions[regionName] = (regions[regionName] || 0) + 1;
      });
    });
    
    // Convert to array and sort by count descending
    return Object.entries(regions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }, [links]);

  return (
    <div className="space-y-6">
      <div className="glass-card p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-1 text-white">Dashboard</h1>
        <p className="text-gray-400">Monitor your link performance and track user engagement</p>
      </div>
      
      <TopStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LinkStatsVisual />
        </div>
        
        <div className="glass-card rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Geographic Data</h2>
          <GeographicDistribution topRegions={topRegions} />
        </div>
      </div>
      
      <div className="glass-card rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-white">Links</h2>
          <Button asChild variant="default" className="bg-primary hover:bg-primary/80">
            <Link to="/OOR/create">
              <Layout className="mr-2 h-4 w-4" />
              Create Landing Page
            </Link>
          </Button>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4 bg-secondary/50">
            <TabsTrigger value="all">All Links</TabsTrigger>
            <TabsTrigger value="landing">Landing Pages</TabsTrigger>
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
