"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, BookOpen, Brain, Sparkles, Trophy, Flame, Settings, 
  Globe, Languages, BookA, Headphones, Mic, MessageCircle, Bot, User
} from "lucide-react";
import { ProgressChart } from "@/components/ProgressChart";

export default function Home() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [level, setLevel] = useState("A1");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setLevel(localStorage.getItem("habla_level") || "A1");
  }, []);

  const saveSettings = () => {
    localStorage.setItem("habla_level", level);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center pb-20">
      <header className="w-full p-4 flex justify-between items-center max-w-6xl mx-auto border-b border-slate-200">
        <div className="flex items-center gap-2 text-2xl font-bold text-es-red-600">
          <Sparkles className="w-8 h-8" />
          <span>Habla</span>
        </div>
        <nav className="flex items-center gap-4">
          {!isSignedIn && (
            <button 
              onClick={() => setIsSignedIn(true)}
              className="bg-es-red-600 text-white px-5 py-2 rounded-full font-medium hover:bg-es-red-700 transition-colors shadow-sm"
            >
              Sign In
            </button>
          )}
          {isSignedIn && (
            <>
              <div className="flex items-center gap-2 mr-4 bg-orange-100 text-orange-600 px-3 py-1.5 rounded-full font-bold">
                <Flame className="w-5 h-5 fill-orange-500" /> 12 Day Streak
              </div>
              <button onClick={() => setIsSignedIn(false)} className="w-10 h-10 bg-slate-200 hover:bg-slate-300 rounded-full flex items-center justify-center transition-colors">
                <User className="w-5 h-5 text-slate-600" />
              </button>
            </>
          )}
        </nav>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto p-4 flex flex-col items-center justify-center text-center">
        {!isSignedIn && (
          <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000 my-24 flex flex-col items-center">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-tight">
              Master Spanish with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-es-red-600 via-es-red-500 to-es-yellow-500 drop-shadow-sm">
                AI Power
              </span>
            </h1>
            <p className="text-2xl text-slate-500 md:leading-relaxed max-w-2xl font-medium">
              Elevate your language skills with real-world tests, intelligent pronunciation feedback, and a personalized AI tutor.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <button onClick={() => setIsSignedIn(true)} className="bg-gradient-to-r from-es-red-600 to-es-red-700 text-white px-10 py-5 rounded-full font-bold text-xl hover:scale-105 hover:shadow-2xl hover:shadow-es-red-500/40 transition-all flex items-center gap-3">
                Activate Account <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        )}

        {isSignedIn && (
          <div className="w-full text-left py-8 animate-in fade-in duration-500">
            <h1 className="text-4xl font-extrabold mb-10 text-slate-800 tracking-tight">Your Learning Hub</h1>
          
          {/* Section: Learn & Discover */}
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-700">
            <Globe className="text-es-red-500" /> Learn & Discover
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <DashboardCard href="/dictionary" icon={<BookA className="w-8 h-8 text-es-red-500" />} title="Dictionary" desc="Explore all Spanish words" color="text-es-red-600" />
            <DashboardCard href="/translator" icon={<Languages className="w-8 h-8 text-es-yellow-500" />} title="Translator" desc="Translate sentences instantly" color="text-es-yellow-600" />
            <DashboardCard href="/word-of-day" icon={<BookOpen className="w-8 h-8 text-es-red-500" />} title="Word of the Day" desc="Daily new vocabulary" color="text-es-red-600" />
            <DashboardCard href="/explore" icon={<Globe className="w-8 h-8 text-es-yellow-500" />} title="Explore" desc="Discover vocab by topic" color="text-es-yellow-600" />
          </div>

          {/* Section: Practice & Tests */}
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-700 mt-12">
            <Trophy className="text-es-yellow-500" /> Practice & Tests
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
            <DashboardCard href="/reading" icon={<BookOpen className="w-8 h-8 text-es-red-500" />} title="Reading" desc="Comprehension tests" color="text-es-red-600" />
            <DashboardCard href="/listening" icon={<Headphones className="w-8 h-8 text-es-yellow-500" />} title="Listening" desc="Audio & transcription" color="text-es-yellow-600" />
            <DashboardCard href="/speaking" icon={<Mic className="w-8 h-8 text-es-red-500" />} title="Speaking" desc="Pronunciation test" color="text-es-red-600" />
            <DashboardCard href="/quiz" icon={<Trophy className="w-8 h-8 text-es-yellow-500" />} title="Personal Quiz" desc="Custom grammar tests" color="text-es-yellow-600" />
            <DashboardCard href="/flashcards" icon={<Brain className="w-8 h-8 text-es-red-500" />} title="Flashcards" desc="Spaced repetition" color="text-es-red-600" />
          </div>

          {/* Section: AI Tutors */}
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-slate-700 mt-12">
            <Bot className="text-es-red-500" /> AI Tutors
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
            <DashboardCard href="/conversation" icon={<MessageCircle className="w-8 h-8 text-es-yellow-500" />} title="Talk with AI" desc="Practice real-life conversations" color="text-es-yellow-600" />
            <DashboardCard href="/assistant" icon={<Bot className="w-8 h-8 text-es-red-500" />} title="AI Assistant" desc="Personalized grammar & help" color="text-es-red-600" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-16">
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Your XP Progress</h3>
                <div className="bg-es-red-50 text-es-red-700 px-4 py-1.5 rounded-full font-bold text-sm">
                  This Week: +1,810 XP
                </div>
              </div>
              <ProgressChart />
            </div>

            <div className="bg-slate-100 p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-center">
              <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-500" />
                Difficulty Configuration
              </h3>
              <p className="text-sm text-slate-500 mb-6">Adjust your CEFR level to calibrate all tests, reading materials, and AI conversations.</p>
              
              <div className="flex-1 flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-1">
                    <Globe className="w-4 h-4" /> Spanish Level
                  </label>
                  <select 
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-es-red-400 focus:outline-none bg-white font-medium shadow-sm"
                  >
                    <option value="A1">A1 - Beginner</option>
                    <option value="A2">A2 - Elementary</option>
                    <option value="B1">B1 - Intermediate</option>
                    <option value="B2">B2 - Upper Intermediate</option>
                    <option value="C1">C1 - Advanced</option>
                    <option value="C2">C2 - Master</option>
                  </select>
                </div>
              </div>

              <button 
                onClick={saveSettings}
                className={`mt-6 w-full py-4 rounded-xl font-bold transition-all shadow-md ${
                  isSaved ? "bg-green-500 text-white shadow-green-500/20" : "bg-slate-800 hover:bg-slate-900 text-white"
                }`}
              >
                {isSaved ? "Saved!" : "Update Level"}
              </button>
            </div>
          </div>
        </div>
        )}
      </main>
    </div>
  );
}

function DashboardCard({ href, icon, title, desc, color }: { href: string, icon: React.ReactNode, title: string, desc: string, color: string }) {
  return (
    <Link href={href} className="block group">
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm group-hover:border-slate-300 group-hover:shadow-md transition-all h-full flex flex-col transform group-hover:-translate-y-1 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 rounded-bl-full -z-0 opacity-50 group-hover:scale-110 transition-transform"></div>
        <div className="relative z-10">
          <div className="mb-4">{icon}</div>
          <h2 className={`text-xl font-bold mb-1 text-slate-800 group-hover:${color} transition-colors`}>{title}</h2>
          <p className="text-slate-500 text-sm font-medium mb-4">{desc}</p>
          <div className={`flex items-center text-xs font-bold ${color} mt-auto`}>
            Open <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
