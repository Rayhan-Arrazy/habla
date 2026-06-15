"use client";

import { useState, useEffect } from "react";
import { PronunciationChecker } from "@/components/PronunciationChecker";
import { BookOpen, BookmarkPlus, BookmarkCheck, ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import Link from "next/link";

interface WordData {
  spanish: string;
  english: string;
  exampleSentenceEs: string;
  exampleSentenceEn: string;
}

export default function WordOfDayPage() {
  const [wordData, setWordData] = useState<WordData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function fetchWord() {
      try {
        const apiKey = localStorage.getItem("habla_api_key") || "";
        const level = localStorage.getItem("habla_level") || "A1";

        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "word_of_day", apiKey, level }),
        });
        
        const data = await res.json();
        
        if (res.ok) {
          setWordData(data);
        } else {
          if (data.error === "MISSING_API_KEY") {
            setErrorMsg("Please add your Gemini API Key on the dashboard to generate words.");
          } else {
            setErrorMsg("Failed to generate word.");
          }
        }
      } catch (e) {
        console.error(e);
        setErrorMsg("Network error.");
      } finally {
        setLoading(false);
      }
    }
    fetchWord();
  }, []);

  const handleSave = async () => {
    // In a real app, call API to save to database
    setIsSaved(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="p-4 flex items-center justify-between max-w-3xl mx-auto w-full">
        <Link href="/" className="flex items-center text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </Link>
        <div className="flex items-center gap-2 text-xl font-bold text-es-red-600">
          <BookOpen className="w-6 h-6" />
          Word of the Day
        </div>
        <div className="w-20"></div> {/* Spacer for center alignment */}
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4">
        {loading ? (
          <div className="flex flex-col items-center text-slate-500 animate-pulse">
            <Loader2 className="w-12 h-12 mb-4 animate-spin text-es-red-500" />
            <p>Generating today's word...</p>
          </div>
        ) : wordData ? (
          <div className="max-w-xl w-full animate-in fade-in zoom-in duration-500">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 relative">
              {/* Decorative background shape */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-es-red-500 rounded-bl-full opacity-10 blur-2xl pointer-events-none"></div>
              
              <div className="p-8 text-center relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-es-red-50 text-es-red-700 text-sm font-semibold mb-6">
                  <Sparkles className="w-4 h-4" /> AI Generated
                </div>
                
                <h1 className="text-5xl font-extrabold text-slate-900 mb-2 capitalize tracking-tight">
                  {wordData.spanish}
                </h1>
                <h2 className="text-2xl text-slate-500 font-medium mb-8">
                  {wordData.english}
                </h2>
                
                <div className="bg-slate-50 p-6 rounded-2xl text-left border border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Example Sentence</h3>
                  <p className="text-lg font-medium text-slate-800 mb-2">
                    {wordData.exampleSentenceEs}
                  </p>
                  <p className="text-slate-500 italic">
                    {wordData.exampleSentenceEn}
                  </p>
                </div>
              </div>
              
              <div className="bg-es-red-50 p-6 flex justify-between items-center border-t border-es-red-100">
                <button 
                  onClick={handleSave}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    isSaved 
                      ? "bg-green-500 text-white shadow-green-500/30" 
                      : "bg-es-red-600 text-white hover:bg-es-red-700 shadow-es-red-500/30"
                  } shadow-lg`}
                >
                  {isSaved ? (
                    <>
                      <BookmarkCheck className="w-5 h-5" /> Saved
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-5 h-5" /> Save Word
                    </>
                  )}
                </button>
              </div>
            </div>

            <PronunciationChecker targetWord={wordData.spanish} />
          </div>
        ) : (
          <div className="text-center">
            <p className="text-es-red-500 font-bold mb-4">{errorMsg || "Failed to load word of the day."}</p>
            {errorMsg && (
              <Link href="/">
                <button className="bg-slate-800 text-white px-6 py-2 rounded-lg hover:bg-slate-900">
                  Go to Settings
                </button>
              </Link>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
