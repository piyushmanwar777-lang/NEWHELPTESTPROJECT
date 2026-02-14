import { NextRequest, NextResponse } from "next/server";
import { generateSceneDescription } from "@/lib/scene-generator";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { place } = body;

    if (!place) {
      return NextResponse.json(
        { error: "Place is required" },
        { status: 400 }
      );
    }

    // Generate scene description using Gemini
    const sceneDescription = await generateSceneDescription(place);

    // For now, return the description
    // You can integrate with an image generation API here (like Replicate, DALL-E, etc.)
    return NextResponse.json({ 
      sceneDescription,
      message: "Scene description generated. Image generation can be integrated here."
    }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/scene:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to generate scene: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate scene. Please try again." },
      { status: 500 }
    );
  }
}

