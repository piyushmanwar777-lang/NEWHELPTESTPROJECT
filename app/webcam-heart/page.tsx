'use client';

import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as handPoseDetection from '@tensorflow-models/hand-pose-detection';

interface Landmark {
  x: number;
  y: number;
  z: number;
}

interface Hand {
  landmarks: Landmark[];
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
}

export default function WebcamHeartPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const modelRef = useRef<any>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [heartVisible, setHeartVisible] = useState(false);
  const [story, setStory] = useState<string | null>(null);
  const [showStory, setShowStory] = useState(true);
  const particlesRef = useRef<Particle[]>([]);
  const heartPositionRef = useRef<{ x: number; y: number; scale: number } | null>(null);
  const displayedHeartPosRef = useRef<{ x: number; y: number; scale: number } | null>(null);
  const lastParticleSpawnRef = useRef<number>(0);
  const lastDebugLogRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const heartSequenceRef = useRef<Array<{ x: number; y: number; scale: number; visible: boolean; startTime: number }>>([]);
  const sequenceStartTimeRef = useRef<number | null>(null);

  // Load story from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedStory = localStorage.getItem('generatedStory');
      if (savedStory) {
        setStory(savedStory);
      }
    }
  }, []);

  // Initialize TensorFlow.js HandPose
  useEffect(() => {
    const initHandPose = async () => {
      try {
        console.log('Loading TensorFlow.js and HandPose model...');
        
        // Set the backend to WebGL (required for tfjs runtime)
        await tf.setBackend('webgl');
        await tf.ready();
        console.log('TensorFlow.js backend ready:', tf.getBackend());
        
        // Initialize the model using npm imports
        console.log('Initializing HandPose model...');
        
        // Use MediaPipeHands model (not MediaPipe!)
        const model = handPoseDetection.SupportedModels.MediaPipeHands;
        const detectorConfig: handPoseDetection.MediaPipeHandsTfjsModelConfig = {
          runtime: 'tfjs' as const,
          modelType: 'lite' as const, // Start with lite for faster loading
          maxHands: 2,
        };
        
        console.log('Using model:', model);
        console.log('Creating detector with config:', detectorConfig);
        const detector = await handPoseDetection.createDetector(model, detectorConfig);
        
        modelRef.current = detector;
        setIsDetecting(true);
        console.log('HandPose initialized successfully!');
      } catch (error: any) {
        console.error('Error initializing HandPose:', error);
        console.error('Error details:', {
          message: error?.message,
          stack: error?.stack,
          name: error?.name
        });
        
        // Try fallback with full model
        try {
          console.log('Trying fallback with full model...');
          // Ensure backend is set
          if (tf.getBackend() === null) {
            await tf.setBackend('webgl');
            await tf.ready();
          }
          const fallbackModel = handPoseDetection.SupportedModels.MediaPipeHands;
          const detector = await handPoseDetection.createDetector(fallbackModel, {
            runtime: 'tfjs',
            modelType: 'full',
            maxHands: 2,
          });
          modelRef.current = detector;
          setIsDetecting(true);
          console.log('HandPose initialized successfully with full model!');
        } catch (fallbackError: any) {
          console.error('Fallback also failed:', fallbackError);
          // Try one more time with MediaPipe runtime
          try {
            console.log('Trying with MediaPipe runtime (no tfjs)...');
            const fallbackModel2 = handPoseDetection.SupportedModels.MediaPipeHands;
            const detector = await handPoseDetection.createDetector(fallbackModel2, {
              runtime: 'mediapipe' as const,
              modelType: 'lite' as const,
              maxHands: 2,
            });
            modelRef.current = detector;
            setIsDetecting(true);
            console.log('HandPose initialized successfully with MediaPipe runtime!');
          } catch (finalError: any) {
            console.error('All initialization attempts failed:', finalError);
            setIsDetecting(false);
            alert(`Failed to load hand detection: ${error?.message || 'Unknown error'}. Please check the console for details.`);
          }
        }
      }
    };

    initHandPose();
  }, []);

  // Start camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Unable to access camera. Please allow camera permissions.');
      }
    };

    startCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);


  // Process video frames
  useEffect(() => {
    const processFrame = async () => {
      if (videoRef.current && modelRef.current && isDetecting && canvasRef.current) {
        // Check if video is ready
        if (videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
          animationFrameRef.current = requestAnimationFrame(processFrame);
          return;
        }

        try {
          // Use video element directly for hand detection
          if (!videoRef.current || !canvasRef.current) return;
          
          const video = videoRef.current;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          
          // Update canvas size to match video - ensure video has dimensions
          if (video.videoWidth > 0 && video.videoHeight > 0) {
            if (canvas.width !== video.videoWidth || 
                canvas.height !== video.videoHeight) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              console.log('Canvas size set to:', canvas.width, 'x', canvas.height);
            }
          } else {
            // Video not ready yet, skip this frame
            animationFrameRef.current = requestAnimationFrame(processFrame);
            return;
          }
          
          // Detect hands directly from video element (no need to draw to canvas first)
          const hands = await modelRef.current.estimateHands(video, {
            flipHorizontal: false
          });
          
          // Clear canvas for overlay drawing (transparent overlay - video is displayed by video element)
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Debug: log hand detection (throttled)
          const now = Date.now();
          if (now - lastDebugLogRef.current > 1000) { // Log once per second
            if (hands && hands.length > 0) {
              console.log(`Hands detected: ${hands.length}`);
            }
            lastDebugLogRef.current = now;
          }

          // Reset hearts if no hands or not exactly 2 hands
          if (!hands || hands.length !== 2) {
            // No hands or not 2 hands - reset sequence and hide all hearts immediately
            sequenceStartTimeRef.current = null;
            heartSequenceRef.current = [];
            setHeartVisible(false);
            heartPositionRef.current = null;
            displayedHeartPosRef.current = null;
            // Clear particles immediately
            particlesRef.current = [];
            // Explicitly clear canvas again to ensure hearts are removed
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Update particles (will be empty now) - this ensures canvas stays clear
            updateParticles(ctx, canvas.width, canvas.height);
            animationFrameRef.current = requestAnimationFrame(processFrame);
            return; // Exit early - don't draw any hearts, canvas is cleared
          }
          
          // Check for heart gesture (exactly 2 hands)
          if (hands && hands.length === 2) {
            // UNCONDITIONAL LOG to confirm we're here
            console.log('TWO HANDS DETECTED - entering gesture detection');
            frameCountRef.current++;
            
            // Initialize heart sequence if not already started (always when 2 hands detected)
            if (sequenceStartTimeRef.current === null) {
              const now = Date.now();
              sequenceStartTimeRef.current = now;
              
              // Define heart positions: top right, top left, bottom right, bottom left, center
              const padding = 150; // Distance from edges
              heartSequenceRef.current = [
                { x: canvas.width - padding, y: padding, scale: 1.0, visible: false, startTime: now + 0 },      // Top right
                { x: padding, y: padding, scale: 1.0, visible: false, startTime: now + 500 },                  // Top left
                { x: canvas.width - padding, y: canvas.height - padding, scale: 1.0, visible: false, startTime: now + 1000 }, // Bottom right
                { x: padding, y: canvas.height - padding, scale: 1.0, visible: false, startTime: now + 1500 }, // Bottom left
                { x: canvas.width / 2, y: canvas.height / 2, scale: 1.2, visible: false, startTime: now + 2000 } // Center (bigger)
              ];
              console.log('Starting heart sequence with 2 hands detected');
            }
            
            // Update and draw heart sequence (only when exactly 2 hands detected AND sequence is active)
            const currentTime = Date.now();
            if (sequenceStartTimeRef.current !== null && hands && hands.length === 2) {
              // Update visibility based on timing
              heartSequenceRef.current.forEach((heart) => {
                if (currentTime >= heart.startTime) {
                  heart.visible = true;
                }
              });
              
              // Draw all visible hearts in sequence (only if exactly 2 hands are still detected)
              if (hands && hands.length === 2) {
                heartSequenceRef.current.forEach((heart) => {
                  if (heart.visible) {
                    try {
                      drawHeart(ctx, heart.x, heart.y, heart.scale);
                    } catch (error) {
                      console.error('Error drawing sequence heart:', error);
                    }
                  }
                });
              }
              
              // Spawn particles for all visible hearts (only if exactly 2 hands are still detected)
              if (hands && hands.length === 2 && currentTime - lastParticleSpawnRef.current > 200) {
                heartSequenceRef.current.forEach((heart) => {
                  if (heart.visible) {
                    spawnParticles(heart.x, heart.y);
                  }
                });
                lastParticleSpawnRef.current = currentTime;
              }
            } else {
              // Ensure hearts are not drawn if sequence is not active or hands are not 2
              // Canvas is already cleared at the start of the frame
            }
            
            try {
              // Use keypoints directly from HandPose
              // HandPose returns keypoints in pixel coordinates
              // thumb_tip is at index 4, index_finger_tip is at index 8
              const hand1 = hands[0];
              const hand2 = hands[1];
              
              // Debug: Check keypoints structure (log every 30 frames to avoid spam)
              if (frameCountRef.current % 30 === 0) {
                const thumb1Kp = hand1.keypoints?.[4];
                const index1Kp = hand1.keypoints?.[8];
                // Log the actual keypoint object directly
                console.log('thumb1Kp object:', thumb1Kp);
                console.log('index1Kp object:', index1Kp);
                console.log('Hand structure:', {
                  hand1Keypoints: hand1.keypoints?.length,
                  hand2Keypoints: hand2.keypoints?.length,
                  thumb1Kp: thumb1Kp,
                  index1Kp: index1Kp,
                  thumb1KpType: typeof thumb1Kp,
                  thumb1KpX: thumb1Kp?.x,
                  thumb1KpY: thumb1Kp?.y,
                  index1KpX: index1Kp?.x,
                  index1KpY: index1Kp?.y,
                  thumb1KpKeys: thumb1Kp ? Object.keys(thumb1Kp) : null,
                  thumb1KpString: JSON.stringify(thumb1Kp),
                  // Try accessing as array
                  thumb1KpArray: Array.isArray(thumb1Kp),
                  thumb1Kp0: thumb1Kp?.[0],
                  thumb1Kp1: thumb1Kp?.[1],
                  // Check all properties
                  thumb1KpAllProps: thumb1Kp ? Object.getOwnPropertyNames(thumb1Kp) : null
                });
              }
              
              // Get thumb and index finger keypoints
              const thumb1Kp = hand1.keypoints?.[4];
              const index1Kp = hand1.keypoints?.[8];
              const thumb2Kp = hand2.keypoints?.[4];
              const index2Kp = hand2.keypoints?.[8];


            // Validate keypoints exist
            if (!thumb1Kp || !index1Kp || !thumb2Kp || !index2Kp) {
              // Skip this frame if keypoints are missing
              if (frameCountRef.current % 30 === 0) {
                console.log('Missing keypoints:', {
                  thumb1Kp: !!thumb1Kp,
                  index1Kp: !!index1Kp,
                  thumb2Kp: !!thumb2Kp,
                  index2Kp: !!index2Kp,
                  hand1Keypoints: hand1.keypoints?.length,
                  hand2Keypoints: hand2.keypoints?.length
                });
              }
            } else {
              if (frameCountRef.current % 30 === 0) {
                console.log('Keypoints found, extracting coordinates...');
              }
              // Extract coordinates directly from keypoints (HandPose returns x, y directly)
              let thumb1X = thumb1Kp?.x ?? NaN;
              let thumb1Y = thumb1Kp?.y ?? NaN;
              let index1X = index1Kp?.x ?? NaN;
              let index1Y = index1Kp?.y ?? NaN;
              let thumb2X = thumb2Kp?.x ?? NaN;
              let thumb2Y = thumb2Kp?.y ?? NaN;
              let index2X = index2Kp?.x ?? NaN;
              let index2Y = index2Kp?.y ?? NaN;

              // Debug: Log extracted coordinates (even if invalid)
              if (frameCountRef.current % 30 === 0) {
                console.log('Extracted coordinates:', {
                  thumb1X, thumb1Y, index1X, index1Y,
                  thumb2X, thumb2Y, index2X, index2Y,
                  allValid: !isNaN(thumb1X) && !isNaN(thumb1Y) && !isNaN(index1X) && !isNaN(index1Y) && 
                           !isNaN(thumb2X) && !isNaN(thumb2Y) && !isNaN(index2X) && !isNaN(index2Y)
                });
              }

              // Always draw heart (even if coordinates are invalid, draw at center for testing)
              const coordinatesValid = typeof thumb1X === 'number' && !isNaN(thumb1X) &&
                  typeof thumb1Y === 'number' && !isNaN(thumb1Y) &&
                  typeof index1X === 'number' && !isNaN(index1X) &&
                  typeof index1Y === 'number' && !isNaN(index1Y) &&
                  typeof thumb2X === 'number' && !isNaN(thumb2X) &&
                  typeof thumb2Y === 'number' && !isNaN(thumb2Y) &&
                  typeof index2X === 'number' && !isNaN(index2X) &&
                  typeof index2Y === 'number' && !isNaN(index2Y);
              
              if (!coordinatesValid) {
                // Coordinates are invalid - skip gesture detection but still allow sequence
                // Don't draw anything here, let the sequence handle it
              } else {
                if (frameCountRef.current % 30 === 0) {
                  console.log('Valid coordinates extracted:', {
                    thumb1X, thumb1Y, index1X, index1Y,
                    thumb2X, thumb2Y, index2X, index2Y
                  });
                }
                
                // Check if coordinates are normalized (0-1) - if max value is <= 1, they're normalized
                const maxCoord = Math.max(thumb1X, thumb1Y, index1X, index1Y, thumb2X, thumb2Y, index2X, index2Y);
                
                // Validate canvas dimensions
                if (canvas.width > 0 && canvas.height > 0) {
                  if (maxCoord <= 1.0 && maxCoord > 0) {
                    // Coordinates are normalized, convert to pixels
                    thumb1X *= canvas.width;
                    thumb1Y *= canvas.height;
                    index1X *= canvas.width;
                    index1Y *= canvas.height;
                    thumb2X *= canvas.width;
                    thumb2Y *= canvas.height;
                    index2X *= canvas.width;
                    index2Y *= canvas.height;
                  }

                  // Mirror x coordinates to match CSS-mirrored video
                  // Video is mirrored, canvas is not, so we mirror coordinates when drawing
                  const thumb1 = { x: canvas.width - thumb1X, y: thumb1Y };
                  const index1 = { x: canvas.width - index1X, y: index1Y };
                  const thumb2 = { x: canvas.width - thumb2X, y: thumb2Y };
                  const index2 = { x: canvas.width - index2X, y: index2Y };

                  // Calculate distances
                  const indexDiffX = index1.x - index2.x;
                  const indexDiffY = index1.y - index2.y;
                  const thumbDiffX = thumb1.x - thumb2.x;
                  const thumbDiffY = thumb1.y - thumb2.y;
                  
                  const distanceIndexFingers = Math.sqrt(
                    Math.pow(indexDiffX, 2) + Math.pow(indexDiffY, 2)
                  );
                  const distanceThumbs = Math.sqrt(
                    Math.pow(thumbDiffX, 2) + Math.pow(thumbDiffY, 2)
                  );

                  // Check if index fingers are above thumbs
                  const avgIndexY = (index1.y + index2.y) / 2;
                  const avgThumbY = (thumb1.y + thumb2.y) / 2;
                  const indexFingersAboveThumbs = avgIndexY < avgThumbY;

                  // Heart gesture thresholds - make them more lenient
                  const maxIndexDistance = canvas.width * 0.4; // Increased from 0.25
                  const maxThumbDistance = canvas.width * 0.5; // Increased from 0.3

                  // Debug logging (throttled)
                  if (now - lastDebugLogRef.current > 1000) {
                    console.log('Gesture check:', {
                      distanceIndexFingers: distanceIndexFingers.toFixed(1),
                      maxIndexDistance: maxIndexDistance.toFixed(1),
                      distanceThumbs: distanceThumbs.toFixed(1),
                      maxThumbDistance: maxThumbDistance.toFixed(1),
                      indexFingersAboveThumbs,
                      index1Y: index1.y.toFixed(1),
                      index2Y: index2.y.toFixed(1),
                      thumb1Y: thumb1.y.toFixed(1),
                      thumb2Y: thumb2.y.toFixed(1)
                    });
                  }

                   // Check gesture condition (for future use if needed)
                   const gestureDetected = distanceIndexFingers < maxIndexDistance && 
                                          distanceThumbs < maxThumbDistance && 
                                          indexFingersAboveThumbs;
                   
                   if (gestureDetected) {
                     console.log('HEART GESTURE DETECTED!');
                   }
                }
              }
            }
            } catch (error) {
              // Always log errors to see what's happening
              console.error('Error in gesture detection:', error);
              console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
            }
          }

          // Update and draw particles
          updateParticles(ctx, canvas.width, canvas.height);
          } catch (error) {
            console.error('Error processing frame:', error);
          }
        }
        animationFrameRef.current = requestAnimationFrame(processFrame);
      };

    if (isDetecting) {
      animationFrameRef.current = requestAnimationFrame(processFrame);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDetecting]);

  // Detect heart gesture from two hands
  function detectHeartGesture(hands: Hand[], canvasWidth: number, canvasHeight: number): { x: number; y: number; scale: number } | null {
    if (hands.length !== 2) return null;

    const hand1 = hands[0];
    const hand2 = hands[1];

    // Get key points: thumbs (4) and index fingers (8)
    const thumb1 = hand1.landmarks[4];
    const index1 = hand1.landmarks[8];
    const thumb2 = hand2.landmarks[4];
    const index2 = hand2.landmarks[8];

    // Validate keypoints exist
    if (!thumb1 || !index1 || !thumb2 || !index2) {
      if (Math.random() < 0.01) {
        console.log('Missing keypoints:', {
          thumb1: !!thumb1,
          index1: !!index1,
          thumb2: !!thumb2,
          index2: !!index2,
          hand1Landmarks: hand1.landmarks.length,
          hand2Landmarks: hand2.landmarks.length
        });
      }
      return null;
    }

    // Keypoints are already in pixel coordinates
    const thumb1X = thumb1.x;
    const thumb1Y = thumb1.y;
    const index1X = index1.x;
    const index1Y = index1.y;
    const thumb2X = thumb2.x;
    const thumb2Y = thumb2.y;
    const index2X = index2.x;
    const index2Y = index2.y;

    // Validate coordinates are numbers
    if (isNaN(thumb1X) || isNaN(thumb1Y) || isNaN(index1X) || isNaN(index1Y) ||
        isNaN(thumb2X) || isNaN(thumb2Y) || isNaN(index2X) || isNaN(index2Y)) {
      if (Math.random() < 0.01) {
        console.log('Invalid coordinates:', {
          thumb1: { x: thumb1X, y: thumb1Y },
          index1: { x: index1X, y: index1Y },
          thumb2: { x: thumb2X, y: thumb2Y },
          index2: { x: index2X, y: index2Y }
        });
      }
      return null;
    }

    // Check if thumbs and index fingers form a heart shape
    // Thumbs should be at the bottom, index fingers at the top, forming a V shape
    const distanceThumbIndex1 = Math.sqrt(
      Math.pow(thumb1X - index1X, 2) + Math.pow(thumb1Y - index1Y, 2)
    );
    const distanceThumbIndex2 = Math.sqrt(
      Math.pow(thumb2X - index2X, 2) + Math.pow(thumb2Y - index2Y, 2)
    );

    // Check if index fingers are close together (top of heart)
    const distanceIndexFingers = Math.sqrt(
      Math.pow(index1X - index2X, 2) + Math.pow(index1Y - index2Y, 2)
    );

    // Check if thumbs are close together (bottom of heart)
    const distanceThumbs = Math.sqrt(
      Math.pow(thumb1X - thumb2X, 2) + Math.pow(thumb1Y - thumb2Y, 2)
    );

    // Heart gesture: index fingers close at top, thumbs close at bottom
    // The distance between index fingers should be small, and thumbs should be below
    // Make thresholds more lenient (larger percentages)
    const maxIndexDistance = canvasWidth * 0.25; // 25% of canvas width (was 15%)
    const maxThumbDistance = canvasWidth * 0.3; // 30% of canvas width (was 20%)
    
    // Also check that index fingers are above thumbs (heart shape)
    const avgIndexY = (index1Y + index2Y) / 2;
    const avgThumbY = (thumb1Y + thumb2Y) / 2;
    const indexFingersAboveThumbs = avgIndexY < avgThumbY; // Y increases downward

    // Debug logging (only log occasionally to avoid spam)
    if (Math.random() < 0.01) { // Log 1% of frames
      console.log('Gesture check:', {
        distanceIndexFingers: distanceIndexFingers.toFixed(0),
        maxIndexDistance: maxIndexDistance.toFixed(0),
        distanceThumbs: distanceThumbs.toFixed(0),
        maxThumbDistance: maxThumbDistance.toFixed(0),
        indexFingersAboveThumbs,
        avgIndexY: avgIndexY.toFixed(0),
        avgThumbY: avgThumbY.toFixed(0)
      });
    }

    if (distanceIndexFingers < maxIndexDistance && 
        distanceThumbs < maxThumbDistance && 
        indexFingersAboveThumbs) {
      // Calculate center point between the two index fingers (top of heart)
      const centerX = (index1X + index2X) / 2;
      const centerY = (index1Y + index2Y) / 2;

      // Calculate scale based on distance between hands
      const handDistance = Math.sqrt(
        Math.pow((thumb1X + thumb2X) / 2 - centerX, 2) + 
        Math.pow((thumb1Y + thumb2Y) / 2 - centerY, 2)
      );
      const scale = Math.min(Math.max(handDistance / 200, 0.5), 2.0); // Scale between 0.5 and 2.0

      return { x: centerX, y: centerY, scale };
    }

    return null;
  }

  // Draw glowing heart
  function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
    // Make heart MUCH bigger and more visible for testing
    const baseSize = 200 * Math.max(scale, 1.0); // Minimum scale of 1.0, base size 200 (much larger)
    
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(baseSize / 100, baseSize / 100);

    // Create multiple glow layers for better effect (more opaque)
    for (let i = 3; i >= 0; i--) {
      const glowSize = 1 + i * 0.3;
      const alpha = 0.6 - i * 0.15; // Increased opacity
      
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = 30 + i * 15; // Increased shadow
      ctx.shadowColor = `rgba(255, ${20 + i * 20}, ${147 + i * 20}, ${alpha})`;
      
      // Draw heart shape
      ctx.beginPath();
      ctx.moveTo(0, 20);
      // Left curve
      ctx.bezierCurveTo(-20, -10, -50, -10, -50, 20);
      ctx.bezierCurveTo(-50, 35, -25, 50, 0, 70);
      // Right curve
      ctx.bezierCurveTo(25, 50, 50, 35, 50, 20);
      ctx.bezierCurveTo(50, -10, 20, -10, 0, 20);
      ctx.closePath();
      
      ctx.fillStyle = `rgba(255, ${105 + i * 10}, ${180 + i * 10}, ${1.0 - i * 0.15})`; // More opaque
      ctx.fill();
    }

    // Main heart with gradient (fully opaque)
    ctx.globalAlpha = 1.0;
    const gradient = ctx.createRadialGradient(0, 20, 0, 0, 20, 50);
    gradient.addColorStop(0, 'rgba(255, 20, 147, 1)');
    gradient.addColorStop(0.5, 'rgba(255, 105, 180, 0.9)');
    gradient.addColorStop(1, 'rgba(255, 182, 193, 0.7)');
    
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.bezierCurveTo(-20, -10, -50, -10, -50, 20);
    ctx.bezierCurveTo(-50, 35, -25, 50, 0, 70);
    ctx.bezierCurveTo(25, 50, 50, 35, 50, 20);
    ctx.bezierCurveTo(50, -10, 20, -10, 0, 20);
    ctx.closePath();
    
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // White highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.ellipse(-15, 5, 8, 12, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(15, 5, 8, 12, 0.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Spawn particles
  function spawnParticles(x: number, y: number) {
    for (let i = 0; i < 3; i++) {
      particlesRef.current.push({
        x: x + (Math.random() - 0.5) * 50,
        y: y + (Math.random() - 0.5) * 50,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2 - 1,
        size: Math.random() * 4 + 2,
        life: 1.0,
        maxLife: 1.0
      });
    }
  }

  // Update and draw particles
  function updateParticles(ctx: CanvasRenderingContext2D, width: number, height: number) {
    const particles = particlesRef.current;
    
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      
      // Update position
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05; // Gravity
      p.life -= 0.02;

      // Remove dead particles
      if (p.life <= 0 || p.x < 0 || p.x > width || p.y > height) {
        particles.splice(i, 1);
        continue;
      }

      // Draw particle
      const alpha = p.life;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgba(255, ${105 + Math.random() * 50}, ${180 + Math.random() * 50}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  return (
    <div className="fixed inset-0 bg-black overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
        style={{ zIndex: 1 }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ 
          zIndex: 1000,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
          mixBlendMode: 'normal'
        }}
      />
      
      {/* Story Display Overlay */}
      {story && showStory && (
        <div 
          className="absolute top-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-black/80 backdrop-blur-md rounded-2xl p-6 border border-pink-500/30 shadow-2xl z-[2000] max-h-[80vh] overflow-y-auto"
          style={{ 
            background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
          }}
        >
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <span>💕</span> Your Love Story
            </h2>
            <button
              onClick={() => setShowStory(false)}
              className="text-white/70 hover:text-white text-2xl leading-none transition-colors"
              aria-label="Close story"
            >
              ×
            </button>
          </div>
          <div className="text-white/90 leading-relaxed text-sm md:text-base space-y-4">
            {story.split('\n\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className="mb-3">
                  {paragraph.trim()}
                </p>
              )
            ))}
          </div>
        </div>
      )}

      {/* Toggle Story Button (when hidden) */}
      {story && !showStory && (
        <button
          onClick={() => setShowStory(true)}
          className="absolute top-4 right-4 bg-pink-500/80 hover:bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium z-[2000] backdrop-blur-sm transition-all"
        >
          Show Story 💕
        </button>
      )}

      {!isDetecting && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 text-white text-xl z-50">
          <div className="text-center max-w-md px-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="mb-2">Loading Hand Detection...</p>
            <p className="text-sm text-gray-300">Initializing TensorFlow.js and HandPose model...</p>
            <p className="text-xs text-gray-400 mt-4">This may take a few moments on first load.</p>
          </div>
        </div>
      )}
    </div>
  );
}

