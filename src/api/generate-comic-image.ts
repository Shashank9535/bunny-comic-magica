// Frontend proxy to call Supabase Edge Function
export async function generateComicImage(prompt: string, characterDescription: string): Promise<string> {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      // Fallback to direct OpenAI API call if Supabase not configured
      return await generateImageDirectly(prompt, characterDescription);
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/generate-comic-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        characterDescription
      })
    });

    if (!response.ok) {
      throw new Error(`Supabase function failed: ${response.status}`);
    }

    const result = await response.json();
    return result.imageUrl;
  } catch (error) {
    console.error('Error calling Supabase function:', error);
    // Fallback to direct API call
    return await generateImageDirectly(prompt, characterDescription);
  }
}

async function generateImageDirectly(prompt: string, characterDescription: string): Promise<string> {
  // Use OpenRouter API key with correct endpoint
  const apiKey = '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';
  
  const enhancedPrompt = `${characterDescription} ${prompt}, comic book illustration style, colorful cartoon art, child-friendly, bright colors, happy adventure, digital art, no text or speech bubbles`;

  const response = await fetch('https://openrouter.ai/api/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Comic Generator'
    },
    body: JSON.stringify({
      model: 'dall-e-3',
      prompt: enhancedPrompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      style: 'vivid'
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API error: ${response.status}`);
  }

  const result = await response.json();
  return result.data[0].url;
}