
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import { useLinkTracking } from "@/context/LinkTrackingContext";
import { ArrowLeft, Copy, ExternalLink, QrCode, Trash, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { TrackedLink } from "@/types/linkTracking";

const LinkDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { links, deleteLink, getAllLinks } = useLinkTracking();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showQrCode, setShowQrCode] = useState(false);
  const [childLinks, setChildLinks] = useState<TrackedLink[]>([]);

  const link = links.find((l) => l.id === id);

  useEffect(() => {
    // If this is a landing page, find all links that have this page's slug in their originalUrl
    if (link && link.linkType === 'landing') {
      const relatedLinks = links.filter(l => 
        l.id !== link.id && // Not the same link
        l.originalUrl.includes(link.shortUrl.split('/').pop() || '') // Contains the slug
      );
      setChildLinks(relatedLinks);
    }
  }, [link, links]);

  if (!link) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <h1 className="text-2xl font-bold mb-4">Link Not Found</h1>
        <p className="text-gray-500 mb-8">
          The link you're looking for doesn't exist or has been deleted.
        </p>
        <Button asChild>
          <RouterLink to="/OOR/links">Back to Links</RouterLink>
        </Button>
      </div>
    );
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(link.shortUrl);
    toast({
      title: "Link copied",
      description: "The link has been copied to your clipboard.",
    });
  };

  const handleDeleteLink = () => {
    deleteLink(link.id);
    toast({
      title: "Link deleted",
      description: "The link has been permanently deleted.",
    });
    navigate("/OOR/links");
  };

  const handleTestLink = () => {
    // Open the link directly
    if (link.linkType === 'landing') {
      window.open(link.shortUrl, '_blank');
    } else {
      const shortCode = link.shortUrl.split('oor.link/')[1];
      window.open(`/r/${shortCode}`, '_blank');
    }
    
    // No need to show toast since the page will open directly
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get the 20 most recent clicks
  const recentClicks = [...link.clickHistory]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 20);

  // Count clicks by referrer
  const referrerStats = link.clickHistory.reduce((acc, click) => {
    const referrer = click.referrer || "direct";
    acc[referrer] = (acc[referrer] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const topReferrers = Object.entries(referrerStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <RouterLink to="/OOR/links">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Links
          </RouterLink>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold mb-1">{link.title}</h1>
              {link.linkType === 'landing' && (
                <Badge variant="outline" className="bg-purple-50">Landing Page</Badge>
              )}
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
              <QrCode className="h-4 w-4 mr-2" />
              {showQrCode ? "Hide QR" : "Show QR"}
            </Button>
            <Button size="sm" variant="outline" onClick={handleTestLink}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Test Link
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="sm" variant="destructive">
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete this link and all its click data.
                    This action cannot be undone.
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

        {showQrCode && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg flex flex-col items-center">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(link.shortUrl)}`} 
              alt="QR Code"
              className="mb-2"
            />
            <p className="text-sm text-gray-500">Scan this QR code to access the link</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
              {link.clickHistory.length > 0
                ? formatDate(
                    link.clickHistory.sort(
                      (a, b) =>
                        new Date(b.timestamp).getTime() -
                        new Date(a.timestamp).getTime()
                    )[0].timestamp
                  )
                : "No clicks yet"}
            </p>
          </div>
        </div>

        {link.utmParameters && Object.values(link.utmParameters).some(Boolean) && (
          <div className="mb-6">
            <h3 className="text-base font-medium mb-2">UTM Parameters</h3>
            <div className="flex flex-wrap gap-2">
              {link.utmParameters.campaign && (
                <Badge variant="outline" className="bg-blue-50">
                  campaign: {link.utmParameters.campaign}
                </Badge>
              )}
              {link.utmParameters.source && (
                <Badge variant="outline" className="bg-green-50">
                  source: {link.utmParameters.source}
                </Badge>
              )}
              {link.utmParameters.medium && (
                <Badge variant="outline" className="bg-yellow-50">
                  medium: {link.utmParameters.medium}
                </Badge>
              )}
              {link.utmParameters.content && (
                <Badge variant="outline" className="bg-purple-50">
                  content: {link.utmParameters.content}
                </Badge>
              )}
              {link.utmParameters.term && (
                <Badge variant="outline" className="bg-pink-50">
                  term: {link.utmParameters.term}
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Show child links section for landing pages */}
      {link.linkType === 'landing' && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Landing Page Buttons</h2>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => navigate('/OOR/create', { state: { landingPageSlug: link.shortUrl.split('/').pop() } })}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Button
            </Button>
          </div>
          
          {childLinks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No buttons added to this landing page yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Button Title</TableHead>
                  <TableHead>Short URL</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {childLinks.map((childLink) => (
                  <TableRow key={childLink.id}>
                    <TableCell>
                      <RouterLink to={`/OOR/links/${childLink.id}`} className="font-medium text-blue-600 hover:underline">
                        {childLink.title}
                      </RouterLink>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-gray-600">{childLink.shortUrl}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => {
                            navigator.clipboard.writeText(childLink.shortUrl);
                            toast({
                              title: "Link copied",
                              description: "The link has been copied to your clipboard.",
                            });
                          }}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{childLink.clicks}</TableCell>
                    <TableCell className="text-gray-600">{formatDate(childLink.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <RouterLink to={`/OOR/links/${childLink.id}`}>
                          View Details
                        </RouterLink>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      )}

      <Tabs defaultValue="clicks" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="clicks">Click History</TabsTrigger>
          <TabsTrigger value="referrers">Top Referrers</TabsTrigger>
        </TabsList>

        <TabsContent value="clicks">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Click History</h2>

            {recentClicks.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No clicks recorded yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date & Time</TableHead>
                    <TableHead>Referrer</TableHead>
                    <TableHead>Device</TableHead>
                    <TableHead>Browser</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentClicks.map((click, index) => (
                    <TableRow key={index}>
                      <TableCell>{formatDate(click.timestamp)}</TableCell>
                      <TableCell>{click.referrer || "direct"}</TableCell>
                      <TableCell>{click.device || "unknown"}</TableCell>
                      <TableCell>{click.browser || "unknown"}</TableCell>
                      <TableCell>{click.location || "unknown"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </TabsContent>

        <TabsContent value="referrers">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Top Referrers</h2>

            {topReferrers.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No click data available.</p>
            ) : (
              <div className="space-y-4">
                {topReferrers.map(([referrer, count]) => (
                  <div key={referrer} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{referrer}</span>
                      <span className="text-gray-500">{count} clicks</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{
                          width: `${Math.round(
                            (count / link.clicks) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LinkDetailPage;
