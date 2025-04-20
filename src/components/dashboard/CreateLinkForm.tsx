import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLinkTracking } from "@/context/LinkTrackingContext";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CreateLinkForm = () => {
  const { addLink } = useLinkTracking();
  const navigate = useNavigate();
  
  // Form state
  const [title, setTitle] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [source, setSource] = useState("");
  const [linkType, setLinkType] = useState("redirect"); // "redirect" or "landing"
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter a title for your link");
      return;
    }
    
    try {
      // The actual URL is always the same for redirect links
      const finalUrl = "https://telegram.me/ott_on_rent";
      
      // For landing pages, we'll use a special internal URL format
      const url = linkType === "landing" ? "internal://landing-page" : finalUrl;
      
      // Make sure the customSlug is properly trimmed and passed exactly as-is
      const slug = customSlug.trim() || undefined;
      
      const newLink = await addLink(
        url, 
        title,
        // Pass source as a UTM parameter
        source ? { source: source } : undefined,
        // Pass the custom slug if provided
        slug,
        // Pass the link type
        linkType
      );
      
      if (newLink) {
        toast.success(`${linkType === "landing" ? "Landing page" : "Link"} created successfully`);
        
        // Automatically navigate to the link detail page
        navigate(`/OOR/links/${newLink.id}`);
      }
    } catch (error) {
      toast.error(`Failed to create ${linkType === "landing" ? "landing page" : "link"}`);
      console.error(error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <p className="text-sm text-gray-500 mb-4">
          Create a unique landing page with its own set of tracking links. Each landing page automatically includes Buy Now, Netflix, Prime, and Crunchyroll buttons.
        </p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Landing Page Title</Label>
          <Input
            id="title"
            placeholder="E.g., Facebook Campaign"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            A descriptive name to help you identify this landing page
          </p>
        </div>
        
        <div>
          <Label htmlFor="source">Traffic Source</Label>
          <Input
            id="source"
            placeholder="E.g., instagram, facebook, twitter"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Identify where visitors are coming from (optional)
          </p>
        </div>
        
        <div>
          <Label htmlFor="customSlug">Custom Link Slug (optional)</Label>
          <Input
            id="customSlug"
            placeholder="E.g., instagram-2024"
            value={customSlug}
            onChange={(e) => setCustomSlug(e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Create a custom link ending instead of a random one
          </p>
        </div>
      </div>
      
      <div className="p-3 bg-gray-100 rounded-md mt-4">
        <p className="text-xs font-medium text-gray-600">Preview URL:</p>
        <p className="text-xs break-all mt-1">
          {linkType === "landing" ? (
            `${window.location.hostname}/${customSlug || "random-code"}`
          ) : (
            `oor.link/${customSlug || "random-code"}`
          )}
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit">
          {linkType === "landing" ? "Create Landing Page" : "Create Link"}
        </Button>
      </div>
    </form>
  );
};

export default CreateLinkForm;
