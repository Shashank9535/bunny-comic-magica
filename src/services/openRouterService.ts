
import OpenAI from 'openai';

export class OpenRouterService {
  private static readonly openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: "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",
    defaultHeaders: {
      "HTTP-Referer": window.location.origin,
      "X-Title": "Bunny Comic Generator",
    },
  });

  static async generatePersonalizedStory(
    imageCaption: string, 
    theme: string, 
    userPrompt: string
  ): Promise<string[]> {
    try {
      console.log('Generating personalized story with:', { imageCaption, theme, userPrompt });
      
      const storyPrompt = `Create a six-panel comic story for a child. Their description is: ${imageCaption}. Theme is: ${theme}. User's idea: ${userPrompt}. Make it imaginative, magical, and child-friendly. 

Return exactly 6 panel descriptions, each starting with "Panel X:" where X is the panel number. Each panel should be one sentence that describes what happens in that scene, featuring the child as the main character.

Example format:
Panel 1: [description]
Panel 2: [description]
Panel 3: [description]
Panel 4: [description]
Panel 5: [description]
Panel 6: [description]`;

      const completion = await this.openai.chat.completions.create({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          {
            role: "user",
            content: storyPrompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1000,
      });

      const storyText = completion.choices[0]?.message?.content || '';
      console.log('Generated story:', storyText);
      
      // Parse the story into panel descriptions
      const panels = this.parseStoryIntoPanels(storyText);
      return panels;
      
    } catch (error) {
      console.error('OpenRouter story generation failed:', error);
      // Return fallback story
      return this.getFallbackStory(imageCaption, theme);
    }
  }

  private static parseStoryIntoPanels(storyText: string): string[] {
    const panels: string[] = [];
    const lines = storyText.split('\n');
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('Panel ') && trimmedLine.includes(':')) {
        const panelContent = trimmedLine.split(':').slice(1).join(':').trim();
        if (panelContent) {
          panels.push(panelContent);
        }
      }
    }
    
    // Ensure we have exactly 6 panels
    while (panels.length < 6) {
      panels.push(`The adventure continues with excitement and wonder`);
    }
    
    return panels.slice(0, 6);
  }

  private static getFallbackStory(imageCaption: string, theme: string): string[] {
    return [
      `${imageCaption} begins an amazing ${theme} adventure`,
      `Discovering magical secrets and making new friends`,
      `Facing challenges with courage and determination`,
      `Learning important lessons along the way`,
      `Using newfound powers to help others`,
      `Returning home as a true hero with wonderful memories`
    ];
  }
}
