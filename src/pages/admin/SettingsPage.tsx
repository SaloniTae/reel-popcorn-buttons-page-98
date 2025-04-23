
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
  netflix_button_link: string;
  prime_button_link: string;
  crunchyroll_button_link: string;
  buy_now_button_link: string;
  business_name: string;
}

const SettingsPage = () => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<Settings>({
    domain_name: "oor.link",
    telegram_link: "https://telegram.me/ott_on_rent",
    show_footer_images: true,
    background_video: "https://res.cloudinary.com/djzfoukhz/video/upload/v1744838090/lv_0_20250417022904_sigks8.mp4",
    business_profile_image: "https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/OOR-CIRCLE.jpg",
    netflix_button_link: "https://telegram.me/ott_on_rent",
    prime_button_link: "https://telegram.me/ott_on_rent",
    crunchyroll_button_link: "https://telegram.me/ott_on_rent",
    buy_now_button_link: "https://telegram.me/ott_on_rent",
    business_name: "OTT ON RENT"
  });

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
            business_profile_image: settingsData.business_profile_image || "https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/OOR-CIRCLE.jpg",
            netflix_button_link: settingsData.netflix_button_link || settingsData.telegram_link || "https://telegram.me/ott_on_rent",
            prime_button_link: settingsData.prime_button_link || settingsData.telegram_link || "https://telegram.me/ott_on_rent",
            crunchyroll_button_link: settingsData.crunchyroll_button_link || settingsData.telegram_link || "https://telegram.me/ott_on_rent",
            buy_now_button_link: settingsData.buy_now_button_link || settingsData.telegram_link || "https://telegram.me/ott_on_rent",
            business_name: settingsData.business_name || "OTT ON RENT"
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
      const { error: buttonsError } = await supabase
        .from('links')
        .update({ 
          redirect_url: settings.telegram_link 
        })
        .eq('button_type', 'primary');
        
      if (buttonsError) throw buttonsError;
      
      const buttons = [
        { title: 'Netflix Button', redirect_url: settings.netflix_button_link },
        { title: 'Prime Video Button', redirect_url: settings.prime_button_link },
        { title: 'Crunchyroll Button', redirect_url: settings.crunchyroll_button_link },
        { title: 'Buy Now Button', redirect_url: settings.buy_now_button_link }
      ];
      
      for (const button of buttons) {
        const { error } = await supabase
          .from('links')
          .update({ redirect_url: button.redirect_url })
          .eq('title', button.title);
          
        if (error) console.error(`Error updating ${button.title}:`, error);
      }
      
      const { error: settingsError } = await supabase
        .from('settings')
        .upsert({
          id: 1,
          domain_name: settings.domain_name,
          telegram_link: settings.telegram_link,
          show_footer_images: settings.show_footer_images,
          background_video: settings.background_video,
          business_profile_image: settings.business_profile_image,
          netflix_button_link: settings.netflix_button_link,
          prime_button_link: settings.prime_button_link,
          crunchyroll_button_link: settings.crunchyroll_button_link,
          buy_now_button_link: settings.buy_now_button_link,
          business_name: settings.business_name,
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
        <h1 className="text-2xl font-bold mb-1 text-gradient">Settings</h1>
        <p className="text-muted-contrast">Configure your link tracking and dashboard preferences</p>
      </div>
      
      <div className="mt-8 space-y-10">
        <div className="glass-morphism-light rounded-2xl p-6 shadow-lg border border-apple-border">
          <h2 className="text-lg font-semibold mb-6 text-contrast">Link Settings</h2>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="domainName" className="text-base text-contrast">Custom Domain Name</Label>
              <p className="text-sm text-muted-contrast mb-2">
                Set the domain name that will be used for your short links
              </p>
              <Input
                id="domainName"
                value={settings.domain_name}
                onChange={(e) => setSettings(prev => ({ ...prev, domain_name: e.target.value }))}
                placeholder="yourdomain.com"
                className="bg-apple-card border-apple-border text-white"
              />
            </div>
          </div>
        </div>
        
        <div className="glass-morphism-light rounded-2xl p-6 shadow-lg border border-apple-border">
          <h2 className="text-lg font-semibold mb-6 text-contrast">Landing Page Settings</h2>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="businessName" className="text-base text-contrast">Business Name</Label>
              <p className="text-sm text-muted-contrast mb-2">
                Set the name that appears at the top of your landing page
              </p>
              <Input
                id="businessName"
                value={settings.business_name}
                onChange={(e) => setSettings(prev => ({ ...prev, business_name: e.target.value }))}
                placeholder="OTT ON RENT"
                className="bg-apple-card border-apple-border text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="businessProfileImage" className="text-base text-contrast">Business Profile Image (OOR Circle)</Label>
              <p className="text-sm text-muted-contrast mb-2">
                URL for the OOR Circle image displayed at the top of the landing page
              </p>
              <Input
                id="businessProfileImage"
                value={settings.business_profile_image}
                onChange={(e) => setSettings(prev => ({ ...prev, business_profile_image: e.target.value }))}
                placeholder="https://example.com/image.jpg"
                className="bg-apple-card border-apple-border text-white"
              />
            </div>
          
            <div>
              <Label htmlFor="telegramLink" className="text-base text-contrast">Default Telegram Link</Label>
              <p className="text-sm text-muted-contrast mb-2">
                The default URL where users will be redirected when clicking buttons
              </p>
              <Input
                id="telegramLink"
                value={settings.telegram_link}
                onChange={(e) => setSettings(prev => ({ ...prev, telegram_link: e.target.value }))}
                placeholder="https://telegram.me/your_username"
                className="bg-apple-card border-apple-border text-white"
              />
            </div>
            
            <Separator className="my-6 bg-apple-border" />
            
            <div>
              <Label className="text-base text-contrast">Individual Button Links</Label>
              <p className="text-sm text-muted-contrast mb-4">
                Configure specific links for each button (these will override the default link)
              </p>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="buyNowLink" className="text-sm text-contrast">Buy Now Button Link</Label>
                  <Input
                    id="buyNowLink"
                    value={settings.buy_now_button_link}
                    onChange={(e) => setSettings(prev => ({ ...prev, buy_now_button_link: e.target.value }))}
                    placeholder="https://telegram.me/your_username"
                    className="mt-1 bg-apple-card border-apple-border text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="netflixLink" className="text-sm text-contrast">Netflix Button Link</Label>
                  <Input
                    id="netflixLink"
                    value={settings.netflix_button_link}
                    onChange={(e) => setSettings(prev => ({ ...prev, netflix_button_link: e.target.value }))}
                    placeholder="https://telegram.me/your_username"
                    className="mt-1 bg-apple-card border-apple-border text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="primeLink" className="text-sm text-contrast">Prime Video Button Link</Label>
                  <Input
                    id="primeLink"
                    value={settings.prime_button_link}
                    onChange={(e) => setSettings(prev => ({ ...prev, prime_button_link: e.target.value }))}
                    placeholder="https://telegram.me/your_username"
                    className="mt-1 bg-apple-card border-apple-border text-white"
                  />
                </div>
                
                <div>
                  <Label htmlFor="crunchyrollLink" className="text-sm text-contrast">Crunchyroll Button Link</Label>
                  <Input
                    id="crunchyrollLink"
                    value={settings.crunchyroll_button_link}
                    onChange={(e) => setSettings(prev => ({ ...prev, crunchyroll_button_link: e.target.value }))}
                    placeholder="https://telegram.me/your_username"
                    className="mt-1 bg-apple-card border-apple-border text-white"
                  />
                </div>
              </div>
            </div>
            
            <Separator className="my-6 bg-apple-border" />
            
            <div>
              <Label htmlFor="backgroundVideo" className="text-base text-contrast">Background Video URL</Label>
              <p className="text-sm text-muted-contrast mb-2">
                Video that plays in the background of the landing page
              </p>
              <Input
                id="backgroundVideo"
                value={settings.background_video}
                onChange={(e) => setSettings(prev => ({ ...prev, background_video: e.target.value }))}
                placeholder="https://your-video-url.mp4"
                className="bg-apple-card border-apple-border text-white"
              />
            </div>
            
            <Separator className="my-6 bg-apple-border" />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="showFooterImages" className="text-base text-contrast">Show Footer Images</Label>
                <p className="text-sm text-muted-contrast">
                  Display the film reel and popcorn images in the footer
                </p>
              </div>
              <Switch
                id="showFooterImages"
                checked={settings.show_footer_images}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, show_footer_images: checked }))}
                className="data-[state=checked]:bg-apple-accent"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            onClick={handleSaveSettings} 
            disabled={isSaving}
            className="bg-apple-accent hover:bg-apple-accent/90 text-contrast"
          >
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
