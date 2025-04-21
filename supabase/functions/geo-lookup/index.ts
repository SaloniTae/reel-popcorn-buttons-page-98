
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
    
    // Using ipapi.co as an alternative service with better region data
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    
    console.log("IP Lookup response:", JSON.stringify(data));
    
    // Check if the response contains an error message
    if (data.error) {
      console.error('IP lookup failed:', data.error);
      return new Response(
        JSON.stringify({ 
          country: 'Unknown',
          region: 'Unknown',
          city: 'Unknown',
          stateCode: 'UN'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Return detailed location data with meaningful fallbacks
    return new Response(
      JSON.stringify({
        country: data.country_name || data.country || 'Unknown',
        region: data.region || data.region_code || 'Unknown',
        city: data.city || 'Unknown',
        stateCode: data.region_code || 'UN'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
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
