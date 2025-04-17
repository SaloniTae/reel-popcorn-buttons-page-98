
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
    
    // Use the free ip-api.com service to get geolocation data
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,regionName,city`);
    const data = await response.json();
    
    if (data.status !== 'success') {
      console.error('IP lookup failed:', data.message);
      return new Response(
        JSON.stringify({ country: 'India', region: 'Unknown', city: 'Unknown' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Always return India as country as per requirements
    return new Response(
      JSON.stringify({
        country: 'India', 
        region: data.regionName || 'Unknown',
        city: data.city || 'Unknown'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in geo-lookup function:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to lookup IP location' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
