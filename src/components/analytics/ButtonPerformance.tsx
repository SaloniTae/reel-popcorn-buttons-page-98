
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

  const allLinks = [landingPage, ...childLinks];

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
            {allLinks.map((link) => {
              const last24h = link.clickHistory.filter(
                click => new Date(click.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
              ).length;
              
              const last7d = link.clickHistory.filter(
                click => new Date(click.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
              ).length;

              const isLandingPage = !link.parentLandingPage;

              return (
                <TableRow key={link.id} className={isLandingPage ? "bg-blue-50" : ""}>
                  <TableCell className="font-medium">
                    {isLandingPage ? "Landing Page" : link.title}
                  </TableCell>
                  <TableCell>{link.clicks}</TableCell>
                  <TableCell>{last24h}</TableCell>
                  <TableCell>{last7d}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    <div className="flex items-center">
                      <span className="truncate">{link.shortUrl}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-1"
                        onClick={() => copyToClipboard(link.shortUrl)}
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
