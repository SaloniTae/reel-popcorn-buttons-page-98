import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLinkTracking } from "@/context/LinkTrackingContext";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const CreateLinkForm = () => {
  const { addLink } = useLinkTracking();
  const navigate = useNavigate();
  
  // Form state
  const [title, setTitle] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [source, setSource] = useState("");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter a title for your link");
      return;
    }
    
    try {
      const url = "internal://landing-page";
      const slug = customSlug.trim() || undefined;
      
      const newLink = await addLink(
        url, 
        title,
        source ? { source: source } : undefined,
        slug,
        "landing"
      );
      
      if (newLink) {
        toast.success("Landing page created successfully");
        navigate(`/OOR/links/${newLink.id}`);
      }
    } catch (error) {
      toast.error("Failed to create landing page");
      console.error(error);
    }
  };
  
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          {`${window.location.hostname}/${customSlug || "random-code"}`}
        </p>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit">Create Landing Page</Button>
      </div>
    </form>
  );
};

export default CreateLinkForm;
