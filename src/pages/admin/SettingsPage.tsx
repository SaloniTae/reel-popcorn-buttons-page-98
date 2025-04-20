
import { useState, useEffect } from "react";
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
  const [businessProfileImage, setBusinessProfileImage] = useState("https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/OOR-CIRCLE.jpg");
  const [isSaving, setIsSaving] = useState(false);
  
  // Fetch current settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // Get the settings from the database
        const { data: settings, error } = await supabase
          .from('settings')
          .select('*')
          .single();
          
        if (error) {
          console.error('Error fetching settings:', error);
          return;
        }
        
        if (settings) {
          setDomainName(settings.domain_name || "oor.link");
          setTelegramLink(settings.telegram_link || "https://telegram.me/ott_on_rent");
          setShowFooterImages(settings.show_footer_images !== false);
          setBackgroundVideo(settings.background_video || "https://res.cloudinary.com/djzfoukhz/video/upload/v1744838090/lv_0_20250417022904_sigks8.mp4");
          setBusinessProfileImage(settings.business_profile_image || "https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/OOR-CIRCLE.jpg");
        }
      } catch (error) {
        console.error('Error in fetchSettings:', error);
      }
    };
    
    fetchSettings();
  }, []);
  
  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Update all streaming button links to the new telegram link
      const { error: linksError } = await supabase
        .from('links')
        .update({ redirect_url: telegramLink })
        .in('button_type', ['streaming', 'primary']);
        
      if (linksError) throw linksError;
      
      // Update or insert settings in the settings table
      const { error: settingsError } = await supabase
        .from('settings')
        .upsert({
          id: 1, // Using a constant ID for the settings record
          domain_name: domainName,
          telegram_link: telegramLink,
          show_footer_images: showFooterImages,
          background_video: backgroundVideo,
          business_profile_image: businessProfileImage,
          updated_at: new Date().toISOString()
        });
        
      if (settingsError) throw settingsError;
      
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
    } finally {
      setIsSaving(false);
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
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="businessProfileImage" className="text-base">Business Profile Image (OOR Circle)</Label>
              <p className="text-sm text-gray-500 mb-2">
                URL for the OOR Circle image displayed at the top of the landing page
              </p>
              <Input
                id="businessProfileImage"
                value={businessProfileImage}
                onChange={(e) => setBusinessProfileImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          
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
          <Button 
            onClick={handleSaveSettings} 
            disabled={isSaving}
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
