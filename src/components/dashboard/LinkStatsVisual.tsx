
import { useState, useMemo } from "react";
import { useLinkTracking } from "@/context/LinkTrackingContext";
import { 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  ResponsiveContainer, 
  Tooltip
} from "recharts";

const LinkStatsVisual = () => {
  const { links } = useLinkTracking();
  const [timeRange] = useState("7days"); // Default to 7 days view

  const clicksOverTime = useMemo(() => {
    // Filter to only include landing pages
    const landingPages = links.filter(link => link.linkType === 'landing');
    
    // Create date labels based on selected time range
    const dateLabels: string[] = [];
    const clicksByDate: {[key: string]: number} = {};
    
    const currentDate = new Date();
    const numDays = 7; // Fixed to 7 days for this design
    
    for (let i = 0; i < numDays; i++) {
      const dayDate = new Date();
      dayDate.setDate(currentDate.getDate() - i);
      const dateLabel = dayDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      
      dateLabels.unshift(dateLabel);
      clicksByDate[dateLabel] = 0;
    }
    
    // Count total visits per day across all landing pages
    landingPages.forEach(page => {
      page.clickHistory.forEach(click => {
        const clickDate = new Date(click.timestamp);
        const dateLabel = clickDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
        
        if (clicksByDate[dateLabel] !== undefined) {
          clicksByDate[dateLabel]++;
        }
      });
    });
    
    // Format data for chart
    return dateLabels.map(label => ({
      date: label,
      visits: clicksByDate[label] || 0
    }));
  }, [links]);

  return (
    <div className="bg-[#1A1F2C] rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold text-white mb-4">Link Performance</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={clicksOverTime}>
            <defs>
              <linearGradient id="visitGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#8E9196' }} 
              tickLine={{ stroke: '#8E9196' }}
              axisLine={{ stroke: '#8E9196' }}
            />
            <YAxis 
              tick={{ fill: '#8E9196' }} 
              tickLine={{ stroke: '#8E9196' }}
              axisLine={{ stroke: '#8E9196' }}
              label={{ 
                value: 'Visits', 
                angle: -90, 
                position: 'insideLeft',
                fill: '#8E9196'
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#2A2F3C',
                border: 'none',
                borderRadius: '8px',
                color: '#fff'
              }}
              labelStyle={{ color: '#8E9196' }}
              formatter={(value) => [`${value} visits`, 'Visits']}
            />
            <Area 
              type="monotone" 
              dataKey="visits" 
              stroke="#10B981" 
              fill="url(#visitGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LinkStatsVisual;
