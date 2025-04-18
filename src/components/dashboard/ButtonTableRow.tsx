
import React from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TrackedLink } from "@/types/linkTracking";

interface ButtonTableRowProps {
  button: TrackedLink;
  onOpenLink: (link: TrackedLink) => void;
}

const ButtonTableRow = ({ button, onOpenLink }: ButtonTableRowProps) => {
  // Calculate recent click statistics
  const last24hClicks = button.clickHistory.filter(
    click => new Date(click.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  ).length;
  
  const last7dClicks = button.clickHistory.filter(
    click => new Date(click.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  return (
    <tr className="bg-gray-50">
      <td className="px-4 py-2 pl-12">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{button.title}</span>
          <Badge variant="outline" className="bg-blue-50">Button</Badge>
        </div>
      </td>
      <td className="px-4 py-2 font-medium">{button.clicks}</td>
      <td className="px-4 py-2 text-gray-600">{last24hClicks}</td>
      <td className="px-4 py-2 text-gray-600">{last7dClicks}</td>
      <td className="px-4 py-2 text-right">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 px-2"
          onClick={() => onOpenLink(button)}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
};

export default ButtonTableRow;
