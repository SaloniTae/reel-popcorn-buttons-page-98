
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { recordClick } from "@/services/linkTracking";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const RedirectPage = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shortCode) {
      navigate("/");
      return;
    }

    // Find the original URL from the database and redirect immediately
    const fetchOriginalUrl = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('links')
          .select('redirect_url, slug, button_type, parent_landing_page')
          .eq('slug', shortCode)
          .maybeSingle(); // Use maybeSingle instead of single to handle not found gracefully

        if (error) {
          console.error("Error finding link:", error);
          setError("Database error while fetching the link");
          setLoading(false);
          return;
        }
        
        if (!data) {
          console.error("Link not found:", shortCode);
          setError("This link doesn't exist or has been removed");
          setLoading(false);
          return;
        }
        
        // Determine the referrer type based on the button_type
        const referrerType = data.button_type && ['primary', 'streaming'].includes(data.button_type) 
          ? 'button' 
          : document.referrer;
        
        console.log("Redirect page - recording click with referrer:", referrerType);
        
        // Record the click with browser info
        await recordClick(data.slug, referrerType, navigator.userAgent);
        
        // Also record a click on the parent landing page if this is a button
        if (data.parent_landing_page) {
          await recordClick(data.parent_landing_page, referrerType, navigator.userAgent);
        }

        // Redirect immediately
        window.open(data.redirect_url, '_self');
      } catch (err) {
        console.error("Error in redirect:", err);
        setError("An unexpected error occurred");
        setLoading(false);
      }
    };

    fetchOriginalUrl();
  }, [shortCode, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Redirecting you to the destination...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center p-8 rounded-lg bg-neutral-900 border border-neutral-800 max-w-md">
          <div className="text-red-500 text-5xl mb-4">404</div>
          <h1 className="text-2xl font-bold text-white mb-2">Link Not Found</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Button 
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  // Return empty div as this component should not render anything visible when redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-white text-lg">Redirecting you to the destination...</p>
      </div>
    </div>
  );
};

export default RedirectPage;
