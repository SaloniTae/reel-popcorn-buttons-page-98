
import React from "react";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ExternalLink, Copy } from "lucide-react";
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
  onOpenLink: (link: TrackedLink) => void;
  onCopyUrl: (url: string) => void;
  onDelete: (id: string) => void;
}

const LandingPageRow = ({ 
  landingPage, 
  onOpenLink,
  onCopyUrl,
  onDelete
}: LandingPageRowProps) => {
  return (
    <tr className="bg-slate-100 hover:bg-slate-200">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
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
