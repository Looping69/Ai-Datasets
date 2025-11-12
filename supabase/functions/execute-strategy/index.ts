import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Strategy {
  method: 'DIRECT_DOWNLOAD' | 'API' | 'WEB_CRAWL';
  url: string;
  config?: any;
  headers?: Record<string, string>;
  params?: Record<string, string>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  try {
    const { strategy } = await req.json() as { strategy: Strategy };

    if (!strategy || !strategy.method || !strategy.url) {
      return new Response(
        JSON.stringify({ error: 'Invalid strategy object' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    let result;

    switch (strategy.method) {
      case 'DIRECT_DOWNLOAD':
        result = await executeDirectDownload(strategy);
        break;
      case 'API':
        result = await executeApiCall(strategy);
        break;
      case 'WEB_CRAWL':
        result = await executeWebCrawl(strategy);
        break;
      default:
        throw new Error(`Unsupported method: ${strategy.method}`);
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error('Execution error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Execution failed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

async function executeDirectDownload(strategy: Strategy) {
  const response = await fetch(strategy.url, {
    headers: strategy.headers || {},
  });

  if (!response.ok) {
    throw new Error(`Download failed: ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type') || 'application/octet-stream';
  const blob = await response.blob();
  const arrayBuffer = await blob.arrayBuffer();
  const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

  return {
    contentType,
    size: blob.size,
    data: base64,
    filename: strategy.url.split('/').pop() || 'download',
  };
}

async function executeApiCall(strategy: Strategy) {
  const url = new URL(strategy.url);
  
  if (strategy.params) {
    Object.entries(strategy.params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    headers: strategy.headers || {},
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
}

async function executeWebCrawl(strategy: Strategy) {
  const firecrawlApiKey = Deno.env.get('FIRECRAWL_API_KEY');
  
  if (!firecrawlApiKey) {
    throw new Error('FIRECRAWL_API_KEY not configured');
  }

  const config = strategy.config || {};
  
  const crawlRequest = {
    url: strategy.url,
    ...config,
  };

  const response = await fetch('https://api.firecrawl.dev/v1/crawl', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${firecrawlApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(crawlRequest),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Firecrawl API error: ${errorText}`);
  }

  const result = await response.json();
  return result;
}
