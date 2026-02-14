import { GoogleGenerativeAI } from "@google/generative-ai";

// Generate a detailed scene description for image generation
export async function generateSceneDescription(place: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in environment variables");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  const prompt = `Create a detailed, cinematic scene description for a romantic image generation prompt. 

Setting: A young couple is traveling together in ${place}

Style Requirements:
- Pixar + Studio Ghibli animation style
- Romantic and dreamy atmosphere
- Cinematic lighting with soft, warm colors
- High quality, detailed
- The couple should be together, showing affection
- Soft, pastel color palette
- Magical, whimsical feeling

Generate a detailed visual description (150-200 words) that can be used for image generation. Focus on:
- The location and environment details
- How the couple looks and their poses (they are together, showing love)
- The lighting and atmosphere
- The overall mood and feeling
- Visual details that capture the romantic, cinematic quality

Make it vivid and descriptive, suitable for creating a beautiful animated-style romantic scene.`;

  // Try models in order
  const modelNames = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
  let lastError: Error | null = null;
  
  for (const modelName of modelNames) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      continue;
    }
  }
  
  // Fallback description
  return `A romantic, dreamy scene in ${place}. A young couple stands together, holding hands, with soft cinematic lighting. The style is Pixar and Studio Ghibli inspired, with warm pastel colors, magical atmosphere, and detailed animation-quality rendering. The couple shows affection, surrounded by the beautiful environment of ${place}. Soft, golden hour lighting creates a romantic, cinematic mood.`;
}

