import { NextRequest, NextResponse } from "next/server";
import { generateStory } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { destination } = body;

    if (!destination) {
      return NextResponse.json(
        { error: "Destination is required" },
        { status: 400 }
      );
    }

    // Validate destination
    const validDestinations = ["river", "land", "sky", "mountain", "space"];
    if (!validDestinations.includes(destination)) {
      return NextResponse.json(
        { error: "Invalid destination" },
        { status: 400 }
      );
    }

    // Generate the story
    const story = await generateStory(destination);

    return NextResponse.json({ story }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/story:", error);
    
    // Log full error details for debugging
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      
      // Check if it's an API key error
      if (error.message.includes("GEMINI_API_KEY")) {
        return NextResponse.json(
          { error: "Gemini API key not configured. Please set GEMINI_API_KEY in your environment variables." },
          { status: 500 }
        );
      }
      
      // Return more specific error message
      return NextResponse.json(
        { error: `Failed to generate story: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate story. Please try again." },
      { status: 500 }
    );
  }
}

