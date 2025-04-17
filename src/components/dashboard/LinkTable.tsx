
import { Link } from "react-router-dom";
import { useState } from "react";
import { useLinkTracking } from "@/context/LinkTrackingContext";
import { Copy, ExternalLink, MoreHorizontal, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TrackedLink } from "@/types/linkTracking";

interface LinkTableProps {
  filter?: 'all' | 'landing' | 'redirect';
  landingPageSlug?: string;
}

const LinkTable = ({ filter = 'all', landingPageSlug }: LinkTableProps) => {
  const { links, deleteLink, loading, getLandingPages } = useLinkTracking();
  const { toast } = useToast();
  const [expandedLandingPages, setExpandedLandingPages] = useState<Set<string>>(new Set());

  const toggleLandingPage = (slug: string) => {
    const newExpanded = new Set(expandedLandingPages);
    if (newExpanded.has(slug)) {
      newExpanded.delete(slug);
    } else {
      newExpanded.add(slug);
    }
    setExpandedLandingPages(newExpanded);
  };

  // Get the landing pages
  const landingPages = getLandingPages();

  // Get buttons for a specific landing page
  const getButtonsForLandingPage = (landingPageSlug: string) => {
    return links.filter(link => link.parentLandingPage === landingPageSlug);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Link copied",
      description: "The link has been copied to your clipboard.",
    });
  };

  const handleOpenLink = (link: TrackedLink) => {
    if (link.linkType === 'landing') {
      window.open(link.shortUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.open('https://telegram.me/ott_on_rent', '_blank', 'noopener,noreferrer');
    }
  };

  const handleDeleteLink = (id: string) => {
    deleteLink(id);
    toast({
      title: "Link deleted",
      description: "The link has been permanently deleted.",
    });
  };

  if (loading) {
    return (
      <div className="w-full overflow-auto rounded-lg border">
        <div className="p-8 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-32 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-3 font-medium text-gray-600">Title</th>
            <th className="px-4 py-3 font-medium text-gray-600">Clicks</th>
            <th className="px-4 py-3 font-medium text-gray-600 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {landingPages.map((landingPage) => (
            <>
              <tr key={landingPage.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => toggleLandingPage(landingPage.slug)}
                    >
                      {expandedLandingPages.has(landingPage.slug) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>
                    <span className="font-medium">{landingPage.title}</span>
                    <Badge variant="outline" className="bg-purple-50">Landing</Badge>
                  </div>
                </td>
                <td className="px-4 py-3 font-medium">{landingPage.clicks}</td>
                <td className="px-4 py-3 text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleOpenLink(landingPage)}
                        className="cursor-pointer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        <span>Open page</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => copyToClipboard(landingPage.shortUrl)}
                        className="cursor-pointer"
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        <span>Copy URL</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteLink(landingPage.id)}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                      >
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
              {expandedLandingPages.has(landingPage.slug) && (
                getButtonsForLandingPage(landingPage.slug).map((button) => (
                  <tr key={button.id} className="bg-gray-50">
                    <td className="px-4 py-2 pl-12">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{button.title}</span>
                        <Badge variant="outline" className="bg-blue-50">Button</Badge>
                      </div>
                    </td>
                    <td className="px-4 py-2 font-medium">{button.clicks}</td>
                    <td className="px-4 py-2 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => handleOpenLink(button)}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LinkTable;
