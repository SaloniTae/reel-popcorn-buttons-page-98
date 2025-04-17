
import React from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ChevronDown, ChevronRight, ExternalLink, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TrackedLink } from "@/types/linkTracking";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LandingPageRowProps {
  landingPage: TrackedLink;
  isExpanded: boolean;
  onToggle: () => void;
  onOpenLink: (link: TrackedLink) => void;
  onCopyUrl: (url: string) => void;
  onDelete: (id: string) => void;
}

const LandingPageRow = ({ 
  landingPage, 
  isExpanded, 
  onToggle,
  onOpenLink,
  onCopyUrl,
  onDelete
}: LandingPageRowProps) => {
  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onToggle}
          >
            {isExpanded ? (
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
              onClick={() => onOpenLink(landingPage)}
              className="cursor-pointer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              <span>Open page</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onCopyUrl(landingPage.shortUrl)}
              className="cursor-pointer"
            >
              <Copy className="mr-2 h-4 w-4" />
              <span>Copy URL</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(landingPage.id)}
              className="cursor-pointer text-red-600 focus:text-red-600"
            >
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
};

export default LandingPageRow;
