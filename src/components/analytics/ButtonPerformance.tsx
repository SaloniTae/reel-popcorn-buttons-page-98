
import React from 'react';
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrackedLink } from "@/types/linkTracking";

interface ButtonPerformanceProps {
  landingPage: TrackedLink;
  childLinks: TrackedLink[];
}

export const ButtonPerformance = ({
  landingPage,
  childLinks
}: ButtonPerformanceProps) => {
  const { toast } = useToast();

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Button link copied",
      description: "The button link has been copied to your clipboard."
    });
  };

  return (
    <div className="mb-6">
      <h3 className="text-base font-medium mb-3 text-apple-light">Button Performance</h3>
      <div className="p-4 rounded-lg overflow-x-auto bg-apple-card border border-apple-border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-apple-light">Button</TableHead>
              <TableHead className="text-apple-light">Total Clicks</TableHead>
              <TableHead className="text-apple-light">Last 24h</TableHead>
              <TableHead className="text-apple-light">Last 7d</TableHead>
              <TableHead className="text-apple-light">URL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-apple-hover/30 hover:bg-apple-hover/50">
              <TableCell className="font-medium text-apple-light">Landing Page</TableCell>
              <TableCell className="text-apple-light">{landingPage.clicks}</TableCell>
              <TableCell className="text-apple-light">
                {landingPage.clickHistory.filter(click => new Date(click.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length}
              </TableCell>
              <TableCell className="text-apple-light">
                {landingPage.clickHistory.filter(click => new Date(click.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-apple-light">
                <div className="flex items-center">
                  <span className="truncate text-apple-light">{landingPage.shortUrl}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-apple-accent hover:bg-apple-hover" onClick={() => copyToClipboard(landingPage.shortUrl)}>
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            
            {childLinks.map(childLink => {
              const last24h = childLink.clickHistory.filter(click => new Date(click.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)).length;
              const last7d = childLink.clickHistory.filter(click => new Date(click.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;
              return (
                <TableRow key={childLink.id} className="hover:bg-apple-hover/30">
                  <TableCell className="font-medium text-apple-light">{childLink.title}</TableCell>
                  <TableCell className="text-apple-light">{childLink.clicks}</TableCell>
                  <TableCell className="text-apple-light">{last24h}</TableCell>
                  <TableCell className="text-apple-light">{last7d}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-apple-light">
                    <div className="flex items-center">
                      <span className="truncate text-apple-light">{childLink.shortUrl}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1 text-apple-accent hover:bg-apple-hover" onClick={() => copyToClipboard(childLink.shortUrl)}>
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
