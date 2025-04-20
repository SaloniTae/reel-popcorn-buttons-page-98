
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClickData } from "@/types/linkTracking";

interface ClickHistoryProps {
  clicks: ClickData[];
  formatDate: (date: string) => string;
}

export const ClickHistory = ({ clicks, formatDate }: ClickHistoryProps) => {
  const [showAll, setShowAll] = useState(false);
  const displayedClicks = showAll ? clicks : clicks.slice(0, 3);

  if (clicks.length === 0) {
    return <p className="text-gray-500 text-center py-8">No clicks recorded yet.</p>;
  }

  return (
    <div>
      <ScrollArea className="h-[280px] rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Button</TableHead>
              <TableHead>Referrer</TableHead>
              <TableHead>Device</TableHead>
              <TableHead>Browser</TableHead>
              <TableHead>Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedClicks.map((click, index) => (
              <TableRow key={index}>
                <TableCell>{formatDate(click.timestamp)}</TableCell>
                <TableCell>{click.buttonName || "Landing Page"}</TableCell>
                <TableCell>{click.referrer || "direct"}</TableCell>
                <TableCell>{click.device || "unknown"}</TableCell>
                <TableCell>{click.browser || "unknown"}</TableCell>
                <TableCell>{click.location || "unknown"}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
      {clicks.length > 3 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          className="mt-4 w-full flex items-center justify-center"
        >
          {showAll ? (
            <>Show Less <ChevronUp className="ml-2 h-4 w-4" /></>
          ) : (
            <>Show More <ChevronDown className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      )}
    </div>
  );
};
