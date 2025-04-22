
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const handler = async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { id } = await req.json();
    if (!id) {
      return new Response(JSON.stringify({ error: "Link id required" }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const client = createClient(
      "https://frffrnqzibkhhrknohlu.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZyZmZybnF6aWJraGhya25vaGx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4NzY2NDAsImV4cCI6MjA2MDQ1MjY0MH0.jS6ngycGoN3QBoxxDkSKGeqWTjl5_JsLsBuwWVXR1Bc"
    );

    // Get the main link
    const { data: link, error: getLinkError } = await client
      .from("links")
      .select("slug, linkType")
      .eq("id", id)
      .single();

    if (getLinkError || !link) {
      return new Response(JSON.stringify({ error: "Link not found" }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    const landingSlug = link.slug;

    // Get associated button links
    const { data: buttonLinks, error: buttonError } = await client
      .from("links")
      .select("id")
      .or(`parent_landing_page.eq.${landingSlug},slug.ilike.%${landingSlug}-%`) // handles child buttons links
      .neq("id", id);

    const linkIdsToReset = [id];
    if (buttonLinks && buttonLinks.length) {
      for (const b of buttonLinks) linkIdsToReset.push(b.id);
    }

    // Delete click_events for all relevant link ids
    const { error: deleteError } = await client
      .from("click_events")
      .delete()
      .in("link_id", linkIdsToReset);

    if (deleteError) {
      return new Response(JSON.stringify({ error: "Failed to reset click data" }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
};

export default handler;
