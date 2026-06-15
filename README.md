# Habla - Learn Spanish with AI

Habla is a modern, AI-powered Spanish language learning application built with the latest web technologies.

## Features
- **Word of the Day**: Discover new Spanish words daily with AI-generated examples.
- **Smart Flashcards**: Spaced repetition review system with a beautiful 3D flip animation.
- **AI Quizzes**: Dynamically generated multiple-choice quizzes using OpenAI to test your knowledge.
- **Pronunciation Checker**: Practice your speaking with the built-in Web Speech API voice recognition.
- **Progress Tracking**: Visualize your XP and streaks with interactive charts (Recharts).
- **Authentication**: Secure login with Clerk.

## Tech Stack
- **Frontend**: Next.js 15 App Router, React, TypeScript
- **Styling**: Tailwind CSS v4, Lucide React Icons
- **Database & ORM**: PostgreSQL (Neon Serverless), Drizzle ORM
- **Auth**: Clerk
- **AI**: OpenAI API
- **Charts**: Recharts

## Getting Started

1. Set up your environment variables:
Fill out the `.env.local` file with your credentials from Clerk, Neon, and OpenAI.

2. Push the database schema:
```bash
npx drizzle-kit push
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment
This application is ready to be deployed on **Vercel**. 
Ensure you add the environment variables in your Vercel project settings before deploying.
