
import React, { useState } from "react";
import { useLinkTracking } from "@/context/LinkTrackingContext";
import { useToast } from "@/hooks/use-toast";
import { TrackedLink } from "@/types/linkTracking";
import LinkTableHeader from "./LinkTableHeader";
import LandingPageRow from "./LandingPageRow";
import ButtonTableRow from "./ButtonTableRow";
import LoadingState from "./LoadingState";
import { Table, TableBody } from "@/components/ui/table";

interface LinkTableProps {
  filter?: 'all' | 'landing' | 'redirect';
  landingPageSlug?: string;
}

const LinkTable = ({ filter = 'all', landingPageSlug }: LinkTableProps) => {
  const { links, deleteLink, loading, getLandingPages } = useLinkTracking();
  const { toast } = useToast();
  const [expandedLandingPages, setExpandedLandingPages] = useState<Set<string>>(new Set());

  const toggleLandingPage = (id: string) => {
    const newExpanded = new Set(expandedLandingPages);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedLandingPages(newExpanded);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Link copied",
      description: "The link has been copied to your clipboard.",
    });
  };

  const handleOpenLink = (link: TrackedLink) => {
    if (link.linkType === 'landing') {
      window.open(link.shortUrl, '_blank', 'noopener,noreferrer');
    } else {
      window.open('https://telegram.me/ott_on_rent', '_blank', 'noopener,noreferrer');
    }
  };

  const handleDeleteLink = (id: string) => {
    deleteLink(id);
    toast({
      title: "Link deleted",
      description: "The link has been permanently deleted.",
    });
  };

  // Get buttons for a specific landing page
  const getButtonsForLandingPage = (parentId: string) => {
    return links.filter(link => link.parentLandingPage === parentId);
  };

  if (loading) {
    return <LoadingState />;
  }

  const landingPages = getLandingPages();

  return (
    <div className="w-full overflow-auto rounded-lg border">
      <table className="w-full text-sm">
        <LinkTableHeader />
        <tbody className="divide-y">
          {landingPages.map((landingPage) => (
            <React.Fragment key={landingPage.id}>
              <LandingPageRow
                landingPage={landingPage}
                onOpenLink={handleOpenLink}
                onCopyUrl={copyToClipboard}
                onDelete={handleDeleteLink}
              />
              {getButtonsForLandingPage(landingPage.id).map((button) => (
                <ButtonTableRow
                  key={button.id}
                  button={button}
                  onOpenLink={handleOpenLink}
                />
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LinkTable;
