import { corsHeaders } from "@shared/cors.ts";

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders, status: 200 });
  }

  try {
    const { provider, prompt, systemPrompt, temperature = 0.7, maxTokens = 4000 } = await req.json();

    let result: string;

    switch (provider) {
      case 'gemini':
        result = await generateWithGemini(prompt, systemPrompt, temperature);
        break;
      
      case 'openai':
        result = await generateWithOpenAI(prompt, systemPrompt, temperature, maxTokens);
        break;
      
      case 'claude':
        result = await generateWithClaude(prompt, systemPrompt, temperature, maxTokens);
        break;
      
      case 'deepseek':
        result = await generateWithDeepSeek(prompt, systemPrompt, temperature, maxTokens);
        break;
      
      case 'qwen':
        result = await generateWithQwen(prompt, systemPrompt, temperature, maxTokens);
        break;
      
      default:
        throw new Error(`Unsupported LLM provider: ${provider}`);
    }

    return new Response(JSON.stringify({ text: result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('LLM generation error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});

async function generateWithGemini(prompt: string, systemPrompt?: string, temperature?: number): Promise<string> {
  const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${prompt}` : prompt;
  
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': Deno.env.get('GEMINI_API_KEY') || '',
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: fullPrompt }] }],
      generationConfig: { temperature },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

async function generateWithOpenAI(prompt: string, systemPrompt?: string, temperature?: number, maxTokens?: number): Promise<string> {
  const messages: Array<{ role: string; content: string }> = [];
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
  messages.push({ role: 'user', content: prompt });

  const response = await fetch('https://api.picaos.com/v1/passthrough/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-pica-secret': Deno.env.get('PICA_SECRET_KEY') || '',
      'x-pica-connection-key': Deno.env.get('PICA_OPENAI_CONNECTION_KEY') || '',
      'x-pica-action-id': 'conn_mod_def::GDzgIflBvyE::h_obcGxcTlyfnfv7iPlHAQ',
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

async function generateWithClaude(prompt: string, systemPrompt?: string, temperature?: number, maxTokens?: number): Promise<string> {
  const response = await fetch('https://api.picaos.com/v1/passthrough/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-pica-secret': Deno.env.get('PICA_SECRET_KEY') || '',
      'x-pica-connection-key': Deno.env.get('PICA_ANTHROPIC_CONNECTION_KEY') || '',
      'x-pica-action-id': 'conn_mod_def::GDyeJEC3LKs::TqB9W3HLT4-ppa03SjoVNA',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: maxTokens || 4000,
      temperature,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    throw new Error(`Claude API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || '';
}

async function generateWithDeepSeek(prompt: string, systemPrompt?: string, temperature?: number, maxTokens?: number): Promise<string> {
  const messages: Array<{ role: string; content: string }> = [];
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
  messages.push({ role: 'user', content: prompt });

  const response = await fetch('https://api.picaos.com/v1/passthrough/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-pica-secret': Deno.env.get('PICA_SECRET_KEY') || '',
      'x-pica-connection-key': Deno.env.get('PICA_DEEPSEEK_CONNECTION_KEY') || '',
      'x-pica-action-id': 'conn_mod_def::GEYczPryCzA::cjF8A5j2SRiziMW5UgaC5A',
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    throw new Error(`DeepSeek API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

async function generateWithQwen(prompt: string, systemPrompt?: string, temperature?: number, maxTokens?: number): Promise<string> {
  const messages: Array<{ role: string; content: string }> = [];
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
  messages.push({ role: 'user', content: prompt });

  const response = await fetch('https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('QWEN_API_KEY') || ''}`,
    },
    body: JSON.stringify({
      model: 'qwen-plus',
      messages,
      temperature,
      max_tokens: maxTokens,
    }),
  });

  if (!response.ok) {
    throw new Error(`Qwen API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}
