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
  visits: number;
}

const COLORS = ['#1D1D1F', '#424245', '#6E6E73', '#86868B', '#A1A1A6'];

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
    
    links.forEach(link => {
      if (link.linkType === 'landing') {
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
      }
    });
    
    return dateLabels.map(label => ({
      name: label,
      visits: clicksByDate[label] || 0
    }));
  }, [links, timeRange]);

  const sourcesData = useMemo(() => {
    const cutoffDate = getTimeRangeDate();
    const sources: {[key: string]: number} = {};
    
    links.forEach(link => {
      if (link.linkType === 'landing') {
        link.clickHistory.forEach(click => {
          if (new Date(click.timestamp) >= cutoffDate) {
            const source = click.referrer || 'direct';
            const sourceName = source.includes('.com') 
              ? source.split('.com')[0].replace('www.', '')
              : source;
            
            sources[sourceName] = (sources[sourceName] || 0) + 1;
          }
        });
      }
    });
    
    return Object.entries(sources)
      .map(([name, visits]) => ({ name, visits }))
      .sort((a, b) => b.visits - a.visits)
      .slice(0, 5);
  }, [links, timeRange]);

  const deviceData = useMemo(() => {
    const cutoffDate = getTimeRangeDate();
    const devices: {[key: string]: number} = {};
    
    links.forEach(link => {
      if (link.linkType === 'landing') {
        link.clickHistory.forEach(click => {
          if (new Date(click.timestamp) >= cutoffDate) {
            const device = click.device || 'unknown';
            devices[device] = (devices[device] || 0) + 1;
          }
        });
      }
    });
    
    return Object.entries(devices)
      .map(([name, visits]) => ({ name, visits }));
  }, [links, timeRange]);

  return (
    <div className="space-y-8 bg-white rounded-2xl p-8 shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-medium text-[#1D1D1F]">Link Performance</h3>
        
        <Tabs 
          value={timeRange} 
          onValueChange={setTimeRange} 
          className="w-[250px]"
        >
          <TabsList className="grid grid-cols-3 bg-[#F5F5F7]">
            <TabsTrigger value="24h" className="data-[state=active]:bg-white">24h</TabsTrigger>
            <TabsTrigger value="7days" className="data-[state=active]:bg-white">7 days</TabsTrigger>
            <TabsTrigger value="30days" className="data-[state=active]:bg-white">30 days</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={clicksOverTime}>
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#86868B' }} 
              tickMargin={10}
              axisLine={{ stroke: '#E5E5E5' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#86868B' }} 
              tickMargin={10}
              axisLine={{ stroke: '#E5E5E5' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E5E5',
                borderRadius: '8px'
              }}
              labelStyle={{ color: '#1D1D1F' }}
            />
            <Bar dataKey="visits" fill="#1D1D1F" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#F5F5F7] rounded-2xl p-6">
          <h4 className="text-lg font-medium mb-6 text-[#1D1D1F]">Top Traffic Sources</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourcesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="visits"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {sourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-[#F5F5F7] rounded-2xl p-6">
          <h4 className="text-lg font-medium mb-6 text-[#1D1D1F]">Devices</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="visits"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {deviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkStatsVisual;
