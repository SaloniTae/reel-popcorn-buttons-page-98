import { useMemo } from "react";
import { useLinkTracking } from "@/context/LinkTrackingContext";
import { BarChart3, Link as LinkIcon, MousePointerClick, TrendingUp } from "lucide-react";

const StatCard = ({
  title,
  value,
  icon: Icon,
  className
}: {
  title: string;
  value: string | number;
  icon: any;
  className?: string;
}) => (
  <div className={`glass-morphism-light rounded-2xl p-6 shadow-lg border border-apple-border ${className}`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-apple-gray">{title}</p>
        <h3 className="text-2xl font-bold mt-1 text-apple-light">{value}</h3>
      </div>
      <div className="p-2 rounded-md bg-apple-dark">
        <Icon className="text-blue-600" size={20} />
      </div>
    </div>
  </div>
);

const TopStats = () => {
  const {
    links
  } = useLinkTracking();
  const stats = useMemo(() => {
    const totalLinks = links.length;
    const totalClicks = links.reduce((sum, link) => sum + link.clicks, 0);
    const clicksToday = links.reduce((sum, link) => {
      const todayClicks = link.clickHistory.filter(click => {
        const clickDate = new Date(click.timestamp);
        const today = new Date();
        return clickDate.getDate() === today.getDate() && clickDate.getMonth() === today.getMonth() && clickDate.getFullYear() === today.getFullYear();
      }).length;
      return sum + todayClicks;
    }, 0);
    const avgClickRate = totalLinks ? (totalClicks / totalLinks).toFixed(1) : "0";
    return {
      totalLinks,
      totalClicks,
      clicksToday,
      avgClickRate
    };
  }, [links]);
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Total Links" value={stats.totalLinks} icon={LinkIcon} />
      <StatCard title="Total Clicks" value={stats.totalClicks} icon={MousePointerClick} />
      <StatCard title="Clicks Today" value={stats.clicksToday} icon={BarChart3} />
      <StatCard title="Avg. Clicks per Link" value={stats.avgClickRate} icon={TrendingUp} />
    </div>;
};

export default TopStats;
