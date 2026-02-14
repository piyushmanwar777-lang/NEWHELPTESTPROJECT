import { GoogleGenerativeAI } from "@google/generative-ai";

// NOTE: Gemini is now ONLY used for image prompt generation
// Story generation has been removed from the flow

// Initialize Gemini AI (for image prompts only)
export function getGeminiModel() {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Try gemini-1.5-flash first (newer, faster model)
  try {
    return genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  } catch (error) {
    // Fallback to gemini-1.5-pro
    try {
      return genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    } catch (error2) {
      // Last resort: try without version number
      return genAI.getGenerativeModel({ model: "gemini-pro" });
    }
  }
}

// DEPRECATED: Story generation is no longer used
// This function is kept for backward compatibility but should not be called
export async function generateStory(destination: string): Promise<string> {
  console.warn("generateStory is deprecated. Use image prompt generation instead.");
  
  // Return a simple fallback message instead of generating
  const destinationNames: Record<string, string> = {
    river: "a peaceful river",
    land: "beautiful landscapes",
    sky: "the endless sky",
    mountain: "majestic mountains",
    space: "the vast cosmos",
  };

  const destinationName = destinationNames[destination] || destination;
  
  return `They embark on their journey to ${destinationName}, hand in hand, hearts full of hope and love. Every moment together is a treasure, every step forward a new adventure.`;
}
