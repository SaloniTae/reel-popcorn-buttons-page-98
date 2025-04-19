
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ClickData } from "@/types/linkTracking";

interface ClickHistoryProps {
  clicks: ClickData[];
  formatDate: (date: string) => string;
}

export const ClickHistory = ({ clicks, formatDate }: ClickHistoryProps) => {
  if (clicks.length === 0) {
    return <p className="text-gray-500 text-center py-8">No clicks recorded yet.</p>;
  }

  return (
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
        {clicks.map((click, index) => (
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
  );
};
