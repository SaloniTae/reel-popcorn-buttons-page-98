
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const SettingsPage = () => {
  const { toast } = useToast();
  const [domainName, setDomainName] = useState("oor.link");
  const [telegramLink, setTelegramLink] = useState("https://telegram.me/ott_on_rent");
  const [showFooterImages, setShowFooterImages] = useState(true);
  const [backgroundVideo, setBackgroundVideo] = useState("https://res.cloudinary.com/djzfoukhz/video/upload/v1744838090/lv_0_20250417022904_sigks8.mp4");
  
  const handleSaveSettings = async () => {
    try {
      const { error: linksError } = await supabase
        .from('links')
        .update({ redirect_url: telegramLink })
        .eq('button_type', 'streaming');
        
      if (linksError) throw linksError;
      
      toast({
        title: "Settings saved",
        description: "Your dashboard and landing page settings have been updated.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold mb-1">Settings</h1>
        <p className="text-gray-500">Configure your link tracking and dashboard preferences</p>
      </div>
      
      <div className="mt-8 space-y-10">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6">Link Settings</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="domainName" className="text-base">Custom Domain Name</Label>
              <p className="text-sm text-gray-500 mb-2">
                Set the domain name that will be used for your short links
              </p>
              <Input
                id="domainName"
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
                placeholder="yourdomain.com"
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6">Landing Page Settings</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="telegramLink" className="text-base">Telegram Link</Label>
              <p className="text-sm text-gray-500 mb-2">
                The URL where users will be redirected when clicking buttons
              </p>
              <Input
                id="telegramLink"
                value={telegramLink}
                onChange={(e) => setTelegramLink(e.target.value)}
                placeholder="https://telegram.me/your_username"
              />
            </div>
            
            <Separator className="my-6" />
            
            <div>
              <Label htmlFor="backgroundVideo" className="text-base">Background Video URL</Label>
              <p className="text-sm text-gray-500 mb-2">
                Video that plays in the background of the landing page
              </p>
              <Input
                id="backgroundVideo"
                value={backgroundVideo}
                onChange={(e) => setBackgroundVideo(e.target.value)}
                placeholder="https://your-video-url.mp4"
              />
            </div>
            
            <Separator className="my-6" />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="showFooterImages" className="text-base">Show Footer Images</Label>
                <p className="text-sm text-gray-500">
                  Display the film reel and popcorn images in the footer
                </p>
              </div>
              <Switch
                id="showFooterImages"
                checked={showFooterImages}
                onCheckedChange={setShowFooterImages}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings}>Save Settings</Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
