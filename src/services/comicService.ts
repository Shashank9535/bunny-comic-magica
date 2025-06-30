
export interface ComicPanel {
  panel: number;
  caption: string;
  imageUrl: string;
}

export interface ComicData {
  title: string;
  panels: ComicPanel[];
  theme: string;
}

export class ComicService {
  private static readonly HF_SPACE_URL = 'https://jbilcke-hf-ai-comic-factory.hf.space';
  
  static async generateComic(
    storyPrompt: string, 
    theme: string, 
    characterImage?: string
  ): Promise<ComicData> {
    console.log('Generating comic with:', { storyPrompt, theme, hasImage: !!characterImage });
    
    try {
      // Create the comic generation request
      const response = await fetch(`${this.HF_SPACE_URL}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `${storyPrompt} in ${theme} style, child-friendly comic`,
          style: theme,
          character_image: characterImage || null,
          panels: 6
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        title: this.generateTitle(storyPrompt),
        panels: data.panels || this.generateMockPanels(storyPrompt, theme),
        theme
      };
    } catch (error) {
      console.error('Comic generation failed:', error);
      // Return mock data for demo purposes
      return this.generateMockComic(storyPrompt, theme);
    }
  }

  private static generateTitle(prompt: string): string {
    const words = prompt.split(' ').slice(0, 4);
    return words.map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ') + ' Adventure';
  }

  private static generateMockPanels(prompt: string, theme: string): ComicPanel[] {
    const themeDescriptions = {
      adventure: ['sailing ship', 'treasure map', 'mysterious island', 'hidden cave', 'golden treasure', 'celebration'],
      space: ['rocket launch', 'alien planet', 'space station', 'meteor shower', 'alien friends', 'return home'],
      forest: ['deep woods', 'magical creatures', 'enchanted tree', 'forest animals', 'nature magic', 'peaceful ending'],
      magic: ['magic wand', 'spell casting', 'magical portal', 'fantasy realm', 'magical quest', 'happy ending'],
      ocean: ['underwater world', 'sea creatures', 'coral reef', 'ocean adventure', 'marine friends', 'surface return'],
      castle: ['royal castle', 'brave knight', 'dragon encounter', 'royal quest', 'kingdom saved', 'royal celebration']
    };

    const descriptions = themeDescriptions[theme as keyof typeof themeDescriptions] || themeDescriptions.adventure;
    
    return descriptions.map((desc, index) => ({
      panel: index + 1,
      caption: `Panel ${index + 1}: ${prompt} and discovers ${desc}`,
      imageUrl: `https://via.placeholder.com/300x200/6366f1/ffffff?text=Panel+${index + 1}`
    }));
  }

  private static generateMockComic(prompt: string, theme: string): ComicData {
    return {
      title: this.generateTitle(prompt),
      panels: this.generateMockPanels(prompt, theme),
      theme
    };
  }

  static async generatePDF(comicData: ComicData): Promise<Blob> {
    // For now, we'll create a simple PDF using browser APIs
    // In production, you'd want to use a proper PDF library
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
    
    comicData.panels.forEach((panel, index) => {
      const row = Math.floor(index / panelsPerRow);
      const col = index % panelsPerRow;
      const x = startX + col * (panelWidth + 50);
      const y = startY + row * (panelHeight + 100);
      
      // Draw panel border
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, panelWidth, panelHeight);
      
      // Add panel text
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
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob!);
      }, 'image/png');
    });
  }
}
