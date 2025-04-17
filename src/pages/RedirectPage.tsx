
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useLinkTracking } from "@/context/LinkTrackingContext";

const RedirectPage = () => {
  const { shortCode } = useParams<{ shortCode: string }>();
  const { links, recordClick } = useLinkTracking();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);
  const [redirectUrl, setRedirectUrl] = useState("");

  useEffect(() => {
    if (!shortCode) {
      navigate("/");
      return;
    }

    const fullShortUrl = `oor.link/${shortCode}`;
    const link = links.find(l => l.shortUrl === fullShortUrl);

    if (!link) {
      navigate("/");
      return;
    }

    setRedirectUrl(link.originalUrl);
    
    // Record the click with referrer info
    recordClick(
      link.shortUrl, 
      document.referrer || "direct"
    );

    // Start countdown
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = link.originalUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [shortCode, links, navigate, recordClick]);

  if (!redirectUrl) {
    return null;
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
            className="bg-blue-600 h-2 rounded-full" 
            style={{ 
              width: `${((3 - countdown) / 3) * 100}%`,
              transition: "width 1s linear" 
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
