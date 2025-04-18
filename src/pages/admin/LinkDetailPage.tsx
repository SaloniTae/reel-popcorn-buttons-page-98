
import { useParams, Link as RouterLink, useNavigate } from "react-router-dom";
import { useLinkTracking } from "@/context/LinkTrackingContext";
import { ArrowLeft, Copy, ExternalLink, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const LinkDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { links, deleteLink, getButtonsForLandingPage } = useLinkTracking();
  const { toast } = useToast();
  const navigate = useNavigate();

  const link = links.find((l) => l.id === id);
  const childLinks = link?.linkType === 'landing' 
    ? getButtonsForLandingPage(link.shortUrl.split('/').pop() || '')
    : [];

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

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied",
      description: "The link has been copied to your clipboard.",
    });
  };

  const handleDelete = () => {
    deleteLink(link.id);
    toast({
      title: "Link deleted",
      description: "The link has been permanently deleted.",
    });
    navigate("/OOR/links");
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <RouterLink to="/OOR/links">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Links
          </RouterLink>
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">{link.title}</h1>
              {link.linkType === 'landing' && (
                <Badge variant="outline" className="bg-purple-50">Landing</Badge>
              )}
            </div>
            <p className="text-gray-500 break-all">{link.originalUrl}</p>
            <div className="flex items-center mt-2">
              <p className="font-medium text-blue-600 mr-2">{link.shortUrl}</p>
              <Button size="sm" variant="ghost" onClick={() => handleCopyLink(link.shortUrl)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => window.open(link.shortUrl, '_blank')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Test Link
            </Button>
            <Button size="sm" variant="destructive" onClick={handleDelete}>
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {link.linkType === 'landing' && childLinks.length > 0 && (
          <div className="space-y-4">
            {childLinks.map((button) => (
              <div key={button.id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-blue-600">{button.title}</h3>
                    <p className="text-gray-500 text-sm">{button.originalUrl}</p>
                    <div className="flex items-center mt-1">
                      <p className="text-sm text-gray-600">{button.shortUrl}</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-1 h-6 w-6" 
                        onClick={() => handleCopyLink(button.shortUrl)}
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{button.clicks}</span>
                      <span className="text-gray-500">clicks</span>
                    </div>
                    <p className="text-sm text-gray-400">{formatDate(button.createdAt)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>
      </div>
    </div>
  );
};

export default LinkDetailPage;
