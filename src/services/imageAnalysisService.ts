
export class ImageAnalysisService {
  private static readonly HF_API_KEY = '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'; // Reading API key
  private static readonly BLIP_API_URL = 'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-base';

  static async analyzeUploadedImage(imageUrl: string): Promise<string> {
    try {
      console.log('Analyzing image with BLIP:', imageUrl);
      
      // Convert image URL to blob for analysis
      const imageResponse = await fetch(imageUrl);
      const imageBlob = await imageResponse.blob();
      
      // Send to Hugging Face BLIP API
      const response = await fetch(this.BLIP_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.HF_API_KEY}`,
        },
        body: imageBlob,
      });

      if (!response.ok) {
        throw new Error(`BLIP API error: ${response.status}`);
      }

      const result = await response.json();
      const caption = result[0]?.generated_text || 'a young adventurer';
      
      console.log('BLIP generated caption:', caption);
      return caption;
      
    } catch (error) {
      console.error('BLIP analysis failed:', error);
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
