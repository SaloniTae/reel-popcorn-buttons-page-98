
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { recordClick } from "@/services/linkTracking";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const RedirectPage = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!shortCode) {
      navigate("/");
      return;
    }

    // Find the original URL from the database
    const fetchOriginalUrl = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('links')
          .select('redirect_url, slug')
          .eq('slug', shortCode)
          .single();

        if (error || !data) {
          console.error("Error finding link:", error);
          setError(true);
          setLoading(false);
          return;
        }
        
        // Record the click with browser info
        await recordClick(data.slug, document.referrer, navigator.userAgent);

        // Redirect immediately instead of showing countdown
        window.location.href = data.redirect_url;
      } catch (err) {
        console.error("Error in redirect:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchOriginalUrl();
  }, [shortCode, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <img 
            src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/OOR-CIRCLE.jpg" 
            alt="OTT ON RENT" 
            className="w-16 h-16 mx-auto mb-4 rounded-full"
          />
          <h1 className="text-xl font-bold mb-4">Redirecting...</h1>
          <LoadingSpinner className="mx-auto" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <img 
            src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/OOR-CIRCLE.jpg" 
            alt="OTT ON RENT" 
            className="w-16 h-16 mx-auto mb-4 rounded-full"
          />
          <h1 className="text-xl font-bold mb-2">Link Not Found</h1>
          <p className="text-gray-500 mb-6">
            The link you're looking for doesn't exist or has been removed.
          </p>
          <button 
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // This return should rarely be seen as we redirect immediately
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <img 
          src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/OOR-CIRCLE.jpg" 
          alt="OTT ON RENT" 
          className="w-16 h-16 mx-auto mb-4 rounded-full"
        />
        <h1 className="text-xl font-bold mb-4">Redirecting...</h1>
        <LoadingSpinner className="mx-auto" />
      </div>
    </div>
  );
};

export default RedirectPage;
