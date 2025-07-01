
export class ImageAnalysisService {
  private static readonly HF_API_KEY = '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'; // Reading API key
  private static readonly BLIP_API_URL = 'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base';

  static async analyzeUploadedImage(imageUrl: string): Promise<string> {
    try {
      console.log('Starting image analysis with BLIP:', imageUrl);
      
      // Convert image URL to blob for analysis
      console.log('Fetching image...');
      const imageResponse = await fetch(imageUrl);
      
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.status}`);
      }
      
      const imageBlob = await imageResponse.blob();
      console.log('Image blob created, size:', imageBlob.size);
      
      // Send to Hugging Face BLIP API
      console.log('Sending to BLIP API...');
      const response = await fetch(this.BLIP_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.HF_API_KEY}`,
        },
        body: imageBlob,
      });

      console.log('BLIP API response status:', response.status);
      console.log('BLIP API response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('BLIP API error details:', errorText);
        throw new Error(`BLIP API error: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('BLIP API full response:', result);
      
      const caption = result[0]?.generated_text || 'a young adventurer';
      
      console.log('BLIP generated caption:', caption);
      return caption;
      
    } catch (error) {
      console.error('BLIP analysis failed with error:', error);
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
      
      // Fallback to simple descriptions
      return this.getFallbackDescription();
    }
  }

  private static getFallbackDescription(): string {
    const fallbackDescriptions = [
      "a brave young adventurer with a bright smile",
      "a curious child with sparkling eyes ready for adventure",
      "a young hero with a kind heart and adventurous spirit",
      "a creative child with an imagination full of wonder",
      "a playful young explorer with a love for discovery"
    ];
    
    return fallbackDescriptions[Math.floor(Math.random() * fallbackDescriptions.length)];
  }
}
