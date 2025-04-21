
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
      return new Response(
        JSON.stringify({ error: 'IP address is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }
    
    // Using ip-api.com with more detailed fields for better region and city data
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city,region`);
    const data = await response.json();
    
    console.log("IP Lookup response:", JSON.stringify(data));
    
    if (data.status !== 'success') {
      console.error('IP lookup failed:', data.message);
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
    
    // Return detailed location data, ensuring we have valid values
    return new Response(
      JSON.stringify({
        country: data.country || 'Unknown',
        region: data.regionName || 'Unknown', // Using regionName for full name
        city: data.city || 'Unknown',
        stateCode: data.region || 'UN' // This gives us the state code (e.g., 'MH' for Maharashtra)
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
