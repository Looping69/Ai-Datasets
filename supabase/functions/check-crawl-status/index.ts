import { corsHeaders } from "@shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  try {
    const { crawlId } = await req.json();

    if (!crawlId) {
      return new Response(
        JSON.stringify({ error: 'Crawl ID is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const PICA_SECRET_KEY = Deno.env.get('PICA_SECRET_KEY');
    const FIRECRAWL_CONNECTION_KEY = Deno.env.get('PICA_FIRECRAWL_CONNECTION_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_KEY');

    if (!PICA_SECRET_KEY || !FIRECRAWL_CONNECTION_KEY) {
      return new Response(
        JSON.stringify({ error: 'Missing Firecrawl configuration' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Get crawl status
    const statusResponse = await fetch(`https://api.picaos.com/v1/passthrough/crawl/${crawlId}`, {
      method: 'GET',
      headers: {
        'x-pica-secret': PICA_SECRET_KEY,
        'x-pica-connection-key': FIRECRAWL_CONNECTION_KEY,
        'x-pica-action-id': 'conn_mod_def::GClH9Ur5poM::iGbIOuOOTyKBHnSEyhykPA'
      }
    });

    if (!statusResponse.ok) {
      const errorText = await statusResponse.text();
      return new Response(
        JSON.stringify({ error: `Firecrawl API error: ${errorText}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: statusResponse.status }
      );
    }

    const crawlData = await statusResponse.json();

    // If completed, store in Supabase
    if (crawlData.status === 'completed' && crawlData.data && crawlData.data.length > 0) {
      const linksToStore = crawlData.data.map((item: any) => ({
        url: item.metadata?.sourceURL || '',
        status: item.metadata?.error ? 'error' : 'valid',
        metadata: item.metadata,
        crawl_id: crawlId
      }));

      // Store in Supabase
      const insertResponse = await fetch(`${SUPABASE_URL}/rest/v1/validated_links`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY!,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(linksToStore)
      });

      if (!insertResponse.ok) {
        const errorText = await insertResponse.text();
        console.error('Supabase insert error:', errorText);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        status: crawlData.status,
        data: crawlData.data,
        total: crawlData.total,
        completed: crawlData.completed
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
