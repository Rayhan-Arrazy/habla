"use client";
import Link from "next/link";
import { ArrowLeft, Bot, Construction } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="p-4 flex items-center max-w-5xl mx-auto w-full border-b border-slate-200">
        <Link href="/" className="flex items-center text-slate-500 hover:text-slate-800 transition-colors mr-auto">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back to Hub
        </Link>
        <div className="flex items-center gap-2 text-xl font-bold text-violet-600">
          <Bot className="w-6 h-6" />
          AI Assistant
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 text-center">
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 max-w-lg w-full flex flex-col items-center">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
            <Construction className="w-12 h-12 text-slate-400" />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-4">AI Assistant Mode</h1>
          <p className="text-slate-500 mb-8">
            This module is currently being built! Soon, you will be able to practice and master your Spanish skills here using the Gemini AI.
          </p>
          <Link href="/">
            <button className="bg-slate-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-900 transition-colors shadow-lg">
              Return Home
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
