
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
          .select('redirect_url, slug')
          .eq('slug', shortCode)
          .single();

        if (error || !data) {
          console.error("Error finding link:", error);
          navigate("/not-found");
          return;
        }
        
        // Record the click with browser info
        await recordClick(data.slug, document.referrer, navigator.userAgent);

        // Redirect immediately
        window.location.href = data.redirect_url;
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
