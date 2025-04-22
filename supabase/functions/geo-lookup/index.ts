
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { ip } = await req.json();
    
    if (!ip) {
      console.error('IP address is missing in request');
      return new Response(
        JSON.stringify({ error: 'IP address is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    console.log("Looking up IP:", ip);
    
    // Try ip-api.com first as it seems more accurate for regions in India
    const ipApiUrl = `http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,region`;
    console.log("Making request to:", ipApiUrl);
    
    try {
      const response = await fetch(ipApiUrl);
      const data = await response.json();
      
      console.log("IP Lookup response from ip-api.com:", JSON.stringify(data));
      
      // Check if response is successful
      if (data.status === "success") {
        return new Response(
          JSON.stringify({
            country: data.country || 'Unknown',
            region: data.regionName || data.region || 'Unknown',
            city: data.city || 'Unknown',
            stateCode: data.region || 'UN'
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } else {
        console.log("ip-api.com failed, falling back to ipapi.co");
        // If ip-api.com fails, fall back to ipapi.co
        throw new Error("ip-api.com lookup failed");
      }
    } catch (error) {
      console.log("Fallback to ipapi.co due to error:", error);
      
      // Fallback to ipapi.co
      const fallbackResponse = await fetch(`https://ipapi.co/${ip}/json/`);
      const fallbackData = await fallbackResponse.json();
      
      console.log("Fallback IP Lookup response:", JSON.stringify(fallbackData));
      
      if (fallbackData.error) {
        throw new Error(fallbackData.error);
      }
      
      return new Response(
        JSON.stringify({
          country: fallbackData.country_name || fallbackData.country || 'Unknown',
          region: fallbackData.region || fallbackData.region_code || 'Unknown',
          city: fallbackData.city || 'Unknown',
          stateCode: fallbackData.region_code || 'UN'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in geo-lookup function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to lookup IP location',
        country: 'Unknown',
        region: 'Unknown',
        city: 'Unknown',
        stateCode: 'UN'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
