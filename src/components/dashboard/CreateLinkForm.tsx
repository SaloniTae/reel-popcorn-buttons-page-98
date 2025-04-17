
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLinkTracking } from "@/context/LinkTrackingContext";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CreateLinkForm = () => {
  const { addLink } = useLinkTracking();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [showUtmBuilder, setShowUtmBuilder] = useState(false);
  
  // UTM parameters
  const [campaign, setCampaign] = useState("");
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [content, setContent] = useState("");
  const [term, setTerm] = useState("");
  
  const handleUtmToggle = (value: string) => {
    setShowUtmBuilder(value === "utm");
  };
  
  const buildFinalUrl = () => {
    if (!showUtmBuilder) return url;
    
    const urlObj = new URL(url);
    
    if (campaign) urlObj.searchParams.append("utm_campaign", campaign);
    if (source) urlObj.searchParams.append("utm_source", source);
    if (medium) urlObj.searchParams.append("utm_medium", medium);
    if (content) urlObj.searchParams.append("utm_content", content);
    if (term) urlObj.searchParams.append("utm_term", term);
    
    return urlObj.toString();
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your link.",
        variant: "destructive",
      });
      return;
    }
    
    if (!url.trim()) {
      toast({
        title: "URL required",
        description: "Please enter a URL to shorten.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Validate URL
      new URL(url);
      
      const finalUrl = buildFinalUrl();
      
      // Add UTM parameters if selected
      const utmParams = showUtmBuilder
        ? {
            campaign: campaign || undefined,
            source: source || undefined,
            medium: medium || undefined,
            content: content || undefined,
            term: term || undefined,
          }
        : undefined;
      
      const newLink = addLink(finalUrl, title, utmParams);
      
      toast({
        title: "Link created successfully",
        description: "Your new tracked link has been created.",
      });
      
      navigate(`/OOR/links/${newLink.id}`);
    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL including http:// or https://.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Link Title</Label>
          <Input
            id="title"
            placeholder="E.g., Netflix Summer Promotion"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            A descriptive name to help you identify this link later
          </p>
        </div>
        
        <div>
          <Label htmlFor="url">Destination URL</Label>
          <Input
            id="url"
            placeholder="https://example.com/your-page"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Where visitors will be redirected when they click your short link
          </p>
        </div>
      </div>
      
      <Separator />
      
      <Tabs
        defaultValue="basic"
        onValueChange={handleUtmToggle}
        className="w-full"
      >
        <TabsList className="mb-4">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="utm">UTM Builder</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic">
          <p className="text-sm text-gray-500">
            Create a simple tracked link with no UTM parameters.
          </p>
        </TabsContent>
        
        <TabsContent value="utm" className="space-y-4">
          <p className="text-sm">
            Add UTM parameters to track specific campaigns and traffic sources.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="campaign">Campaign Name</Label>
              <Input
                id="campaign"
                placeholder="summer_sale"
                value={campaign}
                onChange={(e) => setCampaign(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">utm_campaign</p>
            </div>
            
            <div>
              <Label htmlFor="source">Source</Label>
              <Input
                id="source"
                placeholder="instagram"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">utm_source</p>
            </div>
            
            <div>
              <Label htmlFor="medium">Medium</Label>
              <Input
                id="medium"
                placeholder="social"
                value={medium}
                onChange={(e) => setMedium(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">utm_medium</p>
            </div>
            
            <div>
              <Label htmlFor="content">Content</Label>
              <Input
                id="content"
                placeholder="summer_banner"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">utm_content</p>
            </div>
            
            <div>
              <Label htmlFor="term">Term</Label>
              <Input
                id="term"
                placeholder="running_shoes"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">utm_term</p>
            </div>
          </div>
          
          {(campaign || source || medium || content || term) && url && (
            <div className="p-3 bg-gray-100 rounded-md mt-4">
              <p className="text-xs font-medium text-gray-600">Preview URL:</p>
              <p className="text-xs break-all mt-1">{buildFinalUrl()}</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end">
        <Button type="submit">Create Link</Button>
      </div>
    </form>
  );
};

export default CreateLinkForm;
