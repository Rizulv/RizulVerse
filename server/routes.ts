import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Gemini API would be implemented here in a real application
// This is a simulated implementation using hardcoded responses
class GeminiAIService {
  async generateStartupAnalysis(idea: string) {
    // Simulate Gemini API call response
    return {
      analysis: `Developing an AI-driven ${idea.toLowerCase().includes('assistant') ? 'personal shopping assistant' : 'product'} has potential, but the market is competitive. Focus on creating a unique value proposition to stand out.`,
      marketFit: Math.floor(Math.random() * 30) + 50, // Random score between 50-80
      techStack: [
        'React Native (Mobile App)',
        'Firebase (Backend + Auth)',
        'Gemini API (Product Recs)'
      ],
      competitors: [
        'Amazon Alexa Shopping',
        'Google Shopping',
        'ShopSense AI (startup)'
      ],
      emoji: ['🤔', '🚀', '💡', '⚠️'][Math.floor(Math.random() * 4)] // Random emoji
    };
  }

  async analyzeDesign() {
    // Simulate Gemini Vision API for image analysis
    const feedbackOptions = [
      { type: 'negative', text: 'Try a more subtle color palette' },
      { type: 'warning', text: 'The typography hierarchy needs work - too many competing font styles' },
      { type: 'positive', text: 'Layout structure is good, but needs more whitespace between elements' },
      { type: 'negative', text: 'The contrast ratio fails accessibility standards' },
      { type: 'warning', text: 'Consider a more consistent button style throughout the interface' },
      { type: 'positive', text: 'The visual hierarchy guides the user attention well' }
    ];
    
    // Select 3 random feedback items
    const shuffled = [...feedbackOptions].sort(() => 0.5 - Math.random());
    const feedback = shuffled.slice(0, 3);
    
    return {
      title: "Yikes, that's a lot of gradients!",
      score: Math.floor(Math.random() * 6) + 2, // Random score between 2-7
      feedback,
      suggestedFix: 'Try using a monochromatic color scheme with a single accent color. Reduce the number of font styles to 2 at most, and increase padding between elements by 1.5x.'
    };
  }

  async getPersonaResponse(message: string, persona: string) {
    // Simulate different persona responses
    const responses = {
      past: [
        "Remember when you were just starting out and full of hope? Those days were filled with excitement but also uncertainty. Don't worry, your path gets clearer.",
        "Back then, I was always worried about imposter syndrome. Looking at your question, I think you might be feeling that too. It's normal, but trust me, you belong here.",
        "I used to overthink every decision. My advice? Just start building things - that's how you learn fastest."
      ],
      present: [
        "I understand your concerns. The key is to break down your goals into smaller, manageable tasks. Focus on one thing at a time and celebrate small victories.",
        "Right now, I'm also learning to balance multiple priorities. Let's take this step by step and not overwhelm ourselves.",
        "The present moment is where growth happens. Your question shows you're aware of the challenges - that's already half the battle."
      ],
      future: [
        "Looking back, the times when you pushed through difficulty were the most important growth moments. Keep going - it all contributes to your success journey!",
        "From my perspective now, those early struggles shaped everything. The project you're working on now will teach you skills you'll use for years.",
        "Trust me, future you won't regret taking risks and trying new technologies. The only regrets are the projects you didn't start."
      ]
    };
    
    // Select random response based on persona
    const options = responses[persona as keyof typeof responses] || responses.present;
    return options[Math.floor(Math.random() * options.length)];
  }
}

// Create a singleton instance of the service
const geminiService = new GeminiAIService();

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Startup Lab API endpoint
  app.post('/api/startup/analyze', async (req: Request, res: Response) => {
    try {
      const { idea } = req.body;
      
      if (!idea || typeof idea !== 'string' || idea.trim() === '') {
        return res.status(400).json({ error: 'Please provide a valid startup idea' });
      }
      
      // Generate analysis using the Gemini service
      const analysis = await geminiService.generateStartupAnalysis(idea);
      res.json(analysis);
    } catch (error) {
      console.error('Error analyzing startup idea:', error);
      res.status(500).json({ error: 'Failed to analyze startup idea' });
    }
  });

  // Design Roast API endpoint
  app.post('/api/design/roast', async (req: Request, res: Response) => {
    try {
      // In a real implementation, this would process an uploaded image
      // and send it to Gemini Vision API
      const roast = await geminiService.analyzeDesign();
      res.json(roast);
    } catch (error) {
      console.error('Error roasting design:', error);
      res.status(500).json({ error: 'Failed to analyze design' });
    }
  });

  // Time Portal API endpoint
  app.post('/api/chat/persona', async (req: Request, res: Response) => {
    try {
      const { message, persona } = req.body;
      
      if (!message || typeof message !== 'string' || message.trim() === '') {
        return res.status(400).json({ error: 'Please provide a message' });
      }
      
      if (!persona || !['past', 'present', 'future'].includes(persona)) {
        return res.status(400).json({ error: 'Please provide a valid persona (past, present, future)' });
      }
      
      // Get response from the appropriate persona
      const response = await geminiService.getPersonaResponse(message, persona);
      res.json({ response });
    } catch (error) {
      console.error('Error generating persona response:', error);
      res.status(500).json({ error: 'Failed to generate response' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
