"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Brain, Sparkles, Trophy, Flame, Settings, Key, Globe } from "lucide-react";
import { ProgressChart } from "@/components/ProgressChart";

export default function Home() {
  const [apiKey, setApiKey] = useState("");
  const [level, setLevel] = useState("A1");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setApiKey(localStorage.getItem("habla_api_key") || "");
    setLevel(localStorage.getItem("habla_level") || "A1");
  }, []);

  const saveSettings = () => {
    localStorage.setItem("habla_api_key", apiKey);
    localStorage.setItem("habla_level", level);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      <header className="w-full p-4 flex justify-between items-center max-w-5xl mx-auto border-b border-slate-200">
        <div className="flex items-center gap-2 text-2xl font-bold text-es-red-600">
          <Sparkles className="w-8 h-8" />
          <span>Habla</span>
        </div>
        <nav className="flex items-center gap-4">
          <div className="flex items-center gap-2 mr-4 bg-orange-100 text-orange-600 px-3 py-1.5 rounded-full font-bold">
            <Flame className="w-5 h-5 fill-orange-500" /> 12 Day Streak
          </div>
          <div className="w-10 h-10 bg-es-red-500 rounded-full text-white flex items-center justify-center font-bold">
            U
          </div>
        </nav>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto p-4 flex flex-col items-center justify-center text-center">
        <div className="w-full text-left py-8 animate-in fade-in duration-500">
          <h1 className="text-3xl font-bold mb-8">Welcome back, Learner!</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Dashboard Widgets */}
            <Link href="/word-of-day" className="block group">
              <div className="p-6 bg-gradient-to-br from-es-red-500 to-es-yellow-600 rounded-2xl text-white shadow-md group-hover:shadow-lg transition-all h-full transform group-hover:-translate-y-1">
                <BookOpen className="w-8 h-8 mb-4 opacity-80" />
                <h2 className="text-2xl font-bold mb-2">Word of the Day</h2>
                <p className="text-es-red-100 mb-4 text-sm">Aprender nueva palabra hoy.</p>
                <div className="flex items-center text-xs font-bold bg-white/20 w-fit px-3 py-1.5 rounded-full backdrop-blur-sm">
                  Start <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
            
            <Link href="/explore" className="block group">
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm group-hover:border-es-red-300 group-hover:shadow-md transition-all h-full flex flex-col transform group-hover:-translate-y-1">
                <Globe className="w-8 h-8 mb-4 text-sky-500" />
                <h2 className="text-2xl font-bold mb-2 text-slate-800">Explore</h2>
                <p className="text-slate-500 mb-4 flex-1 text-sm">Discover new vocabulary.</p>
                <div className="flex items-center text-xs font-bold text-sky-600">
                  Explore Now <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/flashcards" className="block group">
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm group-hover:border-es-red-300 group-hover:shadow-md transition-all h-full flex flex-col transform group-hover:-translate-y-1">
                <Brain className="w-8 h-8 mb-4 text-es-red-500" />
                <h2 className="text-2xl font-bold mb-2 text-slate-800">Flashcards</h2>
                <p className="text-slate-500 mb-4 flex-1 text-sm">Review your saved words.</p>
                <div className="flex items-center text-xs font-bold text-es-red-600">
                  Review Now <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>

            <Link href="/quiz" className="block group">
              <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm group-hover:border-es-red-300 group-hover:shadow-md transition-all h-full flex flex-col transform group-hover:-translate-y-1">
                <Trophy className="w-8 h-8 mb-4 text-amber-500" />
                <h2 className="text-2xl font-bold mb-2 text-slate-800">Quiz Mode</h2>
                <p className="text-slate-500 mb-4 flex-1 text-sm">Test your knowledge.</p>
                <div className="flex items-center text-xs font-bold text-amber-600">
                  Start Quiz <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12">
            {/* Progress Section */}
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800">Your XP Progress</h3>
                <div className="bg-es-red-50 text-es-red-700 px-4 py-1.5 rounded-full font-bold text-sm">
                  This Week: +1,810 XP
                </div>
              </div>
              <ProgressChart />
            </div>

            {/* AI Settings Section */}
            <div className="bg-slate-100 p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
              <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Settings className="w-5 h-5 text-slate-500" />
                AI Configuration
              </h3>
              <p className="text-sm text-slate-500 mb-6">Connect your own Gemini Key to generate fresh, level-appropriate Spanish content daily.</p>
              
              <div className="flex-1 flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Globe className="w-4 h-4" /> Spanish Level
                  </label>
                  <select 
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full p-3 rounded-xl border-2 border-slate-200 focus:border-es-red-400 focus:outline-none"
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
                className={`mt-6 w-full py-3 rounded-xl font-bold transition-colors ${
                  isSaved ? "bg-green-500 text-white" : "bg-slate-800 hover:bg-slate-900 text-white"
                }`}
              >
                {isSaved ? "Saved!" : "Save Settings"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
