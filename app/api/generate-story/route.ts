import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      dreamDestination,
      timeOfDay,
      mood,
      activity,
      weather,
      outfitStyle,
      specialEffect,
      language = "english"
    } = body;

    // Validate all 7 answers are provided
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

    const genAI = new GoogleGenerativeAI(apiKey);
    
    // Determine language and create appropriate prompt
    const languageMap: Record<string, string> = {
      english: "English",
      hindi: "Hindi (हिंदी)",
      marathi: "Marathi (मराठी)"
    };
    
    const targetLanguage = languageMap[language] || "English";
    
    // Create a romantic story based on all 7 answers
    const isHindi = language === "hindi";
    const isMarathi = language === "marathi";
    const scriptNote = (isHindi || isMarathi) ? " Use Devanagari script (देवनागरी लिपी)." : "";
    
    const storyPrompt = `You MUST write a beautiful, romantic, and emotional love story COMPLETELY in ${targetLanguage} language${scriptNote}

CRITICAL REQUIREMENTS:
1. Write EVERY SINGLE WORD in ${targetLanguage} - NO English words, NO mixing languages
2. Length: 3-4 paragraphs, approximately 300-400 words
3. ${isHindi || isMarathi ? "Use Devanagari script (देवनागरी) for all text" : "Use standard English script"}
4. Do NOT include any English text, translations, or explanations

The story should be about a couple experiencing a magical moment together with these details:

- Location: ${dreamDestination}
- Time: ${timeOfDay}
- Mood: ${mood}
- Activity: ${activity}
- Weather: ${weather}
- Outfit Style: ${outfitStyle}
- Special Effect: ${specialEffect}

Story Requirements:
- Write 100% in ${targetLanguage} language ONLY
- Use first person or third person narrative style
- Make it romantic, dreamy, and cinematic
- Include vivid descriptions of the setting and atmosphere
- Show the couple's emotions and connection
- Make it feel like a scene from a romantic movie
- Use beautiful, poetic language appropriate for ${targetLanguage}
- End on a hopeful, romantic note
- The story should flow naturally and create a vivid, immersive experience

REMEMBER: Write ONLY in ${targetLanguage}. Do NOT use English. Do NOT mix languages. Every single word must be in ${targetLanguage}.`;

    // Try different model name variations
    const modelNames = [
      "gemini-pro",           // Older model name
      "gemini-1.0-pro",      // Version 1.0
      "gemini-1.5-flash-001", // With version suffix
      "gemini-1.5-flash"      // Current model
    ];
    
    let lastError: Error | null = null;
    
    for (const modelName of modelNames) {
      try {
        console.log(`Trying model: ${modelName}`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(storyPrompt);
        const response = await result.response;
        const story = response.text();
        
        if (story && story.trim().length > 0) {
          console.log(`Successfully generated story with ${modelName}`);
          return NextResponse.json({ story: story.trim() }, { status: 200 });
        } else {
          throw new Error("Generated story is empty");
        }
      } catch (error: any) {
        console.error(`Error with model ${modelName}:`, error?.message || error);
        lastError = error;
        // Try next model
        continue;
      }
    }
    
    // If all models failed, generate a fallback story
    console.warn("All Gemini models failed, generating fallback story");
    const fallbackStory = generateFallbackStory({
      dreamDestination,
      timeOfDay,
      mood,
      activity,
      weather,
      outfitStyle,
      specialEffect,
      language
    });
    
    return NextResponse.json({ story: fallbackStory }, { status: 200 });
    
  } catch (error: any) {
    console.error("Error generating story:", error);
    
    // Even if there's an error, try to generate a fallback story
    try {
      const fallbackStory = generateFallbackStory({
        dreamDestination: body.dreamDestination || "a beautiful place",
        timeOfDay: body.timeOfDay || "evening",
        mood: body.mood || "romantic",
        activity: body.activity || "walking together",
        weather: body.weather || "clear skies",
        outfitStyle: body.outfitStyle || "elegant",
        specialEffect: body.specialEffect || "starlight",
        language: body.language || "english"
      });
      return NextResponse.json({ story: fallbackStory }, { status: 200 });
    } catch (fallbackError) {
      return NextResponse.json(
        { 
          error: error?.message || "Failed to generate story. Please try again.",
          details: process.env.NODE_ENV === "development" ? error?.stack : undefined
        },
        { status: 500 }
      );
    }
  }
}

// Fallback story generator (used when API fails)
function generateFallbackStory(answers: {
  dreamDestination: string;
  timeOfDay: string;
  mood: string;
  activity: string;
  weather: string;
  outfitStyle: string;
  specialEffect: string;
  language?: string;
}): string {
  const language = answers.language || "english";
  
  // Hindi stories
  if (language === "hindi") {
    const timeDescriptions: Record<string, string> = {
      morning: "सुबह की सुनहरी रोशनी",
      sunset: "सूर्यास्त की गर्म रोशनी",
      night: "रात के जादुई पल"
    };
    
    const moodDescriptions: Record<string, string> = {
      romantic: "रोमांटिक और कोमल",
      cozy: "आरामदायक और अंतरंग",
      fun: "मजेदार और खुश",
      magical: "जादुई और मनमोहक"
    };
    
    const timeDesc = timeDescriptions[answers.timeOfDay] || answers.timeOfDay;
    const moodDesc = moodDescriptions[answers.mood] || answers.mood;
    
    return `${answers.dreamDestination} में, ${timeDesc} के नीचे, दो दिल एक पल में मिले जो सब कुछ बदल देगा। ${moodDesc} माहौल ने उन्हें घेर लिया जब वे ${answers.activity} कर रहे थे, हमेशा के लिए यादें बना रहे थे।

${answers.weather} मौसम ने सही सेटिंग में जोड़ दिया, ${answers.specialEffect} उनके चारों ओर नृत्य कर रहे थे जैसे प्रकृति उनके प्यार का जश्न मना रही हो। ${answers.outfitStyle} पोशाक में सजे, वे एक साथ सहजता से चल रहे थे, हर पल पिछले से अधिक सुंदर।

जैसे-जैसे वे अपनी यात्रा जारी रखते, उन्हें पता था कि यह उनकी कहानी की शुरुआत थी। हर कदम, हर नज़र, हर साझा मुस्कान एक वादा था उस सुंदर भविष्य का जो आगे था। उस पल में, ${answers.dreamDestination} के जादू से घिरे, उन्हें न केवल एक-दूसरे को मिला, बल्कि हमेशा के लिए शुरुआत मिली।

और इस तरह, उनकी प्रेम कहानी जारी है, सितारों में लिखी हुई और हल्की हवा पर ले जाई जा रही, जुड़ाव की शक्ति, साझे सपनों की सुंदरता, और उस जादू का प्रमाण जो तब होता है जब दो आत्माएं एक-दूसरे का रास्ता खोजती हैं।`;
  }
  
  // Marathi stories
  if (language === "marathi") {
    const timeDescriptions: Record<string, string> = {
      morning: "सकाळचा सोन्यासारखा प्रकाश",
      sunset: "सूर्यास्ताची उबदार रोशनी",
      night: "रात्रीचे जादुई क्षण"
    };
    
    const moodDescriptions: Record<string, string> = {
      romantic: "रोमँटिक आणि कोमल",
      cozy: "आरामदायक आणि अंतरंग",
      fun: "मजेदार आणि आनंदी",
      magical: "जादुई आणि मोहक"
    };
    
    const timeDesc = timeDescriptions[answers.timeOfDay] || answers.timeOfDay;
    const moodDesc = moodDescriptions[answers.mood] || answers.mood;
    
    return `${answers.dreamDestination} मध्ये, ${timeDesc} च्या खाली, दोन हृदये एका क्षणात भेटली ज्याने सर्वकाही बदलून टाकले। ${moodDesc} वातावरणाने त्यांना वेढले जेव्हा ते ${answers.activity} करत होते, कायमस्वरूपी आठवणी निर्माण करत होते।

${answers.weather} हवामानाने परिपूर्ण सेटिंगमध्ये जोडले, ${answers.specialEffect} त्यांच्या सभोवती नृत्य करत होते जसे निसर्ग त्यांच्या प्रेमाचा सण साजरा करत होता। ${answers.outfitStyle} पोशाकात सजलेले, ते एकत्र सहजतेने चालत होते, प्रत्येक क्षण मागीलपेक्षा अधिक सुंदर।

जसजसे ते आपल्या प्रवासाला सुरुवात करत होते, त्यांना माहित होते की ही त्यांच्या कथेची सुरुवात होती। प्रत्येक पाऊल, प्रत्येक नजर, प्रत्येक सामायिक स्मित हे एक वचन होते त्या सुंदर भविष्याचे जे पुढे होते। त्या क्षणी, ${answers.dreamDestination} च्या जादूने वेढलेले, त्यांना फक्त एकमेकांना सापडले नाही, तर कायमस्वरूपी सुरुवात सापडली।

आणि अशा प्रकारे, त्यांची प्रेमकथा सुरू आहे, ताऱ्यांमध्ये लिहिलेली आणि सौम्य वाऱ्यावर नेली जात आहे, जोडणीच्या शक्तीचा, सामायिक स्वप्नांच्या सौंदर्याचा, आणि ज्या जादूचा तो घडतो जेव्हा दोन आत्मा एकमेकांचा मार्ग शोधतात।`;
  }
  
  // English (default)
  const timeDescriptions: Record<string, string> = {
    morning: "the golden light of dawn",
    sunset: "the warm glow of sunset",
    night: "the magical hours of night"
  };
  
  const moodDescriptions: Record<string, string> = {
    romantic: "romantic and tender",
    cozy: "cozy and intimate",
    fun: "playful and joyful",
    magical: "magical and enchanting"
  };
  
  const timeDesc = timeDescriptions[answers.timeOfDay] || answers.timeOfDay;
  const moodDesc = moodDescriptions[answers.mood] || answers.mood;
  
  return `In ${answers.dreamDestination}, under ${timeDesc}, two hearts found each other in a moment that would change everything. The ${moodDesc} atmosphere surrounded them as they were ${answers.activity}, creating memories that would last forever.

The ${answers.weather} weather added to the perfect setting, with ${answers.specialEffect} dancing around them like nature's own celebration of their love. Dressed in ${answers.outfitStyle} attire, they moved together in perfect harmony, each moment more beautiful than the last.

As they continued their journey together, they knew this was just the beginning of their story. Every step, every glance, every shared smile was a promise of the beautiful future that lay ahead. In that moment, surrounded by the magic of ${answers.dreamDestination}, they found not just each other, but the beginning of forever.

And so, their love story continues, written in the stars and carried on the gentle breeze, a testament to the power of connection, the beauty of shared dreams, and the magic that happens when two souls find their way to each other.`;
}

