
import React from 'react';
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrackedLink } from "@/types/linkTracking";

interface ButtonPerformanceProps {
  landingPage: TrackedLink;
  childLinks: TrackedLink[];
}

export const ButtonPerformance = ({ landingPage, childLinks }: ButtonPerformanceProps) => {
  const { toast } = useToast();

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Button link copied",
      description: "The button link has been copied to your clipboard.",
    });
  };

  return (
    <div className="mb-6">
      <h3 className="text-base font-medium mb-3">Button Performance</h3>
      <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Button</TableHead>
              <TableHead>Total Clicks</TableHead>
              <TableHead>Last 24h</TableHead>
              <TableHead>Last 7d</TableHead>
              <TableHead>URL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow className="bg-blue-50">
              <TableCell className="font-medium">Landing Page</TableCell>
              <TableCell>{landingPage.clicks}</TableCell>
              <TableCell>
                {landingPage.clickHistory.filter(
                  click => new Date(click.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
                ).length}
              </TableCell>
              <TableCell>
                {landingPage.clickHistory.filter(
                  click => new Date(click.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                ).length}
              </TableCell>
              <TableCell className="max-w-[200px] truncate">
                <div className="flex items-center">
                  <span className="truncate">{landingPage.shortUrl}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 ml-1"
                    onClick={() => copyToClipboard(landingPage.shortUrl)}
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            
            {childLinks.map((childLink) => {
              const last24h = childLink.clickHistory.filter(
                click => new Date(click.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
              ).length;
              
              const last7d = childLink.clickHistory.filter(
                click => new Date(click.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              ).length;

              return (
                <TableRow key={childLink.id}>
                  <TableCell className="font-medium">{childLink.title}</TableCell>
                  <TableCell>{childLink.clicks}</TableCell>
                  <TableCell>{last24h}</TableCell>
                  <TableCell>{last7d}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    <div className="flex items-center">
                      <span className="truncate">{childLink.shortUrl}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-1"
                        onClick={() => copyToClipboard(childLink.shortUrl)}
                      >
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
