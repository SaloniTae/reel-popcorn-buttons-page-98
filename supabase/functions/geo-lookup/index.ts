
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
    
    // Use ipapi.co instead of ip-api.com
    const ipapiUrl = `https://ipapi.co/${ip}/json/`;
    console.log("Making request to:", ipapiUrl);
    
    const response = await fetch(ipapiUrl);
    const data = await response.json();
    
    console.log("IP Lookup response from ipapi.co:", JSON.stringify(data));
    
    // Check if response is successful (ipapi.co returns error field when there's an error)
    if (!data.error) {
      return new Response(
        JSON.stringify({
          country: data.country_name || 'Unknown',
          region: data.region || 'Unknown',
          city: data.city || 'Unknown',
          stateCode: data.region_code || 'UN'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      console.error("ipapi.co lookup failed:", data.error);
      throw new Error(data.error);
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

