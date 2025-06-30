
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
  private static readonly GRADIO_API_URL = 'https://stabilityai-stable-diffusion.hf.space';
  
  static async generateComic(
    storyPrompt: string, 
    theme: string, 
    characterImage?: string
  ): Promise<ComicData> {
    console.log('Generating comic with:', { storyPrompt, theme, hasImage: !!characterImage });
    
    try {
      const title = this.generateTitle(storyPrompt);
      const storyPanels = this.generateStoryPanels(storyPrompt, theme);
      
      // Generate images for each panel
      const panelsWithImages = await Promise.all(
        storyPanels.map(async (panel, index) => {
          try {
            const imageUrl = await this.generatePanelImage(panel.prompt, theme, index);
            return { ...panel, imageUrl };
          } catch (error) {
            console.error(`Failed to generate image for panel ${panel.panel}:`, error);
            return {
              ...panel,
              imageUrl: `https://via.placeholder.com/400x300/6366f1/ffffff?text=Panel+${panel.panel}`
            };
          }
        })
      );
      
      return {
        title,
        panels: panelsWithImages,
        theme
      };
    } catch (error) {
      console.error('Comic generation failed:', error);
      return this.generateMockComic(storyPrompt, theme);
    }
  }

  private static async generatePanelImage(prompt: string, theme: string, panelIndex: number): Promise<string> {
    const enhancedPrompt = `${prompt}, ${theme} style, comic book illustration, colorful, child-friendly, cartoon style`;
    const negativePrompt = "dark, scary, violent, adult content, nsfw, realistic, photographic";
    
    try {
      // Try different API endpoints as provided
      const apiEndpoints = ["/infer", "/infer_1", "/infer_2"];
      const selectedEndpoint = apiEndpoints[panelIndex % apiEndpoints.length];
      
      console.log(`Generating image for panel ${panelIndex + 1} with prompt:`, enhancedPrompt);
      
      const response = await fetch(`${this.GRADIO_API_URL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: [enhancedPrompt, negativePrompt, 9],
          fn_index: this.getApiIndex(selectedEndpoint)
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();
      
      // Extract image URL from response
      if (result.data && result.data[0]) {
        // If it's a file object with a URL
        if (typeof result.data[0] === 'object' && result.data[0].url) {
          return result.data[0].url;
        }
        // If it's a direct URL string
        if (typeof result.data[0] === 'string' && result.data[0].startsWith('http')) {
          return result.data[0];
        }
        // If it's a relative path, make it absolute
        if (typeof result.data[0] === 'string') {
          return `${this.GRADIO_API_URL}/file=${result.data[0]}`;
        }
      }
      
      throw new Error('No image URL in response');
    } catch (error) {
      console.error('Image generation failed:', error);
      // Return a themed placeholder
      const themeColors = {
        adventure: 'ff6b35',
        space: '4a90e2',
        forest: '7ed321',
        magic: '9013fe',
        ocean: '50e3c2',
        castle: 'f5a623'
      };
      const color = themeColors[theme as keyof typeof themeColors] || '6366f1';
      return `https://via.placeholder.com/400x300/${color}/ffffff?text=Panel+${panelIndex + 1}`;
    }
  }

  private static getApiIndex(endpoint: string): number {
    switch (endpoint) {
      case "/infer": return 0;
      case "/infer_1": return 1;
      case "/infer_2": return 2;
      default: return 0;
    }
  }

  private static generateTitle(prompt: string): string {
    const words = prompt.split(' ').slice(0, 4);
    return words.map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') + ' Adventure';
  }

  private static generateStoryPanels(prompt: string, theme: string): Omit<ComicPanel, 'imageUrl'>[] {
    const themeDescriptions = {
      adventure: [
        'A brave hero begins their journey with a treasure map',
        'Sailing across stormy seas toward a mysterious island',
        'Discovering an ancient cave filled with secrets',
        'Facing challenges and solving puzzles in the cave',
        'Finding the golden treasure chest hidden deep inside',
        'Celebrating the successful adventure with friends'
      ],
      space: [
        'A rocket ship launches into the starry cosmos',
        'Landing on a colorful alien planet with strange plants',
        'Meeting friendly alien creatures who need help',
        'Working together to solve an intergalactic problem',
        'Sharing knowledge and making new alien friends',
        'Flying home with memories of an amazing space adventure'
      ],
      forest: [
        'Entering a magical forest filled with glowing trees',
        'Meeting talking animals who share forest wisdom',
        'Discovering a enchanted clearing with fairy rings',
        'Learning about nature magic from forest spirits',
        'Using newfound powers to help forest creatures',
        'Leaving the forest as a guardian of nature'
      ],
      magic: [
        'Finding a mysterious magic wand in an old attic',
        'Learning to cast simple spells with colorful sparkles',
        'Opening a magical portal to a fantasy realm',
        'Meeting a wise wizard who teaches magic lessons',
        'Using magic to help solve problems and spread joy',
        'Returning home as a skilled young magician'
      ],
      ocean: [
        'Diving into crystal clear ocean waters',
        'Swimming with dolphins and colorful fish',
        'Exploring a beautiful coral reef underwater city',
        'Meeting mermaids who show ocean wonders',
        'Helping sea creatures solve an underwater mystery',
        'Surfacing with new friends and ocean wisdom'
      ],
      castle: [
        'Approaching a magnificent castle on a hill',
        'Meeting a kind royal family in need of help',
        'Learning about castle life and royal duties',
        'Helping solve a problem threatening the kingdom',
        'Being honored as a hero in the royal court',
        'Leaving the castle with newfound courage and friendship'
      ]
    };

    const descriptions = themeDescriptions[theme as keyof typeof themeDescriptions] || themeDescriptions.adventure;
    
    return descriptions.map((desc, index) => ({
      panel: index + 1,
      caption: `Panel ${index + 1}: ${prompt} - ${desc}`,
      prompt: `${prompt}, ${desc}, ${theme} adventure`
    }));
  }

  private static generateMockComic(prompt: string, theme: string): ComicData {
    const mockPanels = this.generateStoryPanels(prompt, theme).map(panel => ({
      ...panel,
      imageUrl: `https://via.placeholder.com/400x300/6366f1/ffffff?text=Panel+${panel.panel}`
    }));

    return {
      title: this.generateTitle(prompt),
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
