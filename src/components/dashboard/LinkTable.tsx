
import { useState } from "react";
import { useLinkTracking } from "@/context/LinkTrackingContext";
import { useToast } from "@/hooks/use-toast";
import { TrackedLink } from "@/types/linkTracking";
import LinkTableHeader from "./LinkTableHeader";
import LandingPageRow from "./LandingPageRow";
import ButtonTableRow from "./ButtonTableRow";
import LoadingState from "./LoadingState";

interface LinkTableProps {
  filter?: 'all' | 'landing' | 'redirect';
  landingPageSlug?: string;
}

const LinkTable = ({ filter = 'all', landingPageSlug }: LinkTableProps) => {
  const { links, deleteLink, loading, getLandingPages, getButtonsForLandingPage } = useLinkTracking();
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

  if (loading) {
    return <LoadingState />;
  }

  const landingPages = getLandingPages();

  return (
    <div className="w-full overflow-auto rounded-lg border">
      <table className="w-full text-sm">
        <LinkTableHeader showClickStats={true} />
        <tbody className="divide-y">
          {landingPages.map((landingPage) => (
            <>
              <LandingPageRow
                key={landingPage.id}
                landingPage={landingPage}
                isExpanded={expandedLandingPages.has(landingPage.id)}
                onToggle={() => toggleLandingPage(landingPage.id)}
                onOpenLink={handleOpenLink}
                onCopyUrl={copyToClipboard}
                onDelete={handleDeleteLink}
              />
              {expandedLandingPages.has(landingPage.id) &&
                getButtonsForLandingPage(landingPage.shortUrl).map((button) => (
                  <ButtonTableRow
                    key={button.id}
                    button={button}
                    onOpenLink={handleOpenLink}
                  />
                ))}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LinkTable;
