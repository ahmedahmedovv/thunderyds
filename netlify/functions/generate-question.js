/* ═════════════════════════════════════════════════════════════════════════════
   Thunder YDS - Netlify Function (OpenRouter Proxy)
   Securely proxies requests to OpenRouter API without exposing API key
   
   PERFORMANCE NOTES:
   - Current model: mistralai/ministral-8b (~6-10s response time)
   - Faster alternatives:
     * meta-llama/llama-3.2-1b-instruct (~2-4s, lower quality)
     * google/gemini-flash-1.5 (~1-3s, good balance)
     * openai/gpt-4o-mini (~2-4s, good quality)
   - Caching: Responses are not cached - each request hits the API
   ═════════════════════════════════════════════════════════════════════════════ */

exports.handler = async (event, context) => {
    // CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // Parse the request body
        const body = JSON.parse(event.body);
        const { prompt } = body;

        if (!prompt) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Prompt is required' })
            };
        }

        // Get API key from environment variables (set in Netlify dashboard)
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            console.error('OPENROUTER_API_KEY not configured in Netlify environment variables');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'Server configuration error',
                    message: 'API key not configured. Please add OPENROUTER_API_KEY to Netlify environment variables.'
                })
            };
        }
        
        // Validate API key format (should start with sk-or-)
        if (!apiKey.startsWith('sk-or-')) {
            console.error('OPENROUTER_API_KEY has invalid format');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: 'Server configuration error',
                    message: 'Invalid API key format. OpenRouter keys should start with "sk-or-"'
                })
            };
        }

        // Call OpenRouter API
        console.log('[Netlify] Starting OpenRouter request');
        const startTime = Date.now();
        
        // Try multiple models in case one fails
        const models = [
            'mistralai/ministral-8b',
            'mistralai/mistral-7b-instruct',
            'openai/gpt-3.5-turbo'
        ];
        
        let response;
        let lastError;
        
        for (const model of models) {
            try {
                console.log(`[Netlify] Trying model: ${model}`);
                response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                        'HTTP-Referer': 'https://thunder.yds.today',
                        'X-Title': 'Thunder YDS'
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [{ role: 'user', content: prompt }],
                        temperature: 0.8,
                        max_tokens: 768,
                        response_format: { type: 'json_object' }
                    })
                });
                
                if (response.ok) {
                    console.log(`[Netlify] Model ${model} succeeded`);
                    break;
                } else {
                    lastError = await response.text();
                    console.error(`[Netlify] Model ${model} failed:`, response.status, lastError);
                }
            } catch (err) {
                console.error(`[Netlify] Model ${model} error:`, err.message);
                lastError = err.message;
            }
        }
        
        const duration = Date.now() - startTime;
        console.log(`[Netlify] OpenRouter response received in ${duration}ms, status: ${response?.status}`);

        if (!response || !response.ok) {
            console.error('OpenRouter API error - all models failed. Last error:', lastError);
            
            return {
                statusCode: 502,
                headers,
                body: JSON.stringify({ 
                    error: 'AI service unavailable',
                    message: 'All AI models failed. Please try again later.',
                    details: lastError?.substring(0, 200)
                })
            };
        }

        const data = await response.json();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(data)
        };

    } catch (error) {
        console.error('Function error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Internal server error',
                message: error.message 
            })
        };
    }
};
