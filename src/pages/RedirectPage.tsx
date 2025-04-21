
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { recordClick } from "@/services/linkTracking";
import { supabase } from "@/integrations/supabase/client";

const RedirectPage = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!shortCode) {
      navigate("/");
      return;
    }

    // Find the original URL from the database and redirect immediately
    const fetchOriginalUrl = async () => {
      try {
        const { data, error } = await supabase
          .from('links')
          .select('redirect_url, slug, button_type, parent_landing_page')
          .eq('slug', shortCode)
          .single();

        if (error || !data) {
          console.error("Error finding link:", error);
          navigate("/not-found");
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
        navigate("/not-found");
      }
    };

    fetchOriginalUrl();
  }, [shortCode, navigate]);

  // Return empty div as this component should not render anything visible
  return null;
};

export default RedirectPage;
