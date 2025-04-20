
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Settings {
  domain_name: string;
  telegram_link: string;
  show_footer_images: boolean;
  background_video: string;
  business_profile_image: string;
}

const SettingsPage = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    domain_name: "oor.link",
    telegram_link: "https://telegram.me/ott_on_rent",
    show_footer_images: true,
    background_video: "https://res.cloudinary.com/djzfoukhz/video/upload/v1744838090/lv_0_20250417022904_sigks8.mp4",
    business_profile_image: "https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/OOR-CIRCLE.jpg"
  });
  
  // Fetch current settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data: settingsData, error } = await supabase
          .from('settings')
          .select('*')
          .eq('id', 1)
          .single();
          
        if (error) {
          console.error('Error fetching settings:', error);
          return;
        }
        
        if (settingsData) {
          setSettings({
            domain_name: settingsData.domain_name || "oor.link",
            telegram_link: settingsData.telegram_link || "https://telegram.me/ott_on_rent",
            show_footer_images: settingsData.show_footer_images !== false,
            background_video: settingsData.background_video || "https://res.cloudinary.com/djzfoukhz/video/upload/v1744838090/lv_0_20250417022904_sigks8.mp4",
            business_profile_image: settingsData.business_profile_image || "https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/OOR-CIRCLE.jpg"
          });
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
        .update({ redirect_url: settings.telegram_link })
        .in('button_type', ['streaming', 'primary']);
        
      if (linksError) throw linksError;
      
      // Update or insert settings in the settings table
      const { error: settingsError } = await supabase
        .from('settings')
        .upsert({
          id: 1,
          domain_name: settings.domain_name,
          telegram_link: settings.telegram_link,
          show_footer_images: settings.show_footer_images,
          background_video: settings.background_video,
          business_profile_image: settings.business_profile_image,
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
                value={settings.domain_name}
                onChange={(e) => setSettings(prev => ({ ...prev, domain_name: e.target.value }))}
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
                value={settings.business_profile_image}
                onChange={(e) => setSettings(prev => ({ ...prev, business_profile_image: e.target.value }))}
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
                value={settings.telegram_link}
                onChange={(e) => setSettings(prev => ({ ...prev, telegram_link: e.target.value }))}
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
                value={settings.background_video}
                onChange={(e) => setSettings(prev => ({ ...prev, background_video: e.target.value }))}
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
                checked={settings.show_footer_images}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, show_footer_images: checked }))}
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
