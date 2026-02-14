import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { place, sceneNumber } = body;

    if (!place) {
      return NextResponse.json(
        { error: "Place is required" },
        { status: 400 }
      );
    }

    const sceneNum = sceneNumber || 1;

    // Scene-specific descriptions
    const sceneDescriptions: Record<number, string> = {
      1: "arriving together",
      2: "walking hand in hand",
      3: "enjoying view",
      4: "romantic close moment",
    };

    const sceneDescription = sceneDescriptions[sceneNum] || "traveling together";

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set in environment variables");
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const prompt = `Create a SHORT, VISUAL-FOCUSED AI image generation prompt (50-80 words max).

Setting: ${place}
Scene Number: ${sceneNumber || 1}

CRITICAL REQUIREMENTS (MUST INCLUDE ALL):
1. Style: cartoon style, cute animated couple
2. Colors: soft pastel colors
3. Mood: romantic
4. Quality: high quality
5. Characters: consistent character appearance
   - Boy: young man, medium skin tone, dark hair, neat mustache and goatee, warm expression
   - Girl: young woman, traveling companion, showing affection
6. Scene: romantic travel scene in ${place}
7. Action: ${sceneDescription} (this is the specific scene action)
8. Pose: couple together, showing affection based on the scene action

OUTPUT FORMAT:
- Short and concise (50-80 words)
- Visual-focused (describe what you see, not emotions)
- MUST include: "cartoon style", "cute animated couple", "soft pastel colors", "romantic", "high quality", "consistent character appearance"
- Include: characters, location, style, pose, colors
- NO long descriptions or emotional text
- Direct, action-oriented language

Example format: "Cartoon style, cute animated couple (boy with dark hair and mustache, girl) ${sceneDescription} in [place], soft pastel colors, romantic scene, high quality, consistent character appearance, [specific visual details]"`;

    // Try models in order
    const modelNames = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
    let lastError: Error | null = null;
    
    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const generatedPrompt = response.text();
        
        // Ensure the prompt always includes the required elements (keep it short)
        const finalPrompt = generatedPrompt.length > 200 
          ? generatedPrompt.substring(0, 200) 
          : generatedPrompt;
        
        return NextResponse.json({ 
          prompt: finalPrompt,
          place,
          sceneNumber: sceneNum
        }, { status: 200 });
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        continue;
      }
    }
    
    // Fallback prompt if all models fail (short and visual-focused)
    const fallbackPrompt = `Cartoon style, cute animated couple (boy with dark hair and mustache, girl) ${sceneDescription} in ${place}, soft pastel colors, romantic, high quality, consistent character appearance`;
    
    return NextResponse.json({ 
      prompt: fallbackPrompt,
      place,
      sceneNumber: sceneNum
    }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/image-prompt:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to generate image prompt: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate image prompt. Please try again." },
      { status: 500 }
    );
  }
}

