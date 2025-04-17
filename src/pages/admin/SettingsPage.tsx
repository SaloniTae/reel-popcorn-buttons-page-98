
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const { toast } = useToast();
  const [domainName, setDomainName] = useState("oor.link");
  const [redirectDelay, setRedirectDelay] = useState("0");
  const [showLogo, setShowLogo] = useState(true);
  const [passwordProtection, setPasswordProtection] = useState(false);
  const [notifyNewLinks, setNotifyNewLinks] = useState(true);
  const [notifyClickMilestones, setNotifyClickMilestones] = useState(true);
  
  const handleSaveSettings = () => {
    toast({
      title: "Settings saved",
      description: "Your dashboard settings have been updated.",
    });
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
            
            <Separator className="my-6" />
            
            <div>
              <Label htmlFor="redirectDelay" className="text-base">Redirect Delay</Label>
              <p className="text-sm text-gray-500 mb-2">
                How many seconds to wait before redirecting visitors (0 for immediate redirect)
              </p>
              <Input
                id="redirectDelay"
                type="number"
                min="0"
                max="10"
                value={redirectDelay}
                onChange={(e) => setRedirectDelay(e.target.value)}
                className="w-24"
              />
            </div>
            
            <Separator className="my-6" />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="showLogo" className="text-base">Show Logo on Redirect</Label>
                <p className="text-sm text-gray-500">
                  Display your logo on the redirect page
                </p>
              </div>
              <Switch
                id="showLogo"
                checked={showLogo}
                onCheckedChange={setShowLogo}
              />
            </div>
            
            <Separator className="my-6" />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="passwordProtection" className="text-base">Password Protection</Label>
                <p className="text-sm text-gray-500">
                  Require a password to access protected links
                </p>
              </div>
              <Switch
                id="passwordProtection"
                checked={passwordProtection}
                onCheckedChange={setPasswordProtection}
              />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-6">Notification Settings</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifyNewLinks" className="text-base">New Links</Label>
                <p className="text-sm text-gray-500">
                  Receive notifications when new links are created
                </p>
              </div>
              <Switch
                id="notifyNewLinks"
                checked={notifyNewLinks}
                onCheckedChange={setNotifyNewLinks}
              />
            </div>
            
            <Separator className="my-6" />
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifyClickMilestones" className="text-base">Click Milestones</Label>
                <p className="text-sm text-gray-500">
                  Receive notifications when links reach click milestones
                </p>
              </div>
              <Switch
                id="notifyClickMilestones"
                checked={notifyClickMilestones}
                onCheckedChange={setNotifyClickMilestones}
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
