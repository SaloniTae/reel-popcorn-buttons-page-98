
import { Link } from "react-router-dom";
import { useState } from "react";
import { useLinkTracking } from "@/context/LinkTrackingContext";
import { Copy, ExternalLink, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LinkTable = () => {
  const { links, deleteLink, loading } = useLinkTracking();
  const { toast } = useToast();
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedLinks = [...links].sort((a, b) => {
    if (sortField === "clicks") {
      return sortDirection === "asc" ? a.clicks - b.clicks : b.clicks - a.clicks;
    } else if (sortField === "createdAt") {
      return sortDirection === "asc"
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      // Sort by title alphabetically
      return sortDirection === "asc"
        ? a.title.localeCompare(b.title)
        : b.title.localeCompare(a.title);
    }
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Link copied",
      description: "The link has been copied to your clipboard.",
    });
  };

  const handleOpenLink = (shortUrl: string) => {
    const shortCode = shortUrl.split('oor.link/')[1];
    window.open(`/r/${shortCode}`, '_blank');
  };

  const handleDeleteLink = (id: string) => {
    deleteLink(id);
    toast({
      title: "Link deleted",
      description: "The link has been permanently deleted.",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
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

  // Mobile view for links
  if (window.innerWidth < 640) {
    return (
      <div className="space-y-4">
        {sortedLinks.length === 0 ? (
          <div className="bg-white rounded-lg p-6 text-center text-gray-500">
            No links created yet. Create your first tracked link to get started.
          </div>
        ) : (
          sortedLinks.map((link) => (
            <div key={link.id} className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-start mb-2">
                <Link to={`/OOR/links/${link.id}`} className="font-medium text-blue-600 hover:underline">
                  {link.title}
                </Link>
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
                      onClick={() => handleOpenLink(link.shortUrl)}
                      className="cursor-pointer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      <span>Test link</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => copyToClipboard(link.shortUrl)}
                      className="cursor-pointer"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      <span>Copy URL</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteLink(link.id)}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              <p className="text-xs text-gray-500 truncate" title={link.originalUrl}>
                {link.originalUrl}
              </p>
              
              <div className="flex justify-between items-center text-sm mt-3">
                <div className="flex items-center">
                  <span className="text-gray-600 mr-1">{link.shortUrl}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(link.shortUrl)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="flex gap-4">
                  <span className="text-gray-600">{link.clicks} clicks</span>
                  <span className="text-gray-400">{formatDate(link.createdAt)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  // Desktop view
  return (
    <div className="w-full overflow-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th
              className="px-4 py-3 font-medium text-gray-600 cursor-pointer"
              onClick={() => handleSort("title")}
            >
              Link Title
              {sortField === "title" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "↑" : "↓"}
                </span>
              )}
            </th>
            <th className="px-4 py-3 font-medium text-gray-600">Short URL</th>
            <th
              className="px-4 py-3 font-medium text-gray-600 cursor-pointer"
              onClick={() => handleSort("clicks")}
            >
              Clicks
              {sortField === "clicks" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "↑" : "↓"}
                </span>
              )}
            </th>
            <th
              className="px-4 py-3 font-medium text-gray-600 cursor-pointer"
              onClick={() => handleSort("createdAt")}
            >
              Created
              {sortField === "createdAt" && (
                <span className="ml-1">
                  {sortDirection === "asc" ? "↑" : "↓"}
                </span>
              )}
            </th>
            <th className="px-4 py-3 font-medium text-gray-600 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {sortedLinks.map((link) => (
            <tr key={link.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <Link to={`/OOR/links/${link.id}`} className="font-medium text-blue-600 hover:underline">
                  {link.title}
                </Link>
                <p className="text-xs text-gray-500 truncate max-w-xs" title={link.originalUrl}>
                  {link.originalUrl}
                </p>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">{link.shortUrl}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => copyToClipboard(link.shortUrl)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </td>
              <td className="px-4 py-3 font-medium">{link.clicks}</td>
              <td className="px-4 py-3 text-gray-600">{formatDate(link.createdAt)}</td>
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
                      onClick={() => handleOpenLink(link.shortUrl)}
                      className="cursor-pointer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      <span>Test link</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => copyToClipboard(link.shortUrl)}
                      className="cursor-pointer"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      <span>Copy URL</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteLink(link.id)}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
          {sortedLinks.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                No links created yet. Create your first tracked link to get started.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LinkTable;
