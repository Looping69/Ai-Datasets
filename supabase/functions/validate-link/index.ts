import { corsHeaders } from "@shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const PICA_SECRET_KEY = Deno.env.get('PICA_SECRET_KEY');
    const FIRECRAWL_CONNECTION_KEY = Deno.env.get('PICA_FIRECRAWL_CONNECTION_KEY');

    if (!PICA_SECRET_KEY || !FIRECRAWL_CONNECTION_KEY) {
      return new Response(
        JSON.stringify({ error: 'Missing Firecrawl configuration' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Start crawl
    const crawlResponse = await fetch('https://api.picaos.com/v1/passthrough/crawl', {
      method: 'POST',
      headers: {
        'x-pica-secret': PICA_SECRET_KEY,
        'x-pica-connection-key': FIRECRAWL_CONNECTION_KEY,
        'x-pica-action-id': 'conn_mod_def::GClH9Ur5poM::iGbIOuOOTyKBHnSEyhykPA',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url })
    });

    if (!crawlResponse.ok) {
      const errorText = await crawlResponse.text();
      return new Response(
        JSON.stringify({ error: `Firecrawl API error: ${errorText}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: crawlResponse.status }
      );
    }

    const crawlData = await crawlResponse.json();

    return new Response(
      JSON.stringify({ success: true, crawlId: crawlData.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
