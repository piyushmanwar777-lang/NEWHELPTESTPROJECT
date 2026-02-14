"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Floating Heart Component
const FloatingHeart = ({ delay, duration, x, y }: { delay: number; duration: number; x: number; y: number }) => {
  return (
    <motion.div
      className="absolute text-pink-400 opacity-20 text-2xl pointer-events-none"
      initial={{ y: "100vh", x: x, opacity: 0 }}
      animate={{
        y: y,
        x: [x, x + 50, x - 50, x],
        opacity: [0, 0.3, 0.2, 0],
        scale: [0.5, 1, 0.8, 0.5],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      ❤️
    </motion.div>
  );
};

// Confetti Particle Component
const ConfettiParticle = ({ 
  delay, 
  x, 
  color 
}: { 
  delay: number; 
  x: number; 
  color: string;
}) => {
  const colors = ["#ec4899", "#a855f7", "#f472b6", "#c084fc", "#f9a8d4"];
  const particleColor = color || colors[Math.floor(Math.random() * colors.length)];
  
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full pointer-events-none"
      style={{ backgroundColor: particleColor, left: `${x}%` }}
      initial={{ 
        y: -20, 
        x: 0, 
        opacity: 1,
        rotate: 0,
        scale: 1
      }}
      animate={{
        y: "100vh",
        x: [0, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 100],
        opacity: [1, 1, 0],
        rotate: [0, 360, 720],
        scale: [1, 1.2, 0.8],
      }}
      transition={{
        duration: 2 + Math.random() * 1,
        delay: delay,
        ease: "easeOut",
        repeat: Infinity,
        repeatDelay: 3,
      }}
    />
  );
};

// Celebration Heart Component
const CelebrationHeart = ({ 
  delay, 
  x, 
  emoji 
}: { 
  delay: number; 
  x: number; 
  emoji: string;
}) => {
  const emojis = ["❤️", "💕", "💖", "💗", "💝", "💞", "💓", "💘"];
  const heartEmoji = emoji || emojis[Math.floor(Math.random() * emojis.length)];
  
  return (
    <motion.div
      className="absolute text-4xl md:text-5xl pointer-events-none"
      style={{ left: `${x}%` }}
      initial={{ 
        y: "100vh", 
        x: 0, 
        opacity: 0,
        scale: 0,
        rotate: -180
      }}
      animate={{
        y: -100,
        x: [0, (Math.random() - 0.5) * 200, (Math.random() - 0.5) * 200],
        opacity: [0, 1, 1, 0],
        scale: [0, 1.5, 1, 0.5],
        rotate: [180, 0, -180],
      }}
      transition={{
        duration: 3 + Math.random() * 2,
        delay: delay,
        ease: "easeOut",
        repeat: Infinity,
        repeatDelay: 2,
      }}
    >
      {heartEmoji}
    </motion.div>
  );
};

// Proposal Card Component
export default function Home() {
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [isHoveringNo, setIsHoveringNo] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showDestination, setShowDestination] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [boyPhoto, setBoyPhoto] = useState<string | null>(null);
  const [girlPhoto, setGirlPhoto] = useState<string | null>(null);
  const [loveLocation, setLoveLocation] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<string | null>(null);
  const [generatedStory, setGeneratedStory] = useState<string | null>(null);
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [showImmersiveStory, setShowImmersiveStory] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [showPlaceSearch, setShowPlaceSearch] = useState(false);
  const [showCinematicScene, setShowCinematicScene] = useState(false);
  const [showImageStory, setShowImageStory] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showFinalImage, setShowFinalImage] = useState(false);
  const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null);
  const [typedText, setTypedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [placeName, setPlaceName] = useState("");
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [sceneDescription, setSceneDescription] = useState<string | null>(null);
  const [isGeneratingScene, setIsGeneratingScene] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [storyImages, setStoryImages] = useState<string[]>([]);
  const [storyImageUrls, setStoryImageUrls] = useState<string[]>([]);
  
  // 7 Questions state
  const [dreamDestination, setDreamDestination] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [mood, setMood] = useState("");
  const [activity, setActivity] = useState("");
  const [weather, setWeather] = useState("");
  const [outfitStyle, setOutfitStyle] = useState("");
  const [specialEffect, setSpecialEffect] = useState("");
  const [storyLanguage, setStoryLanguage] = useState("english");
  
  // Text-to-speech state
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const [heartParticles, setHeartParticles] = useState<Array<{ id: number; x: number; y: number; delay: number; emoji: string }>>([]);
  const [hearts, setHearts] = useState<Array<{ id: number; delay: number; duration: number; x: number; y: number }>>([]);
  const [confettiParticles, setConfettiParticles] = useState<Array<{ id: number; delay: number; x: number; color: string }>>([]);
  const [celebrationHearts, setCelebrationHearts] = useState<Array<{ id: number; delay: number; x: number; emoji: string }>>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const storyAudioRef = useRef<HTMLAudioElement>(null);
  const placeInputRef = useRef<HTMLInputElement>(null);

  const handleNoHover = () => {
    setIsHoveringNo(true);
    // More dramatic movement on desktop, less on mobile
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const range = isMobile ? 150 : 250;
    const randomX = (Math.random() - 0.5) * range;
    const randomY = (Math.random() - 0.5) * range;
    setNoButtonPosition({ x: randomX, y: randomY });
  };

  const handleYesClick = () => {
    setShowCelebration(true);
  };

  const handleStartStory = () => {
    setShowQuestions(true);
  };

  const validateImageType = (file: File): boolean => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    return validTypes.includes(file.type);
  };

  const handleFileSelect = (file: File) => {
    setError(null);
    
    if (!validateImageType(file)) {
      setError("Please upload a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size should be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      setUploadedImage(imageUrl);
      setGirlPhoto(imageUrl);
      // Store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("girlPhoto", imageUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  // Load images and location from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Load boy photo
      const savedBoyPhoto = localStorage.getItem("boyPhoto");
      if (savedBoyPhoto) {
        setBoyPhoto(savedBoyPhoto);
      } else {
        // Convert /public/boy.png to base64 and save
        fetch("/boy.png")
          .then((res) => res.blob())
          .then((blob) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64 = reader.result as string;
              setBoyPhoto(base64);
              localStorage.setItem("boyPhoto", base64);
            };
            reader.readAsDataURL(blob);
          })
          .catch((err) => console.error("Error loading boy photo:", err));
      }

      // Load girl photo
      const savedGirlPhoto = localStorage.getItem("girlPhoto");
      if (savedGirlPhoto) {
        setGirlPhoto(savedGirlPhoto);
        setUploadedImage(savedGirlPhoto);
      }

      // Load location
      const savedLocation = localStorage.getItem("loveLocation");
      if (savedLocation) {
        setLoveLocation(savedLocation);
        setPlaceName(savedLocation);
      }
    }
  }, []);

  // Load place name from localStorage and focus input when place search shows
  useEffect(() => {
    if (typeof window !== "undefined" && showPlaceSearch) {
      const savedPlace = localStorage.getItem("loveLocation");
      if (savedPlace) {
        setPlaceName(savedPlace);
      }
      // Focus input after a brief delay for smooth animation
      setTimeout(() => {
        placeInputRef.current?.focus();
      }, 800);
    }
  }, [showPlaceSearch]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleContinue = () => {
    if (uploadedImage) {
      // Save girl photo to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("girlPhoto", uploadedImage);
        setGirlPhoto(uploadedImage);
      }
      setShowPhotoUpload(false);
      setShowQuestions(true);
    }
  };

  const handleQuestionsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all answers
    if (!dreamDestination || !timeOfDay || !mood || !activity || !weather || !outfitStyle || !specialEffect) {
      setError("Please answer all questions ❤️");
      return;
    }

    setShowQuestions(false);
    setIsGeneratingStory(true);
    setError(null);

    try {
      // Generate story from answers
      const response = await fetch("/api/generate-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dreamDestination,
          timeOfDay,
          mood,
          activity,
          weather,
          outfitStyle,
          specialEffect,
          language: storyLanguage
        })
      });

      const data = await response.json();

      if (response.ok && data.story) {
        // Store story in localStorage and display it on the same page
        if (typeof window !== "undefined") {
          localStorage.setItem("generatedStory", data.story);
          localStorage.setItem("storyAnswers", JSON.stringify({
            dreamDestination,
            timeOfDay,
            mood,
            activity,
            weather,
            outfitStyle,
            specialEffect,
            language: storyLanguage
          }));
        }
        // Set the story and show it
        setGeneratedStory(data.story);
        setShowStory(true);
        setShowQuestions(false);
        
        // Load language from localStorage if available
        if (typeof window !== "undefined") {
          const savedAnswers = localStorage.getItem("storyAnswers");
          if (savedAnswers) {
            try {
              const answers = JSON.parse(savedAnswers);
              if (answers.language) {
                setStoryLanguage(answers.language);
              }
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      } else {
        setError(data.error || "Failed to generate story. Please try again.");
        setShowQuestions(true);
      }
    } catch (err) {
      console.error("Error generating story:", err);
      setError(`Failed to generate story: ${err instanceof Error ? err.message : "Unknown error"}`);
      setShowQuestions(true);
    } finally {
      setIsGeneratingStory(false);
    }
  };

  // Text-to-speech functions
  const speakStory = () => {
    if (!generatedStory) return;
    
    // Stop any ongoing speech
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
    }
    
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      speechSynthesisRef.current = window.speechSynthesis;
      
      // Get language code
      const langMap: Record<string, string> = {
        english: 'en-IN',
        hindi: 'hi-IN',
        marathi: 'mr-IN'
      };
      
      const lang = langMap[storyLanguage] || 'en-IN';
      
      const utterance = new SpeechSynthesisUtterance(generatedStory);
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1;
      
      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };
      
      utterance.onerror = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };
      
      utteranceRef.current = utterance;
      speechSynthesisRef.current.speak(utterance);
      setIsPlaying(true);
      setIsPaused(false);
    }
  };
  
  const pauseStory = () => {
    if (speechSynthesisRef.current && isPlaying) {
      speechSynthesisRef.current.pause();
      setIsPaused(true);
    }
  };
  
  const resumeStory = () => {
    if (speechSynthesisRef.current && isPaused) {
      speechSynthesisRef.current.resume();
      setIsPaused(false);
    }
  };
  
  const stopStory = () => {
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
      }
    };
  }, []);

  const handlePlaceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (placeName.trim()) {
      // Save place name to localStorage
      const place = placeName.trim();
      setLoveLocation(place);
      if (typeof window !== "undefined") {
        localStorage.setItem("loveLocation", place);
      }
      
      // Generate multiple scene images
      setShowPlaceSearch(false);
      setIsGeneratingScene(true);
      
      // Generate image URLs for 4 specific scenes
      const imageUrls: string[] = [];
      
      // Read from localStorage
      const boy = typeof window !== "undefined" ? localStorage.getItem("boyPhoto") : null;
      const girl = typeof window !== "undefined" ? localStorage.getItem("girlPhoto") : null;
      
      if (!boy || !girl) {
        setError("Please upload photos first ❤️");
        setIsGeneratingScene(false);
        return;
      }
      
      try {
        for (let i = 1; i <= 4; i++) {
          const response = await fetch("/api/generate-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              place, 
              sceneIndex: i,
              boyImageUrl: boy,
              girlImageUrl: girl
            }),
          });
          
          const data = await response.json();
          
          if (response.ok) {
            if (data.imageUrl) {
              imageUrls.push(data.imageUrl);
            } else if (data.error) {
              console.error(`Scene ${i} error:`, data.error);
              // Continue to next scene even if one fails
            } else if (data.message) {
              console.warn(`Scene ${i} message:`, data.message);
              // Continue even if there's a message (we're using free images now)
            }
          } else {
            console.error(`Scene ${i} failed:`, data.error || "Unknown error");
          }
        }
        
        // Set generated images
        if (imageUrls.length > 0) {
          setStoryImageUrls(imageUrls);
          // Show image story slideshow
          setShowImageStory(true);
        } else {
          // If no images generated, use romantic placeholder images as fallback
          const freeImages = [
            `https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1920&h=1080&fit=crop&q=80`,
            `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&q=80`,
            `https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&h=1080&fit=crop&q=80`,
            `https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop&q=80`
          ];
          setStoryImageUrls(freeImages);
          setShowImageStory(true);
        }
      } catch (err) {
        console.error("Error generating scene images:", err);
        setError(`Failed to generate images: ${err instanceof Error ? err.message : "Unknown error"}`);
      } finally {
        setIsGeneratingScene(false);
      }
    }
  };

  const handleDestinationSelect = async (destination: string) => {
    setSelectedDestination(destination);
    setIsGeneratingStory(true);
    setError(null);

    try {
      const response = await fetch("/api/story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ destination }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate story");
      }

      const data = await response.json();
      setGeneratedStory(data.story);
      setShowStory(true);
      // After a brief delay, show immersive story screen
      setTimeout(() => {
        setShowImmersiveStory(true);
        setShowStory(false);
        startTypingAnimation(data.story);
      }, 1000);
    } catch (err) {
      console.error("Error generating story:", err);
      setError(err instanceof Error ? err.message : "Failed to generate story");
    } finally {
      setIsGeneratingStory(false);
    }
  };

  const destinations = [
    { id: "river", name: "River", emoji: "🌊" },
    { id: "land", name: "Land", emoji: "🌍" },
    { id: "sky", name: "Sky", emoji: "☁️" },
    { id: "mountain", name: "Mountain", emoji: "🏔️" },
    { id: "space", name: "Space", emoji: "🚀" },
  ];

  // Typing animation
  const startTypingAnimation = (text: string) => {
    setTypedText("");
    setIsTyping(true);
    let index = 0;
    
    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setTypedText(text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        clearInterval(typeInterval);
      }
    }, 30); // Adjust speed here (lower = faster)
  };

  // Set audio volume when immersive story shows
  useEffect(() => {
    if (showImmersiveStory && audioRef.current) {
      audioRef.current.volume = 0.3; // 30% volume
    }
  }, [showImmersiveStory]);

  // Auto-transition images every 3 seconds
  useEffect(() => {
    if (!showImageStory || storyImageUrls.length === 0) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % storyImageUrls.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [showImageStory, storyImageUrls.length]);

  // Generate story images when image story shows
  useEffect(() => {
    if (showImageStory) {
      // Read from localStorage
      const boy = typeof window !== "undefined" ? localStorage.getItem("boyPhoto") : null;
      const girl = typeof window !== "undefined" ? localStorage.getItem("girlPhoto") : null;
      const place = typeof window !== "undefined" ? localStorage.getItem("loveLocation") : null;

      // Check if all required data exists
      if (!boy || !girl || !place) {
        // Show friendly message - handled in render
        return;
      }

      // Generate image URLs for 4 specific scenes
      const generateImageUrls = async () => {
        const imageUrls: string[] = [];
        
        // Try to generate images via API
        for (let i = 1; i <= 4; i++) {
          try {
            const response = await fetch("/api/generate-image", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                place: place, 
                sceneIndex: i,
                boyImageUrl: boy,
                girlImageUrl: girl
              }),
            });
            if (response.ok) {
              const data = await response.json();
              if (data.imageUrl) {
                imageUrls.push(data.imageUrl);
                console.log(`Scene ${i} image URL:`, data.imageUrl);
              } else {
                console.warn(`Scene ${i} - No imageUrl in response:`, data);
              }
            } else {
              console.error(`Scene ${i} - Response not OK:`, response.status);
            }
          } catch (error) {
            console.error(`Error generating image for scene ${i}:`, error);
          }
        }
        
        // Set generated images
        if (imageUrls.length > 0) {
          console.log(`Setting ${imageUrls.length} images:`, imageUrls);
          setStoryImageUrls(imageUrls);
        } else {
          // Fallback: Use direct Picsum images
          console.warn("No images from API, using fallback images");
          const fallbackImages = [
            "https://picsum.photos/1920/1080?random=1001",
            "https://picsum.photos/1920/1080?random=1002",
            "https://picsum.photos/1920/1080?random=1003",
            "https://picsum.photos/1920/1080?random=1004"
          ];
          setStoryImageUrls(fallbackImages);
        }
      };
      generateImageUrls();
    }
  }, [showImageStory]);

  // Set story audio volume
  useEffect(() => {
    if (showImageStory && storyAudioRef.current) {
      storyAudioRef.current.volume = 0.2; // 20% volume for background
    }
  }, [showImageStory]);

  // Generate heart particles for image story
  useEffect(() => {
    if (showImageStory) {
      setHeartParticles(Array.from({ length: 20 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        emoji: ["❤️", "💕", "💖", "💗", "💝", "💞", "💓", "💘"][Math.floor(Math.random() * 8)],
      })));
    }
  }, [showImageStory, currentImageIndex]);

  // Get destination-based background
  const getDestinationBackground = (destination: string) => {
    const backgrounds: Record<string, string> = {
      river: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #60a5fa 100%)",
      land: "linear-gradient(135deg, #166534 0%, #22c55e 50%, #4ade80 100%)",
      sky: "linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #93c5fd 100%)",
      mountain: "linear-gradient(135deg, #7c2d12 0%, #dc2626 50%, #f97316 100%)",
      space: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #6366f1 100%)",
    };
    return backgrounds[destination] || backgrounds.river;
  };

  // Generate animation data only on client to avoid hydration mismatch
  useEffect(() => {
    // Generate floating hearts
    setHearts(Array.from({ length: 15 }, (_, i) => ({
      id: i,
      delay: Math.random() * 5,
      duration: 10 + Math.random() * 10,
      x: Math.random() * 100,
      y: -100 - Math.random() * 50,
    })));

    // Generate confetti particles
    setConfettiParticles(Array.from({ length: 50 }, (_, i) => ({
      id: i,
      delay: Math.random() * 0.5,
      x: Math.random() * 100,
      color: ["#ec4899", "#a855f7", "#f472b6", "#c084fc", "#f9a8d4"][Math.floor(Math.random() * 5)],
    })));

    // Generate celebration hearts
    setCelebrationHearts(Array.from({ length: 20 }, (_, i) => ({
      id: i,
      delay: Math.random() * 2,
      x: Math.random() * 100,
      emoji: ["❤️", "💕", "💖", "💗", "💝", "💞", "💓", "💘"][Math.floor(Math.random() * 8)],
    })));
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-8">
      <AnimatePresence mode="wait">
        {showImageStory ? (
          <motion.div
            key="image-story"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50 bg-black"
          >
            {/* Background Music */}
            <audio
              ref={storyAudioRef}
              autoPlay
              loop
              className="hidden"
            >
              {/* Add your romantic background music file here */}
              {/* <source src="/audio/romantic-music.mp3" type="audio/mpeg" /> */}
            </audio>

            {/* Check if data is missing */}
            {(() => {
              const boy = typeof window !== "undefined" ? localStorage.getItem("boyPhoto") : null;
              const girl = typeof window !== "undefined" ? localStorage.getItem("girlPhoto") : null;
              const place = typeof window !== "undefined" ? localStorage.getItem("loveLocation") : null;

              if (!boy || !girl || !place) {
                return (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="text-center px-8">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.2, 1] }}
                        transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
                        className="text-6xl md:text-7xl mb-6"
                      >
                        ❤️
                      </motion.div>
                      <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-white text-2xl md:text-3xl font-light"
                        style={{ textShadow: "0 4px 20px rgba(0, 0, 0, 0.8)" }}
                      >
                        Please upload photos first ❤️
                      </motion.p>
                    </div>
                  </motion.div>
                );
              }

              return null;
            })()}

            {/* Loading State */}
            {isGeneratingScene && storyImageUrls.length === 0 && (() => {
              const boy = typeof window !== "undefined" ? localStorage.getItem("boyPhoto") : null;
              const girl = typeof window !== "undefined" ? localStorage.getItem("girlPhoto") : null;
              const place = typeof window !== "undefined" ? localStorage.getItem("loveLocation") : null;
              return boy && girl && place;
            })() ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full mx-auto mb-6"
                  />
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white text-xl md:text-2xl"
                    style={{ textShadow: "0 2px 10px rgba(0, 0, 0, 0.8)" }}
                  >
                    Creating your romantic scenes...
                  </motion.p>
                </div>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                {storyImageUrls.length > 0 && (
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                  >
                    {/* Heart Particles */}
                    <div className="absolute inset-0 pointer-events-none z-20">
                      {heartParticles.map((heart) => (
                        <motion.div
                          key={heart.id}
                          initial={{ opacity: 0, scale: 0, y: heart.y + 100 }}
                          animate={{
                            opacity: [0, 1, 1, 0],
                            scale: [0, 1, 1, 0],
                            y: heart.y - 100,
                            x: heart.x + (Math.random() - 0.5) * 20,
                          }}
                          transition={{
                            delay: heart.delay,
                            duration: 4 + Math.random() * 2,
                            repeat: Infinity,
                            ease: "easeOut",
                          }}
                          className="absolute text-2xl md:text-3xl"
                          style={{
                            left: `${heart.x}%`,
                            top: `${heart.y}%`,
                          }}
                        >
                          {heart.emoji}
                        </motion.div>
                      ))}
                    </div>

                    {/* Fullscreen Image with Ken Burns Effect */}
                    <motion.div
                      initial={{ opacity: 0, scale: 1 }}
                      animate={{
                        opacity: 1,
                        scale: [1, 1.05], // Ken Burns effect - slow zoom
                      }}
                      transition={{
                        opacity: { duration: 1.5, ease: "easeOut" },
                        scale: {
                          duration: 3,
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatType: "reverse" as const,
                        },
                      }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <img
                        src={storyImageUrls[currentImageIndex]}
                        alt={`Scene ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to a default romantic image if loading fails
                          const target = e.target as HTMLImageElement;
                          target.src = `https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1920&h=1080&fit=crop&q=80`;
                        }}
                        loading="eager"
                      />
                    </motion.div>

                    {/* Couple Photos Overlay - Bottom Center */}
                    {(() => {
                      const boy = typeof window !== "undefined" ? localStorage.getItem("boyPhoto") : null;
                      const girl = typeof window !== "undefined" ? localStorage.getItem("girlPhoto") : null;
                      
                      if (boy && girl) {
                        return (
                          <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
                            className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 md:gap-6 p-4 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-2xl"
                          >
                            {/* Boy Photo */}
                            <motion.div
                              animate={{ y: [0, -8, 0] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                              className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-pink-400/80 shadow-[0_0_20px_rgba(236,72,153,0.6)]"
                            >
                              <img
                                src={boy}
                                alt="Boy"
                                className="w-full h-full object-cover"
                              />
                            </motion.div>

                            {/* Heart Icon */}
                            <motion.span
                              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                              className="text-4xl md:text-5xl drop-shadow-lg"
                            >
                              ❤️
                            </motion.span>

                            {/* Girl Photo */}
                            <motion.div
                              animate={{ y: [0, 8, 0] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                              className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-purple-400/80 shadow-[0_0_20px_rgba(168,85,247,0.6)]"
                            >
                              <img
                                src={girl}
                                alt="Girl"
                                className="w-full h-full object-cover"
                              />
                            </motion.div>
                          </motion.div>
                        );
                      }
                      return null;
                    })()}
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {/* Progress Indicator Dots */}
            {storyImageUrls.length > 0 && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {storyImageUrls.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? "bg-white h-2 w-8"
                        : "bg-white/40 hover:bg-white/60 h-2 w-2"
                    }`}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={`Go to scene ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Exit Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={() => {
                setShowImageStory(false);
                setShowFinalMessage(true);
              }}
              className="absolute top-8 right-8 z-20 px-6 py-3 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm border border-white/20 text-white font-medium transition-all duration-300"
            >
              Skip to End
            </motion.button>
          </motion.div>
        ) : showCinematicScene ? (
          <motion.div
            key="cinematic-scene"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              background: selectedDestination 
                ? getDestinationBackground(selectedDestination)
                : "linear-gradient(135deg, #1a0d1a 0%, #2d1b2d 100%)",
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            {/* Scene Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative z-10 max-w-5xl w-full px-8 md:px-16 py-12"
            >
              {/* Scene Title */}
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-3xl md:text-4xl font-semibold text-center mb-8 text-white"
                style={{
                  textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                }}
              >
                Our Journey to {placeName || "Adventure"} ✨
              </motion.h1>

              {/* Scene Container */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 1 }}
                className="bg-black/30 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl"
              >
                {/* Couple Images Side by Side */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-8">
                  {/* Boy Image */}
                  <motion.div
                    initial={{ opacity: 0, x: -50, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: 0.9, duration: 0.8, type: "spring" }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-gradient-romantic rounded-full blur-2xl opacity-50" />
                    <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-pink-300/50 shadow-2xl"
                      style={{
                        boxShadow: "0 0 40px rgba(236, 72, 153, 0.6)",
                      }}
                    >
        <Image
                        src="/boy.png"
                        alt="You"
                        width={192}
                        height={192}
                        className="w-full h-full object-cover"
          priority
        />
                    </div>
                  </motion.div>

                  {/* Heart Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 1.1, type: "spring", stiffness: 200 }}
                    className="text-5xl md:text-6xl"
                  >
                    ❤️
                  </motion.div>

                  {/* Girl Image */}
                  {uploadedImage && (
                    <motion.div
                      initial={{ opacity: 0, x: 50, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ delay: 1, duration: 0.8, type: "spring" }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-gradient-romantic rounded-full blur-2xl opacity-50" />
                      <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-pink-300/50 shadow-2xl"
                        style={{
                          boxShadow: "0 0 40px rgba(236, 72, 153, 0.6)",
                        }}
                      >
                        <img
                          src={uploadedImage}
                          alt="Her"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Scene Description */}
                {sceneDescription ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="text-white text-lg md:text-xl leading-relaxed text-center font-light space-y-4"
                    style={{
                      textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
                    }}
                  >
                    <p className="whitespace-pre-line">{sceneDescription}</p>
                  </motion.div>
                ) : isGeneratingScene ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="text-white">Creating your romantic scene...</p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white text-lg md:text-xl leading-relaxed text-center font-light"
                  >
                    <p>
                      In {placeName}, two souls find each other, creating memories that will last forever. 
                      Together, they explore the wonders of this beautiful place, hand in hand, heart to heart. 
                      Every moment is a treasure, every step a new adventure in their love story.
                    </p>
                  </motion.div>
                )}

                {/* Continue Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.6 }}
                  className="flex justify-center mt-8"
                >
                  <motion.button
                    onClick={() => {
                      setShowCinematicScene(false);
                      setShowDestination(true);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-semibold text-lg transition-all duration-300"
                  >
                    Continue Our Story ✨
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : showFinalMessage ? (
          <motion.div
            key="final-message"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              background: selectedDestination 
                ? getDestinationBackground(selectedDestination)
                : "linear-gradient(135deg, #1a0d1a 0%, #2d1b2d 100%)",
            }}
          >
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Floating Hearts Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {hearts.map((heart) => (
                <FloatingHeart
                  key={heart.id}
                  delay={heart.delay}
                  duration={heart.duration}
                  x={heart.x}
                  y={heart.y}
                />
              ))}
        </div>

            {/* Final Message Content */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                duration: 1.5, 
                delay: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94] // Smooth ease-out
              }}
              className="relative z-10 max-w-3xl w-full px-8 md:px-16 text-center"
            >
              {/* Profile Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  duration: 1, 
                  delay: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
                className="mb-8 flex justify-center"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-romantic rounded-full blur-xl opacity-50" />
                  <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl"
                    style={{
                      boxShadow: "0 0 30px rgba(236, 72, 153, 0.5)",
                    }}
          >
            <Image
                      src="/boy.png"
                      alt="You"
                      width={160}
                      height={160}
                      className="w-full h-full object-cover"
          priority
        />
                  </div>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                  duration: 1, 
                  delay: 0.8,
                  type: "spring",
                  stiffness: 100
                }}
                className="mb-8"
              >
                <span className="text-6xl md:text-7xl">💕</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 1.2, 
                  delay: 1.2,
                  ease: "easeOut"
                }}
                className="text-3xl md:text-5xl lg:text-6xl font-light text-white leading-relaxed mb-6"
                style={{
                  textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                }}
              >
                No matter where we go,
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 1.2, 
                  delay: 1.6,
                  ease: "easeOut"
                }}
                className="text-3xl md:text-5xl lg:text-6xl font-light text-white leading-relaxed"
                style={{
                  textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
                }}
              >
                I want every journey to be with you ❤️
              </motion.h2>

              {/* Subtle glow effect */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
                className="absolute inset-0 -z-10 blur-3xl"
                style={{
                  background: "radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)",
                }}
              />
            </motion.div>
          </motion.div>
        ) : showImmersiveStory && generatedStory && selectedDestination ? (
          <motion.div
            key="immersive-story"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              background: getDestinationBackground(selectedDestination),
            }}
          >
            {/* Background Music */}
            <audio
              ref={audioRef}
              autoPlay
              loop
              className="hidden"
            >
              {/* Add your own romantic background music file here */}
              {/* <source src="/audio/romantic-music.mp3" type="audio/mpeg" /> */}
            </audio>

            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

            {/* Story Content */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative z-10 max-w-4xl w-full px-8 md:px-16 py-12"
            >
              {/* Destination Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.7, type: "spring" }}
                className="text-center mb-8"
              >
                <span className="text-7xl md:text-8xl">
                  {destinations.find(d => d.id === selectedDestination)?.emoji}
                </span>
              </motion.div>

              {/* Story Text with Typing Animation */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="bg-black/30 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl"
              >
                <div className="text-white text-lg md:text-xl leading-relaxed font-light space-y-4">
                  {typedText.split('\n').map((paragraph, index) => (
                    paragraph && (
                      <motion.p
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="mb-4"
                      >
                        {paragraph}
                        {index === typedText.split('\n').filter(p => p).length - 1 && isTyping && (
                          <motion.span
                            animate={{ opacity: [1, 0] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="ml-1"
                          >
                            |
                          </motion.span>
                        )}
                      </motion.p>
                    )
                  ))}
        </div>
              </motion.div>

              {/* Skip/Continue Button */}
              {!isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex justify-center mt-8"
                >
                  <motion.button
                    onClick={() => {
                      setShowImmersiveStory(false);
                      setShowImageStory(true);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-semibold text-lg transition-all duration-300"
                  >
                    Continue Journey ✨
                  </motion.button>
                </motion.div>
              )}

              {/* Skip typing button */}
              {isTyping && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  onClick={() => {
                    setTypedText(generatedStory);
                    setIsTyping(false);
                  }}
                  className="absolute bottom-8 right-8 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white text-sm transition-all duration-300"
                >
                  Skip animation
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        ) : showDestination ? (
          <motion.div
            key="destination"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 w-full max-w-4xl"
          >
            {/* Floating Hearts Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {hearts.map((heart) => (
                <FloatingHeart
                  key={heart.id}
                  delay={heart.delay}
                  duration={heart.duration}
                  x={heart.x}
                  y={heart.y}
                />
              ))}
            </div>

            {/* Destination Selection Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative z-10 glass rounded-3xl p-8 md:p-12 w-full mx-auto shadow-2xl"
            >
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-2xl md:text-3xl font-semibold text-center mb-10 text-foreground gradient-text"
              >
                Where should we go together?
              </motion.h1>

              {showStory && generatedStory ? (
                // Loading transition to immersive story
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 border-4 border-pink-400 border-t-transparent rounded-full mx-auto mb-4"
                  />
                  <p className="text-foreground">Preparing your story...</p>
                </motion.div>
              ) : (
                <>
                  {/* Destination Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {destinations.map((destination, index) => (
                      <motion.div
                        key={destination.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                        whileHover={{ 
                          scale: 1.05,
                          transition: { duration: 0.2 }
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDestinationSelect(destination.id)}
                        className={`
                          relative cursor-pointer rounded-2xl p-6 md:p-8 
                          border-2 transition-all duration-300
                          ${isGeneratingStory ? "opacity-50 cursor-wait" : ""}
                          ${selectedDestination === destination.id
                            ? "border-pink-400 bg-pink-500/20 shadow-[0_0_30px_rgba(236,72,153,0.6)]"
                            : "border-white/20 bg-white/5 hover:border-pink-300/50 hover:bg-pink-500/10 hover:shadow-[0_0_25px_rgba(236,72,153,0.4)]"
                          }
                        `}
                      >
                        {/* Glow effect on hover */}
                        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-romantic blur-xl -z-10" />
                        
                        <div className="text-center">
                          <motion.div
                            className="text-5xl md:text-6xl mb-3"
                            whileHover={{ scale: 1.2, rotate: 5 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            {destination.emoji}
                          </motion.div>
                          <h3 className="text-lg md:text-xl font-semibold text-foreground">
                            {destination.name}
                          </h3>
                        </div>

                        {/* Selection indicator */}
                        {selectedDestination === destination.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gradient-romantic flex items-center justify-center"
                          >
                            <span className="text-white text-sm">✓</span>
                          </motion.div>
                        )}

                        {/* Loading indicator */}
                        {isGeneratingStory && selectedDestination === destination.id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-8 h-8 border-2 border-pink-400 border-t-transparent rounded-full"
                            />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center"
                    >
                      {error}
                    </motion.div>
                  )}
                </>
              )}
            </motion.div>
          </motion.div>
        ) : showFinalImage ? (
          /* Final Cinematic Image Screen */
          <motion.div
            key="final-image"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-50 bg-black"
          >
            {finalImageUrl ? (
              <motion.img
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                src={finalImageUrl}
                alt="Final Cinematic Image"
                className="w-full h-full object-contain"
                onError={(e) => {
                  // NO FALLBACK - Show error if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  setError("Failed to load generated image. Please try again.");
                }}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full mx-auto mb-6"
                  />
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-white text-xl md:text-2xl mb-2"
                    style={{ textShadow: "0 2px 10px rgba(0, 0, 0, 0.8)" }}
                  >
                    Generating your romantic scene...
                  </motion.p>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-white/70 text-sm md:text-base"
                    style={{ textShadow: "0 2px 10px rgba(0, 0, 0, 0.8)" }}
                  >
                    This may take 30-60 seconds. Please wait...
                  </motion.p>
                </div>
              </div>
            )}
          </motion.div>
        ) : showQuestions ? (
          /* 7 Questions Form Screen */
          <motion.div
            key="questions"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 w-full max-w-3xl"
          >
            {/* Floating Hearts Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {hearts.map((heart) => (
                <FloatingHeart
                  key={heart.id}
                  delay={heart.delay}
                  duration={heart.duration}
                  x={heart.x}
                  y={heart.y}
                />
              ))}
            </div>

            {/* Questions Form Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative z-10 glass rounded-3xl p-8 md:p-12 w-full mx-auto shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-2xl md:text-3xl font-semibold text-center mb-8 text-foreground gradient-text"
              >
                Tell Me About Your Dream ❤️
              </motion.h1>

              <form onSubmit={handleQuestionsSubmit} className="space-y-6">
                {/* Question 1: Dream Destination */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <label className="block text-foreground font-medium mb-2">
                    1. Where is your dream destination? 🌍
                  </label>
                  <input
                    type="text"
                    value={dreamDestination}
                    onChange={(e) => setDreamDestination(e.target.value)}
                    placeholder="e.g., Paris, Beach, Mountains..."
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/20 text-foreground placeholder-foreground-muted focus:outline-none focus:border-pink-400 transition-all"
                    required
                  />
                </motion.div>

                {/* Question 2: Time of Day */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <label className="block text-foreground font-medium mb-2">
                    2. What time of day? ⏰
                  </label>
                  <select
                    value={timeOfDay}
                    onChange={(e) => setTimeOfDay(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/20 text-foreground focus:outline-none focus:border-pink-400 transition-all"
                    required
                  >
                    <option value="">Select time...</option>
                    <option value="morning">Morning ☀️</option>
                    <option value="sunset">Sunset 🌅</option>
                    <option value="night">Night 🌙</option>
                  </select>
                </motion.div>

                {/* Question 3: Mood */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <label className="block text-foreground font-medium mb-2">
                    3. What&apos;s the mood? 💫
                  </label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/20 text-foreground focus:outline-none focus:border-pink-400 transition-all"
                    required
                  >
                    <option value="">Select mood...</option>
                    <option value="romantic">Romantic 💕</option>
                    <option value="cozy">Cozy 🕯️</option>
                    <option value="fun">Fun 🎉</option>
                    <option value="magical">Magical ✨</option>
                  </select>
                </motion.div>

                {/* Question 4: Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <label className="block text-foreground font-medium mb-2">
                    4. What are we doing? 🎬
                  </label>
                  <select
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/20 text-foreground focus:outline-none focus:border-pink-400 transition-all"
                    required
                  >
                    <option value="">Select activity...</option>
                    <option value="walking">Walking 🚶</option>
                    <option value="hugging">Hugging 🤗</option>
                    <option value="flying">Flying ✈️</option>
                    <option value="dinner">Dinner 🍽️</option>
                    <option value="adventure">Adventure 🗺️</option>
                  </select>
                </motion.div>

                {/* Question 5: Weather */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  <label className="block text-foreground font-medium mb-2">
                    5. What&apos;s the weather? 🌤️
                  </label>
                  <select
                    value={weather}
                    onChange={(e) => setWeather(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/20 text-foreground focus:outline-none focus:border-pink-400 transition-all"
                    required
                  >
                    <option value="">Select weather...</option>
                    <option value="snow">Snow ❄️</option>
                    <option value="stars">Stars ⭐</option>
                    <option value="clear">Clear ☀️</option>
                    <option value="rain">Rain 🌧️</option>
                  </select>
                </motion.div>

                {/* Question 6: Outfit Style */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.5 }}
                >
                  <label className="block text-foreground font-medium mb-2">
                    6. What&apos;s the outfit style? 👗
                  </label>
                  <select
                    value={outfitStyle}
                    onChange={(e) => setOutfitStyle(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/20 text-foreground focus:outline-none focus:border-pink-400 transition-all"
                    required
                  >
                    <option value="">Select style...</option>
                    <option value="casual">Casual 👕</option>
                    <option value="royal">Royal 👑</option>
                    <option value="winter">Winter 🧥</option>
                    <option value="party">Party 🎊</option>
                  </select>
                </motion.div>

                {/* Question 7: Special Effect */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.5 }}
                >
                  <label className="block text-foreground font-medium mb-2">
                    7. Add a special effect? ✨
                  </label>
                  <select
                    value={specialEffect}
                    onChange={(e) => setSpecialEffect(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/20 text-foreground focus:outline-none focus:border-pink-400 transition-all"
                    required
                  >
                    <option value="">Select effect...</option>
                    <option value="fireworks">Fireworks 🎆</option>
                    <option value="glowing hearts">Glowing Hearts 💖</option>
                    <option value="sparkles">Sparkles ✨</option>
                    <option value="galaxy">Galaxy 🌌</option>
                  </select>
                </motion.div>

                {/* Question 8: Language Selection */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.15, duration: 0.5 }}
                >
                  <label className="block text-foreground font-medium mb-2">
                    8. Choose story language? 🌐
                  </label>
                  <select
                    value={storyLanguage}
                    onChange={(e) => setStoryLanguage(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-white/10 backdrop-blur-sm border-2 border-white/20 text-foreground focus:outline-none focus:border-pink-400 transition-all"
                    required
                  >
                    <option value="english">English 🇬🇧</option>
                    <option value="hindi">Hindi 🇮🇳</option>
                    <option value="marathi">Marathi 🇮🇳</option>
                  </select>
                </motion.div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center"
                  >
                    {error}
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="flex justify-center pt-4"
                >
                  <motion.button
                    type="submit"
                    disabled={isGeneratingStory}
                    whileHover={!isGeneratingStory ? { scale: 1.05 } : {}}
                    whileTap={!isGeneratingStory ? { scale: 0.95 } : {}}
                    className={`px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-all duration-300 min-w-[200px] ${
                      isGeneratingStory
                        ? "bg-white/10 text-foreground-muted cursor-not-allowed"
                        : "bg-gradient-romantic text-white hover:shadow-xl cursor-pointer"
                    }`}
                  >
                    {isGeneratingStory ? "Generating Story..." : "Create Our Story ✨"}
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        ) : isGeneratingStory ? (
          /* Loading State */
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 w-full max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-10 glass rounded-3xl p-8 md:p-12 w-full mx-auto shadow-2xl text-center"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-pink-400 border-t-transparent rounded-full mx-auto mb-6"
              />
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl md:text-3xl font-semibold mb-4 text-foreground gradient-text"
              >
                Creating Your Story... ✨
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-foreground-muted text-lg"
              >
                We&apos;re crafting a beautiful romantic story just for you...
              </motion.p>
            </motion.div>
          </motion.div>
        ) : showStory && generatedStory ? (
          /* Story Display Screen */
          <motion.div
            key="story"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 w-full max-w-4xl"
          >
            {/* Floating Hearts Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {hearts.map((heart) => (
                <FloatingHeart
                  key={heart.id}
                  delay={heart.delay}
                  duration={heart.duration}
                  x={heart.x}
                  y={heart.y}
                />
              ))}
            </div>

            {/* Story Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative z-10 glass rounded-3xl p-8 md:p-12 w-full mx-auto shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-2xl md:text-3xl font-semibold text-center mb-8 text-foreground gradient-text"
              >
                Your Love Story 💕
              </motion.h1>

              {/* Story Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-foreground text-base md:text-lg leading-relaxed space-y-4 mb-8"
              >
                {generatedStory.split('\n\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                      className="mb-4"
                    >
                      {paragraph.trim()}
                    </motion.p>
                  )
                ))}
              </motion.div>

              {/* Audio Controls */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.5 }}
                className="flex justify-center items-center gap-3 mb-6 pt-4 border-t border-white/20"
              >
                {!isPlaying && !isPaused && (
                  <motion.button
                    onClick={speakStory}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="px-6 py-3 rounded-full bg-pink-500/80 hover:bg-pink-500 text-white font-medium shadow-lg transition-all flex items-center gap-2"
                  >
                    <span>🔊</span> Play Story
                  </motion.button>
                )}
                {isPlaying && !isPaused && (
                  <>
                    <motion.button
                      onClick={pauseStory}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="px-6 py-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 text-white font-medium shadow-lg transition-all flex items-center gap-2"
                    >
                      <span>⏸️</span> Pause
                    </motion.button>
                    <motion.button
                      onClick={stopStory}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="px-6 py-3 rounded-full bg-red-500/80 hover:bg-red-500 text-white font-medium shadow-lg transition-all flex items-center gap-2"
                    >
                      <span>⏹️</span> Stop
                    </motion.button>
                  </>
                )}
                {isPaused && (
                  <>
                    <motion.button
                      onClick={resumeStory}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="px-6 py-3 rounded-full bg-green-500/80 hover:bg-green-500 text-white font-medium shadow-lg transition-all flex items-center gap-2"
                    >
                      <span>▶️</span> Resume
                    </motion.button>
                    <motion.button
                      onClick={stopStory}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="px-6 py-3 rounded-full bg-red-500/80 hover:bg-red-500 text-white font-medium shadow-lg transition-all flex items-center gap-2"
                    >
                      <span>⏹️</span> Stop
                    </motion.button>
                  </>
                )}
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
              >
                <motion.button
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.location.href = "/webcam-heart";
                    }
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full bg-gradient-romantic text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow duration-300 min-w-[200px]"
                >
                  Experience with Heart Gesture 💖
                </motion.button>
                <motion.button
                  onClick={() => {
                    setShowStory(false);
                    setShowQuestions(true);
                    setGeneratedStory(null);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border-2 border-white/20 text-foreground font-semibold text-lg hover:bg-white/20 transition-all duration-300 min-w-[200px]"
                >
                  Edit Answers ✏️
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : showPlaceSearch ? (
          <motion.div
            key="place-search"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 w-full max-w-2xl"
          >
            {/* Floating Hearts Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {hearts.map((heart) => (
                <FloatingHeart
                  key={heart.id}
                  delay={heart.delay}
                  duration={heart.duration}
                  x={heart.x}
                  y={heart.y}
                />
              ))}
            </div>

            {/* Place Search Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative z-10 glass rounded-3xl p-8 md:p-12 w-full mx-auto shadow-2xl"
            >
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-2xl md:text-3xl font-semibold text-center mb-8 text-foreground gradient-text"
              >
                Plan Our Adventure ✈️
              </motion.h1>

              <form onSubmit={handlePlaceSubmit} className="space-y-6">
                {/* Search Input with Icon */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="relative"
                >
                  <div
                    className={`relative transition-all duration-300 ${
                      isInputFocused
                        ? "scale-105"
                        : ""
                    }`}
                  >
                    {/* Search Icon */}
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                      <motion.svg
                        animate={isInputFocused ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-5 h-5 text-pink-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </motion.svg>
                    </div>

                    {/* Input Field */}
                    <input
                      ref={placeInputRef}
                      type="text"
                      value={placeName}
                      onChange={(e) => setPlaceName(e.target.value)}
                      onFocus={() => setIsInputFocused(true)}
                      onBlur={() => setIsInputFocused(false)}
                      placeholder="Where should we travel together?"
                      className={`w-full pl-12 pr-4 py-4 rounded-2xl bg-white/10 backdrop-blur-sm border-2 transition-all duration-300 text-foreground placeholder-foreground-muted focus:outline-none focus:ring-0 ${
                        isInputFocused
                          ? "border-pink-400 bg-white/15 shadow-[0_0_25px_rgba(236,72,153,0.4)]"
                          : "border-white/20 hover:border-pink-300/50 hover:bg-white/12"
                      }`}
                    />

                    {/* Glow effect on focus */}
                    {isInputFocused && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 rounded-2xl bg-gradient-romantic blur-xl opacity-20 -z-10"
                      />
                    )}
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="flex justify-center"
                >
                  <motion.button
                    type="submit"
                    disabled={!placeName.trim()}
                    whileHover={placeName.trim() ? { scale: 1.05 } : {}}
                    whileTap={placeName.trim() ? { scale: 0.95 } : {}}
                    className={`px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-all duration-300 w-full sm:w-auto min-w-[200px] ${
                      placeName.trim()
                        ? "bg-gradient-romantic text-white hover:shadow-xl cursor-pointer"
                        : "bg-white/10 text-foreground-muted cursor-not-allowed"
                    }`}
                  >
                    Let&apos;s go ✨
                  </motion.button>
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
        ) : showPhotoUpload ? (
          <motion.div
            key="photo-upload"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 w-full max-w-2xl"
          >
            {/* Floating Hearts Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {hearts.map((heart) => (
                <FloatingHeart
                  key={heart.id}
                  delay={heart.delay}
                  duration={heart.duration}
                  x={heart.x}
                  y={heart.y}
                />
              ))}
            </div>

            {/* Photo Upload Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative z-10 glass rounded-3xl p-8 md:p-12 w-full mx-auto shadow-2xl"
            >
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-2xl md:text-3xl font-semibold text-center mb-6 text-foreground gradient-text"
              >
                Upload a Photo 📸
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="text-center text-foreground-muted mb-8 text-sm md:text-base"
              >
                Upload your photo to complete our story
              </motion.p>

              {uploadedImage ? (
                // Both Images Preview
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="space-y-6"
                >
                  {/* Images Side by Side */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8">
                    {/* Boy Image (Fixed) */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-gradient-romantic rounded-full blur-xl opacity-50" />
                      <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-pink-300/50 shadow-2xl"
                        style={{
                          boxShadow: "0 0 30px rgba(236, 72, 153, 0.5)",
                        }}
                      >
                        <Image
                          src="/boy.png"
                          alt="You"
                          width={160}
                          height={160}
                          className="w-full h-full object-cover"
                          priority
                        />
                      </div>
                    </motion.div>

                    {/* Heart Icon */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
                      className="text-4xl md:text-5xl"
                    >
                      ❤️
                    </motion.div>

                    {/* Girl Image (Uploaded) */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.8, duration: 0.5 }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-gradient-romantic rounded-full blur-xl opacity-50" />
                      <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-pink-300/50 shadow-2xl"
                        style={{
                          boxShadow: "0 0 30px rgba(236, 72, 153, 0.5)",
                        }}
                      >
                        <img
                          src={uploadedImage}
                          alt="Her"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        onClick={() => {
                          setUploadedImage(null);
                          setGirlPhoto(null);
                          setError(null);
                          if (typeof window !== "undefined") {
                            localStorage.removeItem("girlPhoto");
                          }
                        }}
                        className="absolute -top-2 -right-2 bg-red-500/80 hover:bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs backdrop-blur-sm transition-colors"
                        aria-label="Remove image"
                      >
                        ✕
                      </motion.button>
                    </motion.div>
                  </div>

                  {/* Message */}
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1, duration: 0.6 }}
                    className="text-2xl md:text-3xl font-semibold text-center text-foreground gradient-text"
                  >
                    Now it&apos;s us ❤️
                  </motion.h2>
                </motion.div>
              ) : (
                // Upload Area
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`relative border-2 border-dashed rounded-2xl p-8 md:p-12 transition-all duration-300 ${
                    isDragging
                      ? "border-pink-400 bg-pink-500/10 shadow-[0_0_30px_rgba(236,72,153,0.5)]"
                      : "border-white/30 bg-white/5 hover:border-pink-300/50 hover:bg-pink-500/5 hover:shadow-[0_0_20px_rgba(236,72,153,0.2)]"
                  }`}
                >
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
                      className="text-6xl mb-4"
                    >
                      📷
                    </motion.div>
                    <p className="text-foreground mb-2 font-medium">
                      Drag and drop your photo here
                    </p>
                    <p className="text-foreground-muted text-sm mb-4">
                      or click to browse
                    </p>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleFileInput}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="inline-block px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-foreground font-medium cursor-pointer transition-colors"
                    >
                      Choose File
                    </label>
        </div>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}

              {/* Continue Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="flex justify-center mt-8"
              >
                <motion.button
                  onClick={handleContinue}
                  disabled={!uploadedImage}
                  whileHover={uploadedImage ? { scale: 1.05 } : {}}
                  whileTap={uploadedImage ? { scale: 0.95 } : {}}
                  className={`px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-all duration-300 w-full sm:w-auto min-w-[200px] ${
                    uploadedImage
                      ? "bg-gradient-romantic text-white hover:shadow-xl cursor-pointer"
                      : "bg-white/10 text-foreground-muted cursor-not-allowed"
                  }`}
                >
                  Continue
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : showCelebration ? (
          <motion.div
            key="celebration"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative z-10 w-full"
          >
            {/* Confetti Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {confettiParticles.map((particle) => (
                <ConfettiParticle
                  key={particle.id}
                  delay={particle.delay}
                  x={particle.x}
                  color={particle.color}
                />
              ))}
            </div>

            {/* Celebration Hearts */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {celebrationHearts.map((heart) => (
                <CelebrationHeart
                  key={heart.id}
                  delay={heart.delay}
                  x={heart.x}
                  emoji={heart.emoji}
                />
              ))}
            </div>

            {/* Celebration Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="relative z-10 glass rounded-3xl p-8 md:p-12 max-w-md w-full mx-auto shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.4, 
                  ease: [0.34, 1.56, 0.64, 1] // Bounce-like easing
                }}
                className="text-center mb-6"
              >
                <span className="text-6xl md:text-7xl">💕</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="text-2xl md:text-3xl font-semibold text-center mb-8 text-foreground"
              >
                You just made me the happiest person alive 💕
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex justify-center"
              >
                <motion.button
                  onClick={handleStartStory}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full bg-gradient-romantic text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow duration-300 w-full sm:w-auto min-w-[200px]"
                >
                  Let&apos;s start our story ✨
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="proposal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -50 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="relative z-10 w-full"
          >
            {/* Floating Hearts Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {hearts.map((heart) => (
                <FloatingHeart
                  key={heart.id}
                  delay={heart.delay}
                  duration={heart.duration}
                  x={heart.x}
                  y={heart.y}
                />
              ))}
            </div>

            {/* Proposal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative z-10 glass rounded-3xl p-8 md:p-12 max-w-md w-full mx-auto shadow-2xl"
            >
              <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="text-3xl md:text-4xl font-semibold text-center mb-8 text-foreground gradient-text"
              >
                Will you be my girlfriend? ❤️
              </motion.h1>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {/* Yes Button */}
                <motion.button
                  onClick={handleYesClick}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full bg-gradient-romantic text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow duration-300 w-full sm:w-auto min-w-[120px]"
                >
                  Yes
                </motion.button>

                {/* No Button */}
                <motion.button
                  onMouseEnter={handleNoHover}
                  onMouseLeave={() => setIsHoveringNo(false)}
                  onTouchStart={handleNoHover}
                  animate={isHoveringNo ? { x: noButtonPosition.x, y: noButtonPosition.y } : { x: 0, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-foreground font-semibold text-lg hover:bg-white/20 transition-colors duration-300 w-full sm:w-auto min-w-[120px] relative z-20 cursor-pointer"
                >
                  No
                </motion.button>
        </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

