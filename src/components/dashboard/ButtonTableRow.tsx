
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
  return (
    <tr className="bg-white border-t border-gray-100">
      <td className="px-4 py-2 pl-8">
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
          onClick={() => onOpenLink(button)}
        >
          <ExternalLink className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
};

export default ButtonTableRow;
