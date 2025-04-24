import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import { useLinkTracking } from "@/context/LinkTrackingContext";
import { ArrowLeft, Copy, ExternalLink, QrCode, Trash, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useState, useEffect } from "react";
import { TrackedLink, ClickData } from "@/types/linkTracking";
import { ButtonPerformance } from "@/components/analytics/ButtonPerformance";
import { GeographicDistribution } from "@/components/analytics/GeographicDistribution";
import { DeviceDistribution } from "@/components/analytics/DeviceDistribution";
import { ClickHistory } from "@/components/analytics/ClickHistory";
import { TopReferrers } from "@/components/analytics/TopReferrers";
import { resetClicks } from "@/services/linkTracking/linkService";
const LinkDetailPage = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const {
    links,
    deleteLink,
    getButtonsForLandingPage,
    getAllLinks,
    refreshLinks
  } = useLinkTracking();
  const {
    toast
  } = useToast();
  const navigate = useNavigate();
  const [showQrCode, setShowQrCode] = useState(false);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [childLinks, setChildLinks] = useState<TrackedLink[]>([]);
  const [consolidatedClicks, setConsolidatedClicks] = useState<ClickData[]>([]);
  const [loading, setLoading] = useState(true);
  const link = links.find(l => l.id === id);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getAllLinks();
      setLoading(false);
    };
    fetchData();
  }, [getAllLinks]);
  useEffect(() => {
    if (link && link.linkType === 'landing') {
      const slug = link.shortUrl.split('/').pop() || '';
      const relatedLinks = getButtonsForLandingPage(slug);
      setChildLinks(relatedLinks);
      const allClickData: ClickData[] = [...link.clickHistory];
      relatedLinks.forEach(buttonLink => {
        buttonLink.clickHistory.forEach(click => {
          allClickData.push({
            ...click,
            buttonName: buttonLink.title
          });
        });
      });
      allClickData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setConsolidatedClicks(allClickData);
    }
  }, [link, links, getButtonsForLandingPage]);
  if (loading) {
    return <div className="flex justify-center items-center h-[70vh]">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>;
  }
  if (!link) {
    return <div className="max-w-3xl mx-auto text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Link Not Found</h1>
        <p className="text-gray-500 mb-8">
          The link you're looking for doesn't exist or has been deleted.
        </p>
        <Button asChild>
          <RouterLink to="/OOR/links">Back to Links</RouterLink>
        </Button>
      </div>;
  }
  const handleCopyLink = () => {
    navigator.clipboard.writeText(link.shortUrl);
    toast({
      title: "Link copied",
      description: "The link has been copied to your clipboard."
    });
  };
  const handleDeleteLink = () => {
    deleteLink(link.id);
    toast({
      title: "Link deleted",
      description: "The link has been permanently deleted."
    });
    navigate("/OOR/links");
  };
  const handleTestLink = () => {
    if (link.linkType === 'landing') {
      window.open(link.shortUrl, '_blank');
    } else {
      const shortCode = link.shortUrl.split('oor.link/')[1];
      window.open(`/r/${shortCode}`, '_blank');
    }
  };
  const handleResetClickData = async () => {
    setLoading(true);
    const linkIdsToReset = link.linkType === "landing" ? [link.id, ...childLinks.map(btn => btn.id)] : [link.id];
    console.log("Attempting to reset clicks for links:", linkIdsToReset);
    const success = await resetClicks(linkIdsToReset);
    if (success) {
      await refreshLinks();
      console.log("Links refreshed after reset");
      if (link.linkType === 'landing') {
        setConsolidatedClicks([]);
      }
      setShowResetDialog(false);
      toast({
        title: "Click data reset",
        description: "All click data for this " + (link.linkType === "landing" ? "landing page and associated buttons has" : "link has") + " been reset."
      });
    }
    setLoading(false);
  };
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const totalClicks = link.clicks + childLinks.reduce((total, button) => total + button.clicks, 0);
  const clicksByRegion = link.clickHistory.reduce((acc, click) => {
    let region = click.region || '';
    if (!region && click.location) {
      const parts = click.location.split(',');
      if (parts.length > 1) {
        region = parts[1].trim();
      }
    }
    if (!region) {
      region = 'Unknown';
    }
    acc[region] = (acc[region] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topRegions = Object.entries(clicksByRegion).sort((a, b) => b[1] - a[1]);
  const referrerStats = link.clickHistory.reduce((acc, click) => {
    const referrer = "direct";
    acc[referrer] = (acc[referrer] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topReferrers = Object.entries(referrerStats).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const deviceStats = link.clickHistory.reduce((acc, click) => {
    const device = click.device || "unknown";
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const deviceDistribution = Object.entries(deviceStats).sort((a, b) => b[1] - a[1]);
  const recentConsolidatedClicks = consolidatedClicks.slice(0, 20);
  return <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <RouterLink to="/OOR/links" className="text-apple-light hover:text-white hover:bg-apple-hover transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </RouterLink>
        </Button>
      </div>

      <div className="rounded-lg shadow-sm p-6 mb-6 bg-white/[0.09]">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold mb-1">{link.title}</h1>
              {link.linkType === 'landing' && <Badge variant="outline" className="bg-purple-50">Landing Page</Badge>}
            </div>
            <p className="text-gray-500 break-all">
              {link.linkType === 'landing' ? 'Landing Page URL' : 'Original URL'}: {link.originalUrl}
            </p>
            <div className="flex items-center mt-2">
              <p className="font-medium text-blue-600 mr-2">{link.shortUrl}</p>
              <Button size="sm" variant="ghost" onClick={handleCopyLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2 md:mt-0">
            <Button size="sm" variant="outline" onClick={() => setShowQrCode(!showQrCode)}>
              <QrCode className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={handleTestLink}>
              <ExternalLink className="h-4 w-4" />
            </Button>
            <AlertDialog open={showResetDialog} onOpenChange={setShowResetDialog}>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="outline" className="text-blue-500" onClick={() => setShowResetDialog(true)} disabled={loading}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Reset Click Data?
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to reset the click data for {link.linkType === "landing" ? "this landing page and its associated buttons" : "this link"}? This will delete all click events and cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleResetClickData} disabled={loading}>
                    {loading ? "Resetting..." : "Reset"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive">
                  <Trash className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    {link.linkType === 'landing' ? "This will permanently delete this landing page and all its associated buttons. This action cannot be undone." : "This will permanently delete this link and all its click data. This action cannot be undone."}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteLink}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {showQrCode && <div className="mb-6 p-4 bg-gray-50 rounded-lg flex flex-col items-center">
            <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(link.shortUrl)}`} alt="QR Code" className="mb-2" />
            <p className="text-sm text-gray-500">Scan this QR code to access the link</p>
          </div>}

        {link?.linkType === 'landing' && <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Analytics Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Created On</h3>
                <p>{formatDate(link.createdAt)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Landing Page Visits</h3>
                <p className="text-2xl font-bold">{link.clicks}</p>
                <p className="text-xs text-gray-500">Direct page visits</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Last Visit</h3>
                <p>
                  {consolidatedClicks.length > 0 ? formatDate(consolidatedClicks[0].timestamp) : "No visits yet"}
                </p>
              </div>
            </div>

            <ButtonPerformance landingPage={link} childLinks={childLinks} />
            
            <div className="mb-6">
              <h3 className="text-base font-medium mb-3">Button Clicks Distribution</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                {childLinks.length > 0 ? <div className="space-y-4">
                    {childLinks.map(button => <div key={button.id} className="flex items-center gap-2">
                        <div className="w-32 text-sm">{button.title.replace(' Button', '')}</div>
                        <div className="flex-1 h-6 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{
                    width: `${button.clicks / Math.max(...childLinks.map(b => b.clicks || 1)) * 100}%`
                  }} />
                        </div>
                        <div className="w-12 text-sm text-right">{button.clicks}</div>
                      </div>)}
                  </div> : <p className="text-gray-500 text-center py-4">No button clicks recorded yet.</p>}
              </div>
            </div>

            <GeographicDistribution topRegions={topRegions} />
            <DeviceDistribution deviceDistribution={deviceDistribution} totalClicks={link.clicks} />
          </div>}
        
        {link?.linkType !== 'landing' && <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Created On</h3>
              <p>{formatDate(link.createdAt)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Clicks</h3>
              <p className="text-2xl font-bold">{link.clicks}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Last Click</h3>
              <p>
                {link.clickHistory.length > 0 ? formatDate(link.clickHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0].timestamp) : "No clicks yet"}
              </p>
            </div>
          </div>}

        {link.utmParameters && Object.values(link.utmParameters).some(Boolean) && <div className="mb-6">
            <h3 className="text-base font-medium mb-2">UTM Parameters</h3>
            <div className="flex flex-wrap gap-2">
              {link.utmParameters.campaign && <Badge variant="outline" className="bg-blue-50">
                  campaign: {link.utmParameters.campaign}
                </Badge>}
              {link.utmParameters.source && <Badge variant="outline" className="bg-green-50">
                  source: {link.utmParameters.source}
                </Badge>}
              {link.utmParameters.medium && <Badge variant="outline" className="bg-yellow-50">
                  medium: {link.utmParameters.medium}
                </Badge>}
              {link.utmParameters.content && <Badge variant="outline" className="bg-purple-50">
                  content: {link.utmParameters.content}
                </Badge>}
              {link.utmParameters.term && <Badge variant="outline" className="bg-pink-50">
                  term: {link.utmParameters.term}
                </Badge>}
            </div>
          </div>}
      </div>

      {link?.linkType === 'landing' && <Tabs defaultValue="clicks" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="clicks">Click History</TabsTrigger>
            <TabsTrigger value="referrers">Top Referrers</TabsTrigger>
          </TabsList>

          <TabsContent value="clicks">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Consolidated Click History</h2>
              <ClickHistory clicks={recentConsolidatedClicks} formatDate={formatDate} />
            </div>
          </TabsContent>

          <TabsContent value="referrers">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Top Referrers</h2>
              <TopReferrers referrers={topReferrers} totalClicks={totalClicks} />
            </div>
          </TabsContent>
        </Tabs>}

      {link?.linkType !== 'landing' && <Tabs defaultValue="clicks" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="clicks" className="bg-white/[0.09] text-blue-600">Click History</TabsTrigger>
            <TabsTrigger value="referrers">Top Referrers</TabsTrigger>
          </TabsList>

          <TabsContent value="clicks">
            <div className="rounded-lg shadow-sm p-6 bg-white/[0.09]">
              <h2 className="text-lg font-semibold mb-4">Recent Click History</h2>
              <ClickHistory clicks={link.clickHistory} formatDate={formatDate} />
            </div>
          </TabsContent>

          <TabsContent value="referrers">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Top Referrers</h2>
              <TopReferrers referrers={topReferrers} totalClicks={totalClicks} />
            </div>
          </TabsContent>
        </Tabs>}
    </div>;
};
export default LinkDetailPage;