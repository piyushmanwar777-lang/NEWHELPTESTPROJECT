# 💕 Valentine Love Story App

A romantic, interactive web application that generates personalized love stories with heart gesture detection using webcam.

## ✨ Features

- **Interactive Proposal Screen**: Beautiful Yes/No proposal interface
- **7-Question Story Generator**: Personalized romantic stories based on user preferences
- **Multi-Language Support**: Stories in English, Hindi (हिंदी), and Marathi (मराठी)
- **Text-to-Speech**: Listen to your story in the selected language
- **Webcam Heart Gesture Detection**: Use hand gestures to create hearts on screen
- **Cinematic Experience**: Beautiful animations and transitions

## 🚀 Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type-safe development
- **TensorFlow.js** - Hand pose detection for heart gestures
- **Google Gemini AI** - Story generation
- **Framer Motion** - Smooth animations
- **Tailwind CSS** - Styling

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Google Gemini API key (for story generation)

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/PiyushManwar07/TestProject.git
cd TestProject
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub** (if not already done):
```bash
git push -u origin main
```

2. **Sign up on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up with your GitHub account

3. **Import Project**:
   - Click "Add New Project"
   - Select your repository: `PiyushManwar07/TestProject`
   - Click "Import"

4. **Configure Environment Variables**:
   - In the "Environment Variables" section, add:
     - Name: `GEMINI_API_KEY`
     - Value: Your Gemini API key
   - Select all environments (Production, Preview, Development)
   - Click "Add"

5. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Deploy to Netlify

1. **Sign up on Netlify**:
   - Go to [netlify.com](https://www.netlify.com)
   - Sign up with your GitHub account

2. **Import Project**:
   - Click "Add new site" → "Import an existing project"
   - Select your GitHub repository

3. **Build Settings**:
   - Build command: `npm run build`
   - Publish directory: `.next`

4. **Environment Variables**:
   - Go to Site settings → Environment variables
   - Add `GEMINI_API_KEY` with your API key value

5. **Deploy**:
   - Click "Deploy site"
   - Your app will be live at `https://your-project.netlify.app`

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key for story generation | Yes |

**⚠️ Important**: Never commit `.env.local` to Git. It's already in `.gitignore`.

## 📱 Usage

1. **Start the App**: Click "Yes" on the proposal screen
2. **Answer Questions**: Fill out all 7 questions about your dream scenario
3. **Choose Language**: Select English, Hindi, or Marathi
4. **Generate Story**: Click "Create Our Story"
5. **Listen**: Use the play button to hear your story
6. **Experience**: Click "Experience with Heart Gesture" to use webcam features

## 🎯 Features in Detail

### Story Generation
- Generates personalized romantic stories based on 7 user inputs
- Supports multiple languages with proper script rendering
- Fallback story generation if API fails

### Heart Gesture Detection
- Uses TensorFlow.js for hand pose detection
- Detects heart gesture (two hands forming a heart)
- Displays animated hearts in sequence
- Particle effects for visual appeal

### Text-to-Speech
- Browser-based speech synthesis
- Supports multiple languages
- Play, pause, resume, and stop controls

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Google Gemini AI for story generation
- TensorFlow.js for hand detection
- Next.js team for the amazing framework

---

Made with ❤️ for love stories
