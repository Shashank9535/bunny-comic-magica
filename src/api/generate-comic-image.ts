// Frontend proxy to call Supabase Edge Function
export async function generateComicImage(prompt: string, characterDescription: string): Promise<string> {
  try {
    console.log('Calling Supabase Edge Function for image generation...');
    
    const response = await fetch('https://tyaficloiudvkrorlcra.supabase.co/functions/v1/generate-comic-image', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5YWZpY2xvaXVkdmtyb3JsY3JhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NzY2NDgsImV4cCI6MjA2NzA1MjY0OH0.aKxm2YdyM8sZAZgRWjau9oc5tOwtm6qWYpw9vFFTqFc',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        characterDescription
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Supabase function error:', response.status, errorText);
      throw new Error(`Supabase function failed: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Successfully received image from Supabase:', result);
    
    if (!result.success || !result.imageUrl) {
      throw new Error('Invalid response from Supabase function');
    }
    
    return result.imageUrl;
  } catch (error) {
    console.error('Error calling Supabase function:', error);
    // If Supabase fails, fall back to placeholder
    throw error;
  }
}
