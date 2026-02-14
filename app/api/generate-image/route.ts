import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Increase timeout for image generation (Hugging Face can take 60+ seconds)
export const maxDuration = 120; // 2 minutes (Vercel Pro plan allows up to 300s)
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      boyImageUrl, 
      girlImageUrl,
      dreamDestination,
      timeOfDay,
      mood,
      activity,
      weather,
      outfitStyle,
      specialEffect
    } = body;

    if (!boyImageUrl || !girlImageUrl) {
      return NextResponse.json(
        { error: "Both boy and girl image URLs are required" },
        { status: 400 }
      );
    }

    if (!dreamDestination || !timeOfDay || !mood || !activity || !weather || !outfitStyle || !specialEffect) {
      return NextResponse.json(
        { error: "All 7 answers are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set in environment variables" },
        { status: 500 }
      );
    }

    // Build dynamic prompt using all 7 answers (exact format as specified)
    const imagePrompt = `Create a romantic cinematic illustration of a couple.

The man must look like the boy photo provided.
The woman must look like the girl photo provided.

They are together at: ${dreamDestination}
Mood: ${mood}
Time: ${timeOfDay}
Activity: ${activity}
Weather: ${weather}
Outfits: ${outfitStyle}
Special effect: ${specialEffect}

Pixar / Disney style.
Full body.
Beautiful lighting.
High quality.`;

    // Use Gemini to generate the image
    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Convert base64 image URLs to image parts for Gemini
    const convertBase64ToImagePart = (base64String: string) => {
      // Remove data URL prefix if present
      const base64Data = base64String.includes(',') 
        ? base64String.split(',')[1] 
        : base64String;
      
      // Detect MIME type
      let mimeType = 'image/jpeg';
      if (base64String.startsWith('data:image/png')) mimeType = 'image/png';
      else if (base64String.startsWith('data:image/jpeg') || base64String.startsWith('data:image/jpg')) mimeType = 'image/jpeg';
      else if (base64String.startsWith('data:image/webp')) mimeType = 'image/webp';
      
      return {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      };
    };

    // Prepare image parts
    const boyImagePart = convertBase64ToImagePart(boyImageUrl);
    const girlImagePart = convertBase64ToImagePart(girlImageUrl);

    // Try different Gemini models
    const modelNames = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
    let generatedImageUrl = null;
    let lastError: Error | null = null;

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // Send prompt with uploaded images to Gemini
        // Note: Gemini can analyze images but may not generate them directly
        // We'll try to use Gemini's multimodal capabilities
        const result = await model.generateContent([
          imagePrompt,
          boyImagePart,
          girlImagePart
        ]);

        const response = await result.response;
        const responseText = response.text();
        
        // Check if response contains image data or URL
        // Try to extract base64 image from response
        const base64Match = responseText.match(/data:image\/[^;]+;base64,([^\s"']+)/);
        if (base64Match) {
          generatedImageUrl = base64Match[0];
          break;
        }
        
        // Try to extract image URL from response
        const urlMatch = responseText.match(/https?:\/\/[^\s"']+\.(jpg|jpeg|png|webp)/i);
        if (urlMatch) {
          generatedImageUrl = urlMatch[0];
          break;
        }
        
        // If Gemini doesn't return an image directly, we need to use an image generation API
        // Since Gemini is primarily a text model, we'll need to use Google's Imagen API
        // or another image generation service
        
        // For now, return an error indicating we need a proper image generation service
        console.warn(`Model ${modelName} did not return an image. Gemini may not support direct image generation.`);
        continue;
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.error(`Model ${modelName} failed:`, error);
        continue;
      }
    }

    // If Gemini doesn't return an image, use Hugging Face's free Stable Diffusion API
    // This is a free alternative that can actually generate images
    if (!generatedImageUrl) {
      // Retry logic for Hugging Face API (handles cold starts and rate limits)
      const maxRetries = 5; // Increased retries
      let retryCount = 0;
      let hfError: Error | null = null;
      let lastEstimatedTime = 0;

      while (retryCount < maxRetries && !generatedImageUrl) {
        try {
          console.log(`Hugging Face API attempt ${retryCount + 1}/${maxRetries}...`);
          
          // Use Hugging Face's free Stable Diffusion API
          // Try multiple models - some load faster than others
          const models = [
            "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1",
            "https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
            "https://api-inference.huggingface.co/models/CompVis/stable-diffusion-v1-4"
          ];
          
          const modelUrl = models[retryCount % models.length];
          console.log(`Trying model: ${modelUrl}`);
          
          const hfResponse = await fetch(
            modelUrl,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                inputs: imagePrompt,
              }),
              // Increase timeout
              signal: AbortSignal.timeout(120000) // 2 minutes timeout
            }
          );

          const contentType = hfResponse.headers.get('content-type') || '';
          
          if (hfResponse.ok && contentType.startsWith('image/')) {
            // Success! We got an image
            const imageBlob = await hfResponse.blob();
            const arrayBuffer = await imageBlob.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64Image = buffer.toString('base64');
            const mimeType = imageBlob.type || 'image/png';
            generatedImageUrl = `data:${mimeType};base64,${base64Image}`;
            console.log("Image generated successfully!");
            break; // Success!
          } else {
            // Handle error response
            const status = hfResponse.status;
            let errorText = '';
            
            try {
              errorText = await hfResponse.text();
            } catch (e) {
              errorText = `HTTP ${status}`;
            }
            
            console.log(`Hugging Face API response: ${status} - ${errorText.substring(0, 200)}`);
            
            if (status === 503) {
              // Model is loading - parse estimated time
              try {
                const errorData = JSON.parse(errorText);
                const estimatedTime = errorData.estimated_time || 40; // Default to 40s if not provided
                lastEstimatedTime = estimatedTime;
                
                console.log(`Model loading, estimated time: ${estimatedTime}s. Waiting...`);
                
                // Wait for estimated time + 10 second buffer
                const waitTime = (estimatedTime + 10) * 1000;
                await new Promise(resolve => setTimeout(resolve, waitTime));
                
                retryCount++;
                continue; // Retry after waiting
              } catch (parseError) {
                // If we can't parse, wait a fixed time based on retry count
                const waitTime = Math.min(30000 + (retryCount * 10000), 60000); // 30s to 60s
                console.log(`Could not parse error, waiting ${waitTime/1000}s...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
                retryCount++;
                continue;
              }
            } else if (status === 429) {
              // Rate limited - wait longer
              const waitTime = 60000; // 60 seconds
              console.log(`Rate limited, waiting ${waitTime/1000}s...`);
              await new Promise(resolve => setTimeout(resolve, waitTime));
              retryCount++;
              continue;
            } else if (status === 200 && contentType.includes('application/json')) {
              // Sometimes HF returns JSON even on 200 - might be an error
              try {
                const jsonData = JSON.parse(errorText);
                if (jsonData.error) {
                  hfError = new Error(jsonData.error);
                  break;
                }
              } catch (e) {
                // Not JSON, might be HTML or other
                hfError = new Error(`Unexpected response format: ${errorText.substring(0, 100)}`);
                break;
              }
            } else {
              // Other error
              hfError = new Error(`Hugging Face API error (${status}): ${errorText.substring(0, 200)}`);
              
              // For 500 errors, retry with delay
              if (status >= 500 && retryCount < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                retryCount++;
                continue;
              }
              break;
            }
          }
        } catch (fetchError) {
          hfError = fetchError instanceof Error ? fetchError : new Error(String(fetchError));
          console.error("Hugging Face API fetch error:", fetchError);
          
          // If it's a timeout or network error, retry after a delay
          if (retryCount < maxRetries - 1) {
            const waitTime = 10000 * (retryCount + 1); // 10s, 20s, 30s...
            console.log(`Network error, waiting ${waitTime/1000}s before retry...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
            retryCount++;
            continue;
          }
          break;
        }
      }

      // If all retries failed
      if (!generatedImageUrl) {
        const errorMessage = lastEstimatedTime > 0
          ? `The image generation model is still loading (estimated ${lastEstimatedTime}s). Please wait a moment and try again.`
          : "Image generation service is temporarily unavailable. Please try again in a few moments.";
        
        return NextResponse.json({
          error: errorMessage,
          prompt: imagePrompt,
          details: hfError?.message || "All retry attempts failed. The Hugging Face model may need more time to load.",
          retries: retryCount
        }, { status: 503 });
      }
    }

    // If still no image, return error
    if (!generatedImageUrl) {
      return NextResponse.json({
        error: "Failed to generate image. Please check your API configuration.",
        prompt: imagePrompt,
        details: "No image was generated from either Gemini or Imagen API"
      }, { status: 500 });
    }

    // Return the generated image
    return NextResponse.json({
      imageUrl: generatedImageUrl,
      prompt: imagePrompt,
      message: "Image generated successfully"
    }, { status: 200 });

  } catch (error) {
    console.error("Error in /api/generate-image:", error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to generate image: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate image. Please try again." },
      { status: 500 }
    );
  }
}
