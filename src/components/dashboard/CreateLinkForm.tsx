
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
      
      const newLink = await addLink(
        url, 
        title,
        // Pass source as a UTM parameter
        source ? { source: source } : undefined,
        // Pass the custom slug if provided
        customSlug.trim() || undefined,
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
      <Tabs defaultValue="redirect" onValueChange={(value) => setLinkType(value)}>
        <TabsList className="mb-4">
          <TabsTrigger value="redirect">Redirect Link</TabsTrigger>
          <TabsTrigger value="landing">Landing Page</TabsTrigger>
        </TabsList>
        
        <TabsContent value="redirect">
          <p className="text-sm text-gray-500 mb-4">
            Create a redirect link that sends visitors to Telegram when clicked.
          </p>
        </TabsContent>
        
        <TabsContent value="landing">
          <p className="text-sm text-gray-500 mb-4">
            Create a unique landing page with its own set of tracking links. Each landing page automatically includes Buy Now, Netflix, Prime, and Crunchyroll buttons.
          </p>
        </TabsContent>
      </Tabs>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">
            {linkType === "landing" ? "Landing Page Title" : "Link Title"}
          </Label>
          <Input
            id="title"
            placeholder={linkType === "landing" ? "E.g., Facebook Campaign" : "E.g., Instagram Campaign"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            A descriptive name to help you identify this {linkType === "landing" ? "landing page" : "traffic source"}
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
