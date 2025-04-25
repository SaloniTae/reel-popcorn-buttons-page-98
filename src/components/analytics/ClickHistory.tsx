import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ClickData } from "@/types/linkTracking";
interface ClickHistoryProps {
  clicks: ClickData[];
  formatDate: (date: string) => string;
}
export const ClickHistory = ({
  clicks,
  formatDate
}: ClickHistoryProps) => {
  const [showAll, setShowAll] = useState(false);
  const displayedClicks = showAll ? clicks : clicks.slice(0, 3);
  if (clicks.length === 0) {
    return <p className="text-gray-500 text-center py-8">No clicks recorded yet.</p>;
  }
  const formatLocation = (click: ClickData) => {
    const parts = [];
    if (click.city && click.city !== 'Unknown') parts.push(click.city);
    if (click.region && click.region !== 'Unknown') parts.push(click.region);
    if (click.country && click.country !== 'Unknown') parts.push(click.country);
    if (parts.length === 0 && click.location) {
      return click.location;
    }
    return parts.join(', ') || 'Unknown';
  };
  return <div>
      <ScrollArea className="h-[280px] rounded-md border border-apple-border">
        <div className="w-full overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-apple-dark">
              <TableRow className="border-b border-apple-border hover:bg-transparent">
                <TableHead className="text-apple-light font-medium">Date & Time</TableHead>
                <TableHead className="text-apple-light font-medium">Button</TableHead>
                <TableHead className="text-apple-light font-medium">Referrer</TableHead>
                <TableHead className="text-apple-light font-medium">Device</TableHead>
                <TableHead className="text-apple-light font-medium">Browser</TableHead>
                <TableHead className="text-apple-light font-medium">Location</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedClicks.map((click, index) => <TableRow key={index} className="border-b border-apple-border hover:bg-apple-hover/30">
                  <TableCell className="text-apple-light">{formatDate(click.timestamp)}</TableCell>
                  <TableCell className="text-apple-light">{click.buttonName || "Landing Page"}</TableCell>
                  <TableCell className="text-apple-light">{click.referrer || "direct"}</TableCell>
                  <TableCell className="text-apple-light">{click.device || "unknown"}</TableCell>
                  <TableCell className="text-apple-light">{click.browser || "unknown"}</TableCell>
                  <TableCell className="text-apple-light">{formatLocation(click)}</TableCell>
                </TableRow>)}
            </TableBody>
          </Table>
        </div>
      </ScrollArea>
      {clicks.length > 3 && <Button variant="ghost" size="sm" onClick={() => setShowAll(!showAll)} className="mt-4 w-full flex items-center justify-center transition-colors bg-white/[0.09] text-white">
          {showAll ? <>Show Less <ChevronUp className="ml-2 h-4 w-4" /></> : <>Show More <ChevronDown className="ml-2 h-4 w-4" /></>}
        </Button>}
    </div>;
};