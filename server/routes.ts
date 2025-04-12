import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { GoogleGenerativeAI, GenerativeModel, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Initialize Gemini API
if (!process.env.GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY not set. Using simulation mode for AI responses.");
}

// Real Gemini AI Service that uses the Google Generative AI
class GeminiAIService {
  private genAI: GoogleGenerativeAI | null = null;
  private geminiProModel: GenerativeModel | null = null;
  private geminiProVisionModel: GenerativeModel | null = null;
  private simulationMode: boolean = false;

  constructor() {
    // Initialize the Gemini API if the key is available
    if (process.env.GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      
      // Create text-only model
      this.geminiProModel = this.genAI.getGenerativeModel({
        model: "gemini-pro",
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      });
      
      // Create multimodal model for images
      this.geminiProVisionModel = this.genAI.getGenerativeModel({
        model: "gemini-pro-vision",
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      });
    } else {
      // If no API key, use simulation mode
      this.simulationMode = true;
      console.warn("Running in simulation mode - no real AI responses will be generated");
    }
  }

  async generateStartupAnalysis(idea: string) {
    if (this.simulationMode || !this.geminiProModel) {
      return this.simulateStartupAnalysis(idea);
    }
    
    try {
      // Construct a prompt for the startup analysis
      const prompt = `
        As an AI startup analyst, evaluate this business idea in detail.
        Idea: "${idea}"
        
        Provide a response in the following JSON format:
        {
          "analysis": "Your detailed analysis of the idea and its potential (2-3 sentences)",
          "marketFit": "A number from 1-100 representing the market fit potential",
          "techStack": ["3-5 technologies that would be suitable for implementing this idea"],
          "competitors": ["3-5 existing competitors or similar products"],
          "emoji": "A single emoji that represents your overall sentiment about this idea"
        }
        
        Make the response realistic, insightful and constructive. Provide only the JSON with no additional text.
      `;

      const result = await this.geminiProModel.generateContent(prompt);
      const response = result.response;
      const text = response.text();
      
      // Extract the JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const analysis = JSON.parse(jsonStr);
        
        // Ensure marketFit is a number
        if (typeof analysis.marketFit === 'string') {
          analysis.marketFit = parseInt(analysis.marketFit);
        }
        
        return analysis;
      } else {
        console.error("Failed to parse JSON from Gemini response:", text);
        return this.simulateStartupAnalysis(idea);
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      return this.simulateStartupAnalysis(idea);
    }
  }

  private simulateStartupAnalysis(idea: string) {
    // Fallback simulation when API is unavailable
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

  async analyzeDesign(imageBase64?: string) {
    if (this.simulationMode || !this.geminiProVisionModel || !imageBase64) {
      return this.simulateDesignAnalysis();
    }
    
    try {
      // Create the parts with the image for multimodal input
      const parts = [
        {
          text: `
            You are an expert UI/UX design critic. Analyze this design image and provide detailed feedback.
            Return your response in the following JSON format:
            {
              "title": "A catchy, sometimes humorous title that summarizes your critique",
              "score": "A number from 1-10 representing the overall design quality",
              "feedback": [
                {"type": "positive", "text": "Something good about the design"},
                {"type": "negative", "text": "A critical point that needs improvement"},
                {"type": "warning", "text": "A cautionary point about potential issues"}
              ],
              "suggestedFix": "A brief paragraph suggesting how to improve the design"
            }
            Provide only the JSON with no additional text.
          `
        },
        {
          inlineData: {
            mimeType: "image/jpeg",
            data: imageBase64
          }
        }
      ];
      
      const result = await this.geminiProVisionModel.generateContent(parts);
      const response = result.response;
      const text = response.text();
      
      // Extract the JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const analysis = JSON.parse(jsonStr);
        
        // Ensure score is a number
        if (typeof analysis.score === 'string') {
          analysis.score = parseInt(analysis.score);
        }
        
        return analysis;
      } else {
        console.error("Failed to parse JSON from Gemini response:", text);
        return this.simulateDesignAnalysis();
      }
    } catch (error) {
      console.error("Error calling Gemini Vision API:", error);
      return this.simulateDesignAnalysis();
    }
  }

  private simulateDesignAnalysis() {
    // Fallback simulation when API is unavailable
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
    if (this.simulationMode || !this.geminiProModel) {
      return this.simulatePersonaResponse(persona);
    }
    
    try {
      // Construct a prompt for the time-portal persona
      const personaDescriptions = {
        past: "You are my past self from 5 years ago, when I was just starting out in my career. You're optimistic but inexperienced. You offer advice from a younger perspective, often with enthusiasm but limited by less experience.",
        present: "You are my present self. You offer balanced, practical advice based on my current situation. You are thoughtful and pragmatic, focusing on immediate actions I can take.",
        future: "You are my future self from 5 years in the future. You've gained wisdom and perspective. You offer advice based on what you know 'will happen' and what choices turned out to be important."
      };
      
      const selectedPersona = personaDescriptions[persona as keyof typeof personaDescriptions] || personaDescriptions.present;
      
      const prompt = `
        ${selectedPersona}
        
        My message to you: "${message}"
        
        Provide a thoughtful response from this persona's perspective. Keep your response under 150 words, conversational, and focused on providing perspective and advice that matches how this time-based version of me would respond.
      `;

      const result = await this.geminiProModel.generateContent(prompt);
      const response = result.response;
      return response.text();
    } catch (error) {
      console.error("Error calling Gemini API for persona:", error);
      return this.simulatePersonaResponse(persona);
    }
  }

  private simulatePersonaResponse(persona: string) {
    // Fallback simulation when API is unavailable
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
      
      // Store in database if there's a user (for now, just return directly)
      // In a real app with auth, we would associate with the current user
      // const savedAnalysis = await storage.createStartupAnalysis({
      //   userId: req.user?.id,
      //   idea,
      //   ...analysis
      // });
      
      res.json(analysis);
    } catch (error) {
      console.error('Error analyzing startup idea:', error);
      res.status(500).json({ error: 'Failed to analyze startup idea' });
    }
  });

  // Design Roast API endpoint
  app.post('/api/design/roast', async (req: Request, res: Response) => {
    try {
      // Get the image data from the request
      const { imageData } = req.body; // Base64 encoded image
      
      // In a real implementation with auth, we would save the image to storage
      // then call the Gemini Vision API with the image URL
      const roast = await geminiService.analyzeDesign(imageData);
      
      // Store in database (not implementing here for simplicity)
      // const savedRoast = await storage.createDesignRoast({
      //   userId: req.user?.id,
      //   imageUrl: savedImageUrl, // We'd save the image first
      //   ...roast
      // });
      
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
      
      // Store in database in a real app with auth
      // const savedMessage = await storage.createChatMessage({
      //   userId: req.user?.id,
      //   sender: persona,
      //   message: response
      // });
      
      res.json({ response });
    } catch (error) {
      console.error('Error generating persona response:', error);
      res.status(500).json({ error: 'Failed to generate response' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
