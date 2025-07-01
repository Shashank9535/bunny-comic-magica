
import { ImageAnalysisService } from './imageAnalysisService';
import { OpenRouterService } from './openRouterService';

export interface ComicPanel {
  panel: number;
  caption: string;
  imageUrl: string;
  prompt: string;
}

export interface ComicData {
  title: string;
  panels: ComicPanel[];
  theme: string;
}

export class ComicService {
  private static readonly HF_API_KEY = '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'; // Writing API key
  private static readonly FLUX_API_URL = 'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev';
  
  static async generateComic(
    storyPrompt: string, 
    theme: string, 
    characterImage?: string
  ): Promise<ComicData> {
    console.log('=== COMIC GENERATION STARTED ===');
    console.log('Input parameters:', { storyPrompt, theme, hasImage: !!characterImage });
    
    try {
      // Step 1: Analyze the uploaded image to get character description
      let characterDescription = "a young adventurer";
      if (characterImage) {
        try {
          console.log('Step 1: Analyzing character image...');
          characterDescription = await ImageAnalysisService.analyzeUploadedImage(characterImage);
          console.log('Character description from BLIP:', characterDescription);
        } catch (error) {
          console.error('Image analysis failed, using fallback:', error);
        }
      }
      
      // Step 2: Generate personalized story using OpenRouter
      console.log('Step 2: Generating story with OpenRouter...');
      const storyPanels = await OpenRouterService.generatePersonalizedStory(
        characterDescription, 
        theme, 
        storyPrompt
      );
      console.log('Generated story panels:', storyPanels);
      
      // Step 3: Create comic panels with personalized content
      const title = this.generateTitle(storyPrompt, characterDescription);
      console.log('Generated title:', title);
      
      // Step 4: Generate images for each panel using FLUX
      console.log('Step 4: Generating images for panels...');
      const panelsWithImages = await Promise.all(
        storyPanels.map(async (panelDescription, index) => {
          try {
            console.log(`Generating image for panel ${index + 1}...`);
            const imageUrl = await this.generatePanelImageWithFlux(
              panelDescription, 
              theme, 
              index, 
              characterDescription
            );
            return {
              panel: index + 1,
              caption: `Panel ${index + 1}: ${panelDescription}`,
              imageUrl,
              prompt: `${characterDescription} ${panelDescription}, ${theme} style, comic book illustration`
            };
          } catch (error) {
            console.error(`Failed to generate image for panel ${index + 1}:`, error);
            return {
              panel: index + 1,
              caption: `Panel ${index + 1}: ${panelDescription}`,
              imageUrl: this.getThemeBasedPlaceholder(theme, index + 1),
              prompt: `${characterDescription} ${panelDescription}, ${theme} style, comic book illustration`
            };
          }
        })
      );
      
      console.log('=== COMIC GENERATION COMPLETED ===');
      return {
        title,
        panels: panelsWithImages,
        theme
      };
    } catch (error) {
      console.error('Comic generation failed completely:', error);
      return this.generateMockComic(storyPrompt, theme, characterImage);
    }
  }

  private static async generatePanelImageWithFlux(
    panelDescription: string, 
    theme: string, 
    panelIndex: number, 
    characterDescription: string
  ): Promise<string> {
    const enhancedPrompt = `${characterDescription} ${panelDescription}, ${theme} adventure, comic book style, colorful, child-friendly, cartoon illustration, bright colors, happy, safe for kids`;
    
    try {
      console.log(`Generating image for panel ${panelIndex + 1} with FLUX:`, enhancedPrompt);
      
      const response = await fetch(this.FLUX_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: enhancedPrompt,
          parameters: {
            guidance_scale: 7.5,
            negative_prompt: "dark, scary, violent, adult content, nsfw, realistic, photographic, ugly, deformed",
            num_inference_steps: 20,
            width: 400,
            height: 300,
            seed: panelIndex + Math.floor(Math.random() * 1000)
          }
        })
      });

      if (response.ok) {
        const imageBlob = await response.blob();
        const imageUrl = URL.createObjectURL(imageBlob);
        return imageUrl;
      }
      
      throw new Error(`FLUX API error: ${response.status}`);
    } catch (error) {
      console.error('FLUX image generation failed:', error);
      return this.getThemeBasedPlaceholder(theme, panelIndex + 1);
    }
  }

  private static getThemeBasedPlaceholder(theme: string, panelNumber: number): string {
    const themeEmojis = {
      adventure: '🏴‍☠️',
      space: '🚀',
      forest: '🌳',
      magic: '✨',
      ocean: '🌊',
      castle: '🏰'
    };
    
    const emoji = themeEmojis[theme as keyof typeof themeEmojis] || '🎨';
    return `https://via.placeholder.com/400x300/6366f1/ffffff?text=${emoji}+Panel+${panelNumber}`;
  }

  private static generateTitle(prompt: string, characterDescription: string): string {
    const heroName = characterDescription.includes('young') ? 'Young Hero' : 'Brave Explorer';
    const words = prompt.split(' ').slice(0, 3);
    return `${heroName}'s ${words.map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')} Adventure`;
  }

  private static generateMockComic(storyPrompt: string, theme: string, characterImage?: string): ComicData {
    const characterDescription = characterImage ? "a young adventurer" : "a brave hero";
    const mockPanels = [
      "begins an amazing adventure",
      "discovers something magical",
      "faces a fun challenge",
      "learns something important",
      "helps new friends",
      "returns home as a hero"
    ].map((description, index) => ({
      panel: index + 1,
      caption: `Panel ${index + 1}: ${characterDescription} ${description}`,
      imageUrl: this.getThemeBasedPlaceholder(theme, index + 1),
      prompt: `${characterDescription} ${description}, ${theme} style`
    }));

    return {
      title: this.generateTitle(storyPrompt, characterDescription),
      panels: mockPanels,
      theme
    };
  }

  static async generatePDF(comicData: ComicData): Promise<Blob> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) throw new Error('Canvas not supported');
    
    canvas.width = 800;
    canvas.height = 1200;
    
    // Simple PDF-like layout
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = 'black';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(comicData.title, canvas.width / 2, 50);
    
    // Add panels in a grid
    const panelsPerRow = 2;
    const panelWidth = 350;
    const panelHeight = 200;
    const startX = 50;
    const startY = 100;
    
    // Load and draw images
    const imagePromises = comicData.panels.map(async (panel, index) => {
      const row = Math.floor(index / panelsPerRow);
      const col = index % panelsPerRow;
      const x = startX + col * (panelWidth + 50);
      const y = startY + row * (panelHeight + 100);
      
      try {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = panel.imageUrl;
        });
        
        // Draw image
        ctx.drawImage(img, x, y, panelWidth, panelHeight);
      } catch (error) {
        console.log(`Could not load image for panel ${panel.panel}`);
        // Draw placeholder rectangle
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.strokeRect(x, y, panelWidth, panelHeight);
        ctx.fillStyle = 'gray';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`Panel ${panel.panel}`, x + panelWidth/2, y + panelHeight/2);
      }
      
      // Add panel text
      ctx.fillStyle = 'black';
      ctx.font = '14px Arial';
      ctx.textAlign = 'left';
      const words = panel.caption.split(' ');
      let line = '';
      let lineY = y + panelHeight + 20;
      
      words.forEach(word => {
        const testLine = line + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > panelWidth && line !== '') {
          ctx.fillText(line, x, lineY);
          line = word + ' ';
          lineY += 20;
        } else {
          line = testLine;
        }
      });
      ctx.fillText(line, x, lineY);
    });
    
    await Promise.all(imagePromises);
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png');
    });
  }
}
