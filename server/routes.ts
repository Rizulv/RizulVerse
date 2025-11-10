// server/routes.ts
import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage"; // This now refers to our Firestore-based storage
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
    if (process.env.GEMINI_API_KEY) {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

      this.geminiProModel = this.genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
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

      this.geminiProVisionModel = this.genAI.getGenerativeModel({
        model: "gemini-1.5-pro-vision",
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
      this.simulationMode = true;
      console.warn("Running in simulation mode - no real AI responses will be generated");
    }
  }

  async generateStartupAnalysis(idea: string) {
    if (this.simulationMode || !this.geminiProModel) {
      return this.simulateStartupAnalysis(idea);
    }

    try {
      const prompt = `
        As an AI startup analyst, evaluate this business idea in detail.
        Idea: "${idea}"

        Provide a response in the following JSON format:
        {
          "analysis": "Your detailed analysis (2-3 sentences)",
          "marketFit": "A number from 1-100 representing market potential",
          "techStack": ["3-5 technologies suitable for implementing this idea"],
          "competitors": ["3-5 existing competitors or similar products"],
          "emoji": "A single emoji representing your overall sentiment"
        }
        Provide only the JSON with no extra text.
      `;

      const result = await this.geminiProModel.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const analysis = JSON.parse(jsonStr);
        if (typeof analysis.marketFit === "string") {
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
    return {
      analysis: `Developing an AI-driven ${idea.toLowerCase().includes('assistant') ? 'personal shopping assistant' : 'product'} has potential, but the market is competitive. Focus on creating a unique value proposition to stand out.`,
      marketFit: Math.floor(Math.random() * 30) + 50,
      techStack: [
        "React Native (Mobile App)",
        "Firebase (Backend + Auth)",
        "Gemini API (Product Recs)"
      ],
      competitors: [
        "Amazon Alexa Shopping",
        "Google Shopping",
        "ShopSense AI (startup)"
      ],
      emoji: ["🤔", "🚀", "💡", "⚠️"][Math.floor(Math.random() * 4)]
    };
  }

  async analyzeDesign(imageBase64?: string) {
    if (this.simulationMode || !this.geminiProVisionModel || !imageBase64) {
      return this.simulateDesignAnalysis();
    }

    try {
      const parts = [
        {
          text: `
            You are an expert UI/UX design critic. Analyze this design image and provide detailed feedback.
            Return your response in the following JSON format:
            {
              "title": "A catchy title summarizing your critique",
              "score": "A number from 1-10 representing overall design quality",
              "feedback": [
                {"type": "positive", "text": "Something good about the design"},
                {"type": "negative", "text": "A critical point for improvement"},
                {"type": "warning", "text": "A cautionary point about potential issues"}
              ],
              "suggestedFix": "A brief paragraph suggesting improvements"
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

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0];
        const analysis = JSON.parse(jsonStr);
        if (typeof analysis.score === "string") {
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
    const feedbackOptions = [
      { type: "negative", text: "Try a more subtle color palette" },
      { type: "warning", text: "Typography hierarchy needs work" },
      { type: "positive", text: "Layout structure is good, but needs more whitespace" },
      { type: "negative", text: "Contrast ratio fails accessibility standards" },
      { type: "warning", text: "Consider a more consistent button style" },
      { type: "positive", text: "Visual hierarchy guides user attention well" }
    ];
    
    const shuffled = [...feedbackOptions].sort(() => 0.5 - Math.random());
    const feedback = shuffled.slice(0, 3);
    
    return {
      title: "Yikes, that's a lot of gradients!",
      score: Math.floor(Math.random() * 6) + 2,
      feedback,
      suggestedFix: "Try using a monochromatic color scheme with a single accent color. Reduce the number of font styles and increase padding."
    };
  }

  async getPersonaResponse(message: string, persona: string) {
    if (this.simulationMode || !this.geminiProModel) {
      return this.simulatePersonaResponse(persona);
    }
    
    try {
      const personaDescriptions = {
        past: "You are my past self from 5 years ago, full of optimism yet inexperienced. Offer advice with youthful enthusiasm.",
        present: "You are my present self, providing balanced and practical insights based on current challenges.",
        future: "You are my future self from 5 years ahead, wise and reflective, offering guidance with foresight."
      };
      
      const selectedPersona = personaDescriptions[persona as keyof typeof personaDescriptions] || personaDescriptions.present;
      
      const prompt = `
        ${selectedPersona}
        
        My message: "${message}"
        
        Provide a thoughtful, conversational response in less than 150 words.
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
    const responses = {
      past: [
        "Remember when you were just starting out and full of hope? Those days, though uncertain, set you on an incredible journey.",
        "I used to worry about everything, but every mistake taught me something valuable.",
        "Back then, I was nervous but eager. Trust that the future holds growth."
      ],
      present: [
        "Your focus now is key; break tasks into small, achievable steps and keep moving forward.",
        "Facing challenges now shapes you. Stay pragmatic and celebrate small wins.",
        "The present is all about learning and adaptation. Keep your balance."
      ],
      future: [
        "Every risk you take today builds a brighter future. Continue pushing forward!",
        "Reflecting from the future, I can say that persistence pays off. Keep learning and evolving.",
        "I see your future as rich with achievements — every setback was a lesson."
      ]
    };

    const options = responses[persona as keyof typeof responses] || responses.present;
    return options[Math.floor(Math.random() * options.length)];
  }
}

// Create a singleton instance of the Gemini AI service
const geminiService = new GeminiAIService();

// -------------------------
// Register Routes
// -------------------------
export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Startup Lab API endpoint
  app.post("/api/startup/analyze", async (req: Request, res: Response) => {
    try {
      const { idea, userId } = req.body;
      if (!idea || typeof idea !== "string" || idea.trim() === "") {
        return res.status(400).json({ error: "Please provide a valid startup idea" });
      }

      const analysis = await geminiService.generateStartupAnalysis(idea);

      // Save the analysis in Firestore (if userId is provided)
      if (userId) {
        await storage.createStartupAnalysis({
          userId,
          idea,
          analysis: analysis.analysis,
          marketFit: analysis.marketFit,
          techStack: analysis.techStack,
          competitors: analysis.competitors,
          emoji: analysis.emoji,
          createdAt: new Date(),
        });
      }

      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing startup idea:", error);
      res.status(500).json({ error: "Failed to analyze startup idea" });
    }
  });

  // Design Roast API endpoint
  app.post("/api/design/roast", async (req: Request, res: Response) => {
    try {
      const { imageData, userId } = req.body; // Base64-encoded image string
      const roast = await geminiService.analyzeDesign(imageData);

      // If userId provided, you can store this roast in Firestore
      if (userId) {
        // For example: await storage.createDesignRoast({ userId, imageUrl: savedImageUrl, ...roast, createdAt: new Date() });
      }

      res.json(roast);
    } catch (error) {
      console.error("Error roasting design:", error);
      res.status(500).json({ error: "Failed to analyze design" });
    }
  });

  // Time Portal API endpoint
  app.post("/api/chat/persona", async (req: Request, res: Response) => {
    try {
      const { message, persona, userId } = req.body;
      if (!message || typeof message !== "string" || message.trim() === "") {
        return res.status(400).json({ error: "Please provide a message" });
      }
      
      if (!persona || !["past", "present", "future"].includes(persona)) {
        return res.status(400).json({ error: "Please provide a valid persona (past, present, future)" });
      }

      const responseText = await geminiService.getPersonaResponse(message, persona);

      // Optionally save chat message to Firestore if userId is provided
      if (userId) {
        await storage.createChatMessage({
          userId,
          sender: persona,
          message: responseText,
          timestamp: new Date(),
        });
      }

      res.json({ response: responseText });
    } catch (error) {
      console.error("Error generating persona response:", error);
      res.status(500).json({ error: "Failed to generate response" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
