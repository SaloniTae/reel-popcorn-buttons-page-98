
import { useState, useMemo } from "react";
import { useLinkTracking } from "@/context/LinkTrackingContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";

interface ChartDataPoint {
  name: string;
  value: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const LinkStatsVisual = () => {
  const { links } = useLinkTracking();
  const [timeRange, setTimeRange] = useState("7days");

  const getTimeRangeDate = () => {
    const date = new Date();
    switch (timeRange) {
      case "24h":
        date.setDate(date.getDate() - 1);
        break;
      case "7days":
        date.setDate(date.getDate() - 7);
        break;
      case "30days":
        date.setDate(date.getDate() - 30);
        break;
      default:
        date.setDate(date.getDate() - 7);
    }
    return date;
  };

  const clicksOverTime = useMemo(() => {
    const cutoffDate = getTimeRangeDate();
    
    // Create date labels based on selected time range
    const dateLabels: string[] = [];
    const clicksByDate: {[key: string]: number} = {};
    
    const currentDate = new Date();
    const numDays = timeRange === "24h" ? 24 : 
                   timeRange === "7days" ? 7 : 30;
    
    const interval = timeRange === "24h" ? "hour" : "day";
    
    for (let i = 0; i < numDays; i++) {
      let dateLabel: string;
      
      if (interval === "hour") {
        const hourDate = new Date();
        hourDate.setHours(currentDate.getHours() - i);
        dateLabel = hourDate.getHours() + ":00";
      } else {
        const dayDate = new Date();
        dayDate.setDate(currentDate.getDate() - i);
        dateLabel = dayDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
      }
      
      dateLabels.unshift(dateLabel);
      clicksByDate[dateLabel] = 0;
    }
    
    // Count clicks by date
    links.forEach(link => {
      link.clickHistory.forEach(click => {
        const clickDate = new Date(click.timestamp);
        
        if (clickDate >= cutoffDate) {
          let dateLabel: string;
          
          if (interval === "hour") {
            dateLabel = clickDate.getHours() + ":00";
          } else {
            dateLabel = clickDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric'
            });
          }
          
          if (clicksByDate[dateLabel] !== undefined) {
            clicksByDate[dateLabel]++;
          }
        }
      });
    });
    
    // Format data for chart
    return dateLabels.map(label => ({
      name: label,
      value: clicksByDate[label] || 0
    }));
  }, [links, timeRange]);

  const sourcesData = useMemo(() => {
    const cutoffDate = getTimeRangeDate();
    const sources: {[key: string]: number} = {};
    
    links.forEach(link => {
      link.clickHistory.forEach(click => {
        if (new Date(click.timestamp) >= cutoffDate) {
          const source = click.referrer || 'direct';
          const sourceName = source.includes('.com') 
            ? source.split('.com')[0].replace('www.', '')
            : source;
          
          sources[sourceName] = (sources[sourceName] || 0) + 1;
        }
      });
    });
    
    return Object.entries(sources)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [links, timeRange]);

  const deviceData = useMemo(() => {
    const cutoffDate = getTimeRangeDate();
    const devices: {[key: string]: number} = {};
    
    links.forEach(link => {
      link.clickHistory.forEach(click => {
        if (new Date(click.timestamp) >= cutoffDate) {
          const device = click.device || 'unknown';
          devices[device] = (devices[device] || 0) + 1;
        }
      });
    });
    
    return Object.entries(devices)
      .map(([name, value]) => ({ name, value }));
  }, [links, timeRange]);

  const hasSourceData = sourcesData.length > 0;

  return (
    <div className="glass-card rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-white">Link Performance</h3>
        
        <Tabs 
          value={timeRange} 
          onValueChange={setTimeRange} 
          className="w-[250px]"
        >
          <TabsList className="grid grid-cols-3 bg-secondary/50">
            <TabsTrigger value="24h">24h</TabsTrigger>
            <TabsTrigger value="7days">7 days</TabsTrigger>
            <TabsTrigger value="30days">30 days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={clicksOverTime}>
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: "#94a3b8" }} 
              tickMargin={10}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: "#94a3b8" }} 
              tickMargin={10}
            />
            <Tooltip contentStyle={{ backgroundColor: "#1e293b", color: "#fff", border: "1px solid #334155" }} />
            <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {hasSourceData && (
          <div>
            <h4 className="text-base font-medium mb-4 text-white">Top Traffic Sources</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sourcesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  >
                    {sourcesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#1e293b", color: "#fff", border: "1px solid #334155" }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        <div>
          <h4 className="text-base font-medium mb-4 text-white">Devices</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1e293b", color: "#fff", border: "1px solid #334155" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkStatsVisual;
