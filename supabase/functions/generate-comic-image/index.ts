import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt, characterDescription } = await req.json()

    const togetherApiKey = Deno.env.get('TOGETHER_API_KEY')
    if (!togetherApiKey) {
      throw new Error('Together AI API key not found')
    }

    // Enhanced prompt for child-friendly comic images
    const enhancedPrompt = `${characterDescription} ${prompt}, comic book illustration style, colorful cartoon art, child-friendly, bright colors, happy adventure, digital art, no text or speech bubbles`

    const response = await fetch('https://api.together.xyz/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${togetherApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'black-forest-labs/FLUX.1-kontext-dev',
        prompt: enhancedPrompt,
        width: 1024,
        height: 1024,
        steps: 28
      })
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('Together AI API error:', error)
      throw new Error(`Together AI API error: ${response.status}`)
    }

    const result = await response.json()
    
    return new Response(
      JSON.stringify({ 
        imageUrl: result.data[0].url,
        success: true 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('Error generating image:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})