
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { recordClick } from "@/services/LinkTrackingService";
import { supabase } from "@/integrations/supabase/client";

const RedirectPage = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);
  const [redirectUrl, setRedirectUrl] = useState("");
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
          .select('original_url')
          .eq('short_code', shortCode)
          .single();

        if (error || !data) {
          console.error("Error finding link:", error);
          setError(true);
          setLoading(false);
          return;
        }

        setRedirectUrl(data.original_url);
        
        // Record the click with browser info
        await recordClick(shortCode, document.referrer, navigator.userAgent);

        // Start countdown
        setLoading(false);
      } catch (err) {
        console.error("Error in redirect:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchOriginalUrl();
  }, [shortCode, navigate]);

  // Start countdown after redirectUrl is set
  useEffect(() => {
    if (!redirectUrl || loading) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = redirectUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [redirectUrl, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <img 
            src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/OOR-CIRCLE.jpg" 
            alt="OTT ON RENT" 
            className="w-16 h-16 mx-auto mb-4 rounded-full"
          />
          <h1 className="text-xl font-bold mb-4">Loading...</h1>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !redirectUrl) {
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <img 
          src="https://raw.githubusercontent.com/OTTONRENT01/FOR-PHOTOS/refs/heads/main/OOR-CIRCLE.jpg" 
          alt="OTT ON RENT" 
          className="w-16 h-16 mx-auto mb-4 rounded-full"
        />
        
        <h1 className="text-xl font-bold mb-2">Redirecting you in {countdown}...</h1>
        
        <p className="text-gray-500 mb-4">
          You're being redirected to your destination.
        </p>
        
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-1000" 
            style={{ 
              width: `${((3 - countdown) / 3) * 100}%`,
            }}
          ></div>
        </div>
        
        <a 
          href={redirectUrl}
          className="text-blue-600 hover:underline text-sm"
        >
          Click here if you are not redirected automatically
        </a>
      </div>
      
      <p className="mt-4 text-xs text-gray-400">
        Powered by OTT ON RENT Link Tracking
      </p>
    </div>
  );
};

export default RedirectPage;
